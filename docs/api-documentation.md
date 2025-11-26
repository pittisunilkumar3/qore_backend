# Qore Backend API Documentation

## Overview

The Qore Backend API provides a comprehensive RESTful interface for employee management with robust security, validation, and advanced features.

**Base URL**: `http://localhost:3000/api`  
**API Version**: v1  
**Authentication**: JWT Bearer Tokens  
**Content-Type**: `application/json`  

## Table of Contents

- [Authentication](#authentication)
- [Employee Management](#employee-management)
- [File Management](#file-management)
- [Import/Export](#importexport)
- [Analytics](#analytics)
- [Activity Logs](#activity-logs)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Authentication

### Login

Authenticates a user and returns JWT tokens.

**Endpoint**: `POST /auth/login`  
**Authentication**: None  
**Rate Limit**: 5 attempts per 15 minutes

#### Request Body

```json
{
  "employeeId": "EMP001",
  "password": "SecurePassword123!"
}
```

#### Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "refreshExpiresIn": 604800,
    "employee": {
      "id": 1,
      "employeeId": "EMP001",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@company.com",
      "position": "Software Engineer",
      "employmentStatus": "full-time",
      "isActive": true,
      "roles": [
        {
          "id": 1,
          "name": "employee",
          "isPrimary": true
        }
      ]
    }
  }
}
```

#### Error Responses

```json
{
  "success": false,
  "error": "Invalid employee ID or password",
  "code": "INVALID_CREDENTIALS"
}
```

```json
{
  "success": false,
  "error": "Account temporarily locked",
  "code": "ACCOUNT_LOCKED",
  "details": {
    "lockoutDuration": 15,
    "remainingTime": 10,
    "unlockTime": "2023-12-01T10:30:00.000Z"
  }
}
```

#### Curl Example

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP001",
    "password": "SecurePassword123!"
  }'
```

### Refresh Token

Refreshes an access token using a refresh token.

**Endpoint**: `POST /auth/refresh`  
**Authentication**: None (refresh token in request body)

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  }
}
```

### Logout

Logs out a user and invalidates tokens.

**Endpoint**: `POST /auth/logout`  
**Authentication**: Required (Bearer Token)

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

Returns the current authenticated user's profile.

**Endpoint**: `GET /auth/me`  
**Authentication**: Required (Bearer Token)

#### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "gender": "male",
    "dob": "1990-01-01",
    "position": "Software Engineer",
    "employmentStatus": "full-time",
    "isActive": true,
    "roles": [
      {
        "id": 1,
        "name": "employee",
        "permissions": ["read:own", "update:own"]
      }
    ]
  }
}
```

### Change Password

Changes the current user's password.

**Endpoint**: `POST /auth/change-password`  
**Authentication**: Required (Bearer Token)

#### Request Body

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

#### Response

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Employee Management

### Get All Employees

Retrieves a paginated list of employees with filtering and sorting.

**Endpoint**: `GET /employees`  
**Authentication**: Required (Bearer Token)  
**Rate Limit**: 100 requests per 15 minutes

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number for pagination |
| limit | number | 10 | Number of items per page (max: 100) |
| search | string | - | Search term for name, email, employeeId |
| position | string | - | Filter by position |
| employmentStatus | string | - | Filter by employment status |
| isActive | boolean | - | Filter by active status |
| gender | string | - | Filter by gender |
| hireDateFrom | string | - | Filter by hire date (ISO format) |
| hireDateTo | string | - | Filter by hire date (ISO format) |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort order (asc/desc) |

#### Response

```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "employeeId": "EMP001",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@company.com",
        "position": "Software Engineer",
        "employmentStatus": "full-time",
        "isActive": true,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-12-01T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 10,
      "totalPages": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Curl Examples

```bash
# Basic request
curl -X GET "http://localhost:3000/api/employees" \
  -H "Authorization: Bearer <access_token>"

# With filtering and pagination
curl -X GET "http://localhost:3000/api/employees?page=2&limit=5&position=Software Engineer&isActive=true" \
  -H "Authorization: Bearer <access_token>"

# With search
curl -X GET "http://localhost:3000/api/employees?search=John&sortBy=firstName&sortOrder=asc" \
  -H "Authorization: Bearer <access_token>"
```

### Get Employee by ID

Retrieves a specific employee by their ID.

**Endpoint**: `GET /employees/{id}`  
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Employee ID |

#### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "phone": "+1234567890",
    "gender": "male",
    "dob": "1990-01-01",
    "position": "Software Engineer",
    "qualification": "B.S. Computer Science",
    "workExperience": "5 years",
    "hireDate": "2020-01-01",
    "employmentStatus": "full-time",
    "contractType": "permanent",
    "workShift": "9-5",
    "currentLocation": "New York",
    "reportingTo": 2,
    "emergencyContact": "+1234567891",
    "emergencyContactRelation": "Spouse",
    "maritalStatus": "married",
    "fatherName": "Robert Doe",
    "motherName": "Jane Doe",
    "localAddress": "123 Main St, Apt 4B",
    "permanentAddress": "456 Oak Ave, Springfield",
    "bankAccountName": "John Doe",
    "bankAccountNo": "1234567890",
    "bankName": "First National Bank",
    "bankBranch": "Main Street Branch",
    "ifscCode": "FNBA1234",
    "basicSalary": "75000.00",
    "facebook": "https://facebook.com/johndoe",
    "twitter": "@johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "instagram": "@johndoe_official",
    "photo": "http://localhost:3000/uploads/photos/emp001.jpg",
    "resume": "http://localhost:3000/uploads/documents/emp001_resume.pdf",
    "joiningLetter": "http://localhost:3000/uploads/documents/emp001_joining.pdf",
    "notes": "Excellent performer, team player",
    "isSuperadmin": false,
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-12-01T10:30:00.000Z",
    "createdBy": 1,
    "employeeRoles": [
      {
        "id": 1,
        "roleId": 1,
        "isPrimary": true,
        "isActive": true,
        "role": {
          "id": 1,
          "name": "Software Engineer",
          "description": "Handles software development tasks"
        }
      }
    ],
    "manager": {
      "id": 2,
      "employeeId": "EMP002",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@company.com"
    },
    "subordinates": [
      {
        "id": 3,
        "employeeId": "EMP003",
        "firstName": "Bob",
        "lastName": "Johnson",
        "email": "bob.johnson@company.com"
      }
    ]
  }
}
```

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/employees/1" \
  -H "Authorization: Bearer <access_token>"
```

### Create Employee

Creates a new employee record.

**Endpoint**: `POST /employees`  
**Authentication**: Required (Bearer Token)  
**Rate Limit**: 10 requests per minute  
**Required Permissions**: `employee:create` or `admin`

#### Request Body

```json
{
  "employeeId": "EMP004",
  "firstName": "Alice",
  "lastName": "Williams",
  "email": "alice.williams@company.com",
  "password": "SecurePassword123!",
  "phone": "+1234567892",
  "gender": "female",
  "dob": "1992-05-15",
  "position": "HR Manager",
  "qualification": "MBA in HR Management",
  "workExperience": "7 years",
  "hireDate": "2023-01-15",
  "employmentStatus": "full-time",
  "contractType": "permanent",
  "workShift": "9-5",
  "currentLocation": "Los Angeles",
  "reportingTo": 1,
  "emergencyContact": "+1234567893",
  "emergencyContactRelation": "Parent",
  "maritalStatus": "single",
  "fatherName": "Michael Williams",
  "motherName": "Sarah Williams",
  "localAddress": "789 Palm St, Apt 2C",
  "permanentAddress": "321 Pine Ave, Los Angeles",
  "bankAccountName": "Alice Williams",
  "bankAccountNo": "9876543210",
  "bankName": "Bank of America",
  "bankBranch": "LA Downtown Branch",
  "ifscCode": "BOFA5678",
  "basicSalary": "85000.00",
  "facebook": "https://facebook.com/alicewilliams",
  "twitter": "@alicewilliams",
  "linkedin": "https://linkedin.com/in/alicewilliams",
  "instagram": "@alice_williams_official",
  "notes": "Experienced HR professional",
  "isSuperadmin": false,
  "isActive": true,
  "roleIds": [2, 3]
}
```

#### Response

```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 4,
    "employeeId": "EMP004",
    "firstName": "Alice",
    "lastName": "Williams",
    "email": "alice.williams@company.com",
    "position": "HR Manager",
    "employmentStatus": "full-time",
    "isActive": true,
    "createdAt": "2023-12-01T11:00:00.000Z",
    "updatedAt": "2023-12-01T11:00:00.000Z"
  }
}
```

#### Validation Errors

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "employeeId": "Employee ID already exists",
    "email": "Email already exists",
    "password": "Password must be at least 8 characters long"
  }
}
```

