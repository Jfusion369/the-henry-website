# Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your settings:
   - **PORT**: Server port (default: 3000)
   - **NODE_ENV**: development or production
   - **EMAIL_SERVICE**: Email provider (gmail, outlook, etc.)
   - **EMAIL_USER**: Your email address
   - **EMAIL_PASSWORD**: Your email password or app-specific password
   - **EMAIL_FROM**: Sender email address
   - **ADMIN_EMAIL**: Admin email to receive contact forms
   - **DATABASE_URL**: Path to SQLite database (default: ./data/contacts.db)

## Running the Server

### Development (with auto-reload):
```bash
npm run dev
```

### Production:
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Contact Form
**POST** `/api/contact`

Submit a contact form submission.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(123) 456-7890",
  "subject": "Inquiry about services",
  "message": "I am interested in learning more about..."
}
```

Response:
```json
{
  "success": true,
  "message": "Thank you for your message! We will get back to you shortly.",
  "contactId": 1
}
```

### Newsletter - Subscribe
**POST** `/api/newsletter/subscribe`

Subscribe to the newsletter.

Request body:
```json
{
  "email": "subscriber@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Thank you for subscribing! Check your email for confirmation."
}
```

### Newsletter - Unsubscribe
**POST** `/api/newsletter/unsubscribe`

Unsubscribe from the newsletter.

Request body:
```json
{
  "email": "subscriber@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "You have been unsubscribed from our newsletter."
}
```

### Health Check
**GET** `/api/health`

Check if the server is running.

Response:
```json
{
  "status": "ok",
  "message": "The Henry backend is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `.env` as `EMAIL_PASSWORD`

### Other Email Providers
Nodemailer supports many providers. See: https://nodemailer.com/smtp/well-known/

## Database

SQLite database is automatically created on first run at the path specified in `.env`.

### Tables:
- **contacts**: Stores contact form submissions
  - id, name, email, phone, subject, message, createdAt, status, notes

- **newsletter_subscriptions**: Stores newsletter subscribers
  - id, email, subscribedAt, active

## Development Notes

- All form submissions are validated on the server side
- Email notifications are sent asynchronously and don't block the response
- Database uses SQLite for simplicity - can be migrated to PostgreSQL or MongoDB
- CORS is configured to allow requests from localhost

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, set a different port in `.env`:
```
PORT=3001
```

### Email Not Sending
1. Check that `.env` has correct email credentials
2. For Gmail, ensure you've generated an App Password
3. Check server logs for specific error messages
4. Some providers may block connections from certain servers

### Database Errors
The database will auto-initialize on first run. If you encounter issues:
1. Delete the `data/` folder
2. Restart the server

## Next Steps

- [ ] Add admin authentication to view/manage submissions
- [ ] Add email templates
- [ ] Set up scheduled email reports
- [ ] Add rate limiting for form submissions
- [ ] Implement webhooks or CMS integration
