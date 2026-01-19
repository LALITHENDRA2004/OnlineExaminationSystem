import { BASE_URL } from './helper';

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
  return true;
};

export const isLoggedIn = () => {
  let token = localStorage.getItem('token');
  return token != null;
};

// Logout the user
export const doLogout = (next) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  next();
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  } else {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUser();
  if (!user || !user.authorities || user.authorities.length === 0) {
    return null;
  }
  return user.authorities[0].authority; // Returns "ADMIN" or "STUDENT"
};

export const loginUser = async (loginDetail) => {
  const response = await fetch(`${BASE_URL}/generate-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginDetail),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const getCurrentUser = async () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const response = await fetch(`${BASE_URL}/current-user`, {
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
