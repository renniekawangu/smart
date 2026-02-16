import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  console.log(`🔐 Request [${config.method?.toUpperCase()} ${config.url}] - Token in localStorage:`, !!token);
  if (token) {
    console.log(`✓ Adding Authorization header for ${config.url}`);
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`✓ Authorization header set:`, config.headers.Authorization ? 'Yes' : 'No');
  } else {
    console.warn(`⚠️ No token in localStorage for request to: ${config.url}`);
  }
  console.log(`📤 Request headers:`, { 
    Authorization: config.headers.Authorization ? 'Bearer ***' : 'missing',
    ContentType: config.headers['Content-Type']
  });
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
