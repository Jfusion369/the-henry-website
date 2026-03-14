# Testing Resources - The Henry Website

Complete deployment testing suite for The Henry LLC website.

## 📍 You Are Here

`server/` - Backend server directory with all testing tools

## 🎯 What is This?

A comprehensive testing suite that validates your website is working correctly before and after deployment. Run tests, get clear results, then deploy with confidence.

## ⚡ 30-Second Quick Start

```bash
# Terminal 1 - Start the backend
npm start

# Terminal 2 - Run tests (in server directory)
npm run test:deployment
```

**Result:** ✅ All critical tests passed? Deploy! ❌ Failures? Fix them first.

## 📦 What's Included

### Test Files
- **`deployment-test.js`** - Main test suite (50+ tests) ⭐
- **`test-api.js`** - Quick API endpoint tests
- **`test-email.js`** - Email functionality tests
- **`verify-server.js`** - Server verification

### Launchers (Windows)
- **`deployment-test.bat`** - Batch script launcher
- **`deployment-test.ps1`** - PowerShell script launcher

### Documentation
- **`DEPLOYMENT_TESTING_OVERVIEW.md`** - Complete overview
- **`DEPLOYMENT_TEST_QUICK_START.md`** - Fast reference
- **`DEPLOYMENT_TEST_GUIDE.md`** - Full documentation
- **`TEST_RESOURCE_INDEX.md`** - Resource index
- **`DEPLOYMENT_TEST_CHEATSHEET.txt`** - Print-friendly cheat sheet

### Configuration
- **`package.json`** - NPM scripts defined here

## 🚀 Common Commands

### Test Development Environment
```bash
npm run test:deployment
```

### Test Production Environment  
```bash
npm run test:deployment:prod

# Or with custom URL:
node deployment-test.js https://thehenry.com
```

### Quick API Tests Only
```bash
npm run test:api
```

### Start Server
```bash
npm start          # Production mode
npm run dev        # Development with auto-reload
```

## ✅ What Gets Tested

### Critical Tests (Must Pass ✅)
- [x] Frontend pages load (8 pages)
- [x] Backend server running
- [x] Security headers present
- [x] Health endpoint responds
- [x] HTTPS/SSL working (if applicable)

### Functional Tests (API)
- [x] CAPTCHA generation
- [x] Contact form validation
- [x] Newsletter validation
- [x] Email configuration

### Infrastructure Tests
- [x] Static assets (CSS, JS, images)
- [x] Rate limiting active
- [x] CORS configuration
- [x] Error handling proper

### Performance Tests
- [x] Home page < 2 seconds
- [x] API responses < 1 second

## 📊 Test Results

### Passing Output
```
✅ Passed:   45
⚠️  Warnings: 2
❌ Failed:   0
📈 Pass Rate: 95%

✨ All critical tests passed! Website is ready for deployment.
```
Exit code: `0` → ✅ Deploy!

### Failing Output
```
✅ Passed:   32
⚠️  Warnings: 2
❌ Failed:   3
📈 Pass Rate: 66%

❌ CRITICAL FAILURES:
   ❌ Server Running - Connection refused
```
Exit code: `1` → ❌ Fix issues first!

## 🔧 Before Running Tests

Ensure you have:

**1. Node.js installed** (v14+)
```bash
node --version
```

**2. Dependencies installed**
```bash
npm install
```

**3. Environment variables** (`.env` file)
```bash
ADMIN_USERNAME=admin
HASHED_ADMIN_PASSWORD=...
JWT_SECRET=...
```

**4. Port 3000 available**
```bash
# Windows - check port
netstat -ano | findstr :3000

# Kill if needed
taskkill /PID <PID> /F
```

## 📚 Documentation Guide

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [DEPLOYMENT_TESTING_OVERVIEW.md](./DEPLOYMENT_TESTING_OVERVIEW.md) | Introduction & concepts | 5-10 min |
| [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md) | Fast reference guide | 2-3 min |
| [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md) | Complete reference | 10-15 min |
| [TEST_RESOURCE_INDEX.md](./TEST_RESOURCE_INDEX.md) | File index & workflows | 5 min |
| [DEPLOYMENT_TEST_CHEATSHEET.txt](./DEPLOYMENT_TEST_CHEATSHEET.txt) | Print-friendly reference | 2 min |

**First time?** Start with [DEPLOYMENT_TESTING_OVERVIEW.md](./DEPLOYMENT_TESTING_OVERVIEW.md)

**Need quick answer?** See [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)

