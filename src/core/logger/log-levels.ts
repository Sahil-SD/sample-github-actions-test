export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.TRACE]: 'TRACE',
};

export const parseLogLevel = (level: string): LogLevel => {
  const upperLevel = level.toUpperCase();
  const entry = Object.entries(LOG_LEVEL_NAMES).find(([, name]) => name === upperLevel);
  return entry ? (parseInt(entry[0], 10) as LogLevel) : LogLevel.INFO;
};