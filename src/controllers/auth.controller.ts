import { APIRequestContext, APIResponse } from '@playwright/test';
import { LoginPayload } from '../schemas/user.schema';

export class AuthController {
  private endpoint = '/login';

  constructor(private request: APIRequestContext) {}

  /**
   * Performs login request
   */
  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post(this.endpoint, {
      data: payload
    });
  }

  /**
   * Helper that executes login and extracts the bearer authorization token directly
   */
  async getAuthToken(payload: LoginPayload): Promise<string> {
    const response = await this.login(payload);
    const body = await response.json();
    return body.authorization;
  }
}
