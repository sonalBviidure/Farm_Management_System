import React, { useState, useEffect } from 'react';
import { getCrops, getProfitPredictions, submitProfitPrediction, getCropFieldIntelligence, getMarketPrices } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AIProfitPredPage() {
  const { t, language } = useLanguage();

  const [crops, setCrops] = useState([]);
  const [history, setHistory] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [fieldIntel, setFieldIntel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [intelLoading, setIntelLoading] = useState(false);
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setInitialLoading(true);
    try {
      const [cropData, histData, marketData] = await Promise.all([
        getCrops(),
        getProfitPredictions(),
        getMarketPrices().catch(() => []),
      ]);
      setCrops(cropData);
      setHistory(histData);
      setMarketPrices(marketData || []);

      if (cropData.length > 0) {
        const firstCropId = cropData[0].id;
        setForm((p) => ({ ...p, crop: firstCropId }));
        await fetchCropFieldIntel(firstCropId);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setInitialLoading(false);
    }
  }

  async function fetchCropFieldIntel(cropId) {
    if (!cropId) return;
    setIntelLoading(true);
    try {
      const intel = await getCropFieldIntelligence(cropId);
      setFieldIntel(intel);
      // Auto-populate form with field intelligence and real market price
      const sellingPrice = intel.current_market_price || 3500;
      const expectedYield = intel.estimated_yield || 15;
      const cost = intel.suggested_cost || (intel.recorded_expense > 0 ? intel.recorded_expense : 30000);

      const profit = (expectedYield * sellingPrice) - cost;

      setForm((prev) => ({
        ...prev,
        crop: cropId,
        estimated_cost: cost,
        predicted_yield: expectedYield,
        estimated_selling_price: sellingPrice,
        predicted_profit: profit.toFixed(2),
      }));
    } catch (err) {
      console.warn('Field intelligence note:', err);
    } finally {
      setIntelLoading(false);
    }
  }

  async function handleCropChange(e) {
    const selectedId = e.target.value;
    setForm((p) => ({ ...p, crop: selectedId }));
    await fetchCropFieldIntel(selectedId);
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
      const histData = await getProfitPredictions();
      setHistory(histData);
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
            <i className="bi bi-graph-up-arrow text-success me-2"></i>
            {t('aiProfitPredTitle')}
          </h2>
          <p className="text-muted mb-0 small">
            {language === 'mr'
              ? 'शेतातील प्रत्यक्ष खर्च डेटा आणि सध्याच्या APMC बाजार भावावरून नफा अंदाज.'
              : 'Predicts net financial returns by analyzing your recorded field expenses and live APMC market prices.'}
          </p>
        </div>
        <span className="badge bg-success-subtle text-success border border-success px-3 py-2">
          <i className="bi bi-broadcast me-1"></i>
          {language === 'mr' ? 'लाईव्ह बाजार भाव जोडलेले' : 'Live Market Rates Active'}
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
          <div className="spinner-border text-success" role="status"></div>
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
          {/* Left Column: Form & Field Intelligence */}
          <div className="col-lg-5">
            {/* Field Intelligence Card */}
            {fieldIntel && (
              <div className="card border-0 shadow-sm rounded-4 bg-white mb-3 border-start border-4 border-success">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-success-subtle text-success fw-bold">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {language === 'mr' ? 'शेतातील प्रत्यक्ष माहिती' : 'Field Intelligence Data'}
                    </span>
                    {intelLoading && <span className="spinner-border spinner-border-sm text-success"></span>}
                  </div>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <span className="text-muted d-block">{language === 'mr' ? 'शेत / क्षेत्र:' : 'Field / Area:'}</span>
                      <strong>{fieldIntel.field_name || 'Plot 1'} ({fieldIntel.land_area} {t('acres')})</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">{language === 'mr' ? 'नोंदवलेला खर्च:' : 'Recorded Expenses:'}</span>
                      <strong className="text-danger">₹{fieldIntel.recorded_expense.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">{language === 'mr' ? 'सध्याचा बाजार भाव:' : 'Current APMC Price:'}</span>
                      <strong className="text-primary">₹{fieldIntel.current_market_price.toLocaleString('en-IN')} / Qtl</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">{language === 'mr' ? 'मंडी बाजार:' : 'Mandi Market:'}</span>
                      <strong className="text-dark">{fieldIntel.market_name}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="card border-0 shadow-sm rounded-4 bg-white h-auto">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="fw-bold text-dark mb-0">
                  <i className="bi bi-calculator me-2 text-success"></i>
                  {language === 'mr' ? 'पीक निवडा व अंदाज मिळवा' : 'Select Crop & Forecast Profit'}
                </h6>
              </div>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Crop selection */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">{language === 'mr' ? 'शेतातील पीक निवडा *' : 'Select Crop from your Fields *'}</label>
                    <select
                      name="crop"
                      value={form.crop}
                      onChange={handleCropChange}
                      className="form-select border-success"
                      required
                    >
                      {crops.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.crop_name} {c.variety ? `(${c.variety})` : ''} — {c.field_name} ({c.season})
                        </option>
                      ))}
                    </select>
                    {selectedCrop && (
                      <small className="text-muted mt-1 d-block">
                        {language === 'mr' ? 'पेरणी दिनांक:' : 'Sown Date:'} <strong>{selectedCrop.sowing_date}</strong>
                      </small>
                    )}
                  </div>

                  {/* Estimated Cost */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold small mb-0">{t('estimatedCost')} *</label>
                      {fieldIntel && fieldIntel.recorded_expense > 0 && (
                        <span className="badge bg-light text-muted border small">
                          ₹{fieldIntel.recorded_expense.toLocaleString('en-IN')} {language === 'mr' ? 'नोंदवलेला' : 'recorded'}
                        </span>
                      )}
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light">₹</span>
                      <input
                        type="number"
                        name="estimated_cost"
                        value={form.estimated_cost}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 45000"
                        min="0"
                        step="50"
                        required
                      />
                    </div>
                    <small className="text-muted">
                      {fieldIntel?.cost_source || (language === 'mr' ? 'बियाणे + खते + मजुरी + सिंचन एकूण खर्च' : 'Total inputs: seeds, fertilizer, labor, irrigation')}
                    </small>
                  </div>

                  {/* Expected Yield */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold small mb-0">{t('expectedYield')} ({language === 'mr' ? 'क्विंटल' : 'Quintals'}) *</label>
                      {fieldIntel && (
                        <span className="badge bg-light text-muted border small">
                          {fieldIntel.estimated_yield} Qtl {language === 'mr' ? 'अंदाज' : 'estimate'}
                        </span>
                      )}
                    </div>
                    <div className="input-group">
                      <input
                        type="number"
                        name="predicted_yield"
                        value={form.predicted_yield}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 35"
                        min="0"
                        step="0.1"
                        required
                      />
                      <span className="input-group-text bg-light">Qtl</span>
                    </div>
                    <small className="text-muted">
                      {fieldIntel?.yield_source || (language === 'mr' ? 'क्षेत्रफळानुसार अंदाज' : 'Based on land area and historical yield')}
                    </small>
                  </div>

                  {/* Current Market Price per Quintal */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label fw-semibold small mb-0">
                        {language === 'mr' ? 'बाजार भाव प्रति क्विंटल (मंडी दर) *' : 'Current Market Price (APMC Rate) *'}
                      </label>
                      {fieldIntel && (
                        <span className="badge bg-primary-subtle text-primary border small">
                          {fieldIntel.market_name}
                        </span>
                      )}
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-light">₹</span>
                      <input
                        type="number"
                        name="estimated_selling_price"
                        value={form.estimated_selling_price}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 3800"
                        min="0"
                        step="10"
                        required
                      />
                      <span className="input-group-text bg-light">/ Qtl</span>
                    </div>
                    <small className="text-muted">
                      {fieldIntel
                        ? `${language === 'mr' ? 'किमान:' : 'Range:'} ₹${fieldIntel.market_min_price} - ₹${fieldIntel.market_max_price} / Qtl`
                        : (language === 'mr' ? 'APMC मंडी किंमत प्रति क्विंटल' : 'APMC Mandi rate per quintal')}
                    </small>
                  </div>

                  {/* Live Profit Preview */}
                  {computedProfit !== null && (
                    <div className={`alert ${computedProfit >= 0 ? 'alert-success' : 'alert-danger'} py-3 mb-4`}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">
                          {language === 'mr' ? 'अंदाजित निव्वळ नफा:' : 'Projected Net Profit:'}
                        </span>
                        <span className="fw-bold fs-5">
                          {computedProfit >= 0 ? '+' : ''}₹{computedProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        (₹{Number(form.estimated_selling_price || 0).toLocaleString('en-IN')} × {form.predicted_yield || 0} Qtl) − ₹{Number(form.estimated_cost || 0).toLocaleString('en-IN')}
                      </small>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {language === 'mr' ? 'अंदाज काढत आहे...' : 'Forecasting Profit...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-graph-up-arrow me-2"></i>
                        {language === 'mr' ? 'बाजार भावावरून नफा अंदाज काढा' : 'Forecast Profit from Market Price'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Prediction Results & Market Rates Board */}
          <div className="col-lg-7">
            {result ? (
              <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
                <div
                  className={`card-header py-3 ${result.predicted_profit >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`}
                >
                  <span className={`badge float-end ${result.predicted_profit >= 0 ? 'bg-success' : 'bg-danger'}`}>
                    {result.predicted_profit >= 0
                      ? (language === 'mr' ? 'नफ्याची संधी' : 'Profitable Yield')
                      : (language === 'mr' ? 'तोटा धोका' : 'Loss Warning')}
                  </span>
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-pie-chart-fill me-2 text-success"></i>
                    {language === 'mr' ? 'नफा अंदाज निष्कर्ष' : 'AI Profit Forecast Analysis'}
                  </h5>
                </div>
                <div className="card-body p-4">
                  {/* Big profit number */}
                  <div className="text-center py-3">
                    <small className="text-muted text-uppercase fw-semibold d-block mb-1">
                      {language === 'mr' ? 'अंदाजित निव्वळ नफा' : 'Predicted Net Profit Realization'}
                    </small>
                    <h1 className={`display-4 fw-bold ${result.predicted_profit >= 0 ? 'text-success' : 'text-danger'} mb-1`}>
                      {result.predicted_profit >= 0 ? '+' : ''}₹{Number(result.predicted_profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h1>
                    {result.estimated_cost > 0 && (
                      <div className="text-muted small">
                        {language === 'mr'
                          ? `गुंतवणुकीवर परतावा (ROI): ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(1)}%`
                          : `Return on Investment (ROI): ${((result.predicted_profit / result.estimated_cost) * 100).toFixed(1)}%`}
                      </div>
                    )}
                  </div>

                  <hr />

                  {/* Breakdown */}
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <div className="p-3 bg-danger-subtle rounded-3 text-center">
                        <small className="text-muted d-block">{language === 'mr' ? 'एकूण खर्च' : 'Total Field Cost'}</small>
                        <strong className="text-danger">₹{Number(result.estimated_cost).toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="p-3 bg-primary-subtle rounded-3 text-center">
                        <small className="text-muted d-block">{language === 'mr' ? 'अंदाजित महसूल' : 'Projected Revenue'}</small>
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
                        <small className="text-muted d-block">{language === 'mr' ? 'अपेक्षित उत्पादन' : 'Expected Yield'}</small>
                        <strong>{result.predicted_yield} Qtl</strong>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="p-3 bg-light rounded-3">
                        <small className="text-muted d-block">{language === 'mr' ? 'मंडी बाजार भाव' : 'APMC Market Rate'}</small>
                        <strong>₹{Number(result.estimated_selling_price).toLocaleString('en-IN')} / Qtl</strong>
                      </div>
                    </div>
                  </div>

                  <div className={`alert ${result.predicted_profit >= 0 ? 'alert-success' : 'alert-warning'} mt-3 small mb-0`}>
                    <i className="bi bi-lightbulb-fill me-2"></i>
                    <strong>{language === 'mr' ? 'शेतकरी सल्ला:' : 'Farmer Advisory:'}</strong>{' '}
                    {result.predicted_profit >= 0
                      ? (language === 'mr'
                        ? `सध्याच्या ₹${Number(result.estimated_selling_price).toLocaleString('en-IN')}/क्विंटल भावानुसार हे पीक फायदेशीर ठरेल. काढणीनंतर थेट APMC मंडीमध्ये विक्री करावी.`
                        : `At the prevailing ₹${Number(result.estimated_selling_price).toLocaleString('en-IN')}/quintal APMC rate, this crop yields strong margins. Good time to finalize harvest dispatch.`)
                      : (language === 'mr'
                        ? 'सध्याचा बाजार भाव किंवा वाढलेला खर्च पाहता नफा कमी होऊ शकतो. शासकीय हमीभाव (MSP) किंवा स्थानिक व्यापारी दरांचा शोध घ्या.'
                        : 'Cultivation cost exceeds market realization at current price. Explore storage or MSP procurement options.')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 bg-white d-flex align-items-center justify-content-center p-5 text-center text-muted mb-4"
                style={{ minHeight: 220 }}>
                <i className="bi bi-currency-exchange fs-1 text-success opacity-50 mb-3"></i>
                <h5 className="fw-semibold text-dark">
                  {language === 'mr' ? 'नफा अंदाज पाहण्यासाठी तयार' : 'Ready to Forecast Agricultural Profits'}
                </h5>
                <p className="small mb-0" style={{ maxWidth: '380px' }}>
                  {language === 'mr'
                    ? 'डाव्या बाजूला शेतातील पीक निवडा. प्रणाली आपोआप प्रत्यक्ष खर्च आणि बाजार भाव मिळवून नफा अंदाज सादर करेल.'
                    : 'Select a crop from your fields. The system automatically pulls your field expense records and current market price to forecast returns.'}
                </p>
              </div>
            )}

            {/* Live APMC Market Rates Board */}
            {marketPrices.length > 0 && (
              <div className="card border-0 shadow-sm rounded-4 bg-white mb-4">
                <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="bi bi-shop me-2 text-primary"></i>
                    {language === 'mr' ? 'सध्याचे APMC मंडी बाजार भाव' : 'Live APMC Market Rates (Mandi Prices)'}
                  </h6>
                  <span className="badge bg-success-subtle text-success">
                    <i className="bi bi-check-circle-fill me-1"></i>
                    {language === 'mr' ? 'अद्ययावत' : 'Updated Today'}
                  </span>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 small">
                      <thead className="table-light">
                        <tr>
                          <th>{language === 'mr' ? 'धान्य / पीक' : 'Grain / Crop'}</th>
                          <th>{language === 'mr' ? 'बाजार (APMC)' : 'Market (APMC)'}</th>
                          <th className="text-end">{language === 'mr' ? 'दर (₹/क्विंटल)' : 'Modal Price (₹/Qtl)'}</th>
                          <th className="text-end">{language === 'mr' ? 'किमान - कमाल' : 'Min - Max'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marketPrices.slice(0, 6).map((m, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold text-dark">{m.crop_name}</td>
                            <td className="text-muted">{m.market_name}</td>
                            <td className="text-end fw-bold text-success">₹{m.modal_price}</td>
                            <td className="text-end text-muted small">₹{m.min_price} - ₹{m.max_price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* History Table */}
            <div className="card border-0 shadow-sm rounded-4 bg-white">
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
