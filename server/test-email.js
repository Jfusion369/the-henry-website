require('dotenv').config();
const { sendContactNotification } = require('./config/email');

// Test email
const testData = {
    name: 'Test User',
    email: 'jfusion369@gmail.com',
    phone: '(502) 845-2847',
    subject: 'Test Contact',
    message: 'This is a test message to verify email configuration is working properly.'
};

console.log('Testing email service with configuration:');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('---');

sendContactNotification(testData)
    .then(result => {
        console.log('✅ Email test successful!', result);
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Email test failed:', error.message);
        process.exit(1);
    });
