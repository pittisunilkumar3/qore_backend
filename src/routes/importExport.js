const express = require('express');
const ImportExportController = require('../controllers/ImportExportController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { uploadSingle } = require('../utils/fileUpload');

const router = express.Router();

// POST /api/import/employees - Import employees from CSV
router.post('/employees', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  uploadSingle('file'),
  ImportExportController.importEmployees
);

// GET /api/export/employees/csv - Export employees to CSV
router.get('/employees/csv', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  ImportExportController.exportEmployeesCSV
);

// GET /api/export/employees/excel - Export employees to Excel
router.get('/employees/excel', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  ImportExportController.exportEmployeesExcel
);

// GET /api/import-export/history - Get import/export history
router.get('/history', 
  authenticateToken,
  requireRole(['admin', 'hr', 'superadmin']),
  ImportExportController.getHistory
);

module.exports = router;