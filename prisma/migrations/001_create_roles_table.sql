-- Migration: Create roles table
-- Description: Creates the roles table with system roles

-- Create roles table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `branch_id` INT(11) DEFAULT NULL,
  `is_system` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'System roles cannot be modified',
  `priority` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_by` INT(11) DEFAULT NULL,
  `updated_by` INT(11) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_slug_key` (`slug`),
  KEY `roles_branch_id_index` (`branch_id`),
  KEY `roles_is_system_index` (`is_system`),
  KEY `roles_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default system roles
INSERT INTO `roles` (`name`, `slug`, `description`, `is_system`, `priority`, `is_active`) VALUES
  ('Super Admin', 'super-admin', 'Full system access with all permissions', 1, 100, 1),
  ('Employees', 'employees', 'Standard employee access', 1, 90, 1)
ON DUPLICATE KEY UPDATE 
  `updated_at` = CURRENT_TIMESTAMP;
