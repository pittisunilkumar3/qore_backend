const express = require('express');
const RoleController = require('../controllers/RoleController');

const router = express.Router();

// GET /api/roles
router.get('/', RoleController.getAllRoles);

// GET /api/roles/active
router.get('/active', RoleController.getActiveRoles);

// GET /api/roles/:id
router.get('/:id', RoleController.getRoleById);

// POST /api/roles
router.post('/', RoleController.createRole);

// PUT /api/roles/:id
router.put('/:id', RoleController.updateRole);

// DELETE /api/roles/:id
router.delete('/:id', RoleController.deleteRole);

module.exports = router;