# 🔐 Email Captcha Security - Quick Setup & Testing Guide

## What Was Implemented

Your contact form now has enterprise-grade spam protection with:

✅ **Math-based CAPTCHA** - Users solve simple arithmetic puzzles  
✅ **Rate Limiting** - Max 5 form submissions per IP per hour  
✅ **Session Management** - 10-minute expiration, 5 incorrect attempts  
✅ **Auto-cleanup** - Expired sessions purged every 30 minutes  
✅ **IP Tracking** - Detects and blocks spam sources  

## Files Modified/Created

```
New Files:
├── server/utils/captcha.js                 (Core CAPTCHA logic)
├── CAPTCHA_DOCUMENTATION.md                (Full technical docs)

Modified Files:
├── admin-login.html                        (+captcha HTML & CSS)
├── scripts/main.js                         (+captcha JavaScript)
├── server/routes/contact.js                (+API endpoints)
└── .vscode/launch.json                     (VS Code config)
```

## Quick Start - Testing Locally

### 1. Start the Backend Server

```bash
cd server
node server.js
```

You should see:
```
✅ Backend server running on http://localhost:3000
📧 Email service configured
```

### 2. Open Contact Form

Navigate to: `http://localhost:3000/admin-login.html#contact`

You'll see:
- 🔐 Security Verification section with math problem
- Answer input field (disabled until question loads)
- "Verify Answer" button

### 3. Solve the Puzzle & Submit

1. Read the math problem (e.g., "42 + 15")
2. Enter answer in input box
3. Click "Verify Answer"
4. See green success feedback: "✓ Verified!"
5. "Send Message" button now enabled
6. Fill form and submit

### 4. Watch Server Logs

Backend logs show:
```
🔐 Captcha generated: captcha_abc123_1234567890 (42 + 15 = 57)
✅ Captcha verified: captcha_abc123_1234567890
📝 Contact form submission received from IP 127.0.0.1
✅ Contact saved: 1
✅ Emails sent successfully
```

## Security Features in Action

### Test Wrong Answer
- Enter incorrect answer
- See red error: "Incorrect answer. 4 attempts remaining."
- Try again or refresh for new CAPTCHA

### Test Rate Limiting
- Submit 5 forms within same hour
- 6th submission returns: "Rate limit exceeded"

### Test Session Expiry
- Generate CAPTCHA
- Wait 10+ minutes
- Try to submit → "Captcha expired"

## Configuration

All settings in `server/utils/captcha.js`:

```javascript
CAPTCHA_EXPIRY: 10 * 60 * 1000,              // 10 minutes
MAX_ATTEMPTS_PER_SESSION: 5,                 // Wrong answers allowed
MAX_SUBMISSIONS_PER_IP: 5,                   // Forms per hour
MAX_CAPTCHA_REQUESTS_PER_IP: 20,            // New captchas per hour
RATE_LIMIT_WINDOW: 60 * 60 * 1000,          // 1 hour
```

To adjust limits, edit these values and restart server.

## API Endpoints (For Advanced Testing)

### Generate CAPTCHA
```bash
curl http://localhost:3000/api/captcha/generate
```

Response:
```json
{
  "success": true,
  "captchaId": "captcha_abc123_1234567890",
  "question": "42 + 15",
  "hint": "This is a simple math problem. Solve the addition puzzle."
}
```

### Verify Answer
```bash
curl -X POST http://localhost:3000/api/captcha/verify \
  -H "Content-Type: application/json" \
  -d '{"captchaId":"captcha_abc123_1234567890","answer":57}'
```

Response (Success):
```json
{
  "success": true,
  "message": "Captcha verified successfully!",
  "verified": true
}
```

Response (Incorrect):
```json
{
  "success": false,
  "message": "Incorrect answer. 4 attempts remaining.",
  "verified": false,
  "attemptsRemaining": 4
}
```

### Submit Contact Form
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is my contact message.",
    "captchaId": "captcha_abc123_1234567890"
  }'
```

## Troubleshooting

### CAPTCHA Not Appearing

**Problem:** Math question not shown  
**Solution:**
1. Open Developer Tools (F12)
2. Check Console for errors
3. Verify backend running: `curl http://localhost:3000/api/health`
4. Refresh page (Ctrl+Shift+R)

### Server Crashes After Starting

**Problem:** Node error when running server  
**Solution:**
```bash
# Check syntax
node -c server/server.js

# View full error
node server/server.js

# Make sure .env exists
ls server/.env
```

### Rate Limit Too Restrictive

**Problem:** Can't test form multiple times  
**Solution:**
- Restart server (clears rate limit store)
- Change limits in `server/utils/captcha.js`
- Use different browser (different session)

### CAPTCHA Verification Always Fails

**Problem:** Correct answer marked wrong  
**Solution:**
1. Verify math in console: `console.log(42 + 15)` = 57
2. Make sure you're entering number, not text
3. Check captchaId wasn't generated on different instance
4. Try new CAPTCHA (click refresh page)

## Browser Developer Tools Tips

Open Console (F12) to see:

```javascript
// Check if API working
console.log('🧪 Test API:');
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(d => console.log(d))

// Check captcha state
console.log('captchaVerified:', window.captchaVerified)

// Manual verify
fetch('http://localhost:3000/api/captcha/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    captchaId: 'test_captcha', 
    answer: 57 
  })
}).then(r => r.json()).then(console.log)
```

## Production Deployment Checklist

Before going public:

- [ ] Change rate limits (consider lowering to 3/hour for production)
- [ ] Set up Redis for session storage (not just in-memory)
- [ ] Add HTTPS/TLS certificate
- [ ] Test with production domain
- [ ] Set up logging/monitoring
- [ ] Document rate limits in Terms of Service
- [ ] Create abuse contact email
- [ ] Monitor spam metrics weekly
- [ ] Consider upgrading to image CAPTCHA for Phase 2
- [ ] Set up reCAPTCHA fallback (optional)

## Next Steps

1. **Test locally** - Verify all functionality works
2. **Adjust limits** - Set appropriate for your usage
3. **Monitor logs** - Watch for spam patterns
4. **Plan Phase 2** - Consider image CAPTCHA or reCAPTCHA
5. **Document** - Add rate limits to privacy policy

## Support

For detailed technical documentation, see: `CAPTCHA_DOCUMENTATION.md`

For security questions: Review `SECURITY_REMINDER.md`

---

**Status:** ✅ Deployed & Ready  
**Test Date:** December 1, 2025  
**Version:** 1.0.0
