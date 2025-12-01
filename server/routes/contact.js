const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../config/email');
const { generateCaptcha, verifyCaptcha, isCaptchaVerified, checkRateLimit, getClientIp } = require('../utils/captcha');

const router = express.Router();

/**
 * GET /api/captcha/generate
 * Generate a new captcha challenge
 */
router.get('/captcha/generate', (req, res) => {
    try {
        const clientIp = getClientIp(req);
        
        // Check rate limit for captcha requests
        const rateLimit = checkRateLimit(clientIp, 'captcha');
        if (!rateLimit.allowed) {
            console.warn(`⚠️ Rate limit exceeded for IP ${clientIp}`);
            return res.status(429).json({
                success: false,
                message: rateLimit.message
            });
        }
        
        const captcha = generateCaptcha();
        console.log(`🔐 Captcha generated for IP ${clientIp}`);
        
        res.json({
            success: true,
            captchaId: captcha.captchaId,
            question: captcha.question,
            hint: captcha.hint
        });
    } catch (error) {
        console.error('❌ Error generating captcha:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating captcha'
        });
    }
});

/**
 * POST /api/captcha/verify
 * Verify a captcha answer
 */
router.post('/captcha/verify', [
    body('captchaId').notEmpty().withMessage('Captcha ID is required'),
    body('answer').notEmpty().withMessage('Answer is required')
], (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        
        const { captchaId, answer } = req.body;
        const result = verifyCaptcha(captchaId, answer);
        
        res.json({
            success: result.success,
            message: result.message,
            verified: result.verified,
            attemptsRemaining: result.attemptsRemaining
        });
    } catch (error) {
        console.error('❌ Error verifying captcha:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying captcha'
        });
    }
});

/**
 * POST /api/contact
 * Submit a new contact form (requires verified captcha)
 */
router.post('/contact', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    body('captchaId').notEmpty().withMessage('Captcha ID is required')
], async (req, res) => {
    try {
        const clientIp = getClientIp(req);
        console.log(`📝 Contact form submission received from IP ${clientIp}`);
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.warn('❌ Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }
        
        // Check rate limit
        const rateLimit = checkRateLimit(clientIp, 'contact');
        if (!rateLimit.allowed) {
            console.warn(`⚠️ Contact submission rate limit exceeded for IP ${clientIp}`);
            return res.status(429).json({
                success: false,
                message: rateLimit.message
            });
        }
        
        // Verify captcha before processing
        const { captchaId } = req.body;
        if (!isCaptchaVerified(captchaId)) {
            console.warn(`⚠️ Captcha not verified for submission: ${captchaId}`);
            return res.status(400).json({
                success: false,
                message: 'Please complete and verify the captcha first'
            });
        }

        console.log('✅ Captcha verified, proceeding with contact submission...');
        
        // Remove captchaId from contact record before saving
        const contactData = { ...req.body };
        delete contactData.captchaId;
        
        // Create contact in database
        const contact = await Contact.create(contactData);
        console.log(`✅ Contact saved: ${contact.id} from IP ${clientIp}`);

        // Send notification emails
        try {
            console.log('📧 Sending notification emails...');
            await sendContactNotification(contactData);
            console.log('✅ Emails sent successfully');
        } catch (emailError) {
            console.error('⚠️ Failed to send notification emails:', emailError.message);
            // Continue even if email fails - contact is still saved
        }

        console.log('✅ Contact form submission complete');
        res.status(201).json({
            success: true,
            message: 'Thank you for your message! We will get back to you shortly.',
            contactId: contact.id
        });
    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting contact form. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/contact/:id
 * Get contact by ID (admin only)
 */
router.get('/contact/:id', (req, res) => {
    // This is a placeholder - implement authentication before using in production
    try {
        Contact.getById(req.params.id)
            .then(contact => {
                if (!contact) {
                    return res.status(404).json({ success: false, message: 'Contact not found' });
                }
                res.json({ success: true, data: contact });
            })
            .catch(error => {
                res.status(500).json({ success: false, message: error.message });
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
