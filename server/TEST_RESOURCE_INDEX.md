# Test Resource Index

A complete index of all deployment testing resources for The Henry Website.

## 🎯 Core Test Files

### deployment-test.js
**Purpose:** Main comprehensive functional test suite
**Language:** JavaScript (Node.js)
**Size:** ~500 lines
**Run Time:** 30-60 seconds

**Usage:**
```bash
node deployment-test.js                    # Test localhost:3000
node deployment-test.js https://thehenry.com  # Test production
```

**Exit Codes:**
- `0` = All critical tests passed ✅ Deploy!
- `1` = Critical test failed ❌ Do not deploy

**Tests Included:** (50+ total)
- 8 frontend pages
- Backend health check
- Security headers (5 tests)
- API endpoints (3 tests)
- Rate limiting
- CORS configuration
- Error handling
- Response times
- SSL/TLS (if HTTPS)

---

### test-api.js
**Purpose:** Quick API endpoint validation
**Language:** JavaScript (Node.js)
**Run Time:** 5-10 seconds
**Related to:** deployment-test.js

**Usage:**
```bash
node test-api.js
```

**Tests:**
- Health endpoint
- CAPTCHA generation
- Contact form submission
- Newsletter subscription

---

### verify-server.js
**Purpose:** Server verification and quick checks
**Language:** JavaScript (Node.js)
**Run Time:** 2-5 seconds

**Usage:**
```bash
node verify-server.js
```

**Tests:**
- Server connectivity
- Basic response validation

---

### test-email.js
**Purpose:** Email functionality testing
**Language:** JavaScript (Node.js)

**Usage:**
```bash
node test-email.js
```

**Tests:**
- Email configuration
- Email sending (if configured)

---

## 📖 Documentation Files

### DEPLOYMENT_TESTING_OVERVIEW.md
**Size:** This comprehensive overview document
**Purpose:** Introduction to deployment testing
**Audience:** All developers
**Read Time:** 5-10 minutes

**Contains:**
- What is deployment testing?
- Overview of all resources
- Quick start guide
- Key concepts
- Common issues & solutions
- Deployment workflow

---

### DEPLOYMENT_TEST_QUICK_START.md
**Size:** 3-4 pages
**Purpose:** Fast reference for running tests
**Audience:** Developers running tests regularly
**Read Time:** 2-3 minutes

**Contains:**
- One-liner commands
- Step-by-step instructions
- Command examples
- What each section tests
- Deployment checklist
- Troubleshooting
- Performance benchmarks

---

### DEPLOYMENT_TEST_GUIDE.md
**Size:** 5-7 pages
**Purpose:** Complete reference documentation
**Audience:** Setup, troubleshooting, integration
**Read Time:** 10-15 minutes

**Contains:**
- Features overview
- Installation steps
- Complete usage guide
- All test categories
- Output format
- Configuration options
- Exit codes
- CI/CD integration
- Troubleshooting guide
- Extending tests

---

## 🖥️ Launcher Scripts

### deployment-test.bat
**Purpose:** Windows Command Prompt launcher
**Type:** Batch file
**Requires:** Node.js installed

**Usage:**
```cmd
cd server
deployment-test.bat
deployment-test.bat https://thehenry.com
```

**Features:**
- Node.js version check
- Directory validation
- Colored output
- Error handling

---

### deployment-test.ps1
**Purpose:** Windows PowerShell launcher
**Type:** PowerShell script
**Requires:** Node.js installed

**Usage:**
```powershell
cd server
.\deployment-test.ps1
.\deployment-test.ps1 -BaseUrl "https://thehenry.com"
```

**Features:**
- Node.js detection
- Parameter validation
- Error handling
- Colored output

---

## 📦 NPM Scripts

Located in `server/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test:deployment": "node deployment-test.js",
    "test:deployment:prod": "node deployment-test.js https://thehenry.com",
    "test:api": "node test-api.js"
  }
}
```

### Available Commands

| Command | What it does | When to use |
|---------|-------------|-----------|
| `npm run test:deployment` | Run full test suite on localhost | Before local deployment |
| `npm run test:deployment:prod` | Test production site | After pushing to production |
| `npm run test:api` | Run quick API tests | Testing specific endpoints |
| `npm start` | Start the server | Development/testing |
| `npm run dev` | Start with auto-reload | Development |

---

## 📊 Test Coverage Map

```
DEPLOYMENT_TEST_JS (Main)
├── Frontend Pages (8 tests)
│   ├── index.html
│   ├── court-yard.html
│   ├── events.html
│   ├── market.html
│   ├── social-media.html
│   ├── rooted-salon.html
│   ├── fill-my-cup.html
│   └── admin-login.html
├── Backend Health (2 tests)
│   ├── Server Running
│   └── Health Endpoint
├── Static Assets (3 tests)
│   ├── CSS File
│   ├── JavaScript File
│   └── Images Directory
├── Security (5 tests)
│   ├── CSP Header
│   ├── X-Content-Type-Options
│   ├── X-Frame-Options
│   ├── X-XSS-Protection
│   └── HSTS (HTTPS only)
├── API Endpoints (3 tests)
│   ├── CAPTCHA Generation
│   ├── Contact Form
│   └── Newsletter
├── Rate Limiting (2 tests)
│   ├── Headers Present
│   └── Protection Active
├── CORS (1 test)
│   └── Headers Configuration
├── Error Handling (2 tests)
│   ├── 404 Errors
│   └── Invalid Endpoints
├── Performance (2 tests)
│   ├── Home Page < 2s
│   └── API < 1s
└── SSL/TLS (2 tests)
    ├── HTTPS Connection
    └── Certificate Valid

Total: 50+ test cases
```

