import React, { useState, useEffect } from 'react';
import { getCropRecommendations, submitCropRecommendation } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/**
 * AI Crop Recommendation Page
 * Phase 8b — Sonali Bhauso Vidure
 * MCA-II Project, PVPIT Budhgaon
 */

const SOIL_TYPES = ['Black', 'Red', 'Loamy', 'Alluvial', 'Clayey', 'Sandy', 'Other'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Annual'];
const IRRIGATION_TYPES = ['Rainfed', 'Canal', 'Drip', 'Sprinkler', 'Borewell', 'Other'];

const CROP_ICONS = {
  Cotton: '🌿', Wheat: '🌾', Groundnut: '🥜', Sunflower: '🌻',
  Soybean: '🌱', Rice: '🍚', Sugarcane: '🎋', Maize: '🌽', Watermelon: '🍉',
};

export default function AICropRecPage() {
  const { t, language } = useLanguage();

  const [form, setForm] = useState({
    soil_type: 'Black',
    season: 'Kharif',
    weather_conditions: '',
    irrigation_type: 'Rainfed',
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const data = await getCropRecommendations();
      setHistory(data);
    } catch (e) {
      console.warn('History load error:', e.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.weather_conditions.trim()) {
      setError(language === 'mr' ? 'कृपया स्थानिक हवामानाची माहिती लिहा.' : 'Please describe the weather conditions.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await submitCropRecommendation(form);
      setResult(res.recommendation);
      await loadHistory();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-success mb-0">
          <i className="bi bi-cpu me-2"></i>{t('aiCropRecTitle')}
        </h2>
        <small className="text-muted">
          Phase 8b — Sonali Bhauso Vidure · {language === 'mr' ? 'नियम-आधारित AI शेती सल्लागार' : 'Rule-based AI agronomic advisory'}
        </small>
      </div>

      <div className="row g-4">
        {/* Input Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-sliders me-2"></i>{t('enterFarmParams')}
              </h6>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">{t('soilType')}</label>
                  <select name="soil_type" value={form.soil_type} onChange={handleChange} className="form-select">
                    {SOIL_TYPES.map((s) => <option key={s} value={s}>{s} {language === 'mr' ? 'माती' : 'Soil'}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{t('season')}</label>
                  <select name="season" value={form.season} onChange={handleChange} className="form-select">
                    {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">{t('weatherConditions')}</label>
                  <input
                    type="text"
                    name="weather_conditions"
                    value={form.weather_conditions}
                    onChange={handleChange}
                    className="form-control"
                    placeholder={language === 'mr' ? 'उदा. मध्यम पाऊस, २५-३२°C, दमट हवामान' : 'e.g. heavy rainfall, 25-32°C, humid'}
                    required
                  />
                  <small className="text-muted">
                    {language === 'mr' ? 'स्थानिक हवामान: पाऊस, तापमान, दमटपणा' : 'Describe local climate: rainfall, temperature, humidity'}
                  </small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">{t('irrigationType')}</label>
                  <select name="irrigation_type" value={form.irrigation_type} onChange={handleChange} className="form-select">
                    {IRRIGATION_TYPES.map((t_type) => <option key={t_type} value={t_type}>{t_type}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>{t('analyzing')}</>
                    : <><i className="bi bi-magic me-2"></i>{t('getRecommendation')}</>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="col-lg-7">
          {result && (
            <div className="card border-0 shadow-sm border-start border-success border-4 mb-4">
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '4rem' }}>
                  {CROP_ICONS[result.recommended_crop] || '🌾'}
                </div>
                <h2 className="fw-bold text-success mt-2">{result.recommended_crop}</h2>
                <p className="text-muted mb-3">
                  {language === 'mr' ? 'आपल्या शेताच्या माहितीसाठी शिफारस केलेले पीक' : 'Recommended for your farm parameters'}
                </p>
                <div className="row g-2 justify-content-center">
                  <div className="col-auto">
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                      <i className="bi bi-layers me-1"></i>{result.soil_type} {language === 'mr' ? 'माती' : 'Soil'}
                    </span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-primary-subtle text-primary px-3 py-2">
                      <i className="bi bi-calendar3 me-1"></i>{result.season}
                    </span>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-info-subtle text-info px-3 py-2">
                      <i className="bi bi-droplet me-1"></i>{result.irrigation_type}
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-muted small">
                  <i className="bi bi-clock me-1"></i>
                  {language === 'mr' ? 'निर्मिती वेळ:' : 'Generated:'} {new Date(result.recommendation_date).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* History */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-clock-history me-2 text-success"></i>{t('recommendationHistory')}
              </h6>
            </div>
            <div className="card-body p-0">
              {historyLoading ? (
                <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-success"></div></div>
              ) : history.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-4 d-block mb-1"></i>
                  {language === 'mr' ? 'अद्याप कोणत्याही शिफारसी नाहीत.' : 'No recommendations yet. Submit your first query above.'}
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {history.slice(0, 10).map((rec) => (
                    <div key={rec.id} className="list-group-item d-flex align-items-center gap-3 py-3">
                      <div className="fs-3">{CROP_ICONS[rec.recommended_crop] || '🌾'}</div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-success">{rec.recommended_crop}</div>
                        <small className="text-muted">
                          {rec.soil_type} Soil · {rec.season} · {rec.irrigation_type}
                        </small>
                      </div>
                      <small className="text-muted">
                        {new Date(rec.recommendation_date).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
