/**
 * API Keywords for Keyword-Driven Testing
 */

import { APIRequestContext } from '@playwright/test';
import { keywordRegistry, KeywordDefinition } from './keyword-registry';
import { ApiClient } from '../api/api-client';
import { AuthService } from '../../api/services/auth.service';
import { ContactService } from '../../api/services/contact.service';
import { ContactCreate, ContactUpdate, Contact } from '../../api/models/contact.model';
import { UserRegistration, UserLogin, AuthResponse } from '../../api/models/user.model';
import { createLogger } from '../logger/logger';

const logger = createLogger('APIKeywords');

export class APIKeywords {
  private apiClient: ApiClient;
  private authService: AuthService;
  private contactService: ContactService;

  constructor(apiContext: APIRequestContext) {
    this.apiClient = new ApiClient(apiContext);
    this.authService = new AuthService(this.apiClient.getRequestBuilder());
    this.contactService = new ContactService(this.apiClient.getRequestBuilder());
  }

  // Authentication Keywords
  async apiLogin(email: string, password: string): Promise<AuthResponse> {
    logger.info(`API Keyword: Login with ${email}`);
    const { response, token } = await this.authService.login({ email, password });
    this.apiClient.setToken(token);
    return response;
  }

  async apiLogout(): Promise<void> {
    logger.info('API Keyword: Logout');
    await this.authService.logout();
    this.apiClient.clearToken();
  }

  async apiRegister(user: UserRegistration): Promise<AuthResponse> {
    logger.info(`API Keyword: Register user ${user.email}`);
    return await this.authService.register(user);
  }

  async apiGetProfile(): Promise<unknown> {
    logger.info('API Keyword: Get user profile');
    return await this.authService.getProfile();
  }

  async apiDeleteAccount(): Promise<void> {
    logger.info('API Keyword: Delete user account');
    await this.authService.deleteAccount();
  }

  // Contact Keywords
  async apiGetAllContacts(): Promise<Contact[]> {
    logger.info('API Keyword: Get all contacts');
    return await this.contactService.getAllContacts();
  }

  async apiGetContact(id: string): Promise<Contact> {
    logger.info(`API Keyword: Get contact ${id}`);
    return await this.contactService.getContactById(id);
  }

  async apiCreateContact(contact: ContactCreate): Promise<Contact> {
    logger.info(`API Keyword: Create contact ${contact.firstName} ${contact.lastName}`);
    return await this.contactService.createContact(contact);
  }

  async apiUpdateContact(id: string, contact: ContactUpdate): Promise<Contact> {
    logger.info(`API Keyword: Update contact ${id}`);
    return await this.contactService.updateContact(id, contact);
  }

  async apiPatchContact(id: string, contact: ContactUpdate): Promise<Contact> {
    logger.info(`API Keyword: Patch contact ${id}`);
    return await this.contactService.patchContact(id, contact);
  }

  async apiDeleteContact(id: string): Promise<void> {
    logger.info(`API Keyword: Delete contact ${id}`);
    await this.contactService.deleteContact(id);
  }

  async apiDeleteAllContacts(): Promise<void> {
    logger.info('API Keyword: Delete all contacts');
    await this.contactService.deleteAllContacts();
  }

  // Verification Keywords
  async apiVerifyContactExists(id: string): Promise<boolean> {
    logger.info(`API Keyword: Verify contact exists ${id}`);
    try {
      await this.contactService.getContactById(id);
      return true;
    } catch {
      return false;
    }
  }

  async apiVerifyContactCount(expectedCount: number): Promise<boolean> {
    logger.info(`API Keyword: Verify contact count is ${expectedCount}`);
    const contacts = await this.contactService.getAllContacts();
    return contacts.length === expectedCount;
  }

  // Token management
  setToken(token: string): void {
    this.apiClient.setToken(token);
  }

  getToken(): string | undefined {
    return this.apiClient.getToken();
  }

  clearToken(): void {
    this.apiClient.clearToken();
  }
}

// Register API Keywords
export function registerAPIKeywords(apiContext: APIRequestContext): APIKeywords {
  const api = new APIKeywords(apiContext);

  const keywords: KeywordDefinition[] = [
    {
      name: 'API_LOGIN',
      description: 'Login via API',
      parameters: ['email', 'password'],
      execute: (email: unknown, password: unknown) =>
        api.apiLogin(email as string, password as string),
    },
    {
      name: 'API_LOGOUT',
      description: 'Logout via API',
      parameters: [],
      execute: () => api.apiLogout(),
    },
    {
      name: 'API_REGISTER',
      description: 'Register a new user via API',
      parameters: ['firstName', 'lastName', 'email', 'password'],
      execute: (firstName: unknown, lastName: unknown, email: unknown, password: unknown) =>
        api.apiRegister({
          firstName: firstName as string,
          lastName: lastName as string,
          email: email as string,
          password: password as string,
        }),
    },
    {
      name: 'API_GET_PROFILE',
      description: 'Get user profile via API',
      parameters: [],
      execute: () => api.apiGetProfile(),
    },
    {
      name: 'API_DELETE_ACCOUNT',
      description: 'Delete user account via API',
      parameters: [],
      execute: () => api.apiDeleteAccount(),
    },
    {
      name: 'API_GET_ALL_CONTACTS',
      description: 'Get all contacts via API',
      parameters: [],
      execute: () => api.apiGetAllContacts(),
    },
    {
      name: 'API_GET_CONTACT',
      description: 'Get a contact by ID via API',
      parameters: ['id'],
      execute: (id: unknown) => api.apiGetContact(id as string),
    },
    {
      name: 'API_CREATE_CONTACT',
      description: 'Create a contact via API',
      parameters: ['firstName', 'lastName', 'email', 'phone'],
      execute: (firstName: unknown, lastName: unknown, email: unknown, phone: unknown) =>
        api.apiCreateContact({
          firstName: firstName as string,
          lastName: lastName as string,
          email: email as string,
          phone: phone as string,
        }),
    },
    {
      name: 'API_UPDATE_CONTACT',
      description: 'Update a contact via API',
      parameters: ['id', 'data'],
      execute: (id: unknown, data: unknown) =>
        api.apiUpdateContact(id as string, data as ContactUpdate),
    },
    {
      name: 'API_DELETE_CONTACT',
      description: 'Delete a contact via API',
      parameters: ['id'],
      execute: (id: unknown) => api.apiDeleteContact(id as string),
    },
    {
      name: 'API_DELETE_ALL_CONTACTS',
      description: 'Delete all contacts via API',
      parameters: [],
      execute: () => api.apiDeleteAllContacts(),
    },
    {
      name: 'API_VERIFY_CONTACT_EXISTS',
      description: 'Verify contact exists via API',
      parameters: ['id'],
      execute: (id: unknown) => api.apiVerifyContactExists(id as string),
    },
    {
      name: 'API_VERIFY_CONTACT_COUNT',
      description: 'Verify contact count via API',
      parameters: ['expectedCount'],
      execute: (expectedCount: unknown) =>
        api.apiVerifyContactCount(expectedCount as number),
    },
    {
      name: 'API_SET_TOKEN',
      description: 'Set authentication token',
      parameters: ['token'],
      execute: (token: unknown) => {
        api.setToken(token as string);
        return Promise.resolve();
      },
    },
    {
      name: 'API_CLEAR_TOKEN',
      description: 'Clear authentication token',
      parameters: [],
      execute: () => {
        api.clearToken();
        return Promise.resolve();
      },
    },
  ];

  // Register all keywords
  keywords.forEach((keyword) => keywordRegistry.register(keyword));

  return api;
}