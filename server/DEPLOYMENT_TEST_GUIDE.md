# Deployment Functional Test Suite

A comprehensive test suite to validate that The Henry Website is properly deployed and all critical components are functioning.

## Features

- ✅ **Frontend Pages** - Validates all HTML pages load correctly
- 🏥 **Backend Health** - Checks server is running and responding
- 📦 **Static Assets** - Verifies CSS, JavaScript, and images load
- 🔒 **Security Headers** - Confirms security headers are properly set (CSP, X-Frame-Options, etc.)
- 🔌 **API Endpoints** - Tests CAPTCHA generation and form validation
- ⏱️ **Rate Limiting** - Verifies rate limiting is active
- 🔄 **CORS** - Checks CORS configuration
- 🐛 **Error Handling** - Validates proper error responses
- ⚡ **Performance** - Tests response times
- 🔐 **SSL/TLS** - Validates HTTPS configuration (if applicable)

## Installation

No additional dependencies needed. The test suite uses Node.js built-in modules only.

```bash
cd server
```

## Usage

### Test Local Development Environment
```bash
node deployment-test.js
# or
node deployment-test.js http://localhost:3000
```

### Test Production Environment
```bash
node deployment-test.js https://thehenry.com
```

### Test Staging Environment
```bash
node deployment-test.js https://staging.thehenry.com
```

## Command Line Options

The test accepts an optional base URL parameter:

```
Usage: node deployment-test.js [baseUrl]

Examples:
  node deployment-test.js                    # Defaults to http://localhost:3000
  node deployment-test.js http://localhost   # Tests http://localhost:3000
  node deployment-test.js https://thehenry.com
  node deployment-test.js https://staging.thehenry.com:8443
```

## Output

The test provides clear, categorized results with the following format:

```
╔════════════════════════════════════════════════════════════════╗
║     THE HENRY WEBSITE - DEPLOYMENT FUNCTIONAL TEST SUITE      ║
╚════════════════════════════════════════════════════════════════╝

🎯 Testing: http://localhost:3000
📅 Timestamp: 2026-03-14T12:34:56.789Z
⏱️ Timeout per request: 5000ms
🔄 Retries: 2

📄 FRONTEND PAGES
✅ Home Page (index.html)
✅ Index Page
✅ Court Yard Page
...

[Test Results]

╔════════════════════════════════════════════════════════════════╗
║                       TEST SUMMARY                              ║
╚════════════════════════════════════════════════════════════════╝

📊 Results:
   ✅ Passed:   45
   ⚠️  Warnings: 2
   ❌ Failed:   0
   📈 Pass Rate: 95%
```

## Test Categories

### Critical Tests (Must Pass)
- Home page loads (HTTP 200)
- Backend server responding
- Health endpoint works
- Security headers present
- HTTPS certificate valid (for HTTPS URLs)

### Non-Critical Tests (Warnings)
- Static assets load (CSS, JS, images)
- Performance metrics
- CORS configuration
- Rate limiting headers

## Exit Codes

- `0` - All critical tests passed ✅
- `1` - One or more critical tests failed ❌

## Configuration

You can modify test parameters directly in the script:

```javascript
const TEST_CONFIG = {
  timeout: 5000,      // Request timeout in milliseconds
  retries: 2,         // Number of retries for failed requests
  // ...
};
```

## Requirements for All Tests to Pass

1. **Server Running** - Backend Node.js server must be started
2. **Frontend Files** - All HTML pages must be in place
3. **Static Assets** - CSS and JS files must be accessible
4. **Security Configuration** - Helmet security headers must be enabled
5. **Environment Variables** - Required env vars must be set (.env file)
6. **Database Connection** - Redis (if required) must be available

## Troubleshooting

### Connection Refused
```
❌ Server Running - Event: connect ECONNREFUSED 127.0.0.1:3000
```
**Solution:** Make sure the backend server is running
```bash
npm start
# or
node server/server.js
```

### Timeout Errors
```
❌ Home Page Response Time < 2s - Request timeout
```
**Solution:** Increase the timeout in the script or check server performance

### 404 Errors on Pages
```
❌ Court Yard Page - HTTP 404
```
**Solution:** Verify all HTML files exist in the root directory

### Missing Security Headers
```
❌ Content Security Policy Header - CSP header missing
```
**Solution:** Ensure Helmet middleware is properly configured in server.js

### Rate Limiting Issues
```
❌ Rate Limit Headers Present - Rate limit headers not found
```
**Solution:** Verify express-rate-limit is installed and configured

## Integration with CI/CD

You can integrate this test into your deployment pipeline:

```bash
#!/bin/bash
# Start the server
npm start &
SERVER_PID=$!

# Wait for server to be ready
sleep 3

# Run tests
node deployment-test.js

# Capture test result
TEST_RESULT=$?

# Stop the server
kill $SERVER_PID

# Exit with test result
exit $TEST_RESULT
```

## NPM Script

Add to `package.json` in the server directory:

```json
{
  "scripts": {
    "test:deployment": "node deployment-test.js",
    "test:deployment:prod": "node deployment-test.js https://thehenry.com"
  }
}
```

Then run:
```bash
npm run test:deployment
npm run test:deployment:prod
```

## What Gets Tested

### Frontend (8 pages)
- index.html
- court-yard.html
- events.html
- market.html
- social-media.html
- rooted-salon.html
- fill-my-cup.html
- admin-login.html (if applicable)

### Backend APIs
- GET /api/health
- POST /api/captcha/generate
- POST /api/contact
- POST /api/newsletter

### Security
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

### Performance
- Home page response time < 2 seconds
- API response time < 1 second

## Extending Tests

To add custom tests, extend the test suite in `deployment-test.js`:

```javascript
/**
 * Your Custom Test Suite
 */
async function testCustomFeature() {
  console.log('\n🔧 CUSTOM FEATURE\n');

  await runTest('Custom Test Name', async () => {
    const result = await makeRequest('/api/custom-endpoint');
    if (result.status !== 200) {
      throw new Error(`HTTP ${result.status}`);
    }
    // Your assertions here
  }, true); // true for critical, false for warning
}

// Add to runAllTests():
async function runAllTests() {
  // ... existing tests ...
  await testCustomFeature();
  // ... rest of tests ...
}
```

## Support

For issues or questions about the deployment tests, check:
1. [DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)
2. [BACKEND_README.md](../docs/BACKEND_README.md)
3. [PRODUCTION_READINESS.md](../docs/PRODUCTION_READINESS.md)

---

**Last Updated:** March 14, 2026
