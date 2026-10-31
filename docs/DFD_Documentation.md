# Data Flow Diagrams (DFD) - Farm Management System (FMS)

**Project:** Farm Management System (FMS)  
**Academic Level:** MCA-II Project Documentation  
**Team Leader:** Sonali Bhauso Vidure  
**Team Member:** Shraddha Suresh Gurav  
**Architecture:** Django REST Framework + React.js + MySQL + Scikit-Learn  

---

## 1. DFD Notation Reference (Gane-Sarson / Yourdon & DeMarco)

| Element | Symbol / Representation | Description |
| :--- | :--- | :--- |
| **External Entity** | `[Entity Name]` (Rectangle) | External sources or destinations of data (e.g., Farmer, Market Buyer, Admin, Weather Service). |
| **Process** | `((Process Name))` or `([P# Process])` (Circle / Rounded Rectangle) | Operations, calculations, and transformations applied to data. |
| **Data Store** | `[("D# Store Name")]` (Open Rectangle / Cylinder) | Data storage repositories (e.g., MySQL Database tables, ML models). |
| **Data Flow** | `── Label ──>` (Directional Arrow) | Path along which data moves between entities, processes, and stores. |

---

## 2. Level 0 DFD (Context Level Diagram)

The **Context Diagram (Level 0 DFD)** represents the entire Farm Management System as a single centralized process bubble (`0.0`), identifying system boundaries, external actors, input flows, and output flows.

```mermaid
flowchart TD
    %% External Entities
    Farmer["👨‍🌾 Farmer / Producer"]
    Admin["👨‍💼 System Admin / Agro Officer"]
    Buyer["🏪 Mandi / Market Buyer"]
    WeatherAPI["🌤️ Agro-Climatic / Weather API"]

    %% Main Process
    FMS(["0.0<br/><b>Farm Management System (FMS)</b><br/><i>Core Agricultural Platform</i>"])

    %% Farmer Flows
    Farmer -->|"Registration & Credentials<br/>(Phone, Password, Location, Acres)"| FMS
    Farmer -->|"Crop Cultivation Data<br/>(Variety, Sowing Date, Season, Acreage)"| FMS
    Farmer -->|"Expense Records<br/>(Seeds, Fertilizers, Labor, Machinery)"| FMS
    Farmer -->|"Harvest & Sales Records<br/>(Yield Qty, Quality, Sale Rate, Buyer)"| FMS
    Farmer -->|"Soil & Weather Parameters<br/>(N, P, K, pH, Rainfall, Temperature)"| FMS

    FMS -->|"Auth Token & Profile Status"| Farmer
    FMS -->|"Active Crop Summaries & Cultivation Logs"| Farmer
    FMS -->|"Expense Breakdowns & Cost Summaries"| Farmer
    FMS -->|"Financial KPI Dashboard<br/>(Revenue, Profit/Loss, Cost/Acre, ROI)"| Farmer
    FMS -->|"AI Decision Reports<br/>(Crop Recommendation, Yield & Profit Forecasts)"| Farmer

    %% Admin Flows
    Admin -->|"System Configs, Mandi Benchmarks & Crop Master"| FMS
    FMS -->|"Aggregated Agro-Analytics, Audit Logs & System Health"| Admin

    %% Buyer Flows
    Buyer -->|"Purchase Orders & Payment Acknowledgments"| FMS
    FMS -->|"Produce Availability & Sales Invoices"| Buyer

    %% Weather API Flows
    WeatherAPI -->|"Real-time Agro-Climatic & Rainfall Feeds"| FMS

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:3px,color:#1b4332;
    class Farmer,Admin,Buyer,WeatherAPI entity;
    class FMS process;
```

---

## 3. Level 1 DFD (System Overview & Functional Decomposition)

The **Level 1 DFD** decomposes Process `0.0` into the six fundamental operational sub-processes of the Farm Management System and connects them with data stores (`D1` through `D5`).