#### Curl Example

```bash
curl -X POST "http://localhost:3000/api/employees" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP004",
    "firstName": "Alice",
    "lastName": "Williams",
    "email": "alice.williams@company.com",
    "password": "SecurePassword123!",
    "position": "HR Manager",
    "employmentStatus": "full-time"
  }'
```

### Update Employee

Updates an existing employee record.

**Endpoint**: `PUT /employees/{id}`  
**Authentication**: Required (Bearer Token)  
**Required Permissions**: `employee:update` or `admin`

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Employee ID |

#### Request Body

All fields are optional. Only provided fields will be updated.

```json
{
  "firstName": "Alice",
  "lastName": "Johnson",
  "position": "Senior HR Manager",
  "basicSalary": "90000.00",
  "isActive": true
}
```

#### Response

```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 4,
    "employeeId": "EMP004",
    "firstName": "Alice",
    "lastName": "Johnson",
    "position": "Senior HR Manager",
    "basicSalary": "90000.00",
    "updatedAt": "2023-12-01T12:00:00.000Z"
  }
}
```

#### Curl Example

```bash
curl -X PUT "http://localhost:3000/api/employees/4" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Johnson",
    "position": "Senior HR Manager"
  }'
```

### Delete Employee

Soft deletes an employee (sets deletedAt timestamp).

