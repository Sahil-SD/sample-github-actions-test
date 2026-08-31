import * as fs from 'fs';
import * as path from 'path';
import { ENV } from '../../config/environment.config';
import { LogLevel, LOG_LEVEL_NAMES, parseLogLevel } from './log-levels';

export interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  public logLevel: LogLevel;
  public logDir: string;
  public logFile: string;
  public context: string;

  private constructor(context: string = 'App') {
    this.context = context;
    this.logLevel = parseLogLevel(ENV.logLevel);
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, `test-run-${this.getDateString()}.log`);
    this.ensureLogDirectory();
  }

  public static getInstance(context?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context);
    }
    if (context) {
      Logger.instance.context = context;
    }
    return Logger.instance;
  }

  public static createLogger(context: string): Logger {
    const logger = new Logger(context);
    return logger;
  }

  public ensureLogDirectory(): void {
    if (ENV.logToFile && !fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  public getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  public getTimestamp(): string {
    return new Date().toISOString();
  }

  public formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: this.getTimestamp(),
      level: LOG_LEVEL_NAMES[level],
      context: this.context,
      message,
      data,
    };
  }

  public colorize(level: LogLevel, text: string): string {
    const colors: Record<LogLevel, string> = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[35m', // Magenta
      [LogLevel.TRACE]: '\x1b[90m', // Gray
    };
    const reset = '\x1b[0m';
    return `${colors[level]}${text}${reset}`;
  }

  public log(level: LogLevel, message: string, data?: unknown): void {
    if (level > this.logLevel) return;

    const entry = this.formatMessage(level, message, data);
    const consoleMessage = `[${entry.timestamp}] [${entry.level}] [${entry.context}] ${entry.message}`;

    // Console output with colors
    console.log(this.colorize(level, consoleMessage));
    if (data) {
      console.log(this.colorize(level, JSON.stringify(data, null, 2)));
    }

    // File output
    if (ENV.logToFile) {
      const fileMessage = JSON.stringify(entry) + '\n';
      fs.appendFileSync(this.logFile, fileMessage);
    }
  }

  public error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  public trace(message: string, data?: unknown): void {
    this.log(LogLevel.TRACE, message, data);
  }

  public step(stepNumber: number, description: string): void {
    this.info(`Step ${stepNumber}: ${description}`);
  }

  public startTest(testName: string): void {
    this.info(`========== START: ${testName} ==========`);
  }

  public endTest(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED'): void {
    const statusMessage = status === 'PASSED' ? '✓' : status === 'FAILED' ? '✗' : '⊘';
    this.info(`========== END: ${testName} [${statusMessage} ${status}] ==========`);
  }

  public logApiRequest(method: string, url: string, body?: unknown): void {
    this.debug(`API Request: ${method} ${url}`, body);
  }

  public logApiResponse(status: number, body?: unknown): void {
    this.debug(`API Response: Status ${status}`, body);
  }

  public logUIAction(action: string, element: string, value?: string): void {
    const valueStr = value ? ` with value: "${value}"` : '';
    this.debug(`UI Action: ${action} on "${element}"${valueStr}`);
  }
}

export const createLogger = (context: string): Logger => Logger.createLogger(context);
export const logger = Logger.getInstance();