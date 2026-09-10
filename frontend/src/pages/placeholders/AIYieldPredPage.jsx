import React from 'react';
import { Link } from 'react-router-dom';

const AIYieldPredPage = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">AI Yield Prediction</h2>
          <p className="text-muted mb-0 small">
            Estimate expected harvest yields in quintals/tonnes per acre based on historical agro-climatic data.
          </p>
        </div>
        <span className="badge bg-info-subtle text-info-emphasis border border-info px-3 py-2">
          Scheduled: Phase 8 (Shraddha)
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <div className="mx-auto mb-3 text-info-emphasis" style={{ fontSize: '3.5rem' }}>
          <i className="bi bi-bar-chart-steps"></i>
        </div>
        <h4 className="fw-bold text-dark">AI Crop Yield Prediction</h4>
        <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
          This machine learning module is assigned to <strong>Shraddha Suresh Gurav</strong> (~35% scope) and will be implemented in <strong>Phase 8</strong>.
        </p>

        <div className="card bg-light border-0 rounded-3 p-4 mx-auto text-start mb-4" style={{ maxWidth: '580px' }}>
          <h6 className="fw-bold text-dark mb-2">Technical Implementation Scope:</h6>
          <ul className="list-unstyled mb-0 small d-flex flex-column gap-2 text-secondary">
            <li><i className="bi bi-check2 text-info-emphasis me-2"></i>Dataset: Crop type, season, area, annual rainfall, fertilizer dosage</li>
            <li><i className="bi bi-check2 text-info-emphasis me-2"></i>Algorithms: Regression modeling (Random Forest Regressor / Linear Models)</li>
            <li><i className="bi bi-check2 text-info-emphasis me-2"></i>Django REST API delivering predicted tonnes/acre</li>
            <li><i className="bi bi-check2 text-info-emphasis me-2"></i>Interactive yield estimator calculator on the frontend</li>
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

export default AIYieldPredPage;
