/**
 * API Service — Farm Management System (FMS)
 * All HTTP calls to Django REST Framework backend.
 *
 * Phase 2  (Auth)          — Sonali
 * Phase 3  (Fields/Crops)  — Shraddha
 * Phase 4  (Expenses)      — Shraddha
 * Phase 5  (Harvest/Sales) — Shraddha
 * Phase 6  (Financial)     — Sonali
 * Phase 7  (Reports)       — Sonali
 * Phase 8  (AI)            — Sonali & Shraddha
 */

export const API_BASE_URL = '/api';

// ─────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────

export function getAuthHeaders() {
  const token = localStorage.getItem('fms_token');
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Token ${token}`;
  return headers;
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    let msg = data.message || data.detail || 'Request failed';
    if (data.errors) {
      const fieldErrors = Object.entries(data.errors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');
      msg = `${msg} (${fieldErrors})`;
    }
    throw new Error(msg);
  }
  return data;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 2 — Auth  (Sonali)
// ─────────────────────────────────────────────────────────────────

export async function getBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/status/`, { headers: { Accept: 'application/json' } });
    return { connected: res.ok, data: await res.json() };
  } catch (e) {
    return { connected: false, error: e.message };
  }
}

export async function registerFarmer(farmerData) {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(farmerData),
  });
  return handleResponse(res);
}

export async function loginFarmer(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(res);
}

export async function getFarmerProfile() {
  const res = await fetch(`${API_BASE_URL}/auth/profile/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function updateFarmerProfile(data) {
  const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function logoutFarmer() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: getAuthHeaders() });
  } catch (e) {
    console.warn('Logout error:', e);
  } finally {
    localStorage.removeItem('fms_token');
    localStorage.removeItem('fms_user');
  }
}

// ─────────────────────────────────────────────────────────────────
//  Phase 3 — Fields  (Shraddha)
// ─────────────────────────────────────────────────────────────────

export async function getFields() {
  const res = await fetch(`${API_BASE_URL}/fields/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createField(data) {
  const res = await fetch(`${API_BASE_URL}/fields/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateField(id, data) {
  const res = await fetch(`${API_BASE_URL}/fields/${id}/`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteField(id) {
  const res = await fetch(`${API_BASE_URL}/fields/${id}/`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete field');
  return true;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 3 — Crops  (Shraddha)
// ─────────────────────────────────────────────────────────────────

export async function getCrops() {
  const res = await fetch(`${API_BASE_URL}/crops/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getCrop(id) {
  const res = await fetch(`${API_BASE_URL}/crops/${id}/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createCrop(data) {
  const res = await fetch(`${API_BASE_URL}/crops/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateCrop(id, data) {
  const res = await fetch(`${API_BASE_URL}/crops/${id}/`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCrop(id) {
  const res = await fetch(`${API_BASE_URL}/crops/${id}/`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete crop');
  return true;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 4 — Expenses  (Shraddha)
// ─────────────────────────────────────────────────────────────────

export async function getExpenses(cropId = null) {
  const url = cropId
    ? `${API_BASE_URL}/expenses/?crop_id=${cropId}`
    : `${API_BASE_URL}/expenses/`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createExpense(data) {
  const res = await fetch(`${API_BASE_URL}/expenses/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateExpense(id, data) {
  const res = await fetch(`${API_BASE_URL}/expenses/${id}/`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE_URL}/expenses/${id}/`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  return true;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 5 — Harvests  (Shraddha)
// ─────────────────────────────────────────────────────────────────

export async function getHarvests(cropId = null) {
  const url = cropId
    ? `${API_BASE_URL}/harvests/?crop_id=${cropId}`
    : `${API_BASE_URL}/harvests/`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createHarvest(data) {
  const res = await fetch(`${API_BASE_URL}/harvests/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteHarvest(id) {
  const res = await fetch(`${API_BASE_URL}/harvests/${id}/`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete harvest');
  return true;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 5 — Sales  (Shraddha)
// ─────────────────────────────────────────────────────────────────

export async function getSales(harvestId = null) {
  const url = harvestId
    ? `${API_BASE_URL}/sales/?harvest_id=${harvestId}`
    : `${API_BASE_URL}/sales/`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function createSale(data) {
  const res = await fetch(`${API_BASE_URL}/sales/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteSale(id) {
  const res = await fetch(`${API_BASE_URL}/sales/${id}/`, {
    method: 'DELETE', headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete sale');
  return true;
}

// ─────────────────────────────────────────────────────────────────
//  Phase 6 — Financial Analysis  (Sonali)
// ─────────────────────────────────────────────────────────────────

export async function getFinancialSummaries() {
  const res = await fetch(`${API_BASE_URL}/financial/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getFinancialForCrop(cropId) {
  const res = await fetch(`${API_BASE_URL}/financial/crop/${cropId}/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function recalculateFinancial(cropId) {
  const res = await fetch(`${API_BASE_URL}/financial/crop/${cropId}/`, {
    method: 'POST', headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

// ─────────────────────────────────────────────────────────────────
//  Phase 7 — Reports  (Sonali)
// ─────────────────────────────────────────────────────────────────

export async function getDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/reports/dashboard/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function getCropComparisonReport() {
  const res = await fetch(`${API_BASE_URL}/reports/crop-comparison/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

// ─────────────────────────────────────────────────────────────────
//  Phase 8 — AI Modules
// ─────────────────────────────────────────────────────────────────

// 8b — Crop Recommendation (Sonali)
export async function getCropRecommendations() {
  const res = await fetch(`${API_BASE_URL}/ai/crop-recommendation/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function submitCropRecommendation(data) {
  const res = await fetch(`${API_BASE_URL}/ai/crop-recommendation/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 8a — Yield Prediction (Shraddha)
export async function getYieldPredictions() {
  const res = await fetch(`${API_BASE_URL}/ai/yield-prediction/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function submitYieldPrediction(data) {
  const res = await fetch(`${API_BASE_URL}/ai/yield-prediction/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// 8c — Profit Prediction (Sonali)
export async function getProfitPredictions() {
  const res = await fetch(`${API_BASE_URL}/ai/profit-prediction/`, { headers: getAuthHeaders() });
  return handleResponse(res);
}

export async function submitProfitPrediction(data) {
  const res = await fetch(`${API_BASE_URL}/ai/profit-prediction/`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data),
  });
  return handleResponse(res);
}