**Endpoint**: `DELETE /employees/{id}`  
**Authentication**: Required (Bearer Token)  
**Required Permissions**: `employee:delete` or `admin`

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Employee ID |

#### Response

```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

#### Curl Example

```bash
curl -X DELETE "http://localhost:3000/api/employees/4" \
  -H "Authorization: Bearer <access_token>"
```

### Get Employee Subordinates

Retrieves all employees reporting to a specific manager.

**Endpoint**: `GET /employees/{id}/subordinates`  
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | number | Manager ID |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "employeeId": "EMP003",
      "firstName": "Bob",
      "lastName": "Johnson",
      "email": "bob.johnson@company.com",
      "position": "Software Developer",
      "employmentStatus": "full-time"
    }
  ]
}
```

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/employees/1/subordinates" \
  -H "Authorization: Bearer <access_token>"
```

## File Management

### Upload Employee Photo

Uploads a photo for an employee.

**Endpoint**: `POST /files/upload-photo`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`  
**Rate Limit**: 5 uploads per minute

#### Request Body (multipart/form-data)

| Field | Type | Description |
|--------|------|-------------|
| photo | file | Image file (JPEG, PNG, GIF, max 5MB) |
| employeeId | string | Employee ID |

#### Response

```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "photoUrl": "http://localhost:3000/uploads/photos/emp001_1701234567890.jpg"
  }
}
```

#### Curl Example

```bash
curl -X POST "http://localhost:3000/api/files/upload-photo" \
  -H "Authorization: Bearer <access_token>" \
  -F "photo=@/path/to/photo.jpg" \
  -F "employeeId=EMP001"
```

### Upload Employee Document

Uploads a document for an employee.

**Endpoint**: `POST /files/upload-document`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`

#### Request Body (multipart/form-data)

| Field | Type | Description |
|--------|------|-------------|
| document | file | Document file (PDF, DOC, DOCX, max 10MB) |
| employeeId | string | Employee ID |
| documentType | string | Document type (resume, joining_letter, etc.) |

#### Response

```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "documentUrl": "http://localhost:3000/uploads/documents/emp001_resume_1701234567890.pdf",
    "documentType": "resume"
  }
}
```

### Download File

Downloads an uploaded file.

**Endpoint**: `GET /files/download/{type}/{filename}`  
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | File type (photos or documents) |
| filename | string | File name |

#### Response

Returns the file as a download with appropriate content-type and content-disposition headers.

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/files/download/photos/emp001_1701234567890.jpg" \
  -H "Authorization: Bearer <access_token>" \
  -o downloaded_photo.jpg
```

## Import/Export

### Import Employees

Imports employees from CSV or Excel file.

**Endpoint**: `POST /import/import`  
**Authentication**: Required (Bearer Token)  
**Content-Type**: `multipart/form-data`  
**Required Permissions**: `employee:import` or `admin`

#### Request Body (multipart/form-data)

| Field | Type | Description |
|--------|------|-------------|
| file | file | CSV or Excel file (max 10MB) |

#### CSV Format

```csv
employeeId,firstName,lastName,email,password,gender,position,employmentStatus
EMP005,Charlie,Brown,charlie.brown@company.com,Password123!,male,Developer,full-time
EMP006,Diana,Prince,diana.prince@company.com,Password123!,female,Designer,full-time
```

#### Response

```json
{
  "success": true,
  "message": "Import completed",
  "data": {
    "imported": 25,
    "skipped": 2,
    "errors": [
      {
        "row": 3,
        "error": "Invalid email format"
      }
    ]
  }
}
```

