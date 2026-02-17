require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import Redis configuration
const { initRedis, closeRedis } = require('./config/redis');

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');

// Import middleware
const { accessibilityHeaders, htmlAccessibilityHeaders, accessibilityAudit } = require('./middleware/accessibility');
const { configureImageHeaders, imageEndpoint } = require('./middleware/imageOptimization');

// Validate required environment variables
const requiredEnvVars = ['ADMIN_USERNAME', 'HASHED_ADMIN_PASSWORD', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ FATAL: Missing required environment variables:', missingEnvVars);
    process.exit(1);
  } else {
    console.warn('⚠️ WARNING: Missing environment variables:', missingEnvVars);
  }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// HTTPS Redirect Middleware (for production)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Handle reverse proxy X-Forwarded-Proto header (Heroku, AWS, etc.)
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Request Logging Middleware (morgan)
app.use(morgan('combined', {
  skip: (req, res) => {
    // Skip logging for health checks and static files
    return req.path === '/api/health' || req.path.match(/\.(js|css|png|jpg|gif|svg|woff|woff2)$/i);
  }
}));

// Global API Rate Limiting (additional to per-endpoint limits)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req, res) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

// Apply global rate limiter to all /api routes
app.use('/api/', apiLimiter);

// Middleware - ORDER MATTERS!
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"]
        }
    },
    frameguard: { action: 'SAMEORIGIN' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    permissionsPolicy: {
        geolocation: [],
        microphone: [],
        camera: [],
        usb: [],
        magnetometer: []
    }
}));

// Apply accessibility middleware
app.use(accessibilityHeaders);
app.use(htmlAccessibilityHeaders);

// Additional security headers
app.use((req, res, next) => {
    // HSTS: Force HTTPS for 1 year including subdomains
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent XSS attacks
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent cross-domain policies
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    next();
});

// Cache and security headers MUST come before everything
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    
    // Always set X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // API endpoints: no caching
    if (req.path.startsWith('/api')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    } 
    // Static assets (js, css, fonts, images): cache for 1 year with strong etag
    else if (req.path.match(/\.(js|css|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg|ico)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } 
    // HTML files: 1 day cache with revalidation via ETag
    else if (req.path.match(/\.html$/i) || req.path === '/' || !req.path.includes('.')) {
        res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    }
    // Default: 1 hour cache
    else {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    next();
});

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all localhost origins in development
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return callback(null, true);
        }
        
        // Allow the production domain when deployed
        if (origin === 'https://thehenryllc.com' || origin === 'https://www.thehenryllc.com') {
            return callback(null, true);
        }
        
        // Deny everything else
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files - serve the frontend with proper headers
app.use(express.static(path.join(__dirname, '../'), {
    etag: true,
    lastModified: true,
    setHeaders: (res, filepath) => {
        // Always set X-Content-Type-Options
        res.setHeader('X-Content-Type-Options', 'nosniff');
        
        // Cache strategies per file type
        if (filepath.match(/\.(js|css|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg|ico)$/i)) {
            // Long-term cache for assets
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // HTML and other files: 1 day with revalidation
            res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
        }
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'The Henry backend is running',
        timestamp: new Date().toISOString()
    });
});

// Accessibility audit endpoint
app.get('/api/accessibility/audit', accessibilityAudit);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// API documentation
app.get('/api', (req, res) => {
    res.json({
        message: 'The Henry Backend API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /api/health',
            contact: 'POST /api/contact',
            newsletter: {
                subscribe: 'POST /api/newsletter/subscribe',
                unsubscribe: 'POST /api/newsletter/unsubscribe'
            }
        },
        documentation: 'See README.md for full documentation'
    });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('⚠️ Server error:', err.message || err);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// Start server with proper error handling
const server = app.listen(PORT, async () => {
    try {
        // Initialize Redis connection
        await initRedis();
        
        console.log(`🚀 The Henry Backend Server running on http://localhost:${PORT}`);
        console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'not configured'}`);
        console.log(`💾 Database: ${process.env.DATABASE_URL || './data/contacts.db'}`);
        console.log(`🔐 Security: Redis-based rate limiting and session management enabled`);
        console.log('✅ Server ready to accept connections');
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        // Don't exit - let the server continue
    }
});

// Handle uncaught exceptions - log but keep running
process.on('uncaughtException', (error) => {
    if (!error.message?.includes('ClientClosedError') && !error.message?.includes('EAUTH')) {
        console.error('⚠️ Uncaught Exception:', error.message);
    }
});

// Handle unhandled promise rejections - log but don't crash
process.on('unhandledRejection', (reason, promise) => {
    if (reason.code !== 'ECONNREFUSED' && !reason.message?.includes('ClientClosedError')) {
        console.error('⚠️ Unhandled Rejection:', reason.message || reason);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n📴 Shutting down gracefully...');
    try {
        server.close(async () => {
            try {
                await closeRedis();
            } catch (err) {
                // Ignore Redis close errors
            }
            console.log('✅ Server closed');
            process.exit(0);
        });
        // Force exit after 5 seconds if shutdown takes too long
        setTimeout(() => {
            console.log('⚠️ Force closing...');
            process.exit(0);
        }, 5000);
    } catch (err) {
        console.error('Error during shutdown:', err.message);
        process.exit(1);
    }
});
