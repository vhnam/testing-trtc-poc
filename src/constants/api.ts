import { ClientEnv } from './env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ClientEnv.API_URL,
  ENDPOINTS: {
    APPOINTMENTS: '/appointments',
    USERS: '/users',
    AUTH: '/auth',
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  appointments: {
    list: () => buildApiUrl(API_CONFIG.ENDPOINTS.APPOINTMENTS),
    detail: (id: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`),
    create: () => buildApiUrl(API_CONFIG.ENDPOINTS.APPOINTMENTS),
    update: (id: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`),
    delete: (id: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.APPOINTMENTS}/${id}`),
  },
  users: {
    list: () => buildApiUrl(API_CONFIG.ENDPOINTS.USERS),
    detail: (id: string) => buildApiUrl(`${API_CONFIG.ENDPOINTS.USERS}/${id}`),
  },
} as const;
