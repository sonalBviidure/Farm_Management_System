# Farm Management System (FMS)

An MCA-II academic project designed to help farmers manage crop cultivation lifecycles, record farming expenses, track harvest and sales, compute financial returns (cost per acre, revenue, profit/loss), and leverage AI/ML algorithms for intelligent agriculture decisions.

---

## Team & Contribution Breakdown

| Member Name | Role | Planned Contribution | Primary Responsibilities |
| :--- | :--- | :---: | :--- |
| **Sonali Bhauso Vidure** | **Team Leader** | **~65%** | Project Architecture, Git/Repository Management, Authentication, Dashboard & Financial Analytics, Visual Reports, AI Crop Recommendation, AI Profit Prediction, and Final Integration. |
| **Shraddha Suresh Gurav** | **Team Member** | **~35%** | Crop Management (CRUD), Expense Tracking (CRUD), Harvest & Sales Management, AI Yield Prediction, Module Testing, and Documentation Support. |

---

## Technology Stack

- **Frontend:** React.js (Vite), JavaScript (ES6+), Bootstrap 5, Bootstrap Icons, HTML5, CSS3, React Router v7.
- **Backend:** Python 3.11, Django 4.2 / 5.0, Django REST Framework (DRF), django-cors-headers, PyMySQL.
- **Database:** MySQL (Configurable in `backend/.env` with local dev fallback).
- **AI/ML Stack (Scheduled for Phase 8):** Python, Scikit-Learn, Pandas, NumPy.
- **Visualization (Scheduled for Phase 7):** Chart.js / Recharts.
- **Development & Version Control:** Visual Studio Code, Git, GitHub.

---

## Project Folder Structure

```
Farm-Management-System/
│
├── .gitignore                      # Root Git ignore rules (node_modules, venv, db)
├── README.md                       # Complete documentation & execution guide
│
├── backend/                        # Django REST Framework backend
│   ├── .env.example                # Example configuration file for MySQL settings
│   ├── manage.py                   # Django management script
│   ├── requirements.txt            # Python package dependencies
│   ├── venv/                       # Dedicated Python 3.11 virtual environment
│   ├── fms_backend/                # Core Django project configuration
│   │   ├── __init__.py             # PyMySQL initialization
│   │   ├── settings.py             # DRF, CORS, database, and installed apps
│   │   ├── urls.py                 # Root URL configuration (/api/ routing)
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/                        # API application
│       ├── views.py                # Status and future API controllers
│       ├── urls.py                 # Module endpoint mapping
│       ├── tests.py                # Automated tests
│       └── models.py               # Database schemas (ready for Phase 2+)
│
└── frontend/                       # React.js application (Vite + Bootstrap 5)
    ├── package.json                # NPM dependencies and scripts
    ├── vite.config.js              # Vite configuration
    ├── index.html                  # HTML entry point with typography
    ├── src/
    │   ├── main.jsx                # React root bootstrap with Router & Bootstrap
    │   ├── App.jsx                 # Route definitions and layout mapping
    │   ├── App.css
    │   ├── index.css               # Agricultural color palette and responsive styling
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation bar with farmer profile
    │   │   ├── Sidebar.jsx         # Sidebar navigation with active indicator
    │   │   └── DashboardLayout.jsx # Unified shell layout for dashboard pages
    │   └── pages/
    │       ├── LandingPage.jsx     # Public landing / home page
    │       ├── LoginPage.jsx       # Farmer login interface
    │       ├── RegisterPage.jsx    # Farmer registration interface
    │       ├── DashboardPage.jsx   # Farmer dashboard with 4 metric cards
    │       └── placeholders/       # Modular placeholders for upcoming phases
    │           ├── CropsPage.jsx           # Phase 3 (Shraddha)
    │           ├── ExpensesPage.jsx        # Phase 4 (Shraddha)
    │           ├── HarvestSalesPage.jsx    # Phase 5 (Shraddha)
    │           ├── ReportsPage.jsx         # Phase 6 & 7 (Sonali)
    │           ├── AICropRecPage.jsx       # Phase 8 (Sonali)
    │           ├── AIYieldPredPage.jsx     # Phase 8 (Shraddha)
    │           └── AIProfitPredPage.jsx    # Phase 8 (Sonali)
```

