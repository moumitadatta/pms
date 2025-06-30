// src/utils/api.js
import axios from 'axios';


const baseURL = process.env.REACT_APP_API_URL || "https://pms-server-ygbl.onrender.com";

if (!baseURL) {
  console.warn("🚨 REACT_APP_API_URL is not defined. Check .env.production or .env file.");
}

const api = axios.create({
  baseURL: baseURL + '/api/v1',
  withCredentials: true, // ✅ important for cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Request interceptor for auth tokens
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

// Response interceptor for error handling
// src/utils/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);



export default api;