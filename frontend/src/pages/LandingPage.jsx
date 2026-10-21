import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Slider from '../components/Slider';

// Unsplash free images for agriculture / farm backgrounds
const FARM_BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80';
const FIELD_BG = 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80';
const HARVEST_BG = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&q=80';

const LandingPage = () => {
  const { t, language, toggleLanguage } = useLanguage();

  const features = [
    {
      icon: 'bi-flower2',
      color: 'text-success',
      bg: 'bg-success-subtle',
      title: language === 'mr' ? 'पीक व शेत व्यवस्थापन' : 'Crop & Field Management',
      desc: language === 'mr'
        ? 'एकर, हंगाम आणि पेरणी तारखेनुसार पिके आयोजित करा.'
        : 'Organize crops by acreage, season, and sowing dates to keep structured farm histories.',
    },
    {
      icon: 'bi-wallet2',
      color: 'text-danger',
      bg: 'bg-danger-subtle',
      title: language === 'mr' ? 'खर्च व उत्पन्न' : 'Expense & Revenue Tracking',
      desc: language === 'mr'
        ? 'बियाणे, खते, मजुरी आणि बाजार विक्रीच्या नोंदी ठेवा.'
        : 'Record all input costs (seeds, fertilizer, labor) and track market sales accurately.',
    },
    {
      icon: 'bi-cash-stack',
      color: 'text-primary',
      bg: 'bg-primary-subtle',
      title: language === 'mr' ? 'आर्थिक गणना' : 'Financial Calculations',
      desc: language === 'mr'
        ? 'एकरी खर्च, महसूल आणि निव्वळ नफा/तोटा स्वयंचलितपणे मोजा.'
        : 'Auto-compute Cost/Acre, Revenue, and Net Profit/Loss for complete financial clarity.',
    },
    {
      icon: 'bi-cpu',
      color: 'text-info',
      bg: 'bg-info-subtle',
      title: language === 'mr' ? 'AI/ML तंत्रज्ञान' : 'AI/ML Insights',
      desc: language === 'mr'
        ? 'हुशार पीक शिफारस, उत्पन्न अंदाज आणि नफा अनुमान.'
        : 'Smart crop recommendations, yield estimations, and profit forecasting using ML models.',
    },
  ];

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="navbar navbar-expand-lg navbar-dark py-3" style={{ backgroundColor: '#1b4332' }}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
            <i className="bi bi-tree-fill text-success fs-4"></i>
            <span>Farm Management System</span>
          </Link>

          <div className="d-flex align-items-center gap-2">
            <button
              className="lang-toggle-btn"
              onClick={toggleLanguage}
              title="Switch Language / भाषा बदला"
            >
              <i className="bi bi-translate"></i>
              {language === 'en' ? '🇮🇳 मराठी' : '🇬🇧 English'}
            </button>
            <Link to="/login" className="btn btn-outline-light btn-sm px-3">
              {t('login')}
            </Link>
            <Link to="/register" className="btn btn-success btn-sm px-3">
              {t('register')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section with Background ───────────────────── */}
      <section
        className="hero-bg py-5 text-white"
        style={{ backgroundImage: `url(${FARM_BG})`, minHeight: '480px' }}
      >
        <div className="container py-4">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark fw-semibold mb-3 px-3 py-2 fs-6">
                🌾 {language === 'mr' ? 'स्मार्ट शेती व आर्थिक नियंत्रण' : 'Smart Agriculture & Financial Control'}
              </span>
              <h1 className="display-5 fw-bold mb-3">
                {t('landingTitle')}
              </h1>
              <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {t('landingSubtitle')}
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="btn btn-light btn-lg px-4 fw-semibold text-success shadow-sm"
                >
                  {t('goToDashboard')} <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  {t('createAccount')}
                </Link>
              </div>

              <div className="mt-4 d-flex flex-wrap gap-3">
                <span className="badge bg-success bg-opacity-25 border border-success-subtle px-3 py-2 text-white">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  {language === 'mr' ? '8 मॉड्यूल्स सक्रिय' : '8 Modules Active'}
                </span>
                <span className="badge bg-info bg-opacity-25 border border-info-subtle px-3 py-2 text-white">
                  <i className="bi bi-database-check me-1"></i>
                  MySQL + Django REST
                </span>
                <span className="badge bg-warning bg-opacity-25 border border-warning-subtle px-3 py-2 text-white">
                  <i className="bi bi-cpu me-1"></i>
                  AI/ML {language === 'mr' ? 'एकत्रित' : 'Integrated'}
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-lg bg-white text-dark rounded-4 p-4">
                <h5 className="fw-bold text-success mb-3">
                  <i className="bi bi-clipboard2-pulse me-2"></i>
                  {language === 'mr' ? 'प्रणाली अवलोकन' : 'System Overview'}
                </h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3 small">
                  {[
                    {
                      en: 'Crop-wise Lifecycle: Track sowing, cultivation progress, and harvesting timeline.',
                      mr: 'पीक चक्र: पेरणी, लागवड आणि काढणीचा इतिहास ठेवा.',
                    },
                    {
                      en: 'Expense & Sales Tracking: Record inputs (seeds, fertilizer, labor) and market sales.',
                      mr: 'खर्च व विक्री: बियाणे, खते, मजुरी आणि बाजार विक्री नोंद करा.',
                    },
                    {
                      en: 'Financial Metrics: Auto-compute Cost/Acre, Revenue, and Net Profit/Loss.',
                      mr: 'आर्थिक माहिती: एकरी खर्च, महसूल आणि निव्वळ नफा स्वयंचलितपणे मोजा.',
                    },
                    {
                      en: 'AI/ML Integration: Smart crop recommendations, yield estimations, and profit forecasting.',
                      mr: 'AI/ML एकत्रीकरण: हुशार पीक शिफारस, उत्पन्न अंदाज आणि नफा भविष्यवाणी.',
                    },
                  ].map((item, i) => (
                    <li key={i} className="d-flex align-items-start gap-2">
                      <i className="bi bi-check-circle-fill text-success mt-1 flex-shrink-0"></i>
                      <div>{language === 'mr' ? item.mr : item.en}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section with farm background ──────────── */}
      <section
        className="py-5 section-farm-bg flex-grow-1"
        style={{ backgroundImage: `url(${FIELD_BG})` }}
      >
        <div className="container py-2">
          <div className="text-center mb-5">
            <span className="text-uppercase text-muted fw-bold small">
              {language === 'mr' ? 'मॉड्युलर आर्किटेक्चर' : 'Modular Architecture'}
            </span>
            <h2 className="fw-bold text-dark mt-1">
              {language === 'mr' ? 'मुख्य प्रणाली क्षमता' : 'Core System Capabilities'}
            </h2>
            <p className="text-muted small">
              {language === 'mr'
                ? 'MCA-II अंतिम वर्ष प्रकल्प — PVPIT बुधगाव'
                : 'MCA-II Final Year Project — PVPIT Budhgaon'}
            </p>
          </div>

          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center hover-card">
                  <div className={`mx-auto mb-3 rounded-circle ${f.bg} d-flex align-items-center justify-content-center`}
                    style={{ width: 64, height: 64, fontSize: '1.6rem' }}>
                    <i className={`bi ${f.icon} ${f.color}`}></i>
                  </div>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Row */}
          <div className="row g-3 mt-4">
            {[
              { label: language === 'mr' ? 'पीक व्यवस्थापन' : 'Crop Management', value: 'Phase 3', icon: 'bi-flower2', color: 'text-success' },
              { label: language === 'mr' ? 'खर्च ट्रॅकिंग' : 'Expense Tracking', value: 'Phase 4', icon: 'bi-wallet2', color: 'text-danger' },
              { label: language === 'mr' ? 'काढणी व विक्री' : 'Harvest & Sales', value: 'Phase 5', icon: 'bi-basket3', color: 'text-primary' },
              { label: language === 'mr' ? 'AI मॉड्यूल्स' : 'AI Modules', value: '3 Active', icon: 'bi-cpu', color: 'text-info' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 text-center p-3">
                  <i className={`bi ${s.icon} ${s.color} fs-3 mb-2`}></i>
                  <div className="fw-bold fs-5 text-dark">{s.value}</div>
                  <small className="text-muted">{s.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team / Footer ────────────────────────────────────── */}
      <footer
        className="py-4"
        style={{ backgroundColor: '#1b4332', color: 'rgba(255,255,255,0.8)' }}
      >
        <div className="container">
          <div className="row align-items-center gy-3">
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-tree-fill text-success"></i>
                <strong className="text-white">Farm Management System</strong>
              </div>
              <small style={{ color: 'rgba(255,255,255,0.55)' }}>
                {language === 'mr'
                  ? 'MCA-II अंतिम वर्ष गट प्रकल्प · PVPIT बुधगाव'
                  : 'MCA-II Final Year Group Project · PVPIT Budhgaon'}
              </small>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 mb-1">
                <i className="bi bi-mortarboard-fill text-warning"></i>
                <strong className="text-white">
                  {language === 'mr' ? 'गट सदस्य' : 'Team Members'}
                </strong>
              </div>
              <small style={{ color: 'rgba(255,255,255,0.55)' }}>
                Sonali Bhauso Vidure (Leader)<br />
                Shraddha Suresh Gurav
              </small>
            </div>
            <div className="col-md-3 text-md-end">
              <button
                className="lang-toggle-btn"
                onClick={toggleLanguage}
              >
                <i className="bi bi-translate"></i>
                {language === 'en' ? '🇮🇳 मराठी' : '🇬🇧 English'}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
