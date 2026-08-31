import { test, expect } from '../../../src/core/fixtures/api.fixture';
import { TEST_USERS } from '../../../src/config/test-users.config';

test.describe('Login API Tests', () => {
  test('should login successfully with valid credentials', async ({
    authService,
  }) => {
    const user = TEST_USERS.DEFAULT_USER;
    const { response, token } = await authService.login({
      email: user.email,
      password: user.password,
    });

    expect(token).toBeTruthy();
    expect(response.user).toBeDefined();
    expect(response.user.email).toBe(user.email);
  });

  test('should fail login with invalid credentials', async ({
    authService,
  }) => {
    await expect(
      authService.login({
        email: 'invalid@email.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow();
  });

  test('should get user profile after login', async ({
    authService,
  }) => {
    const user = TEST_USERS.DEFAULT_USER;
    await authService.login({
      email: user.email,
      password: user.password,
    });

    const profile = await authService.getProfile();
    expect(profile.email).toBe(user.email);
  });
});