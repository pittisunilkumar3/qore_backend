const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');

const prisma = new PrismaClient();

describe('Authentication API', () => {
  beforeAll(async () => {
    // Clean up test data before each test
    await prisma.refreshToken.deleteMany();
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'AUTH_TEST_'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await prisma.refreshToken.deleteMany();
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'AUTH_TEST_'
        }
      }
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // Create test user first
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_USER',
          firstName: 'Test',
          lastName: 'User',
          email: 'auth.test@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginData = {
        employeeId: 'AUTH_TEST_USER',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.employee.firstName).toBe('Test');
    });

    test('should reject login with invalid employee ID', async () => {
      const loginData = {
        employeeId: 'INVALID_USER',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid employee ID or password');
    });

    test('should reject login with invalid password', async () => {
      // Create test user first
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_USER2',
          firstName: 'Test2',
          lastName: 'User2',
          email: 'auth.test2@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginData = {
        employeeId: 'AUTH_TEST_USER2',
        password: 'WrongPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid employee ID or password');
    });

    test('should reject login for inactive user', async () => {
      // Create inactive test user
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_INACTIVE',
          firstName: 'Inactive',
          lastName: 'User',
          email: 'inactive@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: false
        });

      const loginData = {
        employeeId: 'AUTH_TEST_INACTIVE',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid employee ID or password');
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should refresh access token with valid refresh token', async () => {
      // Create test user and login
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_REFRESH',
          firstName: 'Refresh',
          lastName: 'User',
          email: 'refresh@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'AUTH_TEST_REFRESH',
          password: 'TestPassword123!'
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    test('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid_token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout with valid token', async () => {
      // Create test user and login
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_LOGOUT',
          firstName: 'Logout',
          lastName: 'User',
          email: 'logout@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'AUTH_TEST_LOGOUT',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');
    });

    test('should reject logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('GET /api/auth/me', () => {
    test('should get current user profile', async () => {
      // Create test user and login
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_ME',
          firstName: 'Profile',
          lastName: 'User',
          email: 'profile@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'AUTH_TEST_ME',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('AUTH_TEST_ME');
      expect(response.body.data.firstName).toBe('Profile');
    });

    test('should reject profile request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('POST /api/auth/change-password', () => {
    test('should change password with valid current password', async () => {
      // Create test user and login
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_CHANGE_PWD',
          firstName: 'Change',
          lastName: 'Password',
          email: 'change@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'AUTH_TEST_CHANGE_PWD',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'TestPassword123!',
          newPassword: 'NewTestPassword123!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Password changed successfully');
    });

    test('should reject password change with invalid current password', async () => {
      // Create test user and login
      await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer admin_token')
        .send({
          employeeId: 'AUTH_TEST_CHANGE_PWD2',
          firstName: 'Change2',
          lastName: 'Password2',
          email: 'change2@example.com',
          password: 'TestPassword123!',
          gender: 'male',
          position: 'Tester',
          employmentStatus: 'full-time',
          isActive: true
        });

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'AUTH_TEST_CHANGE_PWD2',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'WrongPassword123!',
          newPassword: 'NewTestPassword123!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Current password is incorrect');
    });
  });
});