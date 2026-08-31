import { APIRequestContext } from '@playwright/test';
import { ENV } from '../../config/environment.config';
import { RequestBuilder } from './request-builder';
import { createLogger } from '../logger/logger';

const logger = createLogger('ApiClient');

export class ApiClient {
  private requestBuilder: RequestBuilder;
  private token?: string;

  constructor(apiContext: APIRequestContext) {
    this.requestBuilder = new RequestBuilder(apiContext, ENV.apiBaseUrl);
  }

  public setToken(token: string): void {
    this.token = token;
    this.requestBuilder.setToken(token);
    logger.debug('Token set for API client');
  }

  public getToken(): string | undefined {
    return this.token;
  }

  public clearToken(): void {
    this.token = undefined;
    this.requestBuilder.clearToken();
    logger.debug('Token cleared from API client');
  }

  public getRequestBuilder(): RequestBuilder {
    return this.requestBuilder;
  }
}