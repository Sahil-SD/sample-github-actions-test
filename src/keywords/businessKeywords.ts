import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { logger } from '../utils/logger';

export class BusinessKeywords {
  private loginPage: LoginPage;
  private dashboardPage: DashboardPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
    this.dashboardPage = new DashboardPage(page);
  }

  // Business Keywords
  async LOGIN_AS_USER(username: string, password: string): Promise<void> {
    logger.info(`[BUSINESS KEYWORD] Logging in as user: ${username}`);
    await this.loginPage.navigateToLogin();
    await this.loginPage.verifyLoginPageLoaded();
    await this.loginPage.login(username, password);
  }

  async VERIFY_LOGIN_FAILED(expectedError: string): Promise<void> {
    logger.info(`[BUSINESS KEYWORD] Verifying login failed with error: ${expectedError}`);
    const errorMessage = await this.loginPage.getErrorMessage();
    if (!errorMessage.includes(expectedError)) {
      throw new Error(`Expected error: ${expectedError}, but got: ${errorMessage}`);
    }
  }

  async VERIFY_DASHBOARD_LOADED(): Promise<void> {
    logger.info('[BUSINESS KEYWORD] Verifying dashboard is loaded');
    await this.dashboardPage.verifyDashboardLoaded();
  }

  async ADD_PRODUCT_TO_CART(quantity: number = 1): Promise<void> {
    logger.info(`[BUSINESS KEYWORD] Adding ${quantity} product(s) to cart`);
    for (let i = 0; i < quantity; i++) {
      await this.dashboardPage.addProductToCart(i);
    }
  }

  async VERIFY_CART_COUNT(expectedCount: string): Promise<void> {
    logger.info(`[BUSINESS KEYWORD] Verifying cart count: ${expectedCount}`);
    const cartCount = await this.dashboardPage.getCartItemsCount();
    if (cartCount !== expectedCount) {
      throw new Error(`Expected cart count: ${expectedCount}, but got: ${cartCount}`);
    }
  }

  async LOGOUT(): Promise<void> {
    logger.info('[BUSINESS KEYWORD] Logging out');
    await this.dashboardPage.logout();
  }
}