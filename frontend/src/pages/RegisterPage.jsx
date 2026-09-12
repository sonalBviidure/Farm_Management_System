import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    totalAcres: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        full_name: formData.fullName,
        phone: formData.phone,
        location: formData.location,
        total_acres: formData.totalAcres,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check the entered details.');
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  <i className="bi bi-person-check me-1"></i>Phase 2 Module
                </span>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                  <div>{error}</div>
                </div>
              )}

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
                    <label className="form-label small fw-semibold text-secondary">Mobile Number (Login ID)</label>
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
                      min="0.1"
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
                      placeholder="Minimum 6 characters"
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
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-fms-primary w-100 py-2 mt-4 d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus"></i>
                      <span>Create Farmer Profile</span>
                    </>
                  )}
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
                MCA-II Project &bull; Sonali B. Vidure (Lead) &amp; Shraddha S. Gurav
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
