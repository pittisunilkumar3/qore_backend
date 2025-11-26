const express = require('express');
const FileController = require('../controllers/FileController');
const { authenticateToken } = require('../middleware/auth');
const { uploadSingle, uploadMultiple } = require('../utils/fileUpload');
const { uploadLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/files/upload/photo - Upload employee photo
router.post('/upload/photo',
  authenticateToken,
  uploadLimiter, // Apply rate limiting to file uploads
  uploadSingle('photo'),
  FileController.uploadPhoto
);

// POST /api/files/upload/documents - Upload employee documents
router.post('/upload/documents',
  authenticateToken,
  uploadLimiter, // Apply rate limiting to file uploads
  uploadMultiple('documents'),
  FileController.uploadDocuments
);

// GET /api/files/download/:filename - Download file
router.get('/download/:filename', 
  authenticateToken,
  FileController.downloadFile
);

// DELETE /api/files/:filename - Delete file
router.delete('/:filename', 
  authenticateToken,
  FileController.deleteFile
);

// GET /api/files/employee/:id - Get employee files
router.get('/employee/:id', 
  authenticateToken,
  FileController.getEmployeeFiles
);

module.exports = router;