# Roles API Documentation

## Overview

The Roles API provides comprehensive role management functionality for the Qore Backend API system. It allows you to create, read, update, and delete roles with advanced filtering, pagination, and soft deletion support.

## Base URL

```
http://localhost:3000/api/roles
```

## Authentication

Currently, the API does not require authentication. In production, this should be protected with JWT or similar authentication mechanisms.

## Data Models

### Role Object

```typescript
{
  id: number;              // Unique role identifier
  name: string;            // Display name of the role
  slug: string;            // URL-friendly identifier (unique)
  description?: string;    // Optional role description
  branchId?: number;       // Optional branch identifier
  isSystem: boolean;       // System roles cannot be modified/deleted
  priority: number;        // Role priority (higher = more privileges)
  isActive: boolean;       // Whether role is active
  createdBy?: number;      // User ID who created the role
  updatedBy?: number;      // User ID who last updated the role
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
  deletedAt?: Date;        // Soft deletion timestamp
}
```

## Endpoints

### 1. Get All Roles

#### GET /api/roles

Get paginated list of roles with optional filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 10, max: 100) - Items per page
- `branchId` (number) - Filter by branch ID
- `isSystem` (boolean) - Filter by system role status
- `isActive` (boolean) - Filter by active status
- `search` (string) - Search in name, slug, or description

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "slug": "super-admin",
      "description": "Full system access with all privileges",
      "branchId": null,
      "isSystem": true,
      "priority": 100,
      "isActive": true,
      "createdBy": null,
      "updatedBy": null,
      "createdAt": "2025-11-23T00:00:00.000Z",
      "updatedAt": "2025-11-23T00:00:00.000Z",
      "deletedAt": null
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

**Example Requests:**
```bash
# Get all roles (paginated)
curl -X GET http://localhost:3000/api/roles

# Get active roles only
curl -X GET "http://localhost:3000/api/roles?isActive=true"

# Search roles
curl -X GET "http://localhost:3000/api/roles?search=admin"

# Get system roles with specific page
curl -X GET "http://localhost:3000/api/roles?isSystem=true&page=1&limit=5"

# Filter by branch
curl -X GET "http://localhost:3000/api/roles?branchId=123"
```

### 2. Get Role by ID

#### GET /api/roles/:id

Get a specific role by its ID.

**Parameters:**
- `id` (number, required) - Role ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Super Admin",
    "slug": "super-admin",
    "description": "Full system access with all privileges",
    "branchId": null,
    "isSystem": true,
    "priority": 100,
    "isActive": true,
    "createdBy": null,
    "updatedBy": null,
    "createdAt": "2025-11-23T00:00:00.000Z",
    "updatedAt": "2025-11-23T00:00:00.000Z",
    "deletedAt": null
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Role not found"
}
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/roles/1
```

### 3. Create Role

#### POST /api/roles

Create a new role.

**Request Body:**
```json
{
  "name": "Custom Role",
  "slug": "custom-role",
  "description": "A custom role with specific permissions",
  "branchId": 123,
  "priority": 50,
  "isActive": true
}
```

**Validation Rules:**
- `name` (required, string, max 100 chars) - Role display name
- `slug` (required, string, max 100 chars, regex: `^[a-z0-9-]+$`) - URL-friendly identifier
- `description` (optional, string) - Role description
- `branchId` (optional, number) - Branch identifier
- `priority` (optional, number, default: 0) - Role priority
- `isActive` (optional, boolean, default: true) - Active status

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 6,
    "name": "Custom Role",
    "slug": "custom-role",
    "description": "A custom role with specific permissions",
    "branchId": 123,
    "isSystem": false,
    "priority": 50,
    "isActive": true,
    "createdBy": null,
    "updatedBy": null,
    "createdAt": "2025-11-23T12:00:00.000Z",
    "updatedAt": "2025-11-23T12:00:00.000Z",
    "deletedAt": null
  },
  "message": "Role created successfully"
}
```

**Response (400 Bad Request) - Validation Error:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Slug must contain only lowercase letters, numbers, and hyphens",
      "path": ["slug"]
    }
  ]
}
```

**Response (400 Bad Request) - Duplicate Slug:**
```json
{
  "success": false,
  "error": "Role with this slug already exists"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Content Manager",
    "slug": "content-manager",
    "description": "Manages content and publications",
    "priority": 75,
    "isActive": true
  }'
