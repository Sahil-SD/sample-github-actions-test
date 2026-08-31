/**
 * Wait helper utilities
 */

import { Page, Locator } from '@playwright/test';

export class WaitHelpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for element to be visible
   */
  async waitForVisible(selector: string, timeout: number = 30000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Wait for element to be hidden
   */
  async waitForHidden(selector: string, timeout: number = 30000): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element to be attached to DOM
   */
  async waitForAttached(selector: string, timeout: number = 30000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'attached', timeout });
    return locator;
  }

  /**
   * Wait for URL to contain string
   */
  async waitForUrlContains(text: string, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(`**/*${text}*`, { timeout });
  }

  /**
   * Wait for URL to match regex
   */
  async waitForUrlMatches(pattern: RegExp, timeout: number = 30000): Promise<void> {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM content loaded
   */
  async waitForDomContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Wait for page load complete
   */
  async waitForLoadComplete(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }

  /**
   * Wait for specific response
   */
  async waitForResponse(
    urlPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<unknown> {
    const response = await this.page.waitForResponse(urlPattern, { timeout });
    return response.json();
  }

  /**
   * Wait for request
   */
  async waitForRequest(
    urlPattern: string | RegExp,
    timeout: number = 30000
  ): Promise<unknown> {
    const request = await this.page.waitForRequest(urlPattern, { timeout });
    return request.postDataJSON();
  }

  /**
   * Wait with custom condition
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = 30000,
    interval: number = 100
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.page.waitForTimeout(interval);
    }

    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Wait for element count
   */
  async waitForElementCount(
    selector: string,
    count: number,
    timeout: number = 30000
  ): Promise<void> {
    await this.waitForCondition(
      async () => {
        const elements = await this.page.locator(selector).count();
        return elements === count;
      },
      timeout
    );
  }

  /**
   * Wait for text to appear
   */
  async waitForText(text: string, timeout: number = 30000): Promise<void> {
    await this.page.getByText(text).waitFor({ state: 'visible', timeout });
  }
}