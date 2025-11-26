const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const { authenticateToken, requireRole, requirePrimaryRole } = require('../middleware/auth');
const { 
  validate, 
  sanitizeBody,
  createEmployeeSchema, 
  updateEmployeeSchema, 
  employeeQuerySchema, 
  employeeIdParamSchema 
} = require('../validators/employeeValidator');

const router = express.Router();

// Apply validation middleware to all routes
router.use(sanitizeBody);

// GET /api/employees - Get all employees with pagination and filtering
router.get('/', 
  validate(employeeQuerySchema, 'query'),
  EmployeeController.getAllEmployees
);

// GET /api/employees/statistics - Get employee statistics
router.get('/statistics', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  EmployeeController.getEmployeeStatistics
);

// GET /api/employees/:id - Get employee by ID
router.get('/:id', 
  validate(employeeIdParamSchema, 'params'),
  EmployeeController.getEmployeeById
);

// POST /api/employees - Create new employee (requires authentication and appropriate role)
router.post('/', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  validate(createEmployeeSchema, 'body'),
  EmployeeController.createEmployee
);

// PUT /api/employees/:id - Update employee (requires authentication and appropriate role)
router.put('/:id', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  validate(employeeIdParamSchema, 'params'),
  validate(updateEmployeeSchema, 'body'),
  EmployeeController.updateEmployee
);

// DELETE /api/employees/:id - Soft delete employee (requires authentication and appropriate role)
router.delete('/:id', 
  authenticateToken,
  requireRole(['admin', 'superadmin']),
  validate(employeeIdParamSchema, 'params'),
  EmployeeController.deleteEmployee
);

// POST /api/employees/:id/restore - Restore soft deleted employee (requires authentication and appropriate role)
router.post('/:id/restore', 
  authenticateToken,
  requireRole(['admin', 'superadmin']),
  validate(employeeIdParamSchema, 'params'),
  EmployeeController.restoreEmployee
);

// GET /api/employees/:id/subordinates - Get employee subordinates
router.get('/:id/subordinates', 
  authenticateToken,
  validate(employeeIdParamSchema, 'params'),
  EmployeeController.getSubordinates
);

// GET /api/employees/:id/manager - Get employee manager
router.get('/:id/manager', 
  authenticateToken,
  validate(employeeIdParamSchema, 'params'),
  EmployeeController.getManager
);

module.exports = router;