const { PrismaClient } = require('@prisma/client');
const { downloadFile, deleteFile, getFileHash, validateFilePath } = require('../utils/fileUpload');
const path = require('path');
const fs = require('fs');
const prisma = new PrismaClient();

class FileController {
  /**
   * Upload employee photo
   * POST /api/files/upload/photo
   */
  static async uploadPhoto(req, res) {
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

      const { employeeId } = req.body;
      const currentEmployeeId = req.employee.id;

      // Validate employee ID if provided (for admin uploads)
      let targetEmployeeId = currentEmployeeId;
      if (employeeId && req.employee.isSuperadmin) {
        targetEmployeeId = parseInt(employeeId);
      }

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: targetEmployeeId }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      // Validate file path
      if (!validateFilePath(req.file.path)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file path',
          code: 'INVALID_FILE_PATH'
        });
      }

      // Generate file hash for integrity
      const fileHash = await getFileHash(req.file.path);
      const relativePath = `uploads/photos/${req.file.filename}`;

      // Update employee photo
      await prisma.employee.update({
        where: { id: targetEmployeeId },
        data: { 
          photo: relativePath,
          updatedAt: new Date()
        }
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'UPLOAD_PHOTO',
          entityType: 'Employee',
          entityId: targetEmployeeId,
          newValue: JSON.stringify({
            filename: req.file.filename,
            path: relativePath,
            hash: fileHash,
            size: req.file.size
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Photo uploaded successfully',
        data: {
          filename: req.file.filename,
          path: relativePath,
          size: req.file.size,
          hash: fileHash
        }
      });
    } catch (error) {
      console.error('Upload photo error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Upload employee documents
   * POST /api/files/upload/documents
   */
  static async uploadDocuments(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded',
          code: 'NO_FILES'
        });
      }

      const { employeeId, documentType } = req.body;
      const currentEmployeeId = req.employee.id;

      // Validate employee ID if provided (for admin uploads)
      let targetEmployeeId = currentEmployeeId;
      if (employeeId && req.employee.isSuperadmin) {
        targetEmployeeId = parseInt(employeeId);
      }

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: targetEmployeeId }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      const uploadedFiles = [];
      const existingDocuments = employee.otherDocuments ? JSON.parse(employee.otherDocuments) : [];

      for (const file of req.files) {
        // Validate file path
        if (!validateFilePath(file.path)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid file path',
            code: 'INVALID_FILE_PATH'
          });
        }

        // Generate file hash for integrity
        const fileHash = await getFileHash(file.path);
        const relativePath = `uploads/documents/${file.filename}`;

        const fileInfo = {
          filename: file.filename,
          originalName: file.originalname,
          path: relativePath,
          type: documentType || 'general',
          hash: fileHash,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        uploadedFiles.push(fileInfo);
        existingDocuments.push(fileInfo);
      }

      // Update employee documents
      await prisma.employee.update({
        where: { id: targetEmployeeId },
        data: { 
          otherDocuments: JSON.stringify(existingDocuments),
          updatedAt: new Date()
        }
      });

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'UPLOAD_DOCUMENTS',
          entityType: 'Employee',
          entityId: targetEmployeeId,
          newValue: JSON.stringify({
            files: uploadedFiles,
            count: uploadedFiles.length
          }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length
        }
      });
    } catch (error) {
      console.error('Upload documents error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Download file
   * GET /api/files/download/:filename
   */
  static async downloadFile(req, res) {
    try {
      const { filename } = req.params;

      if (!filename) {
        return res.status(400).json({
          success: false,
          error: 'Filename is required',
          code: 'MISSING_FILENAME'
        });
      }

      // Validate filename to prevent directory traversal
      if (!validateFilePath(filename)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid filename',
          code: 'INVALID_FILENAME'
        });
      }

      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
      
      downloadFile(filePath, res);
    } catch (error) {
      console.error('Download file error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Delete file
   * DELETE /api/files/:filename
   */
  static async deleteFile(req, res) {
    try {
      if (!req.employee) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
      }

      const { filename } = req.params;
      const currentEmployeeId = req.employee.id;

      if (!filename) {
        return res.status(400).json({
          success: false,
          error: 'Filename is required',
          code: 'MISSING_FILENAME'
        });
      }

      // Validate filename to prevent directory traversal
      if (!validateFilePath(filename)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid filename',
          code: 'INVALID_FILENAME'
        });
      }

      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'File not found',
          code: 'FILE_NOT_FOUND'
        });
      }

      // Delete file
      await deleteFile(filePath);

      // Update employee record if file was associated with employee
      const employee = await prisma.employee.findFirst({
        where: {
          OR: [
            { photo: { contains: filename } },
            { otherDocuments: { contains: filename } }
          ]
        }
      });

      if (employee) {
        let updateData = { updatedAt: new Date() };
        
        if (employee.photo && employee.photo.includes(filename)) {
          updateData.photo = null;
        }
        
        if (employee.otherDocuments) {
          const documents = JSON.parse(employee.otherDocuments);
          const updatedDocuments = documents.filter(doc => !doc.filename.includes(filename));
          updateData.otherDocuments = JSON.stringify(updatedDocuments);
        }
        
        await prisma.employee.update({
          where: { id: employee.id },
          data: updateData
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          employeeId: currentEmployeeId,
          action: 'DELETE_FILE',
          entityType: 'File',
          newValue: JSON.stringify({ filename }),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      });

      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }

  /**
   * Get employee files
   * GET /api/files/employee/:id
   */
  static async getEmployeeFiles(req, res) {
    try {
      const { id } = req.params;
      const currentEmployeeId = req.employee ? req.employee.id : null;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Employee ID is required',
          code: 'MISSING_EMPLOYEE_ID'
        });
      }

      const employeeId = parseInt(id);
      
      // Check if user can access this employee's files
      if (currentEmployeeId && currentEmployeeId !== employeeId && !req.employee.isSuperadmin) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          code: 'ACCESS_DENIED'
        });
      }

      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          id: true,
          employeeId: true,
          firstName: true,
          lastName: true,
          photo: true,
          otherDocuments: true
        }
      });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: 'Employee not found',
          code: 'EMPLOYEE_NOT_FOUND'
        });
      }

      const files = [];
      
      // Add photo if exists
      if (employee.photo) {
        const photoPath = path.join(process.env.UPLOAD_PATH || './uploads', employee.photo);
        if (fs.existsSync(photoPath)) {
          const stats = fs.statSync(photoPath);
          files.push({
            type: 'photo',
            filename: path.basename(employee.photo),
            path: employee.photo,
            size: stats.size,
            uploadedAt: employee.updatedAt
          });
        }
      }
      
      // Add documents if exist
      if (employee.otherDocuments) {
        try {
          const documents = JSON.parse(employee.otherDocuments);
          files.push(...documents);
        } catch (error) {
          console.error('Error parsing documents:', error);
        }
      }

      res.json({
        success: true,
        data: {
          employee: {
            id: employee.id,
            employeeId: employee.employeeId,
            firstName: employee.firstName,
            lastName: employee.lastName
          },
          files
        }
      });
    } catch (error) {
      console.error('Get employee files error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  }
}

module.exports = FileController;