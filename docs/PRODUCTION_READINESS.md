# ✅ PRODUCTION READINESS CHECKLIST

## Complete Pre-Deployment Verification

---

## PHASE 1: CODE & CONFIGURATION

- [ ] `.env` file created with all required variables
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET` set to strong random 32+ char string
  - [ ] `ADMIN_USERNAME` changed from default
  - [ ] `HASHED_ADMIN_PASSWORD` is bcrypt hash (not plaintext)
  - [ ] Email credentials configured
  - [ ] Redis connection details set

- [ ] No hardcoded secrets in code
  - [ ] Search for hardcoded API keys
  - [ ] Search for hardcoded passwords
  - [ ] Search for hardcoded database URLs
  - [ ] Search for console.log statements with sensitive data

- [ ] `.env` file added to `.gitignore`
  - [ ] `echo ".env" >> .gitignore`
  - [ ] Verify: `git status | grep .env` returns nothing

- [ ] All dependencies installed correctly
  ```bash
  cd server
  npm install --production
  npm list
  ```

- [ ] No development dependencies in production
  - [ ] `nodemon` should NOT be in package.json
  - [ ] `devDependencies` not installed with `--production`

---

## PHASE 2: SECURITY VERIFICATION

- [ ] Bcrypt password hashing implemented
  - [ ] Test: `npm run hash-password`
  - [ ] Verify password starts with `$2b$`

- [ ] JWT secret enforcement
  - [ ] Server exits if JWT_SECRET not set
  - [ ] Test: Remove JWT_SECRET from .env, start server, should fail

- [ ] Account lockout mechanism
  - [ ] 5 failed login attempts = 30-minute lockout
  - [ ] Test: Make 6 login attempts with wrong password
  - [ ] Verify: 6th attempt returns HTTP 429

- [ ] Rate limiting enabled
  - [ ] CAPTCHA: max 10 requests/hour per IP
  - [ ] Newsletter: max 5 requests/hour per IP
  - [ ] Contact: max 5 requests/hour per IP
  - [ ] Test: Rapid-fire requests should trigger rate limit

- [ ] CORS properly configured
  - [ ] Check allowed origins
  - [ ] Update with production domain
  - [ ] Test with curl: `curl -H "Origin: wrong-domain.com"`

- [ ] Security headers active
  ```bash
  curl -i https://your-domain.com/api/health | grep -E "X-Content-Type|X-Frame|Strict"
  ```
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `Strict-Transport-Security` (for HTTPS)

- [ ] HTTPS enforced
  - [ ] HTTP redirects to HTTPS
  - [ ] SSL certificate valid
  - [ ] No mixed content warnings

---

## PHASE 3: DATABASE & PERSISTENCE

- [ ] SQLite database initialized
  ```bash
  ls -la server/data/contacts.db
  ```

- [ ] Database tables created
  ```bash
  sqlite3 server/data/contacts.db ".tables"
  # Should show: AdminSessions, Contacts, NewsletterSubscriptions
  ```

- [ ] Database indexes created
  ```bash
  sqlite3 server/data/contacts.db
  > CREATE INDEX IF NOT EXISTS idx_email ON Contacts(email);
  > CREATE INDEX IF NOT EXISTS idx_timestamp ON Contacts(timestamp);
  > .quit
  ```

- [ ] Database backup strategy in place
  - [ ] Backup location defined
  - [ ] Backup frequency scheduled (daily)
  - [ ] Test restore procedure

- [ ] Database permissions correct
  - [ ] Application can read/write
  - [ ] Backup directory exists and writable
  - [ ] Backups not publicly accessible

---

## PHASE 4: REDIS SETUP

- [ ] Redis installed and running
  ```bash
  redis-cli ping
  # Should return: PONG
  ```

- [ ] Redis connection verified
  ```bash
  node -e "
  const redis = require('redis');
  const client = redis.createClient();
  client.connect().then(() => console.log('✅ Connected')).catch(console.error);
  "
  ```

- [ ] Redis persistence configured (if not using cloud)
  - [ ] `appendonly yes` in redis.conf
  - [ ] Backup location configured

- [ ] Redis credentials set (if required)
  - [ ] Password configured in `.env`
  - [ ] REDIS_PASSWORD variable set

- [ ] Redis data cleanup scheduled
  - [ ] Old session data cleanup
  - [ ] Rate limit data cleanup
  - [ ] Monthly purge of expired entries

---

## PHASE 5: EMAIL CONFIGURATION

- [ ] Email service configured
  - [ ] Provider chosen (Gmail recommended)
  - [ ] Credentials added to `.env`

- [ ] Gmail setup (if using)
  - [ ] 2FA enabled on Gmail account
  - [ ] App password generated (https://myaccount.google.com/apppasswords)
  - [ ] 16-char password pasted in `EMAIL_PASSWORD`

- [ ] Email sending tested
  ```bash
  node test-email.js
  ```
  - [ ] Test email received
  - [ ] No delivery errors in logs

- [ ] Email templates reviewed
  - [ ] Contact confirmation email
  - [ ] Newsletter confirmation email
  - [ ] Admin notification email
  - [ ] Check for missing variables

- [ ] Email error handling
  - [ ] Failed emails logged
  - [ ] Errors don't crash server
  - [ ] Retry mechanism in place

---

## PHASE 6: AUTHENTICATION

- [ ] Admin password set
  ```bash
  node bin/hash-password.js
  # Copy bcrypt hash to HASHED_ADMIN_PASSWORD
  ```

- [ ] Login endpoint tested
  - [ ] Correct password: HTTP 200 with JWT
  - [ ] Wrong password: HTTP 401
  - [ ] 6th attempt: HTTP 429 (locked)

- [ ] JWT token validation
  - [ ] Token can be decoded
  - [ ] Token expiration set
  - [ ] Signature validation works

- [ ] Session management
  - [ ] Sessions stored in Redis
  - [ ] Sessions survive server restart
  - [ ] Sessions expire after timeout

- [ ] Logout functionality
  - [ ] Logout endpoint exists
  - [ ] Session cleared from Redis
  - [ ] Token invalidated

---

## PHASE 7: API ENDPOINTS

### Health Endpoint
- [ ] `GET /api/health` returns 200
- [ ] Response includes timestamp
- [ ] Response includes status

### Authentication Endpoints
- [ ] `POST /api/auth/login` works with correct password
- [ ] Returns JWT token in response
- [ ] Token valid for specified duration
- [ ] Token rejection after expiration

### CAPTCHA Endpoints
- [ ] `POST /api/captcha/generate` returns question
- [ ] CAPTCHA ID format is correct
- [ ] CAPTCHA expires after 10 minutes
- [ ] Math is solvable (answer is correct)

### Contact Form Endpoints
- [ ] `POST /api/contact` accepts form data
- [ ] Email validation works
- [ ] CAPTCHA verification required
- [ ] Correct CAPTCHA answer: HTTP 200
- [ ] Wrong CAPTCHA answer: HTTP 400
- [ ] Missing fields: HTTP 400
- [ ] Data stored in database

### Newsletter Endpoints
- [ ] `POST /api/newsletter` accepts email
- [ ] Email validation works
- [ ] CAPTCHA verification required
- [ ] Duplicate email handling
- [ ] Data stored in database

---

## PHASE 8: ERROR HANDLING

- [ ] All endpoints return proper HTTP status codes
  - [ ] 200 Success
  - [ ] 400 Bad Request
  - [ ] 401 Unauthorized
  - [ ] 429 Rate Limited
  - [ ] 500 Server Error

- [ ] Error messages don't leak sensitive info
  ```bash
  # Should NOT contain: database paths, server version, stack traces (in production)
  ```

- [ ] Validation errors are clear
  - [ ] Email format invalid: specific message
  - [ ] Missing field: specific message
  - [ ] Database error: generic message

- [ ] Logging configured
  - [ ] All requests logged
  - [ ] Errors logged with context
  - [ ] Log level appropriate for production

---

## PHASE 9: PERFORMANCE

- [ ] Response times acceptable (< 200ms)
  ```bash
  time curl https://your-domain.com/api/health
  ```

- [ ] Database queries optimized
  - [ ] Indexes created
  - [ ] N+1 queries avoided
  - [ ] Slow query logging enabled

- [ ] Memory usage stable
  - [ ] No memory leaks
  - [ ] Connections properly closed
  - [ ] Monitor with `pm2 monit`

- [ ] Connection pooling
  - [ ] Database connections pooled
  - [ ] Redis connections pooled
  - [ ] Max connections limit set

- [ ] Caching enabled
  - [ ] Static assets cached
  - [ ] Cache headers set
  - [ ] Redis caching for rate limits

---

## PHASE 10: MONITORING & ALERTS

- [ ] Process monitoring enabled
  - [ ] PM2 installed and running
  - [ ] Auto-restart on crash configured
  - [ ] Process logs collected

- [ ] Error tracking configured
  - [ ] Sentry or similar enabled (optional)
  - [ ] Error notifications sent
  - [ ] Error logs reviewed daily

- [ ] Health monitoring
  - [ ] Health check endpoint running
  - [ ] Uptime monitoring enabled
  - [ ] Alerts for downtime

- [ ] Performance monitoring
  - [ ] Response time tracking
  - [ ] Error rate tracking
  - [ ] Resource usage tracking

- [ ] Alerting configured
  - [ ] Email alerts for crashes
  - [ ] Slack/Discord alerts for errors
  - [ ] SMS alerts for critical issues

---

## PHASE 11: HTTPS & DOMAIN

- [ ] Domain configured
  - [ ] DNS A record points to server IP
  - [ ] Domain resolves correctly
  - [ ] Test: `nslookup your-domain.com`

- [ ] SSL certificate installed
  - [ ] Certificate valid (not self-signed)
  - [ ] Certificate not expired
  - [ ] Test: `curl -v https://your-domain.com`

