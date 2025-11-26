# 🚀 Database Migration System - Quick Guide

## ✅ What Was Fixed

Your migration system was only running `roles.sql`. Now it runs **ALL `.sql` files** in the `prisma/migrations/` folder in alphabetical order.

## 📁 Current Migration Files

1. `001_create_roles_table.sql` - Roles table with system roles
2. `002_create_employees_table.sql` - Employees table
3. `003_create_employee_roles_table.sql` - Employee-Role junction table
4. `004_create_activity_logs_table.sql` - Activity logging table
5. `005_create_refresh_tokens_table.sql` - JWT refresh tokens table
6. `roles.sql` - (Old file, can be deleted after migration)

## 🎯 How to Use

### Run All Pending Migrations
```bash
npm run migrate
# or
npm run db:migrate
```

### Check Migration Status
```bash
npm run db:migrate:status
```

### Reset Migration History (doesn't drop tables)
```bash
npm run db:migrate:reset
```

### Force Re-run All Migrations
```bash
npm run db:migrate:force
```

## ➕ Adding New Migrations

### Step 1: Create a new SQL file
Create a file in `prisma/migrations/` with a numbered prefix:

**Example:** `006_add_departments_table.sql`

```sql
-- Migration: Add departments table
-- Description: Creates departments table for organizational structure

CREATE TABLE IF NOT EXISTS `departments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `manager_id` INT(11) DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `departments_manager_id_index` (`manager_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Step 2: Run migrations
```bash
npm run migrate
```

That's it! The system will automatically:
- ✅ Detect the new file
- ✅ Execute it in order
- ✅ Track that it's been applied
- ✅ Skip it on future runs

## 🔍 Migration Tracking

The system creates a `_migrations` table to track:
- Which migrations have been applied
- When they were applied
- File checksums for integrity

## 📋 Best Practices

1. **Always use numbered prefixes** (001_, 002_, etc.) for proper ordering
2. **Use `IF NOT EXISTS`** in CREATE TABLE statements
3. **Never modify** already-applied migration files
4. **Test locally** before deploying
5. **Keep migrations small** and focused

## 🛠️ Troubleshooting

### Migration fails midway
- Check the error message
- Fix the SQL in the migration file
- Run `npm run migrate` again (already-applied statements are skipped)

### Need to start fresh
```bash
npm run db:migrate:reset  # Reset tracking
npm run db:migrate        # Re-run all
```

### Check what's been applied
```bash
npm run db:migrate:status
```

## 📊 Example Output

```
============================================================
🚀 DATABASE MIGRATION RUNNER
============================================================

📊 Found 6 migration file(s)
📊 0 migration(s) already applied

⏳ Running 6 pending migration(s)...

📄 Executing: 001_create_roles_table.sql
✅ 001_create_roles_table.sql completed (2 statements executed, 0 skipped)

📄 Executing: 002_create_employees_table.sql
✅ 002_create_employees_table.sql completed (1 statements executed, 0 skipped)

...

============================================================
✅ Migration complete: 6/6 successful
============================================================
```

## 🎉 Summary

- ✅ All SQL files in `prisma/migrations/` are now executed
- ✅ Migrations run in alphabetical order
- ✅ Each migration runs only once
- ✅ Easy to add new migrations
- ✅ Full tracking and status reporting

**Old behavior:** Only `roles.sql` was executed  
**New behavior:** ALL `.sql` files are executed in order

---

For more details, see `prisma/migrations/README.md`
