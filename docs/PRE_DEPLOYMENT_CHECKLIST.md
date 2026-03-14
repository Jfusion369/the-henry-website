# 🚀 PRE-DEPLOYMENT CHECKLIST

## Critical Steps Before Production Deployment

---

## 1. ✅ ENVIRONMENT CONFIGURATION

### Required Environment Variables
Create/verify `.env` file in `server/` directory with ALL these variables:

```env
# ===== CRITICAL - MUST CHANGE FROM DEFAULTS =====
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-strong-32-char-random-string>
ADMIN_USERNAME=<change-from-default>
HASHED_ADMIN_PASSWORD=<generate-new-bcrypt-hash>

# ===== EMAIL CONFIGURATION =====
EMAIL_SERVICE=gmail
EMAIL_USER=<your-gmail@gmail.com>
EMAIL_PASSWORD=<google-app-password-16-chars>
GMAIL_SENDER_NAME=The Henry

# ===== DATABASE =====
DATABASE_URL=./data/contacts.db
DATABASE_BACKUP_PATH=./backups

# ===== REDIS =====
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<set-if-required>

# ===== SECURITY =====
CAPTCHA_EXPIRY=600
MAX_CAPTCHA_REQUESTS_PER_IP=10
MAX_NEWSLETTER_REQUESTS_PER_IP=5
MAX_SUBMISSIONS_PER_IP=5
RATE_LIMIT_WINDOW=3600
ACCOUNT_LOCKOUT_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=1800000

# ===== OPTIONAL BUT RECOMMENDED =====
LOG_LEVEL=info
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SESSION_TIMEOUT=3600000
```

### ⚠️ Critical Security Variables

```bash
# 1. Generate a strong JWT_SECRET (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 2. Generate a strong HASHED_ADMIN_PASSWORD using bcrypt
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10))"

# 3. For Gmail: Get App Password from https://myaccount.google.com/apppasswords
#    Use the 16-character password, NOT your regular Gmail password
```

---

## 2. ✅ CODE VERIFICATION

### Required Files Check
```bash
cd c:\projects\the-henry-website\server
```

Verify these files exist and are not corrupted:
- [ ] `server.js` - Main server file
- [ ] `package.json` - Dependencies
- [ ] `.env` - Environment variables (create if missing)
- [ ] `config/database.js` - SQLite setup
- [ ] `config/redis.js` - Redis client
- [ ] `config/email.js` - Email configuration
- [ ] `routes/auth.js` - Authentication endpoints
- [ ] `routes/contact.js` - Contact form routes
- [ ] `routes/newsletter.js` - Newsletter routes
- [ ] `middleware/auth.js` - JWT verification
- [ ] `utils/captcha.js` - CAPTCHA logic

### Code Quality Check
```bash
# Verify no console.log statements that expose sensitive data
grep -r "password\|secret\|token" --include="*.js" routes/ utils/ middleware/

# Should return ONLY proper error handling, not actual values
```

---

## 3. ✅ DEPENDENCIES

### Install Production Dependencies
```bash
cd c:\projects\the-henry-website\server

# Remove dev dependencies
npm uninstall nodemon

# Install production dependencies only
npm install --production

# Verify redis is installed correctly
npm list redis
# Should show: redis@4.6.14 or similar
```

### Verify All Critical Packages
```bash
npm list bcrypt
npm list jsonwebtoken
npm list express
npm list redis
npm list dotenv
```

---

## 4. ✅ REDIS SETUP

### For Windows Deployment

#### Option A: Windows Service (Recommended)
```bash
# Download Redis for Windows
# From: https://github.com/tporadowski/redis/releases

# If already extracted:
cd C:\redis
redis-server.exe --service-install

# Start Redis
redis-server.exe --service-start

# Verify it's running
redis-cli ping
# Should return: PONG
```

#### Option B: Docker (Easiest)
```bash
# Install Docker Desktop for Windows
# Then run:
docker run -d --name redis -p 6379:6379 redis:latest

# Verify:
docker exec redis redis-cli ping
# Should return: PONG
```

