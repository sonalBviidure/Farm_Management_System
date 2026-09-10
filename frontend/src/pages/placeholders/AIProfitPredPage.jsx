import React from 'react';
import { Link } from 'react-router-dom';

const AIProfitPredPage = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">AI Profit Prediction</h2>
          <p className="text-muted mb-0 small">
            Project financial profitability and market price returns based on cost trends and mandi rate patterns.
          </p>
        </div>
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning px-3 py-2">
          Scheduled: Phase 8 (Sonali)
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <div className="mx-auto mb-3 text-success" style={{ fontSize: '3.5rem' }}>
          <i className="bi bi-currency-rupee"></i>
        </div>
        <h4 className="fw-bold text-dark">AI Profit &amp; Revenue Forecasting</h4>
        <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
          This machine learning module is assigned to <strong>Sonali Bhauso Vidure</strong> (~65% scope, Team Leader) and will be implemented in <strong>Phase 8</strong>.
        </p>

        <div className="card bg-light border-0 rounded-3 p-4 mx-auto text-start mb-4" style={{ maxWidth: '580px' }}>
          <h6 className="fw-bold text-dark mb-2">Technical Implementation Scope:</h6>
          <ul className="list-unstyled mb-0 small d-flex flex-column gap-2 text-secondary">
            <li><i className="bi bi-check2 text-success me-2"></i>Dataset: Input costs, expected yield, historical wholesale mandi prices</li>
            <li><i className="bi bi-check2 text-success me-2"></i>Predictive model estimating Net Profit and ROI percentage</li>
            <li><i className="bi bi-check2 text-success me-2"></i>Django REST API for profit margin forecasting</li>
            <li><i className="bi bi-check2 text-success me-2"></i>Interactive scenario analysis tool for farmer decision making</li>
          </ul>
        </div>

        <div>
          <Link to="/dashboard" className="btn btn-fms-primary px-4">
            <i className="bi bi-arrow-left me-2"></i>Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIProfitPredPage;