```mermaid
flowchart TB
    %% External Entities
    Farmer["👨‍🌾 Farmer"]
    Admin["👨‍💼 System Admin"]
    Buyer["🏪 Mandi / Buyer"]
    AgroSource["🌤️ Soil & Weather Data"]

    %% Processes
    P1(["1.0<br/>Farmer Authentication &<br/>Profile Management"])
    P2(["2.0<br/>Crop Cultivation &<br/>Lifecycle Tracking"])
    P3(["3.0<br/>Farm Expense<br/>Management"])
    P4(["4.0<br/>Harvest & Market Sales<br/>Management"])
    P5(["5.0<br/>Financial Analytics &<br/>Performance Reporting"])
    P6(["6.0<br/>AI Decision Support &<br/>Predictive Advisory Engine"])

    %% Data Stores
    D1[("D1: Farmer Profiles & Auth Store<br/>(auth_user, api_farmerprofile)")]
    D2[("D2: Crops & Cultivation Store<br/>(api_crop, sowing_records)")]
    D3[("D3: Farming Expenses Store<br/>(api_expense, categories)")]
    D4[("D4: Harvest & Sales Store<br/>(api_harvest, api_sales)")]
    D5[("D5: AI Models & Historical Agro Store<br/>(ml_models, crop_yield_data)")]

    %% P1 Flows
    Farmer -->|"Signup / Login Info (Phone, Password)"| P1
    P1 -->|"Farmer Record (User, Phone, Acres)"| D1
    D1 -->|"Profile Credentials & Token"| P1
    P1 -->|"Auth Token & Dashboard Access"| Farmer

    %% P2 Flows
    Farmer -->|"Crop Details (Variety, Season, Sowing Date, Area)"| P2
    D1 -.->|"Verify Farmer ID & Total Acres"| P2
    P2 -->|"New Crop Entry / Status Update"| D2
    D2 -->|"Crop Cultivation History"| P2
    P2 -->|"Active Crops List & Sowing Confirmation"| Farmer

    %% P3 Flows
    Farmer -->|"Expense Entry (Category, Cost, Date, Crop ID)"| P3
    D2 -.->|"Validate Crop ID"| P3
    P3 -->|"Store Cultivation Expenditure"| D3
    D3 -->|"Expense Ledger Records"| P3
    P3 -->|"Expense Summaries & Categorized Totals"| Farmer

    %% P4 Flows
    Farmer -->|"Harvest Log (Qty, Date, Grade)"| P4
    Farmer -->|"Sale Details (Buyer, Mandi Rate, Qty Sold)"| P4
    Buyer -->|"Purchase Confirmation & Settlement"| P4
    D2 -.->|"Validate Crop ID"| P4
    P4 -->|"Store Harvest & Sales Transactions"| D4
    D4 -->|"Harvest & Sales History"| P4
    P4 -->|"Sales Receipts & Produce Dispatch Log"| Farmer
    P4 -->|"Produce Availability & Sales Invoices"| Buyer

    %% P5 Flows
    D2 -->|"Acreage & Sown Crop Info"| P5
    D3 -->|"Total Expenditure Data"| P5
    D4 -->|"Gross Sales Revenue Data"| P5
    P5 -->|"Financial Calculations<br/>(Cost/Acre, Net Profit/Loss, ROI)"| Farmer
    P5 -->|"Aggregated Regional Agro-Statistics"| Admin

    %% P6 Flows
    Farmer -->|"Agro Parameters (N, P, K, pH, Location)"| P6
    AgroSource -->|"Rainfall & Temperature Conditions"| P6
    D3 -.->|"Historical Input Cost Metrics"| P6
    D5 -->|"Trained ML Models & Historical Mandi Rates"| P6
    P6 -->|"AI Crop Recommendations, Yield & Profit Forecasts"| Farmer
    Admin -->|"Update Model Weights & Benchmark Price Data"| D5

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:2px,color:#1b4332;
    classDef store fill:#fff3cd,stroke:#e0a96d,stroke-width:2px,color:#7c4700;
    class Farmer,Admin,Buyer,AgroSource entity;
    class P1,P2,P3,P4,P5,P6 process;
    class D1,D2,D3,D4,D5 store;
```

---

## 4. Level 2 DFDs (Detailed Sub-Process Decomposition)

### 4.1 Level 2 DFD: Process 2.0 (Crop Cultivation Management)

This diagram details crop registration, land allocation verification, growth tracking, and archiving.

