import axios from 'axios';
import LocalStorageService from './LocalStorageService';

// Use a default URL for development (e.g., your local backend)
// In production, this should be an environment variable
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject the token into headers
api.interceptors.request.use(
  async (config) => {
    try {
      // In a real app, you would store the token separately, e.g., '@auth_token'
      // For now, we'll simulate getting a token if the user is logged in
      const user = await LocalStorageService.getItem<any>('@user');
      
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (error) {
      console.error('Error injecting token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      // We can't directly use hooks here, but we can clear storage
      // The AuthContext will eventually notice the missing user/token on app reload
      // Or we could emit an event to the AuthContext to trigger immediate logout
      await LocalStorageService.removeItem('@user');
      console.warn('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

export default api;
