# 📄 DEPLOYMENT QUICK REFERENCE CARD

## Print This Page For Easy Reference During Deployment

---

## REQUIRED ENVIRONMENT VARIABLES

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
ADMIN_USERNAME=<change from "admin">
HASHED_ADMIN_PASSWORD=<generate: node bin/hash-password.js>
EMAIL_SERVICE=gmail
EMAIL_USER=<your-gmail@gmail.com>
EMAIL_PASSWORD=<16-char app password from myaccount.google.com/apppasswords>
DATABASE_URL=./data/contacts.db
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## QUICK COMMAND REFERENCE

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Admin Password Hash
node bin/hash-password.js

# Install Dependencies
npm install --production

# Test Redis Connection
redis-cli ping
# Should return: PONG

# Test Email
node test-email.js

# Test Health Endpoint
curl http://localhost:3000/api/health

# Test Login (correct password)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'

# Start Server (Local Testing)
npm start

# Start with PM2 (Production)
pm2 start server.js --name "the-henry"

# Monitor with PM2
pm2 monit

# View PM2 Logs
pm2 logs the-henry
```

---

## CRITICAL SETTINGS

### Bcrypt Password
- Must be generated with: `node bin/hash-password.js`
- Starts with: `$2b$`
- Example: `$2b$10$nOUIs5kJ7naTuTFkBy1He.ICSZW...`

### JWT Secret
- Minimum: 32 characters
- Random string: use `crypto.randomBytes(32).toString('hex')`
- Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Gmail App Password
- Get from: https://myaccount.google.com/apppasswords
- Format: `xxxx xxxx xxxx xxxx` (16 characters)
- NOT your regular Gmail password

### Redis
- Windows: Install from https://github.com/tporadowski/redis
- Linux: `sudo apt-get install redis-server`
- Docker: `docker run -d -p 6379:6379 redis:latest`
- Cloud: Use Redis Cloud (https://redis.com/cloud)

---

## PLATFORMS QUICK SELECT

| If you want... | Choose... | Setup time |
|---|---|---|
| Easiest setup | Heroku | 15 min |
| Most control | AWS EC2 | 1-2 hrs |
| Cheapest | Vultr/Linode | 1-2 hrs |

**See PLATFORM_DEPLOYMENT_GUIDES.md for detailed steps**

---

## TEST CHECKLIST (BEFORE DEPLOY)

```bash
# 1. Health endpoint
curl http://localhost:3000/api/health
# Expected: 200 with status: "operational"

# 2. Login with correct password
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
# Expected: 200 with JWT token

# 3. Login with wrong password (attempt 1-5)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrongpass"}'
# Expected: 401 Unauthorized (attempts 1-5)

# 4. Login with wrong password (attempt 6)
# Expected: 429 Too Many Requests (account locked)

# 5. CAPTCHA generation
curl -X POST http://localhost:3000/api/captcha/generate
# Expected: 200 with question

# 6. Rate limiting test
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/captcha/generate
done
# Expected: 11th request returns 429

# 7. Database check
sqlite3 server/data/contacts.db ".tables"
# Expected: Shows tables: AdminSessions, Contacts, NewsletterSubscriptions

# 8. Redis check
redis-cli ping
# Expected: PONG
```

---

## SECURITY VERIFICATION

```bash
# 1. Check security headers
curl -i http://localhost:3000/api/health | grep -i "x-content"
# Should show: x-content-type-options: nosniff

# 2. Check HTTPS is enforced
curl -v http://your-domain.com/api/health 2>&1 | grep -i "301\|location"
# Should redirect to HTTPS

# 3. Check SSL certificate
curl -v https://your-domain.com/api/health 2>&1 | grep -i "subject\|issuer"
# Should show valid certificate details
```

---

## FILE LOCATIONS

```
C:\projects\the-henry-website\
├── server\
│   ├── server.js (main application)
│   ├── .env (MUST CREATE - environment variables)
│   ├── data\contacts.db (database)
│   ├── bin\hash-password.js (password generator)
│   ├── config\
│   ├── routes\
│   ├── middleware\
│   └── package.json
├── PRE_DEPLOYMENT_CHECKLIST.md
├── PLATFORM_DEPLOYMENT_GUIDES.md
├── PRODUCTION_READINESS.md
└── DEPLOYMENT_READINESS_SUMMARY.md
```

---

## TROUBLESHOOTING QUICK FIXES

| Problem | Fix |
|---------|-----|
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| Redis connection error | Install Redis, start with `redis-server` |
| Email not sending | Check credentials, use App Password not Gmail password |
| Can't login | Verify HASHED_ADMIN_PASSWORD is bcrypt format ($2b$) |
| Database error | Delete `server/data/contacts.db`, restart (recreates) |
| CAPTCHA not working | Ensure Redis is running |
| SSL certificate error | Run certbot: `sudo certbot --nginx -d your-domain.com` |

---

## PRODUCTION CHECKLIST (FINAL)

Before you click "Deploy":

- [ ] `.env` file created in `server/` directory
- [ ] `JWT_SECRET` is 32+ random characters
- [ ] `HASHED_ADMIN_PASSWORD` starts with `$2b$`
- [ ] Email credentials from Google App Passwords
- [ ] Redis installed and running
- [ ] Database tests passing
- [ ] Email test passing
- [ ] All endpoints tested locally
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] HTTPS certificate ready
- [ ] PM2 configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

## POST-DEPLOYMENT TEST

After deploying to production:

```bash
# Test production endpoints
curl https://your-domain.com/api/health
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_PASSWORD"}'
curl -X POST https://your-domain.com/api/captcha/generate

# Verify HTTPS
curl -v https://your-domain.com/api/health 2>&1 | grep SSL

# Check SSL grade
# Visit: https://www.ssllabs.com/ssltest/
```

---

## MONITORING CHECKLIST

Once deployed, check:

- [ ] Uptime monitoring active
- [ ] Error tracking enabled
- [ ] Logs being collected
- [ ] Performance metrics tracked
- [ ] Alerts configured
- [ ] Backup running
- [ ] Database growing normally
- [ ] Email delivery working

---

## CONTACT & SUPPORT

For detailed information:
1. **Setup**: PRE_DEPLOYMENT_CHECKLIST.md
2. **Platform**: PLATFORM_DEPLOYMENT_GUIDES.md
3. **Validation**: PRODUCTION_READINESS.md
4. **Overview**: DEPLOYMENT_READINESS_SUMMARY.md

---

## KEY PHONE NUMBERS / CONTACTS

Keep these accessible:

| Service | Contact/URL |
|---------|---|
| Google App Passwords | https://myaccount.google.com/apppasswords |
| Redis Cloud | https://redis.com/cloud |
| Heroku | https://www.heroku.com |
| AWS | https://aws.amazon.com |
| Let's Encrypt | https://letsencrypt.org |
| SSL Labs | https://www.ssllabs.com |

---

**Print or bookmark this page for quick reference!**

**Status**: ✅ Ready for deployment