```mermaid
flowchart TB
    Farmer["👨‍🌾 Farmer"]
    D1[("D1: Farmer Profiles")]
    D2[("D2: Crops & Cultivation Store")]

    P2_1(["2.1<br/>Validate Land Allocation &<br/>Farmer Ownership"])
    P2_2(["2.2<br/>Register New Crop<br/>& Sowing Schedule"])
    P2_3(["2.3<br/>Update Crop Lifecycle &<br/>Growth Stage"])
    P2_4(["2.4<br/>Query Crop Cultivation Status<br/>& Active Plots"])
    P2_5(["2.5<br/>Close / Archive Crop Cycle<br/>Post-Harvest"])

    %% Flows
    Farmer -->|"Crop Input: Name, Variety, Area, Sowing Date"| P2_1
    D1 -->|"Farmer Land Limit (Total Acres)"| P2_1
    P2_1 -->|"Validated Crop Data"| P2_2
    P2_2 -->|"Insert Crop Record"| D2
    P2_2 -->|"Sowing Registered Notification"| Farmer

    Farmer -->|"Growth Stage / Irrigation / Treatment Update"| P2_3
    P2_3 -->|"Update Stage (Vegetative/Flowering/Maturity)"| D2
    P2_3 -->|"Stage Updated Feedback"| Farmer

    Farmer -->|"Request Crop History / Active Crops"| P2_4
    D2 -->|"Read Crop Status & Acreage"| P2_4
    P2_4 -->|"Active Crops List & Timeline"| Farmer

    Farmer -->|"Complete Harvest / Close Crop Request"| P2_5
    P2_5 -->|"Mark Status as Harvested/Closed"| D2
    P2_5 -->|"Crop Closure Confirmation"| Farmer

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:2px,color:#1b4332;
    classDef store fill:#fff3cd,stroke:#e0a96d,stroke-width:2px,color:#7c4700;
    class Farmer entity;
    class P2_1,P2_2,P2_3,P2_4,P2_5 process;
    class D1,D2 store;
```

---

### 4.2 Level 2 DFD: Process 3.0 & 4.0 (Expense Tracking, Harvest & Sales Management)

This diagram details operational workflows handled during farm maintenance and marketing of produce.

```mermaid
flowchart TB
    Farmer["👨‍🌾 Farmer"]
    Buyer["🏪 Mandi / Trader"]
    D2[("D2: Crops & Cultivation Store")]
    D3[("D3: Farming Expenses Store")]
    D4[("D4: Harvest & Sales Store")]

    %% Process 3.0 decomposition
    P3_1(["3.1<br/>Input Expenditure Details<br/>(Seeds, Labor, Fertilizer, etc.)"])
    P3_2(["3.2<br/>Map Expense to Crop ID &<br/>Category"])
    P3_3(["3.3<br/>Generate Expense Summary &<br/>Crop Ledger"])

    %% Process 4.0 decomposition
    P4_1(["4.1<br/>Log Harvest Yield &<br/>Quality Grade"])
    P4_2(["4.2<br/>Record Mandi / Buyer Sale<br/>Transaction"])
    P4_3(["4.3<br/>Compute Gross Batch Revenue &<br/>Issue Receipt"])

    %% Flows for Expense
    Farmer -->|"Expense Data (Category, Date, Cost, Description)"| P3_1
    D2 -.->|"Validate Crop ID & Status"| P3_2
    P3_1 -->|"Verified Expense Info"| P3_2
    P3_2 -->|"Write Expense Entry"| D3
    D3 -->|"Read Expense Entries"| P3_3
    P3_3 -->|"Expense Ledger & Category Total"| Farmer

    %% Flows for Harvest & Sales
    Farmer -->|"Harvest Log (Yield Qty in Quintals, Grade)"| P4_1
    D2 -.->|"Verify Crop Maturity"| P4_1
    P4_1 -->|"Write Harvest Record"| D4
    P4_1 -->|"Yield Recorded Status"| Farmer

    Farmer -->|"Sale Details (Rate/Quintal, Qty Sold, Buyer)"| P4_2
    Buyer -->|"Purchase Acknowledgment"| P4_2
    P4_2 -->|"Write Sale Record"| D4
    D4 -->|"Read Sale & Mandi Rate"| P4_3
    P4_3 -->|"Gross Revenue = (Qty × Rate)"| D4
    P4_3 -->|"Sale Receipt & Revenue Update"| Farmer
    P4_3 -->|"Produce Delivery Invoice"| Buyer

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:2px,color:#1b4332;
    classDef store fill:#fff3cd,stroke:#e0a96d,stroke-width:2px,color:#7c4700;
    class Farmer,Buyer entity;
    class P3_1,P3_2,P3_3,P4_1,P4_2,P4_3 process;
    class D2,D3,D4 store;
```

---

### 4.3 Level 2 DFD: Process 5.0 (Financial Analytics & Reporting Engine)

This diagram details the core business logic of Phase 6 & 7: calculating cost per acre, total revenue, net profit/loss, and rendering charts.

