import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navigation Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-fms-dark py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <i className="bi bi-tree-fill text-success fs-4"></i>
            <span>Farm Management System</span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm px-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-success btn-sm px-3">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 text-white" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark fw-semibold mb-3 px-3 py-2">
                🌾 Smart Agriculture & Financial Control
              </span>
              <h1 className="display-5 fw-bold mb-3">
                Manage Crop Cycles, Track Expenses & Predict Harvest Outcomes
              </h1>
              <p className="lead text-white-50 mb-4">
                A purpose-built management system helping farmers record crop operations, 
                streamline financial health with accurate profit/loss calculations, and utilize 
                machine learning for intelligent cultivation decisions.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/login" className="btn btn-light btn-lg px-4 fw-semibold text-fms-dark shadow-sm">
                  Go to Dashboard <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  Create Farmer Account
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card border-0 shadow-lg bg-white text-dark rounded-4 p-4">
                <h5 className="fw-bold text-fms-primary mb-3">
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  System Overview
                </h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3 small">
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong>Crop-wise Lifecycle:</strong> Track sowing, cultivation progress, and harvesting timeline.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong>Expense & Sales Tracking:</strong> Record inputs (seeds, fertilizer, labor) and market sales.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong>Financial Metrics:</strong> Auto-compute Cost/Acre, Revenue, and Net Profit/Loss.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill text-success mt-1"></i>
                    <div>
                      <strong>AI/ML Integration:</strong> Smart crop recommendations, yield estimations, and profit forecasting.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Features Highlights */}
      <section className="py-5 flex-grow-1">
        <div className="container py-2">
          <div className="text-center mb-5">
            <span className="text-uppercase text-muted fw-bold small">Modular Architecture</span>
            <h2 className="fw-bold text-dark mt-1">Core System Capabilities</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 p-4 text-center">
                <div className="mx-auto mb-3 text-success fs-1">
                  <i className="bi bi-flower2"></i>
                </div>
                <h5 className="fw-bold">Crop & Field Management</h5>
                <p className="text-muted small mb-0">
                  Organize crops by acreage, season, and sowing dates to keep structured farm histories.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 p-4 text-center">
                <div className="mx-auto mb-3 text-success fs-1">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <h5 className="fw-bold">Financial Calculations</h5>
                <p className="text-muted small mb-0">
                  Transparent breakdown of all cultivation costs, market revenues, and net margins per acre.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-3 p-4 text-center">
                <div className="mx-auto mb-3 text-success fs-1">
                  <i className="bi bi-cpu"></i>
                </div>
                <h5 className="fw-bold">AI/ML Insights</h5>
                <p className="text-muted small mb-0">
                  Data-driven predictions for optimal crop selection, expected crop yield, and projected returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project & Team Footer */}
      <footer className="bg-white border-top py-4 text-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-md-start mb-2 mb-md-0">
              <p className="mb-0 text-muted small">
                <strong>Farm Management System</strong> &bull; MCA-II Group Project
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 text-muted small">
                Team: <strong>Sonali Bhauso Vidure</strong> (Leader) &amp; <strong>Shraddha Suresh Gurav</strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
