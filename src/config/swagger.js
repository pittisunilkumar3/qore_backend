const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger configuration for API documentation
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Qore Backend API',
      version: '1.0.0',
      description: 'A comprehensive Node.js backend API with MySQL, Prisma ORM, and Role Management System',
      contact: {
        name: 'API Support',
        email: 'support@qore.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
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
            isActive: {
              type: 'boolean',
              description: 'Whether the employee is active',
              example: true
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerOptions;
