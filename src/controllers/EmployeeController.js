const EmployeeModel = require('../models/Employee');
const { 
  validateUniqueEmployeeId, 
  validateUniqueEmail, 
  validateReportingManager 
} = require('../validators/employeeValidator');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EmployeeController {
  /**
   * Get all employees with pagination and filtering
   * GET /api/employees
   */
  static async getAllEmployees(req, res) {
    try {
      const {
        page,
        limit,
        search,
        department,
        position,
        employmentStatus,
        isActive,
        gender,
        hireDateFrom,
        hireDateTo,
        sortBy,
        sortOrder
      } = req.validatedQuery || req.query;

      const result = await EmployeeModel.getAllEmployees({
        page,
        limit,
        search,
        department,
        position,
        employmentStatus,
        isActive,
        gender,
        hireDateFrom,
        hireDateTo,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.employees,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get all employees error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get employee by ID
   * GET /api/employees/:id
   */
  static async getEmployeeById(req, res) {
    try {
      const { id } = req.validatedParams || req.params;

      const employee = await EmployeeModel.getEmployeeById(parseInt(id));

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      console.error('Get employee by ID error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Create a new employee
   * POST /api/employees
   */
  static async createEmployee(req, res) {
    try {
      const employeeData = req.validatedBody || req.body;
      const currentEmployeeId = req.employee ? req.employee.id : null;

      // Validate unique employee ID
      const isEmployeeIdUnique = await validateUniqueEmployeeId(
        prisma, 
        employeeData.employeeId
      );
      if (!isEmployeeIdUnique) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID already exists',
          code: 'DUPLICATE_EMPLOYEE_ID'
        });
      }

      // Validate unique email if provided
      if (employeeData.email) {
        const isEmailUnique = await validateUniqueEmail(
          prisma, 
          employeeData.email
        );
        if (!isEmailUnique) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists',
            code: 'DUPLICATE_EMAIL'
          });
        }
      }

      // Validate reporting manager if provided
      if (employeeData.reportingTo) {
        const isValidManager = await validateReportingManager(
          prisma, 
          employeeData.reportingTo
        );
        if (!isValidManager) {
          return res.status(400).json({
            success: false,
            error: 'Invalid reporting manager',
            code: 'INVALID_MANAGER'
          });
        }
      }

      // Create employee
      const employee = await EmployeeModel.createEmployee({
        ...employeeData,
        createdBy: currentEmployeeId
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'CREATE_EMPLOYEE',
          entityType: 'Employee',
          entityId: employee.id,
          oldValue: null,
          newValue: JSON.stringify({
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.status(201).json({
        success: true,
        data: employee,
        message: 'Employee created successfully'
      });
    } catch (error) {
      console.error('Create employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Update an employee
   * PUT /api/employees/:id
   */
  static async updateEmployee(req, res) {
    try {
      const { id } = req.validatedParams || req.params;
      const updateData = req.validatedBody || req.body;
      const currentEmployeeId = req.employee ? req.employee.id : null;

      // Check if employee exists
      const existingEmployee = await EmployeeModel.getEmployeeById(parseInt(id));
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      // Validate unique employee ID if being updated
      if (updateData.employeeId && updateData.employeeId !== existingEmployee.employeeId) {
        const isEmployeeIdUnique = await validateUniqueEmployeeId(
          prisma, 
          updateData.employeeId,
          parseInt(id)
        );
        if (!isEmployeeIdUnique) {
          return res.status(400).json({
            success: false,
            error: 'Employee ID already exists',
            code: 'DUPLICATE_EMPLOYEE_ID'
          });
        }
      }

      // Validate unique email if being updated
      if (updateData.email && updateData.email !== existingEmployee.email) {
        const isEmailUnique = await validateUniqueEmail(
          prisma, 
          updateData.email,
          parseInt(id)
        );
        if (!isEmailUnique) {
          return res.status(400).json({
            success: false,
            error: 'Email already exists',
            code: 'DUPLICATE_EMAIL'
          });
        }
      }

      // Validate reporting manager if being updated
      if (updateData.reportingTo !== undefined) {
        if (updateData.reportingTo && updateData.reportingTo !== existingEmployee.reportingTo) {
          const isValidManager = await validateReportingManager(
            prisma, 
            updateData.reportingTo
          );
          if (!isValidManager) {
            return res.status(400).json({
              success: false,
              error: 'Invalid reporting manager',
              code: 'INVALID_MANAGER'
            });
          }
        }
      }

      // Update employee
      const employee = await EmployeeModel.updateEmployee(parseInt(id), updateData);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'UPDATE_EMPLOYEE',
          entityType: 'Employee',
          entityId: employee.id,
          oldValue: JSON.stringify({
            employeeId: existingEmployee.employeeId,
            firstName: existingEmployee.firstName,
            lastName: existingEmployee.lastName,
            email: existingEmployee.email
          }),
          newValue: JSON.stringify({
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        data: employee,
        message: 'Employee updated successfully'
      });
    } catch (error) {
      console.error('Update employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Soft delete an employee
   * DELETE /api/employees/:id
   */
  static async deleteEmployee(req, res) {
    try {
      const { id } = req.validatedParams || req.params;
      const currentEmployeeId = req.employee ? req.employee.id : null;

      // Check if employee exists
      const existingEmployee = await EmployeeModel.getEmployeeById(parseInt(id));
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      // Prevent self-deletion
      if (currentEmployeeId && parseInt(id) === currentEmployeeId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot delete your own account',
          code: 'SELF_DELETION'
        });
      }

      // Soft delete employee
      await EmployeeModel.softDeleteEmployee(parseInt(id));

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'DELETE_EMPLOYEE',
          entityType: 'Employee',
          entityId: parseInt(id),
          oldValue: JSON.stringify({
            employeeId: existingEmployee.employeeId,
            firstName: existingEmployee.firstName,
            lastName: existingEmployee.lastName,
            email: existingEmployee.email
          }),
          newValue: null,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Employee deleted successfully'
      });
    } catch (error) {
      console.error('Delete employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Restore a soft deleted employee
   * POST /api/employees/:id/restore
   */
  static async restoreEmployee(req, res) {
    try {
      const { id } = req.validatedParams || req.params;
      const currentEmployeeId = req.employee ? req.employee.id : null;

      // Check if employee exists
      const existingEmployee = await EmployeeModel.getEmployeeById(parseInt(id));
      if (!existingEmployee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      // Restore employee
      const employee = await EmployeeModel.restoreEmployee(parseInt(id));

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'RESTORE_EMPLOYEE',
          entityType: 'Employee',
          entityId: employee.id,
          oldValue: null,
          newValue: JSON.stringify({
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        data: employee,
        message: 'Employee restored successfully'
      });
    } catch (error) {
      console.error('Restore employee error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get employee subordinates
   * GET /api/employees/:id/subordinates
   */
  static async getSubordinates(req, res) {
    try {
      const { id } = req.validatedParams || req.params;

      // Check if employee exists
      const manager = await EmployeeModel.getEmployeeById(parseInt(id));
      if (!manager) {
        return res.status(404).json({
          success: false,
          error: 'Manager not found',
          code: 'MANAGER_NOT_FOUND'
        });
      }

      const subordinates = await EmployeeModel.getSubordinates(parseInt(id));

      res.json({
        success: true,
        data: subordinates
      });
    } catch (error) {
      console.error('Get subordinates error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get employee manager
   * GET /api/employees/:id/manager
   */
  static async getManager(req, res) {
    try {
      const { id } = req.validatedParams || req.params;

      // Check if employee exists
      const employee = await EmployeeModel.getEmployeeById(parseInt(id));
      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      const manager = await EmployeeModel.getManager(parseInt(id));

      res.json({
        success: true,
        data: manager
      });
    } catch (error) {
      console.error('Get manager error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get employee statistics
   * GET /api/employees/statistics
   */
  static async getEmployeeStatistics(req, res) {
    try {
      const statistics = await EmployeeModel.getEmployeeStatistics();

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      console.error('Get employee statistics error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = EmployeeController;