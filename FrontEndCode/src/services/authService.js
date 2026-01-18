/**
 * authService.js
 *
 * Purpose:
 * - Central place for authentication-related API calls
 * - Fetch current logged-in user
 */

const API_BASE_URL = 'http://localhost:8080';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getCurrentUser = async () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/current-user`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return response.json();
};
