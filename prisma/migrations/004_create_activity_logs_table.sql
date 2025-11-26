-- Migration: Create activity_logs table
-- Description: Tracks all user activities and changes in the system

CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `employee_id` INT(11) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT(11) DEFAULT NULL,
  `old_value` TEXT DEFAULT NULL,
  `new_value` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_by` INT(11) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `activity_logs_employee_id_index` (`employee_id`),
  KEY `activity_logs_action_index` (`action`),
  KEY `activity_logs_entity_type_index` (`entity_type`),
  KEY `activity_logs_entity_id_index` (`entity_id`),
  KEY `activity_logs_created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
