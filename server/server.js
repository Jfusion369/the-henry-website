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
    // Ensure X-Content-Type-Options is always set
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // API endpoints: no caching
    if (req.path.startsWith('/api')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    } 
    // Static assets: cache for 1 year
    else if (req.path.match(/\.(js|css|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } 
    // HTML and everything else: 1 hour cache with revalidation
    else {
        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    next();
});

app.use(cors({
    origin: ['http://localhost', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files - serve the frontend
app.use(express.static(path.join(__dirname, '../'), {
    setHeaders: (res, filepath) => {
        // Ensure headers are set for static files too
        res.setHeader('X-Content-Type-Options', 'nosniff');
        if (filepath.match(/\.(js|css|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg)$/i)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
        }
    }
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'The Henry LLC backend is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);

// API documentation
app.get('/api', (req, res) => {
    res.json({
        message: 'The Henry LLC Backend API',
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
    console.log(`🚀 The Henry LLC Backend Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_SERVICE || 'not configured'}`);
    console.log(`💾 Database: ${process.env.DATABASE_URL || './data/contacts.db'}`);
});
