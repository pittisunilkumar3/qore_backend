const redis = require('redis');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.defaultTTL = 3600; // 1 hour default TTL
    this.connectionRefused = false;
  }

  async connect() {
    try {
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
          reconnectStrategy: (retries) => {
            // Stop retrying after 3 attempts
            if (retries > 3) {
              logger.warn('Redis connection failed after 3 attempts - continuing without cache');
              return false; // Stop retrying
            }
            return Math.min(retries * 100, 3000);
          }
        },
        password: process.env.REDIS_PASSWORD || undefined,
        database: process.env.REDIS_DB || 0
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        // Only log once, don't spam
        if (err.code === 'ECONNREFUSED' && !this.connectionRefused) {
          logger.warn('Redis server not available - continuing without cache');
          this.connectionRefused = true;
        }
        this.isConnected = false;
      });

      this.client.on('end', () => {
        logger.info('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      return true;
    } catch (error) {
      logger.warn('Redis not available - continuing without cache');
      this.isConnected = false;
      this.client = null;
      return false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  isReady() {
    return this.isConnected && this.client;
  }

  async set(key, value, ttl = this.defaultTTL) {
    if (!this.isReady()) {
      logger.warn('Redis not available, skipping set operation');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await this.client.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  }

  async get(key) {
    if (!this.isReady()) {
      logger.warn('Redis not available, skipping get operation');
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async del(key) {
    if (!this.isReady()) {
      logger.warn('Redis not available, skipping delete operation');
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isReady()) {
      return false;
    }

    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      return false;
    }
  }

  async expire(key, ttl) {
    if (!this.isReady()) {
      return false;
    }

    try {
      await this.client.expire(key, ttl);
      return true;
    } catch (error) {
      logger.error('Redis expire error:', error);
      return false;
    }
  }

  async keys(pattern) {
    if (!this.isReady()) {
      return [];
    }

    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error('Redis keys error:', error);
      return [];
    }
  }

  async flush() {
    if (!this.isReady()) {
      return false;
    }

    try {
      await this.client.flushDb();
      return true;
    } catch (error) {
      logger.error('Redis flush error:', error);
      return false;
    }
  }

  // Cache utility methods
  async cacheEmployee(employeeId, employeeData, ttl = this.defaultTTL) {
    const key = `employee:${employeeId}`;
    return await this.set(key, employeeData, ttl);
  }

  async getCachedEmployee(employeeId) {
    const key = `employee:${employeeId}`;
    return await this.get(key);
  }

  async invalidateEmployee(employeeId) {
    const key = `employee:${employeeId}`;
    return await this.del(key);
  }

  async cacheEmployeeList(queryKey, employeeList, ttl = 1800) {
    // 30 minutes cache for lists
    const key = `employee_list:${queryKey}`;
    return await this.set(key, employeeList, ttl);
  }

  async getCachedEmployeeList(queryKey) {
    const key = `employee_list:${queryKey}`;
    return await this.get(key);
  }

  async invalidateEmployeeList(queryKey) {
    const key = `employee_list:${queryKey}`;
    return await this.del(key);
  }

  async cacheAnalytics(key, data, ttl = 3600) {
    // 1 hour cache for analytics
    const cacheKey = `analytics:${key}`;
    return await this.set(cacheKey, data, ttl);
  }

  async getCachedAnalytics(key) {
    const cacheKey = `analytics:${key}`;
    return await this.get(cacheKey);
  }

  async invalidateAnalytics(key) {
    const cacheKey = `analytics:${key}`;
    return await this.del(cacheKey);
  }

  async cacheUserSession(sessionId, sessionData, ttl = 86400) {
    // 24 hours cache for sessions
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, ttl);
  }

  async getCachedUserSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async invalidateUserSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.del(key);
  }

  async cacheRateLimit(identifier, attempts, ttl = 900) {
    // 15 minutes cache for rate limiting
    const key = `rate_limit:${identifier}`;
    return await this.set(key, { attempts, timestamp: Date.now() }, ttl);
  }

  async getCachedRateLimit(identifier) {
    const key = `rate_limit:${identifier}`;
    return await this.get(key);
  }

  async invalidateRateLimit(identifier) {
    const key = `rate_limit:${identifier}`;
    return await this.del(key);
  }

  // Generate cache key from query parameters
  generateQueryKey(params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return Buffer.from(JSON.stringify(sortedParams)).toString('base64');
  }

  // Invalidate all employee-related caches
  async invalidateEmployeeCaches(employeeId) {
    const patterns = [
      `employee:${employeeId}`,
      'employee_list:*',
      'analytics:*'
    ];

    for (const pattern of patterns) {
      const keys = await this.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    }
  }
}

// Create singleton instance
const redisClient = new RedisClient();

module.exports = redisClient;