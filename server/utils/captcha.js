/**
 * Email Captcha Security System with Redis
 * Provides math-based captcha generation, validation, and session management
 */

const crypto = require('crypto');
const { getRedisClient } = require('../config/redis');

// Configuration
const CONFIG = {
  CAPTCHA_EXPIRY: 10 * 60, // 10 minutes in seconds
  RATE_LIMIT_WINDOW: 60 * 60, // 1 hour in seconds
  MAX_ATTEMPTS_PER_SESSION: 5,
  MAX_SUBMISSIONS_PER_IP: 5,
  MAX_CAPTCHA_REQUESTS_PER_IP: 20,
  MAX_NEWSLETTER_REQUESTS_PER_IP: 10,
};

/**
 * Generate a new math captcha and store in Redis
 * @returns {Promise<Object>} { captchaId, question, hint }
 */
async function generateCaptcha() {
  try {
    const redis = getRedisClient();
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    if (operation === '+') {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      answer = num1 + num2;
    } else if (operation === '-') {
      num1 = Math.floor(Math.random() * 100) + 50;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      answer = num1 * num2;
    }
    
    const captchaId = generateSessionId();
    const question = `${num1} ${operation} ${num2}`;
    
    // Store in Redis with expiration (if available)
    if (redis && redis.setexAsync) {
      try {
        const captchaData = {
          answer: String(answer),
          question,
          attempts: 0,
          verified: false,
          createdAt: Date.now()
        };
        
        await redis.setexAsync(
          `captcha:${captchaId}`,
          CONFIG.CAPTCHA_EXPIRY,
          JSON.stringify(captchaData)
        );
      } catch (redisErr) {
        // Redis unavailable, continue without persistence
        console.warn('⚠️ Redis unavailable for CAPTCHA storage:', redisErr.message);
      }
    }
    
    console.log(`🔐 Captcha generated: ${captchaId} (${question} = ${answer})`);
    
    return {
      captchaId,
      question,
      hint: `This is a simple ${operation === '*' ? 'multiplication' : operation === '+' ? 'addition' : 'subtraction'} puzzle.`
    };
  } catch (error) {
    console.error('❌ Error generating captcha:', error.message);
    throw error;
  }
}

/**
 * Verify a captcha answer using constant-time comparison
 * @param {string} captchaId - The captcha session ID
 * @param {number} userAnswer - The user's answer
 * @returns {Promise<Object>} { success, message, verified }
 */
async function verifyCaptcha(captchaId, userAnswer) {
  try {
    const redis = getRedisClient();
    
    if (!captchaId || userAnswer === null || userAnswer === undefined) {
      return {
        success: false,
        message: 'Invalid captcha submission',
        verified: false
      };
    }
    
    // Retrieve from Redis
    const sessionData = await redis.getAsync(`captcha:${captchaId}`);
    
    if (!sessionData) {
      return {
        success: false,
        message: 'Captcha not found or expired. Please generate a new one.',
        verified: false
      };
    }
    
    const session = JSON.parse(sessionData);
    
    // Check attempt limit
    if (session.attempts >= CONFIG.MAX_ATTEMPTS_PER_SESSION) {
      await redis.delAsync(`captcha:${captchaId}`);
      return {
        success: false,
        message: 'Too many incorrect attempts. Please generate a new captcha.',
        verified: false
      };
    }
    
    // Verify answer using constant-time comparison to prevent timing attacks
    const correctAnswer = String(session.answer);
    const submittedAnswer = String(userAnswer);
    
    let answersMatch = false;
    try {
      answersMatch = crypto.timingSafeEqual(
        Buffer.from(correctAnswer),
        Buffer.from(submittedAnswer)
      );
    } catch (error) {
      // timingSafeEqual throws if buffers are different lengths
      answersMatch = false;
    }
    
    if (answersMatch) {
      // Mark as verified in Redis
      session.verified = true;
      await redis.setexAsync(
        `captcha:${captchaId}`,
        CONFIG.CAPTCHA_EXPIRY,
        JSON.stringify(session)
      );
      
      console.log(`✅ Captcha verified: ${captchaId}`);
      return {
        success: true,
        message: 'Captcha verified successfully!',
        verified: true
      };
    } else {
      // Increment attempts
      session.attempts++;
      const remaining = CONFIG.MAX_ATTEMPTS_PER_SESSION - session.attempts;
      
      await redis.setexAsync(
        `captcha:${captchaId}`,
        CONFIG.CAPTCHA_EXPIRY,
        JSON.stringify(session)
      );
      
      console.log(`❌ Wrong captcha answer: ${captchaId} (attempt ${session.attempts}/${CONFIG.MAX_ATTEMPTS_PER_SESSION})`);
      
      return {
        success: false,
        message: `Incorrect answer. ${remaining} attempts remaining.`,
        verified: false,
        attemptsRemaining: remaining
      };
    }
  } catch (error) {
    console.error('❌ Error verifying captcha:', error);
    return {
      success: false,
      message: 'Error verifying captcha. Please try again.',
      verified: false
    };
  }
}

