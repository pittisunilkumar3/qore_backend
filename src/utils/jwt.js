const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload
 * @param {number} payload.employeeId - Employee ID
 * @param {string} payload.employeeId - Employee unique ID
 * @returns {string} JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      employeeId: payload.employeeId,
      employeeId: payload.employeeId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      issuer: 'qore-backend',
      audience: 'qore-employees'
    }
  );
};

/**
 * Generate refresh token
 * @param {number} employeeId - Employee ID
 * @returns {Object} Token object with token and expiry
 */
const generateRefreshToken = async (employeeId) => {
  const token = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  // Store refresh token in database
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.refreshToken.create({
    data: {
      token,
      employeeId,
      expiresAt
    }
  });

  return {
    token,
    expiresAt
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} employee - Employee object
 * @returns {Object} Token pair
 */
const generateTokenPair = async (employee) => {
  const accessToken = generateAccessToken({
    employeeId: employee.id,
    employeeId: employee.employeeId
  });

  const refreshToken = await generateRefreshToken(employee.id);

  return {
    accessToken,
    refreshToken: refreshToken.token,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    tokenType: 'Bearer'
  };
};

/**
 * Revoke refresh token
 * @param {string} token - Refresh token to revoke
 */
const revokeRefreshToken = async (token) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.refreshToken.updateMany({
    where: {
      token,
      isRevoked: false
    },
    data: {
      isRevoked: true
    }
  });
};

/**
 * Revoke all refresh tokens for an employee
 * @param {number} employeeId - Employee ID
 */
const revokeAllRefreshTokens = async (employeeId) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.refreshToken.updateMany({
    where: {
      employeeId,
      isRevoked: false
    },
    data: {
      isRevoked: true
    }
  });
};

/**
 * Clean up expired refresh tokens
 */
const cleanupExpiredTokens = async () => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateTokenPair,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  cleanupExpiredTokens
};