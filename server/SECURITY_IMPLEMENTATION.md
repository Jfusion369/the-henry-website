# 🔐 Security Implementation Guide - The Henry Website

**Date:** January 19, 2026  
**Status:** ✅ All 4 critical fixes implemented

---

## What Was Implemented

### 1. ✅ Bcrypt Password Hashing
**File:** [server/routes/auth.js](../routes/auth.js)

- Passwords now hashed with bcrypt (salt rounds: 10)
- Constant-time comparison prevents timing attacks
- No plaintext passwords stored or compared

**Before:**
```javascript
if (username !== validUsername || password !== validPassword) { }
```

**After:**
```javascript
const passwordMatch = await bcrypt.compare(password, hashedPassword);
if (!passwordMatch) { }
```

---

### 2. ✅ Redis Integration for Sessions
**File:** [server/config/redis.js](../config/redis.js)

- All session data now stored in Redis
- Persistent storage survives server restarts
- TTL-based automatic cleanup
- Can scale to multiple server instances

**Benefits:**
- ✅ Rate limiting persists across restarts
- ✅ Prevents brute force via restart
- ✅ Horizontal scaling support
- ✅ Automatic garbage collection

---

### 3. ✅ JWT Secret Configuration
**File:** [server/middleware/auth.js](../middleware/auth.js)

- JWT_SECRET is now REQUIRED (no fallback default)
- Fails in production if not set
- Warns in development

**Before:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
```

**After:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production');
}
```

---

### 4. ✅ Account Lockout Mechanism
**File:** [server/routes/auth.js](../routes/auth.js#L15-L33)

- Tracks failed login attempts per username
- Locks account after 5 failed attempts
- 30-minute lockout duration
- 15-minute attempt window
- Automatic cleanup via Redis TTL

**Configuration:**
```javascript
const LOCKOUT_CONFIG = {
  MAX_ATTEMPTS: 5,           // Failures before lockout
  LOCKOUT_DURATION: 1800,    // 30 minutes
  ATTEMPT_WINDOW: 900        // 15 minutes
};
```

**Behavior:**
1. User fails login → attempt counter increments
2. After 5 failures within 15 min → account locked
3. Lock duration: 30 minutes
4. Successful login → counter reset

---

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd server
npm install
```

Status: ✅ **Done** (bcrypt and redis already installed)

---

### Step 2: Set Up Redis

#### Option A: Docker (Recommended)
```bash
docker run -d -p 6379:6379 redis:alpine
```

#### Option B: Local Installation
- **Linux:** `sudo apt install redis-server`
- **Mac:** `brew install redis`
- **Windows:** Use Windows Subsystem for Linux or Docker

#### Option C: Remote Redis (Production)
- Use managed Redis (AWS ElastiCache, Azure Cache, etc.)
- Set REDIS_HOST and REDIS_PORT in .env

---

### Step 3: Generate Credentials

#### Generate JWT_SECRET
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
```

#### Generate Bcrypt Password Hash
```bash
npm run hash-password
```

This will prompt you for your admin password and output the hash.

---

### Step 4: Create .env File
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Required
ADMIN_USERNAME=admin
HASHED_ADMIN_PASSWORD=$2b$10$your_hash_here
JWT_SECRET=your_random_secret_here_min_32_chars

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Other services...
```

---

### Step 5: Test the Setup
```bash
# Start Redis (if local)
redis-server

# In another terminal, start the server
npm run dev
```

Test endpoints:
```bash
# 1. Health check
curl http://localhost:3000/api/health

# 2. Attempt login (should succeed)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'

# 3. Attempt wrong password 5 times (should lock)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
done
# Last attempt should return 429 (Too Many Requests)
```

---

## Testing Account Lockout

```bash
# Rapid failures (should trigger lockout after 5)
for i in {1..10}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}' \
    -s | jq '.message'
  sleep 1
done
```

Expected output:
- Attempts 1-5: "Invalid username or password"
- Attempts 6-10: "Account temporarily locked. Try again in 30 minutes."

---

## Redis Inspection

### Monitor Rate Limits
```bash
redis-cli