```

### 4. Update Role

#### PUT /api/roles/:id

Update an existing role.

**Parameters:**
- `id` (number, required) - Role ID

**Request Body:**
```json
{
  "name": "Updated Role Name",
  "slug": "updated-role-slug",
  "description": "Updated description",
  "priority": 80,
  "isActive": true
}
```

**Validation Rules:**
- All fields are optional
- Same validation as create, except fields are not required
- System roles cannot be modified (name and slug changes blocked)
- Slug must be unique

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Role Name",
    "slug": "updated-role-slug",
    "description": "Updated description",
    "branchId": null,
    "isSystem": true,
    "priority": 80,
    "isActive": true,
    "createdBy": null,
    "updatedBy": null,
    "createdAt": "2025-11-23T00:00:00.000Z",
    "updatedAt": "2025-11-23T12:30:00.000Z",
    "deletedAt": null
  },
  "message": "Role updated successfully"
}
```

**Response (400 Bad Request) - System Role Protection:**
```json
{
  "success": false,
  "error": "System roles cannot be modified"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:3000/api/roles/6 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Senior Content Manager",
    "priority": 85
  }'
```

### 5. Delete Role

#### DELETE /api/roles/:id

Soft delete a role (marks as deleted without removing from database).

**Parameters:**
- `id` (number, required) - Role ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Response (400 Bad Request) - System Role Protection:**
```json
{
  "success": false,
  "error": "System roles cannot be deleted"
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Role not found"
}
```

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/api/roles/6
```

### 6. Get Active Roles

#### GET /api/roles/active

Get all active (non-deleted) roles only.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Super Admin",
      "slug": "super-admin",
      "isSystem": true,
      "priority": 100,
      "isActive": true
    },
    {
      "id": 2,
      "name": "Admin",
      "slug": "admin",
      "isSystem": true,
      "priority": 90,
      "isActive": true
    }
  ]
}
```

**Example Request:**
```bash
curl -X GET http://localhost:3000/api/roles/active
```

## System Roles

The API comes with pre-configured system roles that cannot be modified or deleted:

| ID | Name | Slug | Priority | Description |
|----|------|------|----------|-------------|
| 1 | Super Admin | super-admin | 100 | Full system access with all privileges |
| 2 | Admin | admin | 90 | Administrative access with management privileges |
| 3 | Manager | manager | 80 | Management level access with team oversight |
| 4 | User | user | 70 | Standard user access with basic privileges |
| 5 | Guest | guest | 60 | Limited guest access |

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad Request (validation errors)
- **404** - Not Found
- **500** - Internal Server Error

### Error Scenarios

1. **Validation Errors** - Invalid input data
2. **Duplicate Slug** - Role slug already exists
3. **System Role Protection** - Attempting to modify/delete system roles
4. **Role Not Found** - Invalid role ID
5. **Database Errors** - Server/database issues

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing:
- Request rate limiting per IP
- Authentication rate limiting
- Bulk operation restrictions

## Examples

### Complete Workflow Example

```bash
# 1. Create a new role
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blog Editor",
    "slug": "blog-editor",
    "description": "Can edit and publish blog posts",
    "priority": 65
  }'

# 2. Get the created role
curl -X GET http://localhost:3000/api/roles/6

# 3. Update the role
curl -X PUT http://localhost:3000/api/roles/6 \
  -H "Content-Type: application/json" \
  -d '{"priority": 70}'

# 4. Get all active roles to confirm
curl -X GET http://localhost:3000/api/roles/active

# 5. Delete the role (soft delete)
curl -X DELETE http://localhost:3000/api/roles/6
```

### Filter and Search Examples

```bash
# Get only system roles
curl -X GET "http://localhost:3000/api/roles?isSystem=true"

# Search for admin roles
curl -X GET "http://localhost:3000/api/roles?search=admin"

# Get roles for specific branch with pagination
curl -X GET "http://localhost:3000/api/roles?branchId=123&page=1&limit=5"

# Get inactive roles (including soft deleted)
curl -X GET "http://localhost:3000/api/roles?isActive=false"
```

---

**Last Updated:** November 23, 2025  
**API Version:** 1.0.0  
**Database:** MySQL with Prisma ORM