import { ENV } from '../../config/environment.config';

export const API_ENDPOINTS = {
  BASE_URL: ENV.apiBaseUrl,

  AUTH: {
    REGISTER: '/users',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    PROFILE: '/users/me',
    DELETE_USER: '/users/me',
  },

  CONTACTS: {
    LIST: '/contacts',
    CREATE: '/contacts',
    GET: (id: string) => `/contacts/${id}`,
    UPDATE: (id: string) => `/contacts/${id}`,
    DELETE: (id: string) => `/contacts/${id}`,
  },
} as const;