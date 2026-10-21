# Database Design Document - Farm Management System (FMS)

**Project Title:** Farm Management System (FMS)  
**Academic Level:** MCA-II Project Documentation  
**Primary User:** Farmer  
**RDBMS:** MySQL 8.0+  
**Storage Engine:** InnoDB  
**Character Set / Collation:** `utf8mb4` / `utf8mb4_unicode_ci`  
**Backend Framework:** Django 5.0 / Django REST Framework  

---

## 1. Database Overview & Objectives

The **Farm Management System (FMS)** database is designed to manage agricultural cultivation lifecycles, operational farm expenses, harvest yields, produce sales, financial profitability metrics, and machine learning advisories (crop recommendation, yield estimation, and profit forecasting).

### Key Design Goals:
1. **Single Primary Role Focus:** Structured specifically for the **Farmer** without unnecessary multi-role administrative complexity.
2. **Referential Integrity:** Enforced via Foreign Keys with `ON DELETE CASCADE` and `ON UPDATE CASCADE` across all child entities.
3. **Third Normal Form (3NF) Compliance:** Completely normalized to eliminate data redundancy, update anomalies, and insertion/deletion anomalies.
4. **Precision Financials:** High-precision `DECIMAL(10,2)` and `DECIMAL(12,2)` data types for accurate currency and land calculations.
5. **AI/ML Model Decoupling:** Standalone tables storing inputs and prediction outputs for seamless integration with Scikit-Learn pipelines.

---

## 2. Entity Summary & Cardinality Matrix

| Entity | Primary Key | Parent Entity | Foreign Key | Cardinality | Functional Scope |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`farmers`** | `farmer_id` | *None (Root)* | — | — | Farmer personal profile & login credentials. |
| **`fields`** | `field_id` | `farmers` | `farmer_id` | 1 : M | Land parcels, area (acres), and soil classification. |
| **`crops`** | `crop_id` | `farmers`, `fields` | `farmer_id`, `field_id` | 1 : M | Sown crop varieties, seasons, dates, and active status. |
| **`expenses`** | `expense_id` | `crops` | `crop_id` | 1 : M | Cultivation costs categorized into seeds, labor, etc. |
| **`harvests`** | `harvest_id` | `crops` | `crop_id` | 1 : M | Crop output yields, harvested dates, and units. |
| **`sales`** | `sale_id` | `harvests` | `harvest_id` | 1 : M | Market produce sales transactions and buyer details. |
| **`financial_analysis`** | `analysis_id` | `crops` | `crop_id` (Unique) | 1 : 1 | Cost per acre, revenue, net profit/loss calculations. |
| **`crop_recommendations`** | `recommendation_id` | `farmers` | `farmer_id` | 1 : M | AI crop recommendations based on soil & weather. |
| **`yield_predictions`** | `prediction_id` | `crops` | `crop_id` | 1 : M | AI crop yield regression estimates per acre. |
| **`profit_predictions`** | `profit_prediction_id`| `crops` | `crop_id` | 1 : M | AI market price & net profit margin forecasts. |

---

## 3. Data Dictionary (Table-by-Table Schema Specification)

### 3.1 Table: `farmers`
Stores registration and authentication details for farmers.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `farmer_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for each farmer. |
| `name` | VARCHAR(100) | NOT NULL | — | Farmer full name. |
| `email` | VARCHAR(120) | NOT NULL, UNIQUE | — | Email address for communications. |
| `phone` | VARCHAR(15) | NOT NULL, UNIQUE, INDEX | — | 10-digit mobile number used for login. |
| `password` | VARCHAR(255) | NOT NULL | — | Securely hashed password (PBKDF2 / Argon2). |
| `location` | VARCHAR(200) | NOT NULL | — | Village, Taluka, and District location. |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Account creation timestamp. |
| `updated_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Last profile update timestamp. |

---

### 3.2 Table: `fields`
Maintains plots or land parcels owned/managed by the farmer.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `field_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for each field parcel. |
| `farmer_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `farmers(farmer_id)`. |
| `field_name` | VARCHAR(100) | NOT NULL | — | Human-readable name (e.g., "North Plot"). |
| `land_area` | DECIMAL(8, 2) | NOT NULL | — | Total field size measured in Acres. |
| `soil_type` | VARCHAR(50) | NOT NULL | — | Soil class (Black, Red, Loamy, Alluvial, Clayey). |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Record insertion timestamp. |

---

### 3.3 Table: `crops`
Tracks seasonal cultivation cycles associated with a specific field and farmer.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `crop_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for the crop cycle. |
| `farmer_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `farmers(farmer_id)`. |
| `field_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `fields(field_id)`. |
| `crop_name` | VARCHAR(100) | NOT NULL | — | Crop name (Sugarcane, Soybean, Wheat, etc.). |
| `variety` | VARCHAR(100) | NULL | NULL | Seed variety or hybrid code (e.g., "JS 335"). |
| `season` | VARCHAR(30) | NOT NULL | — | Season (Kharif, Rabi, Zaid, Annual). |
| `sowing_date` | DATE | NOT NULL | — | Date on which sowing/planting occurred. |
| `status` | ENUM | NOT NULL, INDEX | 'Sown' | State: `'Sown'`, `'Growing'`, `'Harvested'`, `'Closed'`. |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Timestamp when crop was logged. |
| `updated_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Last status update timestamp. |

