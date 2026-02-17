# 🧪 Testing & Debugging Guide

## Quick Start

### Start the Server
```bash
cd c:\projects\the-henry-website\server
node server.js
```

Or use the batch file:
```bash
c:\projects\the-henry-website\start-server.bat
```

---

## Manual API Testing

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is operational"
}
```

---

### 2. Generate CAPTCHA

```bash
curl -X POST http://localhost:3000/api/captcha/generate \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "captchaId": "captcha_54ce8cf9efd8c7a3_mkm06hgr",
  "question": "148 - 92 = ?",
  "hint": "This is a simple subtraction puzzle."
}
```

Store the `captchaId` for the next tests.

---

### 3. Submit Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, this is a test message.",
    "captchaId": "captcha_54ce8cf9efd8c7a3_mkm06hgr",
    "captchaAnswer": "56"
  }'
```

**If CAPTCHA is correct:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**If CAPTCHA is incorrect:**
```json
{
  "success": false,
  "message": "Invalid CAPTCHA answer"
}
```

---

### 4. Subscribe to Newsletter

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com",
    "captchaId": "captcha_54ce8cf9efd8c7a3_mkm06hgr",
    "captchaAnswer": "56"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

---

## Automated Testing

### Run Verification Script

```bash
cd c:\projects\the-henry-website\server
node verify-server.js
```

This will test:
1. ✅ Health check endpoint
2. ✅ CAPTCHA generation
3. ✅ Contact form API
4. ✅ Newsletter API

---

## Debugging

### Check Server Output

When you start the server, you should see:

```
Connected to SQLite database at: ./data/contacts.db
Contacts table initialized
Newsletter subscriptions table initialized
⚠️ Redis connection timeout - continuing without Redis
🚀 The Henry Backend Server running on http://localhost:3000
📧 Email service: gmail
💾 Database: ./data/contacts.db
🔐 Security: Redis-based rate limiting and session management enabled
✅ Server ready to accept connections
```

### Database Inspection

View submitted contacts:
```bash
sqlite3 c:\projects\the-henry-website\server\data\contacts.db
> SELECT * FROM Contacts;
> SELECT * FROM NewsletterSubscriptions;
```

### Common Issues

#### Issue: "Cannot find module"
**Solution**: Make sure you're in the correct directory:
```bash
cd c:\projects\the-henry-website\server
```

#### Issue: Port 3000 already in use
**Solution**: Change PORT in `.env` or kill existing process:
```bash
# Find process using port 3000
netstat -ano | findstr :3000
# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Issue: Email not sending
**Check:**
1. Environment variables are set correctly in `.env`
2. Gmail App Password is configured (not regular password)
3. Check server logs for email error messages

#### Issue: Redis connection timeout
**This is normal** - Redis is optional:
- Rate limiting will use graceful fallback
- All features continue to work
- To enable Redis, install and run Redis server

#### Issue: CAPTCHA not verifying
**Check:**
1. Correct CAPTCHA ID being used
2. Correct answer calculation
3. CAPTCHA not expired (10 minutes)
4. Server logs for verification errors

---

## Performance Monitoring

### Check Server Health
```bash
curl -s http://localhost:3000/api/health | jq .
```

### Monitor Database
```bash
# Check contacts table
sqlite3 c:\projects\the-henry-website\server\data\contacts.db "SELECT COUNT(*) as ContactCount FROM Contacts;"

# Check newsletter table
sqlite3 c:\projects\the-henry-website\server\data\contacts.db "SELECT COUNT(*) as SubscriberCount FROM NewsletterSubscriptions;"
```

### View Recent Contacts
```bash
sqlite3 c:\projects\the-henry-website\server\data\contacts.db \
  "SELECT name, email, timestamp FROM Contacts ORDER BY timestamp DESC LIMIT 10;"
