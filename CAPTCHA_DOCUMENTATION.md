# Email Captcha Security System Documentation

## Overview

A comprehensive math-based CAPTCHA security system designed to protect the contact form from spam and automated attacks. The system uses simple arithmetic problems, session management, and rate limiting.

## Features

### 🔐 Security Features

1. **Math-Based CAPTCHA**
   - Randomly generated arithmetic problems (addition, subtraction, multiplication)
   - User must solve the puzzle to verify they're human
   - Prevents automated form submissions

2. **Rate Limiting**
   - Limits to 5 contact submissions per IP per hour
   - Limits to 20 CAPTCHA generation requests per IP per hour
   - Returns 429 (Too Many Requests) when exceeded

3. **Session Management**
   - CAPTCHA sessions expire after 10 minutes
   - Maximum 5 incorrect attempts per CAPTCHA
   - Server-side verification prevents client-side bypass

4. **Automatic Cleanup**
   - Expired CAPTCHAs cleaned up every 30 minutes
   - Old rate limit entries automatically purged

## Architecture

### Backend Components

#### `server/utils/captcha.js`
Central utility module handling all CAPTCHA logic:

```javascript
// Generate a new CAPTCHA
const { captchaId, question, hint } = generateCaptcha();

// Verify answer
const result = verifyCaptcha(captchaId, userAnswer);

// Check if verified
const isVerified = isCaptchaVerified(captchaId);

// Rate limiting
const { allowed, remaining } = checkRateLimit(clientIp, 'contact');

// Get client IP
const ip = getClientIp(req);
```

#### API Endpoints

**POST `/api/captcha/generate`**
- Generates new CAPTCHA challenge
- Returns: `{ captchaId, question, hint }`
- Rate limited: 20 per IP per hour
- Response: 200 OK or 429 Too Many Requests

**POST `/api/captcha/verify`**
- Verifies CAPTCHA answer
- Payload: `{ captchaId, answer }`
- Returns: `{ success, message, verified, attemptsRemaining }`
- Response: 200 OK or 400 Bad Request

**POST `/api/contact`**
- Submit contact form (requires verified CAPTCHA)
- Payload: `{ name, email, phone, subject, message, captchaId }`
- Rate limited: 5 per IP per hour
- Response: 201 Created, 400 Bad Request, or 429 Too Many Requests

### Frontend Components

#### HTML Elements
Located in `admin-login.html` contact form section:

```html
<div class="captcha-container">
  <h4 class="captcha-title">🔐 Security Verification</h4>
  <div class="captcha-box">
    <div id="captchaQuestion" class="captcha-question"></div>
    <div class="captcha-input-group">
      <input type="number" id="captchaAnswer" class="captcha-input" disabled>
      <button type="button" id="verifyCaptchaBtn" class="btn btn-captcha" disabled>
        Verify Answer
      </button>
    </div>
    <div id="captchaFeedback" class="captcha-feedback"></div>
  </div>
</div>
```

#### JavaScript Logic
Implemented in `scripts/main.js`:

1. **Initialization** - Load CAPTCHA when page loads
2. **Verification** - Handle user answer submission
3. **Feedback** - Display success/error/loading states
4. **Form Integration** - Require verified CAPTCHA before submission

### CSS Styling
Styles defined in `admin-login.html`:

```css
.captcha-container { ... }          /* Container styling */
.captcha-title { ... }              /* Title styling */
.captcha-box { ... }                /* CAPTCHA box styling */
.captcha-box.verified { ... }       /* Success state */
.captcha-box.error { ... }          /* Error state */
.captcha-question { ... }           /* Math problem display */
.captcha-input-group { ... }        /* Input/button layout */
.captcha-input { ... }              /* Answer input styling */
.btn-captcha { ... }                /* Verify button styling */
.captcha-feedback { ... }           /* Feedback message styling */
```

## User Flow

### Contact Form Submission

1. **Page Load**
   - User visits admin-login.html#contact
   - JavaScript initializes and requests CAPTCHA
   - Math problem displayed to user

2. **User Solves Puzzle**
   - User enters answer in input field
   - Clicks "Verify Answer" button
   - Frontend sends answer to `/api/captcha/verify`

3. **Verification**
   - Backend validates answer
   - Returns success/error with attempts remaining
   - UI updates: box color, feedback text, button states

4. **Form Submission**
   - If verified: "Send Message" button enabled
   - User fills remaining form fields
   - Submits to `/api/contact` with captchaId
   - Backend re-validates captcha before processing

5. **Completion**
   - Success notification displayed
   - Form resets
   - New CAPTCHA generated for next submission

## Configuration

Settings in `server/utils/captcha.js`:

```javascript
const CONFIG = {
  CAPTCHA_EXPIRY: 10 * 60 * 1000,              // 10 minutes
  RATE_LIMIT_WINDOW: 60 * 60 * 1000,          // 1 hour
  MAX_ATTEMPTS_PER_SESSION: 5,                 // Wrong answers
  MAX_SUBMISSIONS_PER_IP: 5,                   // Contact forms per hour
  MAX_CAPTCHA_REQUESTS_PER_IP: 20,            // CAPTCHA generations per hour
};
```

## Security Considerations

### Protected Against

