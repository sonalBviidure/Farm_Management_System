import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  // Dummy / Placeholder data for Phase 1 UI Foundation
  const stats = [
    {
      id: 'crops',
      title: 'Total Crops',
      value: '4 Active Crops',
      subtitle: 'Sugarcane, Soybean, Wheat, Cotton',
      icon: 'bi-flower2',
      color: 'text-success',
      bgColor: 'bg-success-subtle',
      route: '/crops',
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: '₹ 45,200',
      subtitle: 'Fertilizers, Seeds, Labor & Fuel',
      icon: 'bi-wallet2',
      color: 'text-danger',
      bgColor: 'bg-danger-subtle',
      route: '/expenses',
    },
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '₹ 1,15,000',
      subtitle: 'Recorded from harvested batches',
      icon: 'bi-cash-coin',
      color: 'text-primary',
      bgColor: 'bg-primary-subtle',
      route: '/harvest-sales',
    },
    {
      id: 'profit',
      title: 'Total Profit / Loss',
      value: '+ ₹ 69,800',
      subtitle: 'Net margin (Revenue - Expenses)',
      icon: 'bi-graph-up-arrow',
      color: 'text-success',
      bgColor: 'bg-success-subtle',
      route: '/reports',
    },
  ];

  const recentCrops = [
    { name: 'Sugarcane (Co 86032)', area: '2.5 Acres', sowingDate: '15 Jan 2026', status: 'Growing', health: 'Good' },
    { name: 'Soybean (JS 335)', area: '1.5 Acres', sowingDate: '20 Jun 2026', status: 'Flowering', health: 'Optimal' },
    { name: 'Wheat (Lokwan)', area: '1.0 Acre', sowingDate: '10 Nov 2025', status: 'Ready for Harvest', health: 'Excellent' },
  ];

  return (
    <div className="container-fluid p-0">
      {/* Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Farmer Dashboard</h2>
          <p className="text-muted mb-0 small">
            Farm operations overview, cultivation metrics, and financial summary
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border px-3 py-2">
            <i className="bi bi-geo-alt-fill text-danger me-1"></i> Kolhapur Farm (5.5 Acres)
          </span>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
            Season: Kharif / Rabi 2026
          </span>
        </div>
      </div>

      {/* Phase 1 Foundation Banner */}
      <div className="alert alert-success border-0 shadow-sm d-flex align-items-center gap-3 mb-4 rounded-3 p-3">
        <i className="bi bi-info-circle-fill fs-3 text-success"></i>
        <div className="small">
          <strong className="d-block">Phase 1: Basic Architecture &amp; UI Foundation Active</strong>
          <span className="text-muted">
            The values shown below are placeholder metrics. Live database integration and dynamic calculations will be connected in subsequent phases according to the project roadmap.
          </span>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div key={stat.id} className="col-12 col-sm-6 col-xl-3">
            <div className="kpi-card h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="text-secondary small fw-semibold text-uppercase">{stat.title}</span>
                  <div className={`kpi-icon-box ${stat.bgColor} ${stat.color}`}>
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                </div>
                <h3 className="fw-bold text-dark mb-1">{stat.value}</h3>
                <p className="text-muted small mb-0">{stat.subtitle}</p>
              </div>
              <div className="pt-3 mt-3 border-top d-flex justify-content-between align-items-center">
                <Link to={stat.route} className="text-decoration-none small text-success fw-semibold">
                  View Details <i className="bi bi-chevron-right ms-1"></i>
                </Link>
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Demo Metric</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity and Quick Actions */}
      <div className="row g-4">
        {/* Left Column: Sample Active Crops Preview */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 text-dark">
                <i className="bi bi-flower2 text-success me-2"></i>
                Active Crops Preview (Sample)
              </h6>
              <Link to="/crops" className="btn btn-outline-success btn-sm">
                Go to Crop Management
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-secondary">
                    <tr>
                      <th className="ps-3">Crop Name</th>
                      <th>Land Allocated</th>
                      <th>Sowing Date</th>
                      <th>Stage</th>
                      <th>Crop Status</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {recentCrops.map((crop, idx) => (
                      <tr key={idx}>
                        <td className="ps-3 fw-semibold text-dark">{crop.name}</td>
                        <td>{crop.area}</td>
                        <td>{crop.sowingDate}</td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {crop.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success">
                            {crop.health}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white text-muted small py-2 ps-3">
              <i className="bi bi-info-circle me-1"></i> Full crop lifecycle management will be enabled in <strong>Phase 3 (Shraddha)</strong>.
            </div>
          </div>
        </div>

        {/* Right Column: AI & System Readiness */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="fw-bold mb-0 text-dark">
                <i className="bi bi-cpu text-primary me-2"></i>
                AI Modules Roadmap
              </h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3 small">
                <div className="p-2 border rounded-2 bg-light">
                  <div className="d-flex justify-content-between fw-semibold">
                    <span>1. Crop Recommendation</span>
                    <span className="badge bg-warning text-dark">Sonali</span>
                  </div>
                  <p className="text-muted mb-0 small mt-1">Recommends ideal crop based on soil and climate.</p>
                </div>

                <div className="p-2 border rounded-2 bg-light">
                  <div className="d-flex justify-content-between fw-semibold">
                    <span>2. Yield Prediction</span>
                    <span className="badge bg-info text-dark">Shraddha</span>
                  </div>
                  <p className="text-muted mb-0 small mt-1">Estimates harvest tonnage per acre using ML.</p>
                </div>

                <div className="p-2 border rounded-2 bg-light">
                  <div className="d-flex justify-content-between fw-semibold">
                    <span>3. Profit Prediction</span>
                    <span className="badge bg-warning text-dark">Sonali</span>
                  </div>
                  <p className="text-muted mb-0 small mt-1">Forecasts expected returns based on historical trends.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-3 bg-fms-primary text-white p-3">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-people-fill fs-2"></i>
              <div>
                <h6 className="fw-bold mb-1">MCA-II Project Team</h6>
                <p className="small text-white-50 mb-0">
                  Sonali B. Vidure (Lead, ~65%)<br />
                  Shraddha S. Gurav (~35%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
