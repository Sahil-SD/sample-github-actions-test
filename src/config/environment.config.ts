import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig();

export interface EnvironmentConfig {
  nodeEnv: string;
  baseUrl: string;
  apiBaseUrl: string;
  logLevel: string;
  logToFile: boolean;
  defaultTimeout: number;
  retryCount: number;
  parallelWorkers: number;
  authStoragePath: string;
}

export const ENV: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
  logLevel: process.env.LOG_LEVEL || 'info',
  logToFile: process.env.LOG_TO_FILE === 'true',
  defaultTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10),
  retryCount: parseInt(process.env.RETRY_COUNT || '2', 10),
  parallelWorkers: parseInt(process.env.PARALLEL_WORKERS || '4', 10),
  authStoragePath: process.env.AUTH_STORAGE_PATH || path.join(process.cwd(), 'storage/auth'),
};

export const API_ROUTES = {
  // Auth routes
  USERS: '/users',
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  USER_PROFILE: '/users/me',

  // Contact routes
  CONTACTS: '/contacts',
  CONTACT_BY_ID: (id: string) => `/contacts/${id}`,
} as const;

export const UI_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/addUser',
  CONTACT_LIST: '/contactList',
  ADD_CONTACT: '/addContact',
  CONTACT_DETAILS: '/contactDetails',
  EDIT_CONTACT: '/editContact',
} as const;