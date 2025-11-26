/**
 * Configuration validation utility
 * Validates environment variables and provides defaults
 */

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

const optionalEnvVars = {
  'NODE_ENV': 'development',
  'PORT': '3000',
  'REDIS_HOST': 'localhost',
  'REDIS_PORT': '6379',
  'REDIS_DB': '0',
  'BCRYPT_ROUNDS': '12',
  'UPLOAD_MAX_SIZE': '10485760',
  'UPLOAD_ALLOWED_TYPES': 'image/jpeg,image/png,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'CORS_ORIGIN': 'http://localhost:3000,http://localhost:3001',
  'RATE_LIMIT_WINDOW_MS': '900000',
  'RATE_LIMIT_MAX_REQUESTS': '100',
  'RATE_LIMIT_LOGIN_ATTEMPTS': '5',
  'RATE_LIMIT_LOCKOUT_DURATION': '15',
  'LOG_LEVEL': 'info',
  'DEFAULT_PAGE_SIZE': '10',
  'MAX_PAGE_SIZE': '100',
  'CACHE_TTL': '3600',
  'CACHE_ENABLED': 'true',
  'SESSION_MAX_AGE': '86400000',
  'COMPRESSION_ENABLED': 'true',
  'COMPRESSION_LEVEL': '6',
  'HELMET_ENABLED': 'true',
  'FRAMEGUARD_ACTION': 'deny',
  'HSTS_MAX_AGE': '31536000',
  'DB_POOL_MIN': '2',
  'DB_POOL_MAX': '10',
  'DB_POOL_ACQUIRE_TIMEOUT': '60000',
  'DB_POOL_IDLE_TIMEOUT': '30000',
  'HEALTH_CHECK_INTERVAL': '30000',
  'HEALTH_CHECK_TIMEOUT': '5000',
  'ENABLE_FILE_UPLOAD': 'true',
  'ENABLE_BULK_OPERATIONS': 'true',
  'ENABLE_ANALYTICS': 'true',
  'ENABLE_ACTIVITY_LOGGING': 'true',
  'ENABLE_EMAIL_NOTIFICATIONS': 'false',
  'SWAGGER_ENABLED': 'true',
  'FORCE_HTTPS': 'false',
  'TRUST_PROXY': 'false'
};

/**
 * Validate required environment variables
 */
function validateRequiredEnv() {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Parse boolean environment variable
 */
function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  const strValue = String(value).toLowerCase().trim();
  return strValue === 'true' || strValue === '1' || strValue === 'yes';
}

/**
 * Parse integer environment variable
 */
function parseInteger(value, defaultValue = 0) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse array environment variable (comma-separated)
 */
function parseArray(value, defaultValue = []) {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  return String(value).split(',').map(item => item.trim()).filter(item => item.length > 0);
}

/**
 * Validate and normalize configuration
 */
