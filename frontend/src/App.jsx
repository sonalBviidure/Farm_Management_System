import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Core Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

// Placeholder Pages (for upcoming phases)
import CropsPage from './pages/placeholders/CropsPage';
import ExpensesPage from './pages/placeholders/ExpensesPage';
import HarvestSalesPage from './pages/placeholders/HarvestSalesPage';
import ReportsPage from './pages/placeholders/ReportsPage';
import AICropRecPage from './pages/placeholders/AICropRecPage';
import AIYieldPredPage from './pages/placeholders/AIYieldPredPage';
import AIProfitPredPage from './pages/placeholders/AIProfitPredPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Routes Protected by Phase 2 Auth */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Modules assigned to Shraddha */}
            <Route path="/crops" element={<CropsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/harvest-sales" element={<HarvestSalesPage />} />

            {/* Modules assigned to Sonali */}
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/ai-crop-recommendation" element={<AICropRecPage />} />
            <Route path="/ai-profit-prediction" element={<AIProfitPredPage />} />

            {/* AI Module assigned to Shraddha */}
            <Route path="/ai-yield-prediction" element={<AIYieldPredPage />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
