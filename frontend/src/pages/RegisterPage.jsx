import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'Ramesh Patil',
    phone: '9876543210',
    location: 'Kolhapur, Maharashtra',
    totalAcres: '5.5',
    password: 'password123',
    confirmPassword: 'password123',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 1: Mock registration to navigate to Dashboard. Full registration endpoint will be integrated in Phase 2.
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
                <i className="bi bi-tree-fill text-success fs-2"></i>
                <span className="fs-4 fw-bold text-dark">Farm Management System</span>
              </Link>
              <p className="text-muted small">Register as a farmer to track cultivation cycles and finances</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold text-dark mb-0">Farmer Registration</h4>
                <span className="badge bg-success-subtle text-success border border-success-subtle">Phase 1 Preview</span>
              </div>

              <div className="alert alert-info py-2 px-3 small border-0 bg-light text-secondary mb-4">
                <i className="bi bi-info-circle me-1 text-primary"></i>
                Database persistence for users will be implemented in <strong>Phase 2 (Authentication)</strong>.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">Farmer Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Patil"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>

                  <div className="col-sm-7">
                    <label className="form-label small fw-semibold text-secondary">Village / District</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Kolhapur, Maharashtra"
                      required
                    />
                  </div>

                  <div className="col-sm-5">
                    <label className="form-label small fw-semibold text-secondary">Total Land (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      name="totalAcres"
                      value={formData.totalAcres}
                      onChange={handleChange}
                      placeholder="e.g. 5.5"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-secondary">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-fms-primary w-100 py-2 mt-4">
                  <i className="bi bi-person-plus me-2"></i>Create Farmer Profile
                </button>
              </form>

              <div className="text-center mt-3 pt-3 border-top">
                <p className="small text-muted mb-1">
                  Already registered? <Link to="/login" className="text-success fw-semibold text-decoration-none">Sign In</Link>
                </p>
                <Link to="/" className="small text-secondary text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>Back to Home
                </Link>
              </div>
            </div>

            <div className="text-center mt-4">
              <small className="text-muted">
                MCA-II Project &bull; Sonali B. Vidure &amp; Shraddha S. Gurav
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
