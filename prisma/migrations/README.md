# Database Migrations

This folder contains SQL migration files that are automatically executed by the migration runner.

## How It Works

1. **All `.sql` files** in this folder are executed in **alphabetical order**
2. The system tracks which migrations have been applied in the `_migrations` table
3. Only pending migrations are executed on each run
4. Each migration is executed only once (unless forced)

## Naming Convention

Use a timestamp or sequential number prefix to ensure correct execution order:

```
001_create_roles_table.sql
002_create_users_table.sql
003_create_permissions_table.sql
2024_11_26_create_branches_table.sql
```

## Migration Commands

### Run Pending Migrations
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

## Creating New Migrations

1. Create a new `.sql` file in this folder
2. Use a descriptive name with a prefix for ordering
3. Write your SQL statements (CREATE TABLE, ALTER TABLE, etc.)
4. Run `npm run migrate` to apply

### Example Migration File

**File:** `004_create_departments_table.sql`

```sql
-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some initial data
INSERT INTO departments (name, description) VALUES
  ('Engineering', 'Software development team'),
  ('Sales', 'Sales and marketing team');
```

## Best Practices

1. **Always use `IF NOT EXISTS`** for CREATE TABLE statements
2. **Test migrations locally** before deploying
3. **Keep migrations small** and focused on one change
4. **Never modify** an already-applied migration file
5. **Use transactions** when possible for complex migrations
6. **Add comments** to explain what the migration does

## Migration Tracking

The system automatically creates a `_migrations` table to track:
- Migration filename
- When it was applied
- Checksum of the file content

## Troubleshooting

### Migration fails midway
- Check the error message in the console
- Fix the SQL syntax in the migration file
- Run `npm run db:migrate` again (already-applied statements will be skipped)

### Need to re-run a migration
```bash
npm run db:migrate:reset  # Reset tracking
npm run db:migrate        # Re-run all migrations
```

### Check what's been applied
```bash
npm run db:migrate:status
```

## Current Migrations

- `roles.sql` - Creates the roles table and system roles
