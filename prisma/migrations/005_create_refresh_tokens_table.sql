-- Migration: Create refresh_tokens table
-- Description: Stores JWT refresh tokens for authentication

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL,
  `employee_id` INT(11) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_revoked` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_key` (`token`),
  KEY `refresh_tokens_employee_id_index` (`employee_id`),
  KEY `refresh_tokens_expires_at_index` (`expires_at`),
  KEY `refresh_tokens_is_revoked_index` (`is_revoked`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
