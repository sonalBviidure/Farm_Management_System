import React, { useState, useEffect } from 'react';
import { getCrops, getProfitPredictions, submitProfitPrediction } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

/**
 * AI Profit Prediction Page
 * Phase 8c — Sonali Bhauso Vidure
 * 
 * Rule: predicted_profit = (predicted_yield * selling_price) - estimated_cost
 */

export default function AIProfitPredPage() {
  const { t, language } = useLanguage();

  const [crops, setCrops] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    crop: '',
    estimated_cost: '',
    predicted_yield: '',
    estimated_selling_price: '',
    predicted_profit: '',
  });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setInitialLoading(true);
    try {
      const [cropData, histData] = await Promise.all([
        getCrops(),
        getProfitPredictions(),
      ]);
      setCrops(cropData);
      setHistory(histData);
      if (cropData.length > 0 && !form.crop) {
        setForm((p) => ({ ...p, crop: cropData[0].id }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setInitialLoading(false);
    }
  }

  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value };
    // Live compute preview
    if (updated.predicted_yield && updated.estimated_selling_price && updated.estimated_cost) {
      const profit = (parseFloat(updated.predicted_yield) * parseFloat(updated.estimated_selling_price)) - parseFloat(updated.estimated_cost);
      updated.predicted_profit = isNaN(profit) ? '' : profit.toFixed(2);
    }
    setForm(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.crop || !form.estimated_cost || !form.predicted_yield || !form.estimated_selling_price) {
      setError(language === 'mr' ? 'कृपया सर्व माहिती भरा.' : 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = {
        crop: parseInt(form.crop),
        estimated_cost: parseFloat(form.estimated_cost),
        predicted_yield: parseFloat(form.predicted_yield),
        estimated_selling_price: parseFloat(form.estimated_selling_price),
        predicted_profit: parseFloat(form.predicted_profit) || 0,
      };

      const res = await submitProfitPrediction(payload);
      setResult(res.prediction);
      await loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const computedProfit = form.predicted_yield && form.estimated_selling_price && form.estimated_cost
    ? (parseFloat(form.predicted_yield) * parseFloat(form.estimated_selling_price)) - parseFloat(form.estimated_cost)
    : null;

  const selectedCrop = crops.find((c) => c.id === parseInt(form.crop));

  return (
    <div className="container-fluid py-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-currency-rupee text-warning me-2"></i>
            {t('aiProfitPredTitle')}
          </h2>
          <p className="text-muted mb-0 small">
            {language === 'mr'
              ? 'पीक उत्पन्न आणि APMC मंडी भावावर आधारित निव्वळ नफ्याचा अंदाज.'
              : 'Estimate net financial returns based on yield and APMC market prices.'}
          </p>
        </div>
        <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-2">
          Phase 8c — Sonali Bhauso Vidure
        </span>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          <button className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {initialLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status"></div>
          <p className="mt-2 text-muted">{t('loading')}</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-flower2 fs-1 text-muted mb-3"></i>
          <h4>{language === 'mr' ? 'पिके सापडली नाहीत' : 'No Crops Found'}</h4>
          <p className="text-muted">
            {language === 'mr'
              ? 'नफा अंदाज चालवण्यापूर्वी किमान एक पीक नोंदवा.'
              : 'Register at least one crop before running profit estimation.'}
          </p>
          <a href="/crops" className="btn btn-success px-4 mx-auto" style={{ maxWidth: 200 }}>
            <i className="bi bi-plus-lg me-1"></i>
            {language === 'mr' ? 'पीक जोडा' : 'Add Crop'}
          </a>
        </div>
      ) : (
        <div className="row g-4">
          {/* Input Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 bg-white h-100">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="fw-bold text-dark mb-0">
                  <i className="bi bi-sliders me-2 text-warning"></i>
                  {language === 'mr' ? 'आर्थिक माहिती भरा' : 'Enter Financial Parameters'}
                </h6>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Crop selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">{language === 'mr' ? 'पीक निवडा *' : 'Select Crop *'}</label>
                    <select
                      name="crop"
                      value={form.crop}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      {crops.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.crop_name} {c.variety ? `(${c.variety})` : ''} — {c.season}
                        </option>
                      ))}
                    </select>
                    {selectedCrop && (
                      <small className="text-muted">
                        {language === 'mr' ? 'शेत:' : 'Field:'} <strong>{selectedCrop.field_name}</strong>
                        {' '}| {language === 'mr' ? 'पेरणी:' : 'Sown:'} {selectedCrop.sowing_date}
                      </small>
                    )}
                  </div>

                  {/* Estimated Cost */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">{t('estimatedCost')} *</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        name="estimated_cost"
                        value={form.estimated_cost}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={language === 'mr' ? 'उदा. 45000' : 'e.g. 45000'}
                        min="0"
                        step="100"
                        required
                      />
                    </div>
                    <small className="text-muted">
                      {language === 'mr' ? 'बियाणे + खते + मजुरी + सिंचन = एकूण खर्च' : 'Seeds + Fertilizer + Labor + Irrigation = Total Cost'}
                    </small>
                  </div>

                  {/* Expected Yield */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">{t('expectedYield')} ({language === 'mr' ? 'क्विंटल' : 'Quintals'}) *</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="predicted_yield"
                        value={form.predicted_yield}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={language === 'mr' ? 'उदा. 35' : 'e.g. 35'}
                        min="0"
                        step="0.1"
                        required
                      />
                      <span className="input-group-text">Qtl</span>
                    </div>
                    <small className="text-muted">
                      {language === 'mr'
                        ? 'AI उत्पन्न अंदाज पृष्ठावरून मूल्य घेऊ शकता.'
                        : 'You can use the value from AI Yield Prediction page.'}
                    </small>
                  </div>

                  {/* Expected Price per Quintal */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold small">{t('expectedPrice')} *</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        name="estimated_selling_price"
                        value={form.estimated_selling_price}
                        onChange={handleChange}
                        className="form-control"
                        placeholder={language === 'mr' ? 'उदा. 3800' : 'e.g. 3800'}
                        min="0"
                        step="10"
                        required
                      />
                      <span className="input-group-text">/ Qtl</span>
                    </div>
                    <small className="text-muted">
                      {language === 'mr'
                        ? 'APMC मंडी किंमत प्रति क्विंटल (₹)'
                        : 'APMC Mandi rate per quintal (₹)'}
                    </small>
                  </div>

                  {/* Live Preview */}
                  {computedProfit !== null && (
                    <div className={`alert ${computedProfit >= 0 ? 'alert-success' : 'alert-danger'} py-3 mb-4`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                          {language === 'mr' ? '🔮 अंदाजित नफा:' : '🔮 Expected Profit:'}
                        </span>
                        <span className="fw-bold fs-5">
                          {computedProfit >= 0 ? '+' : ''}₹{computedProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        = (₹{Number(form.estimated_selling_price || 0).toLocaleString('en-IN')} × {form.predicted_yield || 0} Qtl) − ₹{Number(form.estimated_cost || 0).toLocaleString('en-IN')}
                      </small>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-warning text-dark w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {language === 'mr' ? 'गणना सुरू आहे...' : 'Calculating...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic me-2"></i>
                        {t('calculateProfit')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="col-lg-7">
            {result ? (
              <div className="card border-0 shadow-sm rounded-4 bg-white">
                <div
                  className={`card-header py-3 ${result.predicted_profit >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`}
                >
                  <span className={`badge float-end ${result.predicted_profit >= 0 ? 'bg-success' : 'bg-danger'}`}>
                    {result.predicted_profit >= 0
                      ? (language === 'mr' ? 'नफा' : 'Profitable')
                      : (language === 'mr' ? 'तोटा' : 'Loss')}
                  </span>
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-bar-chart-fill me-2"></i>
                    {language === 'mr' ? 'नफा अंदाज परिणाम' : 'Profit Prediction Result'}
                  </h5>
                </div>
                <div className="card-body p-4">
                  {/* Big profit number */}
                  <div className="text-center py-4">
                    <small className="text-muted text-uppercase fw-semibold d-block mb-2">
                      {t('expectedProfit')}
                    </small>
                    <h1 className={`display-4 fw-bold ${result.predicted_profit >= 0 ? 'text-success' : 'text-danger'}`}>
                      {result.predicted_profit >= 0 ? '+' : ''}₹{Number(result.predicted_profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h1>
                    <div className="text-muted small mt-1">
                      {language === 'mr'
                        ? `रिटर्न: ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(1)}%`
                        : `ROI: ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(1)}%`}
                    </div>
                  </div>

                  <hr />

                  {/* Breakdown */}
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <div className="p-3 bg-danger-subtle rounded-3 text-center">
                        <small className="text-muted d-block">{language === 'mr' ? 'एकूण खर्च' : 'Total Cost'}</small>
                        <strong className="text-danger">₹{Number(result.estimated_cost).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="p-3 bg-primary-subtle rounded-3 text-center">
                        <small className="text-muted d-block">{language === 'mr' ? 'एकूण महसूल' : 'Gross Revenue'}</small>
                        <strong className="text-primary">
                          ₹{(result.predicted_yield * result.estimated_selling_price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={`p-3 rounded-3 text-center ${result.predicted_profit >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                        <small className="text-muted d-block">{t('netProfit')}</small>
                        <strong className={result.predicted_profit >= 0 ? 'text-success' : 'text-danger'}>
                          {result.predicted_profit >= 0 ? '+' : ''}₹{Number(result.predicted_profit).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">{language === 'mr' ? 'उत्पन्न' : 'Yield'}</small>
                        <strong>{result.predicted_yield} Qtl</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">{language === 'mr' ? 'बाजार भाव' : 'Market Rate'}</small>
                        <strong>₹{Number(result.estimated_selling_price).toLocaleString('en-IN')} / Qtl</strong>
                      </div>
                    </div>
                  </div>

                  <div className={`alert ${result.predicted_profit >= 0 ? 'alert-success' : 'alert-warning'} mt-3 small mb-0`}>
                    <i className="bi bi-lightbulb-fill me-2"></i>
                    <strong>{language === 'mr' ? 'सल्ला:' : 'Insight:'}</strong>{' '}
                    {result.predicted_profit >= 0
                      ? (language === 'mr'
                        ? `₹${Number(result.estimated_selling_price).toLocaleString('en-IN')}/क्विंटल मंडी भावाने तुम्हाला ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(0)}% परतावा मिळू शकतो.`
                        : `At ₹${Number(result.estimated_selling_price).toLocaleString('en-IN')}/qtl you can achieve a ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(0)}% return on investment.`)
                      : (language === 'mr'
                        ? 'बाजार भाव वाढवण्याचा किंवा खर्च कमी करण्याचा विचार करा.'
                        : 'Consider negotiating a better market price or reducing cultivation costs.')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 bg-white d-flex align-items-center justify-content-center p-5 text-center text-muted"
                style={{ minHeight: 300 }}>
                <i className="bi bi-currency-rupee fs-1 text-warning opacity-50 mb-3"></i>
                <h5 className="fw-semibold text-dark">
                  {language === 'mr' ? 'अंदाजासाठी तयार' : 'Ready for Prediction'}
                </h5>
                <p className="small mb-0" style={{ maxWidth: '320px' }}>
                  {language === 'mr'
                    ? 'डाव्या बाजूला माहिती भरा आणि "नफा अंदाज काढा" बटण दाबा.'
                    : 'Fill in the parameters on the left and click Calculate Profit to estimate returns.'}
                </p>
              </div>
            )}

            {/* History Table */}
            <div className="card border-0 shadow-sm rounded-4 bg-white mt-4">
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-dark mb-0">
                  <i className="bi bi-clock-history me-2 text-secondary"></i>
                  {t('profitHistory')}
                </h6>
                <span className="badge bg-light text-muted border">{history.length} {language === 'mr' ? 'नोंदी' : 'Records'}</span>
              </div>
              <div className="card-body p-0">
                {history.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    {language === 'mr' ? 'अजून कोणतेही अंदाज नाहीत.' : 'No past predictions yet. Run your first calculation!'}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>{language === 'mr' ? 'तारीख' : 'Date'}</th>
                          <th>{language === 'mr' ? 'पीक' : 'Crop'}</th>
                          <th className="text-end">{language === 'mr' ? 'खर्च (₹)' : 'Cost (₹)'}</th>
                          <th className="text-end">{language === 'mr' ? 'उत्पन्न' : 'Yield'}</th>
                          <th className="text-end">{language === 'mr' ? 'भाव (₹)' : 'Price (₹)'}</th>
                          <th className="text-end">{language === 'mr' ? 'नफा (₹)' : 'Profit (₹)'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((h) => (
                          <tr key={h.id}>
                            <td className="text-muted">
                              {h.prediction_date
                                ? new Date(h.prediction_date).toLocaleDateString('en-IN')
                                : '—'}
                            </td>
                            <td className="fw-semibold">{h.crop_name}</td>
                            <td className="text-end text-danger">₹{Number(h.estimated_cost).toLocaleString('en-IN')}</td>
                            <td className="text-end">{h.predicted_yield} Qtl</td>
                            <td className="text-end">₹{Number(h.estimated_selling_price).toLocaleString('en-IN')}</td>
                            <td className={`text-end fw-bold ${Number(h.predicted_profit) >= 0 ? 'text-success' : 'text-danger'}`}>
                              {Number(h.predicted_profit) >= 0 ? '+' : ''}₹{Number(h.predicted_profit).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
