import { test as base, Page, APIRequestContext } from '@playwright/test';
import { mergeTests } from '@playwright/test';

// Import all page objects
import { LoginPage } from '../../pages/login.page';
import { SignupPage } from '../../pages/signup.page';
import { ContactListPage } from '../../pages/contact-list.page';
import { AddContactPage } from '../../pages/add-contact.page';
import { ContactDetailsPage } from '../../pages/contact-details.page';
import { EditContactPage } from '../../pages/edit-contact.page';

// Import API services
import { ApiClient } from '../api/api-client';
import { AuthService } from '../../api/services/auth.service';
import { ContactService } from '../../api/services/contact.service';

// Import keywords
import { UIKeywords, registerUIKeywords } from '../keywords/ui-keywords';
import { APIKeywords, registerAPIKeywords } from '../keywords/api-keywords';
import { KeywordExecutor, createKeywordExecutor } from '../keywords/keyword-executor';

// Import data providers
import { DataProvider, dataProvider } from '../../data/providers/data-providers';
import { FakerProvider } from '../../data/providers/faker-provider';

// Import logger
import { createLogger } from '../logger/logger';

const logger = createLogger('CombinedFixture');

export interface CombinedFixtures {
  // Page Objects
  loginPage: LoginPage;
  signupPage: SignupPage;
  contactListPage: ContactListPage;
  addContactPage: AddContactPage;
  contactDetailsPage: ContactDetailsPage;
  editContactPage: EditContactPage;

  // API
  apiContext: APIRequestContext;
  apiClient: ApiClient;
  authService: AuthService;
  contactService: ContactService;

  // Keywords
  uiKeywords: UIKeywords;
  apiKeywords: APIKeywords;
  keywordExecutor: KeywordExecutor;

  // Data
  dataProvider: DataProvider;
  fakerProvider: typeof FakerProvider;

  // Logger
  testLogger: ReturnType<typeof createLogger>;
}

export const test = base.extend<CombinedFixtures>({
  // Page Objects
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },

  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },

  addContactPage: async ({ page }, use) => {
    await use(new AddContactPage(page));
  },

  contactDetailsPage: async ({ page }, use) => {
    await use(new ContactDetailsPage(page));
  },

  editContactPage: async ({ page }, use) => {
    await use(new EditContactPage(page));
  },

  // API Context
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
    await use(new ApiClient(apiContext));
  },

  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient.getRequestBuilder()));
  },

  contactService: async ({ apiClient }, use) => {
    await use(new ContactService(apiClient.getRequestBuilder()));
  },

  // Keywords
  uiKeywords: async ({ page }, use) => {
    await use(registerUIKeywords(page));
  },

  apiKeywords: async ({ apiContext }, use) => {
    await use(registerAPIKeywords(apiContext));
  },

  keywordExecutor: async ({}, use) => {
    await use(createKeywordExecutor());
  },

  // Data Providers
  dataProvider: async ({}, use) => {
    await use(dataProvider);
  },

  fakerProvider: async ({}, use) => {
    await use(FakerProvider);
  },

  // Logger
  testLogger: async ({}, use, testInfo) => {
    const testLog = createLogger(`Test:${testInfo.title}`);
    testLog.startTest(testInfo.title);

    await use(testLog);

    const status = testInfo.status === 'passed' ? 'PASSED' :
                   testInfo.status === 'failed' ? 'FAILED' : 'SKIPPED';
    testLog.endTest(testInfo.title, status);
  },
});

export { expect } from '@playwright/test';