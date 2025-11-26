const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');

const prisma = new PrismaClient();

describe('Employee Management API', () => {
  beforeAll(async () => {
    // Clean up test data before each test
    await prisma.activityLog.deleteMany();
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'TEST_'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data after all tests
    await prisma.activityLog.deleteMany();
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'TEST_'
        }
      }
    });
  });

  describe('Authentication Endpoints', () => {
    test('should login with valid credentials', async () => {
      const loginData = {
        employeeId: 'TEST_ADMIN',
        password: 'TestPassword123!'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employee.firstName).toBe('Test');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    test('should reject login with invalid credentials', async () => {
      const loginData = {
        employeeId: 'INVALID_USER',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid employee ID or password');
    });

    test('should get current user profile', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('TEST_ADMIN');
    });
  });

  describe('Employee CRUD Endpoints', () => {
    test('should create employee with valid data', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      const employeeData = {
        employeeId: 'TEST_EMP001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        password: 'NewPassword123!',
        gender: 'male',
        dob: '1990-01-01',
        position: 'Software Engineer',
        employmentStatus: 'full-time',
        isActive: true
      };

      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(employeeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe('TEST_EMP001');
      expect(response.body.data.firstName).toBe('John');
    });

    test('should get employee by ID', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create test employee
      const employeeData = {
        employeeId: 'TEST_EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@test.com',
        password: 'NewPassword123!',
        gender: 'female',
        dob: '1992-02-15',
        position: 'HR Manager',
        employmentStatus: 'full-time',
        isActive: true
      };

      const createResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(employeeData)
        .expect(201);

      const employeeId = createResponse.body.data.id;

      // Get employee by ID
      const response = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employeeId).toBe(employeeId);
      expect(response.body.data.firstName).toBe('Jane');
    });

    test('should update employee with valid data', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create test employee
      const employeeData = {
        employeeId: 'TEST_EMP003',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@test.com',
        password: 'NewPassword123!',
        gender: 'male',
        dob: '1985-05-15',
        position: 'Developer',
        employmentStatus: 'full-time',
        isActive: true
      };

      const createResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(employeeData)
        .expect(201);

      const employeeId = createResponse.body.data.id;

      // Update employee
      const updateData = {
        firstName: 'Robert',
        position: 'Senior Developer'
      };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Robert');
      expect(response.body.data.position).toBe('Senior Developer');
    });

    test('should delete employee (soft delete)', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create test employee
      const employeeData = {
        employeeId: 'TEST_DELETE_ME',
        firstName: 'Delete',
        lastName: 'Me',
        email: 'delete.me@test.com',
        password: 'NewPassword123!',
        gender: 'other',
        dob: '1995-05-20',
        position: 'Test Subject',
        employmentStatus: 'full-time',
        isActive: true
      };

      const createResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(employeeData)
        .expect(201);

      const employeeId = createResponse.body.data.id;

      // Delete employee
      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify soft delete (employee should be inactive)
      const getResponse = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getResponse.body.data.isActive).toBe(false);
    });
  });

  describe('Employee Search and Filtering', () => {
    test('should search employees by name', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create test employees
      const employees = [
        {
          employeeId: 'TEST_SEARCH_1',
          firstName: 'Alice',
          lastName: 'Williams',
          email: 'alice.williams@test.com',
          password: 'NewPassword123!',
          gender: 'female',
          position: 'Designer',
          employmentStatus: 'full-time',
          isActive: true
        },
        {
          employeeId: 'TEST_SEARCH_2',
          firstName: 'Charlie',
          lastName: 'Brown',
          email: 'charlie.brown@test.com',
          password: 'NewPassword123!',
          gender: 'male',
          position: 'Developer',
          employmentStatus: 'part-time',
          isActive: true
        }
      ];

      for (const employee of employees) {
        await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${token}`)
          .send(employee)
          .expect(201);
      }

      // Search for employees with name containing "Alice"
      const response = await request(app)
        .get('/api/employees?search=Alice')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employees).toHaveLength(1);
      expect(response.body.data.employees[0].firstName).toBe('Alice');
    });

    test('should filter employees by employment status', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create test employees with different statuses
      const employees = [
        {
          employeeId: 'TEST_FILTER_1',
          firstName: 'FullTime1',
          employmentStatus: 'full-time',
          isActive: true
        },
        {
          employeeId: 'TEST_FILTER_2',
          firstName: 'FullTime2',
          employmentStatus: 'full-time',
          isActive: true
        },
        {
          employeeId: 'TEST_FILTER_3',
          firstName: 'PartTime1',
          employmentStatus: 'part-time',
          isActive: true
        }
      ];

      for (const employee of employees) {
        await request(app)
          .post('/api/employees')
          .set('Authorization', `Bearer ${token}`)
          .send(employee)
          .expect(201);
      }

      // Filter for full-time employees only
      const response = await request(app)
        .get('/api/employees?employmentStatus=full-time')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.employees).toHaveLength(2);
      expect(response.body.data.employees.every(e => e.employmentStatus === 'full-time')).toBe(true);
    });
  });

  describe('Employee Hierarchy', () => {
    test('should get employee subordinates', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          employeeId: 'TEST_ADMIN',
          password: 'TestPassword123!'
        });

      const token = loginResponse.body.data.accessToken;

      // Create manager and subordinates
      const managerData = {
        employeeId: 'TEST_MANAGER',
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@test.com',
        password: 'NewPassword123!',
        gender: 'male',
        position: 'Manager',
        employmentStatus: 'full-time',
        isActive: true
      };

      const subordinate1Data = {
        employeeId: 'TEST_SUB_1',
        firstName: 'Subordinate',
        lastName: 'One',
        email: 'sub1@test.com',
        password: 'NewPassword123!',
        gender: 'male',
        position: 'Developer',
        employmentStatus: 'full-time',
        reportingTo: null,
        isActive: true
      };

      const subordinate2Data = {
        employeeId: 'TEST_SUB_2',
        firstName: 'Subordinate',
        lastName: 'Two',
        email: 'sub2@test.com',
        password: 'NewPassword123!',
        gender: 'female',
        position: 'Designer',
        employmentStatus: 'full-time',
        reportingTo: null,
        isActive: true
      };

      // Create manager
      const managerResponse = await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send(managerData)
        .expect(201);

      const managerId = managerResponse.body.data.id;

      // Create subordinates
      await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...subordinate1Data, reportingTo: managerId })
        .expect(201);

      await request(app)
        .post('/api/employees')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...subordinate2Data, reportingTo: managerId })
        .expect(201);

      // Get subordinates of manager
      const response = await request(app)
        .get(`/api/employees/${managerId}/subordinates`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.some(e => e.firstName === 'Subordinate')).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('should handle validation errors', async () => {
      const response = await request(app)
        .post('/api/employees')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          firstName: '', // Missing required field
          email: 'invalid-email', // Invalid email format
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Validation failed');
    });

    test('should handle not found errors', async () => {
      const response = await request(app)
        .get('/api/employees/99999')
        .set('Authorization', 'Bearer invalid_token')
        .expect(404);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('not found');
    });
  });

  describe('Rate Limiting', () => {
    test('should limit login attempts', async () => {
      const loginData = {
        employeeId: 'TEST_RATE_LIMIT',
        password: 'wrongpassword'
      };

      // Make multiple failed attempts
      for (let i = 0; i < 6; i++) {
        await request(app)
          .post('/api/auth/login')
          .send(loginData)
          .expect(401);
      }

      // Should be locked after 5 attempts
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(423);

      expect(response.status).toBe(423);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('temporarily locked');
    });
  });
});