import axios from 'axios';

// Create an axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: 'http://localhost:5002/api', // Adjust this based on your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle auth tokens if needed
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token logic here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc.)
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
