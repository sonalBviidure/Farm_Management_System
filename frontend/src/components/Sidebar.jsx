import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.full_name || user?.username || 'Farmer';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <i className="bi bi-tree-fill text-success fs-4"></i>
          <div>
            <div className="fw-bold text-white fs-6 lh-1">FMS Portal</div>
            <small className="text-white-50" style={{ fontSize: '0.7rem' }}>
              Farm Management System
            </small>
          </div>
        </div>

        {/* Nav Links */}
        <ul className="sidebar-nav">
          <li className="sidebar-heading">{t('dashboard') === 'डॅशबोर्ड' ? 'मुख्य व्यवस्थापन' : 'Core Management'}</li>

          <li className="sidebar-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-grid-1x2-fill"></i>
              <span>{t('dashboard')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/crops"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-flower2"></i>
              <span>{t('crops')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/expenses"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-wallet2"></i>
              <span>{t('expenses')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/harvest-sales"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-basket3"></i>
              <span>{t('harvestSales')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/reports"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-graph-up-arrow"></i>
              <span>{t('reports')}</span>
            </NavLink>
          </li>

          <li className="sidebar-heading">AI & {language === 'mr' ? 'अंदाज' : 'Predictions'}</li>

          <li className="sidebar-item">
            <NavLink
              to="/ai-crop-recommendation"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-cpu"></i>
              <span>{t('aiCropRec')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/ai-yield-prediction"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-bar-chart-steps"></i>
              <span>{t('aiYieldPred')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink
              to="/ai-profit-prediction"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-currency-rupee"></i>
              <span>{t('aiProfitPred')}</span>
            </NavLink>
          </li>

          <li className="sidebar-heading">{language === 'mr' ? 'खाते' : 'Account'}</li>

          <li className="sidebar-item">
            <NavLink
              to="/profile"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-person-circle"></i>
              <span>{t('profile')}</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-link w-100 text-start border-0 bg-transparent"
              style={{ color: '#ff6b6b' }}
            >
              <i className="bi bi-box-arrow-right" style={{ color: '#ff6b6b' }}></i>
              <span>{t('logout')}</span>
            </button>
          </li>
        </ul>

        {/* Language Toggle at bottom */}
        <div className="sidebar-bottom">
          <button
            className="lang-toggle-btn w-100 justify-content-center"
            onClick={toggleLanguage}
            title="Switch Language / भाषा बदला"
          >
            <i className="bi bi-translate"></i>
            {language === 'en' ? '🇮🇳 मराठी' : '🇬🇧 English'}
          </button>
          <div className="sidebar-footer-text mt-2">
            Smart Agriculture Advisory
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
