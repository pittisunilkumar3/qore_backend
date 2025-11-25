const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RoleModel {
  /**
   * Get all roles with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {number} params.branchId - Filter by branch ID
   * @param {boolean} params.isSystem - Filter by system role
   * @param {boolean} params.isActive - Filter by active status
   * @param {string} params.search - Search in name, slug, or description
   */
  static async getAllRoles({
    page = 1,
    limit = 10,
    branchId,
    isSystem,
    isActive,
    search
  }) {
    const pageNum = parseInt(page) || 1;
    const limitNum = Math.min(parseInt(limit) || 10, 100);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      deletedAt: null,
    };

    if (branchId) {
      where.branchId = parseInt(branchId);
    }

    if (isSystem !== undefined) {
      where.isSystem = isSystem === 'true' || isSystem === true;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.role.count({ where });
    const roles = await prisma.role.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
    });

    const totalPages = Math.ceil(total / limitNum);

    return {
      roles,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    };
  }

  /**
   * Get all active roles
   */
  static async getActiveRoles() {
    return await prisma.role.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
    });
  }

  /**
   * Get role by ID
   * @param {number} id - Role ID
   */
  static async getRoleById(id) {
    if (isNaN(id)) {
      throw new Error('Invalid role ID');
    }

    return await prisma.role.findUnique({
      where: { id },
    });
  }

  /**
   * Get role by slug
   * @param {string} slug - Role slug
   */
  static async getRoleBySlug(slug) {
    return await prisma.role.findUnique({
      where: { slug },
    });
  }

  /**
   * Create a new role
   * @param {Object} data - Role data
   */
  static async createRole(data) {
    const { name, slug, description, branchId, priority, isActive } = data;

    return await prisma.role.create({
      data: {
        name,
        slug,
        description,
        branchId: branchId ? parseInt(branchId) : null,
        priority: priority || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });
  }

  /**
   * Update a role
   * @param {number} id - Role ID
   * @param {Object} data - Update data
   */
  static async updateRole(id, data) {
    if (isNaN(id)) {
      throw new Error('Invalid role ID');
    }

    return await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        branchId: data.branchId ? parseInt(data.branchId) : undefined,
        priority: data.priority !== undefined ? data.priority : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
    });
  }

  /**
   * Soft delete a role (set deletedAt)
   * @param {number} id - Role ID
   */
  static async softDeleteRole(id) {
    if (isNaN(id)) {
      throw new Error('Invalid role ID');
    }

    return await prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Restore a soft deleted role
   * @param {number} id - Role ID
   */
  static async restoreRole(id) {
    if (isNaN(id)) {
      throw new Error('Invalid role ID');
    }

    return await prisma.role.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /**
   * Permanently delete a role
   * @param {number} id - Role ID
   */
  static async deleteRole(id) {
    if (isNaN(id)) {
      throw new Error('Invalid role ID');
    }

    return await prisma.role.delete({
      where: { id },
    });
  }
}

module.exports = RoleModel;