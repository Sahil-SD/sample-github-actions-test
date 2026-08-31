/**
 * Retry Decorator for methods
 */

import { createLogger } from '../logger/logger';

const logger = createLogger('RetryDecorator');

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: 'linear' | 'exponential';
  retryOn?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoff: 'exponential',
  retryOn: () => true,
};

export function Retry(options: RetryOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
          logger.debug(`Attempt ${attempt}/${config.maxAttempts} for ${propertyKey}`);
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (!config.retryOn(lastError)) {
            logger.debug(`Error not retryable for ${propertyKey}`);
            throw lastError;
          }

          if (attempt < config.maxAttempts) {
            const delay = config.backoff === 'exponential'
              ? config.delayMs * Math.pow(2, attempt - 1)
              : config.delayMs * attempt;

            logger.warn(
              `Attempt ${attempt} failed for ${propertyKey}. Retrying in ${delay}ms...`,
              { error: lastError.message }
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      logger.error(`All ${config.maxAttempts} attempts failed for ${propertyKey}`);
      throw lastError;
    };

    return descriptor;
  };
}

/**
 * Standalone retry function
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!config.retryOn(lastError) || attempt === config.maxAttempts) {
        throw lastError;
      }

      const delay = config.backoff === 'exponential'
        ? config.delayMs * Math.pow(2, attempt - 1)
        : config.delayMs * attempt;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}