import { APIRequestContext } from '@playwright/test';
import { createLogger } from '../logger/logger';

const logger = createLogger('RequestBuilder');

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export class RequestBuilder {
  private apiContext: APIRequestContext;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private token?: string;

  constructor(apiContext: APIRequestContext, baseUrl: string) {
    this.apiContext = apiContext;
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  public setToken(token: string): this {
    this.token = token;
    return this;
  }

  public clearToken(): this {
    this.token = undefined;
    return this;
  }

  public getToken(): string | undefined {
    return this.token;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }
    return url;
  }

  public async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);

    logger.logApiRequest('GET', url);
    const startTime = Date.now();

    const response = await this.apiContext.get(url, {
      headers,
      timeout: options.timeout,
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.json().catch(() => null);

    logger.logApiResponse(response.status(), { duration, body: responseBody });

    return responseBody as T;
  }

  public async post<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<{ data: T; status: number; headers: { [key: string]: string } }> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);

    logger.logApiRequest('POST', url, options.data);
    const startTime = Date.now();

    const response = await this.apiContext.post(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.json().catch(() => null);

    logger.logApiResponse(response.status(), { duration, body: responseBody });

    return {
      data: responseBody as T,
      status: response.status(),
      headers: response.headers(),
    };
  }

  public async put<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);

    logger.logApiRequest('PUT', url, options.data);
    const startTime = Date.now();

    const response = await this.apiContext.put(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.json().catch(() => null);

    logger.logApiResponse(response.status(), { duration, body: responseBody });

    return responseBody as T;
  }

  public async patch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);

    logger.logApiRequest('PATCH', url, options.data);
    const startTime = Date.now();

    const response = await this.apiContext.patch(url, {
      headers,
      data: options.data,
      timeout: options.timeout,
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.json().catch(() => null);

    logger.logApiResponse(response.status(), { duration, body: responseBody });

    return responseBody as T;
  }

  public async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = this.buildHeaders(options.headers);

    logger.logApiRequest('DELETE', url);
    const startTime = Date.now();

    const response = await this.apiContext.delete(url, {
      headers,
      timeout: options.timeout,
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.json().catch(() => null);

    logger.logApiResponse(response.status(), { duration, body: responseBody });

    return responseBody as T;
  }
}