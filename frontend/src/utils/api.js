// src/utils/api.js
// ============================================================
// INTERVIEW EXPLANATION:
// "How do you handle API calls in React?"
//
// We create a single axios instance instead of using fetch() everywhere.
// Benefits:
//   1. Base URL configured once — change the backend URL in one place
//   2. Interceptors handle auth and errors globally
//   3. Consistent error handling across the whole app
//
// "What is an axios interceptor?"
// It's a function that runs before every request or after every response.
// Request interceptor: automatically attaches JWT to every call
// Response interceptor: if we get a 401, log the user out everywhere
// ============================================================

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000, // fail requests that take longer than 10 seconds
});

// REQUEST: attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE: handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear everything and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Re-throw so individual components can also handle errors
    return Promise.reject(error);
  }
);

export default api;
