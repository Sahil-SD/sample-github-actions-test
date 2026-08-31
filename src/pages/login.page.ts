import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_ROUTES } from '../config/environment.config';
import { LoginLocators } from '../locators/login.locators';

export class LoginPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.LOGIN;
  protected readonly pageTitle = 'Contact List App';

  // Locator references from centralized locators
  private readonly locators = LoginLocators;

  constructor(page: Page) {
    super(page);
  }

  // Locator getters
  get emailInput(): Locator {
    return this.getLocator(this.locators.INPUTS.EMAIL);
  }

  get passwordInput(): Locator {
    return this.getLocator(this.locators.INPUTS.PASSWORD);
  }

  get submitButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.SUBMIT);
  }

  get signupButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.SIGNUP);
  }

  get errorMessage(): Locator {
    return this.getLocator(this.locators.MESSAGES.ERROR);
  }

  // Actions
  async login(email: string, password: string): Promise<void> {
    this.logger.info(`Attempting login with email: ${email}`);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  async clickSignup(): Promise<void> {
    this.logger.info('Clicking signup button');
    await this.click(this.signupButton);
  }

  async getErrorText(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async waitForLoginSuccess(): Promise<void> {
    await this.page.waitForURL(/contactList/);
    this.logger.info('Login successful');
  }

  async loginAndWait(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.waitForLoginSuccess();
  }

  async enterEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }
}