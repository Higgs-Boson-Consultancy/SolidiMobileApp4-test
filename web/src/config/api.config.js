/**
 * API Configuration for Solidi Web App
 * Shared configuration between mobile and web platforms
 */

export const API_CONFIG = {
  // API Domain
  domain: 't2.solidi.co',
  
  // API Base URL
  baseURL: 'https://t2.solidi.co/api2/v1',
  
  // App version info
  appVersion: '1.2.0',
  buildNumber: '20251112',
  
  // Platform info
  platform: 'web',
  
  // User agent
  userAgent: typeof window !== 'undefined' 
    ? window.navigator.userAgent 
    : 'SolidiWeb/1.2.0',
  
  // Request timeout (ms)
  timeout: 30000,
  
  // Retry config
  maxRetries: 3,
  retryDelay: 1000,
};

export default API_CONFIG;
