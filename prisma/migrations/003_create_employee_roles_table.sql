-- Migration: Create employee_roles table
-- Description: Junction table linking employees to roles

CREATE TABLE IF NOT EXISTS `employee_roles` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) NOT NULL,
  `role_id` INT(11) NOT NULL,
  `branch_id` INT(11) DEFAULT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_by` INT(11) DEFAULT NULL,
  `updated_by` INT(11) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_roles_employee_id_index` (`employee_id`),
  KEY `employee_roles_role_id_index` (`role_id`),
  KEY `employee_roles_branch_id_index` (`branch_id`),
  KEY `employee_roles_is_primary_index` (`is_primary`),
  KEY `employee_roles_is_active_index` (`is_active`),
  CONSTRAINT `employee_roles_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employee_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