/**
 * Check if a captcha is verified
 * @param {string} captchaId - The captcha session ID
 * @returns {Promise<boolean>}
 */
async function isCaptchaVerified(captchaId) {
  try {
    const redis = getRedisClient();
    const sessionData = await redis.getAsync(`captcha:${captchaId}`);
    
    if (!sessionData) {
      return false;
    }

    const session = JSON.parse(sessionData);
    return session.verified === true;
  } catch (error) {
    console.error('❌ Error checking captcha verification:', error);
    return false;
  }
}

/**
 * Check rate limit for IP address using Redis
 * @param {string} ip - Client IP address
 * @param {string} type - 'contact', 'captcha', or 'newsletter'
 * @returns {Promise<Object>} { allowed, message, remaining }
 */
async function checkRateLimit(ip, type = 'contact') {
  try {
    const redis = getRedisClient();
    
    // If Redis is not available, allow request (graceful degradation)
    if (!redis || !redis.incrAsync) {
      return {
        allowed: true,
        message: 'Rate limit check skipped',
        remaining: 100,
        retryAfter: 0
      };
    }
    
    let maxAttempts;
    const key = `ratelimit:${ip}:${type}`;
    
    if (type === 'contact') {
      maxAttempts = CONFIG.MAX_SUBMISSIONS_PER_IP;
    } else if (type === 'newsletter') {
      maxAttempts = CONFIG.MAX_NEWSLETTER_REQUESTS_PER_IP;
    } else {
      maxAttempts = CONFIG.MAX_CAPTCHA_REQUESTS_PER_IP;
    }
    
    try {
      // Get current attempt count
      const currentAttempts = await redis.incrAsync(key);
      
      // Set expiry on first attempt
      if (currentAttempts === 1) {
        await redis.setexAsync(key, CONFIG.RATE_LIMIT_WINDOW, '1');
      }
      
      if (currentAttempts > maxAttempts) {
        const ttl = await redis.ttlAsync(key);
        return {
          allowed: false,
          message: `Rate limit exceeded. Maximum ${maxAttempts} ${type} requests per hour.`,
          remaining: 0,
          retryAfter: ttl > 0 ? ttl : CONFIG.RATE_LIMIT_WINDOW
        };
      }
      
      const remaining = maxAttempts - currentAttempts;
      return {
        allowed: true,
        message: 'Rate limit check passed',
        remaining
      };
    } catch (rateError) {
      console.warn('⚠️ Rate limit check failed:', rateError.message);
      // Allow the request if rate limiting fails
      return {
        allowed: true,
        message: 'Rate limit unavailable',
        remaining: maxAttempts
      };
    }
  } catch (error) {
    console.error('❌ Error checking rate limit:', error);
    // Fail open - allow request if Redis fails
    return {
      allowed: true,
      message: 'Rate limit check passed (Redis unavailable)',
      remaining: -1
    };
  }
}

/**
 * Generate a secure session ID
 * @returns {string}
 */
function generateSessionId() {
  return 'captcha_' + crypto.randomBytes(8).toString('hex') + '_' + Date.now().toString(36);
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

module.exports = {
  generateCaptcha,
  verifyCaptcha,
  isCaptchaVerified,
  checkRateLimit,
  getClientIp,
  CONFIG
};
