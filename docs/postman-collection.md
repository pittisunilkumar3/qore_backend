# Postman Collection Guide

This guide provides a comprehensive Postman collection for testing the Qore Backend API.

## Getting Started

### 1. Import Collection

1. Download the Postman collection JSON file
2. Open Postman
3. Click "Import" in the top left
4. Select the collection file
5. The collection will appear in your workspace

### 2. Environment Setup

Create two environments: **Development** and **Production**

#### Development Environment Variables

| Variable | Initial Value | Description |
|-----------|---------------|-------------|
| baseUrl | http://localhost:3000/api | API base URL |
| version | v1 | API version |
| employeeId |  | Test employee ID |
| password | TestPassword123! | Test password |
| accessToken |  | JWT access token |
| refreshToken |  | JWT refresh token |

#### Production Environment Variables

| Variable | Initial Value | Description |
|-----------|---------------|-------------|
| baseUrl | https://api.yourcompany.com/api | Production API URL |
| version | v1 | API version |
| employeeId |  | Employee ID |
| password |  | Employee password |
| accessToken |  | JWT access token |
| refreshToken |  | JWT refresh token |

## Collection Structure

The collection is organized into folders:

```
Qore Backend API
├── Authentication
│   ├── Login
│   ├── Refresh Token
│   ├── Logout
│   ├── Get Current User
│   └── Change Password
├── Employee Management
│   ├── Get All Employees
│   ├── Get Employee by ID
│   ├── Create Employee
│   ├── Update Employee
│   ├── Delete Employee
│   ├── Get Subordinates
│   └── Get Manager
├── File Management
│   ├── Upload Photo
│   ├── Upload Document
│   └── Download File
├── Import/Export
│   ├── Import Employees
│   ├── Export Employees
│   └── Get Template
├── Analytics
│   ├── Dashboard Statistics
│   ├── Employee Statistics
│   └── Employee Timeline
└── System
    ├── Health Check
    └── Activity Logs
```

## API Endpoints

### Authentication

#### Login

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/auth/login`  
**Headers**: Content-Type: application/json  
**Body**: Raw JSON

```json
{
  "employeeId": "{{employeeId}}",
  "password": "{{password}}"
}
```

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});

pm.test("Access token returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.exist;
});

// Set environment variables
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

#### Refresh Token

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/auth/refresh`  
**Headers**: Content-Type: application/json  
**Body**: Raw JSON

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("New access token returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.accessToken).to.exist;
});

// Update environment variables
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
}
```

#### Get Current User

**Method**: GET  
**URL**: `{{baseUrl}}/{{version}}/auth/me`  
**Headers**: Authorization: Bearer {{accessToken}}

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User data returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.employeeId).to.exist;
});
```

#### Change Password

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/auth/change-password`  
**Headers**: 
- Content-Type: application/json
- Authorization: Bearer {{accessToken}}

**Body**: Raw JSON

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Employee Management

#### Get All Employees

**Method**: GET  
**URL**: `{{baseUrl}}/{{version}}/employees`  
**Headers**: Authorization: Bearer {{accessToken}}

**Query Params** (Optional):
| Key | Value | Description |
|------|-------|-------------|
| page | 1 | Page number |
| limit | 10 | Items per page |
| search |  | Search term |
| position |  | Filter by position |
| employmentStatus |  | Filter by status |
| isActive | true | Active status |
| sortBy | createdAt | Sort field |
| sortOrder | desc | Sort order |

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Employees array returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.employees).to.be.an('array');
});

pm.test("Pagination info returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.pagination).to.exist;
});
```

#### Get Employee by ID

**Method**: GET  
**URL**: `{{baseUrl}}/{{version}}/employees/1`  
**Headers**: Authorization: Bearer {{accessToken}}

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Employee data returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.id).to.equal(1);
});
```

#### Create Employee

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/employees`  
**Headers**: 
- Content-Type: application/json
- Authorization: Bearer {{accessToken}}

**Body**: Raw JSON

```json
{
  "employeeId": "EMP{{$randomInt}}",
  "firstName": "Test{{$randomAlphaNumeric}}",
  "lastName": "User{{$randomInt}}",
  "email": "test{{$randomInt}}@example.com",
  "password": "TestPassword123!",
  "gender": "male",
  "position": "Software Engineer",
  "employmentStatus": "full-time",
  "isActive": true
}
```

**Tests**:
```javascript
pm.test("Status is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Employee created successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

#### Update Employee

**Method**: PUT  
**URL**: `{{baseUrl}}/{{version}}/employees/1`  
**Headers**: 
- Content-Type: application/json
- Authorization: Bearer {{accessToken}}

**Body**: Raw JSON

```json
{
  "firstName": "Updated{{$randomAlphaNumeric}}",
  "position": "Senior Software Engineer",
  "basicSalary": "90000.00"
}
```

#### Delete Employee

**Method**: DELETE  
**URL**: `{{baseUrl}}/{{version}}/employees/1`  
**Headers**: Authorization: Bearer {{accessToken}}

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Employee deleted successfully", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

### File Management

#### Upload Photo

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/files/upload-photo`  
**Headers**: Authorization: Bearer {{accessToken}}  
**Body**: Form-data

| Key | Type | Value |
|-----|-------|-------|
| photo | File | Select image file |
| employeeId | Text | 1 |

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Photo URL returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.photoUrl).to.exist;
});
```

#### Upload Document

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/files/upload-document`  
**Headers**: Authorization: Bearer {{accessToken}}  
**Body**: Form-data

