import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawBaseUrl.endsWith('/api/v1')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send httpOnly studentToken cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage as fallback if cookies blocked
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mentiby_student_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: central error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const code = error.response?.data?.error?.code;

    if (status === 401) {
      // Don't auto-redirect on login checks
      if (!error.config.url.includes('/auth/me')) {
        localStorage.removeItem('mentiby_student_token');
        localStorage.removeItem('mentiby_student_user');
      }
    }

    return Promise.reject({
      status,
      message,
      code,
      data: error.response?.data,
    });
  }
);

export default api;
