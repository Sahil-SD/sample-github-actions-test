import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';
import { DashboardPage } from '../../src/pages/dashboardPage';
import { testData } from '../../src/config/config';
import { logger } from '../../src/utils/logger';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigateToLogin();
  });

  test('TC001: Successful login with valid credentials', async () => {
    logger.info('TEST: TC001 - Successful login');
    
    // Arrange
    const username = testData.validUser.username;
    const password = testData.validUser.password;

    // Act
    await loginPage.login(username, password);

    // Assert
    await dashboardPage.verifyDashboardLoaded();
    await dashboardPage.verifyDashboardLoaded();
    logger.info('✓ Test passed');
  });

  test('TC002: Login with invalid credentials', async () => {
    logger.info('TEST: TC002 - Login with invalid credentials');

    // Arrange & Act
    await loginPage.login(testData.invalidUser.username, testData.invalidUser.password);

    // Assert
    expect(await loginPage.isErrorMessageDisplayed()).toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('Username and password do not match');
    logger.info('✓ Test passed');
  });

  test('TC003: Empty password field validation', async () => {
    logger.info('TEST: TC003 - Empty password validation');

    // Act
    await loginPage.fill(loginPage.usernameField, testData.validUser.username);
    await loginPage.click(loginPage.loginButton);

    // Assert
    expect(await loginPage.isErrorMessageDisplayed()).toBe(true);
    logger.info('✓ Test passed');
  });
});