# Quick Reference Card

## Starting the Backend

**Windows (Easy):**
```bash
double-click start-backend.bat
```

**Manual:**
```bash
cd server
npm run dev
```

Server runs on: `http://localhost:3000`

## File Locations

```
Root
├── server/                     # All backend code here
│   ├── server.js               # Main server file
│   ├── package.json            # Dependencies
│   ├── .env                    # Configuration (you create this)
│   ├── .env.example            # Template
│   ├── README.md               # Backend docs
│   ├── config/
│   ├── models/
│   └── routes/
├── BACKEND_SETUP.md            # Complete setup guide
├── EMAIL_SETUP.md              # Email configuration guide
├── IMPLEMENTATION_SUMMARY.md   # What was built
├── admin-login.html            # Contact form here
└── scripts/main.js             # API integration
```

## Setup Checklist

- [ ] Open terminal and go to project folder
- [ ] Run `cd server` then `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Edit `.env` with Gmail App Password (or other email)
- [ ] Run `npm run dev`
- [ ] Open website and test forms
- [ ] Check admin email for notifications

## Email Setup (Gmail - 5 minutes)

1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and device type
3. Copy the 16-character password
4. In `.env`, change:
   - `EMAIL_USER=your-gmail@gmail.com`
   - `EMAIL_PASSWORD=xxxx xxxx xxxx xxxx` (paste the password)
   - `ADMIN_EMAIL=your-gmail@gmail.com`
5. Save and restart server

## Forms Available

### Contact Form
- Location: `Contact Us` section in website
- Saves to database
- Sends email to admin
- Sends confirmation to user

### Newsletter
- Location: Top of website
- Saves email to database
- Sends welcome email

## API Endpoints (For Testing)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe |
| GET | `/api/health` | Check if server is running |

## Test the Server

```bash
# In PowerShell or Command Prompt
curl http://localhost:3000/api/health

# Should see:
# {"status":"ok","message":"The Henry backend is running"}
```

## Database Location

`server/data/contacts.db`

- Auto-created on first run
- Contains all form submissions
- View with SQLite viewer tools

## Common Issues

### "Port 3000 already in use"
Change port in `.env`:
```
PORT=3001
```

### "Email not sending"
1. Check `.env` has correct credentials
2. Gmail users: verify App Password (not regular password)
3. Check server output for error messages
4. Wait a minute - email can be slow

### "Cannot find module"
```bash
cd server
npm install
```

### "Database error"
Delete `server/data` folder and restart server

## Ports

- Frontend: `http://localhost:8080` (live-server)
- Backend: `http://localhost:3000` (Express)
- Dev mode: Automatic reload enabled

## Important Files

| File | Purpose |
|------|---------|
| `server/.env` | Configuration (DO NOT COMMIT) |
| `server/server.js` | Main server |
| `server/routes/contact.js` | Contact form API |
| `server/routes/newsletter.js` | Newsletter API |
| `scripts/main.js` | Frontend integration |
| `admin-login.html` | Contact form HTML |

## Environment Variables

```
PORT=3000
NODE_ENV=development
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@thehenryllc.com
ADMIN_EMAIL=admin@thehenryllc.com
DATABASE_URL=./data/contacts.db
```

## Database Tables

**contacts** (all form submissions)
- name, email, phone, subject, message, createdAt, status

**newsletter_subscriptions** (email subscribers)
- email, subscribedAt, active

## Useful Commands

```bash
# Install dependencies
npm install

# Start with auto-reload (development)
npm run dev

# Start normally (production)
npm start

# Go to server folder
cd server
```

## Testing Forms

1. Open website in browser
2. Fill out newsletter form → Check your email
3. Fill out contact form → Check admin email
4. Both forms should work immediately

## Deployment

When ready for production:
1. See `BACKEND_SETUP.md` for deployment options
2. Recommended: Render.com (free tier available)
3. Update frontend API URL for production domain

## Documentation

- **BACKEND_SETUP.md** - Full setup guide (read this first!)
- **EMAIL_SETUP.md** - Email configuration guide
- **IMPLEMENTATION_SUMMARY.md** - What was built
- **server/README.md** - API documentation

## Next Steps

1. ✅ Get backend running locally
2. ✅ Configure email
3. ✅ Test all forms
4. ✅ Deploy to production
5. 🔄 Set up admin dashboard (optional)

---

**Questions?** Check the documentation files or review server logs for detailed error messages.
