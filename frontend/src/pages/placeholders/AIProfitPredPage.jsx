import React, { useState, useEffect } from 'react';
import { getCrops, getProfitPredictions, submitProfitPrediction } from '../../services/api';

/**
 * AI Profit Prediction Page
 * Phase 8c — Sonali Bhauso Vidure
 */
export default function AIProfitPredPage() {
  const [crops, setCrops] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    crop: '',
    estimated_cost: '',
    predicted_yield: '',
    estimated_selling_price: '',
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setDataLoading(true);
    try {
      const [cropData, histData] = await Promise.all([getCrops(), getProfitPredictions()]);
      setCrops(cropData);
      setHistory(histData);
      if (cropData.length > 0 && !form.crop) {
        setForm((p) => ({ ...p, crop: cropData[0].id }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setDataLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        crop: parseInt(form.crop),
        estimated_cost: parseFloat(form.estimated_cost),
        predicted_yield: parseFloat(form.predicted_yield),
        estimated_selling_price: parseFloat(form.estimated_selling_price),
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

  const isProfit = result && parseFloat(result.predicted_profit) >= 0;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-success mb-0">
          <i className="bi bi-graph-up-arrow me-2"></i>AI Profit Prediction
        </h2>
        <small className="text-muted">Phase 8c — Sonali Bhauso Vidure · Expected profit simulator</small>
      </div>

      <div className="row g-4">
        {/* Form */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-calculator me-2"></i>Enter Prediction Parameters
              </h6>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              {dataLoading ? (
                <div className="text-center py-4"><div className="spinner-border text-success"></div></div>
              ) : crops.length === 0 ? (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No crops found. Please add a crop first from the <strong>Crops</strong> section.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Select Crop</label>
                    <select name="crop" value={form.crop} onChange={handleChange} className="form-select" required>
                      {crops.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.crop_name} ({c.season}) — {c.field_name || 'Field'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Estimated Total Cost (₹)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        name="estimated_cost"
                        value={form.estimated_cost}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 25000"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <small className="text-muted">Seeds + Labour + Fertilizers + Irrigation + Other</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Expected Yield (Quintals)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        name="predicted_yield"
                        value={form.predicted_yield}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 40"
                        min="0"
                        step="0.01"
                        required
                      />
                      <span className="input-group-text">Qtl</span>
                    </div>
                    <small className="text-muted">Use AI Yield Prediction for an estimate</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Expected Selling Price (₹ per Quintal)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        name="estimated_selling_price"
                        value={form.estimated_selling_price}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 3500"
                        min="0"
                        step="0.01"
                        required
                      />
                      <span className="input-group-text">/Qtl</span>
                    </div>
                    <small className="text-muted">Check local APMC mandi rates</small>
                  </div>

                  {/* Live preview */}
                  {form.estimated_cost && form.predicted_yield && form.estimated_selling_price && (
                    <div className="alert alert-light border mb-4">
                      <strong>Preview:</strong> (
                      {form.predicted_yield} × ₹{form.estimated_selling_price}
                      ) − ₹{form.estimated_cost} ={' '}
                      <strong className={
                        (parseFloat(form.predicted_yield) * parseFloat(form.estimated_selling_price) - parseFloat(form.estimated_cost)) >= 0
                          ? 'text-success' : 'text-danger'
                      }>
                        ₹{(parseFloat(form.predicted_yield) * parseFloat(form.estimated_selling_price) - parseFloat(form.estimated_cost)).toLocaleString('en-IN')}
                      </strong>
                    </div>
                  )}

                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Calculating...</>
                      : <><i className="bi bi-magic me-2"></i>Predict Profit</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Result + History */}
        <div className="col-lg-7">
          {result && (
            <div className={`card border-0 shadow-sm mb-4 border-start border-4 ${isProfit ? 'border-success' : 'border-danger'}`}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '3rem' }}>{isProfit ? '💰' : '📉'}</div>
                <h2 className={`fw-bold mt-2 ${isProfit ? 'text-success' : 'text-danger'}`}>
                  {isProfit ? '+' : ''}₹{Number(result.predicted_profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </h2>
                <p className="text-muted mb-3">
                  {isProfit ? '✅ Expected Profit' : '⚠️ Expected Loss — Review your costs'}
                </p>
                <div className="row g-3 justify-content-center text-start">
                  <div className="col-sm-4">
                    <div className="card bg-danger-subtle border-0">
                      <div className="card-body py-2 px-3">
                        <small className="text-muted">Estimated Cost</small>
                        <div className="fw-bold text-danger">₹{Number(result.estimated_cost).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="card bg-info-subtle border-0">
                      <div className="card-body py-2 px-3">
                        <small className="text-muted">Expected Yield</small>
                        <div className="fw-bold text-info">{result.predicted_yield} Qtl</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="card bg-success-subtle border-0">
                      <div className="card-body py-2 px-3">
                        <small className="text-muted">Selling Price</small>
                        <div className="fw-bold text-success">₹{Number(result.estimated_selling_price).toLocaleString('en-IN')}/Qtl</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h6 className="mb-0 fw-semibold">
                <i className="bi bi-clock-history me-2 text-success"></i>Prediction History
              </h6>
            </div>
            <div className="card-body p-0">
              {history.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-4 d-block mb-1"></i>No predictions yet.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {history.slice(0, 10).map((pred) => {
                    const profit = parseFloat(pred.predicted_profit);
                    return (
                      <div key={pred.id} className="list-group-item d-flex align-items-center gap-3 py-3">
                        <div className="fs-3">{profit >= 0 ? '💰' : '📉'}</div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{pred.crop_name}</div>
                          <small className="text-muted">
                            Cost: ₹{Number(pred.estimated_cost).toLocaleString('en-IN')} ·
                            Yield: {pred.predicted_yield} Qtl ·
                            Price: ₹{Number(pred.estimated_selling_price).toLocaleString('en-IN')}/Qtl
                          </small>
                        </div>
                        <div className={`fw-bold ${profit >= 0 ? 'text-success' : 'text-danger'}`}>
                          {profit >= 0 ? '+' : ''}₹{profit.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
