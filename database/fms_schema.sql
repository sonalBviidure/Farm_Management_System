-- =============================================================================
-- DATABASE SCHEMA: FARM MANAGEMENT SYSTEM (FMS)
-- Project: MCA-II Academic Project
-- RDBMS: MySQL 8.0+ / InnoDB / utf8mb4
-- Authors: Sonali Bhauso Vidure (Leader) & Shraddha Suresh Gurav
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `farm_management_db`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `farm_management_db`;

-- -----------------------------------------------------------------------------
-- 1. TABLE: FARMER (Primary User Entity)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `profit_predictions`;
DROP TABLE IF EXISTS `yield_predictions`;
DROP TABLE IF EXISTS `crop_recommendations`;
DROP TABLE IF EXISTS `financial_analysis`;
DROP TABLE IF EXISTS `sales`;
DROP TABLE IF EXISTS `harvests`;
DROP TABLE IF EXISTS `expenses`;
DROP TABLE IF EXISTS `crops`;
DROP TABLE IF EXISTS `fields`;
DROP TABLE IF EXISTS `farmers`;

CREATE TABLE `farmers` (
    `farmer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `phone` VARCHAR(15) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `location` VARCHAR(200) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_farmer_phone` (`phone`),
    INDEX `idx_farmer_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. TABLE: FIELD (Agricultural Land Parcels)
-- -----------------------------------------------------------------------------
CREATE TABLE `fields` (
    `field_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_id` INT NOT NULL,
    `field_name` VARCHAR(100) NOT NULL,
    `land_area` DECIMAL(8, 2) NOT NULL,
    `soil_type` VARCHAR(50) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_field_farmer`
        FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`farmer_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_field_farmer` (`farmer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. TABLE: CROP (Cultivation Cycles)
-- -----------------------------------------------------------------------------
CREATE TABLE `crops` (
    `crop_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_id` INT NOT NULL,
    `field_id` INT NOT NULL,
    `crop_name` VARCHAR(100) NOT NULL,
    `variety` VARCHAR(100) DEFAULT NULL,
    `season` VARCHAR(30) NOT NULL,
    `sowing_date` DATE NOT NULL,
    `status` ENUM('Sown', 'Growing', 'Harvested', 'Closed') NOT NULL DEFAULT 'Sown',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_crop_farmer`
        FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`farmer_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_crop_field`
        FOREIGN KEY (`field_id`) REFERENCES `fields` (`field_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_crop_farmer` (`farmer_id`),
    INDEX `idx_crop_field` (`field_id`),
    INDEX `idx_crop_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. TABLE: EXPENSE (Cultivation Expenditures)
-- -----------------------------------------------------------------------------
CREATE TABLE `expenses` (
    `expense_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_id` INT NOT NULL,
    `expense_category` ENUM(
        'Seeds', 'Labour', 'Fertilizers', 'Pesticides',
        'Irrigation', 'Machinery', 'Transportation', 'Other'
    ) NOT NULL,
    `description` VARCHAR(255) DEFAULT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `expense_date` DATE NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_expense_crop`
        FOREIGN KEY (`crop_id`) REFERENCES `crops` (`crop_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_expense_crop` (`crop_id`),
    INDEX `idx_expense_category` (`expense_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. TABLE: HARVEST (Crop Yield Records)
-- -----------------------------------------------------------------------------
CREATE TABLE `harvests` (
    `harvest_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_id` INT NOT NULL,
    `harvest_date` DATE NOT NULL,
    `quantity_harvested` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(20) NOT NULL DEFAULT 'Quintals',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_harvest_crop`
        FOREIGN KEY (`crop_id`) REFERENCES `crops` (`crop_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_harvest_crop` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. TABLE: SALE (Market Produce Realization)
-- -----------------------------------------------------------------------------
CREATE TABLE `sales` (
    `sale_id` INT AUTO_INCREMENT PRIMARY KEY,
    `harvest_id` INT NOT NULL,
    `quantity_sold` DECIMAL(10, 2) NOT NULL,
    `selling_price` DECIMAL(10, 2) NOT NULL,
    `total_amount` DECIMAL(12, 2) GENERATED ALWAYS AS (`quantity_sold` * `selling_price`) STORED,
    `sale_date` DATE NOT NULL,
    `buyer_name` VARCHAR(120) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sale_harvest`
        FOREIGN KEY (`harvest_id`) REFERENCES `harvests` (`harvest_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_sale_harvest` (`harvest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. TABLE: FINANCIAL_ANALYSIS (Crop-Wise Economics)
-- -----------------------------------------------------------------------------
CREATE TABLE `financial_analysis` (
    `analysis_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_id` INT NOT NULL UNIQUE,
    `total_cost` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_revenue` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `profit_loss` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `cost_per_acre` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `profit_per_acre` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `calculated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_analysis_crop`
        FOREIGN KEY (`crop_id`) REFERENCES `crops` (`crop_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_analysis_crop` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. TABLE: CROP_RECOMMENDATION (AI Advisory Ingestion & Output)
-- -----------------------------------------------------------------------------
CREATE TABLE `crop_recommendations` (
    `recommendation_id` INT AUTO_INCREMENT PRIMARY KEY,
    `farmer_id` INT NOT NULL,
    `soil_type` VARCHAR(50) NOT NULL,
    `season` VARCHAR(30) NOT NULL,
    `weather_conditions` VARCHAR(150) NOT NULL,
    `irrigation_type` VARCHAR(50) NOT NULL,
    `recommended_crop` VARCHAR(100) NOT NULL,
    `recommendation_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rec_farmer`
        FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`farmer_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_rec_farmer` (`farmer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. TABLE: YIELD_PREDICTION (ML Regressor Outputs)
-- -----------------------------------------------------------------------------
CREATE TABLE `yield_predictions` (
    `prediction_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_id` INT NOT NULL,
    `land_area` DECIMAL(8, 2) NOT NULL,
    `season` VARCHAR(30) NOT NULL,
    `soil_type` VARCHAR(50) NOT NULL,
    `fertilizer_use` VARCHAR(100) DEFAULT NULL,
    `rainfall` DECIMAL(8, 2) DEFAULT NULL,
    `predicted_yield` DECIMAL(10, 2) NOT NULL,
    `prediction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_yield_crop`
        FOREIGN KEY (`crop_id`) REFERENCES `crops` (`crop_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_yield_crop` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. TABLE: PROFIT_PREDICTION (ML Profit Forecasting)
-- -----------------------------------------------------------------------------
CREATE TABLE `profit_predictions` (
    `profit_prediction_id` INT AUTO_INCREMENT PRIMARY KEY,
    `crop_id` INT NOT NULL,
    `estimated_cost` DECIMAL(10, 2) NOT NULL,
    `predicted_yield` DECIMAL(10, 2) NOT NULL,
    `estimated_selling_price` DECIMAL(10, 2) NOT NULL,
    `predicted_profit` DECIMAL(12, 2) NOT NULL,
    `prediction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_profit_crop`
        FOREIGN KEY (`crop_id`) REFERENCES `crops` (`crop_id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_profit_crop` (`crop_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
