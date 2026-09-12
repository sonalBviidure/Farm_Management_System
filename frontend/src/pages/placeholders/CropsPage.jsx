import React from 'react';
import { Link } from 'react-router-dom';

const CropsPage = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Crop Management</h2>
          <p className="text-muted mb-0 small">
            Manage crop lifecycle, sowing schedules, varieties, and land allocation.
          </p>
        </div>
        <span className="badge bg-secondary-subtle text-secondary border px-3 py-2">
          Scheduled: Phase 3
        </span>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
        <div className="mx-auto mb-3 text-success" style={{ fontSize: '3.5rem' }}>
          <i className="bi bi-flower2"></i>
        </div>
        <h4 className="fw-bold text-dark">Crop Management Module</h4>
        <p className="text-muted mx-auto" style={{ maxWidth: '580px' }}>
          This module will be created by <strong>Shraddha Suresh Gurav</strong> in <strong>Phase 3</strong>.
        </p>

        <div className="card bg-light border-0 rounded-3 p-4 mx-auto text-start mb-4" style={{ maxWidth: '580px' }}>
          <h6 className="fw-bold text-dark mb-2">Planned Functionalities:</h6>
          <ul className="list-unstyled mb-0 small d-flex flex-column gap-2 text-secondary">
            <li><i className="bi bi-check2 text-success me-2"></i>Add, view, update, and delete crop records (CRUD)</li>
            <li><i className="bi bi-check2 text-success me-2"></i>Crop details (Variety, Sowing Date, Area in Acres, Season)</li>
            <li><i className="bi bi-check2 text-success me-2"></i>Crop-related Django REST APIs &amp; MySQL Model</li>
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

export default CropsPage;