---

### 3.4 Table: `expenses`
Records itemized cultivation expenditures incurred during a crop lifecycle.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `expense_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for the expense voucher. |
| `crop_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `crops(crop_id)`. |
| `expense_category` | ENUM | NOT NULL, INDEX | — | `'Seeds'`, `'Labour'`, `'Fertilizers'`, `'Pesticides'`, `'Irrigation'`, `'Machinery'`, `'Transportation'`, `'Other'`. |
| `description` | VARCHAR(255) | NULL | NULL | Specific notes (e.g., "5 laborers for weeding"). |
| `amount` | DECIMAL(10, 2) | NOT NULL | — | Cost in INR (₹). |
| `expense_date` | DATE | NOT NULL | — | Transaction date. |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | System entry timestamp. |

---

### 3.5 Table: `harvests`
Records produce yield outputs upon crop maturity.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `harvest_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for the harvest batch. |
| `crop_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `crops(crop_id)`. |
| `harvest_date` | DATE | NOT NULL | — | Date harvest was completed. |
| `quantity_harvested` | DECIMAL(10, 2) | NOT NULL | — | Total quantity harvested. |
| `unit` | VARCHAR(20) | NOT NULL | 'Quintals' | Measurement unit (Quintals, Tonnes, Bags, Kgs). |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Entry creation timestamp. |

---

### 3.6 Table: `sales`
Logs produce trade transactions to market buyers.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `sale_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique identifier for the sales transaction. |
| `harvest_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `harvests(harvest_id)`. |
| `quantity_sold` | DECIMAL(10, 2) | NOT NULL | — | Quantity sold in harvest units. |
| `selling_price` | DECIMAL(10, 2) | NOT NULL | — | Selling price per unit (₹/Quintal or ₹/Tonne). |
| `total_amount` | DECIMAL(12, 2) | GENERATED ALWAYS AS | — | `quantity_sold * selling_price`. |
| `sale_date` | DATE | NOT NULL | — | Transaction execution date. |
| `buyer_name` | VARCHAR(120) | NOT NULL | — | Trader / APMC Mandi / Wholesale buyer name. |
| `created_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Record timestamp. |

---

### 3.7 Table: `financial_analysis`
Stores consolidated financial returns per crop cultivation cycle.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `analysis_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique analysis record identifier. |
| `crop_id` | INT | NOT NULL, UNIQUE, FOREIGN KEY | — | 1:1 Reference to `crops(crop_id)`. |
| `total_cost` | DECIMAL(12, 2) | NOT NULL | 0.00 | Sum of all `expenses.amount` for this crop. |
| `total_revenue` | DECIMAL(12, 2) | NOT NULL | 0.00 | Sum of all `sales.total_amount` for this crop. |
| `profit_loss` | DECIMAL(12, 2) | NOT NULL | 0.00 | `total_revenue - total_cost`. |
| `cost_per_acre` | DECIMAL(10, 2) | NOT NULL | 0.00 | `total_cost / fields.land_area`. |
| `profit_per_acre`| DECIMAL(10, 2) | NOT NULL | 0.00 | `profit_loss / fields.land_area`. |
| `calculated_at` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Calculation/re-computation timestamp. |

---

### 3.8 Table: `crop_recommendations`
Stores inputs and outputs of the AI Crop Recommendation model (Random Forest / Decision Tree).

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `recommendation_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique recommendation record ID. |
| `farmer_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `farmers(farmer_id)`. |
| `soil_type` | VARCHAR(50) | NOT NULL | — | Soil composition (Clayey, Loamy, Black, Sandy). |
| `season` | VARCHAR(30) | NOT NULL | — | Intended farming season. |
| `weather_conditions` | VARCHAR(150) | NOT NULL | — | Rainfall, temperature, humidity conditions. |
| `irrigation_type` | VARCHAR(50) | NOT NULL | — | Available irrigation (Drip, Sprinkler, Canal). |
| `recommended_crop` | VARCHAR(100) | NOT NULL | — | Crop recommended by ML model. |
| `recommendation_date` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Date and time recommendation was run. |

---

### 3.9 Table: `yield_predictions`
Stores inputs and regression results for expected crop yield in tonnes/quintals.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `prediction_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique prediction record ID. |
| `crop_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `crops(crop_id)`. |
| `land_area` | DECIMAL(8, 2) | NOT NULL | — | Sown land area in acres. |
| `season` | VARCHAR(30) | NOT NULL | — | Cultivation season. |
| `soil_type` | VARCHAR(50) | NOT NULL | — | Soil type of the field. |
| `fertilizer_use` | VARCHAR(100) | NULL | NULL | Fertilizer dosage applied. |
| `rainfall` | DECIMAL(8, 2) | NULL | NULL | Seasonal rainfall in millimeters (mm). |
| `predicted_yield` | DECIMAL(10, 2) | NOT NULL | — | Predicted harvest output in Quintals/Tonnes. |
| `prediction_date` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Timestamp of ML model execution. |

