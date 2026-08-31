import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../core/logger/logger';
import { ENV } from '../config/environment.config';

export abstract class BasePage {
  protected page: Page;
  protected logger = createLogger(this.constructor.name);
  protected abstract readonly pageUrl: string;
  protected abstract readonly pageTitle: string;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Get locator from selector string
   */
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Get locator by test ID
   */
  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get locator by role
   */
  protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get locator by text
   */
  protected getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  // Navigation
  async navigate(): Promise<void> {
    this.logger.info(`Navigating to: ${this.pageUrl}`);
    await this.page.goto(this.pageUrl);
    await this.waitForPageLoad();
  }

  async navigateWithPath(path: string): Promise<void> {
    this.logger.info(`Navigating to: ${path}`);
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  // Wait helpers
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator: Locator, timeout: number = ENV.defaultTimeout): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForElementHidden(locator: Locator, timeout: number = ENV.defaultTimeout): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForSelector(selector: string, timeout: number = ENV.defaultTimeout): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  // Common actions
  async click(locator: Locator): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('click', description);
    await locator.click();
  }

  async clickBySelector(selector: string): Promise<void> {
    this.logger.logUIAction('click', selector);
    await this.page.click(selector);
  }

  async fill(locator: Locator, value: string): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('fill', description, value);
    await locator.fill(value);
  }

  async fillBySelector(selector: string, value: string): Promise<void> {
    this.logger.logUIAction('fill', selector, value);
    await this.page.fill(selector, value);
  }

  async clear(locator: Locator): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('clear', description);
    await locator.clear();
  }

  async clearBySelector(selector: string): Promise<void> {
    this.logger.logUIAction('clear', selector);
    await this.page.locator(selector).clear();
  }

  async type(locator: Locator, value: string, delay: number = 50): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('type', description, value);
    await locator.pressSequentially(value, { delay });
  }

  async selectOption(locator: Locator, value: string): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('select', description, value);
    await locator.selectOption(value);
  }

  async check(locator: Locator): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('check', description);
    await locator.check();
  }

  async uncheck(locator: Locator): Promise<void> {
    const description = await this.getLocatorDescription(locator);
    this.logger.logUIAction('uncheck', description);
    await locator.uncheck();
  }

  // Getters
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) || '';
  }

  async getTextBySelector(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  async getValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  async getValueBySelector(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  async getAttribute(locator: Locator, attribute: string): Promise<string | null> {
    return await locator.getAttribute(attribute);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  async isVisibleBySelector(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  async isChecked(locator: Locator): Promise<boolean> {
    return await locator.isChecked();
  }

  // Screenshot
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
  }

  // Assertions
  async expectToBeVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectToHaveText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  async expectToContainText(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async expectToHaveValue(locator: Locator, value: string): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  async expectUrlContains(text: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(text));
  }

  async expectTitleContains(text: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(text));
  }

  // Helper
  private async getLocatorDescription(locator: Locator): Promise<string> {
    try {
      const tag = await locator.evaluate((el) => el.tagName.toLowerCase());
      const id = await locator.getAttribute('id');
      const name = await locator.getAttribute('name');
      const className = await locator.getAttribute('class');

      if (id) return `${tag}#${id}`;
      if (name) return `${tag}[name="${name}"]`;
      if (className) return `${tag}.${className.split(' ')[0]}`;
      return tag;
    } catch {
      return 'unknown element';
    }
  }

  // Get current URL
  getUrl(): string {
    return this.page.url();
  }

  // Get page title
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // Get the underlying page object
  getPage(): Page {
    return this.page;
  }
}