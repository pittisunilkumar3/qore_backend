const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const prisma = new PrismaClient();

describe('File Management API', () => {
  let authToken;
  let testEmployeeId;

  beforeAll(async () => {
    // Clean up test data
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'FILE_TEST_'
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

    // Create test employee
    const employeeResponse = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        employeeId: 'FILE_TEST_001',
        firstName: 'File',
        lastName: 'Test',
        email: 'file.test@example.com',
        password: 'TestPassword123!',
        gender: 'male',
        position: 'File Tester',
        employmentStatus: 'full-time',
        isActive: true
      });

    testEmployeeId = employeeResponse.body.data.id;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'FILE_TEST_'
        }
      }
    });

    // Clean up test files
    const testFilesDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(testFilesDir)) {
      const files = fs.readdirSync(testFilesDir);
      for (const file of files) {
        if (file.startsWith('FILE_TEST_')) {
          fs.unlinkSync(path.join(testFilesDir, file));
        }
      }
    }
  });

  describe('POST /api/files/upload-photo', () => {
    test('should upload employee photo', async () => {
      const testImageBuffer = Buffer.from('fake-image-data');
      
      const response = await request(app)
        .post('/api/files/upload-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('photo', testImageBuffer, 'test-photo.jpg')
        .field('employeeId', testEmployeeId)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.photoUrl).toBeDefined();
      expect(response.body.data.photoUrl).toContain('.jpg');
    });

    test('should reject photo upload without file', async () => {
      const response = await request(app)
        .post('/api/files/upload-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .field('employeeId', testEmployeeId)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No photo file uploaded');
    });

    test('should reject photo upload without authentication', async () => {
      const testImageBuffer = Buffer.from('fake-image-data');
      
      const response = await request(app)
        .post('/api/files/upload-photo')
        .attach('photo', testImageBuffer, 'test-photo.jpg')
        .field('employeeId', testEmployeeId)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });

    test('should reject invalid file type', async () => {
      const testFileBuffer = Buffer.from('fake-file-data');
      
      const response = await request(app)
        .post('/api/files/upload-photo')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('photo', testFileBuffer, 'test-file.txt')
        .field('employeeId', testEmployeeId)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid file type');
    });
  });

  describe('POST /api/files/upload-document', () => {
    test('should upload employee document', async () => {
      const testDocBuffer = Buffer.from('fake-document-data');
      
      const response = await request(app)
        .post('/api/files/upload-document')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('document', testDocBuffer, 'test-document.pdf')
        .field('employeeId', testEmployeeId)
        .field('documentType', 'resume')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.documentUrl).toBeDefined();
      expect(response.body.data.documentUrl).toContain('.pdf');
    });

    test('should reject document upload without file', async () => {
      const response = await request(app)
        .post('/api/files/upload-document')
        .set('Authorization', `Bearer ${authToken}`)
        .field('employeeId', testEmployeeId)
        .field('documentType', 'resume')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('No document file uploaded');
    });

    test('should reject document upload without document type', async () => {
      const testDocBuffer = Buffer.from('fake-document-data');
      
      const response = await request(app)
        .post('/api/files/upload-document')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('document', testDocBuffer, 'test-document.pdf')
        .field('employeeId', testEmployeeId)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Document type is required');
    });
  });

  describe('GET /api/files/download/:type/:filename', () => {
    test('should download uploaded file', async () => {
      // First upload a file
      const testDocBuffer = Buffer.from('download-test-document-data');
      
      const uploadResponse = await request(app)
        .post('/api/files/upload-document')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('document', testDocBuffer, 'download-test.pdf')
        .field('employeeId', testEmployeeId)
        .field('documentType', 'resume');

      const filename = uploadResponse.body.data.documentUrl.split('/').pop();

      // Then download it
      const response = await request(app)
        .get(`/api/files/download/documents/${filename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.headers['content-type']).toContain('application/pdf');
      expect(response.headers['content-disposition']).toContain('attachment');
    });

    test('should reject download of non-existent file', async () => {
      const response = await request(app)
        .get('/api/files/download/documents/non-existent-file.pdf')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('File not found');
    });

    test('should reject download without authentication', async () => {
      const response = await request(app)
        .get('/api/files/download/documents/test-file.pdf')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('DELETE /api/files/:type/:filename', () => {
    test('should delete uploaded file', async () => {
      // First upload a file
      const testDocBuffer = Buffer.from('delete-test-document-data');
      
      const uploadResponse = await request(app)
        .post('/api/files/upload-document')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('document', testDocBuffer, 'delete-test.pdf')
        .field('employeeId', testEmployeeId)
        .field('documentType', 'resume');

      const filename = uploadResponse.body.data.documentUrl.split('/').pop();

      // Then delete it
      const response = await request(app)
        .delete(`/api/files/documents/${filename}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('File deleted successfully');
    });

    test('should reject deletion of non-existent file', async () => {
      const response = await request(app)
        .delete('/api/files/documents/non-existent-file.pdf')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('File not found');
    });

    test('should reject deletion without authentication', async () => {
      const response = await request(app)
        .delete('/api/files/documents/test-file.pdf')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });
});