- [ ] HTTPS enforced
  - [ ] HTTP 80 redirects to HTTPS 443
  - [ ] HSTS header set (Strict-Transport-Security)
  - [ ] No mixed content warnings

- [ ] SSL certificate auto-renewal
  - [ ] Renewal scheduled
  - [ ] Test renewal process
  - [ ] Alert before expiration

---

## PHASE 12: TESTING

### Functional Testing
- [ ] All endpoints tested in production
- [ ] Happy path: all operations succeed
- [ ] Error path: proper error handling
- [ ] Edge cases: empty inputs, special characters

### Load Testing
```bash
# Simulate 10 concurrent users
ab -n 100 -c 10 https://your-domain.com/api/health
# Response time should be < 500ms
```

### Security Testing
- [ ] SQL injection: test with malicious input
- [ ] XSS: test with script tags in inputs
- [ ] CSRF: test cross-site form submissions
- [ ] Rate limiting: test with rapid requests

### Data Testing
- [ ] Database records inserted correctly
- [ ] Email addresses stored securely
- [ ] Timestamps accurate
- [ ] Data integrity maintained

---

## PHASE 13: COMPLIANCE & DOCUMENTATION

- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] GDPR compliance reviewed (if EU users)
- [ ] Data retention policy documented
- [ ] Data deletion process documented

