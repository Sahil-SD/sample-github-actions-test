import { test, expect } from '../../../src/core/fixtures/api.fixture';
import { FakerProvider } from '../../../src/data/providers/faker-provider';

test.describe('Signup API Tests', () => {
  test('should register new user', async ({ authService }) => {
    const newUser = FakerProvider.generateUser();

    const response = await authService.register(newUser);

    expect(response.user).toBeDefined();
    expect(response.user.email).toBe(newUser.email);
    expect(response.token).toBeTruthy();
  });

  test('should fail registration with duplicate email', async ({
    authService,
  }) => {
    const user = FakerProvider.generateUser();

    // Register first time
    await authService.register(user);

    // Try to register again with same email
    await expect(authService.register(user)).rejects.toThrow();
  });
});