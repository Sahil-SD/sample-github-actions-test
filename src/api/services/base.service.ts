import { RequestBuilder } from '../../core/api/request-builder';
import { createLogger } from '../../core/logger/logger';

export abstract class BaseService {
  protected requestBuilder: RequestBuilder;
  protected logger = createLogger(this.constructor.name);

  constructor(requestBuilder: RequestBuilder) {
    this.requestBuilder = requestBuilder;
  }
}