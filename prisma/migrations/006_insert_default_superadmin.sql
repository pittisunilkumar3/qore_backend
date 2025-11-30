-- Migration: Insert default super admin employee
-- Description: Creates a default super admin user with credentials
-- Default Credentials: 
--   Employee ID: ADMIN001
--   Email: admin@qore.com
--   Password: Admin@123

-- Insert default super admin employee
-- Password hash for "Admin@123" using bcrypt with 12 rounds
INSERT INTO `employees` (
  `employee_id`,
  `first_name`,
  `last_name`,
  `email`,
  `phone`,
  `password`,
  `position`,
  `hire_date`,
  `employment_status`,
  `is_superadmin`,
  `is_active`,
  `created_at`,
  `updated_at`
) VALUES (
  'ADMIN001',
  'Super',
  'Admin',
  'admin@qore.com',
  '1234567890',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWHNgm8i',
  'System Administrator',
  CURDATE(),
  'full-time',
  1,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON DUPLICATE KEY UPDATE 
  `updated_at` = CURRENT_TIMESTAMP;

-- Get the employee ID for the super admin
SET @super_admin_employee_id = (SELECT `id` FROM `employees` WHERE `employee_id` = 'ADMIN001' LIMIT 1);

-- Get the super admin role ID
SET @super_admin_role_id = (SELECT `id` FROM `roles` WHERE `slug` = 'super-admin' LIMIT 1);

-- Assign super admin role to the default super admin employee
INSERT INTO `employee_roles` (
  `employee_id`,
  `role_id`,
  `is_primary`,
  `is_active`,
  `created_at`,
  `updated_at`
)
SELECT 
  @super_admin_employee_id,
  @super_admin_role_id,
  1,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM DUAL
WHERE @super_admin_employee_id IS NOT NULL 
  AND @super_admin_role_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM `employee_roles` 
    WHERE `employee_id` = @super_admin_employee_id 
      AND `role_id` = @super_admin_role_id
  );
