import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UI_ROUTES } from '../config/environment.config';
import { SignupLocators } from '../locators/signup.locators';
import { UserRegistration } from '../api/models/user.model';

export class SignupPage extends BasePage {
  protected readonly pageUrl = UI_ROUTES.SIGNUP;
  protected readonly pageTitle = 'Add User';

  // Locator references from centralized locators
  private readonly locators = SignupLocators;

  constructor(page: Page) {
    super(page);
  }

  // Locator getters
  get firstNameInput(): Locator {
    return this.getLocator(this.locators.INPUTS.FIRST_NAME);
  }

  get lastNameInput(): Locator {
    return this.getLocator(this.locators.INPUTS.LAST_NAME);
  }

  get emailInput(): Locator {
    return this.getLocator(this.locators.INPUTS.EMAIL);
  }

  get passwordInput(): Locator {
    return this.getLocator(this.locators.INPUTS.PASSWORD);
  }

  get submitButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.SUBMIT);
  }

  get cancelButton(): Locator {
    return this.getLocator(this.locators.BUTTONS.CANCEL);
  }

  get errorMessage(): Locator {
    return this.getLocator(this.locators.MESSAGES.ERROR);
  }

  // Actions
  async fillRegistrationForm(user: UserRegistration): Promise<void> {
    this.logger.info(`Filling registration form for: ${user.email}`);
    await this.fill(this.firstNameInput, user.firstName);
    await this.fill(this.lastNameInput, user.lastName);
    await this.fill(this.emailInput, user.email);
    await this.fill(this.passwordInput, user.password);
  }

  async submitForm(): Promise<void> {
    this.logger.info('Submitting registration form');
    await this.click(this.submitButton);
  }

  async register(user: UserRegistration): Promise<void> {
    await this.fillRegistrationForm(user);
    await this.submitForm();
  }

  async clickCancel(): Promise<void> {
    this.logger.info('Clicking cancel button');
    await this.click(this.cancelButton);
  }

  async getErrorText(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async waitForRegistrationSuccess(): Promise<void> {
    await this.page.waitForURL(/contactList/);
    this.logger.info('Registration successful');
  }

  async registerAndWait(user: UserRegistration): Promise<void> {
    await this.register(user);
    await this.waitForRegistrationSuccess();
  }
}