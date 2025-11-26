const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('../server');

const prisma = new PrismaClient();

// Load testing configuration
const LOAD_TEST_CONFIG = {
  concurrentUsers: 10,
  requestsPerUser: 50,
  endpoints: [
    { method: 'get', path: '/api/employees', auth: true },
    { method: 'get', path: '/api/analytics/dashboard', auth: true },
    { method: 'get', path: '/api/analytics/statistics', auth: true },
    { method: 'get', path: '/api/analytics/reports/employee-timeline', auth: true }
  ]
};

class LoadTester {
  constructor() {
    this.results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      responseTimes: [],
      errors: []
    };
  }

  async setup() {
    // Create test admin user if not exists
    const hashedPassword = await require('bcrypt').hash('TestPassword123!', 12);
    
    await prisma.employee.upsert({
      where: { employeeId: 'LOAD_TEST_ADMIN' },
      update: {},
      create: {
        employeeId: 'LOAD_TEST_ADMIN',
        firstName: 'Load',
        lastName: 'Test Admin',
        email: 'load.test.admin@example.com',
        password: hashedPassword,
        gender: 'male',
        position: 'Load Test Admin',
        employmentStatus: 'full-time',
        isSuperadmin: true,
        isActive: true
      }
    });

    // Login to get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        employeeId: 'LOAD_TEST_ADMIN',
        password: 'TestPassword123!'
      });

    this.authToken = loginResponse.body.data.accessToken;
  }

  async makeRequest(endpoint) {
    const startTime = Date.now();
    
    try {
      let req = request(app);
      
      if (endpoint.auth) {
        req = req.set('Authorization', `Bearer ${this.authToken}`);
      }

      const response = await req[endpoint.method](endpoint.path);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.results.responseTimes.push(responseTime);
      this.results.successfulRequests++;
      
      return { success: true, responseTime, status: response.status };
    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      this.results.responseTimes.push(responseTime);
      this.results.failedRequests++;
      this.results.errors.push({
        endpoint: endpoint.path,
        error: error.message,
        responseTime
      });
      
      return { success: false, responseTime, error: error.message };
    }
  }

  async runUserLoad(userId) {
    console.log(`Starting load test for user ${userId}`);
    
    for (let i = 0; i < LOAD_TEST_CONFIG.requestsPerUser; i++) {
      const endpoint = LOAD_TEST_CONFIG.endpoints[
        Math.floor(Math.random() * LOAD_TEST_CONFIG.endpoints.length)
      ];
      
      await this.makeRequest(endpoint);
      this.results.totalRequests++;
    }
    
    console.log(`Completed load test for user ${userId}`);
  }

  async runLoadTest() {
    console.log('Starting load test...');
    console.log(`Concurrent users: ${LOAD_TEST_CONFIG.concurrentUsers}`);
    console.log(`Requests per user: ${LOAD_TEST_CONFIG.requestsPerUser}`);
    console.log(`Total expected requests: ${LOAD_TEST_CONFIG.concurrentUsers * LOAD_TEST_CONFIG.requestsPerUser}`);
    
    const startTime = Date.now();
    
    // Run concurrent users
    const promises = [];
    for (let i = 0; i < LOAD_TEST_CONFIG.concurrentUsers; i++) {
      promises.push(this.runUserLoad(i + 1));
    }
    
    await Promise.all(promises);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    // Calculate statistics
    const avgResponseTime = this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length;
    const minResponseTime = Math.min(...this.results.responseTimes);
    const maxResponseTime = Math.max(...this.results.responseTimes);
    const requestsPerSecond = (this.results.totalRequests / totalTime) * 1000;
    const successRate = (this.results.successfulRequests / this.results.totalRequests) * 100;
    
    // Sort response times for percentile calculation
    const sortedTimes = this.results.responseTimes.sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    console.log('\n=== Load Test Results ===');
    console.log(`Total time: ${totalTime}ms`);
    console.log(`Total requests: ${this.results.totalRequests}`);
    console.log(`Successful requests: ${this.results.successfulRequests}`);
    console.log(`Failed requests: ${this.results.failedRequests}`);
    console.log(`Success rate: ${successRate.toFixed(2)}%`);
    console.log(`Requests per second: ${requestsPerSecond.toFixed(2)}`);
    console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
    console.log(`Min response time: ${minResponseTime}ms`);
    console.log(`Max response time: ${maxResponseTime}ms`);
    console.log(`50th percentile: ${p50}ms`);
    console.log(`90th percentile: ${p90}ms`);
    console.log(`95th percentile: ${p95}ms`);
    console.log(`99th percentile: ${p99}ms`);
    
    if (this.results.errors.length > 0) {
      console.log('\n=== Errors ===');
      this.results.errors.slice(0, 10).forEach((error, index) => {
        console.log(`${index + 1}. ${error.endpoint}: ${error.error}`);
      });
      
      if (this.results.errors.length > 10) {
        console.log(`... and ${this.results.errors.length - 10} more errors`);
      }
    }
    
    // Performance benchmarks
    console.log('\n=== Performance Benchmarks ===');
    if (avgResponseTime > 1000) {
      console.log('⚠️  Average response time is above 1000ms - consider optimization');
    } else if (avgResponseTime > 500) {
      console.log('⚠️  Average response time is above 500ms - monitor performance');
    } else {
      console.log('✅ Average response time is within acceptable range');
    }
    
    if (successRate < 95) {
      console.log('⚠️  Success rate is below 95% - investigate failures');
    } else {
      console.log('✅ Success rate is within acceptable range');
    }
    
    if (requestsPerSecond < 10) {
      console.log('⚠️  Requests per second is below 10 - consider scaling');
    } else {
      console.log('✅ Requests per second is within acceptable range');
    }
    
    return this.results;
  }

  async cleanup() {
    // Clean up test data
    await prisma.employee.deleteMany({
      where: {
        employeeId: {
          startsWith: 'LOAD_TEST_'
        }
      }
    });
  }
}

// Run load test if this file is executed directly
if (require.main === module) {
  const loadTester = new LoadTester();
  
  loadTester.setup()
    .then(() => loadTester.runLoadTest())
    .then((results) => {
      console.log('\nLoad test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Load test failed:', error);
      process.exit(1);
    })
    .finally(() => {
      loadTester.cleanup();
    });
}

module.exports = LoadTester;