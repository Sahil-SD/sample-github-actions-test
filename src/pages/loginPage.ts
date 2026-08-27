import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  // Locators
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly acceptCookies: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.acceptCookies = page.locator('button:has-text("Accept")');
  }

  async navigateToLogin(): Promise<void> {
    await this.navigateTo();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async verifyLoginPageLoaded(): Promise<void> {
    await this.verifyElementVisible(this.loginButton);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}