const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('../utils/password');
const redisClient = require('../utils/redis');
const prisma = new PrismaClient();

class EmployeeModel {
  /**
   * Get all employees with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @param {string} params.department - Filter by department
   * @param {string} params.position - Filter by position
   * @param {string} params.employmentStatus - Filter by employment status
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.gender - Filter by gender
   * @param {string} params.hireDateFrom - Filter by hire date from
   * @param {string} params.hireDateTo - Filter by hire date to
   * @param {string} params.sortBy - Sort field
   * @param {string} params.sortOrder - Sort order (asc/desc)
   */
  static async getAllEmployees({
    page = 1,
    limit = 10,
    search,
    department,
    position,
    employmentStatus,
    isActive,
    gender,
    hireDateFrom,
    hireDateTo,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  }) {
    // Generate cache key
    const queryParams = {
      page, limit, search, department, position, employmentStatus,
      isActive, gender, hireDateFrom, hireDateTo, sortBy, sortOrder
    };
    const cacheKey = redisClient.generateQueryKey(queryParams);
    
    // Try to get from cache first
    const cachedResult = await redisClient.getCachedEmployeeList(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 10, 100);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      deletedAt: null,
    };

    // Search functionality
    if (search) {
      where.OR = [
        { employeeId: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } },
        { qualification: { contains: search, mode: 'insensitive' } },
        { currentLocation: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Department filter (would need to join with roles)
    if (department) {
      where.employeeRoles = {
        some: {
          role: {
            name: { contains: department, mode: 'insensitive' }
          }
        }
      };
    }

    // Position filter
    if (position) {
      where.position = { contains: position, mode: 'insensitive' };
    }

    // Employment status filter
    if (employmentStatus) {
      where.employmentStatus = employmentStatus;
    }

    // Active status filter
    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    // Gender filter
    if (gender) {
      where.gender = gender;
    }

    // Hire date range filter
    if (hireDateFrom || hireDateTo) {
      where.hireDate = {};
      if (hireDateFrom) {
        where.hireDate.gte = new Date(hireDateFrom);
      }
      if (hireDateTo) {
        where.hireDate.lte = new Date(hireDateTo);
      }
    }

    const total = await prisma.employee.count({ where });
    const employees = await prisma.employee.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        },
        manager: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        subordinates: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: [
        { [sortBy]: sortOrder },
        { firstName: 'asc' }
      ]
    });

    const totalPages = Math.ceil(total / limitNum);

    const result = {
      employees,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };

    // Cache the result
    await redisClient.cacheEmployeeList(cacheKey, result);

    return result;
  }

  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   */
  static async getEmployeeById(id) {
    if (isNaN(id)) {
      throw new Error('Invalid employee ID');
    }

    // Try to get from cache first
    const cachedEmployee = await redisClient.getCachedEmployee(id);
    if (cachedEmployee) {
      return cachedEmployee;
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        },
        manager: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        subordinates: {
          select: {
            id: true,
            employeeId: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Cache the result
    if (employee) {
      await redisClient.cacheEmployee(id, employee);
    }

    return employee;
  }

  /**
   * Get employee by employee ID
   * @param {string} employeeId - Employee unique ID
   */
  static async getEmployeeByEmployeeId(employeeId) {
    // Try to get from cache first
    const cachedEmployee = await redisClient.getCachedEmployee(employeeId);
    if (cachedEmployee) {
      return cachedEmployee;
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        }
      }
    });

    // Cache the result
    if (employee) {
      await redisClient.cacheEmployee(employeeId, employee);
    }

    return employee;
  }

  /**
   * Create a new employee
   * @param {Object} data - Employee data
   */
  static async createEmployee(data) {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      position,
      qualification,
      workExperience,
      hireDate,
      employmentStatus,
      contractType,
      workShift,
      currentLocation,
      reportingTo,
      emergencyContact,
      emergencyContactRelation,
      maritalStatus,
      fatherName,
      motherName,
      localAddress,
      permanentAddress,
      bankAccountName,
      bankAccountNo,
      bankName,
      bankBranch,
      ifscCode,
      basicSalary,
      facebook,
      twitter,
      linkedin,
      instagram,
      notes,
      isSuperadmin,
      isActive,
      roleIds,
      createdBy
    } = data;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create employee with roles
    const employeeData = {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      gender,
      dob: dob ? new Date(dob) : null,
      position,
      qualification,
      workExperience,
      hireDate: hireDate ? new Date(hireDate) : null,
      employmentStatus,
      contractType,
      workShift,
      currentLocation,
      reportingTo: reportingTo ? parseInt(reportingTo) : null,
      emergencyContact,
      emergencyContactRelation,
      maritalStatus,
      fatherName,
      motherName,
      localAddress,
      permanentAddress,
      bankAccountName,
      bankAccountNo,
      bankName,
      bankBranch,
      ifscCode,
      basicSalary,
      facebook,
      twitter,
      linkedin,
      instagram,
      notes,
      isSuperadmin: isSuperadmin || false,
      isActive: isActive !== undefined ? isActive : true,
      createdBy: createdBy ? parseInt(createdBy) : null
    };

    const employee = await prisma.employee.create({
      data: employeeData,
      include: {
        employeeRoles: {
          include: {
            role: true
          }
        }
      }
    });

    // Assign roles if provided
    if (roleIds && roleIds.length > 0) {
      const roleAssignments = roleIds.map((roleId, index) => ({
        employeeId: employee.id,
        roleId: parseInt(roleId),
        isPrimary: index === 0, // First role is primary
        isActive: true
      }));

      await prisma.employeeRole.createMany({
        data: roleAssignments
      });
    }

    const result = await this.getEmployeeById(employee.id);
    
    // Invalidate related caches
    await redisClient.invalidateEmployeeCaches(employee.id);
    
    return result;
  }

  /**
   * Update an employee
   * @param {number} id - Employee ID
   * @param {Object} data - Update data
   */
  static async updateEmployee(id, data) {
    if (isNaN(id)) {
      throw new Error('Invalid employee ID');
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      gender,
      dob,
      position,
      qualification,
      workExperience,
      hireDate,
      dateOfLeaving,
      employmentStatus,
      contractType,
      workShift,
      currentLocation,
      reportingTo,
      emergencyContact,
      emergencyContactRelation,
      maritalStatus,
      fatherName,
      motherName,
      localAddress,
      permanentAddress,
      bankAccountName,
      bankAccountNo,
      bankName,
      bankBranch,
      ifscCode,
      basicSalary,
      facebook,
      twitter,
      linkedin,
      instagram,
      notes,
      isSuperadmin,
      isActive,
      roleIds
    } = data;

    const updateData = {};

    // Only include fields that are provided
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (password !== undefined) updateData.password = await hashPassword(password);
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = new Date(dob);
    if (position !== undefined) updateData.position = position;
    if (qualification !== undefined) updateData.qualification = qualification;
    if (workExperience !== undefined) updateData.workExperience = workExperience;
    if (hireDate !== undefined) updateData.hireDate = new Date(hireDate);
    if (dateOfLeaving !== undefined) updateData.dateOfLeaving = new Date(dateOfLeaving);
    if (employmentStatus !== undefined) updateData.employmentStatus = employmentStatus;
    if (contractType !== undefined) updateData.contractType = contractType;
    if (workShift !== undefined) updateData.workShift = workShift;
    if (currentLocation !== undefined) updateData.currentLocation = currentLocation;
    if (reportingTo !== undefined) updateData.reportingTo = reportingTo ? parseInt(reportingTo) : null;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (emergencyContactRelation !== undefined) updateData.emergencyContactRelation = emergencyContactRelation;
    if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (motherName !== undefined) updateData.motherName = motherName;
    if (localAddress !== undefined) updateData.localAddress = localAddress;
    if (permanentAddress !== undefined) updateData.permanentAddress = permanentAddress;
    if (bankAccountName !== undefined) updateData.bankAccountName = bankAccountName;
    if (bankAccountNo !== undefined) updateData.bankAccountNo = bankAccountNo;
    if (bankName !== undefined) updateData.bankName = bankName;
    if (bankBranch !== undefined) updateData.bankBranch = bankBranch;
    if (ifscCode !== undefined) updateData.ifscCode = ifscCode;
    if (basicSalary !== undefined) updateData.basicSalary = basicSalary;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (notes !== undefined) updateData.notes = notes;
    if (isSuperadmin !== undefined) updateData.isSuperadmin = isSuperadmin;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update employee
    await prisma.employee.update({
      where: { id },
      data: updateData
    });

    // Update roles if provided
    if (roleIds !== undefined) {
      // Remove existing roles
      await prisma.employeeRole.deleteMany({
        where: { employeeId: id }
      });

      // Add new roles
      if (roleIds && roleIds.length > 0) {
        const roleAssignments = roleIds.map((roleId, index) => ({
          employeeId: id,
          roleId: parseInt(roleId),
          isPrimary: index === 0,
          isActive: true
        }));

        await prisma.employeeRole.createMany({
          data: roleAssignments
        });
      }
    }

    const result = await this.getEmployeeById(id);
    
    // Invalidate related caches
    await redisClient.invalidateEmployeeCaches(id);
    
    return result;
  }

  /**
   * Soft delete an employee (set deletedAt)
   * @param {number} id - Employee ID
   */
  static async softDeleteEmployee(id) {
    if (isNaN(id)) {
      throw new Error('Invalid employee ID');
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false
      }
    });
  }

  /**
   * Restore a soft deleted employee
   * @param {number} id - Employee ID
   */
  static async restoreEmployee(id) {
    if (isNaN(id)) {
      throw new Error('Invalid employee ID');
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true
      }
    });
  }

  /**
   * Permanently delete an employee
   * @param {number} id - Employee ID
   */
  static async deleteEmployee(id) {
    if (isNaN(id)) {
      throw new Error('Invalid employee ID');
    }

    return await prisma.employee.delete({
      where: { id }
    });
  }

  /**
   * Get employee subordinates (hierarchy)
   * @param {number} managerId - Manager ID
   */
  static async getSubordinates(managerId) {
    if (isNaN(managerId)) {
      throw new Error('Invalid manager ID');
    }

    return await prisma.employee.findMany({
      where: {
        reportingTo: parseInt(managerId),
        isActive: true,
        deletedAt: null
      },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        employmentStatus: true
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ]
    });
  }

  /**
   * Get employee manager (hierarchy)
   * @param {number} employeeId - Employee ID
   */
  static async getManager(employeeId) {
    if (isNaN(employeeId)) {
      throw new Error('Invalid employee ID');
    }

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
      select: {
        reportingTo: true
      }
    });

    if (!employee || !employee.reportingTo) {
      return null;
    }

    return await prisma.employee.findUnique({
      where: { id: employee.reportingTo },
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true
      }
    });
  }

  /**
   * Get employee statistics
   */
  static async getEmployeeStatistics() {
    // Try to get from cache first
    const cacheKey = 'employee_statistics';
    const cachedStats = await redisClient.getCachedAnalytics(cacheKey);
    if (cachedStats) {
      return cachedStats;
    }

    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      employeesByStatus,
      employeesByGender,
      recentHires
    ] = await Promise.all([
      prisma.employee.count({
        where: { deletedAt: null }
      }),
      prisma.employee.count({
        where: {
          isActive: true,
          deletedAt: null
        }
      }),
      prisma.employee.count({
        where: {
          isActive: false,
          deletedAt: null
        }
      }),
      prisma.employee.groupBy({
        by: ['employmentStatus'],
        where: { deletedAt: null },
        _count: true
      }),
      prisma.employee.groupBy({
        by: ['gender'],
        where: { deletedAt: null },
        _count: true
      }),
      prisma.employee.count({
        where: {
          hireDate: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
          },
          deletedAt: null
        }
      })
    ]);

    const result = {
      total: totalEmployees,
      active: activeEmployees,
      inactive: inactiveEmployees,
      byStatus: employeesByStatus.reduce((acc, item) => {
        acc[item.employmentStatus] = item._count;
        return acc;
      }, {}),
      byGender: employeesByGender.reduce((acc, item) => {
        acc[item.gender || 'unknown'] = item._count;
        return acc;
      }, {}),
      recentHires
    };

    // Cache the result
    await redisClient.cacheAnalytics(cacheKey, result);

    return result;
  }
}

module.exports = EmployeeModel;