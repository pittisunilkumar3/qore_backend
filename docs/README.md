# Qore Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Database Status](#database-status)
  - [Migration Info](#migration-info)
  - [Hello World](#hello-world)

---

## Overview

The Qore Backend API is a minimal RESTful API built with Node.js, Express, and MySQL. It provides endpoints for system health monitoring and testing.

**Version:** 1.0.0  
**Base URL:** `http://localhost:3000`  
**Content-Type:** `application/json`  

---

## Base URL

```
http://localhost:3000
```

**Environment Configuration:**
- **Development:** `http://localhost:3000`
- **Testing:** `http://localhost:3001`
- **Production:** `https://your-domain.com`

---

This is a minimal API setup focused on system monitoring and basic functionality.

---

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

---

## Error Handling

The API returns appropriate HTTP status codes:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation errors)
- **404** - Not Found
- **500** - Internal Server Error

---

## API Endpoints

### Health Check

#### GET /api/health

**Description:** Get API health status and database connection information.

**Parameters:** None

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/health
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "🎉 Qore Backend API is Running Successfully!",
  "timestamp": "2025-11-23T08:30:00.000Z",
  "database": {
    "type": "MySQL (XAMPP)",
    "connected": true,
    "host": "localhost",
    "port": 3306,
    "database": "qore_backend"
  },
  "server": {
    "status": "healthy",
    "port": 3000,
    "environment": "development"
  },
  "endpoints": {
    "health": "GET /api/health - This endpoint",
    "database": "GET /api/database - Database status",
    "hello": "GET /api/hello - Hello World endpoint",
    "migration": "GET /api/migration - Migration folder info"
  }
}
```

---

### Database Status

#### GET /api/database

**Description:** Get detailed database connection status and configuration.

**Parameters:** None

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/database
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Database Connection Status",
  "database": {
    "type": "MySQL",
    "provider": "XAMPP",
    "host": "localhost",
    "port": 3306,
    "name": "qore_backend",
    "user": "root",
    "status": "connected",
    "environment": "development",
    "poolSize": 10,
    "healthStatus": "healthy"
  },
  "config": {
    "source": ".env file via config/database.ts",
    "host": "localhost",
    "port": 3306,
    "database": "qore_backend",
    "user": "root"
  },
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

---

### Migration Info

#### GET /api/migration

**Description:** Get information about the migration system and available commands.

**Parameters:** None

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/migration
```

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Migration System Ready",
  "migration_folder": {
    "path": "prisma/migrations/",
    "status": "created",
    "provider": "Prisma ORM",
    "database": "MySQL"
  },
  "available_commands": [
    "npx prisma generate - Generate Prisma Client",
    "npx prisma db push - Push schema changes",
    "npx prisma migrate dev - Create migration",
    "npx prisma studio - Open database GUI"
  ],
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

---

### Hello World

#### GET /api/hello

**Description:** Simple Hello World endpoint for testing.

**Parameters:** None

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/hello
```

**Example Response (200 OK):**
```json
{
  "message": "Hello World!"
}
```

---

## Error Examples

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

---

## Database Information

**Database Type:** MySQL  
**Provider:** XAMPP  
**Connection:** Direct connection via mysql2 library  
**ORM:** Prisma  

**Database Schema:**
- **Users Table:** User management with email, name, password
- **Posts Table:** Post management with title, content, published status
- **Relationships:** One-to-many (User has many Posts)

---

## Quick Start

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test the API:**
   ```bash
   curl http://localhost:3000/api/health
   ```

3. **Check database status:**
   ```bash
   curl http://localhost:3000/api/database
   ```

---

## Support

For questions or issues, please refer to the project documentation or contact the development team.

**Last Updated:** November 23, 2025  
**API Version:** 1.0.0