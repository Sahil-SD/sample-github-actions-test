/**
 * Cookie handling utilities
 */

import { Page, BrowserContext, Cookie } from '@playwright/test';

export class CookieHelpers {
  private context: BrowserContext;

  constructor(context: BrowserContext) {
    this.context = context;
  }

  /**
   * Get all cookies
   */
  async getAllCookies(): Promise<Cookie[]> {
    return await this.context.cookies();
  }

  /**
   * Get cookie by name
   */
  async getCookie(name: string): Promise<Cookie | undefined> {
    const cookies = await this.getAllCookies();
    return cookies.find((c) => c.name === name);
  }

  /**
   * Set cookie
   */
  async setCookie(cookie: Cookie): Promise<void> {
    await this.context.addCookies([cookie]);
  }

  /**
   * Set multiple cookies
   */
  async setCookies(cookies: Cookie[]): Promise<void> {
    await this.context.addCookies(cookies);
  }

  /**
   * Delete cookie by name
   */
  async deleteCookie(name: string, url?: string): Promise<void> {
    const cookies = await this.getAllCookies();
    const cookieToDelete = cookies.find((c) => c.name === name);

    if (cookieToDelete) {
      await this.context.clearCookies();
      const remainingCookies = cookies.filter((c) => c.name !== name);
      await this.setCookies(remainingCookies);
    }
  }

  /**
   * Clear all cookies
   */
  async clearAllCookies(): Promise<void> {
    await this.context.clearCookies();
  }

  /**
   * Check if cookie exists
   */
  async hasCookie(name: string): Promise<boolean> {
    const cookie = await this.getCookie(name);
    return cookie !== undefined;
  }

  /**
   * Get cookie value
   */
  async getCookieValue(name: string): Promise<string | undefined> {
    const cookie = await this.getCookie(name);
    return cookie?.value;
  }

  /**
   * Save cookies to file
   */
  async saveCookies(filePath: string): Promise<void> {
    const cookies = await this.getAllCookies();
    const { FileHelpers } = await import('./file-helpers.js');
    FileHelpers.writeJson(filePath, cookies);
  }

  /**
   * Load cookies from file
   */
  async loadCookies(filePath: string): Promise<void> {
    const { FileHelpers } = await import('./file-helpers.js');
    if (FileHelpers.exists(filePath)) {
      const cookies = FileHelpers.readJson<Cookie[]>(filePath);
      await this.setCookies(cookies);
    }
  }
}