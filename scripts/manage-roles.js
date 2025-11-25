#!/usr/bin/env node

/**
 * Single Role Management Script for qore-backend
 * 
 * This script handles:
 * 1. Creating roles table from roles.sql
 * 2. Managing system roles
 * 3. Migration without subfolders
 * 4. Direct database operations
 */

const fs = require('fs');
const { getConnectionPool } = require('../config/database');

class RoleManager {
  constructor() {
    this.rolesPath = './prisma/migrations/roles.sql';
    this.systemRoles = [
      { name: 'Super Admin', slug: 'super-admin', description: 'Full system access', priority: 100 },
      { name: 'Employees', slug: 'employees', description: 'Company employees access', priority: 90 }
    ];
  }

  async ensureTableExists() {
    const pool = getConnectionPool();
    
    try {
      // Check if table exists and get existing roles count
      const [existing] = await pool.query('SHOW TABLES LIKE "roles"');
      if (existing.length > 0) {
        const [count] = await pool.query('SELECT COUNT(*) as total FROM roles');
        console.log(`📊 Existing table found: ${count[0].total} roles`);
        return pool;
      }
    } catch (e) {
      console.log('📋 Creating new roles table...');
    }
    
    // Create table from roles.sql or default
    if (fs.existsSync(this.rolesPath)) {
      await this.applySqlFile();
    } else {
      await this.createDefaultTable();
    }
    
    return pool;
  }

  async applySqlFile() {
    const pool = getConnectionPool();
    const sqlContent = fs.readFileSync(this.rolesPath, 'utf8');
    
    console.log('📖 Applying SQL from roles.sql...');
    
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      if (statement.toLowerCase().includes('create') || 
          statement.toLowerCase().includes('insert') ||
          statement.toLowerCase().includes('drop')) {
        try {
          await pool.query(statement);
          console.log('✅ SQL applied successfully');
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('⚠️  Table already exists - skipping');
          } else {
            console.log(`⚠️  Skipped: ${error.message}`);
          }
        }
      }
    }
  }

  async createDefaultTable() {
    const pool = getConnectionPool();
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        branch_id INT,
        is_system TINYINT(1) NOT NULL DEFAULT 0,
        priority INT DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_by INT,
        updated_by INT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL
      )
    `);

    console.log('📋 Table created successfully');
  }

  async applyRoles() {
    console.log('⭐ Adding system roles...');
    
    const pool = await this.ensureTableExists();
    
    // Add only system roles, skip if they exist
    for (const role of this.systemRoles) {
      await pool.query(`
        INSERT INTO roles (name, slug, description, is_system, priority, is_active)
        VALUES (?, ?, ?, 1, ?, 1)
        ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
      `, [role.name, role.slug, role.description, role.priority]);
    }
  }

  async resetRoles() {
    console.log('🧹 Resetting roles completely...');
    
    const pool = getConnectionPool();
    
    await pool.query('DROP TABLE IF EXISTS roles');
    await this.createDefaultTable();
    await this.applyRoles();
    
    console.log('✅ Roles reset with exactly 2 system roles');
  }

  async checkCurrentRoles() {
    const pool = getConnectionPool();
    
    try {
      const [roles] = await pool.query('SELECT name, slug, is_system, priority FROM roles ORDER BY priority DESC');
      
      console.log(`📊 Current roles: ${roles.length}`);
      roles.forEach(role => {
        console.log(`  ${role.name} (${role.slug})${role.is_system ? ' [SYSTEM]' : ''} - Priority: ${role.priority}`);
      });
      
    } catch (e) {
      console.log('📋 No roles table found');
    }
    
    await pool.end();
  }

  async run() {
    console.log('='.repeat(50));
    console.log('🎯 ROLE MANAGEMENT - SINGLE FILE SOLUTION');
    console.log('='.repeat(50));

    const args = process.argv.slice(2);
    const command = args[0] || 'apply';

    switch (command) {
      case 'check':
        await this.checkCurrentRoles();
        break;
      case 'reset':
        await this.resetRoles();
        break;
      case 'apply':
        await this.applyRoles();
        break;
      default:
        console.log('📖 Usage:');
        console.log('  node scripts/manage-roles.js apply    -> Apply/update roles');
        console.log('  node scripts/manage-roles.js reset   -> Reset all roles');
        console.log('  node scripts/manage-roles.js check   -> Check current roles');
    }

    console.log('='.repeat(50));
  }
}

// Execute based on command
new RoleManager().run();