---

## 🔍 How to Choose Which Test to Run

### Quick Check (2 minutes)
```bash
npm run test:api
```
Best for: Quick API validation

### Full Test (1 minute)
```bash
npm run test:deployment
```
Best for: Pre-deployment validation

### Production Test (1 minute)
```bash
npm run test:deployment:prod
```
Best for: Post-deployment verification

### Custom Testing
```bash
node deployment-test.js https://custom-domain.com:8443
```
Best for: Testing specific environments

---

## 📋 Test Status Checklist

### Before Running Tests
- [ ] `npm install` completed
- [ ] `.env` file configured
- [ ] No other process on port 3000
- [ ] Node.js 14+ installed

### Running Tests
- [ ] Read quick start guide (if first time)
- [ ] Start server: `npm start`
- [ ] Open new terminal
- [ ] Run: `npm run test:deployment`

### Reviewing Results
- [ ] Check for red X (❌) failures
- [ ] Review critical test section
- [ ] Check exit code: 0 = pass, 1 = fail
- [ ] Read error messages for failures

### Deployment Decision
- [ ] All critical tests passed?
- [ ] No security issues?
- [ ] Acceptable performance?
- [ ] Ready to deploy?

---

## 🚀 Common Workflows

### Workflow 1: Local Development
```bash
# Terminal 1: Start server
npm start

# Terminal 2: Run quick test
npm run test:api

# Terminal 2: Run full test
npm run test:deployment
```

### Workflow 2: Pre-Production
```bash
# Terminal 1: Build/prepare
npm install
npm run build

# Terminal 2: Start server
npm start

# Terminal 3: Run final test
npm run test:deployment
```

### Workflow 3: Post-Production
```bash
# After deploying to production
npm run test:deployment:prod

# Or custom domain:
node deployment-test.js https://thehenry.com
```

### Workflow 4: CI/CD Pipeline
```bash
# Shell script for automated testing
npm install
npm start &
sleep 3
npm run test:deployment
TEST_RESULT=$?
kill %1
exit $TEST_RESULT
```

---

## 🔧 Configuration Reference

### Test Timeout
**File:** deployment-test.js line ~40
**Default:** 5000ms (5 seconds)
**Adjust if:** Server is slow to respond

```javascript
const TEST_CONFIG = {
  timeout: 5000,  // ms per request
  retries: 2,     // attempts per test
};
```

### Rate Limiting
**File:** deployment-test.js line ~62
**Tests:** 5 rapid requests to verify protection
**Expected:** No crashes or blocking

### Performance Thresholds
**File:** deployment-test.js line ~400+
**Home page:** < 2000ms
**API endpoint:** < 1000ms

---

## 📚 Reading Order

**For First-Time Users:**
1. Read: [DEPLOYMENT_TESTING_OVERVIEW.md](./DEPLOYMENT_TESTING_OVERVIEW.md) (this file)
2. Read: [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)
3. Run: `npm run test:deployment`
4. Reference: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md) if issues

**For Regular Users:**
1. Use: `npm run test:deployment`
2. Reference: [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)

**For Troubleshooting:**
1. Check: [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md#troubleshooting)
2. Reference: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md#troubleshooting)

**For CI/CD Integration:**
1. Read: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md#integration-with-cicd)
2. Adapt: Example script for your platform

---

## 🌐 File Locations

```
the-henry-website/
├── server/                              # Backend directory
│   ├── deployment-test.js              # ⭐ Main test suite
│   ├── deployment-test.bat             # Windows launcher
│   ├── deployment-test.ps1             # PowerShell launcher
│   ├── test-api.js                     # API tests
│   ├── test-email.js                   # Email tests
│   ├── verify-server.js                # Server verification
│   ├── DEPLOYMENT_TEST_GUIDE.md        # Full documentation
│   ├── DEPLOYMENT_TEST_QUICK_START.md  # Quick reference
│   ├── DEPLOYMENT_TESTING_OVERVIEW.md  # Overview
│   ├── TEST_RESOURCE_INDEX.md          # This file
│   └── package.json                    # NPM scripts defined here
└── docs/                                # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── PRODUCTION_READINESS.md
    ├── BACKEND_README.md
    └── ...
```

---

## 💡 Pro Tips

1. **Keep terminal open** after test to review full output
2. **Run test twice** if you get timeout (network fluctuations)
3. **Check server logs** if API tests fail
4. **Use production URL** for final verification
5. **Automate tests** in CI/CD pipeline for consistency

---

## 📞 Support Resources

- **Quick answers:** [DEPLOYMENT_TEST_QUICK_START.md](./DEPLOYMENT_TEST_QUICK_START.md)
- **Details:** [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)
- **Backend info:** [../docs/BACKEND_README.md](../docs/BACKEND_README.md)
- **Deployment info:** [../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)

---

**Version:** 1.0  
**Last Updated:** March 14, 2026  
**Created for:** The Henry Website Team
