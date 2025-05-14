/**
 * This service mocks backend API endpoints for local development or testing.
 * Replace this with actual API calls in production.
 */
class MockApiService {
  /**
   * Simulates a health check endpoint
   * @returns A promise that resolves with a health status
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    // Simulate random network delays between 100ms and 1000ms
    const delay = Math.floor(Math.random() * 900) + 100;
    
    // Simulate occasional network failures (10% chance)
    const shouldFail = Math.random() < 0.1;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('Simulated network failure'));
        } else {
          resolve({
            status: 'healthy',
            timestamp: new Date().toISOString()
          });
        }
      }, delay);
    });
  }

  /**
   * Adds a mock API endpoint to the application
   */
  setupMockEndpoints() {
    // Create a mock fetch handler
    const originalFetch = window.fetch;
    
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Handle health endpoint
      if (url.includes('/api/health')) {
        const mockService = new MockApiService();
        try {
          const data = await mockService.checkHealth();
          return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Service unavailable' }), { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // Pass through all other requests to the original fetch
      return originalFetch(input, init);
    };

    console.log('Mock API endpoints are set up for development');
  }
}

export default new MockApiService();
