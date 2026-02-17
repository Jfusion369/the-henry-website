/**
 * Authentication Middleware
 * Protects admin endpoints with JWT token verification
 */

const jwt = require('jsonwebtoken');
const { getRedisClient } = require('../config/redis');

// Enforce JWT secret - MUST be set in production
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ CRITICAL: JWT_SECRET environment variable not set!');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
  console.warn('⚠️ WARNING: Using default secret in development only!');
}

/**
 * Verify JWT token in Authorization header
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing'
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user info to request
        req.user = decoded;
        console.log(`✅ Token verified for user: ${decoded.username}`);
        
        next();
    } catch (error) {
        console.warn(`❌ Token verification failed: ${error.message}`);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

/**
 * Optional token verification (doesn't fail if missing)
 * Used for features that work with or without auth
 */
function verifyTokenOptional(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        
        if (authHeader) {
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
}

module.exports = {
    verifyToken,
    verifyTokenOptional,
    JWT_SECRET
};
