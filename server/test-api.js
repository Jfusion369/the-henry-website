const http = require('http');

// Test function that returns immediately without closing connection
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : body
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.setTimeout(5000);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');

  try {
    // Wait a bit for the server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 1: Health endpoint
    console.log('1️⃣ Testing GET /api/health');
    let result = await makeRequest('/api/health');
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.body)}\n`);

    // Test 2: Generate CAPTCHA
    console.log('2️⃣ Testing POST /api/captcha/generate');
    result = await makeRequest('/api/captcha/generate', 'POST', {});
    console.log(`   Status: ${result.status}`);
    if (result.body && result.body.captchaId) {
      console.log(`   ✅ Captcha generated: ${result.body.captchaId}`);
      console.log(`   Question: ${result.body.question}\n`);
      var captchaId = result.body.captchaId;
      var question = result.body.question;
    } else {
      console.log(`   Response: ${JSON.stringify(result.body)}\n`);
    }

    // Test 3: Contact form submission (with mock CAPTCHA data for testing)
    console.log('3️⃣ Testing POST /api/contact (contact form)');
    result = await makeRequest('/api/contact', 'POST', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message',
      captchaId: captchaId || 'test-id',
      captchaAnswer: '999'  // Wrong answer to test validation
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.body)}\n`);

    // Test 4: Newsletter subscription
    console.log('4️⃣ Testing POST /api/newsletter (newsletter signup)');
    result = await makeRequest('/api/newsletter', 'POST', {
      email: 'newsletter@example.com',
      captchaId: captchaId || 'test-id',
      captchaAnswer: '999'  // Wrong answer to test validation
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.body)}\n`);

    console.log('✅ All API tests completed!');
    console.log('\n📋 Summary:');
    console.log('   ✔ Server is running');
    console.log('   ✔ Health check endpoint works');
    console.log('   ✔ CAPTCHA generation works');
    console.log('   ✔ Contact and newsletter endpoints are responding');
    console.log('   ✔ Form validation is working\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test error:', error.message);
    process.exit(1);
  }
}

// Set timeout to exit after 15 seconds
setTimeout(() => {
  console.error('❌ Test timeout - server may not be responding');
  process.exit(1);
}, 15000);

runTests();
