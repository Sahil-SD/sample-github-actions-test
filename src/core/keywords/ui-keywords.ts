/**
 * UI Keywords for Keyword-Driven Testing
 */

import { Page } from '@playwright/test';
import { keywordRegistry, KeywordDefinition } from './keyword-registry';
import { LoginPage } from '../../pages/login.page';
import { SignupPage } from '../../pages/signup.page';
import { ContactListPage } from '../../pages/contact-list.page';
import { AddContactPage } from '../../pages/add-contact.page';
import { ContactDetailsPage } from '../../pages/contact-details.page';
import { EditContactPage } from '../../pages/edit-contact.page';
import { createLogger } from '../logger/logger';

const logger = createLogger('UIKeywords');

export class UIKeywords {
  private page: Page;
  private loginPage: LoginPage;
  private signupPage: SignupPage;
  private contactListPage: ContactListPage;
  private addContactPage: AddContactPage;
  private contactDetailsPage: ContactDetailsPage;
  private editContactPage: EditContactPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.contactListPage = new ContactListPage(page);
    this.addContactPage = new AddContactPage(page);
    this.contactDetailsPage = new ContactDetailsPage(page);
    this.editContactPage = new EditContactPage(page);
  }

  // Navigation Keywords
  async navigateToLogin(): Promise<void> {
    logger.info('Keyword: Navigate to Login');
    await this.loginPage.navigate();
  }

  async navigateToSignup(): Promise<void> {
    logger.info('Keyword: Navigate to Signup');
    await this.signupPage.navigate();
  }

  async navigateToContactList(): Promise<void> {
    logger.info('Keyword: Navigate to Contact List');
    await this.contactListPage.navigate();
  }

  async navigateToAddContact(): Promise<void> {
    logger.info('Keyword: Navigate to Add Contact');
    await this.addContactPage.navigate();
  }

  // Authentication Keywords
  async login(email: string, password: string): Promise<void> {
    logger.info(`Keyword: Login with ${email}`);
    await this.loginPage.navigate();
    await this.loginPage.loginAndWait(email, password);
  }

  async logout(): Promise<void> {
    logger.info('Keyword: Logout');
    await this.contactListPage.logout();
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    logger.info(`Keyword: Register user ${email}`);
    await this.signupPage.navigate();
    await this.signupPage.register({ firstName, lastName, email, password });
    await this.signupPage.waitForRegistrationSuccess();
  }

  // Contact Keywords
  async addContact(
    firstName: string,
    lastName: string,
    email?: string,
    phone?: string,
    birthdate?: string,
    street1?: string,
    city?: string,
    state?: string,
    postalCode?: string,
    country?: string
  ): Promise<void> {
    logger.info(`Keyword: Add contact ${firstName} ${lastName}`);
    await this.contactListPage.clickAddContact();
    await this.addContactPage.addContactAndWait({
      firstName,
      lastName,
      email,
      phone,
      birthdate,
      street1,
      city,
      stateProvince: state,
      postalCode,
      country,
    });
  }

  async viewContact(name: string): Promise<void> {
    logger.info(`Keyword: View contact ${name}`);
    await this.contactListPage.clickContactByName(name);
  }

  async editContact(field: string, value: string): Promise<void> {
    logger.info(`Keyword: Edit contact field ${field} to ${value}`);
    await this.contactDetailsPage.clickEdit();
    await this.editContactPage.updateContactAndWait({ [field]: value });
  }

  async deleteCurrentContact(): Promise<void> {
    logger.info('Keyword: Delete current contact');
    await this.contactDetailsPage.clickDelete();
  }

  // Verification Keywords
  async verifyContactExists(name: string): Promise<boolean> {
    logger.info(`Keyword: Verify contact exists - ${name}`);
    return await this.contactListPage.searchContactByName(name);
  }

  async verifyContactCount(expectedCount: number): Promise<boolean> {
    logger.info(`Keyword: Verify contact count is ${expectedCount}`);
    const actualCount = await this.contactListPage.getContactCount();
    return actualCount === expectedCount;
  }

  async verifyCurrentUrl(expectedUrl: string): Promise<boolean> {
    logger.info(`Keyword: Verify URL contains ${expectedUrl}`);
    const currentUrl = this.page.url();
    return currentUrl.includes(expectedUrl);
  }

  async verifyErrorMessage(expectedMessage: string): Promise<boolean> {
    logger.info(`Keyword: Verify error message - ${expectedMessage}`);
    try {
      const errorMessage = await this.loginPage.getErrorText();
      return errorMessage.includes(expectedMessage);
    } catch {
      return false;
    }
  }

  async getContactCount(): Promise<number> {
    logger.info('Keyword: Get contact count');
    return await this.contactListPage.getContactCount();
  }

  async getContactDetails(): Promise<Record<string, string>> {
    logger.info('Keyword: Get contact details');
    const details = await this.contactDetailsPage.getContactDetails();
    return details as Record<string, string>;
  }

  // Wait Keywords
  async waitForTimeout(timeout: number = 1_000): Promise<void> {
    logger.info(`Keyword: Wait for timeout ${timeout}ms`);
    await this.page.waitForTimeout(timeout);
  }

  async waitForPageLoad(): Promise<void> {
    logger.info('Keyword: Wait for page load');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(selector: string): Promise<void> {
    logger.info(`Keyword: Wait for element ${selector}`);
    await this.page.waitForSelector(selector);
  }

  async waitForUrl(urlPattern: string): Promise<void> {
    logger.info(`Keyword: Wait for URL pattern ${urlPattern}`);
    await this.page.waitForURL(new RegExp(urlPattern));
  }

  // Screenshot Keywords
  async takeScreenshot(name: string): Promise<void> {
    logger.info(`Keyword: Take screenshot - ${name}`);
    await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
  }

  // Click Keywords
  async clickElement(selector: string): Promise<void> {
    logger.info(`Keyword: Click element ${selector}`);
    await this.page.click(selector);
  }

  // Input Keywords
  async enterText(selector: string, text: string): Promise<void> {
    logger.info(`Keyword: Enter text in ${selector}`);
    await this.page.fill(selector, text);
  }

  async clearAndEnterText(selector: string, text: string): Promise<void> {
    logger.info(`Keyword: Clear and enter text in ${selector}`);
    await this.page.locator(selector).clear();
    await this.page.fill(selector, text);
  }

  // Assertion Keywords
  async assertElementVisible(selector: string): Promise<boolean> {
    logger.info(`Keyword: Assert element visible ${selector}`);
    return await this.page.locator(selector).isVisible();
  }

  async assertElementText(selector: string, expectedText: string): Promise<boolean> {
    logger.info(`Keyword: Assert element text ${selector} = ${expectedText}`);
    const actualText = await this.page.locator(selector).textContent();
    return actualText?.includes(expectedText) ?? false;
  }

  async assertPageTitle(expectedTitle: string): Promise<boolean> {
    logger.info(`Keyword: Assert page title = ${expectedTitle}`);
    const actualTitle = await this.page.title();
    return actualTitle.includes(expectedTitle);
  }
}

