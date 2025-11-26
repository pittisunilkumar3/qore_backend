-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2025 at 06:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `talenspark`
--

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `landmark` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alt_phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fax` varchar(50) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lng` decimal(11,8) DEFAULT NULL,
  `google_maps_url` text DEFAULT NULL,
  `working_hours` varchar(100) DEFAULT NULL,
  `timezone` varchar(100) DEFAULT NULL,
  `logo_url` text DEFAULT NULL,
  `website_url` varchar(200) DEFAULT NULL,
  `support_email` varchar(100) DEFAULT NULL,
  `support_phone` varchar(20) DEFAULT NULL,
  `branch_type` enum('head_office','regional','franchise','warehouse') DEFAULT 'regional',
  `opening_date` date DEFAULT NULL,
  `last_renovated` date DEFAULT NULL,
  `monthly_rent` decimal(10,2) DEFAULT NULL,
  `owned_or_rented` enum('owned','rented') DEFAULT 'owned',
  `no_of_employees` int(11) DEFAULT 0,
  `fire_safety_certified` tinyint(1) DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `code`, `slug`, `address`, `landmark`, `city`, `district`, `state`, `country`, `postal_code`, `phone`, `alt_phone`, `email`, `fax`, `manager_id`, `description`, `location_lat`, `location_lng`, `google_maps_url`, `working_hours`, `timezone`, `logo_url`, `website_url`, `support_email`, `support_phone`, `branch_type`, `opening_date`, `last_renovated`, `monthly_rent`, `owned_or_rented`, `no_of_employees`, `fire_safety_certified`, `is_default`, `is_active`, `created_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Head Office', 'HO-001', 'head-office', '123 Main Street, Suite 500', 'Near Central Park', 'New York', 'Manhattan', 'New York', 'USA', '10001', '+1-212-555-1234', '+1-212-555-5678', 'info@talentspark.com', '+1-212-555-9876', 1, 'Our main headquarters in New York City', 40.71280000, -74.00600000, 'https://goo.gl/maps/example1', 'Mon-Fri: 9:00 AM - 6:00 PM', 'America/New_York', 'https://example.com/logos/head-office.png', 'https://talentspark.com', 'support@talentspark.com', '+1-800-555-1234', 'head_office', '2010-01-15', '2020-06-30', 15000.00, 'owned', 120, 1, 1, 1, 1, '2025-05-30 15:01:24', '2025-05-30 15:01:24', NULL),
(2, 'West Coast Regional Office', 'WC-001', 'west-coast-regional', '456 Tech Blvd, Floor 3', 'Silicon Valley Tech Park', 'San Francisco', 'Bay Area', 'California', 'USA', '94105', '+1-415-555-2345', '+1-415-555-6789', 'sf@talentspark.com', '+1-415-555-9876', 2, 'Our West Coast regional office serving tech clients', 37.77490000, -122.41940000, 'https://goo.gl/maps/example2', 'Mon-Fri: 8:30 AM - 5:30 PM', 'America/Los_Angeles', 'https://example.com/logos/west-coast.png', 'https://sf.talentspark.com', 'sf-support@talentspark.com', '+1-800-555-2345', 'regional', '2015-03-20', '2021-02-15', 12000.00, 'rented', 75, 1, 0, 1, 1, '2025-05-30 15:01:24', '2025-05-30 15:01:24', NULL),
(3, 'Chicago Franchise', 'CF-001', 'chicago-franchise', '789 Windy Ave, Suite 200', 'Near Millennium Park', 'Chicago', 'Downtown', 'Illinois', 'USA', '60601', '+1-312-555-3456', '+1-312-555-7890', 'chicago@talentspark.com', '+1-312-555-9876', 3, 'Our franchise location in Chicago', 41.87810000, -87.62980000, 'https://goo.gl/maps/example3', 'Mon-Fri: 9:00 AM - 5:00 PM', 'America/Chicago', 'https://example.com/logos/chicago.png', 'https://chicago.talentspark.com', 'chicago-support@talentspark.com', '+1-800-555-3456', 'franchise', '2018-07-10', NULL, 8000.00, 'rented', 30, 1, 0, 1, 1, '2025-05-30 15:01:24', '2025-05-30 15:01:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `short_code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `branch_id`, `short_code`, `description`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Human Resources', 1, 'HR', 'Human Resources department for employee management', 1, 1, '2025-05-30 15:01:28', '2025-05-30 15:01:28'),
(2, 'Finance', 1, 'FIN', 'Finance department for financial management', 1, 1, '2025-05-30 15:01:28', '2025-05-30 15:01:28'),
(3, 'Information Technology', 1, 'IT', 'IT department for technology management', 1, 1, '2025-05-30 15:01:28', '2025-05-30 15:01:28'),
(4, 'Marketing', 1, 'MKT', 'Marketing department for brand management', 1, 1, '2025-05-30 15:01:28', '2025-05-30 15:01:28'),
(5, 'Operations', 1, 'OPS', 'Operations department for day-to-day operations', 1, 1, '2025-05-30 15:01:28', '2025-05-30 15:01:28');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `short_code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `name`, `branch_id`, `short_code`, `description`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'CEO', 1, 'CEO', 'Chief Executive Officer', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(2, 'CTO', 1, 'CTO', 'Chief Technology Officer', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(3, 'HR Manager', 1, 'HRM', 'Human Resources Manager', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(4, 'Software Engineer', 1, 'SE', 'Software Engineer', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(5, 'Senior Software Engineer', 1, 'SSE', 'Senior Software Engineer', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(6, 'Project Manager', 1, 'PM', 'Project Manager', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30'),
(7, 'Accountant', 1, 'ACC', 'Accountant', 1, 1, '2025-05-30 15:01:30', '2025-05-30 15:01:30');

-- --------------------------------------------------------

--
-- Table structure for table `email_configs`
--

CREATE TABLE `email_configs` (
  `id` int(10) UNSIGNED NOT NULL,
  `email_type` varchar(100) DEFAULT NULL COMMENT 'Type: SMTP, API, etc.',
  `smtp_server` varchar(100) DEFAULT NULL,
  `smtp_port` int(11) DEFAULT NULL,
  `smtp_username` varchar(100) DEFAULT NULL,
  `smtp_password` varchar(255) DEFAULT NULL,
  `ssl_tls` enum('none','ssl','tls') DEFAULT 'tls',
  `smtp_auth` tinyint(1) NOT NULL DEFAULT 1,
  `api_key` varchar(255) DEFAULT NULL,
  `api_secret` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `from_email` varchar(255) DEFAULT NULL,
  `from_name` varchar(100) DEFAULT NULL,
  `reply_to_email` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int(10) UNSIGNED NOT NULL,
  `template_code` varchar(50) NOT NULL COMMENT 'Unique template identifier code',
  `name` varchar(100) NOT NULL COMMENT 'Template name',
  `subject` varchar(255) NOT NULL COMMENT 'Email subject line',
  `body_html` longtext NOT NULL COMMENT 'HTML content of the email',
  `body_text` text DEFAULT NULL COMMENT 'Plain text version of email',
  `variables` varchar(255) DEFAULT NULL COMMENT 'Available variables, comma separated',
  `email_type` varchar(50) NOT NULL DEFAULT 'transactional' COMMENT 'Email category/type',
  `description` text DEFAULT NULL COMMENT 'Template description and usage notes',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether template is active',
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System template (cannot be deleted)',
  `from_name` varchar(100) DEFAULT NULL COMMENT 'Custom sender name (optional)',
  `from_email` varchar(255) DEFAULT NULL COMMENT 'Custom sender email (optional)',
  `reply_to` varchar(255) DEFAULT NULL COMMENT 'Reply-to email address',
  `cc` varchar(255) DEFAULT NULL COMMENT 'CC recipients',
  `bcc` varchar(255) DEFAULT NULL COMMENT 'BCC recipients',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(50) NOT NULL COMMENT 'Employee ID',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL COMMENT 'Hashed password',
  `gender` enum('male','female','other') DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `designation_id` int(11) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `qualification` varchar(200) DEFAULT NULL,
  `work_experience` varchar(200) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `date_of_leaving` date DEFAULT NULL,
  `employment_status` enum('full-time','part-time','contract','intern','terminated') DEFAULT 'full-time',
  `contract_type` varchar(20) DEFAULT NULL,
  `work_shift` varchar(50) DEFAULT NULL,
  `current_location` varchar(100) DEFAULT NULL,
  `reporting_to` int(11) DEFAULT NULL,
  `emergency_contact` varchar(20) DEFAULT NULL,
  `emergency_contact_relation` varchar(50) DEFAULT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `local_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `bank_account_name` varchar(100) DEFAULT NULL,
  `bank_account_no` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `bank_branch` varchar(100) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `resume` varchar(255) DEFAULT NULL,
  `joining_letter` varchar(255) DEFAULT NULL,
  `other_documents` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_superadmin` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Superadmin has access to all branches',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `employee_id`, `first_name`, `last_name`, `email`, `phone`, `password`, `gender`, `dob`, `photo`, `branch_id`, `department_id`, `designation_id`, `position`, `qualification`, `work_experience`, `hire_date`, `date_of_leaving`, `employment_status`, `contract_type`, `work_shift`, `current_location`, `reporting_to`, `emergency_contact`, `emergency_contact_relation`, `marital_status`, `father_name`, `mother_name`, `local_address`, `permanent_address`, `bank_account_name`, `bank_account_no`, `bank_name`, `bank_branch`, `ifsc_code`, `basic_salary`, `facebook`, `twitter`, `linkedin`, `instagram`, `resume`, `joining_letter`, `other_documents`, `notes`, `is_superadmin`, `is_active`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'EMP001', 'Admin', 'User', 'admin@talentspark.com', '+1-123-456-7890', '$2b$10$E0XWR56ny6s.vw8vtgzmfO19BCqKZN4BYye/hS/W8/jy1HjWn8BZO', 'male', '1985-01-15', NULL, 1, 1, 2, 'Admin', NULL, NULL, '2020-01-01', NULL, 'full-time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, '2025-05-30 15:01:32', '2025-05-30 15:01:32'),
(5, 'EMP004', 'John', 'Doe', 'john.doe@example.com', '+1-234-567-8900', '$2b$10$yfRwpYyBj6fPrkFiub/oEejvbV3759GUuMnHc1Bm/zfIvcxKHWTCa', NULL, NULL, NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL, 'full-time', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, NULL, '2025-11-18 05:44:06', '2025-11-18 05:44:06');

-- --------------------------------------------------------

--
-- Table structure for table `employee_interview_calendar_events`
--

CREATE TABLE `employee_interview_calendar_events` (
  `id` int(10) UNSIGNED NOT NULL,
  `interview_id` int(10) UNSIGNED NOT NULL COMMENT 'Related employee interview',
  `calendar_type` enum('google','outlook','ical','other') NOT NULL COMMENT 'Calendar provider',
  `event_id` varchar(255) NOT NULL COMMENT 'Event ID in external calendar',
  `organizer_id` int(11) DEFAULT NULL COMMENT 'User who created calendar event',
  `event_url` varchar(255) DEFAULT NULL COMMENT 'URL to calendar event',
  `sync_status` enum('synced','out_of_sync','failed') NOT NULL DEFAULT 'synced' COMMENT 'Calendar sync status',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether calendar event is active in the system',
  `last_synced_at` datetime DEFAULT NULL COMMENT 'Last successful sync time',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Created by BollineniRohith123 on 2025-05-12 05:57:49';

-- --------------------------------------------------------

--
-- Table structure for table `employee_interview_schedules`
--

CREATE TABLE `employee_interview_schedules` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(11) NOT NULL COMMENT 'Related employee',
  `job_id` int(10) UNSIGNED NOT NULL COMMENT 'Job position',
  `title` varchar(255) NOT NULL COMMENT 'Interview title/purpose',
  `round` int(11) NOT NULL DEFAULT 1 COMMENT 'Interview round number',
  `interview_type` enum('performance_review','promotion','disciplinary','one_on_one','team_review','exit','training','mentorship','project_review','hr_meeting') NOT NULL COMMENT 'Type of interview',
  `scheduled_date` date NOT NULL COMMENT 'Interview date',
  `start_time` time NOT NULL COMMENT 'Start time',
  `end_time` time NOT NULL COMMENT 'End time',
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC' COMMENT 'Interview timezone',
  `is_virtual` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Virtual or in-person',
  `location` varchar(255) DEFAULT NULL COMMENT 'Physical location if in-person',
  `meeting_link` varchar(255) DEFAULT NULL COMMENT 'Virtual meeting URL',
  `meeting_id` varchar(100) DEFAULT NULL COMMENT 'Virtual meeting ID',
  `meeting_password` varchar(100) DEFAULT NULL COMMENT 'Meeting password/pin',
  `meeting_provider` varchar(50) DEFAULT NULL COMMENT 'Provider (Zoom, Teams, etc.)',
  `status` enum('scheduled','confirmed','rescheduled','completed','canceled','no_show') NOT NULL DEFAULT 'scheduled' COMMENT 'Current status',
  `employee_confirmed` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Employee confirmed attendance',
  `confirmation_date` datetime DEFAULT NULL COMMENT 'When employee confirmed',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether interview is active in the system',
  `preparation_instructions` text DEFAULT NULL COMMENT 'Instructions for employee',
  `interviewer_instructions` text DEFAULT NULL COMMENT 'Instructions for interviewers',
  `assessment_criteria` text DEFAULT NULL COMMENT 'Criteria to evaluate',
  `notes` text DEFAULT NULL COMMENT 'General notes',
  `decision` enum('pending','positive','negative','action_required','follow_up_needed','no_decision') NOT NULL DEFAULT 'pending' COMMENT 'Final decision',
  `decision_reason` text DEFAULT NULL COMMENT 'Reasoning for decision',
  `next_steps` text DEFAULT NULL COMMENT 'Next steps if any',
  `reminder_sent` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Reminder has been sent',
  `reminder_sent_at` datetime DEFAULT NULL COMMENT 'When reminder was sent',
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the interview',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the interview',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Updated timestamp',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp',
  `duration_minutes` int(11) GENERATED ALWAYS AS (timestampdiff(MINUTE,concat(`scheduled_date`,' ',`start_time`),concat(`scheduled_date`,' ',`end_time`))) STORED COMMENT 'Duration in minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Created by BollineniRohith123 on 2025-05-12 03:47:23';

--
-- Dumping data for table `employee_interview_schedules`
--

INSERT INTO `employee_interview_schedules` (`id`, `employee_id`, `job_id`, `title`, `round`, `interview_type`, `scheduled_date`, `start_time`, `end_time`, `timezone`, `is_virtual`, `location`, `meeting_link`, `meeting_id`, `meeting_password`, `meeting_provider`, `status`, `employee_confirmed`, `confirmation_date`, `is_active`, `preparation_instructions`, `interviewer_instructions`, `assessment_criteria`, `notes`, `decision`, `decision_reason`, `next_steps`, `reminder_sent`, `reminder_sent_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 3, 1, 'Q2 Performance Review', 1, 'performance_review', '2025-06-15', '10:00:00', '11:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/123456789', '123456789', '123456', 'Zoom', 'scheduled', 0, NULL, 1, 'Please prepare a summary of your Q2 achievements and challenges.', 'Focus on performance metrics and growth areas.', 'Project delivery, code quality, teamwork, communication.', 'This is a regular quarterly performance review.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:46', '2025-05-30 15:01:46', NULL),
(2, 2, 1, 'Senior Manager Promotion Interview', 1, 'promotion', '2025-06-20', '14:00:00', '15:30:00', 'America/New_York', 0, 'Conference Room A, Head Office', NULL, NULL, NULL, NULL, 'scheduled', 1, '2025-06-10 00:00:00', 1, 'Please prepare a presentation on your vision for the department.', 'Evaluate leadership skills and strategic thinking.', 'Leadership, strategic vision, team management, business acumen.', 'Potential promotion to Senior Manager position.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:46', '2025-05-30 15:01:46', NULL),
(3, 3, 1, 'New Accounting Software Training', 1, 'training', '2025-07-05', '09:00:00', '12:00:00', 'America/New_York', 1, NULL, 'https://teams.microsoft.com/l/meetup-join/123456789', '987654321', 'training123', 'Microsoft Teams', 'scheduled', 0, NULL, 1, 'Please review the training materials sent via email.', 'Cover all modules of the new accounting software.', 'Understanding of software features, ability to perform basic tasks.', 'Training session for the new accounting software being implemented.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:46', '2025-05-30 15:01:46', NULL),
(4, 2, 1, 'Project Management Skills Assessment', 1, 'one_on_one', '2025-05-10', '11:00:00', '12:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/987654321', '987654321', '654321', 'Zoom', 'completed', 1, '2025-05-05 00:00:00', 1, 'Please bring examples of projects you have managed.', 'Assess project management methodologies and experience.', 'Project planning, resource allocation, risk management, stakeholder communication.', 'Assessment for potential assignment to the new product launch project.', 'positive', 'Demonstrated excellent project management skills and experience.', 'Assign to the new product launch project as Project Lead.', 1, '2025-05-09 04:30:00', 1, NULL, '2025-05-01 00:00:00', '2025-05-11 00:00:00', NULL),
(5, 3, 1, 'Budget Planning Discussion', 1, 'one_on_one', '2025-05-20', '15:00:00', '16:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/111222333', '111222333', '123123', 'Zoom', 'canceled', 1, '2025-05-15 00:00:00', 0, 'Please prepare Q3 budget projections.', 'Review budget allocations and discuss potential adjustments.', 'Budget accuracy, financial planning, cost management.', 'Quarterly budget planning meeting.', 'no_decision', 'Meeting canceled due to scheduling conflict.', 'Reschedule for next week.', 1, '2025-05-19 09:30:00', 1, NULL, '2025-05-10 00:00:00', '2025-05-19 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_interview_screenings`
--

CREATE TABLE `employee_interview_screenings` (
  `id` int(11) NOT NULL COMMENT 'Unique identifier for the screening record',
  `callid` varchar(100) DEFAULT NULL COMMENT 'Unique call identifier for the screening session',
  `userid` varchar(100) DEFAULT NULL COMMENT 'User identifier for the screening participant',
  `joinurl` text DEFAULT NULL COMMENT 'URL for joining the screening session',
  `created` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Timestamp when the record was created',
  `updated` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Timestamp when the record was last updated',
  `job_id` int(11) DEFAULT NULL COMMENT 'Reference to the job this screening is associated with',
  `status` enum('pending','in_progress','completed','cancelled','no_show') NOT NULL DEFAULT 'pending' COMMENT 'Current status of the interview screening'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_interview_screenings`
--

INSERT INTO `employee_interview_screenings` (`id`, `callid`, `userid`, `joinurl`, `created`, `updated`, `job_id`, `status`) VALUES
(8, '', '2', '', '2025-06-02 14:09:36', '2025-06-19 09:35:22', 6, 'pending'),
(9, '18632157-fa19-42f4-94f4-b8e0f026cb63', '3', 'wss://prod-voice-pgaenaxiea-uc.a.run.app/calls/18632157-fa19-42f4-94f4-b8e0f026cb63', '2025-06-03 16:26:21', '2025-06-03 16:27:24', 6, 'completed'),
(10, '7d808ba9-be0d-43b1-8bca-2dcbb6eac83b', '2', 'wss://prod-voice-pgaenaxiea-uc.a.run.app/calls/7d808ba9-be0d-43b1-8bca-2dcbb6eac83b', '2025-06-10 08:12:50', '2025-06-15 07:05:48', 4, 'completed'),
(11, '', '2', '', '2025-09-21 10:30:13', '2025-09-21 10:30:13', 7, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `employee_roles`
--

CREATE TABLE `employee_roles` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `branch_id` int(11) DEFAULT NULL COMMENT 'If role is limited to specific branch',
  `is_primary` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Primary role for this employee',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_roles`
--

INSERT INTO `employee_roles` (`id`, `employee_id`, `role_id`, `branch_id`, `is_primary`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:39', '2025-05-30 15:01:39', NULL),
(2, 2, 3, 1, 1, 1, 1, NULL, '2025-05-30 15:01:39', '2025-05-31 00:38:57', NULL),
(3, 3, 3, 2, 1, 1, 1, NULL, '2025-05-30 15:01:39', '2025-05-30 15:01:39', NULL),
(4, 3, 4, 2, 0, 1, 1, NULL, '2025-05-30 15:01:39', '2025-05-30 15:01:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employee_skills`
--

CREATE TABLE `employee_skills` (
  `id` int(10) UNSIGNED NOT NULL,
  `employee_id` int(10) UNSIGNED NOT NULL COMMENT 'Foreign key to employees table',
  `skill_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON containing skill information' CHECK (json_valid(`skill_data`)),
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the record',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the record',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation time',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record update time',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `general_settings`
--

CREATE TABLE `general_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_name` varchar(100) DEFAULT NULL COMMENT 'Legal company name',
  `tagline` varchar(200) DEFAULT NULL COMMENT 'Company slogan or tagline',
  `email` varchar(100) DEFAULT NULL COMMENT 'Primary email address',
  `phone` varchar(50) DEFAULT NULL COMMENT 'Primary phone number',
  `address` text DEFAULT NULL COMMENT 'Company address',
  `city` varchar(100) DEFAULT NULL COMMENT 'Company city',
  `state` varchar(100) DEFAULT NULL COMMENT 'Company state/province',
  `country` varchar(100) DEFAULT NULL COMMENT 'Company country',
  `zip_code` varchar(20) DEFAULT NULL COMMENT 'Postal/zip code',
  `registration_number` varchar(50) DEFAULT NULL COMMENT 'Business registration number',
  `tax_id` varchar(50) DEFAULT NULL COMMENT 'Tax identification number',
  `date_format` varchar(50) NOT NULL DEFAULT 'Y-m-d' COMMENT 'PHP date format string',
  `time_format` varchar(50) NOT NULL DEFAULT 'H:i:s' COMMENT 'PHP time format string',
  `timezone` varchar(50) DEFAULT 'UTC' COMMENT 'System timezone',
  `currency` varchar(50) NOT NULL DEFAULT 'USD' COMMENT 'Default currency code',
  `currency_symbol` varchar(10) NOT NULL DEFAULT '$' COMMENT 'Currency symbol',
  `currency_position` varchar(20) NOT NULL DEFAULT 'before' COMMENT 'Currency symbol position (before/after)',
  `decimal_separator` varchar(1) DEFAULT '.' COMMENT 'Decimal point separator',
  `thousand_separator` varchar(1) DEFAULT ',' COMMENT 'Thousands separator',
  `decimals` tinyint(1) DEFAULT 2 COMMENT 'Number of decimal places',
  `default_language` varchar(10) DEFAULT 'en' COMMENT 'Default system language',
  `logo` varchar(255) DEFAULT NULL COMMENT 'Path to main logo',
  `logo_small` varchar(255) DEFAULT NULL COMMENT 'Path to small/mobile logo',
  `favicon` varchar(255) DEFAULT NULL COMMENT 'Path to favicon',
  `admin_logo` varchar(255) DEFAULT NULL COMMENT 'Path to admin panel logo',
  `login_background` varchar(255) DEFAULT NULL COMMENT 'Path to login page background',
  `primary_color` varchar(20) DEFAULT '#3498db' COMMENT 'Primary brand color (hex)',
  `secondary_color` varchar(20) DEFAULT '#2c3e50' COMMENT 'Secondary brand color (hex)',
  `accent_color` varchar(20) DEFAULT '#e74c3c' COMMENT 'Accent color for buttons/links (hex)',
  `text_color` varchar(20) DEFAULT '#333333' COMMENT 'Default text color (hex)',
  `bg_color` varchar(20) DEFAULT '#ffffff' COMMENT 'Default background color (hex)',
  `contact_email` varchar(100) DEFAULT NULL COMMENT 'Public contact email',
  `support_email` varchar(100) DEFAULT NULL COMMENT 'Support email address',
  `sales_email` varchar(100) DEFAULT NULL COMMENT 'Sales email address',
  `inquiry_email` varchar(100) DEFAULT NULL COMMENT 'General inquiries email',
  `contact_phone` varchar(50) DEFAULT NULL COMMENT 'Contact phone number',
  `support_phone` varchar(50) DEFAULT NULL COMMENT 'Support phone number',
  `fax` varchar(50) DEFAULT NULL COMMENT 'Fax number',
  `office_hours` varchar(255) DEFAULT NULL COMMENT 'Office hours text',
  `copyright_text` text DEFAULT NULL COMMENT 'Copyright notice for footer',
  `cookie_notice` text DEFAULT NULL COMMENT 'Cookie consent notice text',
  `cookie_button_text` varchar(50) DEFAULT 'Accept' COMMENT 'Cookie accept button text',
  `show_cookie_notice` tinyint(1) DEFAULT 1 COMMENT 'Whether to show cookie notice',
  `privacy_policy_link` varchar(255) DEFAULT NULL COMMENT 'Link to privacy policy',
  `terms_link` varchar(255) DEFAULT NULL COMMENT 'Link to terms of service',
  `site_title` varchar(255) DEFAULT NULL COMMENT 'Default meta title',
  `meta_description` text DEFAULT NULL COMMENT 'Default meta description',
  `meta_keywords` text DEFAULT NULL COMMENT 'Default meta keywords',
  `google_analytics` varchar(50) DEFAULT NULL COMMENT 'Google Analytics ID',
  `google_tag_manager` varchar(50) DEFAULT NULL COMMENT 'Google Tag Manager ID',
  `facebook_pixel` varchar(50) DEFAULT NULL COMMENT 'Facebook Pixel ID',
  `google_maps_key` varchar(255) DEFAULT NULL COMMENT 'Google Maps API key',
  `latitude` varchar(20) DEFAULT NULL COMMENT 'Office latitude for map',
  `longitude` varchar(20) DEFAULT NULL COMMENT 'Office longitude for map',
  `show_map` tinyint(1) DEFAULT 1 COMMENT 'Whether to show map on contact page',
  `maintenance_mode` tinyint(1) DEFAULT 0 COMMENT 'Enable maintenance mode',
  `maintenance_message` text DEFAULT NULL COMMENT 'Maintenance mode message',
  `enable_registration` tinyint(1) DEFAULT 1 COMMENT 'Allow new user registration',
  `enable_user_login` tinyint(1) DEFAULT 1 COMMENT 'Allow user login',
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the record',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the record',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record last update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(10) UNSIGNED NOT NULL,
  `job_title` varchar(255) NOT NULL COMMENT 'Job position title',
  `slug` varchar(255) NOT NULL COMMENT 'URL-friendly job title',
  `job_type` enum('full_time','part_time','contract','temporary','internship','remote','freelance') NOT NULL DEFAULT 'full_time' COMMENT 'Type of employment',
  `job_level` enum('entry','associate','mid_level','senior','executive','management') DEFAULT NULL COMMENT 'Experience level',
  `company_name` varchar(255) NOT NULL COMMENT 'Name of hiring company',
  `company_logo` varchar(255) DEFAULT NULL COMMENT 'Path to company logo',
  `company_website` varchar(255) DEFAULT NULL COMMENT 'Company website URL',
  `company_about` text DEFAULT NULL COMMENT 'Brief description of the company',
  `company_industry` varchar(100) DEFAULT NULL COMMENT 'Industry of the company',
  `company_size` varchar(50) DEFAULT NULL COMMENT 'Size of the company (e.g., 1-10, 11-50, etc.)',
  `description` text NOT NULL COMMENT 'Full job description',
  `responsibilities` text DEFAULT NULL COMMENT 'Job responsibilities',
  `requirements` text DEFAULT NULL COMMENT 'Job requirements',
  `preferred_skills` text DEFAULT NULL COMMENT 'Preferred but not required skills',
  `qualification_summary` text DEFAULT NULL COMMENT 'Summary of ideal qualifications',
  `technical_requirements` text DEFAULT NULL COMMENT 'Technical skills and tools required',
  `min_experience` decimal(3,1) DEFAULT NULL COMMENT 'Minimum years of experience',
  `max_experience` decimal(3,1) DEFAULT NULL COMMENT 'Maximum years of experience',
  `education_level` varchar(100) DEFAULT NULL COMMENT 'Required education level',
  `certification_requirements` text DEFAULT NULL COMMENT 'Required professional certifications',
  `department` varchar(100) DEFAULT NULL COMMENT 'Department this position belongs to',
  `reports_to` varchar(100) DEFAULT NULL COMMENT 'Position this role reports to',
  `direct_reports` int(11) DEFAULT 0 COMMENT 'Number of direct reports for this position',
  `team_size` int(11) DEFAULT NULL COMMENT 'Size of team this position is part of',
  `min_salary` decimal(12,2) DEFAULT NULL COMMENT 'Minimum salary offered',
  `max_salary` decimal(12,2) DEFAULT NULL COMMENT 'Maximum salary offered',
  `salary_currency` varchar(3) DEFAULT 'USD' COMMENT 'Currency code for salary',
  `salary_period` enum('hourly','daily','weekly','monthly','annually') DEFAULT 'annually' COMMENT 'Salary period',
  `is_salary_visible` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether salary is visible to applicants',
  `has_benefits` tinyint(1) DEFAULT 1 COMMENT 'Whether position includes benefits',
  `benefits_summary` text DEFAULT NULL COMMENT 'Summary of benefits offered',
  `healthcare` tinyint(1) DEFAULT NULL COMMENT 'Provides healthcare benefits',
  `dental_vision` tinyint(1) DEFAULT NULL COMMENT 'Provides dental/vision benefits',
  `retirement_plan` tinyint(1) DEFAULT NULL COMMENT 'Provides retirement plan',
  `paid_time_off` varchar(100) DEFAULT NULL COMMENT 'PTO policy summary',
  `equity` tinyint(1) DEFAULT NULL COMMENT 'Includes equity compensation',
  `equity_details` varchar(255) DEFAULT NULL COMMENT 'Details about equity offering',
  `bonus_structure` text DEFAULT NULL COMMENT 'Information about bonuses or incentives',
  `work_schedule` varchar(255) DEFAULT NULL COMMENT 'Work schedule details',
  `weekly_hours` int(11) DEFAULT 40 COMMENT 'Expected weekly hours',
  `is_remote` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether job allows remote work',
  `remote_type` enum('fully_remote','hybrid','temporary_remote') DEFAULT NULL COMMENT 'Type of remote work',
  `remote_regions_allowed` varchar(255) DEFAULT NULL COMMENT 'Regions eligible for remote work',
  `workspace_type` enum('office','coworking','field','home') DEFAULT 'office' COMMENT 'Primary workspace type',
  `travel_required` varchar(100) DEFAULT NULL COMMENT 'Travel expectations (e.g., 10%, quarterly)',
  `relocation_assistance` tinyint(1) DEFAULT 0 COMMENT 'Whether relocation assistance is provided',
  `work_environment` text DEFAULT NULL COMMENT 'Description of work environment',
  `dress_code` varchar(100) DEFAULT NULL COMMENT 'Dress code policy',
  `is_flexible_hours` tinyint(1) DEFAULT 0 COMMENT 'Whether flexible hours are allowed',
  `location_city` varchar(100) DEFAULT NULL COMMENT 'City of job location',
  `location_state` varchar(100) DEFAULT NULL COMMENT 'State/province of job location',
  `location_country` varchar(100) DEFAULT NULL COMMENT 'Country of job location',
  `location_postal_code` varchar(20) DEFAULT NULL COMMENT 'Postal/ZIP code of job location',
  `location_address` text DEFAULT NULL COMMENT 'Full address of job location',
  `is_multiple_locations` tinyint(1) DEFAULT 0 COMMENT 'Whether job is available in multiple locations',
  `openings` int(11) DEFAULT 1 COMMENT 'Number of positions available',
  `deadline` date DEFAULT NULL COMMENT 'Application deadline',
  `application_instructions` text DEFAULT NULL COMMENT 'Special instructions for applicants',
  `apply_type` enum('direct','external','email') NOT NULL DEFAULT 'direct' COMMENT 'How to apply for the job',
  `external_apply_url` varchar(255) DEFAULT NULL COMMENT 'External application URL',
  `apply_email` varchar(255) DEFAULT NULL COMMENT 'Email to send applications to',
  `screening_questions_count` int(11) DEFAULT 0 COMMENT 'Number of screening questions',
  `has_assessment` tinyint(1) DEFAULT 0 COMMENT 'Whether job requires skills assessment',
  `assessment_details` text DEFAULT NULL COMMENT 'Information about skills assessment',
  `interview_process` text DEFAULT NULL COMMENT 'Description of interview process',
  `estimated_hiring_timeline` varchar(255) DEFAULT NULL COMMENT 'Expected time to fill position',
  `is_equal_opportunity` tinyint(1) DEFAULT 1 COMMENT 'Is an equal opportunity employer',
  `diversity_commitment` text DEFAULT NULL COMMENT 'Statement on diversity and inclusion',
  `accommodations` text DEFAULT NULL COMMENT 'Information about workplace accommodations',
  `is_visa_sponsored` tinyint(1) DEFAULT 0 COMMENT 'Whether visa sponsorship is available',
  `is_veteran_friendly` tinyint(1) DEFAULT 0 COMMENT 'Whether veterans are encouraged to apply',
  `contact_name` varchar(100) DEFAULT NULL COMMENT 'Name of contact person',
  `contact_title` varchar(100) DEFAULT NULL COMMENT 'Title of contact person',
  `contact_email` varchar(255) DEFAULT NULL COMMENT 'Email of contact person',
  `contact_phone` varchar(50) DEFAULT NULL COMMENT 'Phone of contact person',
  `contact_availability` varchar(255) DEFAULT NULL COMMENT 'When contact person is available',
  `status` enum('draft','published','filled','expired','canceled') NOT NULL DEFAULT 'draft' COMMENT 'Job posting status',
  `is_featured` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether job is featured/highlighted',
  `is_confidential` tinyint(1) DEFAULT 0 COMMENT 'Whether company name is hidden',
  `is_urgent` tinyint(1) DEFAULT 0 COMMENT 'Whether position is urgent to fill',
  `is_internal` tinyint(1) DEFAULT 0 COMMENT 'Whether job is for internal applicants only',
  `internal_job_id` varchar(50) DEFAULT NULL COMMENT 'Internal reference number',
  `reference_code` varchar(50) DEFAULT NULL COMMENT 'External reference code',
  `repost_count` int(11) DEFAULT 0 COMMENT 'Number of times job has been reposted',
  `original_post_date` date DEFAULT NULL COMMENT 'Date job was first posted',
  `meta_title` varchar(100) DEFAULT NULL COMMENT 'Custom meta title for SEO',
  `meta_description` varchar(255) DEFAULT NULL COMMENT 'Custom meta description for SEO',
  `meta_keywords` varchar(255) DEFAULT NULL COMMENT 'Custom meta keywords for SEO',
  `seo_canonical_url` varchar(255) DEFAULT NULL COMMENT 'Canonical URL for SEO',
  `social_share_image` varchar(255) DEFAULT NULL COMMENT 'Image for social sharing',
  `promotional_text` text DEFAULT NULL COMMENT 'Special promotional message',
  `views_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Number of job views',
  `applications_count` int(11) NOT NULL DEFAULT 0 COMMENT 'Number of applications received',
  `qualified_applications_count` int(11) DEFAULT 0 COMMENT 'Number of qualified applications',
  `shares_count` int(11) DEFAULT 0 COMMENT 'Number of social shares',
  `referral_source` varchar(100) DEFAULT NULL COMMENT 'How job was sourced',
  `tracking_pixel` text DEFAULT NULL COMMENT 'Tracking code for analytics',
  `utm_source` varchar(100) DEFAULT NULL COMMENT 'UTM source parameter',
  `utm_medium` varchar(100) DEFAULT NULL COMMENT 'UTM medium parameter',
  `utm_campaign` varchar(100) DEFAULT NULL COMMENT 'UTM campaign parameter',
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the job',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the job',
  `published_at` datetime DEFAULT NULL COMMENT 'When job was published',
  `expires_at` datetime DEFAULT NULL COMMENT 'When job automatically expires',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record last update timestamp',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newjobtables`
--

CREATE TABLE `newjobtables` (
  `job_id` int(11) NOT NULL COMMENT 'Unique identifier for the job',
  `job_title` varchar(255) NOT NULL COMMENT 'Title of the job position',
  `job_description` text NOT NULL COMMENT 'Detailed description of the job',
  `department_id` int(11) NOT NULL COMMENT 'Department this job belongs to',
  `status` varchar(50) DEFAULT 'Draft' COMMENT 'Current status of the job (e.g., Draft, Published, Filled)',
  `priority` varchar(50) DEFAULT 'Medium' COMMENT 'Priority level of filling this position',
  `assigned_to_employee_id` int(11) DEFAULT NULL COMMENT 'Employee responsible for this job posting',
  `min_salary` decimal(15,2) DEFAULT NULL COMMENT 'Minimum salary offered for this position',
  `max_salary` decimal(15,2) DEFAULT NULL COMMENT 'Maximum salary offered for this position',
  `employment_type` varchar(50) NOT NULL COMMENT 'Type of employment (e.g., Full-time, Part-time, Contract)',
  `application_deadline` date DEFAULT NULL COMMENT 'Deadline for submitting job applications',
  `is_remote` tinyint(1) DEFAULT 0 COMMENT 'Whether the job can be performed remotely',
  `client_budget_hourly` decimal(10,2) DEFAULT NULL COMMENT 'Hourly budget from client for profit optimization',
  `internal_budget_hourly` decimal(10,2) DEFAULT NULL COMMENT 'Internal hourly budget for profit optimization',
  `candidate_split_percentage` int(11) DEFAULT NULL COMMENT 'Percentage of profit allocated to candidate',
  `company_split_percentage` int(11) DEFAULT NULL COMMENT 'Percentage of profit allocated to company',
  `requirements` text DEFAULT NULL COMMENT 'Specific requirements for the job',
  `responsibilities` text DEFAULT NULL COMMENT 'Key responsibilities for the job',
  `benefits` text DEFAULT NULL COMMENT 'Benefits offered with the position',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Timestamp of when the record was created',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Timestamp of when the record was last updated'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newjobtables`
--

INSERT INTO `newjobtables` (`job_id`, `job_title`, `job_description`, `department_id`, `status`, `priority`, `assigned_to_employee_id`, `min_salary`, `max_salary`, `employment_type`, `application_deadline`, `is_remote`, `client_budget_hourly`, `internal_budget_hourly`, `candidate_split_percentage`, `company_split_percentage`, `requirements`, `responsibilities`, `benefits`, `created_at`, `updated_at`) VALUES
(7, 'Developer', 'We are looking for a Junior Python Developer to assist in building and maintaining backend applications. This role is ideal for someone starting their career in software development.\n\nResponsibilities:\n\nAssist in developing backend applications using Python (Django, Flask, or FastAPI)\n\nWrite clean and readable code following best practices\n\nHelp integrate APIs and services\n\nCollaborate with team members to implement features\n\nParticipate in debugging and testing\n\nRequired Technical Skills:\n\nBasic understanding of Python\n\nFamiliarity with web frameworks (Django, Flask, or FastAPI) is a plus\n\nUnderstanding of databases (SQL/NoSQL)\n\nBasic knowledge of version control (Git)\n\nQualifications:\n\nBachelor’s degree in Computer Science, Engineering, or related field, or equivalent experience\n\nLittle to no professional experience required; internships or projects count\n\nSoft Skills & Cultural Fit:\n\nEagerness to learn and improve\n\nGood communication and teamwork skills\n\nAttention to detail and problem-solving mindset', 1, 'draft', 'medium', NULL, 10000.00, 20000.00, 'full-time', '2025-09-30', 0, 120.00, 90.00, 70, 30, 'We are looking for a Junior Python Developer to assist in building and maintaining backend applications. This role is ideal for someone starting their career in software development.\n\nResponsibilities:\n\nAssist in developing backend applications using Python (Django, Flask, or FastAPI)\n\nWrite clean and readable code following best practices\n\nHelp integrate APIs and services\n\nCollaborate with team members to implement features\n\nParticipate in debugging and testing\n\nRequired Technical Skills:\n\nBasic understanding of Python\n\nFamiliarity with web frameworks (Django, Flask, or FastAPI) is a plus\n\nUnderstanding of databases (SQL/NoSQL)\n\nBasic knowledge of version control (Git)\n\nQualifications:\n\nBachelor’s degree in Computer Science, Engineering, or related field, or equivalent experience\n\nLittle to no professional experience required; internships or projects count\n\nSoft Skills & Cultural Fit:\n\nEagerness to learn and improve\n\nGood communication and teamwork skills\n\nAttention to detail and problem-solving mindset', 'We are looking for a Junior Python Developer to assist in building and maintaining backend applications. This role is ideal for someone starting their career in software development.\n\nResponsibilities:\n\nAssist in developing backend applications using Python (Django, Flask, or FastAPI)\n\nWrite clean and readable code following best practices\n\nHelp integrate APIs and services\n\nCollaborate with team members to implement features\n\nParticipate in debugging and testing\n\nRequired Technical Skills:\n\nBasic understanding of Python\n\nFamiliarity with web frameworks (Django, Flask, or FastAPI) is a plus\n\nUnderstanding of databases (SQL/NoSQL)\n\nBasic knowledge of version control (Git)\n\nQualifications:\n\nBachelor’s degree in Computer Science, Engineering, or related field, or equivalent experience\n\nLittle to no professional experience required; internships or projects count\n\nSoft Skills & Cultural Fit:\n\nEagerness to learn and improve\n\nGood communication and teamwork skills\n\nAttention to detail and problem-solving mindset', 'I need Python developer and Node js developer', '2025-09-20 18:39:58', '2025-09-21 10:00:22');

-- --------------------------------------------------------

--
-- Table structure for table `payment_configurations`
--

CREATE TABLE `payment_configurations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `gateway_name` varchar(191) NOT NULL COMMENT 'Friendly name of the payment gateway',
  `gateway_code` varchar(100) NOT NULL COMMENT 'Unique code identifier for the gateway (stripe, paypal, etc.)',
  `live_values` longtext DEFAULT NULL COMMENT 'JSON configuration for live environment',
  `test_values` longtext DEFAULT NULL COMMENT 'JSON configuration for test environment',
  `mode` varchar(20) NOT NULL DEFAULT 'test' COMMENT 'Current operation mode (live/test)',
  `is_active` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether this gateway is active',
  `priority` int(11) NOT NULL DEFAULT 0 COMMENT 'Sorting order for multiple active gateways',
  `gateway_image` varchar(255) DEFAULT NULL COMMENT 'Path to gateway logo',
  `supports_recurring` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether gateway supports recurring payments',
  `supports_refunds` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether gateway supports refunds',
  `webhook_url` varchar(255) DEFAULT NULL COMMENT 'Webhook URL for payment notifications',
  `webhook_secret` varchar(255) DEFAULT NULL COMMENT 'Secret for webhook verification',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission_categories`
--

CREATE TABLE `permission_categories` (
  `id` int(11) NOT NULL,
  `perm_group_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_code` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `enable_view` tinyint(1) NOT NULL DEFAULT 0,
  `enable_add` tinyint(1) NOT NULL DEFAULT 0,
  `enable_edit` tinyint(1) NOT NULL DEFAULT 0,
  `enable_delete` tinyint(1) NOT NULL DEFAULT 0,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System permissions cannot be modified',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_categories`
--

INSERT INTO `permission_categories` (`id`, `perm_group_id`, `name`, `short_code`, `description`, `enable_view`, `enable_add`, `enable_edit`, `enable_delete`, `is_system`, `is_active`, `display_order`, `created_at`, `updated_at`) VALUES
(21, 11, 'Branch List', 'BRANCH_LIST', 'Manage branches', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(22, 11, 'Branch Adding', 'BRANCH_ADD', 'Add new branches', 1, 1, 1, 1, 1, 1, 2, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(23, 12, 'Role List', 'ROLE_LIST', 'Manage roles', 1, 1, 1, 1, 1, 1, 3, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(24, 12, 'Role Adding', 'ROLE_ADD', 'Add new roles', 1, 0, 1, 0, 1, 1, 4, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(25, 13, 'Employee List', 'EMP_LIST', 'Manage employees', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(26, 13, 'Employee Adding', 'EMP_ADD', 'Add new employees', 1, 1, 1, 0, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(27, 13, 'Employee Attendance', 'EMP_ATTENDANCE', 'Manage employee attendance', 1, 1, 1, 1, 1, 1, 2, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(28, 13, 'Payroll Management', 'PAYROLL_MGMT', 'Manage payroll', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(29, 13, 'Department List', 'DEPT_LIST', 'Manage departments', 1, 1, 1, 1, 1, 1, 2, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(30, 13, 'Designation List', 'DESIG_LIST', 'Manage designations', 1, 1, 1, 1, 1, 1, 3, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(31, 13, 'Apply Leave', 'EMP_LEAVE', 'Manage employee leave', 1, 1, 1, 0, 0, 1, 3, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(32, 13, 'Leave Types', 'LEAVE_TYPES', 'Manage leave types', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(33, 13, 'Leave Requests', 'LEAVE_REQUESTS', 'Manage leave requests', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(34, 13, 'Disable Employee', 'EMP_DISABLE', 'Disable employees', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(35, 16, 'Resume Management', 'RESUME_MGMT', 'Manage resumes', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(36, 14, 'Team Management', 'TEAM_MGMT', 'Manage teams', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(37, 15, 'Job Management', 'JOB_MGMT', 'Manage jobs', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(38, 20, 'Reports Management', 'REPORT_MGMT', 'Manage reports', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(39, 17, 'Candidates Management', 'CANDIDATES_MGMT', 'Manage candidates', 1, 0, 0, 0, 0, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(40, 21, 'Profit Calculator', 'PROFIT_CALC', 'Calculate profits', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(41, 22, 'Setting Management', 'SETTING_MGMT', 'Manage settings', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(42, 18, 'Screenings Management', 'SCREENINGS_MGMT', 'Manage screenings', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35'),
(43, 19, 'Interviews Management', 'INTERVIEWS_MGMT', 'Manage interviews', 1, 1, 1, 1, 1, 1, 1, '2025-05-30 15:01:35', '2025-05-30 15:01:35');

-- --------------------------------------------------------

--
-- Table structure for table `permission_groups`
--

CREATE TABLE `permission_groups` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `short_code` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System groups cannot be modified',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permission_groups`
--

INSERT INTO `permission_groups` (`id`, `name`, `short_code`, `description`, `is_system`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(11, 'Branch Manager', 'BRANCH_MGR', 'Branch manager permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(12, 'Role Manager', 'ROLE_MGR', 'Role management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(13, 'Human Resource Management', 'HUMAN_MGR', 'Human Resource Management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(14, 'Team Management', 'TEAM_MGMT', 'Team management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(15, 'Job Management', 'JOB_MGMT', 'Job management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(16, 'Resume Management', 'RESUME_MGMT', 'Resume management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(17, 'Candidates Management', 'CANDIDATES_MGMT', 'Candidates management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(18, 'Screenings Management', 'SCREENINGS_MGMT', 'Screenings management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(19, 'Interviews Management', 'INTERVIEWS_MGMT', 'Interviews management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(20, 'Report Management', 'REPORT_MGMT', 'Report management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(21, 'Profit Management', 'PROFIT_MGMT', 'Profit management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL),
(22, 'Setting Management', 'SETTING_MGMT', 'Setting management permissions', 1, 1, 1, NULL, '2025-05-30 15:01:33', '2025-05-30 15:01:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
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
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `description`, `branch_id`, `is_system`, `priority`, `is_active`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Administrator', 'administrator', 'System administrator with full access', NULL, 1, 100, 1, 1, NULL, '2025-05-30 15:01:26', '2025-05-30 23:49:54', NULL),
(2, 'Branch Manager', 'branch-manager', 'Manager of a specific branch', 1, 0, 50, 1, 1, NULL, '2025-05-30 15:01:26', '2025-05-30 15:01:26', NULL),
(3, 'Staff Member', 'staff-member', 'Regular staff member with limited access', 1, 0, 10, 1, 1, NULL, '2025-05-30 15:01:26', '2025-05-30 15:01:26', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `perm_cat_id` int(11) NOT NULL,
  `can_view` tinyint(1) NOT NULL DEFAULT 0,
  `can_add` tinyint(1) NOT NULL DEFAULT 0,
  `can_edit` tinyint(1) NOT NULL DEFAULT 0,
  `can_delete` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_by` int(11) NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL COMMENT 'Specific branch ID if permission is branch-specific',
  `custom_attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Additional custom permission attributes' CHECK (json_valid(`custom_attributes`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250509104432-create-branches-table.js'),
('20250510000001-create-roles-table.js'),
('20250510000002-create-departments-table.js'),
('20250510000004-create-designations-table.js'),
('20250510000005-create-employees-table.js'),
('20250510060026-create-permission-groups-table.js'),
('20250510070001-create-permission-categories-table.js'),
('20250510080001-create-role-permissions-table.js'),
('20250510090001-create-sidebar-menus-table.js'),
('20250510090003-create-sidebar-sub-menus-table.js'),
('20250510090005-create-employee-roles-table.js'),
('20250510100000-create-users-table.js'),
('20250510110000-create-sms-configurations-table.js'),
('20250510110001-create-sms-templates-table.js'),
('20250510120000-create-payment-configurations-table.js'),
('20250510130000-create-email-configs-table.js'),
('20250510130000-create-social-media-links-table.js'),
('20250510140000-create-email-templates-table.js'),
('20250510150000-create-general-settings-table.js'),
('20250510160000-create-jobs-table.js'),
('20250510170000-create-user-skills-table.js'),
('20250510180000-create-employee-skills-table.js'),
('20250512034723-create-employee-interview-schedules-table.js'),
('20250512034724-create-user-interview-schedules-table.js'),
('20250512055749-create-employee-interview-calendar-events-table.js'),
('20250512055750-create-user-interview-calendar-events-table.js'),
('20250512090143-create-talent-spark-configurations-table.js'),
('20250601000000-create-newjob-table.js'),
('20250602000001-create-employee-interview-screening-table.js'),
('20250602000002-add-jobid-status-to-employee-interview-screening-table-fixed.js');

-- --------------------------------------------------------

--
-- Table structure for table `sidebar_menus`
--

CREATE TABLE `sidebar_menus` (
  `id` int(11) NOT NULL,
  `permission_group_id` int(11) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `menu` varchar(500) DEFAULT NULL,
  `activate_menu` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `lang_key` varchar(250) NOT NULL,
  `system_level` tinyint(3) DEFAULT 0,
  `level` int(5) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `sidebar_display` tinyint(1) DEFAULT 0,
  `access_permissions` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System menus cannot be modified',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sidebar_menus`
--

INSERT INTO `sidebar_menus` (`id`, `permission_group_id`, `icon`, `menu`, `activate_menu`, `url`, `lang_key`, `system_level`, `level`, `display_order`, `sidebar_display`, `access_permissions`, `is_active`, `is_system`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 11, 'fa-building', 'Branches', 'branches', '/dashboard', 'dashboard', 0, 0, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(2, 12, 'fa-users', 'Roles Management', 'user_management', NULL, 'user_management', 0, 0, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(3, 13, 'fa-usercircle', 'Human Resources', 'human_resources', '/users', 'users', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(4, 14, 'fa-users', 'Teams', 'teams', '/roles', 'roles', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(5, 15, 'fa-briefcase', 'Jobs Management', 'jobs_management', '/permissions', 'permissions', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(6, 16, 'fa-upload', 'Resume Upload', 'resume_upload', '/dashboard', 'dashboard', 0, 0, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(7, 17, 'fa-clipboarcheck', 'Candidates', 'candidates', '/employees', 'employees', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(8, 18, 'fa-fileSearch', 'screenings', 'screenings', '/departments', 'departments', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(9, 19, 'fa-calendar', 'Interviews', 'interviews', '/designations', 'designations', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(10, 20, 'fa-piechart', 'Reports', 'reports', NULL, 'organization', 0, 0, 4, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(11, 21, 'fa-dollarsign', 'Margin', 'profit', '/organization-chart', 'org_chart', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL),
(12, 22, 'fa-settings', 'Settings', 'settings', '/branches', 'branches', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:41', '2025-05-30 15:01:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sidebar_sub_menus`
--

CREATE TABLE `sidebar_sub_menus` (
  `id` int(11) NOT NULL,
  `sidebar_menu_id` int(11) NOT NULL,
  `permission_category_id` int(11) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `sub_menu` varchar(500) NOT NULL,
  `activate_menu` varchar(100) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `lang_key` varchar(250) NOT NULL,
  `system_level` tinyint(3) DEFAULT 0,
  `level` int(5) DEFAULT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `sidebar_display` tinyint(1) DEFAULT 0,
  `access_permissions` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System sub-menus cannot be modified',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sidebar_sub_menus`
--

INSERT INTO `sidebar_sub_menus` (`id`, `sidebar_menu_id`, `permission_category_id`, `icon`, `sub_menu`, `activate_menu`, `url`, `lang_key`, `system_level`, `level`, `display_order`, `sidebar_display`, `access_permissions`, `is_active`, `is_system`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 21, 'fa-eye', 'List Branches', 'list_branches', '/branches', 'branches', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(2, 1, 22, 'fa-plus', 'Add Branch', 'add_branch', '/branches/add', 'branches_add', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(3, 2, 23, 'fa-eye', 'View Roles', 'view_roles', '/roles', 'view_roles', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(4, 2, 24, 'fa-plus', 'Add Role', 'add_roles', '/roles/add', 'add_roles', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(5, 3, 25, 'fa-lock', 'Employee List', 'employee_list', '/profiles', 'employee_list', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(6, 3, 26, 'fa-cog', 'Employee Add', 'employee_add', '/hr/employees/add', 'employee_add', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(7, 3, 27, 'fa-eye', 'Employee Attendance', 'employee_attendance', '/hr/attendance', 'employee_attendance', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(8, 3, 28, 'fa-plus', 'Payroll', 'payroll', '/hr/payroll', 'payroll', 0, 1, 2, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(9, 3, 29, 'fa-lock', 'Department', 'departments', '/hr/departments', 'departments', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(10, 3, 30, 'fa-cog', 'Designation', 'designations', '/hr/designations', 'designations', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(11, 3, 31, 'fa-cog', 'Apply Leave', 'apply_leave', '/hr/leave/apply', 'apply_leave', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(12, 3, 32, 'fa-eye', 'Leave Types', 'leave_types', '/hr/leave/types', 'leave_types', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(13, 3, 33, 'fa-lock', 'Leave Request', 'leave_request', '/hr/leave/requests', 'leave_request', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(14, 3, 34, 'fa-cog', 'Disable Employees', 'disable_employees', '/hr/employees/disabled', 'disable_employees', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(15, 4, 36, 'fa-lock', 'Teams', 'Teams', '/teams', 'teams', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(16, 5, 37, 'fa-cog', 'Jobs Management', 'jobs_management', '/jobs-management', 'jobs_management', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(17, 6, 35, 'fa-cog', 'Resume Upload', 'resume_upload', '/resume-upload', 'resume_upload', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(18, 7, 39, 'fa-eye', 'Candidates', 'candidates', '/candidates', 'candidates', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(19, 8, 42, 'fa-lock', 'Screenings', 'screenings', '/screenings', 'screenings', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(20, 9, 43, 'fa-cog', 'Interviews', 'interviews', '/interviews', 'interviews', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL),
(21, 10, 38, 'fa-lock', 'Margin', 'reports', '/reports', 'reports', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-06-19 14:15:25', NULL),
(22, 11, 40, 'fa-cog', 'Margin Calculator', 'profit_calculator', '/profit-calculator', 'profit_calculator', 0, 1, 1, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-06-19 14:15:33', NULL),
(23, 12, 41, 'fa-lock', 'Settings', 'settings', '/settings', 'settings', 0, 1, 3, 1, NULL, 1, 1, 1, NULL, '2025-05-30 15:01:42', '2025-05-30 15:01:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sms_configurations`
--

CREATE TABLE `sms_configurations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `gateway_name` varchar(191) NOT NULL COMMENT 'Friendly name of the SMS gateway',
  `gateway_code` varchar(100) NOT NULL COMMENT 'Unique code identifier for the gateway',
  `live_values` longtext DEFAULT NULL COMMENT 'JSON configuration for live environment',
  `test_values` longtext DEFAULT NULL COMMENT 'JSON configuration for test environment',
  `mode` varchar(20) NOT NULL DEFAULT 'live' COMMENT 'Current operation mode (live/test)',
  `is_active` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether this gateway is active',
  `priority` int(11) NOT NULL DEFAULT 0 COMMENT 'Sorting order for multiple active gateways',
  `gateway_image` varchar(255) DEFAULT NULL COMMENT 'Path to gateway logo',
  `retry_attempts` int(11) DEFAULT 3 COMMENT 'Number of retry attempts for failed messages',
  `retry_interval` int(11) DEFAULT 60 COMMENT 'Seconds between retry attempts',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms_templates`
--

CREATE TABLE `sms_templates` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `template_code` varchar(50) NOT NULL COMMENT 'e.g., otp, order_confirmation, etc.',
  `content` text NOT NULL COMMENT 'Template with placeholders like {OTP}, {NAME}',
  `variables` varchar(255) DEFAULT NULL COMMENT 'List of variables used in template',
  `category` varchar(50) DEFAULT 'general' COMMENT 'Template category for organization',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `character_count` int(11) DEFAULT NULL COMMENT 'For SMS segment calculation',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `sms_templates`
--
DELIMITER $$
CREATE TRIGGER `before_sms_template_insert` BEFORE INSERT ON `sms_templates` FOR EACH ROW SET NEW.character_count = CHAR_LENGTH(NEW.content)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `before_sms_template_update` BEFORE UPDATE ON `sms_templates` FOR EACH ROW SET NEW.character_count = CHAR_LENGTH(NEW.content)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `social_media_links`
--

CREATE TABLE `social_media_links` (
  `id` int(10) UNSIGNED NOT NULL,
  `platform_name` varchar(50) NOT NULL COMMENT 'Name of social media platform',
  `platform_code` varchar(30) NOT NULL COMMENT 'Unique code for the platform',
  `url` varchar(255) DEFAULT NULL COMMENT 'Full URL to social media profile',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether to display this social media link',
  `open_in_new_tab` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether to open link in new tab',
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `talent_spark_configurations`
--

CREATE TABLE `talent_spark_configurations` (
  `id` int(10) UNSIGNED NOT NULL,
  `branch_id` int(11) NOT NULL COMMENT 'Related branch identifier',
  `name` varchar(100) NOT NULL COMMENT 'Configuration name for reference',
  `title` varchar(255) DEFAULT NULL COMMENT 'UI display title',
  `overview` text DEFAULT NULL COMMENT 'UI display description',
  `system_prompt` text NOT NULL COMMENT 'Master instruction set for the LLM',
  `model` varchar(100) NOT NULL COMMENT 'LLM identifier (e.g., fixie-ai/ultravox-70B)',
  `voice` varchar(100) NOT NULL COMMENT 'TTS voice ID',
  `api_key` varchar(255) DEFAULT NULL COMMENT 'API key for authentication with the voice/LLM service',
  `language_hint` varchar(20) DEFAULT 'en-US' COMMENT 'Primary language for STT (e.g., en-US, es-MX)',
  `temperature` decimal(3,2) DEFAULT 0.70 COMMENT 'LLM randomness/creativity (0.0-2.0)',
  `max_duration` varchar(20) DEFAULT '600s' COMMENT 'Maximum call duration (e.g., 600s, 10m)',
  `time_exceeded_message` text DEFAULT NULL COMMENT 'Message when max duration is reached',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether configuration is active',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Whether this is the default configuration',
  `version` varchar(20) DEFAULT '1.0' COMMENT 'Configuration version',
  `status` enum('draft','testing','production','archived') NOT NULL DEFAULT 'draft' COMMENT 'Current status',
  `callback_url` varchar(255) DEFAULT NULL COMMENT 'Optional webhook for call events',
  `analytics_enabled` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether to collect analytics',
  `additional_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Any additional configuration options' CHECK (json_valid(`additional_settings`)),
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the configuration',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the configuration',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Created by BollineniRohith123 on 2025-05-12 09:01:43';

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL COMMENT 'Link to employee if user is staff',
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL COMMENT 'Null if using only social/OTP auth',
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `auth_type` varchar(50) NOT NULL DEFAULT 'password' COMMENT 'Comma-separated list of auth types: password,google,phone_otp',
  `google_id` varchar(255) DEFAULT NULL,
  `google_avatar` varchar(255) DEFAULT NULL,
  `google_refresh_token` varchar(255) DEFAULT NULL,
  `phone_verified` tinyint(1) NOT NULL DEFAULT 0,
  `phone_verification_code` varchar(10) DEFAULT NULL,
  `phone_verification_sent_at` datetime DEFAULT NULL,
  `phone_verification_attempts` int(11) NOT NULL DEFAULT 0,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `email_verification_sent_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `login_attempts` int(11) NOT NULL DEFAULT 0,
  `login_locked_until` datetime DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT 0,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `user_type` enum('admin','staff','customer','vendor','system') NOT NULL DEFAULT 'staff',
  `default_branch_id` int(11) DEFAULT NULL,
  `language` varchar(10) NOT NULL DEFAULT 'en',
  `timezone` varchar(100) NOT NULL DEFAULT 'UTC',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_system` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'System users cannot be modified',
  `must_change_password` tinyint(1) NOT NULL DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `employee_id`, `username`, `email`, `password`, `first_name`, `last_name`, `phone`, `profile_image`, `auth_type`, `google_id`, `google_avatar`, `google_refresh_token`, `phone_verified`, `phone_verification_code`, `phone_verification_sent_at`, `phone_verification_attempts`, `email_verified`, `email_verification_token`, `email_verification_sent_at`, `last_login`, `login_attempts`, `login_locked_until`, `password_reset_token`, `password_reset_expires`, `remember_token`, `two_factor_enabled`, `two_factor_secret`, `user_type`, `default_branch_id`, `language`, `timezone`, `is_active`, `is_system`, `must_change_password`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'admin', 'admin@talentspark.com', '$2b$10$Z2q64SzTVMr7HcxXtLHzvu.TP8BysVTQsFCzd.Z9yYJmXfAtAOK/C', 'Admin', 'User', '+1-123-456-7890', NULL, 'password', NULL, NULL, NULL, 0, NULL, NULL, 0, 1, NULL, NULL, '2025-06-01 17:35:42', 0, NULL, NULL, NULL, NULL, 0, NULL, 'admin', 1, 'en', 'UTC', 1, 1, 0, NULL, NULL, '2025-05-30 15:01:44', '2025-06-01 17:35:42', NULL),
(2, 2, 'staff', 'staff@talentspark.com', '$2b$10$TzAYC.N2TKgl0PFMsA0EpOkFcxPOoUMlJCv8c0dyIm3sBtuTLAE5a', 'Staff', 'User', '+1-123-456-7891', NULL, 'password', NULL, NULL, NULL, 0, NULL, NULL, 0, 1, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, 'staff', 1, 'en', 'UTC', 1, 0, 0, 1, NULL, '2025-05-30 15:01:44', '2025-05-30 15:01:44', NULL),
(3, NULL, 'customer', 'customer@example.com', '$2b$10$8kWrTkic6RPS2dGlwTHJrOL865a0Mltcyl8j.Y25CfugvcgygfPs2', 'Customer', 'User', '+1-123-456-7892', NULL, 'password', NULL, NULL, NULL, 0, NULL, NULL, 0, 1, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, NULL, 'customer', NULL, 'en', 'UTC', 1, 0, 0, 1, NULL, '2025-05-30 15:01:44', '2025-05-30 15:01:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_interview_calendar_events`
--

CREATE TABLE `user_interview_calendar_events` (
  `id` int(10) UNSIGNED NOT NULL,
  `interview_id` int(10) UNSIGNED NOT NULL COMMENT 'Related user interview',
  `calendar_type` enum('google','outlook','ical','other') NOT NULL COMMENT 'Calendar provider',
  `event_id` varchar(255) NOT NULL COMMENT 'Event ID in external calendar',
  `organizer_id` int(11) DEFAULT NULL COMMENT 'User who created calendar event',
  `event_url` varchar(255) DEFAULT NULL COMMENT 'URL to calendar event',
  `sync_status` enum('synced','out_of_sync','failed') NOT NULL DEFAULT 'synced' COMMENT 'Calendar sync status',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether calendar event is active in the system',
  `last_synced_at` datetime DEFAULT NULL COMMENT 'Last successful sync time',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Record update timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Created by BollineniRohith123 on 2025-05-12 05:57:49';

-- --------------------------------------------------------

--
-- Table structure for table `user_interview_schedules`
--

CREATE TABLE `user_interview_schedules` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Related user',
  `job_id` int(10) UNSIGNED NOT NULL COMMENT 'Job position',
  `title` varchar(255) NOT NULL COMMENT 'Interview title/purpose',
  `round` int(11) NOT NULL DEFAULT 1 COMMENT 'Interview round number',
  `interview_type` enum('onboarding','training','feedback','project_discussion','client_meeting','sales_call','support_session','demo','consultation','review') NOT NULL COMMENT 'Type of interview',
  `scheduled_date` date NOT NULL COMMENT 'Interview date',
  `start_time` time NOT NULL COMMENT 'Start time',
  `end_time` time NOT NULL COMMENT 'End time',
  `timezone` varchar(50) NOT NULL DEFAULT 'UTC' COMMENT 'Interview timezone',
  `is_virtual` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Virtual or in-person',
  `location` varchar(255) DEFAULT NULL COMMENT 'Physical location if in-person',
  `meeting_link` varchar(255) DEFAULT NULL COMMENT 'Virtual meeting URL',
  `meeting_id` varchar(100) DEFAULT NULL COMMENT 'Virtual meeting ID',
  `meeting_password` varchar(100) DEFAULT NULL COMMENT 'Meeting password/pin',
  `meeting_provider` varchar(50) DEFAULT NULL COMMENT 'Provider (Zoom, Teams, etc.)',
  `status` enum('scheduled','confirmed','rescheduled','completed','canceled','no_show') NOT NULL DEFAULT 'scheduled' COMMENT 'Current status',
  `user_confirmed` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'User confirmed attendance',
  `confirmation_date` datetime DEFAULT NULL COMMENT 'When user confirmed',
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Whether interview is active in the system',
  `preparation_instructions` text DEFAULT NULL COMMENT 'Instructions for user',
  `interviewer_instructions` text DEFAULT NULL COMMENT 'Instructions for interviewers',
  `assessment_criteria` text DEFAULT NULL COMMENT 'Criteria to evaluate',
  `notes` text DEFAULT NULL COMMENT 'General notes',
  `decision` enum('pending','successful','requires_followup','canceled','rescheduled','no_decision') NOT NULL DEFAULT 'pending' COMMENT 'Final decision',
  `decision_reason` text DEFAULT NULL COMMENT 'Reasoning for decision',
  `next_steps` text DEFAULT NULL COMMENT 'Next steps if any',
  `reminder_sent` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'Reminder has been sent',
  `reminder_sent_at` datetime DEFAULT NULL COMMENT 'When reminder was sent',
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the interview',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the interview',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Created timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Updated timestamp',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp',
  `duration_minutes` int(11) GENERATED ALWAYS AS (timestampdiff(MINUTE,concat(`scheduled_date`,' ',`start_time`),concat(`scheduled_date`,' ',`end_time`))) STORED COMMENT 'Duration in minutes'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Created by BollineniRohith123 on 2025-05-12 03:47:23';

--
-- Dumping data for table `user_interview_schedules`
--

INSERT INTO `user_interview_schedules` (`id`, `user_id`, `job_id`, `title`, `round`, `interview_type`, `scheduled_date`, `start_time`, `end_time`, `timezone`, `is_virtual`, `location`, `meeting_link`, `meeting_id`, `meeting_password`, `meeting_provider`, `status`, `user_confirmed`, `confirmation_date`, `is_active`, `preparation_instructions`, `interviewer_instructions`, `assessment_criteria`, `notes`, `decision`, `decision_reason`, `next_steps`, `reminder_sent`, `reminder_sent_at`, `created_by`, `updated_by`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 1, 'Initial Interview for Senior Developer Position', 1, 'onboarding', '2025-06-15', '10:00:00', '11:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/123456789', '123456789', '123456', 'Zoom', 'scheduled', 0, NULL, 1, 'Please prepare your portfolio and be ready to discuss your experience with React and Node.js.', 'Focus on technical skills and experience with our tech stack.', 'Technical knowledge, problem-solving, communication, cultural fit.', 'This is the first interview for this candidate.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:48', '2025-05-30 15:01:48', NULL),
(2, 2, 1, 'Technical Assessment for Full Stack Developer', 2, 'onboarding', '2025-06-20', '14:00:00', '16:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/987654321', '987654321', '654321', 'Zoom', 'scheduled', 1, '2025-06-15 00:00:00', 1, 'Please be prepared to complete a coding exercise during the interview.', 'Assess coding skills, problem-solving approach, and code quality.', 'Code structure, algorithm efficiency, error handling, testing approach.', 'Second round technical assessment after successful initial interview.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:48', '2025-05-30 15:01:48', NULL),
(3, 3, 2, 'Project Requirements Discussion with Client', 1, 'client_meeting', '2025-07-05', '09:00:00', '10:30:00', 'America/New_York', 1, NULL, 'https://teams.microsoft.com/l/meetup-join/123456789', '987654321', 'client123', 'Microsoft Teams', 'scheduled', 0, NULL, 1, 'Please review the project brief and prepare questions about requirements.', 'Gather detailed requirements and establish project scope.', 'Understanding of client needs, communication clarity, requirement gathering.', 'Initial meeting with client to discuss project requirements.', 'pending', NULL, NULL, 0, NULL, 1, NULL, '2025-05-30 15:01:48', '2025-05-30 15:01:48', NULL),
(4, 4, 1, 'Final Interview for UX Designer Position', 3, 'onboarding', '2025-05-10', '11:00:00', '12:00:00', 'America/New_York', 0, 'Conference Room B, Head Office', NULL, NULL, NULL, NULL, 'completed', 1, '2025-05-05 00:00:00', 1, 'Please bring your portfolio and be prepared to discuss your design process.', 'Assess design skills, process, and cultural fit.', 'Design portfolio, UX methodology, collaboration skills, communication.', 'Final interview after successful technical assessment.', 'successful', 'Strong portfolio and excellent cultural fit.', 'Proceed with offer letter.', 1, '2025-05-09 04:30:00', 1, NULL, '2025-05-01 00:00:00', '2025-05-11 00:00:00', NULL),
(5, 5, 2, 'Product Demo for Potential Client', 1, 'demo', '2025-05-25', '15:00:00', '16:00:00', 'America/New_York', 1, NULL, 'https://zoom.us/j/111222333', '111222333', '123123', 'Zoom', 'rescheduled', 0, NULL, 1, 'Please prepare a demo of our product focusing on the new features.', 'Showcase product capabilities and address client questions.', 'Product knowledge, presentation skills, handling of questions.', 'Demo for potential enterprise client. Originally scheduled for May 20.', 'pending', NULL, 'Follow up after the rescheduled demo.', 1, '2025-05-19 09:30:00', 1, NULL, '2025-05-10 00:00:00', '2025-05-19 00:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'Foreign key to users table',
  `skill_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON containing skill information' CHECK (json_valid(`skill_data`)),
  `created_by` int(11) DEFAULT NULL COMMENT 'User who created the record',
  `updated_by` int(11) DEFAULT NULL COMMENT 'User who last updated the record',
  `created_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Creation timestamp',
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Update timestamp',
  `deleted_at` datetime DEFAULT NULL COMMENT 'Soft delete timestamp'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `branches_is_active` (`is_active`),
  ADD KEY `branches_is_default` (`is_default`),
  ADD KEY `branches_city` (`city`),
  ADD KEY `branches_state` (`state`),
  ADD KEY `branches_country` (`country`),
  ADD KEY `branches_branch_type` (`branch_type`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_department_branch` (`name`,`branch_id`),
  ADD KEY `departments_is_active` (`is_active`),
  ADD KEY `departments_branch_id` (`branch_id`),
  ADD KEY `departments_short_code` (`short_code`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_designation_branch` (`name`,`branch_id`),
  ADD KEY `designations_is_active` (`is_active`),
  ADD KEY `designations_branch_id` (`branch_id`),
  ADD KEY `designations_short_code` (`short_code`);

--
-- Indexes for table `email_configs`
--
ALTER TABLE `email_configs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `is_active_default_idx` (`is_active`,`is_default`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_code` (`template_code`),
  ADD UNIQUE KEY `template_code_unique` (`template_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `is_active_idx` (`is_active`),
  ADD KEY `email_type_idx` (`email_type`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `employees_employee_id` (`employee_id`),
  ADD KEY `employees_email` (`email`),
  ADD KEY `employees_branch_id` (`branch_id`),
  ADD KEY `employees_department_id` (`department_id`),
  ADD KEY `employees_designation_id` (`designation_id`),
  ADD KEY `employees_reporting_to` (`reporting_to`),
  ADD KEY `employees_employment_status` (`employment_status`),
  ADD KEY `employees_is_active` (`is_active`),
  ADD KEY `employees_is_superadmin` (`is_superadmin`);

--
-- Indexes for table `employee_interview_calendar_events`
--
ALTER TABLE `employee_interview_calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `interview_calendar_unique` (`interview_id`,`calendar_type`),
  ADD KEY `event_id_idx` (`event_id`),
  ADD KEY `sync_status_idx` (`sync_status`),
  ADD KEY `is_active_idx` (`is_active`);

--
-- Indexes for table `employee_interview_schedules`
--
ALTER TABLE `employee_interview_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id_idx` (`employee_id`),
  ADD KEY `job_id_idx` (`job_id`),
  ADD KEY `scheduled_date_idx` (`scheduled_date`),
  ADD KEY `status_idx` (`status`),
  ADD KEY `decision_idx` (`decision`),
  ADD KEY `round_idx` (`round`),
  ADD KEY `interview_type_idx` (`interview_type`),
  ADD KEY `is_active_idx` (`is_active`),
  ADD KEY `employee_interview_schedules_employee_id` (`employee_id`),
  ADD KEY `employee_interview_schedules_job_id` (`job_id`),
  ADD KEY `employee_interview_schedules_scheduled_date` (`scheduled_date`),
  ADD KEY `employee_interview_schedules_status` (`status`),
  ADD KEY `employee_interview_schedules_decision` (`decision`),
  ADD KEY `employee_interview_schedules_round` (`round`),
  ADD KEY `employee_interview_schedules_interview_type` (`interview_type`),
  ADD KEY `employee_interview_schedules_is_active` (`is_active`);

--
-- Indexes for table `employee_interview_screenings`
--
ALTER TABLE `employee_interview_screenings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee_interview_screening_callid` (`callid`),
  ADD KEY `idx_employee_interview_screening_userid` (`userid`),
  ADD KEY `idx_employee_interview_screening_created` (`created`),
  ADD KEY `idx_employee_interview_screening_job_id` (`job_id`),
  ADD KEY `idx_employee_interview_screening_status` (`status`);

--
-- Indexes for table `employee_roles`
--
ALTER TABLE `employee_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_role_branch` (`employee_id`,`role_id`,`branch_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `employee_roles_employee_id` (`employee_id`),
  ADD KEY `employee_roles_role_id` (`role_id`),
  ADD KEY `employee_roles_branch_id` (`branch_id`),
  ADD KEY `employee_roles_is_primary` (`is_primary`),
  ADD KEY `employee_roles_is_active` (`is_active`);

--
-- Indexes for table `employee_skills`
--
ALTER TABLE `employee_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id_idx` (`employee_id`);

--
-- Indexes for table `general_settings`
--
ALTER TABLE `general_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `jobs_status_idx` (`status`),
  ADD KEY `jobs_job_type_idx` (`job_type`),
  ADD KEY `jobs_is_featured_idx` (`is_featured`),
  ADD KEY `jobs_created_at_idx` (`created_at`),
  ADD KEY `jobs_deadline_idx` (`deadline`),
  ADD KEY `jobs_location_idx` (`location_city`,`location_state`,`location_country`),
  ADD KEY `jobs_company_name_idx` (`company_name`),
  ADD KEY `jobs_is_remote_idx` (`is_remote`),
  ADD KEY `jobs_education_level_idx` (`education_level`),
  ADD KEY `jobs_experience_idx` (`min_experience`,`max_experience`),
  ADD KEY `jobs_status` (`status`),
  ADD KEY `jobs_job_type` (`job_type`),
  ADD KEY `jobs_is_featured` (`is_featured`),
  ADD KEY `jobs_created_at` (`created_at`),
  ADD KEY `jobs_deadline` (`deadline`),
  ADD KEY `jobs_location_city_location_state_location_country` (`location_city`,`location_state`,`location_country`),
  ADD KEY `jobs_company_name` (`company_name`),
  ADD KEY `jobs_is_remote` (`is_remote`),
  ADD KEY `jobs_education_level` (`education_level`),
  ADD KEY `jobs_min_experience_max_experience` (`min_experience`,`max_experience`);

--
-- Indexes for table `newjobtables`
--
ALTER TABLE `newjobtables`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `idx_newjobtable_department` (`department_id`),
  ADD KEY `idx_newjobtable_assigned_to` (`assigned_to_employee_id`),
  ADD KEY `idx_newjobtable_status` (`status`);

--
-- Indexes for table `payment_configurations`
--
ALTER TABLE `payment_configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gateway_code` (`gateway_code`),
  ADD UNIQUE KEY `gateway_code_unique` (`gateway_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `is_active_priority_idx` (`is_active`,`priority`);

--
-- Indexes for table `permission_categories`
--
ALTER TABLE `permission_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `short_code` (`short_code`),
  ADD UNIQUE KEY `permission_categories_short_code` (`short_code`),
  ADD KEY `permission_categories_perm_group_id` (`perm_group_id`),
  ADD KEY `permission_categories_is_active` (`is_active`),
  ADD KEY `permission_categories_is_system` (`is_system`),
  ADD KEY `permission_categories_display_order` (`display_order`);

--
-- Indexes for table `permission_groups`
--
ALTER TABLE `permission_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `short_code` (`short_code`),
  ADD UNIQUE KEY `permission_groups_short_code` (`short_code`),
  ADD KEY `permission_groups_is_active` (`is_active`),
  ADD KEY `permission_groups_is_system` (`is_system`),
  ADD KEY `fk_permission_groups_created_by` (`created_by`),
  ADD KEY `fk_permission_groups_updated_by` (`updated_by`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `roles_is_active_new` (`is_active`),
  ADD KEY `roles_is_system_new` (`is_system`),
  ADD KEY `roles_branch_id_new` (`branch_id`),
  ADD KEY `roles_priority_new` (`priority`),
  ADD KEY `roles_is_active` (`is_active`),
  ADD KEY `roles_is_system` (`is_system`),
  ADD KEY `roles_branch_id` (`branch_id`),
  ADD KEY `roles_priority` (`priority`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_role_perm` (`role_id`,`perm_cat_id`,`branch_id`),
  ADD UNIQUE KEY `role_permissions_role_id_perm_cat_id_branch_id` (`role_id`,`perm_cat_id`,`branch_id`),
  ADD KEY `role_permissions_role_id` (`role_id`),
  ADD KEY `role_permissions_perm_cat_id` (`perm_cat_id`),
  ADD KEY `role_permissions_branch_id` (`branch_id`),
  ADD KEY `role_permissions_is_active` (`is_active`),
  ADD KEY `role_permissions_created_by` (`created_by`),
  ADD KEY `role_permissions_updated_by` (`updated_by`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sidebar_menus`
--
ALTER TABLE `sidebar_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `sidebar_menus_permission_group_id` (`permission_group_id`),
  ADD KEY `sidebar_menus_is_active` (`is_active`),
  ADD KEY `sidebar_menus_is_system` (`is_system`),
  ADD KEY `sidebar_menus_display_order` (`display_order`),
  ADD KEY `sidebar_menus_level` (`level`),
  ADD KEY `sidebar_menus_system_level` (`system_level`),
  ADD KEY `sidebar_menus_sidebar_display` (`sidebar_display`),
  ADD KEY `sidebar_menus_lang_key` (`lang_key`);

--
-- Indexes for table `sidebar_sub_menus`
--
ALTER TABLE `sidebar_sub_menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `sidebar_sub_menus_sidebar_menu_id` (`sidebar_menu_id`),
  ADD KEY `sidebar_sub_menus_permission_category_id` (`permission_category_id`),
  ADD KEY `sidebar_sub_menus_is_active` (`is_active`),
  ADD KEY `sidebar_sub_menus_is_system` (`is_system`),
  ADD KEY `sidebar_sub_menus_display_order` (`display_order`),
  ADD KEY `sidebar_sub_menus_level` (`level`),
  ADD KEY `sidebar_sub_menus_system_level` (`system_level`),
  ADD KEY `sidebar_sub_menus_sidebar_display` (`sidebar_display`),
  ADD KEY `sidebar_sub_menus_lang_key` (`lang_key`);

--
-- Indexes for table `sms_configurations`
--
ALTER TABLE `sms_configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gateway_code` (`gateway_code`),
  ADD UNIQUE KEY `gateway_code_unique` (`gateway_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `is_active_priority_idx` (`is_active`,`priority`);

--
-- Indexes for table `sms_templates`
--
ALTER TABLE `sms_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `template_code` (`template_code`),
  ADD UNIQUE KEY `template_code_unique` (`template_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `category_idx` (`category`),
  ADD KEY `is_active_idx` (`is_active`);

--
-- Indexes for table `social_media_links`
--
ALTER TABLE `social_media_links`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `platform_code` (`platform_code`),
  ADD UNIQUE KEY `platform_code_unique` (`platform_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `updated_by` (`updated_by`),
  ADD KEY `is_active_idx` (`is_active`);

--
-- Indexes for table `talent_spark_configurations`
--
ALTER TABLE `talent_spark_configurations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branch_name_unique` (`branch_id`,`name`),
  ADD KEY `branch_id_idx` (`branch_id`),
  ADD KEY `is_active_idx` (`is_active`),
  ADD KEY `is_default_idx` (`is_default`),
  ADD KEY `status_idx` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD KEY `users_employee_id` (`employee_id`),
  ADD KEY `users_username` (`username`),
  ADD KEY `users_email` (`email`),
  ADD KEY `users_google_id` (`google_id`),
  ADD KEY `users_user_type` (`user_type`),
  ADD KEY `users_default_branch_id` (`default_branch_id`),
  ADD KEY `users_is_active` (`is_active`),
  ADD KEY `users_is_system` (`is_system`),
  ADD KEY `users_created_by` (`created_by`),
  ADD KEY `users_updated_by` (`updated_by`);

--
-- Indexes for table `user_interview_calendar_events`
--
ALTER TABLE `user_interview_calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `interview_calendar_unique` (`interview_id`,`calendar_type`),
  ADD KEY `event_id_idx` (`event_id`),
  ADD KEY `sync_status_idx` (`sync_status`),
  ADD KEY `is_active_idx` (`is_active`);

--
-- Indexes for table `user_interview_schedules`
--
ALTER TABLE `user_interview_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `job_id_idx` (`job_id`),
  ADD KEY `scheduled_date_idx` (`scheduled_date`),
  ADD KEY `status_idx` (`status`),
  ADD KEY `decision_idx` (`decision`),
  ADD KEY `round_idx` (`round`),
  ADD KEY `interview_type_idx` (`interview_type`),
  ADD KEY `is_active_idx` (`is_active`),
  ADD KEY `user_interview_schedules_user_id` (`user_id`),
  ADD KEY `user_interview_schedules_job_id` (`job_id`),
  ADD KEY `user_interview_schedules_scheduled_date` (`scheduled_date`),
  ADD KEY `user_interview_schedules_status` (`status`),
  ADD KEY `user_interview_schedules_decision` (`decision`),
  ADD KEY `user_interview_schedules_round` (`round`),
  ADD KEY `user_interview_schedules_interview_type` (`interview_type`),
  ADD KEY `user_interview_schedules_is_active` (`is_active`);

--
-- Indexes for table `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_idx` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `email_configs`
--
ALTER TABLE `email_configs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_interview_calendar_events`
--
ALTER TABLE `employee_interview_calendar_events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_interview_schedules`
--
ALTER TABLE `employee_interview_schedules`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `employee_interview_screenings`
--
ALTER TABLE `employee_interview_screenings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for the screening record', AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `employee_roles`
--
ALTER TABLE `employee_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employee_skills`
--
ALTER TABLE `employee_skills`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_settings`
--
ALTER TABLE `general_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newjobtables`
--
ALTER TABLE `newjobtables`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier for the job', AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `permission_categories`
--
ALTER TABLE `permission_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `permission_groups`
--
ALTER TABLE `permission_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `role_permissions`
--
ALTER TABLE `role_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `sidebar_menus`
--
ALTER TABLE `sidebar_menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `sidebar_sub_menus`
--
ALTER TABLE `sidebar_sub_menus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `social_media_links`
--
ALTER TABLE `social_media_links`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `talent_spark_configurations`
--
ALTER TABLE `talent_spark_configurations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_interview_calendar_events`
--
ALTER TABLE `user_interview_calendar_events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_interview_schedules`
--
ALTER TABLE `user_interview_schedules`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `email_configs`
--
ALTER TABLE `email_configs`
  ADD CONSTRAINT `email_configs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `email_configs_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `employees` (`id`);

--
-- Constraints for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD CONSTRAINT `email_templates_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `email_templates_ibfk_2` FOREIGN KEY (`updated_by`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `employees_ibfk_4` FOREIGN KEY (`reporting_to`) REFERENCES `employees` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `employee_interview_calendar_events`
--
ALTER TABLE `employee_interview_calendar_events`
  ADD CONSTRAINT `employee_interview_calendar_events_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `employee_interview_schedules` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
