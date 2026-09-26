import React, { useState, useEffect } from 'react';
import { getCropComparisonReport, getFinancialSummaries, recalculateFinancial, getCrops } from '../../services/api';

/**
 * Reports & Financial Analytics Page
 * Phase 6 & 7 — Sonali Bhauso Vidure
 */
export default function ReportsPage() {
  const [crops, setCrops] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cropRes, reportRes] = await Promise.all([
        getCrops(),
        getCropComparisonReport(),
      ]);
      setCrops(cropRes);
      setReport(reportRes.crop_comparison || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecalculate(cropId, cropName) {
    setRecalculating(cropId);
    setSuccess('');
    setError('');
    try {
      await recalculateFinancial(cropId);
      setSuccess(`✅ Financial analysis recalculated for "${cropName}"`);
      await loadData();
    } catch (e) {
      setError(e.message);
    } finally {
      setRecalculating(null);
    }
  }

  const totalRevenue = report.reduce((s, r) => s + r.total_revenue, 0);
  const totalCost = report.reduce((s, r) => s + r.total_cost, 0);
  const netProfit = totalRevenue - totalCost;

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-success mb-0">
            <i className="bi bi-bar-chart-line me-2"></i>Financial Reports
          </h2>
          <small className="text-muted">Phase 6 &amp; 7 — Sonali Bhauso Vidure</small>
        </div>
        <button className="btn btn-outline-success" onClick={loadData} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-0 small opacity-75">Total Revenue</p>
                  <h3 className="fw-bold">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                </div>
                <i className="bi bi-cash-stack fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-0 small opacity-75">Total Cost</p>
                  <h3 className="fw-bold">₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                </div>
                <i className="bi bi-receipt fs-1 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm text-white ${netProfit >= 0 ? 'bg-primary' : 'bg-warning'}`}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-0 small opacity-75">Net Profit / Loss</p>
                  <h3 className="fw-bold">₹{netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                </div>
                <i className={`bi ${netProfit >= 0 ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'} fs-1 opacity-50`}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Comparison Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-table me-2 text-success"></i>Crop-wise Financial Comparison
          </h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">Loading report data...</p>
            </div>
          ) : report.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-clipboard-data fs-1 d-block mb-2"></i>
              <p>No financial data yet. Add expenses and sales first, then click <strong>Recalculate</strong> for each crop.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Crop</th>
                    <th>Season</th>
                    <th>Field</th>
                    <th>Area (acres)</th>
                    <th className="text-end">Cost (₹)</th>
                    <th className="text-end">Revenue (₹)</th>
                    <th className="text-end">Profit/Loss (₹)</th>
                    <th className="text-end">Profit/Acre (₹)</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr key={row.crop_id}>
                      <td className="fw-semibold">{row.crop_name}{row.variety ? ` (${row.variety})` : ''}</td>
                      <td><span className="badge bg-success-subtle text-success">{row.season}</span></td>
                      <td>{row.field_name}</td>
                      <td>{row.land_area}</td>
                      <td className="text-end text-danger">₹{Number(row.total_cost).toLocaleString('en-IN')}</td>
                      <td className="text-end text-success">₹{Number(row.total_revenue).toLocaleString('en-IN')}</td>
                      <td className={`text-end fw-bold ${row.profit_loss >= 0 ? 'text-success' : 'text-danger'}`}>
                        {row.profit_loss >= 0 ? '+' : ''}₹{Number(row.profit_loss).toLocaleString('en-IN')}
                      </td>
                      <td className={`text-end ${row.profit_per_acre >= 0 ? 'text-success' : 'text-danger'}`}>
                        ₹{Number(row.profit_per_acre).toLocaleString('en-IN')}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleRecalculate(row.crop_id, row.crop_name)}
                          disabled={recalculating === row.crop_id}
                        >
                          {recalculating === row.crop_id
                            ? <span className="spinner-border spinner-border-sm"></span>
                            : <><i className="bi bi-arrow-repeat me-1"></i>Recalc</>
                          }
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recalculate All */}
      {crops.length > 0 && report.length === 0 && (
        <div className="mt-3">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No financial data found. Click below to recalculate for all crops with recorded expenses &amp; sales.
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {crops.map((crop) => (
              <button
                key={crop.id}
                className="btn btn-outline-success btn-sm"
                onClick={() => handleRecalculate(crop.id, crop.crop_name)}
                disabled={recalculating === crop.id}
              >
                {recalculating === crop.id
                  ? <span className="spinner-border spinner-border-sm me-1"></span>
                  : <i className="bi bi-calculator me-1"></i>
                }
                Recalculate: {crop.crop_name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