- [ ] Documentation updated
  - [ ] API documentation current
  - [ ] Deployment process documented
  - [ ] Emergency procedures documented
  - [ ] Team trained on procedures

---

## PHASE 14: BACKUP & DISASTER RECOVERY

- [ ] Database backups automated
  - [ ] Daily backup scheduled
  - [ ] Backups stored securely
  - [ ] Backups tested (can be restored)

- [ ] Backup verification
  ```bash
  # Test restore:
  sqlite3 backup.db < data/contacts.db
  sqlite3 backup.db ".tables" # Should show tables
  ```

- [ ] Disaster recovery plan
  - [ ] Recovery time objective (RTO) defined
  - [ ] Recovery point objective (RPO) defined
  - [ ] Runbook created for restore
  - [ ] Team trained on restore process

- [ ] Data replication (optional)
  - [ ] Database replicated to secondary location
  - [ ] Redis data backed up
  - [ ] Failover tested

---

## PHASE 15: FINAL VALIDATION

### Pre-Launch Checklist
- [ ] All 15 phases completed
- [ ] All tests passing
- [ ] All team members trained
- [ ] Monitoring active
- [ ] Backup functional
- [ ] Runbooks created
- [ ] Stakeholders notified

### Launch Day
- [ ] Monitor logs continuously
- [ ] Monitor uptime service
- [ ] Monitor error tracking
- [ ] Monitor database growth
- [ ] Be ready to rollback if needed

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Check for any errors
- [ ] Verify email delivery
- [ ] Verify database writes
- [ ] Gather user feedback

---

## SIGN-OFF

- [ ] Technical Lead: _________________ Date: _______
- [ ] Security: _________________ Date: _______
- [ ] DevOps/Operations: _________________ Date: _______
- [ ] Project Manager: _________________ Date: _______

---

## ROLLBACK PROCEDURE

If critical issues found:

1. **Immediate Actions**
   - [ ] Stop accepting new traffic
   - [ ] Alert team
   - [ ] Enable maintenance mode

2. **Rollback**
   - [ ] Kill current process: `pm2 delete the-henry`
   - [ ] Checkout previous version: `git checkout previous-tag`
   - [ ] Reinstall dependencies: `npm install --production`
   - [ ] Restore database: `cp backup.db data/contacts.db`
   - [ ] Restart: `pm2 start server.js`

3. **Verification**
   - [ ] Health check responds
   - [ ] Login works
   - [ ] API endpoints responding
   - [ ] Database accessible

4. **Root Cause Analysis**
   - [ ] Document what went wrong
   - [ ] Identify fix
   - [ ] Test fix thoroughly
   - [ ] Plan re-deployment

---

**Status**: Complete pre-deployment checklist

**Next**: Choose platform from PLATFORM_DEPLOYMENT_GUIDES.md and deploy!
