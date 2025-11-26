const { PrismaClient } = require('@prisma/client');
const { generateTokenPair, revokeRefreshToken, revokeAllRefreshTokens } = require('../utils/jwt');
const { comparePassword, validatePasswordStrength } = require('../utils/password');
const prisma = new PrismaClient();

class AuthController {
  /**
   * Employee login
   * POST /api/auth/login
   */
  static async login(req, res) {
    try {
      const { employeeId, password } = req.body;

      // Validation
      if (!employeeId || !password) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID and password are required',
          code: 'MISSING_CREDENTIALS'
        });
      }

      // Find employee by employee ID
      const employee = await prisma.employee.findUnique({
        where: { employeeId },
        include: {
          employeeRoles: {
            include: {
              role: true
            }
          }
        }
      });

      if (!employee) {
        return res.status(401).json({
          success: false,
          error: 'Invalid employee ID or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      if (!employee.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Account is inactive',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, employee.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid employee ID or password',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate tokens
      const tokens = await generateTokenPair(employee);

      // Update last login timestamp
      await prisma.employee.update({
        where: { id: employee.id },
        data: { updatedAt: new Date() }
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: employee.id,
          action: 'LOGIN',
          entityType: 'Employee',
          entityId: employee.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          employee: {
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
          },
          ...tokens
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
          code: 'MISSING_REFRESH_TOKEN'
        });
      }

      // Find refresh token in database
      const tokenRecord = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          isRevoked: false,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          employee: {
            include: {
              employeeRoles: {
                include: {
                  role: true
                }
              }
            }
          }
        }
      });

      if (!tokenRecord) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      if (!tokenRecord.employee.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Employee account is inactive',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      // Generate new tokens
      const tokens = await generateTokenPair(tokenRecord.employee);

      // Revoke old refresh token
      await revokeRefreshToken(refreshToken);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: tokenRecord.employee.id,
          action: 'TOKEN_REFRESH',
          entityType: 'Employee',
          entityId: tokenRecord.employee.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Employee logout
   * POST /api/auth/logout
   */
  static async logout(req, res) {
    try {
      const { refreshToken, logoutAll } = req.body;

      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        });
      }

      if (logoutAll) {
        // Revoke all refresh tokens for this employee
        await revokeAllRefreshTokens(req.employee.id);
      } else if (refreshToken) {
        // Revoke specific refresh token
        await revokeRefreshToken(refreshToken);
      } else {
        // If no specific token provided, just log the logout
        await prisma.activityLog.create({
          data: {
            employeeId: req.employee.id,
            action: 'LOGOUT',
            entityType: 'Employee',
            entityId: req.employee.id,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
          }
        });

        return res.json({
          success: true,
          message: 'Logout successful'
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: req.employee.id,
          action: logoutAll ? 'LOGOUT_ALL' : 'LOGOUT',
          entityType: 'Employee',
          entityId: req.employee.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: logoutAll ? 'Logged out from all devices' : 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getProfile(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        });
      }

      const employee = await prisma.employee.findUnique({
        where: { id: req.employee.id },
        include: {
          employeeRoles: {
            include: {
              role: true
            }
          },
          manager: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          subordinates: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      res.json({
        success: true,
        data: {
          id: employee.id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          photo: employee.photo,
          position: employee.position,
          isSuperadmin: employee.isSuperadmin,
          isActive: employee.isActive,
          roles: employee.employeeRoles.map(er => ({
            id: er.role.id,
            name: er.role.name,
            slug: er.role.slug,
            isPrimary: er.isPrimary
          })),
          manager: employee.manager,
          subordinates: employee.subordinates
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static async changePassword(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Not authenticated',
          code: 'NOT_AUTHENTICATED'
        });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required',
          code: 'MISSING_PASSWORDS'
        });
      }

      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'New password does not meet security requirements',
          code: 'WEAK_PASSWORD',
          details: passwordValidation.errors
        });
      }

      // Get current employee data
      const employee = await prisma.employee.findUnique({
        where: { id: req.employee.id }
      });

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, employee.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect',
          code: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Hash new password
      const { hashPassword } = require('../utils/password');
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await prisma.employee.update({
        where: { id: req.employee.id },
        data: { password: hashedNewPassword }
      });

      // Revoke all refresh tokens (force re-login on all devices)
      await revokeAllRefreshTokens(req.employee.id);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: req.employee.id,
          action: 'PASSWORD_CHANGE',
          entityType: 'Employee',
          entityId: req.employee.id,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Password changed successfully. Please login again.'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = AuthController;