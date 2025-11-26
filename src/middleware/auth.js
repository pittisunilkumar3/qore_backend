const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Authentication middleware to verify JWT tokens
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if refresh token exists and is not revoked
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        employeeId: decoded.employeeId,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session',
        code: 'SESSION_EXPIRED'
      });
    }

    // Get employee details
    const employee = await prisma.employee.findUnique({
      where: { id: decoded.employeeId },
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Employee not found or inactive',
        code: 'EMPLOYEE_INACTIVE'
      });
    }

    // Attach employee info to request
    req.employee = {
      id: employee.id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      isSuperadmin: employee.isSuperadmin,
      roles: employee.employeeRoles.map(er => ({
        id: er.role.id,
        name: er.role.name,
        slug: er.role.slug,
        isPrimary: er.isPrimary
      }))
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Role-based access control middleware
 * @param {string|string[]} allowedRoles - Role slugs that are allowed to access the resource
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Superadmin has access to everything
    if (req.employee.isSuperadmin) {
      return next();
    }

    const userRoles = req.employee.roles.map(role => role.slug);
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    const hasRequiredRole = rolesArray.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: rolesArray,
        current: userRoles
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has primary role
 * @param {string|string[]} allowedPrimaryRoles - Allowed primary role slugs
 */
const requirePrimaryRole = (allowedPrimaryRoles) => {
  return (req, res, next) => {
    if (!req.employee) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Superadmin has access to everything
    if (req.employee.isSuperadmin) {
      return next();
    }

    const primaryRole = req.employee.roles.find(role => role.isPrimary);
    
    if (!primaryRole) {
      return res.status(403).json({
        success: false,
        error: 'No primary role assigned',
        code: 'NO_PRIMARY_ROLE'
      });
    }

    const rolesArray = Array.isArray(allowedPrimaryRoles) ? allowedPrimaryRoles : [allowedPrimaryRoles];
    
    if (!rolesArray.includes(primaryRole.slug)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions for primary role',
        code: 'INSUFFICIENT_PRIMARY_ROLE',
        required: rolesArray,
        current: primaryRole.slug
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.employee = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        employeeId: decoded.employeeId,
        isRevoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!refreshToken) {
      req.employee = null;
      return next();
    }

    const employee = await prisma.employee.findUnique({
      where: { id: decoded.employeeId },
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!employee || !employee.isActive) {
      req.employee = null;
      return next();
    }

    req.employee = {
      id: employee.id,
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      isSuperadmin: employee.isSuperadmin,
      roles: employee.employeeRoles.map(er => ({
        id: er.role.id,
        name: er.role.name,
        slug: er.role.slug,
        isPrimary: er.isPrimary
      }))
    };

    next();
  } catch (error) {
    // If token is invalid/expired, just continue without authentication
    req.employee = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePrimaryRole,
  optionalAuth
};