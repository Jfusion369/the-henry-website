# 🔐 Security Audit Report - The Henry Website
**Date:** January 19, 2026  
**Status:** ⚠️ CRITICAL ISSUES FOUND

---

## Executive Summary
Your backend has **GOOD security fundamentals** but contains **3 CRITICAL vulnerabilities** that must be fixed before production deployment.

---

## 🔴 CRITICAL ISSUES

### 1. ❌ PLAINTEXT PASSWORD STORAGE
**File:** [server/routes/auth.js](server/routes/auth.js#L28-L31)  
**Severity:** 🔴 CRITICAL

**Problem:**
```javascript
// INSECURE - DO NOT USE
const validUsername = process.env.ADMIN_USERNAME || 'admin';
const validPassword = process.env.ADMIN_PASSWORD || 'change-me';

if (username !== validUsername || password !== validPassword) {
    // Direct string comparison - exposed in memory
}
```

**Why it's dangerous:**
- Passwords stored in plaintext in environment variables
- Can be extracted from memory dumps or process listings
- Direct string comparison vulnerable to timing attacks
- No password hashing = breach = all accounts compromised instantly

**Fix Required:**
Use **bcrypt** to hash passwords:
```javascript
const bcrypt = require('bcrypt');

// Store only hashed password in .env
// HASHED_ADMIN_PASSWORD='$2b$10$...'

// At login:
const isValid = await bcrypt.compare(password, process.env.HASHED_ADMIN_PASSWORD);
```

---

### 2. ❌ IN-MEMORY CAPTCHA/RATE LIMITING STORAGE
**File:** [server/utils/captcha.js](server/utils/captcha.js#L1-L11)  
**Severity:** 🔴 CRITICAL

**Problem:**
```javascript
// INSECURE - Data lost on server restart
const captchaSessions = new Map(); // Resets every restart
const rateLimitStore = new Map();   // Can be bypassed by restarting
```

**Why it's dangerous:**
- Rate limiting can be bypassed by restarting the server
- Attackers can brute force with multiple restarts
- Data lost on crashes/deployments
- Not suitable for production or horizontal scaling

**Fix Required:**
Implement **Redis** for persistent session storage:
```javascript
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Store with TTL
await client.setex(`captcha:${captchaId}`, 600, JSON.stringify(data));
```

---

### 3. ❌ WEAK JWT SECRET
**File:** [server/middleware/auth.js](server/middleware/auth.js#L8)  
**Severity:** 🔴 CRITICAL

**Problem:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
```

**Why it's dangerous:**
- Default secret is guessable (literally says "change-me")
- If not set in `.env`, **everyone's JWT tokens can be forged**
- Attackers can create admin tokens without logging in
- No token rotation mechanism

**Fix Required:**
```javascript
// In .env - MUST be set, no default allowed
JWT_SECRET=your-super-secret-key-min-32-characters-long

// In code - fail if not set
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'change-me-in-production') {
  throw new Error('FATAL: JWT_SECRET not configured!');
}
```

---

## 🟡 HIGH PRIORITY ISSUES

### 4. No Password Strength Validation
**File:** [server/routes/auth.js](server/routes/auth.js#L12-L17)  
**Severity:** 🟡 HIGH

**Problem:**
```javascript
body('password').notEmpty().withMessage('Password is required')
// Only checks if it's not empty - no strength requirements
```

**Fix:**
```javascript
body('password')
  .isLength({ min: 12 })
  .matches(/[A-Z].*[0-9]/)
  .withMessage('Password must be 12+ chars with uppercase and number')
```

---

### 5. No Account Lockout After Failed Attempts
**File:** [server/routes/auth.js](server/routes/auth.js#L28-L35)  
**Severity:** 🟡 HIGH

**Problem:**
```javascript
if (username !== validUsername || password !== validPassword) {
    console.warn(`⚠️ Failed login attempt for username: ${username}`);
    return res.status(401).json({ ... }); // No lockout!
}
```

**Why it's dangerous:**
- Attackers can make unlimited login attempts
- No progressive delays or IP blocking
- Brute force attacks are trivial

**Fix Required:**
Implement account lockout in Redis:
```javascript
// Increment failed attempts
await redis.incr(`failed:${username}`);
await redis.expire(`failed:${username}`, 900); // 15 min window

// Check threshold
if (failed >= 5) {
  // Lock account for 30 minutes
  await redis.setex(`locked:${username}`, 1800, 'true');
  return res.status(429).json({ message: 'Too many attempts. Try again later.' });
}
```

---

### 6. No HTTPS Enforcement
**File:** [server/server.js](server/server.js#L48-L50)  
**Severity:** 🟡 HIGH

**Problem:**
```javascript
res.setHeader('Strict-Transport-Security', 'max-age=31536000; ...');
// HSTS header is set, but HTTP connections still work!
```

**Fix Required:**
```javascript
// Force HTTPS redirect
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});
```

---

### 7. Timing Attack Vulnerability on CAPTCHA
**File:** [server/utils/captcha.js](server/utils/captcha.js#L97-L109)  
**Severity:** 🟡 HIGH

**Problem:**
```javascript
const correctAnswer = parseInt(session.answer);
const submittedAnswer = parseInt(userAnswer);

