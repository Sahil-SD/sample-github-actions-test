import { BaseService } from './base.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { UserRegistration, UserLogin, AuthResponse, UserProfile } from '../models/user.model';
import { RequestBuilder } from '../../core/api/request-builder';

export class AuthService extends BaseService {
  constructor(requestBuilder: RequestBuilder) {
    super(requestBuilder);
  }

  async register(userData: UserRegistration): Promise<AuthResponse> {
    this.logger.info('Registering new user', { email: userData.email });
    const response = await this.requestBuilder.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      { data: userData }
    );
    return response.data;
  }

  async login(credentials: UserLogin): Promise<{ response: AuthResponse; token: string }> {
    this.logger.info('Logging in user', { email: credentials.email });
    const response = await this.requestBuilder.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      { data: credentials }
    );

    const token = response.headers['authorization']?.replace('Bearer ', '') || response.data.token;

    if (token) {
      this.requestBuilder.setToken(token);
    }

    return { response: response.data, token };
  }

  async logout(): Promise<void> {
    this.logger.info('Logging out user');
    await this.requestBuilder.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    this.requestBuilder.clearToken();
  }

  async getProfile(): Promise<UserProfile> {
    this.logger.info('Fetching user profile');
    return this.requestBuilder.get<UserProfile>(API_ENDPOINTS.AUTH.PROFILE);
  }

  async deleteAccount(): Promise<void> {
    this.logger.info('Deleting user account');
    await this.requestBuilder.delete(API_ENDPOINTS.AUTH.DELETE_USER);
  }
}