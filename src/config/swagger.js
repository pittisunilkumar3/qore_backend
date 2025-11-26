const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger configuration for API documentation
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Qore Employee Management API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for employee management system with robust security, validation, and advanced features.',
      contact: {
        name: 'Qore API Support',
        email: 'support@qore.com',
        url: 'https://qore.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      },
      {
        url: 'https://api.qore.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authentication token'
        }
      },
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Employee unique identifier',
              example: 1
            },
            employeeId: {
              type: 'string',
              description: 'Employee ID (unique identifier)',
              example: 'EMP001'
            },
            firstName: {
              type: 'string',
              description: 'First name of the employee',
              example: 'John'
            },
            lastName: {
              type: 'string',
              description: 'Last name of the employee',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the employee',
              example: 'john.doe@example.com'
            },
            phone: {
              type: 'string',
              description: 'Phone number of the employee',
              example: '+1-234-567-8900'
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender of the employee',
              example: 'male'
            },
            dob: {
              type: 'string',
              format: 'date',
              description: 'Date of birth of the employee',
              example: '1990-01-01'
            },
            position: {
              type: 'string',
              description: 'Position of the employee',
              example: 'Software Engineer'
            },
            employmentStatus: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'intern', 'terminated'],
              description: 'Employment status of the employee',
              example: 'full-time'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the employee is active',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the employee was created',
              example: '2023-01-01T10:00:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time when the employee was last updated',
              example: '2023-01-01T10:00:00Z'
            }
          },
          required: ['id', 'employeeId', 'firstName']
        },
        EmployeeList: {
          type: 'object',
          properties: {
            employees: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Employee'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  description: 'Total number of employees',
                  example: 100
                },
                page: {
                  type: 'integer',
                  description: 'Current page number',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  description: 'Number of employees per page',
                  example: 10
                },
                totalPages: {
                  type: 'integer',
                  description: 'Total number of pages',
                  example: 10
                }
              }
            },
          required: ['employees']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              description: 'Response data',
              example: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...',
                refreshToken: 'd4f5e6a2b7c8e9b8a7f6d8a9e6...',
                expiresIn: '15m',
                tokenType: 'Bearer'
              }
            }
          },
          required: ['success']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Validation failed'
            },
            code: {
              type: 'string',
              description: 'Error code for programmatic handling',
              example: 'VALIDATION_ERROR'
            },
            details: {
              type: 'array',
              description: 'Array of validation errors',
              example: [
                {
                  field: 'email',
                  message: 'Invalid email format',
                  code: 'INVALID_FORMAT'
                }
              ]
            }
          },
          required: ['success', 'error']
        },
        ActivityLog: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Activity log ID',
              example: 1
            },
            action: {
              type: 'string',
              description: 'Action performed',
              example: 'LOGIN'
            },
            entityType: {
              type: 'string',
              description: 'Type of entity affected',
              example: 'Employee'
            },
            entityId: {
              type: 'integer',
              description: 'ID of entity affected',
              example: 1
            },
            employeeId: {
              type: 'integer',
              description: 'ID of employee who performed action',
              example: 1
            },
            ipAddress: {
              type: 'string',
              description: 'IP address of the request',
              example: '192.168.1.1'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of the activity',
              example: '2023-01-01T10:00:00Z'
            }
          },
          required: ['id', 'action', 'entityType', 'createdAt']
        }
      }
    },
    apis: [
      {
        path: '/api/auth/login',
        method: 'post',
        description: 'Employee login',
        tags: ['Authentication'],
        requestBody: {
          description: 'Login credentials',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  employeeId: {
                    type: 'string',
                    description: 'Employee ID',
                    example: 'EMP001'
                  },
                  password: {
                    type: 'string',
                    description: 'Password',
                    example: 'password123'
                  }
                },
                required: ['employeeId', 'password']
              }
            }
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthResponse'
                  }
                }
              }
            },
            401: {
              description: 'Authentication failed',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ErrorResponse'
                  }
                }
              }
            }
          }
        },
        {
        path: '/api/employees',
        method: 'get',
        description: 'Get all employees with pagination and filtering',
        tags: ['Employees'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
              minimum: 1
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: {
              type: 'integer',
              default: 10,
              minimum: 1,
              maximum: 100
            }
          },
          {
            name: 'search',
            in: 'query',
            description: 'Search term to filter employees',
            required: false,
            schema: {
              type: 'string'
            }
          },
          {
            name: 'employmentStatus',
            in: 'query',
            description: 'Filter by employment status',
            required: false,
            schema: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract', 'intern', 'terminated']
            }
          }
        ],
        responses: {
          200: {
            description: 'Employees retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EmployeeList'
                }
              }
            }
          }
        }
      }
    ]
  },
  apis: [
    {
      path: '/api/employees',
      method: 'post',
      description: 'Create a new employee',
      tags: ['Employees'],
      security: [
        {
          bearerAuth: []
        }
      ],
      requestBody: {
        description: 'Employee data to create',
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Employee'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Employee created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Employee'
              }
            }
          }
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    }
  ]
};

module.exports = swaggerOptions;