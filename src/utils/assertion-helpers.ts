/**
 * Custom assertion helpers
 */

import { expect, Page, Locator } from '@playwright/test';

export class AssertionHelpers {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Assert element is visible
   */
  async assertVisible(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element is hidden
   */
  async assertHidden(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toBeHidden();
  }

  /**
   * Assert element has text
   */
  async assertText(selector: string | Locator, text: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toHaveText(text);
  }

  /**
   * Assert element contains text
   */
  async assertContainsText(selector: string | Locator, text: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toContainText(text);
  }

  /**
   * Assert element has value
   */
  async assertValue(selector: string | Locator, value: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toHaveValue(value);
  }

  /**
   * Assert URL contains
   */
  async assertUrlContains(text: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(text));
  }

  /**
   * Assert URL equals
   */
  async assertUrlEquals(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Assert page title
   */
  async assertTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Assert title contains
   */
  async assertTitleContains(text: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(text));
  }

  /**
   * Assert element count
   */
  async assertCount(selector: string, count: number): Promise<void> {
    const locator = this.page.locator(selector);
    await expect(locator).toHaveCount(count);
  }

  /**
   * Assert element is enabled
   */
  async assertEnabled(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert element is disabled
   */
  async assertDisabled(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert element is checked
   */
  async assertChecked(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toBeChecked();
  }

  /**
   * Assert element has attribute
   */
  async assertAttribute(
    selector: string | Locator,
    attribute: string,
    value: string
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toHaveAttribute(attribute, value);
  }

  /**
   * Assert element has class
   */
  async assertHasClass(selector: string | Locator, className: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(locator).toHaveClass(new RegExp(className));
  }

  /**
   * Soft assertion - doesn't stop test execution
   */
  async softAssert(
    assertion: () => Promise<void>,
    errorMessage: string
  ): Promise<{ passed: boolean; error?: string }> {
    try {
      await assertion();
      return { passed: true };
    } catch (error) {
      console.warn(`Soft assertion failed: ${errorMessage}`, error);
      return { passed: false, error: errorMessage };
    }
  }
}