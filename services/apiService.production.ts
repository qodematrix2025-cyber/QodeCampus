// Production API Service Configuration
// This file demonstrates how to set up your API service for both local and production environments

// Development/Local: Uses relative path (proxied by Vite)
// Production: Uses absolute URL to your backend domain

const isDevelopment = import.meta.env.MODE === 'development';

// For production, set VITE_API_URL in your .env file
// Example: VITE_API_URL=https://api.yourdomain.com
const API_BASE_URL = isDevelopment 
  ? '/api'  // Local development - proxied via Vite
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');  // Production

console.log(`[API Service] Mode: ${isDevelopment ? 'development' : 'production'}`);
console.log(`[API Service] Base URL: ${API_BASE_URL}`);

export const apiService = {
  getHeaders() {
    const token = localStorage.getItem('qc_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'school-id': localStorage.getItem('qc_schoolId') || 'school1'
    };
  },

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers }
      });

      // Handle unauthorized
      if (response.status === 401) {
        localStorage.removeItem('qc_token');
        window.location.href = '/login';
      }

      return response;
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err);
      throw err;
    }
  },

  async login(credentials: { identifier: string; password: string }): Promise<any> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: credentials.identifier, 
        password: credentials.password 
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('qc_token', data.token);
    localStorage.setItem('qc_schoolId', data.user.schoolId || 'school1');
    return data.user;
  },

  // Add more API methods as needed...
  // Each one uses this.request() which handles auth and error handling
};
