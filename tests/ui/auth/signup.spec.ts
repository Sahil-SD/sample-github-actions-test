import { test, expect } from '../../../src/core/fixtures/combined.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';

test.describe('Signup Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test('should register new user successfully', async ({ signupPage, testLogger }) => {
    testLogger.step(1, 'Navigate to signup page');
    await signupPage.navigate();

    testLogger.step(2, 'Fill registration form with unique data');
    const user = FakerProvider.generateUser();
    await signupPage.registerAndWait(user);

    testLogger.step(3, 'Verify successful registration');
    await expect(signupPage.getPage()).toHaveURL(/contactList/);
  });

  test('should show error for duplicate email', async ({
    signupPage,
    dataProvider,
    testLogger,
  }) => {
    // Use a known existing email
    const existingUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'automation.default@test.com', // This should already exist
      password: 'TestPassword123!',
    };

    testLogger.step(1, 'Navigate to signup page');
    await signupPage.navigate();

    testLogger.step(2, 'Fill form with existing email');
    await signupPage.register(existingUser);

    testLogger.step(3, 'Verify error message');
    await expect(signupPage.errorMessage).toBeVisible();
  });

  test('should validate password requirements', async ({ signupPage, testLogger }) => {
    testLogger.step(1, 'Navigate to signup page');
    await signupPage.navigate();

    testLogger.step(2, 'Fill form with weak password');
    const user = FakerProvider.generateUser({ password: '123' });
    await signupPage.register(user);

    testLogger.step(3, 'Verify validation error');
    await expect(signupPage.errorMessage).toBeVisible();
  });

  test('should navigate back to login', async ({ signupPage, testLogger }) => {
    testLogger.step(1, 'Navigate to signup page');
    await signupPage.navigate();

    testLogger.step(2, 'Click cancel button');
    await signupPage.clickCancel();

    testLogger.step(3, 'Verify navigation to login page');
    await expect(signupPage.getPage()).toHaveURL(/login|\/$/);
  });
});