#### Option C: Cloud Redis (No local setup)
- Use **Redis Cloud** (https://redis.com/cloud)
- Update `.env` with provided credentials:
```env
REDIS_HOST=<cloud-redis-host>
REDIS_PORT=<cloud-redis-port>
REDIS_PASSWORD=<cloud-redis-password>
```

### Test Redis Connection
```bash
node -e "
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});
client.connect().then(() => {
  console.log('✅ Redis connected');
  process.exit(0);
}).catch(e => {
  console.error('❌ Redis error:', e.message);
  process.exit(1);
});
"
```

---

## 5. ✅ DATABASE INITIALIZATION

### Create Database
```bash
cd c:\projects\the-henry-website\server

# Database is auto-created on first run, but verify:
ls -la data/
# Should show: contacts.db

# Verify database structure:
sqlite3 data/contacts.db ".tables"
# Should show: Contacts, NewsletterSubscriptions, AdminSessions
```

### Database Backup Strategy
```bash
# Create backup directory
mkdir backups

# Schedule daily backups (Windows Task Scheduler)
# Task: Copy database\data\contacts.db to backups\contacts.db.YYYYMMDD

# Or use backup script:
$date = Get-Date -Format "yyyyMMdd"
Copy-Item data/contacts.db "backups/contacts.db.$date"
```

---

## 6. ✅ SECURITY HARDENING

### Authentication Verification
```bash
# 1. Verify JWT_SECRET is set and strong (32+ chars)
node -e "console.log('JWT_SECRET length:', (process.env.JWT_SECRET || '').length)"

# 2. Verify HASHED_ADMIN_PASSWORD is bcrypt format
# Should look like: $2b$10$...
node -e "console.log('Hash starts with:', process.env.HASHED_ADMIN_PASSWORD.substring(0,7))"

# 3. Test login with correct password
# Should return 200 with JWT token
```

### Password Verification
```bash
# Generate new admin password
node bin/hash-password.js

# Follow the prompts to create new credentials
```

### Rate Limiting Test
```bash
# Make 6+ rapid requests - should get 429 on 6th
for ($i=1; $i -le 6; $i++) {
  $r = Invoke-WebRequest -Uri "http://localhost:3000/api/captcha/generate" `
    -Method POST -ErrorAction SilentlyContinue
  Write-Host "Attempt $i: $($r.StatusCode)"
}
```

---

## 7. ✅ EMAIL CONFIGURATION

### Gmail Setup (Most Common)
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Copy the 16-character app password
4. Add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Test Email Sending
```bash
node test-email.js

# Should send test email to EMAIL_USER
# Check inbox for verification
```

### Alternative Email Providers
- **SendGrid**: Update EMAIL_SERVICE, add API key
- **Mailgun**: Update EMAIL_SERVICE, add API key
- **AWS SES**: Update EMAIL_SERVICE, add credentials

---

## 8. ✅ HTTPS/SSL CONFIGURATION

### Get SSL Certificate
```bash
# Option 1: Let's Encrypt (Free)
# Use Certbot: https://certbot.eff.org/

# Option 2: Cloud Provider
# AWS Certificate Manager, Google Cloud, Azure all provide free SSL

# Option 3: Paid
# Namecheap, GoDaddy, etc.
```

### Configure Reverse Proxy (Nginx)
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 9. ✅ PROCESS MANAGEMENT

### Use PM2 for Production
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
cd c:\projects\the-henry-website\server
pm2 start server.js --name "the-henry-api"

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs the-henry-api
```

### Alternative: Systemd (Linux)
Create `/etc/systemd/system/the-henry.service`:
```ini
[Unit]
Description=The Henry Website API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/app/the-henry-website/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=append:/var/log/the-henry/app.log
StandardError=append:/var/log/the-henry/error.log

[Install]
WantedBy=multi-user.target
```

---

## 10. ✅ MONITORING & LOGGING

### Set Up Error Tracking
```bash
# Option 1: Sentry (Free tier available)
npm install @sentry/node

# Add to server.js:
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Configure Logging
```bash
# Option 1: Built-in Winston
npm install winston

# Option 2: Bunyan
npm install bunyan
```

### Monitor Endpoints
```bash
# Health check endpoint
curl https://yourdomain.com/api/health

# Should return:
# {"success": true, "status": "operational", "timestamp": "2024-01-19..."}
```

---

## 11. ✅ TESTING CHECKLIST

### Run Full Test Suite
```bash
cd c:\projects\the-henry-website\server

# 1. Health check
curl http://localhost:3000/api/health

# 2. CAPTCHA generation
curl -X POST http://localhost:3000/api/captcha/generate

# 3. Admin login (correct password)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# 4. Contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"test","captchaId":"test","captchaAnswer":"1"}'

# 5. Newsletter
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","captchaId":"test","captchaAnswer":"1"}'
```

### Test Security Features
```bash
# 1. Account lockout (6 wrong password attempts)
for ($i=1; $i -le 6; $i++) {
  $r = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST -ContentType "application/json" `
    -Body '{"username":"admin","password":"wrongpass"}' `
    -ErrorAction SilentlyContinue
  Write-Host "Attempt $i: HTTP $($r.StatusCode)"
}
# Attempt 6 should return 429 (Too Many Requests)

