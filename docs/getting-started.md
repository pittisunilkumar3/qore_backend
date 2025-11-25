# Getting Started Guide

## Welcome to Qore Backend API

This guide will help you get started with the Qore Backend API quickly and efficiently.

---

## 🚀 Quick Start (5 Minutes)

### 1. Verify Installation
```bash
npm run dev
```

### 2. Test API Health
```bash
curl http://localhost:3000/api/health
```

### 3. Test Hello World API
```bash
curl http://localhost:3000/api/hello
```

### 4. Test Roles API
```bash
curl http://localhost:3000/api/roles
```

---

## 📖 Documentation Structure

### 📋 Main Documentation
- **[README.md](./README.md)** - Complete API documentation with all endpoints
- **[Installation Guide](./installation.md)** - Step-by-step setup instructions
- **[API Reference](./api-reference.md)** - Quick reference for all endpoints
- **[Database Guide](./database.md)** - Database schema and configuration

### 🎯 What You'll Find Here

#### API Endpoints
- ✅ **Health Checks** - Monitor API and database status
- ✅ **Hello World API** - Simple test endpoint
- ✅ **Database Status** - Connection monitoring
- ✅ **Role Management** - CRUD operations for roles

#### Features
- ✅ **MySQL Database** with Prisma ORM
- ✅ **TypeScript** for type safety
- ✅ **RESTful API** design
- ✅ **Error Handling** with consistent responses
- ✅ **Input Validation** with Zod schemas
- ✅ **Environment Configuration** with .env files

---

## 🔧 Development Workflow

### Daily Development Commands
```bash
# Start development server
npm run dev

# Generate Prisma client after schema changes
npm run db:generate

# Check TypeScript errors
npx tsc --noEmit

# Test specific endpoint
curl http://localhost:3000/api/health
```

### Database Management
```bash
# Generate client
npm run db:generate

# Create migration
npm run db:migrate

# Open database GUI
npm run db:studio

# Push schema changes
npm run db:push
```

---

## 🎮 Testing the API

### Using curl

#### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

#### 2. Database Status
```bash
curl -X GET http://localhost:3000/api/database
```

#### 3. Hello World API
```bash
curl -X GET http://localhost:3000/api/hello
```

#### 4. Roles API Examples
```bash
# Get all roles
curl http://localhost:3000/api/roles

# Get active roles only
curl http://localhost:3000/api/roles/active

# Create a new role
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"Custom Role","slug":"custom-role","description":"Custom role description"}'

# Get specific role
curl http://localhost:3000/api/roles/1
```

### Using Postman

1. **Import Collection** (create a new collection)
2. **Add Requests** using the examples from [API Reference](./api-reference.md)
3. **Set Headers**: `Content-Type: application/json`
4. **Test Endpoints** with different scenarios

---

## 🏗️ Project Structure

```
qore-backend/
├── docs/                    ← Documentation (📚 You're here!)
│   ├── README.md           ← Main API documentation
│   ├── installation.md     ← Setup guide
│   ├── api-reference.md    ← Quick reference
│   ├── database.md         ← Database guide
│   └── getting-started.md  ← This file
├── config/                  ← Database configuration
│   ├── database.js         ← Database setup
│   └── database.ts         ← TypeScript config
├── src/                     ← Source code
│   ├── app/api/            ← API routes
│   ├── controllers/        ← Business logic
│   ├── lib/               ← Utilities
│   ├── models/            ← Data models
│   ├── routes/            ← Route definitions
│   └── types/             ← TypeScript types
├── prisma/                 ← Database & migrations
│   ├── schema.prisma      ← Database schema
│   └── migrations/        ← Migration files
├── server.js              ← Main server file
├── .env                   ← Environment variables
└── package.json           ← Dependencies
```

---

## 🔍 Common Use Cases

### 1. API Health Monitoring
1. **Check API Health**: `GET /api/health`
2. **Monitor Database**: `GET /api/database`
3. **Test Hello World**: `GET /api/hello`

### 2. Basic API Testing
1. **Check API Health**: `GET /api/health`
2. **Monitor Database**: `GET /api/database`
3. **Hello World Test**: `GET /api/hello`

---

## 🛠️ Configuration

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=qore_backend

# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-jwt-secret-key-here
```

### Database Connection
```javascript
// Check connection in terminal
npm run dev
# Should show: "✅ MySQL Database: Connected successfully"
```

---

## 📚 Learning Path

### For Beginners
1. **Start Here**: Read [Installation Guide](./installation.md)
2. **API Basics**: Check [API Reference](./api-reference.md)
3. **Full Documentation**: Read [README.md](./README.md)
4. **Database Understanding**: Review [Database Guide](./database.md)

### For Developers
1. **Quick Test**: Use curl commands above
2. **Code Review**: Explore `src/` directory structure
3. **Database Schema**: Check `prisma/schema.prisma`
4. **Configuration**: Review `config/database.js`

### For Production
1. **Environment Setup**: Configure production .env
2. **Database Migration**: Use `npm run db:migrate`
3. **Performance**: Review connection pooling
4. **Security**: Implement JWT authentication

---

## 🎯 Next Steps

### Immediate Actions
- [ ] **Test Health Check**: `curl http://localhost:3000/api/health`
- [ ] **Test Hello World**: `curl http://localhost:3000/api/hello`
- [ ] **Check Database**: `curl http://localhost:3000/api/database`
- [ ] **Explore Documentation**: Read relevant guides

### Future Development
- [ ] **Add Authentication**: Implement JWT
- [ ] **Add File Uploads**: Integrate file handling
- [ ] **Add Pagination**: Implement page/limit
- [ ] **Add Rate Limiting**: API protection
- [ ] **Add Testing**: Unit and integration tests

---

## 💡 Tips & Best Practices

### API Usage
- **Always check response success status**
- **Use proper HTTP methods** (GET, POST, PUT, DELETE)
- **Validate input data** before sending requests
- **Handle errors gracefully** in your frontend

### Development
- **Keep .env file secure** - never commit to git
- **Use environment-specific configs** for dev/test/prod
- **Generate Prisma client** after schema changes
- **Monitor database connections** in production

### Testing
- **Test all endpoints** with different scenarios
- **Verify error responses** work correctly
- **Check database connections** are stable
- **Validate data persistence** across operations

---

## 🆘 Need Help?

### Common Issues
- **Server won't start**: Check if MySQL is running
- **Database connection fails**: Verify .env settings
- **API returns errors**: Check request format and data
- **TypeScript errors**: Run `npx tsc --noEmit`

### Getting Support
1. **Check [Installation Guide](./installation.md)** for setup issues
2. **Review [API Reference](./api-reference.md)** for endpoint usage
3. **Examine server logs** for detailed error messages
4. **Verify database connection** using health endpoints

---

**Welcome to Qore Backend API!** 🎉

Start with the quick test commands above and explore the comprehensive documentation to build amazing applications.

**Last Updated:** November 23, 2025  
**Version:** 1.0.0