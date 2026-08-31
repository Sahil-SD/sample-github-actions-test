import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from './src/config/environment.config';
import { TEST_USERS } from './src/config/test-users.config';
import { createLogger } from './src/core/logger/logger';

const logger = createLogger('GlobalSetup');

async function globalSetup(config: FullConfig): Promise<void> {
  logger.info('Starting global setup...');

  // Ensure directories exist
  const directories = [
    'storage/auth',
    'reports/screenshots',
    'reports/html',
    'reports/json',
    'reports/junit',
    'reports/custom',
    'logs',
    'allure-results',
  ];

  for (const dir of directories) {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  }

  // Create authenticated state for test users
  const browser = await chromium.launch();

  try {
    for (const [userKey, user] of Object.entries(TEST_USERS)) {
      const storagePath = path.join(process.cwd(), user.storageStatePath);

      // Check if storage state already exists and is recent (less than 1 hour old)
      if (fs.existsSync(storagePath)) {
        const stats = fs.statSync(storagePath);
        const hourAgo = Date.now() - 60 * 60 * 1000;

        if (stats.mtimeMs > hourAgo) {
          logger.info(`Using existing auth state for ${userKey}`);
          continue;
        }
      }

      logger.info(`Creating auth state for ${userKey}...`);

      const context = await browser.newContext();
      const page = await context.newPage();

      try {
        // Navigate to login page
        await page.goto(`${ENV.baseUrl}/login`);

        // Attempt login
        await page.fill('#email', user.email);
        await page.fill('#password', user.password);
        await page.click('#submit');

        // Wait for navigation to contact list
        await page.waitForURL(/contactList/, { timeout: 10000 });

        // Save storage state
        await context.storageState({ path: storagePath });
        logger.info(`Auth state saved for ${userKey}`);
      } catch (error) {
        logger.warn(`Could not create auth state for ${userKey}. User may need to be created.`);
        logger.debug(`Error: ${error}`);

        // Try to register the user if login failed
        try {
          await page.goto(`${ENV.baseUrl}/addUser`);
          await page.fill('#firstName', user.firstName);
          await page.fill('#lastName', user.lastName);
          await page.fill('#email', user.email);
          await page.fill('#password', user.password);
          await page.click('#submit');

          await page.waitForURL(/contactList/, { timeout: 10000 });
          await context.storageState({ path: storagePath });
          logger.info(`User ${userKey} registered and auth state saved`);
        } catch (regError) {
          logger.error(`Failed to register ${userKey}: ${regError}`);
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  logger.info('Global setup completed');
}

export default globalSetup;