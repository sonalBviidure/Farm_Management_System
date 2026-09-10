import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In Phase 2, this will clear auth tokens and call the backend logout API
    navigate('/login');
  };

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
        <div className="sidebar-brand">
          <i className="bi bi-tree-fill text-success fs-4"></i>
          <div>
            <div className="fw-bold text-white fs-6 lh-1">FMS Portal</div>
            <small className="text-white-50" style={{ fontSize: '0.72rem' }}>Farm Management System</small>
          </div>
        </div>

        <ul className="sidebar-nav">
          <li className="sidebar-heading">Core Management</li>
          
          <li className="sidebar-item">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-grid-1x2-fill"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/crops" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-flower2"></i>
              <span>Crop Management</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/expenses" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-wallet2"></i>
              <span>Expenses</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/harvest-sales" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-basket3"></i>
              <span>Harvest & Sales</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-graph-up-arrow"></i>
              <span>Reports & Analytics</span>
            </NavLink>
          </li>

          <li className="sidebar-heading">AI & Predictions</li>

          <li className="sidebar-item">
            <NavLink 
              to="/ai-crop-recommendation" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-cpu"></i>
              <span>Crop Recommendation</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/ai-yield-prediction" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-bar-chart-steps"></i>
              <span>Yield Prediction</span>
            </NavLink>
          </li>

          <li className="sidebar-item">
            <NavLink 
              to="/ai-profit-prediction" 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <i className="bi bi-currency-rupee"></i>
              <span>Profit Prediction</span>
            </NavLink>
          </li>

          <li className="sidebar-heading">Account</li>

          <li className="sidebar-item">
            <button 
              type="button" 
              onClick={handleLogout}
              className="sidebar-link w-100 text-start border-0 bg-transparent text-danger-emphasis"
            >
              <i className="bi bi-box-arrow-right text-danger"></i>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
