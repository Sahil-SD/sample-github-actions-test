import { test as base, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../api/api-client';
import { AuthService } from '../../api/services/auth.service';
import { ContactService } from '../../api/services/contact.service';
import { APIKeywords, registerAPIKeywords } from '../keywords/api-keywords';
import { createLogger } from '../logger/logger';

const logger = createLogger('APIFixture');

export interface APIFixtures {
  apiContext: APIRequestContext;
  apiClient: ApiClient;
  authService: AuthService;
  contactService: ContactService;
  apiKeywords: APIKeywords;
}

export const test = base.extend<APIFixtures>({
  apiContext: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({
      baseURL: process.env.API_BASE_URL || 'https://thinking-tester-contact-list.herokuapp.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(apiContext);

    await apiContext.dispose();
  },

  apiClient: async ({ apiContext }, use) => {
    const client = new ApiClient(apiContext);
    await use(client);
  },

  authService: async ({ apiClient }, use) => {
    const service = new AuthService(apiClient.getRequestBuilder());
    await use(service);
  },

  contactService: async ({ apiClient }, use) => {
    const service = new ContactService(apiClient.getRequestBuilder());
    await use(service);
  },

  apiKeywords: async ({ apiContext }, use) => {
    const keywords = registerAPIKeywords(apiContext);
    await use(keywords);
  },
});

export { expect } from '@playwright/test';