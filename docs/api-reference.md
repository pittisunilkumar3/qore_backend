# API Reference Guide

## Quick Reference

### Base URL
```
http://localhost:3000
```

### Authentication
Currently **no authentication required** (future: JWT Bearer token)

---

## Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | API health check | ❌ |
| GET | `/api/database` | Database status | ❌ |
| GET | `/api/migration` | Migration info | ❌ |
| GET | `/api/hello` | Hello World test | ❌ |
| GET | `/api/roles` | Get all roles | ❌ |
| GET | `/api/roles/active` | Get active roles | ❌ |
| GET | `/api/roles/:id` | Get role by ID | ❌ |
| POST | `/api/roles` | Create new role | ❌ |
| PUT | `/api/roles/:id` | Update role | ❌ |
| DELETE | `/api/roles/:id` | Delete role | ❌ |
| GET | `/` | Welcome message | ❌ |

---

## Detailed Endpoint Reference

### System Endpoints

#### GET /api/health
**Response:**
```json
{
  "success": true,
  "message": "🎉 Qore Backend API is Running Successfully!",
  "database": { "connected": true },
  "server": { "status": "healthy" }
}
```

#### GET /api/database
**Response:**
```json
{
  "success": true,
  "database": {
    "type": "MySQL",
    "status": "connected",
    "host": "localhost",
    "port": 3306
  }
}
```

#### GET /api/migration
**Response:**
```json
{
  "success": true,
  "migration_folder": { "status": "created" },
  "available_commands": ["npx prisma generate", "npx prisma migrate dev"]
}
```

#### GET /api/hello
**Response:**
```json
{
  "message": "Hello World!"
}
```

#### GET /api/roles
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "slug": "super-admin",
      "description": "Full system access with all privileges",
      "isSystem": true,
      "priority": 100,
      "isActive": true
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### POST /api/roles
**Request Body:**
```json
{
  "name": "Custom Role",
  "slug": "custom-role",
  "description": "Custom role description",
  "priority": 50
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Custom Role",
    "slug": "custom-role",
    "description": "Custom role description",
    "isSystem": false,
    "priority": 50,
    "isActive": true
  },
  "message": "Role created successfully"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation errors) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Data Models

### User Model
```typescript
{
  id: string;
  email: string;
  name: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Model
```typescript
{
  id: string;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string | null;
  author?: {
    id: string;
    email: string;
    name: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Request/Response Format

### Standard Response
```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  timestamp: string;
}
```

### Error Response
```typescript
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-11-23T08:30:00.000Z"
}
```

---

## Quick Testing

### Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

### Hello World
```bash
curl -X GET http://localhost:3000/api/hello
```

### Database Status
```bash
curl -X GET http://localhost:3000/api/database
```

---

## Data Models

No specific data models - this is a minimal API setup with just system endpoints.

---

**Last Updated:** November 23, 2025  
**API Version:** 1.0.0