**Troubleshooting?** Check [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md#troubleshooting)

## 🐛 Troubleshooting

### Server won't start (Connection refused)
```bash
# Make sure you're in the server directory
cd server

# Then start
npm start
```

### Port 3000 already in use
```bash
# Find process using port
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F

# Try again
npm start
```

### Tests timeout
Server is slow. Give it more time:
1. Check server logs for errors
2. Verify database connection
3. Increase timeout in deployment-test.js

### Can't find test files
Make sure you're in the correct directory:
```bash
cd server
npm run test:deployment
```

### Missing .env file errors
Create `.env` file with required variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🔄 Typical Workflow

### Before Deployment
```bash
# 1. Start server in Terminal 1
npm start

# 2. Run tests in Terminal 2
npm run test:deployment

# 3. Check results
# Exit code 0? Ready to deploy!
```

### After Deployment
```bash
# Test production environment
npm run test:deployment:prod

# Or with custom domain
node deployment-test.js https://thehenry.com
```

## 📋 Deployment Checklist

Before running tests:
- [ ] All code changes committed
- [ ] Dependencies installed: `npm install`
- [ ] `.env` file configured
- [ ] Port 3000 available
- [ ] Node.js v14+ installed

After tests pass:
- [ ] All critical tests green ✅
- [ ] No red X marks ❌
- [ ] Exit code is 0
- [ ] Ready to deploy ✨

## 🎯 Deployment Decision

| Test Result | Action |
|-------------|--------|
| Exit code 0, no red X | ✅ DEPLOY |
| Exit code 1, has red X | ❌ FIX ISSUES |
| Exit code 0, yellow warns | ⚠️ OK TO DEPLOY |

## 📞 Support

- **Questions?** Check the docs in this directory
- **Setup issues?** See [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)
- **Quick answers?** Use [DEPLOYMENT_TEST_CHEATSHEET.txt](./DEPLOYMENT_TEST_CHEATSHEET.txt)
- **Full details?** See [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)

## 📁 File Structure

```
server/
├── deployment-test.js                  ⭐ Main test suite
├── deployment-test.bat                 Windows launcher
├── deployment-test.ps1                 PowerShell launcher
├── test-api.js                         API tests
├── test-email.js                       Email tests
├── verify-server.js                    Server verification
├── package.json                        NPM scripts
├── DEPLOYMENT_TESTING_OVERVIEW.md      📖 Overview
├── DEPLOYMENT_TEST_QUICK_START.md      📖 Quick reference
├── DEPLOYMENT_TEST_GUIDE.md            📖 Full guide
├── TEST_RESOURCE_INDEX.md              📖 Resource index
├── DEPLOYMENT_TEST_CHEATSHEET.txt      📖 Cheat sheet
└── README.md                           This file
```

## 🚀 Quick Command Reference

```bash
# Start development server
npm start

# Start with auto-reload
npm run dev

# Run full deployment test
npm run test:deployment

# Run production test
npm run test:deployment:prod

# Run quick API test
npm run test:api

# Test custom URL
node deployment-test.js https://custom.com

# Hash admin password
npm run hash-password

# Run migrations
npm run migrate
```

## 📊 Test Coverage

**50+ total test cases** covering:
- ✅ Frontend (8 pages)
- ✅ Backend (health, API)
- ✅ Security (5+ headers)
- ✅ API endpoints (3+ routes)
- ✅ Performance (response times)
- ✅ Infrastructure (rate limiting, CORS)
- ✅ Error handling
- ✅ SSL/TLS (if HTTPS)

## ✨ Key Features

✅ **Comprehensive** - 50+ test cases  
✅ **Fast** - 30-60 seconds  
✅ **Clear** - Color-coded results  
✅ **Automated** - Single command  
✅ **CI/CD Ready** - Exit codes for automation  
✅ **Well Documented** - Multiple guides  
✅ **Cross-platform** - Windows, Mac, Linux  

## 🎓 Learning More

1. **First deployment?** Start with [DEPLOYMENT_TESTING_OVERVIEW.md](./DEPLOYMENT_TESTING_OVERVIEW.md)
2. **Quick lookup?** Use [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)
3. **Need details?** Read [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)
4. **Finding something?** Check [TEST_RESOURCE_INDEX.md](./TEST_RESOURCE_INDEX.md)
5. **Print reference?** Use [DEPLOYMENT_TEST_CHEATSHEET.txt](./DEPLOYMENT_TEST_CHEATSHEET.txt)

## 🔗 Related Documentation

- Backend setup: [../docs/BACKEND_README.md](../docs/BACKEND_README.md)
- Deployment guide: [../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)
- Production readiness: [../docs/PRODUCTION_READINESS.md](../docs/PRODUCTION_READINESS.md)
- Security guide: [../docs/SECURITY_GUIDE.md](../docs/SECURITY_GUIDE.md)

## 📝 Version History

- **v1.0** (March 14, 2026) - Initial deployment testing suite

---

## Next Steps

1. **First time?** 
   - Read: [DEPLOYMENT_TESTING_OVERVIEW.md](./DEPLOYMENT_TESTING_OVERVIEW.md)
   - Then: Run `npm run test:deployment`

2. **Ready to test?**
   ```bash
   npm start              # Terminal 1
   npm run test:deployment  # Terminal 2
   ```

3. **Got questions?**
   - Quick answers: [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)
   - Full guide: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)

---

**Made with ❤️ by The Henry Website Team**  
**Version 1.0 • March 14, 2026**
