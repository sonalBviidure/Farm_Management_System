import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: 'farmer_demo',
    password: 'password123',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 1: Mock login to navigate to Dashboard. Full JWT authentication will be integrated in Phase 2.
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-2">
                <i className="bi bi-tree-fill text-success fs-2"></i>
                <span className="fs-4 fw-bold text-dark">Farm Management System</span>
              </Link>
              <p className="text-muted small">Sign in to manage your farm and view financial records</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold text-dark mb-0">Farmer Login</h4>
                <span className="badge bg-success-subtle text-success border border-success-subtle">Phase 1 Preview</span>
              </div>

              <div className="alert alert-info py-2 px-3 small border-0 bg-light text-secondary mb-4">
                <i className="bi bi-info-circle me-1 text-primary"></i>
                Authentication endpoints will be implemented in <strong>Phase 2</strong>. Click <strong>Sign In</strong> to enter the dashboard.
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Username or Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210 or farmer_demo"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
                    <span className="small text-muted" style={{ fontSize: '0.78rem' }}>Default: password123</span>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-fms-primary w-100 py-2 mb-3">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In to Dashboard
                </button>
              </form>

              <div className="text-center mt-3 pt-3 border-top">
                <p className="small text-muted mb-1">
                  New farmer? <Link to="/register" className="text-success fw-semibold text-decoration-none">Create an Account</Link>
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

export default LoginPage;
