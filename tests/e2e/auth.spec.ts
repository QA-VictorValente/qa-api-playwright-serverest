import { test, expect } from '@playwright/test';
import { AuthController } from '../../src/controllers/auth.controller';
import { UsersController } from '../../src/controllers/users.controller';
import { ProductsController } from '../../src/controllers/products.controller';
import { UserFactory } from '../../src/fixtures/user.factory';
import { assertSchema } from '../../src/utils/schema-validator';
import { LoginResponseSchema, ApiErrorResponseSchema } from '../../src/schemas/user.schema';

test.describe('E2E - Authentication Workflows (@e2e @auth)', () => {
  let authController: AuthController;
  let usersController: UsersController;
  let productsController: ProductsController;

  test.beforeEach(({ request }) => {
    authController = new AuthController(request);
    usersController = new UsersController(request);
    productsController = new ProductsController(request);
  });

  test('TC-AUTH01: Should login successfully with valid credentials and return bearer token', async () => {
    const userPayload = UserFactory.createAdmin();
    const createRes = await usersController.create(userPayload);
    expect(createRes.status()).toBe(201);
    const { _id } = await createRes.json();

    const loginRes = await authController.login({
      email: userPayload.email,
      password: userPayload.password
    });

    expect(loginRes.status()).toBe(200);
    const body = await loginRes.json();

    const validated = assertSchema(LoginResponseSchema, body);
    expect(validated.message).toBe('Login realizado com sucesso');
    expect(validated.authorization).toMatch(/^Bearer\s+/);

    // Teardown
    await usersController.delete(_id);
  });

  test('TC-AUTH02: Should fail login with invalid password', async () => {
    const userPayload = UserFactory.create();
    const createRes = await usersController.create(userPayload);
    expect(createRes.status()).toBe(201);
    const { _id } = await createRes.json();

    const loginRes = await authController.login({
      email: userPayload.email,
      password: 'wrong-password-1234'
    });

    expect(loginRes.status()).toBe(401);
    const body = await loginRes.json();
    const validated = assertSchema(ApiErrorResponseSchema, body);
    expect(validated.message).toBe('Email e/ou senha inválidos');

    // Teardown
    await usersController.delete(_id);
  });

  test('TC-AUTH03: Should fail login with non-existent user email', async () => {
    const loginRes = await authController.login({
      email: 'non_existent_user_9999@testdomain.com',
      password: 'somepassword'
    });

    expect(loginRes.status()).toBe(401);
    const body = await loginRes.json();
    const validated = assertSchema(ApiErrorResponseSchema, body);
    expect(validated.message).toBe('Email e/ou senha inválidos');
  });

  test('TC-AUTH04: Should validate access to protected resource with and without token', async () => {
    // 1. Create admin user
    const adminUser = UserFactory.createAdmin();
    const createRes = await usersController.create(adminUser);
    expect(createRes.status()).toBe(201);
    const { _id } = await createRes.json();

    // 2. Perform login and obtain token
    const token = await authController.getAuthToken({
      email: adminUser.email,
      password: adminUser.password
    });
    expect(token).toBeDefined();

    const productPayload = {
      nome: `Produto QA ${Date.now()}`,
      preco: 150,
      descricao: 'Produto criado em teste automatizado',
      quantidade: 10
    };

    // 3. Attempt creation WITHOUT token (should be 401)
    const unauthorizedRes = await productsController.create(productPayload);
    expect(unauthorizedRes.status()).toBe(401);

    // 4. Create product WITH token (should be 201)
    const authorizedRes = await productsController.create(productPayload, token);
    expect(authorizedRes.status()).toBe(201);
    const productBody = await authorizedRes.json();
    expect(productBody._id).toBeDefined();

    // Clean up product and user
    await productsController.delete(productBody._id, token);
    await usersController.delete(_id);
  });
});