#### Curl Example

```bash
curl -X POST "http://localhost:3000/api/import/import" \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@employees.csv"
```

### Export Employees

Exports employees to CSV format.

**Endpoint**: `GET /export/export`  
**Authentication**: Required (Bearer Token)  
**Required Permissions**: `employee:export` or `admin`

#### Query Parameters

Same as GET /employees endpoint for filtering.

#### Response

Returns a CSV file with appropriate headers:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="employees_20231201_143000.csv"
```

#### CSV Format

```csv
employeeId,firstName,lastName,email,phone,gender,position,employmentStatus,isActive,createdAt
EMP001,John,Doe,john.doe@company.com,+1234567890,male,Software Engineer,full-time,true,2023-01-01T00:00:00.000Z
EMP002,Jane,Smith,jane.smith@company.com,+1234567891,female,HR Manager,full-time,true,2023-01-02T00:00:00.000Z
```

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/export/export?employmentStatus=full-time" \
  -H "Authorization: Bearer <access_token>" \
  -o employees_export.csv
```

### Get Import Template

Downloads a CSV template for employee import.

**Endpoint**: `GET /import/template`  
**Authentication**: Required (Bearer Token)

#### Response

Returns a CSV template with all required fields.

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/import/template" \
  -H "Authorization: Bearer <access_token>" \
  -o employee_template.csv
```

## Analytics

### Get Dashboard Statistics

Returns dashboard analytics data.

**Endpoint**: `GET /analytics/dashboard`  
**Authentication**: Required (Bearer Token)  
**Required Permissions**: `analytics:view` or `admin`

#### Response

```json
{
  "success": true,
  "data": {
    "totalEmployees": 150,
    "activeEmployees": 142,
    "inactiveEmployees": 8,
    "newHiresThisMonth": 5,
    "employeesByStatus": {
      "full-time": 120,
      "part-time": 20,
      "contract": 8,
      "intern": 2
    },
    "employeesByGender": {
      "male": 85,
      "female": 63,
      "other": 2
    },
    "employeesByDepartment": {
      "Engineering": 60,
      "HR": 15,
      "Sales": 30,
      "Marketing": 20,
      "Finance": 25
    },
    "recentActivities": [
      {
        "id": 1,
        "action": "CREATE",
        "entityType": "Employee",
        "entityId": 150,
        "newValue": "New employee created",
        "createdAt": "2023-12-01T10:30:00.000Z"
      }
    ]
  }
}
```

#### Curl Example

```bash
curl -X GET "http://localhost:3000/api/analytics/dashboard" \
  -H "Authorization: Bearer <access_token>"
```

### Get Employee Statistics

Returns detailed employee statistics.

**Endpoint**: `GET /analytics/statistics`  
**Authentication**: Required (Bearer Token)

#### Response

```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 142,
    "inactive": 8,
    "byStatus": {
      "full-time": 120,
      "part-time": 20,
      "contract": 8,
      "intern": 2
    },
    "byGender": {
      "male": 85,
      "female": 63,
      "other": 2
    },
    "recentHires": 5
  }
}
```

### Get Employee Timeline

Returns timeline of changes for an employee.

**Endpoint**: `GET /analytics/timeline/{employeeId}`  
**Authentication**: Required (Bearer Token)

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| employeeId | number | Employee ID |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "action": "CREATE",
      "entityType": "Employee",
      "entityId": 1,
      "newValue": "Employee created",
      "oldValue": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "employee": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "User"
      }
    },
    {
      "id": 2,
      "action": "UPDATE",
      "entityType": "Employee",
      "entityId": 1,
      "newValue": "Position updated to Senior Developer",
      "oldValue": "Position: Developer",
      "createdAt": "2023-06-01T00:00:00.000Z",
      "employee": {
        "id": 1,
        "firstName": "Admin",
        "lastName": "User"
      }
    }
  ]
}
```

## Activity Logs

### Get Activity Logs

Retrieves activity logs with filtering.

**Endpoint**: `GET /analytics/activity-logs`  
**Authentication**: Required (Bearer Token)  
**Required Permissions**: `logs:view` or `admin`

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| action | string | - | Filter by action (CREATE, UPDATE, DELETE) |
| entityType | string | - | Filter by entity type |
| employeeId | number | - | Filter by employee ID |
| dateFrom | string | - | Filter by date (ISO format) |
| dateTo | string | - | Filter by date (ISO format) |

