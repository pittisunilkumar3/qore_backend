const { PrismaClient } = require('@prisma/client');
const { importEmployeesFromCSV, exportEmployeesToCSV, exportEmployeesToExcel } = require('../utils/importExport');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

class ImportExportController {
  /**
   * Import employees from CSV file
   * POST /api/import/employees
   */
  static async importEmployees(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
          code: 'NO_FILE'
        });
      }

      const currentEmployeeId = req.employee.id;
      const filePath = req.file.path;

      // Validate file extension
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext !== '.csv') {
        return res.status(400).json({
          success: false,
          error: 'Only CSV files are allowed for import',
          code: 'INVALID_FILE_TYPE'
        });
      }

      // Import employees
      const result = await importEmployeesFromCSV(filePath, currentEmployeeId);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'IMPORT_EMPLOYEES',
          entityType: 'Employee',
          newValue: JSON.stringify({
            filename: req.file.originalname,
            success: result.success,
            failed: result.failed,
            total: result.success + result.failed
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Import completed',
        data: {
          imported: result.success,
          failed: result.failed,
          total: result.success + result.failed,
          errors: result.errors,
          employees: result.importedEmployees
        }
      });
    } catch (error) {
      console.error('Import employees error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Export employees to CSV
   * GET /api/export/employees/csv
   */
  static async exportEmployeesCSV(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const {
        employmentStatus,
        isActive,
        department,
        hireDateFrom,
        hireDateTo
      } = req.query;

      const filters = {};
      if (employmentStatus) filters.employmentStatus = employmentStatus;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (department) filters.department = department;
      if (hireDateFrom) filters.hireDateFrom = hireDateFrom;
      if (hireDateTo) filters.hireDateTo = hireDateTo;

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `employees-export-${timestamp}.csv`;
      const filePath = path.join(process.env.EXPORT_PATH || './exports', filename);

      // Ensure export directory exists
      const exportDir = path.dirname(filePath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Export employees
      const result = await exportEmployeesToCSV(filters, filePath);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: req.employee.id,
          action: 'EXPORT_EMPLOYEES_CSV',
          entityType: 'Employee',
          newValue: JSON.stringify({
            filename,
            count: result.count,
            filters
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Length', fs.statSync(filePath).size);

      // Send file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Clean up file after download (optional)
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error cleaning up export file:', err);
        });
      }, 5000); // Clean up after 5 seconds
    } catch (error) {
      console.error('Export CSV error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Export employees to Excel
   * GET /api/export/employees/excel
   */
  static async exportEmployeesExcel(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const {
        employmentStatus,
        isActive,
        department,
        hireDateFrom,
        hireDateTo
      } = req.query;

      const filters = {};
      if (employmentStatus) filters.employmentStatus = employmentStatus;
      if (isActive !== undefined) filters.isActive = isActive === 'true';
      if (department) filters.department = department;
      if (hireDateFrom) filters.hireDateFrom = hireDateFrom;
      if (hireDateTo) filters.hireDateTo = hireDateTo;

      // Get employees data
      const where = { deletedAt: null };
      
      if (filters.employmentStatus) {
        where.employmentStatus = filters.employmentStatus;
      }
      
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      
      if (filters.department) {
        where.employeeRoles = {
          some: {
            role: {
              name: { contains: filters.department, mode: 'insensitive' }
            }
          }
        };
      }
      
      if (filters.hireDateFrom || filters.hireDateTo) {
        where.hireDate = {};
        if (filters.hireDateFrom) {
          where.hireDate.gte = new Date(filters.hireDateFrom);
        }
        if (filters.hireDateTo) {
          where.hireDate.lte = new Date(filters.hireDateTo);
        }
      }

      const employees = await prisma.employee.findMany({
        where,
        select: {
          employeeId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          gender: true,
          dob: true,
          position: true,
          qualification: true,
          workExperience: true,
          hireDate: true,
          employmentStatus: true,
          contractType: true,
          workShift: true,
          currentLocation: true,
          emergencyContact: true,
          emergencyContactRelation: true,
          maritalStatus: true,
          fatherName: true,
          motherName: true,
          localAddress: true,
          permanentAddress: true,
          bankAccountName: true,
          bankAccountNo: true,
          bankName: true,
          bankBranch: true,
          ifscCode: true,
          basicSalary: true,
          isActive: true
        },
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ]
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `employees-export-${timestamp}.xlsx`;
      const filePath = path.join(process.env.EXPORT_PATH || './exports', filename);

      // Ensure export directory exists
      const exportDir = path.dirname(filePath);
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      // Export employees
      const result = await exportEmployeesToExcel(employees, filePath);

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: req.employee.id,
          action: 'EXPORT_EMPLOYEES_EXCEL',
          entityType: 'Employee',
          newValue: JSON.stringify({
            filename,
            count: result.count,
            format: result.format,
            filters
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      // Set headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Length', fs.statSync(filePath).size);

      // Send file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Clean up file after download (optional)
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error cleaning up export file:', err);
        });
      }, 5000); // Clean up after 5 seconds
    } catch (error) {
      console.error('Export Excel error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get export/import history
   * GET /api/import-export/history
   */
  static async getHistory(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const { page = 1, limit = 20 } = req.query;
      const pageNum = parseInt(page) || 1;
      const limitNum = Math.min(parseInt(limit) || 20, 100);
      const skip = (pageNum - 1) * limitNum;

      const where = {
        action: { in: ['IMPORT_EMPLOYEES', 'EXPORT_EMPLOYEES_CSV', 'EXPORT_EMPLOYEES_EXCEL'] }
      };

      const total = await prisma.activityLog.count({ where });
      const activities = await prisma.activityLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: activities,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = ImportExportController;