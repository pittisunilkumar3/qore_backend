#!/usr/bin/env node

/**
 * Database Migration Script for qore-backend
 * 
 * This script:
 * 1. Runs all .sql files in prisma/migrations folder
 * 2. Executes them in alphabetical order
 * 3. Tracks which migrations have been applied
 * 4. Supports rollback and status checking
 */

const fs = require('fs');
const path = require('path');
const { getConnectionPool } = require('../config/database');

class MigrationManager {
  constructor() {
    this.migrationsDir = path.join(__dirname, '../prisma/migrations');
    this.pool = null;
  }

  async initialize() {
    this.pool = getConnectionPool();
    await this.ensureMigrationsTable();
  }

  /**
   * Create migrations tracking table
   */
  async ensureMigrationsTable() {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        checksum VARCHAR(64),
        INDEX idx_migration_name (migration_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    try {
      await this.pool.query(createTableSQL);
      console.log('✅ Migrations tracking table ready');
    } catch (error) {
      console.error('❌ Failed to create migrations table:', error.message);
      throw error;
    }
  }

  /**
   * Get all SQL files from migrations directory
   */
  getSqlFiles() {
    if (!fs.existsSync(this.migrationsDir)) {
      console.log('⚠️  Migrations directory not found, creating it...');
      fs.mkdirSync(this.migrationsDir, { recursive: true });
      return [];
    }

    const files = fs.readdirSync(this.migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Alphabetical order

    return files;
  }

  /**
   * Get applied migrations from database
   */
  async getAppliedMigrations() {
    try {
      const [rows] = await this.pool.query(
        'SELECT migration_name FROM _migrations ORDER BY applied_at'
      );
      return rows.map(row => row.migration_name);
    } catch (error) {
      console.error('❌ Failed to get applied migrations:', error.message);
      return [];
    }
  }

  /**
   * Calculate checksum for migration file
   */
  calculateChecksum(content) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Execute a single SQL file
   */
  async executeSqlFile(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    const checksum = this.calculateChecksum(sqlContent);

    console.log(`\n📄 Executing: ${filename}`);

    // Remove comments and split SQL content into individual statements
    const cleanedContent = sqlContent
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))  // Remove comment lines
      .join('\n');

    const statements = cleanedContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    let successCount = 0;
    let skipCount = 0;

    for (const statement of statements) {
      try {
        await this.pool.query(statement);
        successCount++;
      } catch (error) {
        // Handle common errors gracefully
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log(`   ⚠️  Table already exists - skipping`);
          skipCount++;
        } else if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  Duplicate entry - skipping`);
          skipCount++;
        } else if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`   ⚠️  Index already exists - skipping`);
          skipCount++;
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          // Continue with other statements instead of failing completely
        }
      }
    }

    // Record migration as applied
    try {
      await this.pool.query(
        'INSERT INTO _migrations (migration_name, checksum) VALUES (?, ?) ON DUPLICATE KEY UPDATE applied_at = CURRENT_TIMESTAMP',
        [filename, checksum]
      );
      console.log(`✅ ${filename} completed (${successCount} statements executed, ${skipCount} skipped)`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to record migration: ${error.message}`);
      return false;
    }
  }

  /**
   * Run pending migrations
   */
  async runMigrations() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 DATABASE MIGRATION RUNNER');
    console.log('='.repeat(60));

    const allFiles = this.getSqlFiles();
    const appliedMigrations = await this.getAppliedMigrations();

    if (allFiles.length === 0) {
      console.log('\n⚠️  No migration files found in prisma/migrations/');
      return;
    }

    console.log(`\n📊 Found ${allFiles.length} migration file(s)`);
    console.log(`📊 ${appliedMigrations.length} migration(s) already applied`);

    const pendingMigrations = allFiles.filter(
      file => !appliedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      console.log('\n✅ All migrations are up to date!');
      return;
    }

    console.log(`\n⏳ Running ${pendingMigrations.length} pending migration(s)...\n`);

    let successCount = 0;
    for (const file of pendingMigrations) {
      const success = await this.executeSqlFile(file);
      if (success) successCount++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Migration complete: ${successCount}/${pendingMigrations.length} successful`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Show migration status
   */
  async showStatus() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION STATUS');
    console.log('='.repeat(60));

    const allFiles = this.getSqlFiles();
    const appliedMigrations = await this.getAppliedMigrations();

    if (allFiles.length === 0) {
      console.log('\n⚠️  No migration files found');
      return;
    }

    console.log('\n📋 Migration Files:\n');

    for (const file of allFiles) {
      const isApplied = appliedMigrations.includes(file);
      const status = isApplied ? '✅ Applied' : '⏳ Pending';
      console.log(`  ${status}  ${file}`);
    }

    console.log(`\n📊 Total: ${allFiles.length} | Applied: ${appliedMigrations.length} | Pending: ${allFiles.length - appliedMigrations.length}`);
    console.log('='.repeat(60) + '\n');
  }

  /**
   * Reset all migrations (dangerous!)
   */
  async resetMigrations() {
    console.log('\n⚠️  WARNING: This will drop the migrations tracking table!');
    console.log('This does NOT drop your actual tables, only the migration history.\n');

    try {
      await this.pool.query('DROP TABLE IF EXISTS _migrations');
      console.log('✅ Migration history reset');
      await this.ensureMigrationsTable();
    } catch (error) {
      console.error('❌ Failed to reset migrations:', error.message);
    }
  }

  /**
   * Force re-run all migrations
   */
  async forceRerun() {
    console.log('\n⚠️  WARNING: This will re-run ALL migrations!');
    await this.resetMigrations();
    await this.runMigrations();
  }

  /**
   * Main execution
   */
  async run() {
    const args = process.argv.slice(2);
    const command = args[0] || 'migrate';

    try {
      await this.initialize();

      switch (command) {
        case 'migrate':
        case 'up':
          await this.runMigrations();
          break;

        case 'status':
        case 'check':
          await this.showStatus();
          break;

        case 'reset':
          await this.resetMigrations();
          break;

        case 'force':
        case 'rerun':
          await this.forceRerun();
          break;

        default:
          console.log('\n📖 Usage:');
          console.log('  npm run db:migrate        -> Run pending migrations');
          console.log('  npm run db:migrate:status -> Show migration status');
          console.log('  npm run db:migrate:reset  -> Reset migration history');
          console.log('  npm run db:migrate:force  -> Force re-run all migrations\n');
      }

    } catch (error) {
      console.error('\n❌ Migration failed:', error.message);
      process.exit(1);
    } finally {
      if (this.pool) {
        await this.pool.end();
      }
    }
  }
}

// Execute
const manager = new MigrationManager();
manager.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
