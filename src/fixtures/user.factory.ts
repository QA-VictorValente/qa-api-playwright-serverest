import { faker } from '@faker-js/faker';
import { CreateUserPayload } from '../schemas/user.schema';

export class UserFactory {
  /**
   * Generates a unique valid user payload with randomized dynamic data
   */
  static create(overrides: Partial<CreateUserPayload> = {}): CreateUserPayload {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return {
      nome: faker.person.fullName(),
      email: `qa_playwright_${timestamp}_${randomSuffix}@testmail.com`,
      password: faker.internet.password({ length: 10 }),
      administrador: 'false',
      ...overrides
    };
  }

  /**
   * Generates an admin user payload
   */
  static createAdmin(overrides: Partial<CreateUserPayload> = {}): CreateUserPayload {
    return this.create({
      administrador: 'true',
      ...overrides
    });
  }

  /**
   * Generates a payload with invalid email for negative testing
   */
  static createWithInvalidEmail(overrides: Partial<CreateUserPayload> = {}): CreateUserPayload {
    return this.create({
      email: 'invalid-email-format',
      ...overrides
    });
  }

  /**
   * Generates a payload with missing required fields
   */
  static createWithMissingField(fieldToOmit: keyof CreateUserPayload): Partial<CreateUserPayload> {
    const user = this.create();
    delete user[fieldToOmit];
    return user;
  }
}