```mermaid
flowchart TB
    Farmer["👨‍🌾 Farmer"]
    Admin["👨‍💼 Admin / Agricultural Officer"]
    D2[("D2: Crops Store")]
    D3[("D3: Expenses Store")]
    D4[("D4: Harvest & Sales Store")]

    P5_1(["5.1<br/>Aggregate Total Expenses<br/>Per Crop & Farm"])
    P5_2(["5.2<br/>Aggregate Total Revenue<br/>From Market Sales"])
    P5_3(["5.3<br/>Calculate Financial KPIs<br/>(Profit/Loss, Cost/Acre, ROI)"])
    P5_4(["5.4<br/>Generate Interactive Visualizations<br/>& Chart Reports"])
    P5_5(["5.5<br/>Export Farm Summary<br/>Report (PDF/Excel)"])

    %% Flows
    D3 -->|"Categorized Expense Records"| P5_1
    D4 -->|"Sales & Revenue Transactions"| P5_2
    D2 -->|"Crop Acreage & Variety Details"| P5_3

    P5_1 -->|"Total Cultivation Cost (C_total)"| P5_3
    P5_2 -->|"Total Gross Revenue (R_total)"| P5_3

    P5_3 -->|"Financial Performance Data<br/>(Profit = Revenue - Cost, Cost/Acre)"| P5_4
    P5_4 -->|"Dashboard Metric Cards & Visual Graphs<br/>(Expense Breakdown, Revenue Comparison)"| Farmer

    Farmer -->|"Request Detailed Report Download"| P5_5
    P5_3 -->|"Financial Data Model"| P5_5
    P5_5 -->|"Comprehensive Farm Financial Report (PDF)"| Farmer
    P5_5 -->|"Consolidated Audit & Crop Performance Sheet"| Admin

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:2px,color:#1b4332;
    classDef store fill:#fff3cd,stroke:#e0a96d,stroke-width:2px,color:#7c4700;
    class Farmer,Admin entity;
    class P5_1,P5_2,P5_3,P5_4,P5_5 process;
    class D2,D3,D4 store;
```

---

### 4.4 Level 2 DFD: Process 6.0 (AI Decision Support & Predictive Modeling)

This diagram details the Phase 8 AI/ML engines: Crop Recommendation (Classification), Yield Prediction (Regression), and Profit Forecasting.

```mermaid
flowchart TB
    Farmer["👨‍🌾 Farmer"]
    AgroSensors["🌤️ Agro-Climatic / Soil Inputs"]
    D2[("D2: Crops Store")]
    D3[("D3: Expenses Store")]
    D5[("D5: ML Models & Historical Mandi Store")]

    P6_1(["6.1<br/>Ingest & Normalize<br/>Soil & Weather Features"])
    P6_2(["6.2<br/>Execute AI Crop Recommendation<br/>(Random Forest Classifier)"])
    P6_3(["6.3<br/>Execute AI Yield Prediction<br/>(Regression Pipeline)"])
    P6_4(["6.4<br/>Execute AI Profit & Mandi Rate<br/>Forecasting Model"])
    P6_5(["6.5<br/>Synthesize Advisory Report &<br/>Confidence Scores"])

    %% Ingestion
    Farmer -->|"Soil Test Values (N, P, K, pH)"| P6_1
    AgroSensors -->|"Rainfall, Temp, Humidity"| P6_1
    P6_1 -->|"Normalized Feature Vector"| P6_2
    P6_1 -->|"Climate & Soil Context"| P6_3

    %% Crop Recommendation
    D5 -->|"Trained Classification Model (.pkl)"| P6_2
    P6_2 -->|"Top Recommended Crops & Probability Scores"| P6_5

    %% Yield Prediction
    Farmer -->|"Target Crop, Farm Acreage, Fertilizer Plan"| P6_3
    D5 -->|"Trained Yield Regressor Model (.pkl)"| P6_3
    P6_3 -->|"Predicted Harvest Yield (Tonnes/Acre)"| P6_5
    P6_3 -->|"Estimated Yield Metric"| P6_4

    %% Profit Prediction
    D3 -.->|"Current Input Cost Baseline"| P6_4
    D5 -->|"Historical Mandi Price Trends"| P6_4
    P6_4 -->|"Expected Mandi Price & Net Profit Forecast"| P6_5

    %% Output
    P6_5 -->|"Consolidated Agricultural Advisory &<br/>Prediction Insights"| Farmer

    %% Styling
    classDef entity fill:#e8f4f8,stroke:#0077b6,stroke-width:2px,color:#023e8a;
    classDef process fill:#d8f3dc,stroke:#2d6a4f,stroke-width:2px,color:#1b4332;
    classDef store fill:#fff3cd,stroke:#e0a96d,stroke-width:2px,color:#7c4700;
    class Farmer,AgroSensors entity;
    class P6_1,P6_2,P6_3,P6_4,P6_5 process;
    class D2,D3,D5 store;
```

