# 🔐 SECURITY GUIDE - Complete Reference

> **Last Updated:** January 19, 2026  
> **Status:** ⚠️ Conditionally Ready for Public Deployment

---

## 📋 Quick Navigation

- [Executive Summary](#executive-summary)
- [Current Security Status](#current-security-status)
- [Implemented Security Features](#implemented-security-features)
- [Critical Issues to Fix](#critical-issues-to-fix)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Security Testing](#security-testing)
- [Post-Deployment Operations](#post-deployment-operations)

---

## Executive Summary

This project has **excellent security foundations** with proper implementation of:
- ✅ Bcrypt password hashing
- ✅ JWT authentication with secret enforcement
- ✅ Account lockout mechanism (5 attempts → 30-min lock)
- ✅ CAPTCHA protection on public forms
- ✅ Rate limiting per IP
- ✅ Security headers (Helmet, HSTS, CSP)
- ✅ Input validation and sanitization

**However, CRITICAL gaps must be fixed before public deployment:**
1. ❌ **NO HTTPS/TLS** - Data transmitted in plaintext
2. ❌ **JWT_SECRET may not be configured** - Development fallback too permissive
3. ⚠️ **Redis optional** - Account lockout disabled during outages

---

## Current Security Status

### Overall Rating: ⚠️ **CONDITIONALLY READY**

| Category | Status | Risk |
|----------|--------|------|
| **Authentication** | ✅ Strong | Low |
| **Password Security** | ✅ Excellent | Low |
| **Session Management** | ✅ Good | Low |
| **Input Validation** | ✅ Good | Low |
| **HTTPS/TLS** | ❌ Missing | **CRITICAL** |
| **Environment Config** | ✅ Good | Low |
| **Rate Limiting** | ✅ Implemented | Low |
| **CAPTCHA** | ✅ Working | Low |
| **Security Headers** | ✅ Configured | Low |
| **Database** | ✅ Secured | Low |

---

## Implemented Security Features

### 1. Authentication & Password Hashing

**Technology:** Bcrypt 6.0.0

**How it works:**
```javascript
// Password comparison uses constant-time comparison
// Prevents timing attacks
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Features:**
- ✅ 10-round salt (default)
- ✅ Constant-time comparison
- ✅ No plaintext storage
- ✅ Immune to rainbow tables

**Testing:**
```bash
npm run hash-password  # Generate bcrypt hash
```

---

### 2. Account Lockout Mechanism

**Configuration:**
- **Max Attempts:** 5 failed logins
- **Lockout Duration:** 30 minutes
- **Attempt Window:** 15 minutes

**Behavior:**
```
Attempt 1: REJECTED (wrong password)
Attempt 2: REJECTED
Attempt 3: REJECTED
Attempt 4: REJECTED
Attempt 5: REJECTED
Attempt 6: HTTP 429 - LOCKED (30 min timeout)
```

**Storage:** Redis-backed (survives server restart)

**Test Command:**
```bash
# 6 failed login attempts trigger lockout
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
done
```

---

### 3. JWT Token Authentication

**Secret Management:**
- ✅ Required in production (enforced at startup)
- ⚠️ Warning in development if not set
- ❌ FATAL error in production if missing

**Token Features:**
- Issued on successful login
- Contains username and issued timestamp
- Verified on protected endpoints
- No sensitive data in token body

**Generate Strong Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: abc123def456...
```

---

### 4. CAPTCHA Protection

**Type:** Math-based (not bypassable by bots)

**Questions:**
- Addition: 0-50 + 0-50
- Subtraction: 50-120 - 0-50
- Multiplication: 1-12 × 1-12

**Rate Limits:**
- 10 CAPTCHA requests per IP per hour
- 5 form submissions per IP per hour
- 5 newsletter subscriptions per IP per hour

**Implementation:**
```javascript
// CAPTCHA expires after 10 minutes
// IP-based tracking
// Redis-backed with fallback
```

---

### 5. Security Headers

**Helmet.js Configuration:**

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | SAMEORIGIN | Prevent clickjacking |
| `X-Content-Type-Options` | nosniff | Prevent MIME sniffing |
| `X-XSS-Protection` | 1; mode=block | XSS protection |
| `Strict-Transport-Security` | max-age=31536000 | HTTPS enforcement |
| `Content-Security-Policy` | Strict directives | XSS/injection prevention |
| `Referrer-Policy` | strict-origin-when-cross-origin | Privacy |
| `Permissions-Policy` | Restrictive | Feature access control |

**Check Headers:**
```bash
curl -I https://thehenry.com
# Should show all security headers
```

---

### 6. Input Validation

**Tools:** express-validator 7.0.0

**Validation Rules:**

**Login Endpoint:**
```javascript
body('username').trim().notEmpty().withMessage('Required')
body('password').notEmpty().withMessage('Required')
```

**Contact Form:**
```javascript
body('name').trim().notEmpty()
body('email').isEmail()  // Email format validation
body('phone').optional().trim()
body('message')
  .trim()
  .notEmpty()
  .isLength({ min: 10 })  // Minimum 10 characters
```

**Newsletter:**
```javascript
body('email').isEmail()
```

---

### 7. CORS Protection

**Configuration:**
- ✅ Restricted origins
- ✅ Credentials handling
- ✅ Method restrictions

---

### 8. Database Security

**SQLite Implementation:**
- ✅ Parameterized queries
- ✅ Proper data types
- ✅ Indexed tables

**Tables:**
- `Contacts` - Form submissions
- `NewsletterSubscriptions` - Email list
- `AdminSessions` - Login tracking (Redis preferred)

---

## Critical Issues to Fix

### 🚨 ISSUE #1: NO HTTPS/TLS

**Problem:** All data transmitted in plaintext
**Risk:** Complete compromise of passwords and data
**Solution:** Enable SSL/TLS certificate

**By Platform:**

**Heroku:**
```bash
# Automatic for paid dyno or custom domain
# Use Let's Encrypt with free dyno
```

**AWS:**
```bash
# Use AWS Certificate Manager (free)
# Or: Let's Encrypt with Certbot on EC2
```

**DigitalOcean:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d thehenry.com
```

**Azure:**
```bash
# Use App Service Certificates or Let's Encrypt
```

**VPS (Any Provider):**
```bash
# Install and run Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d thehenry.com
```

**Verify HTTPS Works:**
```bash
# Should show A+ grade
https://www.ssllabs.com/ssltest/analyze.html?d=thehenry.com
```

---

### 🚨 ISSUE #2: JWT_SECRET Configuration

**Problem:** May not be set in production
**Risk:** Default secret compromises token security

**Solution:**

1. **Generate Strong Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Set in Environment:**
```bash
# Linux/Mac
export JWT_SECRET="your-secret-here"

# Windows (PowerShell)
$env:JWT_SECRET="your-secret-here"

# Docker/Production
# Set via deployment platform environment variables
```

3. **Verify It's Set:**
```bash
# Should not show "WARNING: Using default secret"
npm start
```

---

### 🚨 ISSUE #3: Redis Optional Without Fallback

**Problem:** Account lockout disabled if Redis unavailable
**Risk:** Brute force attacks succeed during Redis outage

**Solution:**

**Option A: Use Managed Redis (Recommended)**
- Heroku Heroku Redis
- AWS ElastiCache
- DigitalOcean Managed Redis
- Azure Cache for Redis

**Option B: Self-Hosted Redis**
```bash
# Production Redis setup
redis-server --daemonize yes --requirepass strong_password
```

**Option C: Implement Fallback (Future Enhancement)**
```javascript
// File-based lockout tracking
// Only if Redis unavailable
```

---

## Pre-Deployment Checklist

### CRITICAL - Must Complete ✅

- [ ] **HTTPS/TLS Enabled**
  - [ ] Certificate installed
  - [ ] HTTP → HTTPS redirect working
  - [ ] HSTS header present
  - [ ] Test with ssllabs.com

- [ ] **Environment Variables Set**
  - [ ] `JWT_SECRET` - Strong random 32+ char
  - [ ] `ADMIN_USERNAME` - Unique username
  - [ ] `HASHED_ADMIN_PASSWORD` - Bcrypt hash
  - [ ] `EMAIL_USER` - Email account
  - [ ] `EMAIL_PASSWORD` - App-specific password
  - [ ] `NODE_ENV=production`

- [ ] **Redis Configured**
  - [ ] Redis running in production
  - [ ] Connection verified
  - [ ] Password set (if applicable)
  - [ ] Persistence enabled

- [ ] **Database Initialized**
  - [ ] Contacts table created
  - [ ] NewsletterSubscriptions table created
  - [ ] Indices created
  - [ ] Backup configured

- [ ] **Security Testing**
  - [ ] Test account lockout (6 wrong attempts)
  - [ ] Test CAPTCHA (10+ requests = rate limited)
  - [ ] Test valid login (correct password)
  - [ ] Test email notification
  - [ ] Verify all endpoints respond
  - [ ] Check security headers (securityheaders.com)

### HIGH - Should Complete ✅

- [ ] **Monitoring Setup**
  - [ ] Error tracking (Sentry/LogRocket)
  - [ ] Uptime monitoring
  - [ ] Alert thresholds configured
  - [ ] Notification channels set

- [ ] **Backup Strategy**
  - [ ] Automated daily backups
  - [ ] Backups encrypted
  - [ ] Restore procedure tested
  - [ ] Off-site storage configured

- [ ] **Logging**
  - [ ] Request logging enabled
  - [ ] Failed logins tracked
  - [ ] Error logs captured
  - [ ] Log rotation configured

- [ ] **Documentation**
  - [ ] Deployment notes updated
  - [ ] Emergency procedures documented
  - [ ] Admin credentials stored securely
  - [ ] Team access documented

### MEDIUM - Nice to Have ✅

- [ ] Add request logging (morgan)
- [ ] Add application monitoring (PM2 Plus)
- [ ] Set up CSP violation reporting
- [ ] Implement security.txt
- [ ] Add health check dashboard
- [ ] Document incident response

---

## Security Testing

### Test 1: Authentication

```bash
# Test wrong password (should get 401)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'
# Response: 401 - Invalid username or password

# Test correct password (should get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
# Response: 200 - {"success":true,"token":"..."}
```

### Test 2: Account Lockout

```bash
# Run 6 failed login attempts
# 6th attempt should return 429
for i in {1..6}; do
  echo "Attempt $i"
  curl -s -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}' \
    | grep -o '"success":[^,]*'
done

# Expected: 6th should return 429 Too Many Requests
```

### Test 3: CAPTCHA

```bash
# Generate CAPTCHA
CAPTCHA=$(curl -s http://localhost:3000/api/captcha/generate)
CAPTCHA_ID=$(echo $CAPTCHA | jq -r '.captchaId')

# Answer (would need to solve)
curl -X POST http://localhost:3000/api/captcha/verify \
  -H "Content-Type: application/json" \
  -d "{\"captchaId\":\"$CAPTCHA_ID\",\"answer\":50}"
```

### Test 4: Rate Limiting

```bash
# Make 11 CAPTCHA requests (10th should be rate limited)
for i in {1..11}; do
  echo "Request $i"
  curl -s http://localhost:3000/api/captcha/generate | jq '.success'
done
```

### Test 5: Security Headers

```bash
# Check all security headers
curl -I https://thehenry.com

# Should include:
# - Strict-Transport-Security
# - X-Frame-Options
# - X-Content-Type-Options
# - Content-Security-Policy
# - X-XSS-Protection
```

---

## Post-Deployment Operations

### Daily
- Check error logs
- Monitor uptime
- Verify backups completed

### Weekly
- Review failed login attempts
- Check rate limit violations
- Update dependencies

### Monthly
- Security log analysis
- Performance review
- Backup restoration test
- Update documentation

### Quarterly
- Full security audit
- Penetration testing (consider hiring)
- Dependency vulnerability scan
- Policy review

---

## Incident Response

### If Account Locked

```bash
# Clear lockout (Redis)
redis-cli DEL lockout:admin

# Or wait 30 minutes for automatic release
```

### If Redis Crashes

**Impact:** Account lockout disabled (high security risk)

**Recovery:**
1. Restart Redis
2. Check account lockout status
3. Review login attempts
4. Monitor for abuse

**Prevention:**
- Use managed Redis (better uptime)
- Set up monitoring/alerts
- Auto-restart on failure

### If Credentials Compromised

1. Change `ADMIN_PASSWORD` immediately
2. Clear all sessions: `redis-cli FLUSHDB`
3. Review access logs
4. Enable enhanced monitoring

---

## Quick Reference Commands

```bash
# Generate password hash
npm run hash-password

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"hash"}'

# Check security headers
curl -I https://thehenry.com

# Redis commands
redis-cli PING              # Test connection
redis-cli DEL lockout:admin # Clear lockout
redis-cli FLUSHDB          # Clear all sessions
redis-cli INFO             # Server info
```

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Bcrypt Guide](https://github.com/kelektiv/node.bcrypt.js)
- [Helmet.js Docs](https://helmetjs.github.io/)
- [JWT.io](https://jwt.io/)

---

## Summary

This project implements **industry-best-practice security** with proper authentication, authorization, and data protection. Before public deployment, ensure HTTPS is enabled and all environment variables are correctly configured.

**Status:** Ready for deployment after addressing critical issues.

**Estimated Setup Time:** 2-4 hours (with HTTPS + verification)

**Support:** See DEPLOYMENT_GUIDE.md for platform-specific instructions.