```

---

## Testing Email Functionality

### Use test-email.js

```bash
cd c:\projects\the-henry-website\server
node test-email.js
```

This will send a test email to verify your email configuration.

---

## Load Testing

### Simple Load Test with Apache Bench

```bash
# Install Apache (or use equivalent tool)
# Test CAPTCHA generation endpoint with 100 requests
ab -n 100 -c 10 -p data.json -T application/json http://localhost:3000/api/captcha/generate
```

### PowerShell Load Test

```powershell
$baseUrl = "http://localhost:3000"
$iterations = 50

1..$iterations | ForEach-Object {
  $time = Measure-Command {
    Invoke-WebRequest -Uri "$baseUrl/api/health" -UseBasicParsing
  }
  Write-Host "Request $($_): $($time.TotalMilliseconds)ms"
}
```

---

## Browser Console Testing

Open browser DevTools (F12) and test API endpoints:

```javascript
// Health check
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(d => console.log(d));

// Generate CAPTCHA
fetch('http://localhost:3000/api/captcha/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(d => console.log(d));

// Submit contact form
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'Test message',
    captchaId: 'test',
    captchaAnswer: '999'
  })
})
  .then(r => r.json())
  .then(d => console.log(d));
```

---

## Error Handling Verification

### Test Missing Fields
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

Should return validation error.

### Test Invalid Email
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "message": "Test",
    "captchaId": "test",
    "captchaAnswer": "123"
  }'
```

Should return email validation error.

### Test Rate Limiting
Make multiple requests in quick succession:
```bash
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/captcha/generate \
    -H "Content-Type: application/json" &
done
wait
```

Should get rate limit exceeded after configured limit.

---

## Security Testing

### CORS Testing
```bash
curl -X OPTIONS http://localhost:3000/api/contact \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### CAPTCHA Bypass Prevention
Ensure CAPTCHA answers cannot be:
- Guessed randomly
- Brute forced (rate limited)
- Reused (expires after 10 minutes)

### SQL Injection Testing
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test; DROP TABLE Contacts;--",
    "email": "test@example.com",
    "message": "Test",
    "captchaId": "test",
    "captchaAnswer": "123"
  }'
```

Should sanitize input and store as regular text.

---

## Logging & Monitoring

### View Server Logs

Server logs all requests with format:
```
📨 GET /api/captcha/generate
🔐 Math captcha generated for IP ::1
🔐 Captcha generated: captcha_xxx
```

Check logs for:
- Request method and path
- CAPTCHA generation
- Email sending
- Database operations
- Error messages

---

## Environment Variables Reference

```env
# Server Configuration
NODE_ENV=development              # Set to 'production' for deployment
PORT=3000                        # Server port

# Admin Authentication
ADMIN_USERNAME=admin             # Admin username
HASHED_ADMIN_PASSWORD=xxx        # bcrypt hashed password
JWT_SECRET=your-secret-key       # JWT signing secret

# Email Configuration
EMAIL_SERVICE=gmail              # Email provider
EMAIL_USER=your-email@gmail.com  # Email address
EMAIL_PASSWORD=app-password      # App-specific password
GMAIL_SENDER_NAME=The Henry      # Sender name

# Database
DATABASE_URL=./data/contacts.db  # SQLite database path

# Redis (optional)
REDIS_HOST=localhost             # Redis server host
REDIS_PORT=6379                  # Redis server port

# CAPTCHA Settings
CAPTCHA_EXPIRY=600               # CAPTCHA validity (seconds)
MAX_CAPTCHA_REQUESTS_PER_IP=10   # CAPTCHA generation limit
MAX_NEWSLETTER_REQUESTS_PER_IP=5 # Newsletter submission limit
MAX_SUBMISSIONS_PER_IP=5         # Contact form submission limit
RATE_LIMIT_WINDOW=3600           # Rate limit window (seconds)
```

---

## Next Steps

1. ✅ Start the server
2. ✅ Test all endpoints
3. ✅ Verify email configuration
4. ✅ Check database
5. ✅ Set environment variables
6. ✅ Deploy to production

**Status**: Ready for production deployment ✅
