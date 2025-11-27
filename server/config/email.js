const nodemailer = require('nodemailer');

// Create transporter based on environment
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email service not configured properly:', error);
    } else {
        console.log('Email service ready');
    }
});

/**
 * Send contact form notification email
 * @param {Object} contactData - Contact form data
 */
async function sendContactNotification(contactData) {
    try {
        // Email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Form Submission: ${contactData.subject || 'No Subject'}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${contactData.name}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${contactData.subject || 'No subject'}</p>
                <p><strong>Message:</strong></p>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Received at: ${new Date().toLocaleString()}</small></p>
            `
        });

        // Confirmation email to user
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: contactData.email,
            subject: 'We received your message - The Henry LLC',
            html: `
                <h2>Thank you for contacting us!</h2>
                <p>Hi ${contactData.name},</p>
                <p>We have received your message and will get back to you shortly.</p>
                <p><strong>Your message:</strong></p>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Best regards,<br>The Henry LLC Team</p>
            `
        });

        return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

/**
 * Send newsletter subscription confirmation
 * @param {string} email - Subscriber email
 */
async function sendNewsletterConfirmation(email) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to The Henry LLC Newsletter',
            html: `
                <h2>Welcome to our newsletter!</h2>
                <p>Thank you for subscribing to The Henry LLC newsletter.</p>
                <p>We'll keep you updated on events, new businesses, and community news from Henry County, Kentucky.</p>
                <hr>
                <p>The Henry LLC Team</p>
            `
        });

        return { success: true, message: 'Confirmation email sent' };
    } catch (error) {
        console.error('Error sending newsletter confirmation:', error);
        throw error;
    }
}

module.exports = {
    transporter,
    sendContactNotification,
    sendNewsletterConfirmation
};