---

### 3.10 Table: `profit_predictions`
Stores predictive financial forecasts based on yield estimates, cost projections, and mandi market rates.

| Column Name | Data Type | Constraints | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `profit_prediction_id` | INT | PRIMARY KEY, AUTO_INCREMENT | — | Unique profit prediction ID. |
| `crop_id` | INT | NOT NULL, FOREIGN KEY, INDEX | — | References `crops(crop_id)`. |
| `estimated_cost` | DECIMAL(10, 2) | NOT NULL | — | Total projected cultivation expenditure (₹). |
| `predicted_yield` | DECIMAL(10, 2) | NOT NULL | — | Output yield anticipated (Quintals/Tonnes). |
| `estimated_selling_price` | DECIMAL(10, 2) | NOT NULL | — | Expected APMC mandi rate per unit (₹). |
| `predicted_profit` | DECIMAL(12, 2) | NOT NULL | — | `(predicted_yield * estimated_selling_price) - estimated_cost`. |
| `prediction_date` | DATETIME | NOT NULL | CURRENT_TIMESTAMP | Timestamp of prediction generation. |

---

## 4. Normalization Analysis (1NF, 2NF, 3NF)

The database strictly complies with **Third Normal Form (3NF)**:

1. **First Normal Form (1NF):**
   - Every column contains atomic (indivisible) values.
   - No repeating groups or arrays (e.g., individual expenses are separate rows in `expenses` rather than comma-separated lists in `crops`).
   - Every table has a clearly defined Primary Key.

2. **Second Normal Form (2NF):**
   - Meets all 1NF rules.
   - All tables use single-attribute surrogate primary keys (`INT AUTO_INCREMENT`), which completely eliminates any partial functional dependency. Every non-key attribute depends entirely on the primary key.

3. **Third Normal Form (3NF):**
   - Meets all 2NF rules.
   - No transitive dependencies exist. Non-key attributes depend solely on the primary key and not on other non-key attributes.
   - Derived values (such as `total_cost`, `total_revenue`, and `profit_loss` in `financial_analysis`) are either generated dynamically via SQL aggregate queries or stored in a dedicated downstream evaluation table to preserve transactional performance.

---

## 5. SQL Implementation Script (`fms_schema.sql`)

The complete DDL script has been written to [`database/fms_schema.sql`](file:///d:/SEM_3/FMS/database/fms_schema.sql).

---

## 6. Financial Computation Engine (SQL Query / View)

To automatically compute or refresh the `financial_analysis` table for any crop, the following SQL query aggregates total expenses, sales revenue, and land metrics:

```sql
SELECT 
    c.crop_id,
    c.crop_name,
    fld.land_area AS acres,
    
    -- Total Cultivation Cost (Sum of all expenses)
    COALESCE(SUM(DISTINCT e_agg.total_exp), 0.00) AS total_cost,
    
    -- Total Sales Revenue (Sum of all sales)
    COALESCE(SUM(DISTINCT s_agg.total_rev), 0.00) AS total_revenue,
    
    -- Net Profit / Loss = Revenue - Cost
    (COALESCE(SUM(DISTINCT s_agg.total_rev), 0.00) - COALESCE(SUM(DISTINCT e_agg.total_exp), 0.00)) AS profit_loss,
    
    -- Cost per Acre = Total Cost / Land Area
    ROUND(COALESCE(SUM(DISTINCT e_agg.total_exp), 0.00) / fld.land_area, 2) AS cost_per_acre,
    
    -- Profit per Acre = Profit/Loss / Land Area
    ROUND((COALESCE(SUM(DISTINCT s_agg.total_rev), 0.00) - COALESCE(SUM(DISTINCT e_agg.total_exp), 0.00)) / fld.land_area, 2) AS profit_per_acre

FROM crops c
JOIN fields fld ON c.field_id = fld.field_id

-- Subquery for Total Expenses per Crop
LEFT JOIN (
    SELECT crop_id, SUM(amount) AS total_exp 
    FROM expenses 
    GROUP BY crop_id
) e_agg ON c.crop_id = e_agg.crop_id

-- Subquery for Total Sales Revenue per Crop
LEFT JOIN (
    SELECT h.crop_id, SUM(s.quantity_sold * s.selling_price) AS total_rev
    FROM harvests h
    JOIN sales s ON h.harvest_id = s.harvest_id
    GROUP BY h.crop_id
) s_agg ON c.crop_id = s_agg.crop_id

WHERE c.crop_id = 1
GROUP BY c.crop_id, c.crop_name, fld.land_area;
```
