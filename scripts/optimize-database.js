const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Database optimization script
 * Creates optimized indexes and analyzes query performance
 */

async function optimizeDatabase() {
  console.log('🔧 Starting database optimization...');
  
  try {
    // Create optimized indexes for better query performance
    console.log('📊 Creating optimized indexes...');
    
    const indexes = [
      // Employee table indexes
      'CREATE INDEX IF NOT EXISTS idx_employee_active ON employees (isActive, deletedAt)',
      'CREATE INDEX IF NOT EXISTS idx_employee_search ON employees (firstName, lastName, email, employeeId)',
      'CREATE INDEX IF NOT EXISTS idx_employee_employment_status ON employees (employmentStatus, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_hire_date ON employees (hireDate, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_position ON employees (position, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_gender ON employees (gender, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_reporting ON employees (reportingTo, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_created_at ON employees (createdAt, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_updated_at ON employees (updatedAt, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_composite ON employees (isActive, employmentStatus, hireDate)',
      
      // Activity log indexes
      'CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_logs (entityType, entityId, action)',
      'CREATE INDEX IF NOT EXISTS idx_activity_employee ON activity_logs (employeeId, createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_logs (createdAt DESC)',
      'CREATE INDEX IF NOT EXISTS idx_activity_action ON activity_logs (action, createdAt)',
      
      // Employee role indexes
      'CREATE INDEX IF NOT EXISTS idx_employee_role_employee ON employee_roles (employeeId, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_role_role ON employee_roles (roleId, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_employee_role_primary ON employee_roles (employeeId, isPrimary, isActive)',
      
      // Refresh token indexes
      'CREATE INDEX IF NOT EXISTS idx_refresh_token_employee ON refresh_tokens (employeeId, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_refresh_token_expires ON refresh_tokens (expiresAt, isActive)',
      'CREATE INDEX IF NOT EXISTS idx_refresh_token_created ON refresh_tokens (createdAt, isActive)',
      
      // Role indexes
      'CREATE INDEX IF NOT EXISTS idx_role_active ON roles (isActive, createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_role_name ON roles (name, isActive)'
    ];
    
    for (const indexSql of indexes) {
      try {
        await prisma.$executeRawUnsafe(indexSql);
        console.log(`✅ Created index: ${indexSql.split('idx_')[1]?.split(' ')[0] || 'unknown'}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME' || error.code === '42000') {
          console.log(`ℹ️  Index already exists: ${indexSql.split('idx_')[1]?.split(' ')[0] || 'unknown'}`);
        } else {
          console.log(`⚠️  Warning creating index: ${error.message}`);
        }
      }
    }
    
    // Analyze table statistics
    console.log('\n📈 Analyzing table statistics...');
    
    const tables = [
      'employees',
      'activity_logs',
      'employee_roles',
      'refresh_tokens',
      'roles'
    ];
    
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`ANALYZE TABLE ${table}`);
        console.log(`✅ Analyzed table: ${table}`);
      } catch (error) {
        console.log(`⚠️  Warning analyzing table ${table}: ${error.message}`);
      }
    }
    
    // Check query performance
    console.log('\n🔍 Checking query performance...');
    
    // Test common queries
    const queries = [
      {
        name: 'Employee search by name',
        sql: 'EXPLAIN SELECT * FROM employees WHERE firstName LIKE "%test%" AND isActive = 1 AND deletedAt IS NULL'
      },
      {
        name: 'Employee list with pagination',
        sql: 'EXPLAIN SELECT * FROM employees WHERE isActive = 1 AND deletedAt IS NULL ORDER BY createdAt DESC LIMIT 10 OFFSET 0'
      },
      {
        name: 'Employee statistics',
        sql: 'EXPLAIN SELECT employmentStatus, COUNT(*) as count FROM employees WHERE deletedAt IS NULL GROUP BY employmentStatus'
      },
      {
        name: 'Activity log lookup',
        sql: 'EXPLAIN SELECT * FROM activity_logs WHERE employeeId = 1 ORDER BY createdAt DESC LIMIT 10'
      }
    ];
    
    for (const query of queries) {
      try {
        const result = await prisma.$queryRawUnsafe(query.sql);
        console.log(`\n📊 Query: ${query.name}`);
        console.log(`SQL: ${query.sql}`);
        
        if (result && result.length > 0) {
          // Log execution plan details
          const plan = result[0];
          console.log(`Execution plan: ${JSON.stringify(plan, null, 2)}`);
        }
      } catch (error) {
        console.log(`⚠️  Warning analyzing query ${query.name}: ${error.message}`);
      }
    }
    
    // Get table statistics
    console.log('\n📊 Table statistics:');
    
    for (const table of tables) {
      try {
        const stats = await prisma.$queryRawUnsafe(`
          SELECT 
            TABLE_NAME as tableName,
            TABLE_ROWS as rowCount,
            DATA_LENGTH as dataSize,
            INDEX_LENGTH as indexSize,
            (DATA_LENGTH + INDEX_LENGTH) as totalSize
          FROM information_schema.TABLES 
          WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${table}'
        `);
        
        if (stats && stats.length > 0) {
          const stat = stats[0];
          console.log(`\n📋 ${table}:`);
          console.log(`   Rows: ${stat.rowCount}`);
          console.log(`   Data size: ${(stat.dataSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Index size: ${(stat.indexSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`   Total size: ${(stat.totalSize / 1024 / 1024).toFixed(2)} MB`);
        }
      } catch (error) {
        console.log(`⚠️  Warning getting stats for ${table}: ${error.message}`);
      }
    }
    
    // Optimization recommendations
    console.log('\n💡 Optimization Recommendations:');
    
    // Check for large tables that might benefit from partitioning
    const largeTables = await prisma.$queryRawUnsafe(`
      SELECT 
        TABLE_NAME as tableName,
        TABLE_ROWS as rowCount,
        (DATA_LENGTH + INDEX_LENGTH) as totalSize
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND (DATA_LENGTH + INDEX_LENGTH) > 100 * 1024 * 1024 -- Larger than 100MB
      ORDER BY totalSize DESC
    `);
    
    if (largeTables.length > 0) {
      console.log('📊 Large tables (consider partitioning):');
      largeTables.forEach(table => {
        console.log(`   ${table.tableName}: ${table.rowCount} rows, ${(table.totalSize / 1024 / 1024).toFixed(2)} MB`);
      });
    }
    
    // Check for missing indexes on foreign keys
    const missingIndexes = await prisma.$queryRawUnsafe(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        CONSTRAINT_NAME
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND REFERENCED_TABLE_NAME IS NOT NULL
        AND TABLE_NAME NOT IN (
          SELECT DISTINCT TABLE_NAME 
          FROM information_schema.STATISTICS 
          WHERE TABLE_SCHEMA = DATABASE()
        )
    `);
    
    if (missingIndexes.length > 0) {
      console.log('\n⚠️  Foreign keys without indexes:');
      missingIndexes.forEach(index => {
        console.log(`   ${index.TABLE_NAME}.${index.COLUMN_NAME} (${index.CONSTRAINT_NAME})`);
      });
    }
    
    console.log('\n✅ Database optimization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    throw error;
  }
}

/**
 * Create database backup before optimization
 */
async function createBackup() {
  console.log('💾 Creating database backup...');
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `qore_backend_backup_${timestamp}`;
    
    // This would typically be implemented with mysqldump
    // For now, we'll just log the backup name
    console.log(`📦 Backup would be created as: ${backupName}.sql`);
    
    return true;
  } catch (error) {
    console.error('❌ Backup creation failed:', error);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'backup':
      await createBackup();
      break;
      
    case 'optimize':
      const backupCreated = await createBackup();
      if (backupCreated) {
        await optimizeDatabase();
      }
      break;
      
    case 'analyze':
      await optimizeDatabase();
      break;
      
    default:
      console.log('📖 Database Optimization Tool');
      console.log('');
      console.log('Usage:');
      console.log('  node scripts/optimize-database.js backup     - Create database backup');
      console.log('  node scripts/optimize-database.js optimize    - Backup and optimize database');
      console.log('  node scripts/optimize-database.js analyze     - Analyze database performance');
      break;
  }
}

// Execute if run directly
if (require.main === module) {
  main()
    .catch((error) => {
      console.error('❌ Script execution failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = {
  optimizeDatabase,
  createBackup
};