const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../config/email');

const router = express.Router();

/**
 * POST /api/contact
 * Submit a new contact form
 */
router.post('/contact', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
    try {
        console.log('📝 Contact form submission received');
        console.log('Data:', req.body);
        
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.warn('❌ Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        console.log('✅ Validation passed, saving to database...');
        
        // Create contact in database
        const contact = await Contact.create(req.body);
        console.log('✅ Contact saved:', contact.id);

        // Send notification emails
        try {
            console.log('📧 Sending notification emails...');
            await sendContactNotification(req.body);
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