function validateConfig() {
  const config = {};
  
  // Validate required environment variables
  validateRequiredEnv();
  
  // Set required variables
  for (const envVar of requiredEnvVars) {
    config[envVar] = process.env[envVar];
  }
  
  // Set optional variables with defaults and validation
  for (const [envVar, defaultValue] of Object.entries(optionalEnvVars)) {
    const value = process.env[envVar] || defaultValue;
    
    // Type-specific validation
    if (envVar.includes('ENABLED') || envVar === 'FORCE_HTTPS' || envVar === 'TRUST_PROXY' || envVar === 'CACHE_ENABLED') {
      config[envVar] = parseBoolean(value, parseBoolean(defaultValue));
    } else if (envVar.includes('PORT') || envVar.includes('MAX') || envVar.includes('MIN') || envVar.includes('TIMEOUT') || envVar.includes('AGE') || envVar.includes('ROUNDS') || envVar.includes('SIZE') || envVar.includes('INTERVAL') || envVar.includes('TTL') || envVar.includes('LEVEL') || envVar.includes('ATTEMPTS') || envVar.includes('DURATION') || envVar.includes('MS')) {
      config[envVar] = parseInteger(value, parseInteger(defaultValue));
    } else if (envVar === 'CORS_ORIGIN' || envVar === 'UPLOAD_ALLOWED_TYPES') {
      config[envVar] = parseArray(value, parseArray(defaultValue));
    } else {
      config[envVar] = value;
    }
  }
  
  // Additional validation
  if (config.PORT < 1 || config.PORT > 65535) {
    throw new Error('PORT must be between 1 and 65535');
  }
  
  if (config.REDIS_PORT < 1 || config.REDIS_PORT > 65535) {
    throw new Error('REDIS_PORT must be between 1 and 65535');
  }
  
  if (config.BCRYPT_ROUNDS < 10 || config.BCRYPT_ROUNDS > 15) {
    throw new Error('BCRYPT_ROUNDS must be between 10 and 15');
  }
  
  if (config.UPLOAD_MAX_SIZE < 1024 || config.UPLOAD_MAX_SIZE > 104857600) {
    throw new Error('UPLOAD_MAX_SIZE must be between 1024 and 104857600 bytes');
  }
  
  if (config.DEFAULT_PAGE_SIZE < 1 || config.DEFAULT_PAGE_SIZE > 100) {
    throw new Error('DEFAULT_PAGE_SIZE must be between 1 and 100');
  }
  
  if (config.MAX_PAGE_SIZE < 1 || config.MAX_PAGE_SIZE > 1000) {
    throw new Error('MAX_PAGE_SIZE must be between 1 and 1000');
  }
  
  if (config.CACHE_TTL < 60 || config.CACHE_TTL > 86400) {
    throw new Error('CACHE_TTL must be between 60 and 86400 seconds');
  }
  
  if (config.RATE_LIMIT_WINDOW_MS < 60000 || config.RATE_LIMIT_WINDOW_MS > 3600000) {
    throw new Error('RATE_LIMIT_WINDOW_MS must be between 60000 and 3600000 milliseconds');
  }
  
  if (config.RATE_LIMIT_MAX_REQUESTS < 1 || config.RATE_LIMIT_MAX_REQUESTS > 10000) {
    throw new Error('RATE_LIMIT_MAX_REQUESTS must be between 1 and 10000');
  }
  
  if (config.RATE_LIMIT_LOGIN_ATTEMPTS < 1 || config.RATE_LIMIT_LOGIN_ATTEMPTS > 20) {
    throw new Error('RATE_LIMIT_LOGIN_ATTEMPTS must be between 1 and 20');
  }
  
  if (config.RATE_LIMIT_LOCKOUT_DURATION < 1 || config.RATE_LIMIT_LOCKOUT_DURATION > 1440) {
    throw new Error('RATE_LIMIT_LOCKOUT_DURATION must be between 1 and 1440 minutes');
  }
  
  // Database URL validation
  if (config.DATABASE_URL && !config.DATABASE_URL.startsWith('mysql://') && !config.DATABASE_URL.startsWith('postgresql://')) {
    throw new Error('DATABASE_URL must be a valid MySQL or PostgreSQL connection string');
  }
  
  // JWT secret validation
  if (config.JWT_SECRET && config.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  
  if (config.JWT_REFRESH_SECRET && config.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }
  
  return config;
}

/**
 * Get environment-specific configuration
 */
function getEnvironmentConfig() {
  const env = process.env.NODE_ENV || 'development';
  
  const envConfigs = {
    development: {
      LOG_LEVEL: 'debug',
      SWAGGER_ENABLED: true,
      CACHE_ENABLED: false,
      ENABLE_EMAIL_NOTIFICATIONS: false,
      FORCE_HTTPS: false
    },
    test: {
      LOG_LEVEL: 'error',
      SWAGGER_ENABLED: false,
      CACHE_ENABLED: false,
      ENABLE_EMAIL_NOTIFICATIONS: false,
      FORCE_HTTPS: false,
      BCRYPT_ROUNDS: 10 // Faster for tests
    },
    staging: {
      LOG_LEVEL: 'info',
      SWAGGER_ENABLED: true,
      CACHE_ENABLED: true,
      ENABLE_EMAIL_NOTIFICATIONS: true,
      FORCE_HTTPS: true
    },
    production: {
      LOG_LEVEL: 'warn',
      SWAGGER_ENABLED: false,
      CACHE_ENABLED: true,
      ENABLE_EMAIL_NOTIFICATIONS: true,
      FORCE_HTTPS: true,
      HELMET_ENABLED: true,
      COMPRESSION_ENABLED: true
    }
  };
  
  return envConfigs[env] || envConfigs.development;
}

/**
 * Merge environment-specific configuration
 */
function mergeEnvironmentConfig(config) {
  const envConfig = getEnvironmentConfig();
  
  return {
    ...config,
    ...envConfig
  };
}

/**
 * Validate and return complete configuration
 */
function getConfig() {
  try {
    const config = validateConfig();
    const mergedConfig = mergeEnvironmentConfig(config);
    
    return {
      ...mergedConfig,
      isProduction: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV === 'development',
      isTest: process.env.NODE_ENV === 'test'
    };
  } catch (error) {
    console.error('Configuration validation failed:', error.message);
    process.exit(1);
  }
}

/**
 * Print configuration summary (without sensitive data)
 */
function printConfigSummary() {
  const config = getConfig();
  
  console.log('🔧 Configuration Summary:');
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   Port: ${config.PORT}`);
  console.log(`   Database: ${config.DATABASE_URL ? 'Configured' : 'Not configured'}`);
  console.log(`   Redis: ${config.REDIS_HOST ? `${config.REDIS_HOST}:${config.REDIS_PORT}` : 'Not configured'}`);
  console.log(`   Cache Enabled: ${config.CACHE_ENABLED}`);
  console.log(`   File Upload Enabled: ${config.ENABLE_FILE_UPLOAD}`);
  console.log(`   Analytics Enabled: ${config.ENABLE_ANALYTICS}`);
  console.log(`   Activity Logging Enabled: ${config.ENABLE_ACTIVITY_LOGGING}`);
  console.log(`   Email Notifications Enabled: ${config.ENABLE_EMAIL_NOTIFICATIONS}`);
  console.log(`   Swagger Enabled: ${config.SWAGGER_ENABLED}`);
  console.log(`   HTTPS Enforced: ${config.FORCE_HTTPS}`);
}

module.exports = {
  validateConfig,
  getConfig,
  printConfigSummary,
  validateRequiredEnv,
  parseBoolean,
  parseInteger,
  parseArray
};