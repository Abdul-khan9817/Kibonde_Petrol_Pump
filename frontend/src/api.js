import axios from 'axios';
import { getAdminToken, clearAdminSession } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

// Attach the admin token (if logged in) to every request.
api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the admin token is rejected/expired, clear it and go back to the admin login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && getAdminToken() && !url.includes('/admin/login')) {
      clearAdminSession();
      window.location.assign('/admin-login');
    }
    return Promise.reject(err);
  }
);

export default api;
