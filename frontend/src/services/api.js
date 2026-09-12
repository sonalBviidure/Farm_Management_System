/**
 * API Service for Farm Management System
 * Facilitates communication between React frontend and Django REST Framework backend.
 */

export const API_BASE_URL = '/api';

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
