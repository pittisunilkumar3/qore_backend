# Database Configuration Guide

## Overview
The database configuration has been separated into the `config/` folder and reads all database settings from the `.env` file.

## Files
- `config/database.js` - Main configuration file (JavaScript)
- `config/database.ts` - TypeScript version with full type definitions
- `.env` - Environment variables with database credentials

## Configuration Structure

### Database Config (`config/database.js`)
- **Environment-based configs**: development, test, production
- **Connection pooling**: MySQL2 connection pools
- **Health checks**: Database connectivity testing
- **Error handling**: Comprehensive error management

### Environment Variables (`.env`)
```env
# Database Configuration
DB_HOST=localhost           # Database host
DB_PORT=3306               # Database port
DB_USER=root               # Database username
DB_PASSWORD=               # Database password (empty for XAMPP)
DB_NAME=qore_backend       # Database name

# Application Configuration
NODE_ENV=development       # Environment (development/test/production)
PORT=3000                 # Server port
```

## Usage Examples

### In JavaScript (server.js)
```javascript
const { getConnectionPool, getDatabaseHealth } = require('./config/database.js');

// Get connection pool
const pool = getConnectionPool();

// Test database connection
const health = await getDatabaseHealth();
```

### In TypeScript
```typescript
import { 
  getConnectionPool, 
  getDatabaseHealth, 
  DatabaseConfig 
} from './config/database.js';

const pool = getConnectionPool();
const health = await getDatabaseHealth();
```

## API Endpoints Using Config

### `/api/health`
- Shows server status
- Database connectivity test
- Configuration details

### `/api/database`
- Detailed database status
- Configuration source info
- Connection pool details

### `/api/migration`
- Migration system info
- Available commands

## Environment Support

### Development
```env
NODE_ENV=development
DB_HOST=localhost
DB_NAME=qore_backend
```

### Testing
```env
NODE_ENV=test
TEST_DB_HOST=localhost
TEST_DB_NAME=qore_backend_test
```

### Production
```env
NODE_ENV=production
PROD_DB_HOST=your-prod-host
PROD_DB_NAME=qore_backend_prod
```

## Benefits

1. **Centralized Configuration**: All database settings in one place
2. **Environment Separation**: Different configs for dev/test/prod
3. **Security**: Sensitive data in .env (not in code)
4. **Maintainability**: Easy to update database settings
5. **Type Safety**: TypeScript support with full type definitions
6. **Connection Pooling**: Efficient database connection management
7. **Health Monitoring**: Built-in health check functionality

## Commands

- Start server: `npm run dev`
- Test connection: `GET /api/database`
- Check health: `GET /api/health`
- Migration info: `GET /api/migration`