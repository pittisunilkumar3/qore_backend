const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import configuration validator
const { getConfig, printConfigSummary } = require('./src/utils/configValidator');

// Validate and get configuration
const config = getConfig();

// Print configuration summary
printConfigSummary();

// Import database configuration from config folder
const {
  getConnectionPool,
  getDatabaseHealth,
  getEnvironment,
  testConnection,
  getDatabaseConfig
} = require('./config/database.js');

// Import Redis client
const redisClient = require('./src/utils/redis');

// Import Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import error handlers
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = config.PORT || 3000;

const { apiLimiter } = require('./src/middleware/rateLimiter');

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Enable compression if configured
if (config.COMPRESSION_ENABLED) {
  const compression = require('compression');
  app.use(compression({
    level: config.COMPRESSION_LEVEL
  }));
}

// Enable security headers if configured
if (config.HELMET_ENABLED) {
  const helmet = require('helmet');
  app.use(helmet({
    frameguard: { action: config.FRAMEGUARD_ACTION },
    hsts: {
      maxAge: config.HSTS_MAX_AGE,
      includeSubDomains: config.FORCE_HTTPS
    }
  }));
}

// Trust proxy if configured
if (config.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Apply general rate limiting to all API routes
if (config.RATE_LIMIT_MAX_REQUESTS > 0) {
  app.use('/api/', apiLimiter);
}

// Get database configuration
const dbConfig = getDatabaseConfig();
console.log('🔧 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  environment: getEnvironment()
});

// Create connection pool using config
const pool = getConnectionPool();

// Test database connection using new config system
async function testDatabaseConnection() {
  try {
    const connectionTest = await testConnection();
    const health = await getDatabaseHealth();
    
    if (connectionTest.success) {
      console.log('✅ MySQL Database: Connected successfully to XAMPP MySQL');
      console.log('📊 Database:', connectionTest.config.database);
      console.log('🔗 Host:', connectionTest.config.host + ':' + connectionTest.config.port);
      console.log('🌍 Environment:', getEnvironment());
      console.log('🏥 Health Status:', health.status);
      return true;
    } else {
      console.log('❌ MySQL Database: Connection failed');
      console.log('🔧 Please ensure:');
      console.log('   1. XAMPP is running');
      console.log('   2. MySQL service is started');
      console.log('   3. Database "qore_backend" exists');
      console.log('   4. Check .env file for correct credentials');
      console.log('💡 Error:', connectionTest.error);
      return false;
    }
  } catch (error) {
    console.log('❌ MySQL Database: Connection test failed');
    console.log('💡 Error:', error.message);
    return false;
  }
}

// Routes

// Health Check Route - Main API Info
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testDatabaseConnection();
    
    res.json({
      success: true,
      message: '🎉 Qore Backend API is Running Successfully!',
      timestamp: new Date().toISOString(),
      database: {
        type: 'MySQL (XAMPP)',
        connected: dbConnected,
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database
      },
      server: {
        status: 'healthy',
        port: PORT,
        environment: process.env.NODE_ENV || 'development'
      },
      endpoints: {
        health: 'GET /api/health - This endpoint',
        database: 'GET /api/database - Database status',
        hello: 'GET /api/hello - Hello World endpoint',
        migration: 'GET /api/migration - Migration folder info'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Database Status Route
app.get('/api/database', async (req, res) => {
  try {
    const health = await getDatabaseHealth();
    const connectionTest = await testConnection();
    
    res.json({
      success: true,
      message: 'Database Connection Status',
      database: {
        type: 'MySQL',
        provider: 'XAMPP',
        host: health.database.host,
        port: health.database.port,
        name: health.database.name,
        user: health.database.user,
        status: health.connection.active ? 'connected' : 'disconnected',
        environment: health.environment,
        poolSize: health.connection.poolSize,
        healthStatus: health.status
      },
      config: {
        source: '.env file via config/database.ts',
        host: getDatabaseConfig().host,
        port: getDatabaseConfig().port,
        database: getDatabaseConfig().database,
        user: getDatabaseConfig().user
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database Connection Failed',
      error: error.message,
      database: {
        type: 'MySQL',
        provider: 'XAMPP',
        status: 'error'
      }
    });
  }
});

// Hello World Route
app.get('/api/hello', (req, res) => {
  res.json({
    success: true,
    message: 'Hello World! 👋',
    timestamp: new Date().toISOString(),
    backend: 'Qore Backend API',
    database: 'MySQL (XAMPP)',
    status: 'running'
  });
});

// Migration Info Route
app.get('/api/migration', (req, res) => {
  res.json({
    success: true,
    message: 'Migration System Ready',
    migration_folder: {
      path: 'prisma/migrations/',
      status: 'created',
      provider: 'Prisma ORM',
      database: 'MySQL'
    },
    available_commands: [
      'npx prisma generate - Generate Prisma Client',
      'npx prisma db push - Push schema changes',
      'npx prisma migrate dev - Create migration',
      'npx prisma studio - Open database GUI'
    ],
    timestamp: new Date().toISOString()
  });
});

// Import routes
const rolesRoutes = require('./src/routes/roles');
const authRoutes = require('./src/routes/auth');
const employeeRoutes = require('./src/routes/employees');
const fileRoutes = require('./src/routes/files');
const importExportRoutes = require('./src/routes/importExport');
const swaggerRoutes = require('./src/routes/swagger');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/import', importExportRoutes);
app.use('/api/export', importExportRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/docs', swaggerRoutes);

// ==================== ROOT ROUTE ====================

// Root route - serve static index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

// API info route
app.get('/api/info', (req, res) => {
  res.json({
    success: true,
    message: 'Qore Backend API - Welcome! 🚀',
    version: '1.0.0',
    database: 'MySQL (XAMPP)',
    endpoints: {
      api_health: '/api/health',
      api_database: '/api/database',
      api_hello: '/api/hello',
      api_migration: '/api/migration',
      api_auth: '/api/auth - Authentication API',
      api_employees: '/api/employees - Employee management API',
      api_files: '/api/files - File management API',
      api_import: '/api/import - Import data API',
      api_export: '/api/export - Export data API',
      api_roles: '/api/roles - Role management API',
      api_docs: '/api/docs - API Documentation (Swagger)'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    available_endpoints: [
      'GET / - Welcome message',
      'GET /api/health - Main health check',
      'GET /api/database - Database status', 
      'GET /api/hello - Hello World',
      'GET /api/migration - Migration info'
    ]
  });
});

// Start server
async function startServer() {
  console.log('🚀 Starting Qore Backend API...');
  console.log('📁 Project: qore-backend');
  console.log('🗄️  Database: MySQL (XAMPP)');
  console.log('📂 Migration folder: prisma/migrations/');
  
  // Test database connection on startup
  await testDatabaseConnection();
  
  // Initialize Redis connection
  const redisConnected = await redisClient.connect();
  if (redisConnected) {
    console.log('✅ Redis: Connected successfully');
  } else {
    console.log('⚠️  Redis: Connection failed - continuing without cache');
  }
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Hello World: http://localhost:${PORT}/api/hello`);
    console.log(`📊 Database: http://localhost:${PORT}/api/database`);
    console.log(`📁 Migration: http://localhost:${PORT}/api/migration`);
  });
}

// Apply error handling to all routes
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await redisClient.disconnect();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await redisClient.disconnect();
  await prisma.$disconnect();
  process.exit(0);
});