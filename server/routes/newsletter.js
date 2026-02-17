const express = require('express');
const { body, validationResult } = require('express-validator');
const Newsletter = require('../models/Newsletter');
const { sendNewsletterConfirmation } = require('../config/email');
const { checkRateLimit, getClientIp } = require('../utils/captcha');

const router = express.Router();

/**
 * POST /api/newsletter/subscribe
 * Subscribe email to newsletter (with rate limiting)
 */
router.post('/subscribe', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const clientIp = getClientIp(req);
        
        // Check rate limit
        const rateLimit = checkRateLimit(clientIp, 'newsletter');
        if (!rateLimit.allowed) {
            console.warn(`⚠️ Newsletter subscription rate limit exceeded for IP ${clientIp}`);
            return res.status(429).json({
                success: false,
                message: rateLimit.message
            });
        }
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email } = req.body;

        // Subscribe to newsletter
        const subscription = await Newsletter.subscribe(email);

        // Send confirmation email
        try {
            await sendNewsletterConfirmation(email);
        } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
            // Continue - subscription is saved
        }

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing! Check your email for confirmation.'
        });
    } catch (error) {
        if (error.message.includes('already subscribed')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        console.error('Error subscribing to newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Error subscribing to newsletter. Please try again later.'
        });
    }
});

/**
 * POST /api/newsletter/unsubscribe
 * Unsubscribe email from newsletter (with rate limiting)
 */
router.post('/unsubscribe', [
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const clientIp = getClientIp(req);
        
        // Check rate limit
        const rateLimit = checkRateLimit(clientIp, 'newsletter');
        if (!rateLimit.allowed) {
            console.warn(`⚠️ Newsletter unsubscribe rate limit exceeded for IP ${clientIp}`);
            return res.status(429).json({
                success: false,
                message: rateLimit.message
            });
        }
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { email } = req.body;
        const result = await Newsletter.unsubscribe(email);

        res.json({
            success: true,
            message: 'You have been unsubscribed from our newsletter.'
        });
    } catch (error) {
        console.error('Error unsubscribing from newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing unsubscribe. Please try again later.'
        });
    }
});

module.exports = router;
