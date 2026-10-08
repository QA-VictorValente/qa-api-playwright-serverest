import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreateUserPayload } from '../schemas/user.schema';

export class UsersController {
  private endpoint = '/usuarios';

  constructor(private request: APIRequestContext) {}

  /**
   * Retrieves a list of users, optional query parameters
   */
  async list(params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(this.endpoint, {
      params
    });
  }

  /**
   * Retrieves a single user by ID
   */
  async getById(id: string): Promise<APIResponse> {
    return this.request.get(`${this.endpoint}/${id}`);
  }

  /**
   * Creates a new user
   */
  async create(payload: CreateUserPayload | unknown): Promise<APIResponse> {
    return this.request.post(this.endpoint, {
      data: payload
    });
  }

  /**
   * Updates an existing user by ID (or creates if ID doesn't exist)
   */
  async update(id: string, payload: CreateUserPayload | unknown): Promise<APIResponse> {
    return this.request.put(`${this.endpoint}/${id}`, {
      data: payload
    });
  }

  /**
   * Deletes a user by ID
   */
  async delete(id: string): Promise<APIResponse> {
    return this.request.delete(`${this.endpoint}/${id}`);
  }
}
