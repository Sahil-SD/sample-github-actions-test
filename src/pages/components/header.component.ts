import { Page, Locator } from '@playwright/test';
import { createLogger } from '../../core/logger/logger';
import { CommonLocators } from '../../locators/common.locators';

export class HeaderComponent {
  private page: Page;
  private logger = createLogger('HeaderComponent');

  // Locator references from centralized locators
  private readonly locators = CommonLocators.HEADER;

  constructor(page: Page) {
    this.page = page;
  }

  // Locator getters
  get logoutButton(): Locator {
    return this.page.locator(this.locators.LOGOUT_BUTTON);
  }

  get headerTitle(): Locator {
    return this.page.locator(this.locators.PAGE_TITLE);
  }

  // Actions
  async clickLogout(): Promise<void> {
    this.logger.info('Clicking logout button');
    await this.logoutButton.click();
  }

  async getTitle(): Promise<string> {
    return (await this.headerTitle.textContent()) || '';
  }

  async isLogoutVisible(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }
}