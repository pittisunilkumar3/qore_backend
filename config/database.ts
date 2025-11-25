/**
 * Database Configuration
 * Reads database settings from .env file and provides connection configurations
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration interface
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

// Environment-specific configurations
export const databaseConfigs = {
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
  } as DatabaseConfig,

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
  } as DatabaseConfig,

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
  } as DatabaseConfig,
};

// Get current environment
export const getEnvironment = (): string => {
  return process.env.NODE_ENV || 'development';
};

// Get database configuration for current environment
export const getDatabaseConfig = (): DatabaseConfig => {
  const env = getEnvironment();
  return databaseConfigs[env as keyof typeof databaseConfigs] || databaseConfigs.development;
};

// Create MySQL connection pool
export const createConnectionPool = (config?: DatabaseConfig): mysql.Pool => {
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
  });
};

// Global connection pool instance
let globalPool: mysql.Pool | null = null;

// Get or create global connection pool
export const getConnectionPool = (): mysql.Pool => {
  if (!globalPool) {
    globalPool = createConnectionPool();
  }
  return globalPool;
};

// Test database connection
export const testConnection = async (config?: DatabaseConfig): Promise<{
  success: boolean;
  message: string;
  config?: DatabaseConfig;
  error?: string;
}> => {
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
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Close all connections
export const closeConnection = async (): Promise<void> => {
  if (globalPool) {
    await globalPool.end();
    globalPool = null;
  }
};

// Health check function
export const getDatabaseHealth = async () => {
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
export const prismaConfig = {
  datasource: {
    url: `mysql://${process.env.DB_USER || 'root'}:${process.env.DB_PASSWORD || ''}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'qore_backend'}`,
  },
};