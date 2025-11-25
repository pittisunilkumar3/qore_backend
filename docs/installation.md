# Installation Guide

## Prerequisites

Before installing the Qore Backend API, ensure you have the following installed:

### Required Software
- **Node.js** (v16.0 or higher)
- **npm** (v8.0 or higher)
- **MySQL** (v8.0 or higher) or **XAMPP**
- **Git** (for cloning the repository)

### Recommended Development Environment
- **XAMPP** (includes MySQL, Apache, PHP)
- **VS Code** (recommended editor)
- **Postman** (for API testing)

---

## Installation Steps

### 1. Clone or Setup Project
```bash
# If cloning from repository
git clone <repository-url>
cd qore-backend

# If setting up locally, ensure you're in the project directory
cd qore-backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- Express.js
- MySQL2
- Prisma ORM
- TypeScript
- Dotenv
- CORS
- bcryptjs
- jsonwebtoken
- zod (validation)

### 3. Database Setup

#### Option A: Using XAMPP (Recommended for Development)

1. **Install XAMPP**
   - Download from: https://www.apachefriends.org/
   - Install with MySQL component

2. **Start XAMPP Services**
   ```bash
   # Windows
   # Start XAMPP Control Panel and start Apache & MySQL
   ```

3. **Create Database**
   ```sql
   -- Connect to MySQL (phpMyAdmin or MySQL Workbench)
   CREATE DATABASE qore_backend;
   ```

#### Option B: Using Standalone MySQL

1. **Install MySQL**
   - Download from: https://dev.mysql.com/downloads/

2. **Start MySQL Service**
   ```bash
   # Windows
   net start mysql
   ```

3. **Create Database**
   ```sql
   mysql -u root -p
   CREATE DATABASE qore_backend;
   ```

### 4. Environment Configuration

1. **Copy Environment Template**
   ```bash
   copy .env.example .env
   ```

2. **Configure .env File**
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=qore_backend
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   
   # Application Configuration
   NODE_ENV=development
   PORT=3000
   ```

### 5. Database Migration

1. **Generate Prisma Client**
   ```bash
   npm run db:generate
   ```

2. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

3. **Verify Database Tables**
   ```bash
   # Check tables in MySQL
   USE qore_backend;
   SHOW TABLES;
   ```

### 6. Start the Application

#### Development Mode (Recommended)
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

### 7. Verify Installation

1. **Check Server Status**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Expected Response**
   ```json
   {
     "success": true,
     "message": "🎉 Qore Backend API is Running Successfully!",
     "database": {
       "type": "MySQL (XAMPP)",
       "connected": true
     }
   }
   ```

---

## Configuration Options

### Database Configuration

#### Development
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qore_backend
DB_CONNECTION_LIMIT=10
```

#### Testing
```env
NODE_ENV=test
TEST_DB_HOST=localhost
TEST_DB_PORT=3306
TEST_DB_USER=root
TEST_DB_PASSWORD=
TEST_DB_NAME=qore_backend_test
```

#### Production
```env
NODE_ENV=production
PROD_DB_HOST=your-production-host
PROD_DB_PORT=3306
PROD_DB_USER=qore_user
PROD_DB_PASSWORD=secure_password
PROD_DB_NAME=qore_backend_prod
PROD_DB_CONNECTION_LIMIT=20
```

### Server Configuration

```env
# Server Settings
PORT=3000
SERVER_TIMEOUT=60000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# JWT Settings
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Next Auth (if needed)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## Troubleshooting Installation

### Common Issues and Solutions

#### 1. Node.js Version Issues
```bash
# Check Node.js version
node --version

# Install Node.js v16+ if needed
# Download from: https://nodejs.org/
```

#### 2. NPM Permission Errors
```bash
# Fix npm permissions (Linux/Mac)
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

# Or use a package manager
npm install -g nvm
```

#### 3. MySQL Connection Issues

**Error: Connection Refused**
```bash
# Check if MySQL is running
# Windows
net start mysql

# Check port availability
netstat -an | grep 3306
```

**Error: Access Denied**
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON qore_backend.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Error: Database Not Found**
```sql
-- Create database
CREATE DATABASE qore_backend;
```

#### 4. Prisma Issues

**Error: Prisma Client Not Generated**
```bash
npm run db:generate
```

**Error: Migration Failed**
```bash
# Reset database (development only)
npx prisma migrate reset

# Or force push schema
npm run db:push
```

#### 5. Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <process_id> /F
```

#### 6. TypeScript Compilation Errors
```bash
# Install missing types
npm install --save-dev @types/node @types/express

# Check TypeScript configuration
npx tsc --noEmit
```

---

## Development Setup

### VS Code Setup

1. **Install Recommended Extensions**
   ```bash
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension esbenp.prettier-vscode
   ```

2. **VS Code Settings**
   ```json
   {
     "typescript.preferences.importModuleSpecifier": "relative",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```

### Debugging Setup

1. **Create launch.json**
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Server",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/server.js",
         "env": {
           "NODE_ENV": "development"
         },
         "console": "integratedTerminal",
         "restart": true,
         "runtimeExecutable": "npm"
       }
     ]
   }
   ```

---

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USER=production_user
DB_PASSWORD=secure_password
DB_NAME=qore_backend_prod
JWT_SECRET=super-secure-jwt-secret
```

### Build Process
```bash
npm run build
npm start
```

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "qore-backend"
pm2 startup
pm2 save
```

### Docker Deployment (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## Testing Installation

### API Health Check
```bash
# Test all endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/database
curl http://localhost:3000/api/migration
curl http://localhost:3000/api/hello
```

### Expected Responses
All endpoints should return JSON responses with `success: true`

### Database Test
```bash
# Test database connection
curl http://localhost:3000/api/database
```

Should show `"status": "connected"` in the response.

---

## Next Steps

After successful installation:

1. **Read the API Documentation** (`docs/README.md`)
2. **Test the endpoints** using Postman or curl
3. **Review the database schema** (`docs/database.md`)
4. **Start developing new features**

---

## Support

If you encounter issues during installation:

1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Ensure all prerequisites are installed correctly
4. Verify database connection and permissions

**Last Updated:** November 23, 2025  
**Installation Version:** 1.0.0