const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    params: req.params,
    query: req.query,
    employeeId: req.employee?.employeeId || null
  });

  // Log error to database if authenticated
  if (req.employee) {
    prisma.activityLog.create({
      data: {
        employeeId: req.employee.id,
        action: 'ERROR_OCCURRED',
        entityType: 'Error',
        newValue: JSON.stringify({
          message: err.message,
          stack: err.stack,
          url: req.url,
          method: req.method,
          body: req.body,
          params: req.params,
          query: req.query
        }),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    }).catch(error => {
      console.error('Failed to log error to database:', error);
    });
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.details || err.message
    });
  }

  if (err.name === 'UnauthorizedError' || err.code === 'AUTH_REQUIRED') {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (err.name === 'ForbiddenError' || err.code === 'ACCESS_DENIED') {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      code: 'ACCESS_DENIED',
      details: err.details || null
    });
  }

  if (err.name === 'NotFoundError' || err.code === 'EMPLOYEE_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
      code: 'NOT_FOUND'
    });
  }

  if (err.name === 'ConflictError' || err.code === 'DUPLICATE_EMPLOYEE_ID' || err.code === 'DUPLICATE_EMAIL') {
    return res.status(409).json({
      success: false,
      error: 'Resource already exists',
      code: 'CONFLICT',
      details: err.details || null
    });
  }

  if (err.name === 'RateLimitError' || err.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      details: err.details || null
    });
  }

  if (err.name === 'AccountLockedError' || err.code === 'ACCOUNT_LOCKED') {
    return res.status(423).json({
      success: false,
      error: 'Account temporarily locked',
      code: 'ACCOUNT_LOCKED',
      details: err.details || null
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: err.message || 'Invalid or expired token',
      code: err.code || 'TOKEN_INVALID'
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      error: 'Database constraint violation',
      code: 'DATABASE_CONSTRAINT',
      details: err.message
    });
  }

  if (err.name === 'PrismaClientUnknownRequestError') {
    return res.status(500).json({
      success: false,
      error: 'Database operation failed',
      code: 'DATABASE_ERROR',
      details: err.message
    });
  }

  // Handle file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File too large',
        code: 'FILE_TOO_LARGE',
        details: err.details || null
      });
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        code: 'TOO_MANY_FILES',
        details: err.details || null
      });
    }

    return res.status(400).json({
      success: false,
      error: 'File upload failed',
      code: 'UPLOAD_FAILED',
      details: err.message
    });
  }

  // Default server error
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    code: errorCode,
    ...(process.env.NODE_ENV !== 'production' && { 
      stack: err.stack,
      details: err.details || null
    })
  });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    availableEndpoints: [
      'GET / - Welcome message',
      'GET /api/health - Main health check',
      'GET /api/database - Database status',
      'GET /api/hello - Hello World',
      'GET /api/migration - Migration info',
      'POST /api/auth/login - Employee login',
      'POST /api/auth/refresh - Refresh access token',
      'POST /api/auth/logout - Employee logout',
      'GET /api/auth/me - Get current user profile',
      'POST /api/auth/change-password - Change password',
      'GET /api/employees - Get all employees',
      'GET /api/employees/statistics - Get employee statistics',
      'GET /api/employees/:id - Get employee by ID',
      'POST /api/employees - Create employee',
      'PUT /api/employees/:id - Update employee',
      'DELETE /api/employees/:id - Delete employee',
      'POST /api/employees/:id/restore - Restore employee',
      'GET /api/employees/:id/subordinates - Get employee subordinates',
      'GET /api/employees/:id/manager - Get employee manager',
      'GET /api/files/employee/:id - Get employee files',
      'POST /api/files/upload/photo - Upload employee photo',
      'POST /api/files/upload/documents - Upload employee documents',
      'GET /api/files/download/:filename - Download file',
      'DELETE /api/files/:filename - Delete file',
      'POST /api/import/employees - Import employees from CSV',
      'GET /api/export/employees/csv - Export employees to CSV',
      'GET /api/export/employees/excel - Export employees to Excel',
      'GET /api/import-export/history - Get import/export history',
      'GET /api/roles - Role management API'
    ]
  });
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 15);
  
  // Add request ID to request for tracking
  req.requestId = requestId;
  
  // Log request
  console.log('Request:', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    employeeId: req.employee?.employeeId || null,
    timestamp: new Date().toISOString()
  });
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log response
    console.log('Response:', {
      requestId,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
      employeeId: req.employee?.employeeId || null,
      timestamp: new Date().toISOString()
    });
    
    originalSend.call(this, data);
  };
  
  next();
};

/**
 * Async error wrapper for routes
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Generate correlation ID for request tracking
 */
const generateCorrelationId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  asyncHandler,
  generateCorrelationId
};