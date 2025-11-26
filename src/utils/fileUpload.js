const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, filename);
  }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'application/pdf': true,
    'application/msword': true,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
    'application/vnd.ms-excel': true,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
    'text/csv': true
  };

  const allowedExtensions = {
    '.jpg': true,
    '.jpeg': true,
    '.png': true,
    '.gif': true,
    '.pdf': true,
    '.doc': true,
    '.docx': true,
    '.xls': true,
    '.xlsx': true,
    '.csv': true
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedMimes[mime] && allowedExtensions[ext]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPG, PNG, GIF) and documents (PDF, DOC, DOCX, XLS, XLSX, CSV) are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 5 // Maximum 5 files per request
  }
});

/**
 * Upload single file
 * @param {string} fieldName - Field name for the file
 */
const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);
    
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: 'File too large',
              code: 'FILE_TOO_LARGE',
              maxSize: process.env.MAX_FILE_SIZE || '5MB'
            });
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
              success: false,
              error: 'Too many files',
              code: 'TOO_MANY_FILES',
              maxFiles: 5
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          error: 'File upload failed',
          code: 'UPLOAD_FAILED',
          details: err.message
        });
      }
      
      next();
    });
  };
};

/**
 * Upload multiple files
 * @param {string} fieldName - Field name for the files
 * @param {number} maxCount - Maximum number of files
 */
const uploadMultiple = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const multiUpload = upload.array(fieldName, maxCount);
    
    multiUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              error: 'File too large',
              code: 'FILE_TOO_LARGE',
              maxSize: process.env.MAX_FILE_SIZE || '5MB'
            });
          } else if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
              success: false,
              error: 'Too many files',
              code: 'TOO_MANY_FILES',
              maxFiles: maxCount
            });
          }
        }
        
        return res.status(400).json({
          success: false,
          error: 'File upload failed',
          code: 'UPLOAD_FAILED',
          details: err.message
        });
      }
      
      next();
    });
  };
};

/**
 * Download file
 * @param {string} filePath - Path to the file
 * @param {Object} res - Express response object
 */
const downloadFile = (filePath, res) => {
  const fullPath = path.resolve(filePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({
      success: false,
      error: 'File not found',
      code: 'FILE_NOT_FOUND'
    });
  }
  
  // Get file stats
  const stats = fs.statSync(fullPath);
  const filename = path.basename(fullPath);
  
  // Set appropriate headers
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', getContentType(filename));
  res.setHeader('Content-Length', stats.size);
  
  // Send file
  const fileStream = fs.createReadStream(fullPath);
  fileStream.pipe(res);
};

/**
 * Delete file
 * @param {string} filePath - Path to the file
 */
const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(filePath);
    
    if (!fs.existsSync(fullPath)) {
      return resolve({ success: false, message: 'File not found' });
    }
    
    fs.unlink(fullPath, (err) => {
      if (err) {
        return reject(err);
      }
      
      resolve({ success: true, message: 'File deleted successfully' });
    });
  });
};

/**
 * Get file content type
 * @param {string} filename - File name
 */
const getContentType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.csv': 'text/csv'
  };
  
  return contentTypes[ext] || 'application/octet-stream';
};

/**
 * Generate file hash for integrity checking
 * @param {string} filePath - Path to the file
 */
const getFileHash = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error('File not found'));
    }
    
    const hash = crypto.createHash('sha256');
    const fileStream = fs.createReadStream(filePath);
    
    fileStream.on('data', (data) => {
      hash.update(data);
    });
    
    fileStream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    
    fileStream.on('error', (err) => {
      reject(err);
    });
  });
};

/**
 * Validate file path to prevent directory traversal
 * @param {string} filePath - File path to validate
 */
const validateFilePath = (filePath) => {
  const normalizedPath = path.normalize(filePath);
  return !normalizedPath.includes('..');
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  downloadFile,
  deleteFile,
  getContentType,
  getFileHash,
  validateFilePath
};