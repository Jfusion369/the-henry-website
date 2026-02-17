# Email Configuration Guide

This guide shows how to configure email for different providers.

## Gmail (Recommended for Testing)

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com
2. Select "Security" from left menu
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device type)
3. Google will generate a 16-character password
4. Copy this password

### Step 3: Configure .env
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=your-email@gmail.com
```

## Outlook/Hotmail

```
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=your-email@outlook.com
```

## Yahoo Mail

```
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=your-email@yahoo.com
```

**Note**: Yahoo also requires an App Password. See: https://help.yahoo.com/kb/generate-manage-third-party-passwords-sln15241.html

## Custom SMTP Server

For self-hosted or business email servers:

```
EMAIL_SERVICE=custom-smtp
SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=admin@example.com
```

Then update `server/config/email.js`:

```javascript
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
```

## SendGrid

For production use (highly recommended):

```
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=admin@thehenryllc.com
```

Install SendGrid package:
```bash
npm install @sendgrid/mail
```

Update `server/config/email.js`:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendContactNotification(contactData) {
    try {
        await sgMail.send({
            to: process.env.ADMIN_EMAIL,
            from: process.env.EMAIL_FROM,
            subject: `New Contact Form Submission: ${contactData.subject || 'No Subject'}`,
            html: `...your email template...`
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
```

## Mailgun

Production-ready email service:

```
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=key-xxxxxxxxxxxx
MAILGUN_DOMAIN=sandbox.mailgun.org
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=admin@thehenryllc.com
```

Install Mailgun package:
```bash
npm install mailgun.js
```

## Testing Email Configuration

### Using mailtrap.io (Development)

1. Create account at: https://mailtrap.io
2. Create an inbox
3. Copy SMTP credentials

```
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=465
EMAIL_USER=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=admin@thehenryllc.com
```

## Troubleshooting Email Issues

### "Invalid login credentials"
- Verify your email and password are correct
- For Gmail, ensure you're using the App Password, not your Gmail password
- For other services, check if 2FA is enabled

### "Cannot find module '@sendgrid/mail'"
- Install the package: `npm install @sendgrid/mail`

### Emails not arriving
1. Check spam/junk folder
2. Wait a few minutes (email can be slow)
3. Check server logs for error messages
4. Verify the `EMAIL_FROM` address is valid
5. Test with a different email provider

### "Port 587 connection refused"
- Some firewalls block SMTP ports
- Try port 465 instead (requires `SMTP_SECURE=true`)
- Contact your ISP if ports are blocked

### Gmail error: "Less secure app access"
- Gmail disabled "Less secure app access" in 2022
- Always use App Passwords with Gmail now
- See: https://support.google.com/accounts/answer/185833

## Email Template Examples

### Contact Confirmation Email
```html
<h2>Thank you for contacting us!</h2>
<p>Hi {{name}},</p>
<p>We have received your message and will get back to you shortly.</p>
<p><strong>Your message:</strong></p>
<p>{{message}}</p>
<hr>
<p>Best regards,<br>The Henry Team</p>
```

### Newsletter Welcome Email
```html
<h2>Welcome to our newsletter!</h2>
<p>Thank you for subscribing to The Henry newsletter.</p>
<p>We'll keep you updated on:</p>
<ul>
  <li>New business openings</li>
  <li>Community events</li>
  <li>Special promotions</li>
  <li>Local news from Henry County, Kentucky</li>
</ul>
<p>The Henry Team</p>
```

### Admin Notification Email
```html
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> {{name}} ({{email}})</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Subject:</strong> {{subject}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
<hr>
<p>Log in to your admin panel to manage this submission.</p>
```

## Production Email Best Practices

1. **Use transactional email service** (SendGrid, Mailgun, etc.)
2. **Set up SPF, DKIM, DMARC records** for domain
3. **Monitor bounce rates** and unsubscribe rates
4. **Use email templates** with proper HTML structure
5. **Test with multiple email clients** (Gmail, Outlook, etc.)
6. **Set up email authentication** for deliverability
7. **Keep sender email consistent** across campaigns
8. **Follow CAN-SPAM and GDPR regulations** for marketing emails

## Common Email Issues and Solutions

| Issue | Solution |
|-------|----------|
| Emails going to spam | Set up SPF/DKIM records, use reputable service |
| Gmail not receiving | Check spam folder, verify sender address |
| Port blocked | Use different port (465 vs 587), contact ISP |
| Slow delivery | Normal - email can take minutes, use service monitoring |
| Wrong sender showing | Ensure EMAIL_FROM matches authorized address |
| Too many rejected | Reduce send rate, check for invalid emails |

---

**Need help?** Check the email provider's documentation or contact their support.
