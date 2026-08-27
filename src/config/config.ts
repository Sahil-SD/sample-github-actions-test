export interface IConfig {
  baseUrl: string;
  browser: string;
  headless: boolean;
  timeout: number;
  slowMo: number;
  viewport: {
    width: number;
    height: number;
  };
  logLevel: string;
}

export const config: IConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  browser: process.env.BROWSER || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  slowMo: parseInt(process.env.SLOW_MO || '0'),
  viewport: {
    width: 1280,
    height: 720,
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const testData = {
  validUser: {
    username: process.env.VALID_USER || 'standard_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'invalid_pass',
  },
};