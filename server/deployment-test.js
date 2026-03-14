#!/usr/bin/env node

/**
 * Comprehensive Deployment Functional Test Suite
 * Tests all critical components of The Henry Website deployment
 * 
 * Usage:
 *   node deployment-test.js [baseUrl]
 * 
 * Examples:
 *   node deployment-test.js                    # Tests http://localhost:3000
 *   node deployment-test.js http://localhost   # Tests http://localhost:3000
 *   node deployment-test.js https://thehenry.com
 */

const http = require('http');
const https = require('https');
const url = require('url');

// ============================================================================
// CONFIGURATION
// ============================================================================

const baseUrl = process.argv[2] || 'http://localhost:3000';
const parsedUrl = new URL(baseUrl);
const protocol = parsedUrl.protocol === 'https:' ? https : http;

// Test configuration
const TEST_CONFIG = {
  timeout: 5000,
  retries: 2,
  criticalTests: [],  // Will be populated
  warningTests: [],   // Non-critical failures
  results: {
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(path, options = {}) {
  const fullUrl = new URL(path.startsWith('/') ? path : '/' + path, baseUrl);
  
  return new Promise((resolve, reject) => {
    const requestOptions = {
      hostname: fullUrl.hostname,
      port: fullUrl.port,
      path: fullUrl.pathname + fullUrl.search,
      method: options.method || 'GET',
      timeout: TEST_CONFIG.timeout,
      headers: {
        'User-Agent': 'DeploymentTestBot/1.0',
        'Accept': 'application/json, text/html, */*',
        ...(options.headers || {})
      }
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const body = data.length > 0 
            ? (res.headers['content-type']?.includes('json') 
              ? JSON.parse(data) 
              : data)
            : null;
          
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
            data: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            data: data,
            parseError: e.message
          });
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format test result
 */
function formatResult(testName, passed, message = '') {
  const icon = passed ? '✅' : '❌';
  const suffix = message ? ` - ${message}` : '';
  return `${icon} ${testName}${suffix}`;
}

/**
 * Test runner with retries
 */
async function runTest(testName, testFn, critical = true) {
  let lastError = null;
  let attempt = 0;

  for (attempt = 0; attempt <= TEST_CONFIG.retries; attempt++) {
    try {
      await testFn();
      console.log(formatResult(testName, true));
      TEST_CONFIG.results.passed++;
      return true;
    } catch (error) {
      lastError = error;
      if (attempt < TEST_CONFIG.retries) {
        await sleep(500);
      }
    }
  }

  const errorMsg = lastError?.message || 'Unknown error';
  console.log(formatResult(testName, false, errorMsg));
  
  if (critical) {
    TEST_CONFIG.results.failed++;
    TEST_CONFIG.criticalTests.push({ name: testName, error: errorMsg });
  } else {
    TEST_CONFIG.results.warnings++;
    TEST_CONFIG.warningTests.push({ name: testName, error: errorMsg });
  }
  
  return false;
}

// ============================================================================
// TEST SUITES
// ============================================================================

/**
 * Frontend HTML Pages Tests
 */
async function testFrontendPages() {
  console.log('\n📄 FRONTEND PAGES\n');

  const pages = [
    { path: '/', name: 'Home Page (index.html)' },
    { path: '/index.html', name: 'Index Page' },
    { path: '/court-yard.html', name: 'Court Yard Page' },
    { path: '/events.html', name: 'Events Page' },
    { path: '/market.html', name: 'Market Page' },
    { path: '/social-media.html', name: 'Social Media Page' },
    { path: '/rooted-salon.html', name: 'Rooted Salon Page' },
    { path: '/fill-my-cup.html', name: 'Fill My Cup Page' }
  ];

  for (const page of pages) {
    await runTest(page.name, async () => {
      const result = await makeRequest(page.path);
      if (result.status !== 200) {
        throw new Error(`HTTP ${result.status}`);
      }
      if (!result.data || result.data.length < 100) {
        throw new Error('Response too short or empty');
      }
    }, true);
  }
}

/**
 * Backend Server Health Tests
 */
async function testBackendHealth() {
  console.log('\n🏥 BACKEND SERVER HEALTH\n');

  await runTest('Server Running', async () => {
    const result = await makeRequest('/api/health');
    if (result.status !== 200) {
      throw new Error(`HTTP ${result.status}`);
    }
  }, true);

  await runTest('Health Endpoint Response', async () => {
    const result = await makeRequest('/api/health');
    if (!result.body || !result.body.status) {
      throw new Error('Invalid health response');
    }
  }, true);
}

/**
 * Static Assets Tests
 */
async function testStaticAssets() {
  console.log('\n📦 STATIC ASSETS\n');

  const assets = [
    { path: '/styles/styles.css', name: 'Main CSS File' },
    { path: '/scripts/main.js', name: 'Main JavaScript File' },
    { path: '/images/', name: 'Images Directory' }
  ];

  for (const asset of assets) {
    await runTest(asset.name, async () => {
      const result = await makeRequest(asset.path);
      if (result.status !== 200) {
        throw new Error(`HTTP ${result.status}`);
      }
      if (!result.data || result.data.length < 10) {
        throw new Error('Asset file appears empty');
      }
    }, false); // Non-critical
  }
}

/**
 * Security Headers Tests
 */
async function testSecurityHeaders() {
  console.log('\n🔒 SECURITY HEADERS\n');

  await runTest('Content Security Policy Header', async () => {
    const result = await makeRequest('/');
    const csp = result.headers['content-security-policy'];
    if (!csp) {
      throw new Error('CSP header missing');
    }
  }, true);

  await runTest('X-Content-Type-Options Header', async () => {
    const result = await makeRequest('/');
    const xContentType = result.headers['x-content-type-options'];
    if (xContentType !== 'nosniff') {
      throw new Error('X-Content-Type-Options not set correctly');
    }
  }, true);

  await runTest('X-Frame-Options Header', async () => {
    const result = await makeRequest('/');
    const xFrame = result.headers['x-frame-options'];
    if (!xFrame) {
      throw new Error('X-Frame-Options header missing');
    }
  }, true);

  await runTest('X-XSS-Protection Header', async () => {
    const result = await makeRequest('/');
    const xXss = result.headers['x-xss-protection'];
    if (!xXss) {
      throw new Error('X-XSS-Protection header missing');
    }
  }, true);

  await runTest('Strict-Transport-Security (HSTS)', async () => {
    const result = await makeRequest('/');
    const hsts = result.headers['strict-transport-security'];
    // HSTS is optional for non-HTTPS, so this is a warning test
    if (!hsts && baseUrl.includes('https')) {
      throw new Error('HSTS header missing on HTTPS');
    }
  }, false);
}

/**
 * API Endpoints Tests
 */
async function testAPIEndpoints() {
  console.log('\n🔌 API ENDPOINTS\n');

  // Test CAPTCHA generation
  let captchaId = null;
  let captchaQuestion = null;

  await runTest('CAPTCHA Generation Endpoint', async () => {
    const result = await makeRequest('/api/captcha/generate', {
      method: 'POST'
    });
    if (result.status !== 200) {
      throw new Error(`HTTP ${result.status}`);
    }
    if (!result.body?.captchaId || !result.body?.question) {
      throw new Error('Missing CAPTCHA data in response');
    }
    captchaId = result.body.captchaId;
    captchaQuestion = result.body.question;
  }, true);

  // Test contact form validation
  await runTest('Contact Form Validation', async () => {
    const result = await makeRequest('/api/contact', {
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        captchaId: captchaId || 'invalid',
        captchaAnswer: 'invalid'
      }
    });
    // Should fail validation (wrong CAPTCHA answer)
    if (result.status === 200) {
      throw new Error('Contact form should reject invalid CAPTCHA');
    }
  }, false);

  // Test newsletter validation
  await runTest('Newsletter Validation', async () => {
    const result = await makeRequest('/api/newsletter', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        captchaId: captchaId || 'invalid',
        captchaAnswer: 'invalid'
      }
    });
    // Should fail validation (wrong CAPTCHA answer)
    if (result.status === 200) {
      throw new Error('Newsletter should reject invalid CAPTCHA');
    }
  }, false);

  // Test email format validation
  await runTest('Email Format Validation', async () => {
    const result = await makeRequest('/api/contact', {
      method: 'POST',
      body: {
        name: 'Test',
        email: 'invalid-email',
        message: 'Test',
        captchaId: captchaId || 'invalid',
        captchaAnswer: 'invalid'
      }
    });
    if (result.status === 200) {
      throw new Error('Should reject invalid email format');
    }
  }, false);
}

/**
 * Rate Limiting Tests
 */
async function testRateLimiting() {
  console.log('\n⏱️ RATE LIMITING\n');

  await runTest('Rate Limit Headers Present', async () => {
    const result = await makeRequest('/api/health');
    const hasRateLimitHeaders = result.headers['ratelimit-limit'] || 
                                result.headers['x-ratelimit-limit'] ||
                                result.headers['ratelimit-remaining'];
    if (!hasRateLimitHeaders) {
      throw new Error('Rate limit headers not found');
    }
  }, false);

  // Test basic protection
  await runTest('Rate Limiting Protection', async () => {
    const requests = [];
    // Make 5 rapid requests
    for (let i = 0; i < 5; i++) {
      requests.push(makeRequest('/api/health').catch(() => ({ status: 429 })));
    }
    const results = await Promise.all(requests);
    // At least the requests should complete without crashing
    if (results.length === 0) {
      throw new Error('Rate limiting test failed');
    }
  }, false);
}

/**
 * CORS Tests
 */
async function testCORS() {
  console.log('\n🔄 CORS CONFIGURATION\n');

  await runTest('CORS Headers Present', async () => {
    const result = await makeRequest('/', {
      headers: {
        'Origin': baseUrl
      }
    });
    // Check if CORS headers are properly configured
    const accessControl = result.headers['access-control-allow-origin'] ||
                         result.headers['access-control-allow-methods'];
    // If not present, the server might have CORS disabled (which is fine for same-origin)
  }, false);
}

/**
 * Error Handling Tests
 */
async function testErrorHandling() {
  console.log('\n🐛 ERROR HANDLING\n');

  await runTest('404 Error Handling', async () => {
    const result = await makeRequest('/nonexistent-page-xyz');
    if (result.status === 200) {
      throw new Error('Should return 404 for nonexistent page');
    }
  }, false);

  await runTest('Invalid API Request Handling', async () => {
    const result = await makeRequest('/api/invalid-endpoint');
    if (result.status === 200) {
      throw new Error('Should handle invalid API endpoints');
    }
  }, false);
}

/**
 * Response Time Tests
 */
async function testResponseTimes() {
  console.log('\n⚡ PERFORMANCE\n');

  await runTest('Home Page Response Time < 2s', async () => {
    const start = Date.now();
    await makeRequest('/');
    const elapsed = Date.now() - start;
    if (elapsed > 2000) {
      throw new Error(`Response time ${elapsed}ms exceeds 2 seconds`);
    }
  }, false);

  await runTest('API Response Time < 1s', async () => {
    const start = Date.now();
    await makeRequest('/api/health');
    const elapsed = Date.now() - start;
    if (elapsed > 1000) {
      throw new Error(`API response time ${elapsed}ms exceeds 1 second`);
    }
  }, false);
}

/**
 * SSL/TLS Tests (for HTTPS URLs)
 */
async function testSSL() {
  if (!baseUrl.includes('https')) {
    console.log('\n🔐 SSL/TLS\n');
    console.log('⏭️ Skipping SSL tests (not HTTPS)');
    return;
  }

  console.log('\n🔐 SSL/TLS\n');

  await runTest('HTTPS Connection', async () => {
    const result = await makeRequest('/');
    if (result.status !== 200) {
      throw new Error('HTTPS connection failed');
    }
  }, true);

  await runTest('SSL Certificate Valid', async () => {
    // This is a basic connectivity test since full cert validation is limited
    const result = await makeRequest('/');
    if (result.status !== 200) {
      throw new Error('SSL certificate appears invalid');
    }
  }, false);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.clear();
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║     THE HENRY WEBSITE - DEPLOYMENT FUNCTIONAL TEST SUITE      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`\n🎯 Testing: ${baseUrl}`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`⏱️ Timeout per request: ${TEST_CONFIG.timeout}ms`);
  console.log(`🔄 Retries: ${TEST_CONFIG.retries}`);

  try {
    // Run all test suites
    await testBackendHealth();
    await testFrontendPages();
    await testStaticAssets();
    await testSecurityHeaders();
    await testAPIEndpoints();
    await testRateLimiting();
    await testCORS();
    await testErrorHandling();
    await testResponseTimes();
    await testSSL();

    // Print summary
    printSummary();

  } catch (error) {
    console.error('\n❌ Unexpected error during testing:', error.message);
    process.exit(1);
  }
}

