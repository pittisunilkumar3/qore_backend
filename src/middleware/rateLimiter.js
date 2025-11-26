const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const redisClient = require('../utils/redis');
const prisma = new PrismaClient();

/**
 * Rate limiting middleware for API endpoints
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum requests per window
 * @param {string} message - Custom message
 */
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = null) => {
  return rateLimit({
    windowMs,
    max,
    message: message || {
      success: false,
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(windowMs / 1000) // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Store IP-based limits
    keyGenerator: (req) => {
      return req.ip;
    },
    // Custom skip function for successful requests
    skip: (req) => {
      return req.rateLimit?.remaining > 0;
    },
    // Custom handler for rate limit exceeded
    handler: (req, res) => {
      const remaining = req.rateLimit?.remaining || 0;
      const resetTime = req.rateLimit?.resetTime || new Date(Date.now() + windowMs);
      
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        details: {
          limit: max,
          windowMs,
          remaining,
          resetTime: resetTime.toISOString(),
          retryAfter: Math.ceil((resetTime.getTime() - Date.now()) / 1000)
        }
      });
    }
  });
};

/**
 * Account lockout middleware for login attempts
 * @param {number} maxAttempts - Maximum failed attempts
 * @param {number} lockoutDuration - Lockout duration in minutes
 */
const createAccountLockout = (maxAttempts = 5, lockoutDuration = 15) => {
  return async (req, res, next) => {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return next();
    }

    const clientIp = req.ip;
    const now = new Date();
    const key = `${employeeId}:${clientIp}`;
    
    // Check current attempts
    const attempts = failedAttempts.get(key) || {
      count: 0,
      firstAttempt: null,
      lockUntil: null
    };

    // Check if account is locked
    if (attempts.lockUntil && attempts.lockUntil > now) {
      const remainingTime = Math.ceil((attempts.lockUntil.getTime() - now.getTime()) / 1000 / 60);
      
      return res.status(423).json({
        success: false,
        error: 'Account temporarily locked',
        code: 'ACCOUNT_LOCKED',
        details: {
          lockoutDuration: lockoutDuration,
          remainingTime,
          unlockTime: attempts.lockUntil.toISOString()
        }
      });
    }

    // Create rate limiter for login attempts (max 5 attempts per 15 minutes)
    const loginLimiter = createRateLimiter(
      15 * 60 * 1000, // 15 minutes
      maxAttempts,
      'Too many login attempts. Please try again later.'
    );

    // Apply rate limiting
    loginLimiter(req, res, () => {
      // This will only proceed if not rate limited
      next();
    });

    // Post-request handler to track failed attempts
    res.on('finish', () => {
      if (res.statusCode === 401) {
        // Login failed - increment attempts
        attempts.count++;
        
        if (attempts.count === 1) {
          attempts.firstAttempt = now;
        }
        
        // Lock account if max attempts reached
        if (attempts.count >= maxAttempts) {
          attempts.lockUntil = new Date(now.getTime() + lockoutDuration * 60 * 1000);
        }
        
        failedAttempts.set(key, attempts);
        
        // Log the failed attempt
        prisma.activityLog.create({
          data: {
            action: 'LOGIN_FAILED',
            entityType: 'Employee',
            newValue: JSON.stringify({
              employeeId,
              ip: clientIp,
              attempts: attempts.count,
              userAgent: req.get('User-Agent')
            }),
            ipAddress: clientIp,
            userAgent: req.get('User-Agent')
          }
        }).catch(error => {
          console.error('Error logging failed login:', error);
        });
      } else if (res.statusCode === 200) {
        // Login successful - reset attempts
        failedAttempts.delete(key);
      }
    });
  };
};

/**
 * Clean up old failed attempts (run periodically)
 */
const cleanupFailedAttempts = async () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  // Clean up memory storage (fallback)
  for (const [key, attempts] of failedAttempts.entries()) {
    if (attempts.firstAttempt && new Date(attempts.firstAttempt) < oneHourAgo) {
      failedAttempts.delete(key);
    }
  }
  
  // Redis automatically handles TTL expiration
};

/**
 * Get current failed attempts for monitoring
 * @param {string} employeeId - Employee ID
 * @param {string} ip - IP address
 */
const getFailedAttempts = async (employeeId, ip) => {
  const key = `${employeeId}:${ip}`;
  
  if (redisClient.isReady()) {
    return await redisClient.getCachedRateLimit(key) || {
      count: 0,
      firstAttempt: null,
      lockUntil: null
    };
  } else {
    return failedAttempts.get(key) || {
      count: 0,
      firstAttempt: null,
      lockUntil: null
    };
  }
};

/**
 * Reset failed attempts (manual unlock)
 * @param {string} employeeId - Employee ID
 * @param {string} ip - IP address
 */
const resetFailedAttempts = async (employeeId, ip) => {
  const key = `${employeeId}:${ip}`;
  
  if (redisClient.isReady()) {
    await redisClient.invalidateRateLimit(key);
  } else {
    failedAttempts.delete(key);
  }
};

// General API rate limiter (100 requests per 15 minutes)
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many requests from this IP. Please try again later.'
);

// Strict rate limiter for sensitive operations (10 requests per minute)
const strictLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 requests
  'Too many requests. Please slow down.'
);

// File upload rate limiter (5 uploads per minute)
const uploadLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  5, // 5 uploads
  'Too many file uploads. Please try again later.'
);

module.exports = {
  createRateLimiter,
  createAccountLockout,
  cleanupFailedAttempts,
  getFailedAttempts,
  resetFailedAttempts,
  apiLimiter,
  strictLimiter,
  uploadLimiter
};