| Key | Type | Value |
|-----|-------|-------|
| document | File | Select document file |
| employeeId | Text | 1 |
| documentType | Text | resume |

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Document URL returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.documentUrl).to.exist;
});
```

### Import/Export

#### Import Employees

**Method**: POST  
**URL**: `{{baseUrl}}/{{version}}/import/import`  
**Headers**: Authorization: Bearer {{accessToken}}  
**Body**: Form-data

| Key | Type | Value |
|-----|-------|-------|
| file | File | Select CSV/Excel file |

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Import results returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.imported).to.be.a('number');
});
```

#### Export Employees

**Method**: GET  
**URL**: `{{baseUrl}}/{{version}}/export/export`  
**Headers**: Authorization: Bearer {{accessToken}}

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("CSV file returned", function () {
    pm.expect(pm.response.headers.get('Content-Type')).to.include('text/csv');
});
```

### Analytics

#### Dashboard Statistics

**Method**: GET  
**URL**: `{{baseUrl}}/{{version}}/analytics/dashboard`  
**Headers**: Authorization: Bearer {{accessToken}}

**Tests**:
```javascript
pm.test("Status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Statistics returned", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.data.totalEmployees).to.be.a('number');
});
```

## Workflows

### 1. Authentication Workflow

1. **Login Request**
   - Use the "Login" request
   - Tests will automatically set accessToken and refreshToken

2. **Get Current User**
   - Use the "Get Current User" request
   - Verify user information

3. **Refresh Token**
   - When token expires, use "Refresh Token"
   - Tests will update accessToken

### 2. Employee Management Workflow

1. **Create Employee**
   - Use "Create Employee" request
   - Note the returned employee ID

2. **Get Employee**
   - Use "Get Employee by ID" with the returned ID
   - Verify employee details

3. **Update Employee**
   - Use "Update Employee" to modify details
   - Verify updated information

4. **Delete Employee**
   - Use "Delete Employee" to soft delete
   - Verify deletion success

### 3. File Management Workflow

1. **Upload Photo**
   - Use "Upload Photo" request
   - Select image file from your computer
   - Verify photo URL returned

2. **Upload Document**
   - Use "Upload Document" request
   - Select document file and specify type
   - Verify document URL returned

3. **Download File**
   - Use "Download File" with returned URL
   - Verify file downloads correctly

## Pre-request Scripts

### Authentication Check

Add this pre-request script to authenticated requests:

```javascript
// Check if access token exists and is not expired
if (!pm.environment.get("accessToken")) {
    // Redirect to login
    pm.collection.items.findOne({name: "Login"}).request.update.url(
        "{{baseUrl}}/{{version}}/auth/login"
    );
    return false; // Skip current request
}

// Optional: Check token expiration
const token = pm.environment.get("accessToken");
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
            // Token expired, redirect to login
            pm.collection.items.findOne({name: "Login"}).request.update.url(
                "{{baseUrl}}/{{version}}/auth/login"
            );
            return false;
        }
    } catch (e) {
        // Invalid token format, redirect to login
        pm.collection.items.findOne({name: "Login"}).request.update.url(
            "{{baseUrl}}/{{version}}/auth/login"
        );
        return false;
    }
}
```

## Test Data

### Sample Employee Data

```json
{
  "employeeId": "EMP001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "gender": "male",
  "dob": "1990-01-01",
  "position": "Software Engineer",
  "qualification": "B.S. Computer Science",
  "workExperience": "5 years",
  "hireDate": "2023-01-01",
  "employmentStatus": "full-time",
  "contractType": "permanent",
  "workShift": "9-5",
  "currentLocation": "New York",
  "reportingTo": null,
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
  "notes": "Excellent performer, team player",
  "isSuperadmin": false,
  "isActive": true
}
```

### Sample CSV Data

```csv
employeeId,firstName,lastName,email,password,gender,position,employmentStatus
EMP002,Jane,Smith,jane.smith@company.com,Password123!,female,HR Manager,full-time
EMP003,Bob,Johnson,bob.johnson@company.com,Password123!,male,Developer,full-time
```

## Error Handling Tests

### Authentication Errors

Test these scenarios:

1. **Invalid Credentials**
   - Wrong employeeId or password
   - Expected: 401 status

2. **Missing Fields**
   - Empty employeeId or password
   - Expected: 400 status

3. **Account Locked**
   - Multiple failed attempts
   - Expected: 423 status

### Validation Errors

Test these scenarios:

1. **Duplicate Employee ID**
   - Create employee with existing ID
   - Expected: 409 status

2. **Invalid Email Format**
   - Use malformed email
   - Expected: 400 status

3. **Required Fields Missing**
   - Omit required fields
   - Expected: 400 status

## Performance Testing

### Load Testing

Use Postman's Collection Runner for load testing:

1. **Configure Iterations**
   - Set number of iterations
   - Set delay between requests

2. **Monitor Response Times**
   - Check average response time
   - Identify slow endpoints

3. **Error Rate Monitoring**
   - Monitor error responses
   - Check rate limiting behavior

## Best Practices

### 1. Environment Management

- Use separate environments for dev/staging/production
- Never commit sensitive data
- Use environment variables for secrets
- Regularly update access tokens

### 2. Request Organization

- Use descriptive request names
- Group related requests in folders
- Use pre-request scripts for common tasks
- Add comprehensive tests

### 3. Test Data Management

- Use dynamic variables for unique data
- Clean up test data regularly
- Use realistic test data
- Document test scenarios

### 4. Response Validation

- Test status codes
- Validate response structure
- Check data types
- Verify business logic

This Postman collection provides comprehensive testing coverage for all Qore Backend API endpoints. Use it to verify functionality, test edge cases, and ensure API reliability.