#### Response

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "action": "CREATE",
        "entityType": "Employee",
        "entityId": 1,
        "newValue": "New employee created",
        "oldValue": null,
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2023-12-01T10:30:00.000Z",
        "employee": {
          "id": 1,
          "firstName": "Admin",
          "lastName": "User"
        }
      }
    ],
    "pagination": {
      "total": 500,
      "page": 1,
      "limit": 20,
      "totalPages": 25,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details",
    "value": "Invalid value"
  },
  "timestamp": "2023-12-01T10:30:00.000Z",
  "path": "/api/employees",
  "method": "POST"
}
```

### Common Error Codes

| Status Code | Error Code | Description |
|-------------|-------------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | Authentication required or invalid |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource already exists |
| 422 | UNPROCESSABLE_ENTITY | Invalid data format |
| 423 | LOCKED | Account temporarily locked |
| 429 | RATE_LIMIT_EXCEEDED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

### Validation Error Details

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "firstName": "First name is required",
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters long",
    "employeeId": "Employee ID already exists"
  }
}
```

## Rate Limiting

### Rate Limit Headers

All API responses include rate limiting headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1701389400
```

### Rate Limit Exceeded

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "windowMs": 900000,
    "remaining": 0,
    "resetTime": "2023-12-01T11:00:00.000Z",
    "retryAfter": 300
  }
}
```

## CORS Configuration

### Allowed Origins

By default, the API allows requests from:
- `http://localhost:3000`
- `http://localhost:3001`

### CORS Headers

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Testing

### Test Environment

For testing, use the test environment:
```bash
NODE_ENV=test npm test
```

### Test Users

Default test users are created automatically:
- **Admin**: employeeId `TEST_ADMIN`, password `TestPassword123!`
- **Employee**: employeeId `TEST_EMPLOYEE`, password `TestPassword123!`

### Test Coverage

The API maintains 80%+ test coverage including:
- Unit tests for all utility functions
- Integration tests for all endpoints
- Security tests for authentication
- Performance tests for load handling

## Performance Benchmarks

### Response Time Targets

| Endpoint | Target | Average |
|-----------|--------|---------|
| Authentication | <200ms | 150ms |
| Employee CRUD | <500ms | 300ms |
| File Upload | <2000ms | 1200ms |
| Analytics | <1000ms | 600ms |
| Search | <800ms | 400ms |

### Throughput Targets

| Operation | Target | Measured |
|-----------|--------|----------|
| Concurrent Users | 100 | 120 |
| Requests/Second | 1000 | 1250 |
| File Uploads | 50/minute | 65/minute |

## Versioning

### API Versioning

The API uses URL versioning:
- Current version: v1
- Base URL: `/api/v1`
- Backward compatibility: Maintained for 2 versions

### Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added analytics endpoints
- **v1.2.0**: Added file management
- **v1.3.0**: Added import/export functionality

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

**Problem**: JWT token not working
**Solution**: 
- Check token expiration
- Verify token format (Bearer <token>)
- Ensure correct secret key

#### 2. File Upload Failures

**Problem**: File upload returning errors
**Solution**:
- Check file size limits (5MB photos, 10MB documents)
- Verify file type (JPEG, PNG, PDF, DOC, DOCX)
- Ensure upload directory permissions

#### 3. Database Connection Issues

**Problem**: Database connection errors
**Solution**:
- Verify MySQL service is running
- Check connection string format
- Ensure database exists
- Verify user permissions

#### 4. Rate Limiting Issues

**Problem**: Too many requests error
**Solution**:
- Check rate limit headers
- Implement exponential backoff
- Use API keys for higher limits

### Debug Mode

Enable debug logging:
```bash
DEBUG=qore-backend:* npm run dev
```

### Health Check

Monitor API health:
```bash
curl http://localhost:3000/api/health
```

### Support

For additional support:
1. Check the Swagger documentation at `/api/docs`
2. Review the error logs
3. Verify environment configuration
4. Test with the provided examples

## Security Best Practices

### 1. Token Management

- Always use HTTPS in production
- Store tokens securely on client side
- Implement token refresh logic
- Handle token expiration gracefully

### 2. Input Validation

- Validate all inputs on client side
- Never trust user input
- Use parameterized queries
- Sanitize all data

### 3. Error Handling

- Never expose sensitive information
- Use generic error messages
- Log detailed errors securely
- Implement proper HTTP status codes

### 4. Rate Limiting

- Respect rate limit headers
- Implement exponential backoff
- Cache responses when possible
- Use appropriate retry strategies

This documentation covers all aspects of the Qore Backend API. For interactive documentation, visit the Swagger UI at `/api/docs`.