const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./password');
const prisma = new PrismaClient();

/**
 * Parse CSV file and return data
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Parsed data
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

/**
 * Convert employee data to CSV format
 * @param {Array} employees - Array of employee objects
 * @returns {string} CSV string
 */
const employeesToCSV = (employees) => {
  if (!employees || employees.length === 0) {
    return '';
  }

  const headers = [
    'employeeId', 'firstName', 'lastName', 'email', 'phone', 'gender', 'dob',
    'position', 'qualification', 'workExperience', 'hireDate', 'employmentStatus',
    'contractType', 'workShift', 'currentLocation', 'emergencyContact',
    'emergencyContactRelation', 'maritalStatus', 'fatherName', 'motherName',
    'localAddress', 'permanentAddress', 'bankAccountName', 'bankAccountNo',
    'bankName', 'bankBranch', 'ifscCode', 'basicSalary', 'isActive'
  ];

  const csvRows = employees.map(employee => {
    return headers.map(header => {
      let value = employee[header] || '';
      
      // Handle special characters and commas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });

  return [headers.join(','), ...csvRows].join('\n');
};

/**
 * Validate employee import data
 * @param {Object} employee - Employee data object
 * @param {number} index - Row index for error reporting
 * @returns {Object} Validation result
 */
const validateImportEmployee = (employee, index) => {
  const errors = [];
  
  // Required fields
  if (!employee.employeeId) errors.push('Employee ID is required');
  if (!employee.firstName) errors.push('First name is required');
  
  // Email format validation
  if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
    errors.push('Invalid email format');
  }
  
  // Phone format validation
  if (employee.phone && !/^[+]?[\d\s\-\(\)]+$/.test(employee.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Date validation
  if (employee.dob && isNaN(Date.parse(employee.dob))) {
    errors.push('Invalid date of birth format');
  }
  
  if (employee.hireDate && isNaN(Date.parse(employee.hireDate))) {
    errors.push('Invalid hire date format');
  }
  
  // Salary validation
  if (employee.basicSalary && isNaN(parseFloat(employee.basicSalary))) {
    errors.push('Basic salary must be a valid number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    row: index + 2 // +2 because of header row
  };
};

/**
 * Import employees from CSV file
 * @param {string} filePath - Path to CSV file
 * @param {number} createdBy - ID of user performing import
 * @returns {Promise<Object>} Import result
 */
const importEmployeesFromCSV = async (filePath, createdBy) => {
  try {
    const data = await parseCSV(filePath);
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      importedEmployees: []
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const validation = validateImportEmployee(row, i);
      
      if (!validation.isValid) {
        results.failed++;
        results.errors.push({
          row: validation.row,
          errors: validation.errors,
          data: row
        });
        continue;
      }

      try {
        // Prepare employee data
        const employeeData = {
          employeeId: row.employeeId,
          firstName: row.firstName,
          lastName: row.lastName || null,
          email: row.email || null,
          phone: row.phone || null,
          password: await hashPassword('TempPassword123!'), // Default password for imports
          gender: row.gender || null,
          dob: row.dob ? new Date(row.dob) : null,
          position: row.position || null,
          qualification: row.qualification || null,
          workExperience: row.workExperience || null,
          hireDate: row.hireDate ? new Date(row.hireDate) : null,
          employmentStatus: row.employmentStatus || 'full-time',
          contractType: row.contractType || null,
          workShift: row.workShift || null,
          currentLocation: row.currentLocation || null,
          emergencyContact: row.emergencyContact || null,
          emergencyContactRelation: row.emergencyContactRelation || null,
          maritalStatus: row.maritalStatus || null,
          fatherName: row.fatherName || null,
          motherName: row.motherName || null,
          localAddress: row.localAddress || null,
          permanentAddress: row.permanentAddress || null,
          bankAccountName: row.bankAccountName || null,
          bankAccountNo: row.bankAccountNo || null,
          bankName: row.bankName || null,
          bankBranch: row.bankBranch || null,
          ifscCode: row.ifscCode || null,
          basicSalary: row.basicSalary ? parseFloat(row.basicSalary) : null,
          isActive: row.isActive === 'true' || row.isActive === true,
          createdBy: createdBy
        };

        // Create employee
        const employee = await prisma.employee.create({
          data: employeeData
        });

        results.success++;
        results.importedEmployees.push({
          id: employee.id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName
        });
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          errors: [`Database error: ${error.message}`],
          data: row
        });
      }
    }

    return results;
  } catch (error) {
    throw new Error(`CSV parsing failed: ${error.message}`);
  }
};

/**
 * Export employees to CSV file
 * @param {Object} filters - Export filters
 * @param {string} filePath - Output file path
 * @returns {Promise<Object>} Export result
 */
const exportEmployeesToCSV = async (filters, filePath) => {
  try {
    const where = { deletedAt: null };
    
    // Apply filters
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

    // Get employees
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

    // Convert to CSV
    const csvData = employeesToCSV(employees);
    
    // Write to file
    fs.writeFileSync(filePath, csvData, 'utf8');
    
    return {
      success: true,
      count: employees.length,
      filePath
    };
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

/**
 * Generate Excel file from employee data
 * @param {Array} employees - Array of employee objects
 * @param {string} filePath - Output file path
 * @returns {Promise<Object>} Export result
 */
const exportEmployeesToExcel = async (employees, filePath) => {
  try {
    // This would require a library like xlsx or exceljs
    // For now, we'll create a CSV file with .xlsx extension
    // In a real implementation, you would use a proper Excel library
    const csvData = employeesToCSV(employees);
    fs.writeFileSync(filePath, csvData, 'utf8');
    
    return {
      success: true,
      count: employees.length,
      filePath,
      format: 'csv' // Note: Would be 'excel' with proper library
    };
  } catch (error) {
    throw new Error(`Excel export failed: ${error.message}`);
  }
};

module.exports = {
  parseCSV,
  employeesToCSV,
  validateImportEmployee,
  importEmployeesFromCSV,
  exportEmployeesToCSV,
  exportEmployeesToExcel
};