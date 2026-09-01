import { test, expect } from '../../src/core/fixtures/combined.fixture';
import { TEST_USERS } from '../../src/config/test-users.config';
import { TestScenario } from '../../src/core/keywords/keyword-executor';

test.describe('Keyword-Driven Tests', () => {
  const loginScenario: TestScenario = {
    name: 'Login with valid credentials',
    description: 'User logs in and verifies contact list page',
    tags: ['smoke', 'authentication'],
    steps: [
      {
        keyword: 'NAVIGATE_TO_LOGIN',
        description: 'Navigate to login page',
      },
      {
        keyword: 'LOGIN',
        parameters: [
          TEST_USERS.DEFAULT_USER.email,
          TEST_USERS.DEFAULT_USER.password,
        ],
        description: 'Login with valid credentials',
      },
      {
        keyword: 'WAIT_FOR_PAGE_LOAD',
        description: 'Wait for page to load',
      },
      {
        keyword: 'VERIFY_URL',
        parameters: ['contactList'],
        expectedResult: true,
        description: 'Verify redirected to contact list',
      },
    ],
  };

  test('should execute login scenario', async ({
    page,
    keywordExecutor,
    uiKeywords,
  }) => {
    // Clear auth state for fresh login test
    await page.context().clearCookies();

    const result = await keywordExecutor.executeScenario(loginScenario);

    expect(result.status).toBe('passed');
    expect(result.stepResults.every((s) => s.status === 'passed')).toBeTruthy();
  });

  test('should add and verify contact via keywords', async ({
    keywordExecutor,
    uiKeywords,
  }) => {
    const timestamp = Date.now();
    const firstName = `Keyword${timestamp}`;
    const lastName = 'Test';

    const scenario: TestScenario = {
      name: 'Add and verify contact',
      steps: [
        {
          keyword: 'NAVIGATE_TO_CONTACT_LIST',
          description: 'Go to contact list',
        },
        {
          keyword: 'ADD_CONTACT',
          parameters: [firstName, lastName, 'keyword@test.com', '1234567890'],
          description: 'Add new contact',
        },
        {
          keyword: 'WAIT_FOR_TIMEOUT',
          parameters: [1_000], // Wait for 1 second
          description: 'Wait for a short timeout',
        },
        {
          keyword: 'VERIFY_CONTACT_EXISTS',
          parameters: [`${firstName} ${lastName}`],
          expectedResult: true,
          description: 'Verify contact exists',
        },
      ],
    };

    const result = await keywordExecutor.executeScenario(scenario);
    expect(result.status).toBe('passed');
  });

  test('should handle failed verification', async ({
    keywordExecutor,
    uiKeywords,
  }) => {
    const scenario: TestScenario = {
      name: 'Verify non-existent contact',
      steps: [
        {
          keyword: 'NAVIGATE_TO_CONTACT_LIST',
          description: 'Go to contact list',
        },
        {
          keyword: 'VERIFY_CONTACT_EXISTS',
          parameters: ['NonExistentContact12345'],
          expectedResult: true, // This should fail
          description: 'Verify contact that should not exist',
        },
      ],
    };

    const result = await keywordExecutor.executeScenario(scenario);
    expect(result.status).toBe('failed');
  });
});