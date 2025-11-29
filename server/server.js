require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const bodyParser = require('body-parser');

// Import routes
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - ORDER MATTERS!
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: { action: 'SAMEORIGIN' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

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

// API Routes
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
    console.error('Server error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 The Henry Backend Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'not configured'}`);
    console.log(`💾 Database: ${process.env.DATABASE_URL || './data/contacts.db'}`);
});
