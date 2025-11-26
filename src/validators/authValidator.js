const { z } = require('zod');

/**
 * Login validation schema
 */
const loginSchema = z.object({
  employeeId: z.string()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be less than 50 characters'),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password must be less than 128 characters')
});

/**
 * Refresh token validation schema
 */
const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required')
    .max(255, 'Invalid refresh token format')
});

/**
 * Logout validation schema
 */
const logoutSchema = z.object({
  refreshToken: z.string()
    .max(255, 'Invalid refresh token format')
    .optional(),
  logoutAll: z.boolean()
    .optional()
});

/**
 * Change password validation schema
 */
const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required')
    .max(128, 'Current password must be less than 128 characters'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters long')
    .max(128, 'New password must be less than 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')
});

/**
 * Validate request body against schema
 * @param {Object} schema - Zod schema
 * @param {string} source - Request field to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let dataToValidate;
    
    switch (source) {
      case 'body':
        dataToValidate = req.body;
        break;
      case 'query':
        dataToValidate = req.query;
        break;
      case 'params':
        dataToValidate = req.params;
        break;
      default:
        dataToValidate = req.body;
    }

    const result = schema.safeParse(dataToValidate);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      });
    }
    
    // Attach validated data to request
    switch (source) {
      case 'body':
        req.validatedBody = result.data;
        break;
      case 'query':
        req.validatedQuery = result.data;
        break;
      case 'params':
        req.validatedParams = result.data;
        break;
      default:
        req.validatedBody = result.data;
    }
    
    next();
  };
};

/**
 * Sanitize string input
 * @param {string} input - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Sanitize all string fields in an object
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const sanitized = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
};

/**
 * Middleware to sanitize request body
 */
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  next();
};

module.exports = {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  changePasswordSchema,
  validate,
  sanitizeString,
  sanitizeObject,
  sanitizeBody
};