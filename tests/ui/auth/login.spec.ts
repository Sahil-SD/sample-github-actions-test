import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { TEST_USERS } from '../../../src/config/test-users.config';
import { LoginLocators } from '../../../src/locators/login.locators';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear storage state to test login
    await page.context().clearCookies();
  });

  test('should login with valid credentials', async ({ loginPage, testLogger }) => {
    testLogger.step(1, 'Navigate to login page');
    await loginPage.navigate();

    testLogger.step(2, 'Enter valid credentials and submit');
    const user = TEST_USERS.DEFAULT_USER;
    await loginPage.loginAndWait(user.email, user.password);

    testLogger.step(3, 'Verify successful login');
    await expect(loginPage.getPage()).toHaveURL(/contactList/);
  });

  test('should show error for invalid credentials', async ({ loginPage, testLogger }) => {
    testLogger.step(1, 'Navigate to login page');
    await loginPage.navigate();

    testLogger.step(2, 'Enter invalid credentials');
    await loginPage.login('invalid@email.com', 'wrongpassword');

    testLogger.step(3, 'Verify error message is displayed');
    await expect(loginPage.errorMessage).toBeVisible();
    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('Incorrect');
  });

  test('should navigate to signup page', async ({ loginPage, testLogger }) => {
    testLogger.step(1, 'Navigate to login page');
    await loginPage.navigate();

    testLogger.step(2, 'Click signup button');
    await loginPage.clickSignup();

    testLogger.step(3, 'Verify navigation to signup page');
    await expect(loginPage.getPage()).toHaveURL(/addUser/);
  });

  test('should validate required fields', async ({ loginPage, testLogger }) => {
    testLogger.step(1, 'Navigate to login page');
    await loginPage.navigate();

    testLogger.step(2, 'Submit empty form');
    await loginPage.clickSubmit();

    testLogger.step(3, 'Verify error is displayed');
    await expect(loginPage.errorMessage).toBeVisible();
  });
});