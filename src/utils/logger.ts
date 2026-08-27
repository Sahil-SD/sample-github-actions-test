import * as fs from 'fs';
import * as path from 'path';

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export class Logger {
  private logDir: string;
  private logFile: string;
  private currentLogLevel: LogLevel;

  constructor(fileName: string = 'app.log', logLevel: string = 'info') {
    this.logDir = path.join(__dirname, '../../logs');
    this.logFile = path.join(this.logDir, fileName);
    this.currentLogLevel = this.getLogLevel(logLevel);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getLogLevel(level: string): LogLevel {
    return LogLevel[level.toUpperCase() as keyof typeof LogLevel] || LogLevel.INFO;
  }

  private formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  private writeLog(level: LogLevel, message: string, data?: any): void {
    const formattedLog = this.formatLog(level, message, data);
    
    // Console output
    console.log(formattedLog);

    // File output
    fs.appendFileSync(this.logFile, formattedLog + '\n');
  }

  debug(message: string, data?: any): void {
    if (this.currentLogLevel <= LogLevel.DEBUG) {
      this.writeLog(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.currentLogLevel <= LogLevel.INFO) {
      this.writeLog(LogLevel.INFO, message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.currentLogLevel <= LogLevel.WARN) {
      this.writeLog(LogLevel.WARN, message, data);
    }
  }

  error(message: string, error?: Error | any): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    this.writeLog(LogLevel.ERROR, message, errorData);
  }
}

export const logger = new Logger();