# 2. CORS headers present
curl -i http://localhost:3000/api/health | grep -i "access-control"

# 3. Security headers present
curl -i http://localhost:3000/api/health | grep -i "x-content-type-options"
```

---

## 12. ✅ PERFORMANCE OPTIMIZATION

### Database Optimization
```bash
# Index frequently queried fields
sqlite3 data/contacts.db "
CREATE INDEX IF NOT EXISTS idx_email ON Contacts(email);
CREATE INDEX IF NOT EXISTS idx_timestamp ON Contacts(timestamp);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON NewsletterSubscriptions(email);
"
```

### Redis Optimization
```bash
# Set appropriate memory limits in production
# Add to Redis config or docker run command:
--maxmemory 256mb
--maxmemory-policy allkeys-lru
```

### Application Optimization
```bash
# Enable compression
# Already configured in server.js with helmet

# Enable caching headers
# Already configured for static assets

# Monitor performance
pm2 monit
```

---

## 13. ✅ DEPLOYMENT PLATFORMS

### Option A: Heroku
```bash
heroku login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<value>
heroku config:set HASHED_ADMIN_PASSWORD=<value>
heroku config:set EMAIL_USER=<email>
heroku config:set EMAIL_PASSWORD=<password>
# Add Redis addon:
heroku addons:create heroku-redis:premium-0
git push heroku main
```

### Option B: AWS EC2 + RDS
```bash
# 1. Launch Ubuntu EC2 instance
# 2. Install Node.js and Redis
# 3. Clone repository
# 4. Install dependencies: npm install
# 5. Create .env file
# 6. Use PM2 or systemd for process management
# 7. Configure security groups
# 8. Set up SSL with Let's Encrypt
```

### Option C: Vercel/AWS Amplify
```bash
# Not recommended for backend with WebSocket/Redis
# Use API Gateway + Lambda instead (serverless)
```

---

## 14. ✅ POST-DEPLOYMENT VERIFICATION

### Immediate After Deployment
```bash
# 1. Test all endpoints on production domain
curl https://yourdomain.com/api/health

# 2. Test authentication
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# 3. Check SSL certificate
curl -v https://yourdomain.com/api/health 2>&1 | grep "SSL"

# 4. Check database connection
# Verify tables are created:
sqlite3 data/contacts.db ".tables"

# 5. Check Redis connection
# Verify sessions are being stored
```

### Continuous Monitoring
```bash
# Monitor server performance
pm2 monit

# Watch logs
pm2 logs the-henry-api

# Set up alerts for:
# - Server crashes
# - High error rate
# - High memory usage
# - Database issues
# - Email delivery failures
```

---

## 15. ✅ BACKUP & DISASTER RECOVERY

### Automated Backups
```bash
# Windows Task Scheduler: Run daily at 2 AM
$date = Get-Date -Format "yyyyMMdd"
Copy-Item "C:\projects\the-henry-website\server\data\contacts.db" `
  "C:\projects\the-henry-website\server\backups\contacts.db.$date"

# Keep last 30 days
Get-ChildItem "C:\projects\the-henry-website\server\backups\contacts.db.*" |
  Where-Object { $_.CreationTime -lt (Get-Date).AddDays(-30) } |
  Remove-Item
```

### Cloud Backup
```bash
# Upload backups to S3/Google Cloud/Azure
# Or use managed backup service provided by hosting platform
```

---

## 16. ✅ FINAL DEPLOYMENT CHECKLIST

- [ ] Environment variables set (JWT_SECRET, ADMIN_PASSWORD, EMAIL credentials)
- [ ] `.env` file secured (never commit to git)
- [ ] Database initialized and tested
- [ ] Redis running and accessible
- [ ] Email service tested
- [ ] All dependencies installed
- [ ] No console.log exposing sensitive data
- [ ] HTTPS/SSL configured
- [ ] Reverse proxy (Nginx/Apache) configured
- [ ] Process manager (PM2) configured
- [ ] Monitoring/error tracking enabled
- [ ] Backup strategy in place
- [ ] All endpoints tested on production
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Account lockout tested
- [ ] Database indexes created
- [ ] Logs being collected
- [ ] Team trained on deployment
- [ ] Rollback plan documented

---

## FINAL STATUS BEFORE DEPLOYMENT

✅ **Ready to Deploy?** Check all 16 sections above

⚠️ **If any section is incomplete**, address it before deployment

🚀 **When ready**: Deploy to your chosen platform following that platform's specific steps

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Complete pre-deployment checklist
