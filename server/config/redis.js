/**
 * Redis Connection Configuration
 * Handles session storage, rate limiting, and account lockout
 */

const redis = require('redis');

let client = null;
let isConnected = false;

/**
 * Initialize Redis client
 * @returns {Promise<Object>} Redis client instance or null
 */
async function initRedis() {
  if (client && isConnected) {
    return client;
  }

  try {
    // Create client with callback style (redis v3/v4)
    client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retry_strategy: () => null // Don't retry, just fail
    });

    // Handle connection events
    client.on('connect', () => {
      console.log('✅ Redis connected');
      isConnected = true;
    });

    client.on('error', (err) => {
      console.warn('⚠️ Redis unavailable:', err.message);
      isConnected = false;
    });

    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    // Wrap callback methods in promises - handle both success and failure gracefully
    client.getAsync = (key) => new Promise((resolve) => {
      if (!client || typeof client.get !== 'function') {
        return resolve(null);
      }
      try {
        client.get(key, (err, reply) => resolve(err ? null : reply));
      } catch (e) {
        resolve(null);
      }
    });

    client.setAsync = (key, value) => new Promise((resolve) => {
      if (!client || typeof client.set !== 'function') {
        return resolve(true);
      }
      try {
        client.set(key, value, (err, reply) => resolve(!err));
      } catch (e) {
        resolve(true);
      }
    });

    client.setexAsync = (key, ttl, value) => new Promise((resolve) => {
      if (!client || typeof client.setex !== 'function') {
        return resolve(true);
      }
      try {
        client.setex(key, ttl, value, (err, reply) => resolve(!err));
      } catch (e) {
        resolve(true);
      }
    });

    client.delAsync = (key) => new Promise((resolve) => {
      if (!client || typeof client.del !== 'function') {
        return resolve(true);
      }
      try {
        client.del(key, (err, reply) => resolve(!err));
      } catch (e) {
        resolve(true);
      }
    });

    client.existsAsync = (key) => new Promise((resolve) => {
      if (!client || typeof client.exists !== 'function') {
        return resolve(false);
      }
      try {
        client.exists(key, (err, reply) => resolve(err ? false : !!reply));
      } catch (e) {
        resolve(false);
      }
    });

    client.incrAsync = (key) => new Promise((resolve) => {
      if (!isConnected || !client || typeof client.incr !== 'function') {
        return resolve(1); // Return 1 if redis not available
      }
      try {
        client.incr(key, (err, reply) => resolve(err ? 1 : reply));
      } catch (e) {
        resolve(1);
      }
    });

    client.ttlAsync = (key) => new Promise((resolve) => {
      if (!client || typeof client.ttl !== 'function') {
        return resolve(-1);
      }
      try {
        client.ttl(key, (err, reply) => resolve(err ? -1 : reply));
      } catch (e) {
        resolve(-1);
      }
    });

    // Try to connect with a timeout
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('⚠️ Redis connection timeout - continuing without Redis');
        resolve(client);
      }, 2000);

      if (typeof client.on === 'function') {
        client.on('ready', () => {
          clearTimeout(timeout);
          resolve(client);
        });
      } else {
        clearTimeout(timeout);
        resolve(client);
      }
    });
  } catch (error) {
    console.warn('⚠️ Failed to initialize Redis:', error.message);
    // Create a stub client that always fails gracefully
    client = {
      getAsync: async () => null,
      setAsync: async () => true,
      setexAsync: async () => true,
      delAsync: async () => true,
      existsAsync: async () => false,
      incrAsync: async () => 1,
      ttlAsync: async () => -1,
      quit: () => {}
    };
    return client;
  }
}

/**
 * Get or create Redis client
 * @returns {Object} Redis client instance
 */
function getRedisClient() {
  return client;
}

/**
 * Close Redis connection
 * @returns {Promise<void>}
 */
async function closeRedis() {
  return new Promise((resolve) => {
    if (!client) {
      resolve();
      return;
    }

    try {
      isConnected = false;
      // Don't wait for quit response, just try to close and move on
      if (typeof client.quit === 'function') {
        setTimeout(() => {
          client.quit(() => {
            // Silent shutdown
          });
        }, 100);
      }
      // Resolve immediately
      setTimeout(resolve, 200);
    } catch (err) {
      // Silently ignore all errors
      resolve();
    }
  });
}

module.exports = {
  initRedis,
  getRedisClient,
  closeRedis,
  isConnected: () => isConnected
};