// Register UI Keywords
export function registerUIKeywords(page: Page): UIKeywords {
  const ui = new UIKeywords(page);

  const keywords: KeywordDefinition[] = [
    {
      name: 'NAVIGATE_TO_LOGIN',
      description: 'Navigate to the login page',
      parameters: [],
      execute: () => ui.navigateToLogin(),
    },
    {
      name: 'NAVIGATE_TO_SIGNUP',
      description: 'Navigate to the signup page',
      parameters: [],
      execute: () => ui.navigateToSignup(),
    },
    {
      name: 'NAVIGATE_TO_CONTACT_LIST',
      description: 'Navigate to the contact list page',
      parameters: [],
      execute: () => ui.navigateToContactList(),
    },
    {
      name: 'NAVIGATE_TO_ADD_CONTACT',
      description: 'Navigate to the add contact page',
      parameters: [],
      execute: () => ui.navigateToAddContact(),
    },
    {
      name: 'LOGIN',
      description: 'Login with email and password',
      parameters: ['email', 'password'],
      execute: (email: unknown, password: unknown) =>
        ui.login(email as string, password as string),
    },
    {
      name: 'LOGOUT',
      description: 'Logout from the application',
      parameters: [],
      execute: () => ui.logout(),
    },
    {
      name: 'REGISTER',
      description: 'Register a new user',
      parameters: ['firstName', 'lastName', 'email', 'password'],
      execute: (firstName: unknown, lastName: unknown, email: unknown, password: unknown) =>
        ui.register(
          firstName as string,
          lastName as string,
          email as string,
          password as string
        ),
    },
    {
      name: 'ADD_CONTACT',
      description: 'Add a new contact',
      parameters: ['firstName', 'lastName', 'email', 'phone', 'birthdate', 'street1', 'city', 'state', 'postalCode', 'country'],
      execute: (
        firstName: unknown,
        lastName: unknown,
        email: unknown,
        phone: unknown,
        birthdate: unknown,
        street1: unknown,
        city: unknown,
        state: unknown,
        postalCode: unknown,
        country: unknown
      ) =>
        ui.addContact(
          firstName as string,
          lastName as string,
          email as string,
          phone as string,
          birthdate as string,
          street1 as string,
          city as string,
          state as string,
          postalCode as string,
          country as string
        ),
    },
    {
      name: 'VIEW_CONTACT',
      description: 'View a contact by name',
      parameters: ['name'],
      execute: (name: unknown) => ui.viewContact(name as string),
    },
    {
      name: 'EDIT_CONTACT',
      description: 'Edit a contact field',
      parameters: ['field', 'value'],
      execute: (field: unknown, value: unknown) =>
        ui.editContact(field as string, value as string),
    },
    {
      name: 'DELETE_CONTACT',
      description: 'Delete the current contact',
      parameters: [],
      execute: () => ui.deleteCurrentContact(),
    },
    {
      name: 'VERIFY_CONTACT_EXISTS',
      description: 'Verify a contact exists by name',
      parameters: ['name'],
      execute: (name: unknown) => ui.verifyContactExists(name as string),
    },
    {
      name: 'VERIFY_CONTACT_COUNT',
      description: 'Verify the contact count',
      parameters: ['expectedCount'],
      execute: (expectedCount: unknown) =>
        ui.verifyContactCount(expectedCount as number),
    },
    {
      name: 'VERIFY_URL',
      description: 'Verify current URL contains expected text',
      parameters: ['expectedUrl'],
      execute: (expectedUrl: unknown) =>
        ui.verifyCurrentUrl(expectedUrl as string),
    },
    {
      name: 'VERIFY_ERROR_MESSAGE',
      description: 'Verify error message is displayed',
      parameters: ['expectedMessage'],
      execute: (expectedMessage: unknown) =>
        ui.verifyErrorMessage(expectedMessage as string),
    },
    {
      name: 'WAIT_FOR_TIMEOUT',
      description: 'Wait for a specified timeout',
      parameters: ['timeout'],
      execute: (timeout: unknown) => ui.waitForTimeout(timeout as number),
    },
    {
      name: 'WAIT_FOR_PAGE_LOAD',
      description: 'Wait for page to fully load',
      parameters: [],
      execute: () => ui.waitForPageLoad(),
    },
    {
      name: 'WAIT_FOR_ELEMENT',
      description: 'Wait for element to be visible',
      parameters: ['selector'],
      execute: (selector: unknown) => ui.waitForElement(selector as string),
    },
    {
      name: 'WAIT_FOR_URL',
      description: 'Wait for URL to match pattern',
      parameters: ['urlPattern'],
      execute: (urlPattern: unknown) => ui.waitForUrl(urlPattern as string),
    },
    {
      name: 'TAKE_SCREENSHOT',
      description: 'Take a screenshot',
      parameters: ['name'],
      execute: (name: unknown) => ui.takeScreenshot(name as string),
    },
    {
      name: 'CLICK',
      description: 'Click an element',
      parameters: ['selector'],
      execute: (selector: unknown) => ui.clickElement(selector as string),
    },
    {
      name: 'ENTER_TEXT',
      description: 'Enter text in an input field',
      parameters: ['selector', 'text'],
      execute: (selector: unknown, text: unknown) =>
        ui.enterText(selector as string, text as string),
    },
    {
      name: 'CLEAR_AND_ENTER_TEXT',
      description: 'Clear field and enter text',
      parameters: ['selector', 'text'],
      execute: (selector: unknown, text: unknown) =>
        ui.clearAndEnterText(selector as string, text as string),
    },
    {
      name: 'ASSERT_ELEMENT_VISIBLE',
      description: 'Assert element is visible',
      parameters: ['selector'],
      execute: (selector: unknown) =>
        ui.assertElementVisible(selector as string),
    },
    {
      name: 'ASSERT_ELEMENT_TEXT',
      description: 'Assert element contains text',
      parameters: ['selector', 'expectedText'],
      execute: (selector: unknown, expectedText: unknown) =>
        ui.assertElementText(selector as string, expectedText as string),
    },
    {
      name: 'ASSERT_PAGE_TITLE',
      description: 'Assert page title',
      parameters: ['expectedTitle'],
      execute: (expectedTitle: unknown) =>
        ui.assertPageTitle(expectedTitle as string),
    },
    {
      name: 'GET_CONTACT_COUNT',
      description: 'Get the number of contacts',
      parameters: [],
      execute: () => ui.getContactCount(),
    },
    {
      name: 'GET_CONTACT_DETAILS',
      description: 'Get current contact details',
      parameters: [],
      execute: () => ui.getContactDetails(),
    },
  ];

  // Register all keywords
  keywords.forEach((keyword) => keywordRegistry.register(keyword));

  return ui;
}