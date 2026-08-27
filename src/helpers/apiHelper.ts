import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';

export class APIHelper {
  private client: AxiosInstance;

  constructor(baseURL: string = '') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async get<T>(endpoint: string, config?: any): Promise<T> {
    try {
      logger.info(`[API] GET request to: ${endpoint}`);
      const response: AxiosResponse<T> = await this.client.get(endpoint, config);
      logger.info(`[API] Response status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error('[API] GET request failed', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    try {
      logger.info(`[API] POST request to: ${endpoint}`, data);
      const response: AxiosResponse<T> = await this.client.post(endpoint, data, config);
      logger.info(`[API] Response status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error('[API] POST request failed', error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data?: any, config?: any): Promise<T> {
    try {
      logger.info(`[API] PUT request to: ${endpoint}`, data);
      const response: AxiosResponse<T> = await this.client.put(endpoint, data, config);
      logger.info(`[API] Response status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error('[API] PUT request failed', error);
      throw error;
    }
  }

  async delete<T>(endpoint: string, config?: any): Promise<T> {
    try {
      logger.info(`[API] DELETE request to: ${endpoint}`);
      const response: AxiosResponse<T> = await this.client.delete(endpoint, config);
      logger.info(`[API] Response status: ${response.status}`);
      return response.data;
    } catch (error) {
      logger.error('[API] DELETE request failed', error);
      throw error;
    }
  }
}