import { FullConfig } from '@playwright/test';
import { createLogger } from './src/core/logger/logger';

const logger = createLogger('GlobalTeardown');

async function globalTeardown(config: FullConfig): Promise<void> {
  logger.info('Starting global teardown...');

  // Add any cleanup tasks here
  // For example:
  // - Clean up test data via API
  // - Archive logs
  // - Send notifications

  logger.info('Global teardown completed');
}

export default globalTeardown;