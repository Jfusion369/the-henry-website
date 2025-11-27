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

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: { action: 'SAMEORIGIN' },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
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
app.use(express.static(path.join(__dirname, '../')));

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