---

## 5. Data Dictionary (Entities, Stores & Data Flows)

### 5.1 External Entities

| Entity ID | Entity Name | Description | Key Inputs Provided | Key Outputs Received |
| :--- | :--- | :--- | :--- | :--- |
| **E1** | **Farmer** | Primary end-user operating agricultural land. | Phone, password, crop info, expense vouchers, harvest/sales entries, soil data. | Auth token, KPI dashboard, crop schedule, expense breakdown, AI advisory. |
| **E2** | **System Admin** | Agricultural administrator / technical manager. | System configuration, crop reference master, price benchmarks. | System health metrics, user statistics, aggregated agro-reports. |
| **E3** | **Mandi / Buyer** | Wholesale APMC trader or private produce purchaser. | Purchase confirmation, price bids, payment settlements. | Crop availability notices, dispatch notes, sales receipts. |
| **E4** | **Agro / Weather API** | External meteorological and agricultural sensor data service. | Historical & live rainfall, temperature, relative humidity. | Query parameters (latitude, longitude, date range). |

### 5.2 Data Stores

| Store ID | Store Name | Physical Tables / Files | Key Attributes |
| :--- | :--- | :--- | :--- |
| **D1** | **Farmer Profiles & Auth Store** | `auth_user`, `api_farmerprofile`, `authtoken_token` | `id`, `username`, `phone`, `password_hash`, `location`, `total_acres`, `created_at` |
| **D2** | **Crops & Cultivation Store** | `api_crop`, `api_sowingrecord` | `crop_id`, `farmer_id`, `crop_name`, `variety`, `season`, `sowing_date`, `allocated_acres`, `status` |
| **D3** | **Farming Expenses Store** | `api_expense`, `api_expensecategory` | `expense_id`, `crop_id`, `farmer_id`, `category` (seeds, fertilizer, labor, machinery), `cost`, `date`, `description` |
| **D4** | **Harvest & Sales Store** | `api_harvest`, `api_sale` | `harvest_id`, `crop_id`, `yield_quantity`, `grade`, `sale_id`, `buyer_name`, `quantity_sold`, `rate_per_quintal`, `revenue`, `sale_date` |
| **D5** | **AI Models & Agro Dataset** | `crop_rec_rf.pkl`, `yield_reg.pkl`, `mandi_trends.csv` | Feature vectors (N, P, K, pH, rainfall, temp), model weights, historic price time series |

### 5.3 Key Data Flows

| Data Flow Name | Source | Destination | Key Data Elements |
| :--- | :--- | :--- | :--- |
| **Farmer Registration** | Farmer | Process 1.0 | Full Name, Phone Number, Password, Location, Total Acres |
| **Authentication Token** | Process 1.0 | Farmer | 40-character DRF Token, Profile JSON, Session Status |
| **Crop Cultivation Data** | Farmer | Process 2.0 | Crop Name, Hybrid Variety, Sowing Date, Area in Acres, Kharif/Rabi Season |
| **Expense Record** | Farmer | Process 3.0 | Crop ID, Expense Category, Amount (₹), Date, Notes |
| **Harvest Log** | Farmer | Process 4.0 | Crop ID, Harvest Date, Total Yield (Quintals/Tonnes), Quality Grade |
| **Sales Record** | Farmer | Process 4.0 | Crop ID, Buyer Name, Quantity Sold, Rate per Quintal (₹), Total Revenue |
| **Financial KPIs** | Process 5.0 | Farmer | Total Expenses, Gross Revenue, Net Profit/Loss, Cost per Acre, Profit per Acre, ROI (%) |
| **Soil & Climatic Inputs** | Farmer / Sensor | Process 6.0 | Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Rainfall (mm), Temp (°C), Humidity (%) |
| **AI Advisory Output** | Process 6.0 | Farmer | Recommended Crop List, Confidence %, Predicted Yield (Tonnes/Acre), Forecasted Profit (₹) |