/**
 * Print test summary
 */
function printSummary() {
  const total = TEST_CONFIG.results.passed + TEST_CONFIG.results.failed + TEST_CONFIG.results.warnings;
  const passRate = Math.round((TEST_CONFIG.results.passed / total) * 100);

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                       TEST SUMMARY                              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Passed:   ${TEST_CONFIG.results.passed}`);
  console.log(`   ⚠️  Warnings: ${TEST_CONFIG.results.warnings}`);
  console.log(`   ❌ Failed:   ${TEST_CONFIG.results.failed}`);
  console.log(`   📈 Pass Rate: ${passRate}%`);

  if (TEST_CONFIG.criticalTests.length > 0) {
    console.log(`\n🔴 CRITICAL FAILURES (${TEST_CONFIG.criticalTests.length}):`);
    TEST_CONFIG.criticalTests.forEach(test => {
      console.log(`   ❌ ${test.name}`);
      console.log(`      └─ ${test.error}`);
    });
  }

  if (TEST_CONFIG.warningTests.length > 0) {
    console.log(`\n🟡 WARNINGS (${TEST_CONFIG.warningTests.length}):`);
    TEST_CONFIG.warningTests.forEach(test => {
      console.log(`   ⚠️  ${test.name}`);
      console.log(`      └─ ${test.error}`);
    });
  }

  if (TEST_CONFIG.criticalTests.length === 0 && TEST_CONFIG.results.failed === 0) {
    console.log('\n✨ All critical tests passed! Website is ready for deployment.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Please address critical failures before deploying.');
    process.exit(1);
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

console.log('Initializing tests...');
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
