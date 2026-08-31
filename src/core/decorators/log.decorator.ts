/**
 * Logging Decorator for methods
 */

import { createLogger } from '../logger/logger';

const logger = createLogger('LogDecorator');

export interface LogOptions {
  logArgs?: boolean;
  logResult?: boolean;
  logDuration?: boolean;
  level?: 'info' | 'debug' | 'trace';
}

const DEFAULT_OPTIONS: Required<LogOptions> = {
  logArgs: true,
  logResult: false,
  logDuration: true,
  level: 'debug',
};

export function Log(options: LogOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = (target as object).constructor.name;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const methodName = `${className}.${propertyKey}`;
      const startTime = Date.now();

      // Log method entry
      if (config.logArgs) {
        logger[config.level](`→ ${methodName}`, { args });
      } else {
        logger[config.level](`→ ${methodName}`);
      }

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        // Log method exit
        if (config.logResult) {
          logger[config.level](
            `← ${methodName}${config.logDuration ? ` (${duration}ms)` : ''}`,
            { result }
          );
        } else if (config.logDuration) {
          logger[config.level](`← ${methodName} (${duration}ms)`);
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`✗ ${methodName} failed (${duration}ms)`, { error });
        throw error;
      }
    };

    return descriptor;
  };
}

export function LogClass(options: LogOptions = {}) {
  return function <T extends { new (...args: unknown[]): object }>(constructor: T): T {
    const methodNames = Object.getOwnPropertyNames(constructor.prototype).filter(
      (name) => name !== 'constructor' && typeof constructor.prototype[name] === 'function'
    );

    for (const methodName of methodNames) {
      const descriptor = Object.getOwnPropertyDescriptor(constructor.prototype, methodName);
      if (descriptor && typeof descriptor.value === 'function') {
        Object.defineProperty(
          constructor.prototype,
          methodName,
          Log(options)(constructor.prototype, methodName, descriptor)
        );
      }
    }

    return constructor;
  };
}