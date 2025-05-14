// Configuration values for the application
const config = {
  // API URL - change this to match your backend API URL
  apiUrl: process.env.VITE_API_URL || 'http://localhost:5002/api',
  
  // Default request timeout in milliseconds
  requestTimeout: 30000,
  
  // Enable/disable request retries
  enableRetries: true,
  
  // Maximum number of retries
  maxRetries: 3
};

export default config;
