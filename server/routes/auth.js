const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { JWT_SECRET } = require('../middleware/auth');
const { getRedisClient } = require('../config/redis');

const router = express.Router();

// Security configuration
const LOCKOUT_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION: 30 * 60, // 30 minutes in seconds
  ATTEMPT_WINDOW: 15 * 60 // 15 minutes in seconds
};

/**
 * POST /api/auth/login
 * Admin login endpoint with account lockout protection
 */
router.post('/login', [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, password } = req.body;
        const redis = getRedisClient();
        
        // If Redis is not available, continue without lockout protection
        if (redis && redis.existsAsync) {
            try {
                // Check if account is locked
                const lockoutKey = `lockout:${username}`;
                const isLocked = await redis.existsAsync(lockoutKey);
                
                if (isLocked) {
                    const ttl = await redis.ttlAsync(lockoutKey);
                    console.warn(`🔒 Account locked for username: ${username} (${ttl}s remaining)`);
                    return res.status(429).json({
                        success: false,
                        message: `Account temporarily locked. Try again in ${Math.ceil(ttl / 60)} minutes.`,
                        retryAfter: ttl
                    });
                }
            } catch (redisErr) {
                console.warn('⚠️ Redis unavailable for lockout check:', redisErr.message);
                // Continue without lockout protection
            }
        }

        // Get stored credentials
        const validUsername = process.env.ADMIN_USERNAME;
        const hashedPassword = process.env.HASHED_ADMIN_PASSWORD;

        // Validate environment variables are set
        if (!validUsername || !hashedPassword) {
            console.error('❌ Admin credentials not configured in environment');
            return res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
        }

        // Check username match
        if (username !== validUsername) {
            await recordFailedAttempt(redis, username);
            console.warn(`⚠️ Failed login attempt for username: ${username}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Verify password with bcrypt (constant-time comparison)
        let passwordMatch = false;
        try {
            passwordMatch = await bcrypt.compare(password, hashedPassword);
        } catch (bcryptError) {
            console.error('❌ Bcrypt error:', bcryptError.message);
            return res.status(500).json({
                success: false,
                message: 'Server error during authentication'
            });
        }

        if (!passwordMatch) {
            await recordFailedAttempt(redis, username);
            console.warn(`⚠️ Failed login attempt for username: ${username}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // Clear failed attempts on successful login
        await redis.delAsync(`attempts:${username}`);

        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign(
            { username, role: 'admin', iat: Math.floor(Date.now() / 1000) },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`✅ Admin login successful for user: ${username}`);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            expiresIn: 86400, // 24 hours in seconds
            tokenType: 'Bearer'
        });
    } catch (error) {
        console.error('❌ Error during login:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
});

/**
 * Record failed login attempt and implement lockout if threshold exceeded
 * @param {Object} redis - Redis client
 * @param {string} username - Username that failed
 */
async function recordFailedAttempt(redis, username) {
    if (!redis || !redis.incrAsync) {
        // Redis not available, skip recording
        return;
    }

    const attemptsKey = `attempts:${username}`;
    
    try {
        // Get current attempt count
        const attempts = await redis.incrAsync(attemptsKey);
        
        // Set expiry on first attempt
        if (attempts === 1) {
            await redis.setexAsync(attemptsKey, LOCKOUT_CONFIG.ATTEMPT_WINDOW, '1');
        }

        // Lock account if max attempts exceeded
        if (attempts >= LOCKOUT_CONFIG.MAX_ATTEMPTS) {
            const lockoutKey = `lockout:${username}`;
            await redis.setexAsync(lockoutKey, LOCKOUT_CONFIG.LOCKOUT_DURATION, 'locked');
            console.warn(`🔒 Account locked after ${attempts} failed attempts: ${username}`);
        }
    } catch (error) {
        console.warn('⚠️ Error recording failed attempt:', error.message);
    }
}

/**
 * POST /api/auth/verify
 * Verify JWT token validity
 */
router.post('/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(400).json({
                success: false,
                message: 'Authorization header missing'
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        const decoded = jwt.verify(token, JWT_SECRET);

        res.json({
            success: true,
            message: 'Token is valid',
            user: decoded,
            expiresIn: decoded.exp - Math.floor(Date.now() / 1000)
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        res.status(403).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (optional - for token revocation)
 */
router.post('/logout', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (authHeader) {
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            // Optionally blacklist token in Redis
            const decoded = jwt.verify(token, JWT_SECRET);
            const redis = getRedisClient();
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            
            if (ttl > 0) {
                await redis.setexAsync(`blacklist:${token}`, ttl, 'revoked');
            }
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    }
});

module.exports = router;
