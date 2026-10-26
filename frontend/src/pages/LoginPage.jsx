import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const LOGIN_BG = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || (language === 'mr' ? 'लॉगिन अयशस्वी. कृपया तपशील तपासा.' : 'Unable to sign in. Please check your credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center py-5 hero-bg"
      style={{ backgroundImage: `url(${LOGIN_BG})` }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-5">
            {/* Top Bar with brand & language toggle */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-white">
                <i className="bi bi-tree-fill text-warning fs-3"></i>
                <span className="fs-5 fw-bold">Farm Management System</span>
              </Link>
              <button
                className="lang-toggle-btn"
                onClick={toggleLanguage}
                title="Switch Language / भाषा बदला"
              >
                <i className="bi bi-translate"></i>
                {language === 'en' ? '🇮🇳 मराठी' : '🇬🇧 English'}
              </button>
            </div>

            <div className="card border-0 shadow-lg rounded-4 p-4 p-sm-5 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold text-dark mb-0">
                  {language === 'mr' ? 'शेतकरी प्रवेश' : 'Farmer Sign In'}
                </h4>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  <i className="bi bi-shield-lock me-1"></i>Secure Auth
                </span>
              </div>

              {error && (
                <div className="alert alert-danger py-2 px-3 small border-0 d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">
                    {language === 'mr' ? 'फोन नंबर किंवा वापरकर्ता नाव' : 'Phone Number or Username'}
                  </label>
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
                      placeholder={language === 'mr' ? 'उदा. 9876543210 किंवा नाव' : 'e.g. 9876543210 or username'}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-secondary mb-0">
                      {language === 'mr' ? 'संकेतशब्द (पासवर्ड)' : 'Password'}
                    </label>
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
                      placeholder={language === 'mr' ? 'संकेतशब्द टाका' : 'Enter your password'}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-fms-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>{language === 'mr' ? 'प्रवेश करत आहे...' : 'Signing in...'}</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right"></i>
                      <span>{language === 'mr' ? 'डॅशबोर्डमध्ये प्रवेश करा' : 'Sign In to Dashboard'}</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-3 pt-3 border-top">
                <p className="small text-muted mb-1">
                  {language === 'mr' ? 'नवीन शेतकरी?' : 'New farmer?'}{' '}
                  <Link to="/register" className="text-success fw-semibold text-decoration-none">
                    {language === 'mr' ? 'नवीन खाते तयार करा' : 'Create an Account'}
                  </Link>
                </p>
                <Link to="/" className="small text-secondary text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>
                  {language === 'mr' ? 'मुख्य पृष्ठावर जा' : 'Back to Home'}
                </Link>
              </div>
            </div>

            <div className="text-center mt-4">
              <small className="text-white-50">
                Farm Management System &bull; Intelligent Agricultural Advisory Platform
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
