import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Core Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Module Pages
import CropsPage from './pages/placeholders/CropsPage';
import ExpensesPage from './pages/placeholders/ExpensesPage';
import HarvestSalesPage from './pages/placeholders/HarvestSalesPage';
import ReportsPage from './pages/placeholders/ReportsPage';
import AICropRecPage from './pages/placeholders/AICropRecPage';
import AIYieldPredPage from './pages/placeholders/AIYieldPredPage';
import AIProfitPredPage from './pages/placeholders/AIProfitPredPage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Shraddha's Modules */}
              <Route path="/crops" element={<CropsPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/harvest-sales" element={<HarvestSalesPage />} />

              {/* Sonali's Modules */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/ai-crop-recommendation" element={<AICropRecPage />} />
              <Route path="/ai-profit-prediction" element={<AIProfitPredPage />} />

              {/* Shraddha's AI Module */}
              <Route path="/ai-yield-prediction" element={<AIYieldPredPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
