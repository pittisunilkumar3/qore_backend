/**
 * Database Configuration
 * Reads database settings from .env file and provides connection configurations
 * JavaScript version for compatibility with server.js
 */

const mysql = require('mysql2/promise');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Database configuration interface (JSDoc for IDE support)
/**
 * @typedef {Object} DatabaseConfig
 * @property {string} host
 * @property {number} port
 * @property {string} user
 * @property {string} password
 * @property {string} database
 * @property {boolean} waitForConnections
 * @property {number} connectionLimit
 * @property {number} queueLimit
 * @property {number} acquireTimeout
 * @property {number} timeout
 * @property {boolean} reconnect
 */

// Environment-specific configurations
const databaseConfigs = {
  // Development configuration (XAMPP MySQL)
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'qore_backend',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },

  // Testing configuration
  test: {
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT || '3306'),
    user: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || '',
    database: process.env.TEST_DB_NAME || 'qore_backend_test',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  },

  // Production configuration
  production: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: parseInt(process.env.PROD_DB_PORT || '3306'),
    user: process.env.PROD_DB_USER || 'root',
    password: process.env.PROD_DB_PASSWORD || '',
    database: process.env.PROD_DB_NAME || 'qore_backend_prod',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  },
};

// Get current environment
const getEnvironment = () => {
  return process.env.NODE_ENV || 'development';
};

// Get database configuration for current environment
const getDatabaseConfig = () => {
  const env = getEnvironment();
  return databaseConfigs[env] || databaseConfigs.development;
};

// Create MySQL connection pool
const createConnectionPool = (config) => {
  const dbConfig = config || getDatabaseConfig();
  
  return mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: dbConfig.waitForConnections,
    connectionLimit: dbConfig.connectionLimit,
    queueLimit: dbConfig.queueLimit,
    acquireTimeout: dbConfig.acquireTimeout,
    timeout: dbConfig.timeout,
    reconnect: dbConfig.reconnect,
  });
};

// Global connection pool instance
let globalPool = null;

// Get or create global connection pool
const getConnectionPool = () => {
  if (!globalPool) {
    globalPool = createConnectionPool();
  }
  return globalPool;
};

// Test database connection
const testConnection = async (config) => {
  try {
    const pool = createConnectionPool(config);
    const connection = await pool.getConnection();
    
    // Test query
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    
    return {
      success: true,
      message: 'Database connection successful',
      config: config || getDatabaseConfig(),
    };
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      config: config || getDatabaseConfig(),
      error: error.message,
    };
  }
};

// Close all connections
const closeConnection = async () => {
  if (globalPool) {
    await globalPool.end();
    globalPool = null;
  }
};

// Health check function
const getDatabaseHealth = async () => {
  const config = getDatabaseConfig();
  const connectionTest = await testConnection(config);
  
  return {
    status: connectionTest.success ? 'healthy' : 'unhealthy',
    environment: getEnvironment(),
    database: {
      type: 'MySQL',
      host: config.host,
      port: config.port,
      name: config.database,
      user: config.user,
    },
    connection: {
      poolSize: config.connectionLimit,
      active: connectionTest.success,
      message: connectionTest.message,
    },
    timestamp: new Date().toISOString(),
  };
};

// Prisma-style configuration for compatibility
const prismaConfig = {
  datasource: {
    url: `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'qore_backend'}`,
  },
};

// Export all functions and configurations
module.exports = {
  getConnectionPool,
  getDatabaseHealth,
  getEnvironment,
  testConnection,
  getDatabaseConfig,
  closeConnection,
  databaseConfigs,
  prismaConfig,
  createConnectionPool,
};