if (submittedAnswer === correctAnswer) { // Direct comparison
    return { success: true };
}
```

**Fix:**
```javascript
const crypto = require('crypto');

// Use constant-time comparison
const isValid = crypto.timingSafeEqual(
  Buffer.from(String(correctAnswer)),
  Buffer.from(String(submittedAnswer))
);
```

---

## 🟢 GOOD PRACTICES FOUND ✅

- ✅ Helmet.js security headers configured
- ✅ CORS properly restricted (localhost + production domain)
- ✅ JWT token expiration (24h)
- ✅ Rate limiting implemented (though in-memory)
- ✅ Body parser size limits (10MB)
- ✅ CSP headers configured
- ✅ No sensitive data in error responses
- ✅ Graceful error handling
- ✅ Cleanup of expired sessions

---

## 📋 Action Items Priority List

### Immediate (Before Production):
1. [ ] Implement bcrypt password hashing
2. [ ] Set strong JWT_SECRET in .env
3. [ ] Migrate to Redis for sessions/rate limiting
4. [ ] Implement account lockout
5. [ ] Add password strength validation
6. [ ] Force HTTPS in production

### Before Launch:
7. [ ] Add constant-time comparison for CAPTCHA
8. [ ] Implement token refresh mechanism
9. [ ] Add logging for security events
10. [ ] Set up rate limiting per endpoint

### Production-Ready:
11. [ ] Enable HTTPS with valid SSL certificate
12. [ ] Configure Redis in production
13. [ ] Set all required environment variables
14. [ ] Test brute force resistance
15. [ ] Implement security monitoring

---

## 🛠️ Required Environment Variables

Create/update `.env`:
```env
# Authentication
ADMIN_USERNAME=your-admin-username
HASHED_ADMIN_PASSWORD=$2b$10$... (bcrypt hash)
JWT_SECRET=your-strong-32-character-secret-key-here

# Redis (for production)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Server
NODE_ENV=production
PORT=3000
```

---

## 🔐 Password Reset Workflow

**Current Issue:** No way to reset forgotten admin password without code changes.

**Recommended Solution:**
1. Store password reset token in Redis with 24h expiry
2. Send token via email
3. User clicks link, enters new password
4. Hash and update stored password

---

## Testing Recommendations

```bash
# Test 1: Brute force resistance
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
done
# Should block after 5 attempts

# Test 2: JWT expiration
# Get token, wait 25 hours, try to use it
# Should be rejected

# Test 3: HTTPS enforcement
curl -I http://thehenryllc.com
# Should redirect to https://
```

---

## Summary

| Aspect | Status | Notes |
|--------|--------|-------|
| Password Security | 🔴 CRITICAL | Use bcrypt immediately |
| Session Storage | 🔴 CRITICAL | Use Redis for production |
| JWT Secret | 🔴 CRITICAL | Must be configured |
| Rate Limiting | 🟡 HIGH | Needs persistent storage |
| Account Lockout | 🟡 HIGH | Not implemented |
| HTTPS | 🟡 HIGH | Header set but not enforced |
| Overall Security | 🟠 MEDIUM | Good structure, critical fixes needed |

**Recommendation:** ⛔ **DO NOT deploy to production until critical issues are resolved.**

---

Generated by Security Audit Tool  
Last Updated: January 19, 2026