# Check failed attempts
GET attempts:admin

# Check lockouts
GET lockout:admin

# Check CAPTCHA sessions
GET captcha:*

# View all keys
KEYS *
```

### Clear Rate Limits (Development Only)
```bash
redis-cli FLUSHDB
```

---

## Security Checklist

### Before Production Deployment

- [ ] Redis running and accessible
- [ ] All environment variables set
- [ ] JWT_SECRET is strong (32+ chars, random)
- [ ] HASHED_ADMIN_PASSWORD is bcrypt hash
- [ ] NODE_ENV=production
- [ ] HTTPS enabled
- [ ] Firewall blocks direct Redis access
- [ ] Redis password set (if exposed to network)
- [ ] Regular password rotations documented
- [ ] Database backups configured
- [ ] Monitoring/alerting enabled
- [ ] Rate limits reviewed for production traffic
- [ ] Account lockout timing appropriate

---

## Security Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| Password Hashing | ✅ | bcrypt with salt rounds 10 |
| Session Storage | ✅ | Redis with TTL expiry |
| Rate Limiting | ✅ | 5 failures/15min, 30min lockout |
| Account Lockout | ✅ | Auto-unlock after duration |
| JWT Validation | ✅ | 24h token expiry, strong secret |
| Timing Attack Protection | ✅ | Constant-time password comparison |
| Persistent Storage | ✅ | Redis survives server restarts |
| HTTPS Enforcement | ⚠️ | Needs reverse proxy/load balancer |

---

## Monitoring & Logs

### Failed Login Attempts
Logged as:
```
⚠️ Failed login attempt for username: admin
🔒 Account locked after 5 failed attempts: admin
```

### Successful Auth
```
✅ Admin login successful for user: admin
✅ Token verified for user: admin
```

### Redis Events
```
✅ Redis connected
🔄 Redis reconnecting...
❌ Redis error: [error details]
```

---

## Troubleshooting

### Issue: "Redis not initialized"
**Solution:** Ensure Redis is running and server started with `npm run dev` or `npm start`

### Issue: "JWT_SECRET is required in production"
**Solution:** Set JWT_SECRET in .env file with a strong random value

### Issue: "Invalid username or password" (all attempts)
**Solution:** Verify HASHED_ADMIN_PASSWORD is correct bcrypt hash. Regenerate with `npm run hash-password`

### Issue: Account locked immediately
**Solution:** Check Redis is accessible. May indicate Redis connection failure (fails open, allows login)

### Issue: Cannot connect to Redis
**Solution:**
```bash
# Check Redis running
redis-cli ping
# Should output: PONG

# Check host/port in .env match Redis server
netstat -an | grep 6379  # Linux/Mac
netstat -ano | findstr :6379  # Windows
```

---

## Password Reset (Manual Process)

Until a password reset endpoint is implemented:

1. Admin requests password reset
2. Admin verifies identity (email, security questions)
3. Admin uses `npm run hash-password` to generate new hash
4. Update HASHED_ADMIN_PASSWORD in .env
5. Restart server: `npm run dev`

**Recommended Future:** Implement email-based password reset with secure tokens.

---

## Next Steps

### High Priority
1. Deploy Redis (local or managed service)
2. Test all 4 security implementations
3. Monitor logs for account lockout issues
4. Train admins on password reset process

### Medium Priority
1. Implement email-based password reset
2. Add security event logging to database
3. Set up monitoring/alerting
4. Regular security audits

### Low Priority
1. Implement token refresh mechanism
2. Add admin dashboard for security settings
3. Two-factor authentication (2FA)
4. IP whitelisting for admin panel

---

## Version History

| Date | Change | Status |
|------|--------|--------|
| Jan 19, 2026 | Implement all 4 security fixes | ✅ Complete |
| - | Add bcrypt password hashing | ✅ Done |
| - | Set up Redis integration | ✅ Done |
| - | Fix JWT secret requirement | ✅ Done |
| - | Add account lockout mechanism | ✅ Done |

---

**Implemented by:** Security Audit & Implementation Team  
**Status:** ✅ Ready for Testing  
**Next Review:** February 19, 2026
