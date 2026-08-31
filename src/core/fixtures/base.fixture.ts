import { test as base } from '@playwright/test';
import { createLogger } from '../logger/logger';

const logger = createLogger('BaseFixture');

export interface BaseFixtures {
  testLogger: typeof logger;
}

export const test = base.extend<BaseFixtures>({
  testLogger: async ({}, use, testInfo) => {
    const testLogger = createLogger(`Test:${testInfo.title}`);
    testLogger.startTest(testInfo.title);

    await use(testLogger);

    const status = testInfo.status === 'passed' ? 'PASSED' :
                   testInfo.status === 'failed' ? 'FAILED' : 'SKIPPED';
    testLogger.endTest(testInfo.title, status);
  },
});

export { expect } from '@playwright/test';