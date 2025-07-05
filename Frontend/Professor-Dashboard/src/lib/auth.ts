import axios from 'axios';

const LOGIN_URL = 'http://localhost:5173/eduverse/login';
const PROFESSOR_URL = 'http://localhost:5175/eduverse/professor';

export const getStoredToken = () => localStorage.getItem('token');

export const setStoredToken = (token: string) => {
  try {
    localStorage.setItem('token', token);
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

export const isAuthenticated = () => {
  const token = getStoredToken();
  if (!token) return false;
  try {
    return token.length > 0;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const clearAllLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

export const handleRedirectedToken = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      const success = setStoredToken(token);
      if (success) {
        window.history.replaceState({}, document.title, PROFESSOR_URL + '/home');
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error handling auth redirect:', error);
    return false;
  }
};

export const logout = (navigate) => {
  clearAllLocalStorage();
  window.location.href = LOGIN_URL;
};

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout(() => {});
    }
    return Promise.reject(error);
  }
); 