import { test, expect } from '@playwright/test';
import { UsersController } from '../../src/controllers/users.controller';
import { UserFactory } from '../../src/fixtures/user.factory';
import { assertSchema } from '../../src/utils/schema-validator';
import {
  UserListSchema,
  UserSchema,
  CreateUserResponseSchema,
  UpdateUserResponseSchema,
  DeleteUserResponseSchema,
  ApiErrorResponseSchema
} from '../../src/schemas/user.schema';

test.describe('Contract Testing - Users API (@contract)', () => {
  let usersController: UsersController;

  test.beforeEach(({ request }) => {
    usersController = new UsersController(request);
  });

  test('TC-C01: Validate GET /usuarios response schema adheres to UserListSchema', async () => {
    const response = await usersController.list();
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validated = assertSchema(UserListSchema, body, 'GET /usuarios schema mismatch');

    expect(validated.quantidade).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(validated.usuarios)).toBe(true);
  });

  test('TC-C02: Validate POST /usuarios response schema adheres to CreateUserResponseSchema', async () => {
    const newUser = UserFactory.create();
    const response = await usersController.create(newUser);
    expect(response.status()).toBe(201);

    const body = await response.json();
    const validated = assertSchema(
      CreateUserResponseSchema,
      body,
      'POST /usuarios response schema mismatch'
    );

    expect(validated.message).toBe('Cadastro realizado com sucesso');
    expect(validated._id).toBeDefined();

    // Cleanup created user
    await usersController.delete(validated._id);
  });

  test('TC-C03: Validate GET /usuarios/{id} response schema adheres to UserSchema', async () => {
    // Setup: create user first to ensure existing ID
    const newUser = UserFactory.create();
    const createRes = await usersController.create(newUser);
    const { _id } = await createRes.json();

    const response = await usersController.getById(_id);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validated = assertSchema(
      UserSchema,
      body,
      'GET /usuarios/{id} response schema mismatch'
    );

    expect(validated._id).toBe(_id);
    expect(validated.email).toBe(newUser.email);

    // Teardown
    await usersController.delete(_id);
  });

  test('TC-C04: Validate PUT /usuarios/{id} response schema adheres to UpdateUserResponseSchema', async () => {
    const user = UserFactory.create();
    const createRes = await usersController.create(user);
    const { _id } = await createRes.json();

    const updatedData = UserFactory.create({ nome: 'Nome Atualizado Contrato' });
    const response = await usersController.update(_id, updatedData);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validated = assertSchema(
      UpdateUserResponseSchema,
      body,
      'PUT /usuarios/{id} response schema mismatch'
    );

    expect(validated.message).toBe('Registro alterado com sucesso');

    // Teardown
    await usersController.delete(_id);
  });

  test('TC-C05: Validate DELETE /usuarios/{id} response schema adheres to DeleteUserResponseSchema', async () => {
    const user = UserFactory.create();
    const createRes = await usersController.create(user);
    const { _id } = await createRes.json();

    const response = await usersController.delete(_id);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const validated = assertSchema(
      DeleteUserResponseSchema,
      body,
      'DELETE /usuarios/{id} response schema mismatch'
    );

    expect(validated.message).toBe('Registro excluído com sucesso');
  });

  test('TC-C06: Validate POST /usuarios duplicate email returns error schema', async () => {
    const user = UserFactory.create();
    const firstRes = await usersController.create(user);
    const { _id } = await firstRes.json();

    // Attempt to register again with same email
    const duplicateRes = await usersController.create(user);
    expect(duplicateRes.status()).toBe(400);

    const body = await duplicateRes.json();
    const validated = assertSchema(
      ApiErrorResponseSchema,
      body,
      'Error response schema mismatch'
    );

    expect(validated.message).toBe('Este email já está sendo usado');

    // Teardown
    await usersController.delete(_id);
  });
});
