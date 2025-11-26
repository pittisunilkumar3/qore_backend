const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');

const prisma = new PrismaClient();

describe('Import/Export API', () => {
  let authToken;

  beforeAll(async () => {
    // Clean up test data
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'IMPORT_TEST_'
        }
      }
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        employeeId: 'TEST_ADMIN',
        password: 'TestPassword123!'
      });

    authToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'IMPORT_TEST_'
        }
      }
    });
  });

  describe('POST /api/import-export/import', () => {
    test('should import employees from CSV', async () => {
      // Create a simple CSV buffer
      const csvData = `employeeId,firstName,lastName,email,password,gender,position,employmentStatus
IMPORT_TEST_001,John,Doe,john.doe@test.com,password123,male,Software Engineer,full-time
IMPORT_TEST_002,Jane,Smith,jane.smith@test.com,password123,female,HR Manager,full-time`;

      const response = await request(app)
        .post('/api/import-export/import')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(csvData), 'employees.csv')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(2);
      expect(response.body.data.errors).toHaveLength(0);
    });

    test('should handle import errors gracefully', async () => {
      // Create a CSV with invalid data
      const csvData = `employeeId,firstName,lastName,email,password,gender,position,employmentStatus
IMPORT_TEST_003,Invalid,,invalid-email,password123,male,Software Engineer,full-time`;

      const response = await request(app)
        .post('/api/import-export/import')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from(csvData), 'invalid.csv')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.imported).toBe(0);
      expect(response.body.data.errors.length).toBeGreaterThan(0);
    });

    test('should reject import without file', async () => {
      const response = await request(app)
        .post('/api/import-export/import')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No file uploaded');
    });

    test('should reject import without authentication', async () => {
      const csvData = `employeeId,firstName,lastName,email,password,gender,position,employmentStatus
IMPORT_TEST_004,Test,User,test@test.com,password123,male,Tester,full-time`;

      const response = await request(app)
        .post('/api/import-export/import')
        .attach('file', Buffer.from(csvData), 'employees.csv')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('GET /api/import-export/export', () => {
    test('should export employees to CSV', async () => {
      const response = await request(app)
        .get('/api/import-export/export')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.text).toContain('employeeId,firstName,lastName');
    });

    test('should export filtered employees', async () => {
      const response = await request(app)
        .get('/api/import-export/export?employmentStatus=full-time')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.text).toContain('employeeId,firstName,lastName');
    });

    test('should reject export without authentication', async () => {
      const response = await request(app)
        .get('/api/import-export/export')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('GET /api/import-export/template', () => {
    test('should provide import template', async () => {
      const response = await request(app)
        .get('/api/import-export/template')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.text).toContain('employeeId,firstName,lastName');
    });

    test('should reject template request without authentication', async () => {
      const response = await request(app)
        .get('/api/import-export/template')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });
});