---

## Getting Started: How to Run the Application

### 1. Prerequisites
- **Node.js**: v18+ (tested with v24.x) & npm
- **Python**: 3.11.x
- **MySQL**: MySQL Server 8.0 running locally on port 3306

---

### 2. Backend Setup & Execution

Open a terminal (Command Prompt or PowerShell) and navigate to the project root:

```cmd
# 1. Navigate to backend directory
cd d:\SEM_3\FMS\backend

# 2. Run Django server directly using the virtual environment python:
.\venv\Scripts\python.exe manage.py runserver 8000
```

> **Alternatively, to activate the virtual environment first:**
> - If using **Command Prompt (CMD)**:
>   ```cmd
>   venv\Scripts\activate.bat
>   python manage.py runserver 8000
>   ```
> - If using **PowerShell**:
>   ```powershell
>   .\venv\Scripts\Activate.ps1
>   python manage.py runserver 8000
>   ```


The Django REST API will be accessible at:
- **API Status Endpoint:** [http://127.0.0.1:8000/api/status/](http://127.0.0.1:8000/api/status/)
- **Django Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

To run the automated tests:
```powershell
python manage.py test api
```

---

### 3. Frontend Setup & Execution

Open a second terminal at the project root:

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Start the Vite development server
npm run dev
```

The React frontend will be accessible in your web browser at:
- **Application URL:** [http://localhost:5173/](http://localhost:5173/)

---

## Current Status & Roadmap

### What is Currently Implemented (Phase 1)
- **Root Git Structure**: Single repository with branches (`main`, `develop`, `sonali`, `shraddha`).
- **Django REST Framework Backend**: Django 5.0 project with CORS enabled for `localhost:5173`, PyMySQL configuration with fallback, and health check API (`/api/status/`).
- **React.js + Bootstrap 5 Frontend**: Clean, responsive agricultural theme.
- **Page Flow**:
  - `Landing Page` (`/`) &rarr; Hero banner, feature highlights, links to login/register.
  - `Login Page` (`/login`) &rarr; Clean farmer sign-in form navigating to the Dashboard.
  - `Register Page` (`/register`) &rarr; Farmer profile registration form.
  - `Dashboard` (`/dashboard`) &rarr; 4 KPI metric cards (Total Crops, Total Expenses, Total Revenue, Total Profit/Loss), active crops preview, and AI roadmap overview.
  - `Sidebar Navigation & Placeholders` &rarr; Functional routing to upcoming modules with explicit owner attribution (Crops, Expenses, Harvest/Sales, Reports, AI modules).

### Intentionally Not Implemented in Phase 1
- Database user models, password hashing, and JWT token authentication (**Phase 2**).
- Crop CRUD operations and crop database models (**Phase 3**).
- Expense category models and CRUD operations (**Phase 4**).
- Harvest logging, sales records, and market transactions (**Phase 5**).
- Financial calculation engines and dynamic formulas (**Phase 6**).
- Interactive Chart.js / Recharts visualizations and comparative reports (**Phase 7**).
- Machine learning models, training scripts, and datasets for Crop Recommendation, Yield Prediction, and Profit Prediction (**Phase 8**).

---

## Recommended Next Step
**Phase 2: Authentication System** (Assigned to **Sonali Bhauso Vidure**, Team Leader)
- Farmer custom User model / Profile in Django
- Registration API (`/api/auth/register/`)
- Login API with JWT / Session tokens (`/api/auth/login/`)
- Protected route wrappers in React to secure the dashboard.
