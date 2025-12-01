/**
 * Email Captcha Security System
 * Provides math-based captcha generation, validation, and session management
 */

// In-memory session storage for captchas (in production, use Redis)
// Format: { sessionId: { captcha, timestamp, attempts } }
const captchaSessions = new Map();

// Rate limiting store
// Format: { ip: { count, firstAttempt, contactAttempts } }
const rateLimitStore = new Map();

// Configuration
const CONFIG = {
  CAPTCHA_EXPIRY: 10 * 60 * 1000, // 10 minutes
  RATE_LIMIT_WINDOW: 60 * 60 * 1000, // 1 hour
  MAX_ATTEMPTS_PER_SESSION: 5, // Max wrong answers before regenerating
  MAX_SUBMISSIONS_PER_IP: 5, // Max contact submissions per hour per IP
  MAX_CAPTCHA_REQUESTS_PER_IP: 20, // Max captcha generation requests per hour per IP
};

/**
 * Generate a new math captcha
 * @returns {Object} { captchaId, question, hint }
 */
function generateCaptcha() {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1, num2, answer;
  
  if (operation === '+') {
    num1 = Math.floor(Math.random() * 50) + 1; // 1-50
    num2 = Math.floor(Math.random() * 50) + 1; // 1-50
    answer = num1 + num2;
  } else if (operation === '-') {
    num1 = Math.floor(Math.random() * 100) + 50; // 50-150
    num2 = Math.floor(Math.random() * num1); // 0-num1
    answer = num1 - num2;
  } else { // multiply
    num1 = Math.floor(Math.random() * 12) + 1; // 1-12
    num2 = Math.floor(Math.random() * 12) + 1; // 1-12
    answer = num1 * num2;
  }
  
  const captchaId = generateSessionId();
  const question = `${num1} ${operation} ${num2}`;
  
  // Store captcha with timestamp
  captchaSessions.set(captchaId, {
    answer,
    question,
    timestamp: Date.now(),
    attempts: 0,
    verified: false
  });
  
  console.log(`🔐 Captcha generated: ${captchaId} (${question} = ${answer})`);
  
  return {
    captchaId,
    question,
    hint: `This is a simple math problem. Solve the ${operation === '*' ? 'multiplication' : operation === '+' ? 'addition' : 'subtraction'} puzzle.`
  };
}

/**
 * Verify a captcha answer
 * @param {string} captchaId - The captcha session ID
 * @param {number} userAnswer - The user's answer
 * @returns {Object} { success, message, verified }
 */
function verifyCaptcha(captchaId, userAnswer) {
  if (!captchaId || userAnswer === null || userAnswer === undefined) {
    return {
      success: false,
      message: 'Invalid captcha submission',
      verified: false
    };
  }
  
  const session = captchaSessions.get(captchaId);
  
  if (!session) {
    return {
      success: false,
      message: 'Captcha not found or expired. Please generate a new one.',
      verified: false
    };
  }
  
  // Check expiry
  if (Date.now() - session.timestamp > CONFIG.CAPTCHA_EXPIRY) {
    captchaSessions.delete(captchaId);
    return {
      success: false,
      message: 'Captcha expired. Please generate a new one.',
      verified: false
    };
  }
  
  // Check attempt limit
  if (session.attempts >= CONFIG.MAX_ATTEMPTS_PER_SESSION) {
    captchaSessions.delete(captchaId);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please generate a new captcha.',
      verified: false
    };
  }
  
  // Verify answer
  const correctAnswer = parseInt(session.answer);
  const submittedAnswer = parseInt(userAnswer);
  
  if (submittedAnswer === correctAnswer) {
    session.verified = true;
    console.log(`✅ Captcha verified: ${captchaId}`);
    return {
      success: true,
      message: 'Captcha verified successfully!',
      verified: true
    };
  } else {
    session.attempts++;
    const remaining = CONFIG.MAX_ATTEMPTS_PER_SESSION - session.attempts;
    console.log(`❌ Wrong captcha answer: ${captchaId} (attempt ${session.attempts}/${CONFIG.MAX_ATTEMPTS_PER_SESSION})`);
    
    return {
      success: false,
      message: `Incorrect answer. ${remaining} attempts remaining.`,
      verified: false,
      attemptsRemaining: remaining
    };
  }
}

/**
 * Check if a captcha is verified
 * @param {string} captchaId - The captcha session ID
 * @returns {boolean}
 */
function isCaptchaVerified(captchaId) {
  const session = captchaSessions.get(captchaId);
  
  if (!session) {
    return false;
  }
  
  // Check expiry
  if (Date.now() - session.timestamp > CONFIG.CAPTCHA_EXPIRY) {
    captchaSessions.delete(captchaId);
    return false;
  }
  
  return session.verified === true;
}

/**
 * Check rate limit for IP address
 * @param {string} ip - Client IP address
 * @param {string} type - 'contact' or 'captcha'
 * @returns {Object} { allowed, message, remaining }
 */
function checkRateLimit(ip, type = 'contact') {
  const now = Date.now();
  let ipData = rateLimitStore.get(ip);
  
  // Initialize or clean up old data
  if (!ipData || now - ipData.firstAttempt > CONFIG.RATE_LIMIT_WINDOW) {
    ipData = {
      firstAttempt: now,
      contactAttempts: 0,
      captchaAttempts: 0
    };
    rateLimitStore.set(ip, ipData);
  }
  
  const maxAttempts = type === 'contact' ? CONFIG.MAX_SUBMISSIONS_PER_IP : CONFIG.MAX_CAPTCHA_REQUESTS_PER_IP;
  const attempts = type === 'contact' ? ipData.contactAttempts : ipData.captchaAttempts;
  
  if (attempts >= maxAttempts) {
    return {
      allowed: false,
      message: `Rate limit exceeded. Maximum ${maxAttempts} ${type} submissions per hour.`,
      remaining: 0
    };
  }
  
  // Increment counter
  if (type === 'contact') {
    ipData.contactAttempts++;
  } else {
    ipData.captchaAttempts++;
  }
  
  const remaining = maxAttempts - (type === 'contact' ? ipData.contactAttempts : ipData.captchaAttempts);
  
  return {
    allowed: true,
    message: 'Rate limit check passed',
    remaining
  };
}

/**
 * Generate a secure session ID
 * @returns {string}
 */
function generateSessionId() {
  return 'captcha_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

/**
 * Get client IP from request
 * @param {Express.Request} req
 * @returns {string}
 */
function getClientIp(req) {
  return req.ip || 
         req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         'unknown';
}

/**
 * Cleanup expired captchas (run periodically)
 */
function cleanupExpiredCaptchas() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [id, session] of captchaSessions.entries()) {
    if (now - session.timestamp > CONFIG.CAPTCHA_EXPIRY) {
      captchaSessions.delete(id);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired captchas`);
  }
}

/**
 * Cleanup old rate limit entries (run periodically)
 */
function cleanupRateLimits() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.firstAttempt > CONFIG.RATE_LIMIT_WINDOW) {
      rateLimitStore.delete(ip);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} rate limit entries`);
  }
}

// Run cleanup every 30 minutes
setInterval(() => {
  cleanupExpiredCaptchas();
  cleanupRateLimits();
}, 30 * 60 * 1000);

// Initial cleanup on startup
cleanupExpiredCaptchas();
cleanupRateLimits();

module.exports = {
  generateCaptcha,
  verifyCaptcha,
  isCaptchaVerified,
  checkRateLimit,
  getClientIp,
  CONFIG
};
