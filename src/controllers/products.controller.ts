import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreateProductPayload } from '../schemas/product.schema';

export class ProductsController {
  private endpoint = '/produtos';

  constructor(private request: APIRequestContext) {}

  /**
   * Retrieves products list, optional query params
   */
  async list(params?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get(this.endpoint, {
      params
    });
  }

  /**
   * Retrieves a product by ID
   */
  async getById(id: string): Promise<APIResponse> {
    return this.request.get(`${this.endpoint}/${id}`);
  }

  /**
   * Creates a new product (Requires authorization token)
   */
  async create(payload: CreateProductPayload | unknown, token?: string): Promise<APIResponse> {
    return this.request.post(this.endpoint, {
      data: payload,
      headers: token ? { Authorization: token } : {}
    });
  }

  /**
   * Updates a product by ID (Requires authorization token)
   */
  async update(id: string, payload: CreateProductPayload | unknown, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.endpoint}/${id}`, {
      data: payload,
      headers: token ? { Authorization: token } : {}
    });
  }

  /**
   * Deletes a product by ID (Requires authorization token)
   */
  async delete(id: string, token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.endpoint}/${id}`, {
      headers: token ? { Authorization: token } : {}
    });
  }
}
