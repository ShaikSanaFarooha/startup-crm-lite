import axios from 'axios';
import toast from 'react-hot-toast';

// Retrieve backend API base URL from Vite environment variables (fallback to localhost:5000)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Custom Axios client instance configured for Backend REST API interactions.
 */
const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second request timeout limit
});

/**
 * Request Interceptor: Automatically attaches authorization Bearer headers
 * if a token is present in the browser local storage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor: Coordinates centralized error reporting and session invalidations.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 1. Handle server/database connection failures (Network Error)
    if (!error.response) {
      toast.error('Cannot connect to server. Check your connection.');
      return Promise.reject(new Error('Cannot connect to server. Check your connection.'));
    }

    // 2. Handle unauthorized/expired token errors (401 Status Code)
    if (error.response.status === 401) {
      // Clear local storage token
      localStorage.removeItem('crm-token');

      // Redirect user to the login route if not already there to prevent redirect loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
