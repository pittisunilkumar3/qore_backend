-- CreateRolesTable
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System roles cannot be modified',
  `priority` int(11) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_slug_key` (`slug`),
  KEY `roles_branch_id_index` (`branch_id`),
  KEY `roles_is_system_index` (`is_system`),
  KEY `roles_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drop and recreate table to ensure clean state
DROP TABLE IF EXISTS `roles`;

-- Create roles table with exact structure matching Prisma model
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `priority` int(11) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_slug_key` (`slug`),
  KEY `roles_branch_id_index` (`branch_id`),
  KEY `roles_is_system_index` (`is_system`),
  KEY `roles_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert only system roles: Super Admin and Employees
INSERT INTO `roles` (`name`, `slug`, `description`, `branch_id`, `is_system`, `priority`, `is_active`, `created_by`, `updated_by`) VALUES
('Super Admin', 'super-admin', 'Full system access with all privileges', NULL, 1, 100, 1, NULL, NULL),
('Employees', 'employees', 'Company employees with work-related privileges', NULL, 1, 90, 1, NULL, NULL);

