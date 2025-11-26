const { PrismaClient } = require('@prisma/client');

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Initialize test database connection
  const prisma = new PrismaClient();
  
  // Clean up test data before running tests
  await prisma.activityLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.employee.deleteMany({
    where: {
      employeeId: {
        startsWith: 'TEST_'
      }
    }
  });
  
  // Create test admin user
  const hashedPassword = await require('bcrypt').hash('TestPassword123!', 12);
  
  await prisma.employee.create({
    data: {
      employeeId: 'TEST_ADMIN',
      firstName: 'Test',
      lastName: 'Admin',
      email: 'test.admin@example.com',
      password: hashedPassword,
      gender: 'male',
      position: 'System Administrator',
      employmentStatus: 'full-time',
      isSuperadmin: true,
      isActive: true
    }
  });
  
  await prisma.$disconnect();
});

// Global test teardown
afterAll(async () => {
  // Clean up test data after running tests
  const prisma = new PrismaClient();
  
  await prisma.activityLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.employee.deleteMany({
    where: {
      employeeId: {
        startsWith: 'TEST_'
      }
    }
  });
  
  await prisma.$disconnect();
});

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};