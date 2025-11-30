const { z } = require('zod');

/**
 * Base employee validation schema
 */
const baseEmployeeSchema = z.object({
  employeeId: z.string()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be less than 50 characters')
    .regex(/^[A-Z0-9]+$/, 'Employee ID must contain only uppercase letters and numbers'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  lastName: z.string()
    .max(100, 'Last name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .optional(),
  phone: z.string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character'),
  gender: z.enum(['male', 'female', 'other'])
    .optional(),
  dob: z.string()
    .datetime('Invalid date format')
    .refine(date => {
      const birthDate = new Date(date);
      const today = new Date();
      const minAge = 16;
      const maxAge = 100;
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= minAge && age <= maxAge;
    }, 'Age must be between 16 and 100 years')
    .optional(),
  position: z.string()
    .max(100, 'Position must be less than 100 characters')
    .optional(),
  qualification: z.string()
    .max(200, 'Qualification must be less than 200 characters')
    .optional(),
  workExperience: z.string()
    .max(200, 'Work experience must be less than 200 characters')
    .optional(),
  hireDate: z.string()
    .datetime('Invalid hire date format')
    .optional(),
  dateOfLeaving: z.string()
    .datetime('Invalid date of leaving format')
    .optional(),
  employmentStatus: z.enum(['full-time', 'part-time', 'contract', 'intern', 'terminated'])
    .default('full-time'),
  contractType: z.string()
    .max(20, 'Contract type must be less than 20 characters')
    .optional(),
  workShift: z.string()
    .max(50, 'Work shift must be less than 50 characters')
    .optional(),
  currentLocation: z.string()
    .max(100, 'Current location must be less than 100 characters')
    .optional(),
  reportingTo: z.number()
    .int('Reporting to must be a valid employee ID')
    .positive('Reporting to must be a positive number')
    .optional(),
  emergencyContact: z.string()
    .regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid emergency contact format')
    .max(20, 'Emergency contact must be less than 20 characters')
    .optional(),
  emergencyContactRelation: z.string()
    .max(50, 'Emergency contact relation must be less than 50 characters')
    .optional(),
  maritalStatus: z.string()
    .max(20, 'Marital status must be less than 20 characters')
    .optional(),
  fatherName: z.string()
    .max(100, 'Father name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'Father name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  motherName: z.string()
    .max(100, 'Mother name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'Mother name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  localAddress: z.string()
    .max(1000, 'Local address must be less than 1000 characters')
    .optional(),
  permanentAddress: z.string()
    .max(1000, 'Permanent address must be less than 1000 characters')
    .optional(),
  bankAccountName: z.string()
    .max(100, 'Bank account name must be less than 100 characters')
    .optional(),
  bankAccountNo: z.string()
    .max(50, 'Bank account number must be less than 50 characters')
    .optional(),
  bankName: z.string()
    .max(100, 'Bank name must be less than 100 characters')
    .optional(),
  bankBranch: z.string()
    .max(100, 'Bank branch must be less than 100 characters')
    .optional(),
  ifscCode: z.string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format')
    .max(20, 'IFSC code must be less than 20 characters')
    .optional(),
  basicSalary: z.number()
    .min(0, 'Basic salary must be a positive number')
    .max(99999999.99, 'Basic salary is too high')
    .optional(),
  facebook: z.string()
    .url('Invalid Facebook URL format')
    .max(255, 'Facebook URL must be less than 255 characters')
    .optional(),
  twitter: z.string()
    .url('Invalid Twitter URL format')
    .max(255, 'Twitter URL must be less than 255 characters')
    .optional(),
  linkedin: z.string()
    .url('Invalid LinkedIn URL format')
    .max(255, 'LinkedIn URL must be less than 255 characters')
    .optional(),
  instagram: z.string()
    .url('Invalid Instagram URL format')
    .max(255, 'Instagram URL must be less than 255 characters')
    .optional(),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
  isSuperadmin: z.boolean()
    .default(false),
  isActive: z.boolean()
    .default(true),
  roleIds: z.array(z.number().int().positive())
    .min(1, 'At least one role must be assigned')
    .optional()
});

/**
 * Employee creation validation schema with refinements
 */
const createEmployeeSchema = baseEmployeeSchema.refine(data => {
  // Business logic validation
  if (data.dateOfLeaving && data.hireDate) {
    const hireDate = new Date(data.hireDate);
    const leavingDate = new Date(data.dateOfLeaving);
    return leavingDate > hireDate;
  }
  return true;
}, {
  message: 'Date of leaving must be after hire date',
  path: ['dateOfLeaving']
});

/**
 * Employee update validation schema
 */
const updateEmployeeSchema = baseEmployeeSchema.partial().extend({
  id: z.number()
    .int('ID must be an integer')
    .positive('ID must be a positive number')
});

/**
 * Employee search/filter validation schema
 */
const employeeQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .default('10'),
  search: z.string()
    .max(100, 'Search term must be less than 100 characters')
    .optional(),
  department: z.string()
    .max(100, 'Department filter must be less than 100 characters')
    .optional(),
  position: z.string()
    .max(100, 'Position filter must be less than 100 characters')
    .optional(),
  employmentStatus: z.enum(['full-time', 'part-time', 'contract', 'intern', 'terminated'])
    .optional(),
  isActive: z.enum(['true', 'false'])
    .transform(val => val === 'true')
    .optional(),
  gender: z.enum(['male', 'female', 'other'])
    .optional(),
  hireDateFrom: z.string()
    .datetime('Invalid start date format')
    .optional(),
  hireDateTo: z.string()
    .datetime('Invalid end date format')
    .optional(),
  sortBy: z.enum([
    'firstName', 'lastName', 'email', 'employeeId', 'hireDate', 
    'createdAt', 'updatedAt', 'basicSalary'
  ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .default('desc')
});

/**
 * Employee ID parameter validation
 */
const employeeIdParamSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Employee ID must be a number')
    .transform(Number)
});

/**
 * Validate unique employee ID
 * @param {Object} prisma - Prisma client instance
 */
const validateUniqueEmployeeId = async (prisma, employeeId, excludeId = null) => {
  const where = { employeeId };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  
  const existing = await prisma.employee.findFirst({ where });
  return !existing;
};

/**
 * Validate unique email
 * @param {Object} prisma - Prisma client instance
 */
const validateUniqueEmail = async (prisma, email, excludeId = null) => {
  if (!email) return true;
  
  const where = { email };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  
  const existing = await prisma.employee.findFirst({ where });
  return !existing;
};

/**
 * Validate reporting manager exists
 * @param {Object} prisma - Prisma client instance
 */
const validateReportingManager = async (prisma, managerId) => {
  if (!managerId) return true;
  
  const manager = await prisma.employee.findFirst({
    where: { 
      id: managerId,
      isActive: true 
    }
  });
  return !!manager;
};

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeQuerySchema,
  employeeIdParamSchema,
  validateUniqueEmployeeId,
  validateUniqueEmail,
  validateReportingManager
};