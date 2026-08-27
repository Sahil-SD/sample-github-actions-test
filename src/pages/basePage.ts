import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async navigateTo(url: string = ''): Promise<void> {
    const fullUrl = url || process.env.BASE_URL || '';
    logger.info(`Navigating to: ${fullUrl}`);
    await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
  }

  async goBack(): Promise<void> {
    logger.info('Going back to previous page');
    await this.page.goBack();
  }

  async reload(): Promise<void> {
    logger.info('Reloading page');
    await this.page.reload();
  }

  // Element Interactions
  async fill(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Filling text: ${text}`);
    await element.fill(text);
  }

  async click(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Clicking element`);
    await element.click();
  }

  async dblClick(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Double clicking element`);
    await element.dblclick();
  }

  async type(locator: Locator | string, text: string, delay: number = 50): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Typing text: ${text}`);
    await element.type(text, { delay });
  }

  async selectOption(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Selecting option: ${value}`);
    await element.selectOption(value);
  }

  async hover(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Hovering over element`);
    await element.hover();
  }

  async check(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Checking checkbox`);
    await element.check();
  }

  async uncheck(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Unchecking checkbox`);
    await element.uncheck();
  }

  // Visibility & Existence Checks
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  async isEnabled(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isEnabled();
  }

  async isChecked(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isChecked();
  }

  // Get Text & Values
  async getText(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent() || '';
  }

  async getInputValue(locator: Locator | string): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.inputValue();
  }

  async getAttribute(locator: Locator | string, attribute: string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.getAttribute(attribute);
  }

  // Waiting
  async waitForElement(locator: Locator | string, timeout: number = 5000): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Waiting for element (${timeout}ms)`);
    await element.waitFor({ timeout });
  }

  async waitForNavigation(): Promise<void> {
    logger.info('Waiting for navigation');
    await this.page.waitForNavigation();
  }

  // Assertions
  async verifyElementVisible(locator: Locator | string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info('Verifying element is visible');
    await expect(element).toBeVisible();
  }

  async verifyElementHasText(locator: Locator | string, text: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Verifying element has text: ${text}`);
    await expect(element).toContainText(text);
  }

  async verifyElementValue(locator: Locator | string, value: string): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logger.info(`Verifying element value: ${value}`);
    await expect(element).toHaveValue(value);
  }

  async verifyUrl(expectedUrl: string): Promise<void> {
    logger.info(`Verifying URL: ${expectedUrl}`);
    await expect(this.page).toHaveURL(new RegExp(expectedUrl));
  }

  async verifyPageTitle(title: string): Promise<void> {
    logger.info(`Verifying page title: ${title}`);
    await expect(this.page).toHaveTitle(new RegExp(title));
  }

  // Screenshots & Videos
  async takeScreenshot(fileName: string = 'screenshot.png'): Promise<void> {
    const path = `./screenshots/${fileName}`;
    logger.info(`Taking screenshot: ${path}`);
    await this.page.screenshot({ path });
  }

  // Page context
  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  // Close
  async closePage(): Promise<void> {
    logger.info('Closing page');
    await this.page.close();
  }
}