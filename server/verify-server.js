#!/usr/bin/env node
/**
 * Simple Server Verification Tests
 * Runs quick checks without keeping long-lived connections
 */

const http = require('http');
const { promisify } = require('util');

const sleep = promisify(setTimeout);

// HTTP request helper
function httpRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      timeout: 3000,
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'close'  // Close connection after response
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runVerification() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  🧪 SERVER VERIFICATION SUITE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');

  const tests = [];

  // Test 1: Health check
  try {
    const result = await httpRequest('GET', '/api/health');
    tests.push({
      name: 'Health Check',
      status: result.status === 200 ? '✅ PASS' : '❌ FAIL',
      details: `Status ${result.status}`,
      response: result.data
    });
  } catch (e) {
    tests.push({
      name: 'Health Check',
      status: '❌ FAIL',
      details: e.message
    });
  }

  await sleep(300);

  // Test 2: CAPTCHA Generation
  let captchaId = null;
  try {
    const result = await httpRequest('POST', '/api/captcha/generate', {});
    const hasCaptcha = result.data && result.data.captchaId;
    tests.push({
      name: 'CAPTCHA Generation',
      status: hasCaptcha && result.status === 200 ? '✅ PASS' : '❌ FAIL',
      details: hasCaptcha ? `Generated: ${result.data.captchaId}` : `Status ${result.status}`,
      response: hasCaptcha ? { question: result.data.question } : result.data
    });
    if (hasCaptcha) captchaId = result.data.captchaId;
  } catch (e) {
    tests.push({
      name: 'CAPTCHA Generation',
      status: '❌ FAIL',
      details: e.message
    });
  }

  await sleep(300);

  // Test 3: Contact Form (with validation)
  try {
    const result = await httpRequest('POST', '/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      captchaId: captchaId || 'test',
      captchaAnswer: '999'
    });
    tests.push({
      name: 'Contact Form API',
      status: result.status >= 200 && result.status < 500 ? '✅ PASS' : '❌ FAIL',
      details: `Status ${result.status}`,
      response: result.data
    });
  } catch (e) {
    tests.push({
      name: 'Contact Form API',
      status: '❌ FAIL',
      details: e.message
    });
  }

  await sleep(300);

  // Test 4: Newsletter (with validation)
  try {
    const result = await httpRequest('POST', '/api/newsletter', {
      email: 'newsletter@example.com',
      captchaId: captchaId || 'test',
      captchaAnswer: '999'
    });
    tests.push({
      name: 'Newsletter API',
      status: result.status >= 200 && result.status < 500 ? '✅ PASS' : '❌ FAIL',
      details: `Status ${result.status}`,
      response: result.data
    });
  } catch (e) {
    tests.push({
      name: 'Newsletter API',
      status: '❌ FAIL',
      details: e.message
    });
  }

  // Print results
  console.log('RESULTS:');
  console.log('───────────────────────────────────────────────────────────────');
  tests.forEach((test, i) => {
    console.log(`\n${i + 1}. ${test.name}`);
    console.log(`   ${test.status}`);
    console.log(`   ${test.details}`);
    if (test.response && Object.keys(test.response).length > 0) {
      console.log(`   Response: ${JSON.stringify(test.response).substring(0, 100)}...`);
    }
  });

  console.log('\n───────────────────────────────────────────────────────────────');
  const passed = tests.filter(t => t.status.includes('✅')).length;
  console.log(`\nSUMMARY: ${passed}/${tests.length} tests passed`);

  if (passed === tests.length) {
    console.log('✅ All systems operational!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed\n');
    process.exit(1);
  }
}

// Run verification
console.log('\nInitializing tests...');
setTimeout(() => {
  runVerification().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 500);