✅ **Bot Attacks** - Requires human verification
✅ **Brute Force** - Limited attempts (5) per CAPTCHA
✅ **Spam** - Rate limiting (5 submissions per hour per IP)
✅ **Client-Side Bypass** - Server-side verification required
✅ **Session Replay** - Session IDs unique and time-limited
✅ **IP Spoofing** - Extracted from headers (x-forwarded-for, x-real-ip)

### Limitations

⚠️ **In-Memory Storage** - Not suitable for distributed systems
  - *Solution:* Migrate to Redis for multi-server deployments

⚠️ **Simple Math Problems** - Vulnerable to OCR attacks
  - *Solution:* Consider image-based CAPTCHA for higher security

⚠️ **Single IP** - VPN/Proxy users may share IPs
  - *Solution:* Combine with session cookies for stricter control

## Testing

### Manual Testing

```bash
# 1. Generate CAPTCHA
curl http://localhost:3000/api/captcha/generate

# Response:
{
  "success": true,
  "captchaId": "captcha_abc123_1234567890",
  "question": "42 + 15",
  "hint": "This is a simple math problem. Solve the addition puzzle."
}

# 2. Verify Answer
curl -X POST http://localhost:3000/api/captcha/verify \
  -H "Content-Type: application/json" \
  -d '{"captchaId":"captcha_abc123_1234567890","answer":57}'

# Response (Success):
{
  "success": true,
  "message": "Captcha verified successfully!",
  "verified": true
}

# 3. Submit Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"555-1234",
    "subject":"Hello",
    "message":"This is my contact message",
    "captchaId":"captcha_abc123_1234567890"
  }'
```

### Rate Limit Testing

```bash
# Test rate limit by making 6 contact submissions quickly
# 6th request should return 429 Too Many Requests
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","message":"Test message testing.","captchaId":"test_'$i'"}'
  echo "Request $i"
done
```

## Logs

### Console Output Examples

```
🔐 Captcha generated: captcha_abc123_1234567890 (42 + 15 = 57)
✅ Captcha verified: captcha_abc123_1234567890
📝 Contact form submission received from IP 192.168.1.1
⚠️ Rate limit exceeded for IP 192.168.1.1
🧹 Cleaned up 3 expired captchas
🧹 Cleaned up 1 rate limit entries
```

## Future Enhancements

### Phase 2 Improvements

1. **Redis Integration**
   - Replace in-memory storage for multi-server support
   - Better performance and scalability

2. **Image CAPTCHA**
   - Use image-based puzzles instead of math
   - Higher security against automated attacks

3. **reCAPTCHA Integration**
   - Google reCAPTCHA v3 for seamless verification
   - No user interaction required

4. **Honeypot Fields**
   - Additional spam detection layer
   - Catch simple bot patterns

5. **Email Verification**
   - Send verification code after form submission
   - Confirm email ownership before processing

6. **Geolocation Checking**
   - Monitor for suspicious submission patterns
   - Block high-risk countries (if needed)

7. **Machine Learning**
   - Analyze submission patterns
   - Detect anomalies automatically

## Troubleshooting

### Issue: CAPTCHA not loading

**Solution:**
1. Check API endpoint is accessible: `curl http://localhost:3000/api/captcha/generate`
2. Verify backend server is running: `node server/server.js`
3. Check browser console for errors (F12)
4. Refresh page and try again

### Issue: "Rate limit exceeded"

**Solution:**
- Limit is 5 submissions per hour per IP
- Wait 1 hour for window to reset
- For testing, restart server to clear rate limit store

### Issue: Answer shows incorrect when math is right

**Solution:**
- CAPTCHA answer is stored server-side (immutable)
- Ensure answer matches exactly (e.g., "57" not "57.0")
- Try a new CAPTCHA if more than 5 attempts used

### Issue: Form submits without verification

**Solution:**
- Check JavaScript is enabled
- Verify `captchaVerified` flag in browser console
- Check form element IDs match between HTML/JS
- Hard refresh browser (Ctrl+Shift+R)

## Deployment Notes

### Production Checklist

- [ ] Add CAPTCHA_EXPIRY environment variable
- [ ] Add RATE_LIMIT_WINDOW environment variable
- [ ] Configure rate limits per environment
- [ ] Set up Redis for session storage (if applicable)
- [ ] Monitor rate limit hit rate in logs
- [ ] Set up alerts for spam attempts
- [ ] Test CAPTCHA in production environment
- [ ] Document rate limits in terms of service
- [ ] Create admin dashboard to view blocked IPs
- [ ] Implement IP whitelist for legitimate services

### Environment Variables

Add to `.env` file (optional, uses defaults if not set):

```env
CAPTCHA_EXPIRY=600000
RATE_LIMIT_WINDOW=3600000
MAX_ATTEMPTS_PER_SESSION=5
MAX_SUBMISSIONS_PER_IP=5
MAX_CAPTCHA_REQUESTS_PER_IP=20
```

## Related Files

- `server/utils/captcha.js` - Core CAPTCHA utility
- `server/routes/contact.js` - API endpoints
- `admin-login.html` - HTML form + styling
- `scripts/main.js` - Frontend JavaScript
- `.gitignore` - Protects .env secrets
- `SECURITY_REMINDER.md` - Security checklist

---

**Last Updated:** December 1, 2025  
**Status:** Production Ready  
**Version:** 1.0.0  
**Author:** The Henry Development Team
