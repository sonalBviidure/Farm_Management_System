/**
 * API Service for Farm Management System
 * Facilitates communication between React frontend and Django REST Framework backend.
 */

export const API_BASE_URL = '/api';

/**
 * Helper to get authorization headers with saved token
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('fms_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }
  return headers;
}

/**
 * Fetch backend operational status and team metadata
 */
export async function getBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/status/`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      connected: true,
      data,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message || 'Unable to connect to Django backend',
    };
  }
}

/**
 * Register a new farmer account
 */
export async function registerFarmer(farmerData) {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(farmerData),
  });

  const data = await response.json();
  if (!response.ok) {
    let errorMsg = data.message || 'Registration failed';
    if (data.errors) {
      // Collect specific field error strings
      const fieldErrors = Object.entries(data.errors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');
      errorMsg = `${errorMsg} (${fieldErrors})`;
    }
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Log in an existing farmer
 */
export async function loginFarmer(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Invalid credentials');
  }

  return data;
}

/**
 * Fetch currently logged in farmer profile
 */
export async function getFarmerProfile() {
  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch farmer profile');
  }

  return await response.json();
}

/**
 * Logout the farmer session
 */
export async function logoutFarmer() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (err) {
    console.warn('Logout API request error:', err);
  } finally {
    localStorage.removeItem('fms_token');
    localStorage.removeItem('fms_user');
  }
}
