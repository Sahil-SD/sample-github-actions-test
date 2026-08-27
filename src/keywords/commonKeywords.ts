import { Page } from '@playwright/test';
import { BasePage } from '../pages/basePage';
import { logger } from '../utils/logger';

export class CommonKeywords {
  private basePage: BasePage;

  constructor(page: Page) {
    this.basePage = new BasePage(page);
  }

  // Navigation Keywords
  async OPEN_BROWSER(url: string): Promise<void> {
    logger.info(`[KEYWORD] Opening browser with URL: ${url}`);
    await this.basePage.navigateTo(url);
  }

  async WAIT(seconds: number): Promise<void> {
    logger.info(`[KEYWORD] Waiting for ${seconds} seconds`);
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  async REFRESH_PAGE(): Promise<void> {
    logger.info('[KEYWORD] Refreshing page');
    await this.basePage.reload();
  }

  // Click Keywords
  async CLICK(locator: string): Promise<void> {
    logger.info(`[KEYWORD] Clicking element: ${locator}`);
    await this.basePage.click(locator);
  }

  async DOUBLE_CLICK(locator: string): Promise<void> {
    logger.info(`[KEYWORD] Double clicking element: ${locator}`);
    await this.basePage.dblClick(locator);
  }

  // Input Keywords
  async INPUT_TEXT(locator: string, text: string): Promise<void> {
    logger.info(`[KEYWORD] Inputting text: ${text} in ${locator}`);
    await this.basePage.fill(locator, text);
  }

  async CLEAR_FIELD(locator: string): Promise<void> {
    logger.info(`[KEYWORD] Clearing field: ${locator}`);
    await this.basePage.fill(locator, '');
  }

  // Verification Keywords
  async VERIFY_ELEMENT_VISIBLE(locator: string): Promise<void> {
    logger.info(`[KEYWORD] Verifying element is visible: ${locator}`);
    await this.basePage.verifyElementVisible(locator);
  }

  async VERIFY_ELEMENT_TEXT(locator: string, text: string): Promise<void> {
    logger.info(`[KEYWORD] Verifying element text: ${text}`);
    await this.basePage.verifyElementHasText(locator, text);
  }

  async VERIFY_URL(url: string): Promise<void> {
    logger.info(`[KEYWORD] Verifying URL: ${url}`);
    await this.basePage.verifyUrl(url);
  }

  async GET_TEXT(locator: string): Promise<string> {
    logger.info(`[KEYWORD] Getting text from element: ${locator}`);
    return await this.basePage.getText(locator);
  }
}