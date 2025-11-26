# Qore Backend API Documentation

Welcome to the comprehensive documentation for the Qore Backend API. This document serves as the main index for all available documentation.

## 📚 Documentation Structure

### Core Documentation
- [API Documentation](./api-documentation.md) - Complete API reference with all endpoints
- [Database Documentation](./database.md) - Database schema and migration information
- [Installation Guide](./installation.md) - Step-by-step setup instructions
- [Getting Started](./getting-started.md) - Quick start guide for new users

### Deployment & Operations
- [Deployment Guide](./deployment-guide.md) - Comprehensive deployment strategies
- [Postman Collection](./postman-collection.md) - API testing with Postman
- [Roles API Documentation](./roles-api.md) - Role management system documentation

### Quick Links

| Documentation | Purpose | Link |
|---------------|---------|-------|
| API Reference | Complete endpoint documentation | [View](./api-documentation.md) |
| Database Schema | Database structure and relationships | [View](./database.md) |
| Installation | Setup and installation guide | [View](./installation.md) |
| Getting Started | Quick start for beginners | [View](./getting-started.md) |
| Deployment | Production deployment guide | [View](./deployment-guide.md) |
| Postman Testing | API testing collection | [View](./postman-collection.md) |
| Roles System | Role management API | [View](./roles-api.md) |

## 🚀 Quick Start

### 1. API Access

Once deployed, the API will be available at:
- **Base URL**: `http://localhost:3000/api/v1`
- **Swagger UI**: `http://localhost:3000/api/docs`
- **Health Check**: `http://localhost:3000/api/health`

### 2. Authentication

All API endpoints (except login) require JWT authentication:

```bash
# Login to get access token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "TEST_ADMIN", "password": "TestPassword123!"}'

# Use token for authenticated requests
curl -X GET http://localhost:3000/api/v1/employees \
  -H "Authorization: Bearer <your_access_token>"
```

### 3. Key Features

| Feature | Description | Endpoints |
|----------|-------------|-----------|
| **Employee Management** | Complete CRUD with search, filtering, and pagination | `/employees` |
| **Authentication** | JWT-based auth with refresh tokens | `/auth` |
| **File Management** | Photo and document upload/download | `/files` |
| **Analytics** | Statistics, metrics, and reporting | `/analytics` |
| **Import/Export** | Bulk operations with CSV/Excel | `/import`, `/export` |
| **Activity Logging** | Complete audit trail of all changes | `/analytics/activity-logs` |
| **Role Management** | RBAC system with permissions | `/roles` |

## 📊 API Overview

### Base Structure

```
http://localhost:3000/api/v1/
├── auth/                 # Authentication endpoints
├── employees/             # Employee management
├── files/                 # File upload/download
├── import/                # Import operations
├── export/                # Export operations
├── analytics/              # Analytics and reporting
├── roles/                 # Role management
├── docs/                  # Swagger documentation
├── health                 # Health check
└── info                   # API information
```

### HTTP Methods

| Method | Usage | Example |
|---------|---------|---------|
| **GET** | Retrieve resources | `GET /employees` |
| **POST** | Create resources | `POST /employees` |
| **PUT** | Update resources | `PUT /employees/{id}` |
| **DELETE** | Delete resources | `DELETE /employees/{id}` |
| **PATCH** | Partial updates | `PATCH /employees/{id}` |

### Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    // Pagination info (for list endpoints)
  }
}
```

### Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  },
  "timestamp": "2023-12-01T10:30:00.000Z"
}
```

## 🔐 Security

### Authentication Flow

1. **Login**: Obtain JWT access and refresh tokens
2. **Access Token**: Use for API requests (15-minute expiry)
3. **Refresh Token**: Use to obtain new access token (7-day expiry)
4. **Logout**: Invalidate tokens on server

### Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes
- **File Upload**: 5 uploads per minute
- **Account Lockout**: 15 minutes after 5 failed attempts

### Data Validation

- Input validation using Zod schemas
- SQL injection prevention
- XSS protection
- File upload validation
- Business logic validation

## 📈 Performance

### Response Time Targets

| Endpoint Type | Target | Average |
|---------------|--------|---------|
| Authentication | <200ms | 150ms |
| Employee CRUD | <500ms | 300ms |
| File Upload | <2000ms | 1200ms |
| Analytics | <1000ms | 600ms |
| Search | <800ms | 400ms |

### Caching Strategy

- **Redis**: Frequently accessed data
- **Application**: In-memory caching
- **Database**: Query result caching
- **CDN**: Static assets (production)

## 🛠️ Development

### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/qore-backend.git
cd qore-backend

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
mysql -u root -p < talenspark.sql

# 5. Generate Prisma client
npx prisma generate

# 6. Start development server
npm run dev
```

### Docker Development

```bash
# Quick start with Docker
npm run docker:setup
npm run docker:dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run load tests
npm run test:load
```

## 🚀 Production

### Deployment Options

| Method | Description | Complexity |
|---------|-------------|------------|
| **Docker Compose** | Containerized deployment | Low |
| **PM2 + Nginx** | Traditional server deployment | Medium |
| **Cloud Platform** | AWS, GCP, DigitalOcean | High |
| **Kubernetes** | Container orchestration | High |

### Production Checklist

- [ ] Environment variables configured
- [ ] SSL/TLS certificates installed
- [ ] Database optimized and indexed
- [ ] Redis caching enabled
- [ ] Load balancer configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Health checks configured

## 📚 Learning Resources

### For Developers

- [API Documentation](./api-documentation.md) - Complete API reference
- [Database Documentation](./database.md) - Schema and relationships
- [Postman Collection](./postman-collection.md) - API testing guide
- [Deployment Guide](./deployment-guide.md) - Production deployment

### For Administrators

- [Installation Guide](./installation.md) - System setup
- [Getting Started](./getting-started.md) - Quick start
- [Security Best Practices](./api-documentation.md#security-best-practices) - Security guidelines
- [Troubleshooting Guide](./api-documentation.md#troubleshooting) - Common issues

### For DevOps

- [Deployment Guide](./deployment-guide.md) - Deployment strategies
- [Docker Configuration](../docker-compose.yml) - Container setup
- [Environment Variables](../.env.example) - Configuration options

## 🆘 Support

### Getting Help

1. **Documentation**: Start with the relevant documentation above
2. **API Testing**: Use the Postman collection for testing
3. **Troubleshooting**: Check the troubleshooting guide
4. **Issues**: Report bugs and feature requests

### Contact Information

- **Documentation Issues**: Report in documentation repository
- **API Issues**: Report in main repository
- **Security Issues**: Report privately to security team

### Community

- **GitHub Discussions**: Community support
- **Wiki**: Additional guides and tutorials
- **Examples**: Code examples and snippets

---

## 📋 Documentation Version

**Version**: 1.0.0  
**Last Updated**: 2023-12-01  
**API Version**: v1.0.0

This documentation covers all aspects of the Qore Backend API. For the most up-to-date information, always refer to the online Swagger documentation at `/api/docs`.