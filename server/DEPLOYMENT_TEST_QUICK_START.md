# Quick Deployment Test Reference

## One-Line Test Commands

### Start Server + Test (Local)
```bash
npm start & npm run test:deployment; kill %1
```

### Windows PowerShell
```powershell
$serverProcess = Start-Process -NoNewWindow -PassThru npm -ArgumentList "start"
Start-Sleep -Seconds 3
npm run test:deployment
Stop-Process -Id $serverProcess.Id
```

### Direct Commands

**Development Test**
```bash
cd server
node deployment-test.js
```

**Production Test**
```bash
cd server
node deployment-test.js https://thehenry.com
```

**Staging Test**
```bash
cd server
node deployment-test.js https://staging.thehenry.com
```

**Custom Port/Domain**
```bash
node deployment-test.js https://custom-domain.com:8443
```

## Run Step-by-Step

### Step 1: Start Backend Server
```bash
# Terminal 1: From project root
npm start
# Or from server directory:
cd server
npm start
```

### Step 2: Wait for Server Ready
```bash
# Wait ~2 seconds for server initialization
```

### Step 3: Run Tests (In New Terminal)
```bash
# Terminal 2: From server directory
npm run test:deployment
```

### Step 4: Review Results
- ✅ Green checkmarks = Pass
- ⚠️ Warnings = Non-critical issues
- ❌ Red X = Critical failure

## What Each Test Section Checks

| Section | What It Tests | Must Pass? |
|---------|---|---|
| Backend Health | Server running & responding | ✅ Yes |
| Frontend Pages | All HTML pages accessible | ✅ Yes |
| Static Assets | CSS, JS, images load | ⚠️ Warning |
| Security Headers | CSP, X-Frame, XSS headers | ✅ Yes |
| API Endpoints | CAPTCHA, contact, newsletter | ⚠️ Warning |
| Rate Limiting | Request rate limits work | ⚠️ Warning |
| CORS | Cross-origin settings | ⚠️ Warning |
| Error Handling | 404 and error responses | ⚠️ Warning |
| Performance | Response times | ⚠️ Warning |
| SSL/TLS | HTTPS working (if applicable) | ✅ Yes |

## Deploy Only If

- ✅ ALL critical tests pass
- ❌ NO red X (failures) in critical sections
- ⚠️ Warnings are okay (non-critical)

## Expected Output for Passing Tests

```
╔════════════════════════════════════════════════════════════════╗
║     THE HENRY WEBSITE - DEPLOYMENT FUNCTIONAL TEST SUITE      ║
╚════════════════════════════════════════════════════════════════╝

🎯 Testing: http://localhost:3000

📄 FRONTEND PAGES
✅ Home Page (index.html)
✅ Court Yard Page
✅ Events Page
...

🏥 BACKEND SERVER HEALTH
✅ Server Running
✅ Health Endpoint Response

[More sections...]

╔════════════════════════════════════════════════════════════════╗
║                       TEST SUMMARY                              ║
╚════════════════════════════════════════════════════════════════╝

📊 Results:
   ✅ Passed:   45
   ⚠️  Warnings: 2
   ❌ Failed:   0
   📈 Pass Rate: 95%

✨ All critical tests passed! Website is ready for deployment.
```

## Troubleshooting Common Issues

### "Connection Refused"
**Cause:** Server not running
**Fix:**
```bash
npm start
# Make sure you're in the project root where server.js is
```

### "HTTP 404" on pages
**Cause:** HTML files not in correct location
**Fix:**
```bash
# Verify files exist
ls *.html  # On Windows: dir *.html
```

### "Request Timeout"
**Cause:** Server too slow or not responding
**Fix:**
```bash
# Check server logs for errors
# May need to increase timeout in deployment-test.js
```

### "Port 3000 already in use"
**Cause:** Another process using port 3000
**Fix:**
```bash
# Windows: Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

## Pre-Deployment Checklist

Before running tests:

- [ ] `.env` file configured with all required variables
- [ ] Backend dependencies installed: `npm install`
- [ ] All HTML files in place (root directory)
- [ ] CSS/JS files in place (styles/, scripts/) 
- [ ] No other services using port 3000
- [ ] Node.js version 14+ installed: `node --version`

## Exit Codes

```bash
node deployment-test.js
echo $?  # Shows exit code
```

- `0` = Success (ready to deploy)
- `1` = Failure (do not deploy)

## Automated CI/CD Integration

**GitHub Actions Example:**
```yaml
- name: Run Deployment Tests
  run: |
    npm install
    npm start &
    sleep 3
    npm run test:deployment
```

**GitLab CI Example:**
```yaml
test_deployment:
  script:
    - npm install
    - npm start &
    - sleep 3
    - npm run test:deployment
```

## Performance Benchmarks

Typical response times (adjust based on your server):

| Endpoint | Expected | Warning |
|----------|----------|---------|
| GET / | < 200ms | > 2000ms |
| GET /api/health | < 50ms | > 1000ms |
| POST /api/captcha | < 100ms | > 1000ms |
| GET /styles/styles.css | < 100ms | > 1000ms |

## More Information

- Full guide: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md)
- Deployment guide: [../docs/DEPLOYMENT_GUIDE.md](../docs/DEPLOYMENT_GUIDE.md)
- Backend setup: [../docs/BACKEND_README.md](../docs/BACKEND_README.md)

---

**Quick Summary:**
1. Start server: `npm start`
2. Run tests: `npm run test:deployment`
3. Review output - all critical tests must pass ✅
4. Ready to deploy if exit code is 0
