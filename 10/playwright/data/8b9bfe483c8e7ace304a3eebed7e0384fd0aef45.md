# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/auth/signup-api.spec.ts >> Signup API Tests >> should register new user
- Location: tests/api/auth/signup-api.spec.ts:5:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Rocio_Reinger@yahoo.com"
Received: "rocio_reinger@yahoo.com"
```

# Test source

```ts
  1  | import { test, expect } from '../../../src/core/fixtures/api.fixture';
  2  | import { FakerProvider } from '../../../src/data/providers/faker-provider';
  3  | 
  4  | test.describe('Signup API Tests', () => {
  5  |   test('should register new user', async ({ authService }) => {
  6  |     const newUser = FakerProvider.generateUser();
  7  | 
  8  |     const response = await authService.register(newUser);
  9  | 
  10 |     expect(response.user).toBeDefined();
> 11 |     expect(response.user.email).toBe(newUser.email);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  12 |     expect(response.token).toBeTruthy();
  13 |   });
  14 | 
  15 |   test('should fail registration with duplicate email', async ({
  16 |     authService,
  17 |   }) => {
  18 |     const user = FakerProvider.generateUser();
  19 | 
  20 |     // Register first time
  21 |     await authService.register(user);
  22 | 
  23 |     // Try to register again with same email
  24 |     await expect(authService.register(user)).rejects.toThrow();
  25 |   });
  26 | });
```