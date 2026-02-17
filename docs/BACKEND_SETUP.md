# Backend Integration Guide

## Overview

Your website now has a complete backend system with:
- ✅ Contact form submissions with email notifications
- ✅ Newsletter subscription management
- ✅ SQLite database for storing submissions
- ✅ Email notifications to admin and user confirmation emails
- ✅ Form validation on both client and server
- ✅ CORS enabled for frontend-backend communication

## Quick Start

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` folder:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- `PORT=3000`
- `NODE_ENV=development`
- `EMAIL_SERVICE=gmail`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASSWORD=your-app-password`
- `EMAIL_FROM=noreply@thehenryllc.com`
- `ADMIN_EMAIL=admin@thehenryllc.com`

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server runs on `http://localhost:3000`

### 4. Test the Forms

1. Open your website in a browser
2. Fill out the newsletter form at the top of the page
3. Fill out the contact form in the "Contact Us" section
4. Check the admin email for notifications
5. Check the subscriber email for confirmation

## Email Setup Instructions

### Gmail
1. Enable 2-Step Verification on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer" (or your device)
4. Google will generate a 16-character password
5. Paste this in your `.env` as `EMAIL_PASSWORD`

### Other Providers
For Outlook, Yahoo, or other providers, see: https://nodemailer.com/smtp/well-known/

## File Structure

```
the-henry-website/
├── server/                 # Backend Node.js application
│   ├── config/
│   │   ├── database.js    # SQLite database configuration
│   │   └── email.js       # Email service configuration
│   ├── models/
│   │   ├── Contact.js     # Contact model for database operations
│   │   └── Newsletter.js  # Newsletter subscription model
│   ├── routes/
│   │   ├── contact.js     # Contact form API endpoint
│   │   └── newsletter.js  # Newsletter API endpoints
│   ├── server.js          # Main Express server
│   ├── package.json       # Dependencies
│   ├── .env               # Environment configuration (DO NOT COMMIT)
│   ├── .env.example       # Template for .env
│   ├── .gitignore         # Git ignore rules
│   └── README.md          # Backend documentation
├── index.html
├── admin-login.html       # Updated with contact form
├── scripts/
│   └── main.js            # Updated with API integration
└── styles/
    └── styles.css
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Contact Form Submission
```
POST /api/contact

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "subject": "Inquiry",
  "message": "I have a question..."
}

Response:
{
  "success": true,
  "message": "Thank you for your message! We will get back to you shortly.",
  "contactId": 1
}
```

### Newsletter Subscribe
```
POST /api/newsletter/subscribe

Request:
{
  "email": "subscriber@example.com"
}

Response:
{
  "success": true,
  "message": "Thank you for subscribing! Check your email for confirmation."
}
```

### Newsletter Unsubscribe
```
POST /api/newsletter/unsubscribe

Request:
{
  "email": "subscriber@example.com"
}

Response:
{
  "success": true,
  "message": "You have been unsubscribed from our newsletter."
}
```

## Database

SQLite database is automatically created at `server/data/contacts.db` on first run.

### Tables:

**contacts**
- `id`: Auto-incremented ID
- `name`: Sender's name
- `email`: Sender's email
- `phone`: Sender's phone (optional)
- `subject`: Message subject (optional)
- `message`: Message body
- `createdAt`: Timestamp
- `status`: 'new', 'in-progress', 'resolved' (default: 'new')
- `notes`: Admin notes

**newsletter_subscriptions**
- `id`: Auto-incremented ID
- `email`: Subscriber email (unique)
- `subscribedAt`: Subscription timestamp
- `active`: 1 or 0 (default: 1)

## Troubleshooting

### Port 3000 Already in Use
Change the port in `.env`:
```
PORT=3001
```

### Email Not Sending
1. Verify `.env` credentials are correct
2. For Gmail: Ensure you used the App Password (not your Gmail password)
3. Check server logs for error messages
4. Some providers may block connections from certain IP addresses

### CORS Errors
If you get CORS errors from the frontend, ensure:
1. The server is running on port 3000
2. The frontend is accessing `http://localhost:3000/api`
3. The frontend is on `localhost` or a whitelisted domain in `server.js`

### Database Errors
If the database won't initialize:
1. Delete the `server/data` folder
2. Restart the server

## Frontend Integration

The frontend automatically sends requests to the backend API when:
1. User submits the newsletter form
2. User submits the contact form

JavaScript configuration in `scripts/main.js`:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';
```

This automatically detects local development vs production.

## Production Deployment

### Before Going Live
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Change admin credentials in `.env`
- [ ] Set up real email account (Gmail or other)
- [ ] Replace placeholder email addresses
- [ ] Test all forms thoroughly
- [ ] Set up HTTPS on your server
- [ ] Add rate limiting to prevent abuse
- [ ] Implement admin authentication
- [ ] Back up your database regularly

### Deployment Platforms
- **Heroku**: Free tier available, good for testing
- **Railway**: Modern alternative to Heroku
- **AWS/DigitalOcean**: More control and scalability
- **Render**: Easy deployment with free tier
- **Netlify/Vercel**: For frontend, use proxy for backend

### Deploy to Render (Recommended)

1. Create account at https://render.com
2. Connect your GitHub repository
3. Create new Web Service
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variables in settings
7. Deploy!

## Next Steps

### Recommended Enhancements
- [ ] Add admin login to view/manage submissions
- [ ] Create admin dashboard
- [ ] Add email templates
- [ ] Implement scheduled reports
- [ ] Add file upload support
- [ ] Integrate with CMS (Strapi, Contentful)
- [ ] Add spam filtering/validation
- [ ] Implement webhooks
- [ ] Add analytics
- [ ] Migrate to PostgreSQL for production

### Security Improvements
- [ ] Add JWT authentication
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Add CSRF protection
- [ ] Use HTTPS/SSL
- [ ] Add request validation
- [ ] Encrypt sensitive data

## Support

For issues or questions:
1. Check server logs: `npm run dev` and watch the terminal
2. Review error messages from failed requests
3. Check `.env` configuration
4. Verify email credentials
5. Check browser console for frontend errors

## Additional Resources

- Express.js Docs: https://expressjs.com/
- Nodemailer Docs: https://nodemailer.com/
- SQLite Docs: https://www.sqlite.org/
- Render Deployment: https://render.com/docs
- CORS Explained: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
