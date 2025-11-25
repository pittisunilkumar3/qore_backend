const RoleModel = require('../models/Role');

class RoleController {
  /**
   * Get all roles
   * GET /api/roles
   */
  static async getAllRoles(req, res) {
    try {
      const {
        page,
        limit,
        branchId,
        isSystem,
        isActive,
        search
      } = req.query;

      const result = await RoleModel.getAllRoles({
        page,
        limit,
        branchId,
        isSystem,
        isActive,
        search
      });

      res.json({
        success: true,
        data: result.roles,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Get active roles
   * GET /api/roles/active
   */
  static async getActiveRoles(req, res) {
    try {
      const roles = await RoleModel.getActiveRoles();

      res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Get role by ID
   * GET /api/roles/:id
   */
  static async getRoleById(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role ID',
        });
      }

      const role = await RoleModel.getRoleById(id);

      if (!role) {
        return res.status(404).json({
          success: false,
          error: 'Role not found',
        });
      }

      res.json({
        success: true,
        data: role,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Create a new role
   * POST /api/roles
   */
  static async createRole(req, res) {
    try {
      const { name, slug, description, branchId, priority, isActive } = req.body;

      // Validation
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          error: 'Name and slug are required',
        });
      }

      // Check if slug already exists
      const existingRole = await RoleModel.getRoleBySlug(slug);
      if (existingRole) {
        return res.status(400).json({
          success: false,
          error: 'Role with this slug already exists',
        });
      }

      const role = await RoleModel.createRole({
        name,
        slug,
        description,
        branchId,
        priority,
        isActive
      });

      res.status(201).json({
        success: true,
        data: role,
        message: 'Role created successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Update a role
   * PUT /api/roles/:id
   */
  static async updateRole(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role ID',
        });
      }

      const { name, slug, description, branchId, priority, isActive } = req.body;

      // Check if role exists
      const existingRole = await RoleModel.getRoleById(id);
      if (!existingRole) {
        return res.status(404).json({
          success: false,
          error: 'Role not found',
        });
      }

      // Check if role is system and trying to modify critical fields
      if (existingRole.isSystem && (name !== undefined || slug !== undefined)) {
        return res.status(400).json({
          success: false,
          error: 'System roles cannot be modified',
        });
      }

      // Check if slug already exists (if updating slug)
      if (slug && slug !== existingRole.slug) {
        const slugExists = await RoleModel.getRoleBySlug(slug);
        if (slugExists) {
          return res.status(400).json({
            success: false,
            error: 'Role with this slug already exists',
          });
        }
      }

      const role = await RoleModel.updateRole(id, {
        name,
        slug,
        description,
        branchId,
        priority,
        isActive
      });

      res.json({
        success: true,
        data: role,
        message: 'Role updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Delete a role (soft delete)
   * DELETE /api/roles/:id
   */
  static async deleteRole(req, res) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role ID',
        });
      }

      // Check if role exists
      const existingRole = await RoleModel.getRoleById(id);
      if (!existingRole) {
        return res.status(404).json({
          success: false,
          error: 'Role not found',
        });
      }

      // Check if role is system
      if (existingRole.isSystem) {
        return res.status(400).json({
          success: false,
          error: 'System roles cannot be deleted',
        });
      }

      await RoleModel.softDeleteRole(id);

      res.json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }
}

module.exports = RoleController;