import { test, expect } from '@playwright/test';
import { UsersController } from '../../src/controllers/users.controller';
import { UserFactory } from '../../src/fixtures/user.factory';
import { assertSchema } from '../../src/utils/schema-validator';
import {
  UserSchema,
  CreateUserResponseSchema,
  UpdateUserResponseSchema,
  DeleteUserResponseSchema,
  ApiErrorResponseSchema
} from '../../src/schemas/user.schema';

test.describe('E2E - Users Lifecycle & Business Rules (@e2e @users)', () => {
  let usersController: UsersController;

  test.beforeEach(({ request }) => {
    usersController = new UsersController(request);
  });

  test('TC-USER01: Complete User Lifecycle - Create, Read, Update, Delete, Verify Cleanup', async () => {
    // 1. CREATE
    const newUser = UserFactory.create();
    const createRes = await usersController.create(newUser);
    expect(createRes.status()).toBe(201);

    const createBody = await createRes.json();
    assertSchema(CreateUserResponseSchema, createBody);
    const userId = createBody._id;
    expect(userId).toBeTruthy();

    // 2. READ (by ID)
    const getRes = await usersController.getById(userId);
    expect(getRes.status()).toBe(200);
    const getBody = await getRes.json();
    const validatedUser = assertSchema(UserSchema, getBody);
    expect(validatedUser._id).toBe(userId);
    expect(validatedUser.email).toBe(newUser.email);
    expect(validatedUser.nome).toBe(newUser.nome);

    // 3. READ (Filter by query param)
    const filterRes = await usersController.list({ _id: userId });
    expect(filterRes.status()).toBe(200);
    const filterBody = await filterRes.json();
    expect(filterBody.quantidade).toBe(1);
    expect(filterBody.usuarios[0]._id).toBe(userId);

    // 4. UPDATE
    const updatedPayload = UserFactory.create({
      nome: `${newUser.nome} - Editado`,
      email: newUser.email,
      administrador: 'true'
    });
    const updateRes = await usersController.update(userId, updatedPayload);
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    assertSchema(UpdateUserResponseSchema, updateBody);
    expect(updateBody.message).toBe('Registro alterado com sucesso');

    // Confirm update changes took effect
    const getAfterUpdateRes = await usersController.getById(userId);
    const getAfterUpdateBody = await getAfterUpdateRes.json();
    expect(getAfterUpdateBody.nome).toBe(updatedPayload.nome);
    expect(getAfterUpdateBody.administrador).toBe('true');

    // 5. DELETE
    const deleteRes = await usersController.delete(userId);
    expect(deleteRes.status()).toBe(200);
    const deleteBody = await deleteRes.json();
    assertSchema(DeleteUserResponseSchema, deleteBody);
    expect(deleteBody.message).toBe('Registro excluído com sucesso');

    // 6. VERIFY NOT FOUND
    const verifyRes = await usersController.getById(userId);
    expect(verifyRes.status()).toBe(400);
    const notFoundBody = await verifyRes.json();
    expect(notFoundBody.message).toBe('Usuário não encontrado');
  });

  test('TC-USER02: Should reject user creation with already registered email', async () => {
    const user = UserFactory.create();

    // First creation
    const firstRes = await usersController.create(user);
    expect(firstRes.status()).toBe(201);
    const { _id } = await firstRes.json();

    // Attempt second creation with duplicate email
    const duplicateRes = await usersController.create(user);
    expect(duplicateRes.status()).toBe(400);

    const errorBody = await duplicateRes.json();
    assertSchema(ApiErrorResponseSchema, errorBody);
    expect(errorBody.message).toBe('Este email já está sendo usado');

    // Teardown
    await usersController.delete(_id);
  });

  test('TC-USER03: Should upsert new user when PUT is called with non-existent ID', async () => {
    const nonExistentId = 'nonExistentId999';
    const newUser = UserFactory.create();

    const putRes = await usersController.update(nonExistentId, newUser);
    expect(putRes.status()).toBe(201);

    const putBody = await putRes.json();
    expect(putBody.message).toBe('Cadastro realizado com sucesso');
    expect(putBody._id).toBeDefined();

    // Teardown
    await usersController.delete(putBody._id);
  });

  test('TC-USER04: Should handle delete on non-existent user gracefully', async () => {
    const nonExistentId = 'randomInvalidId000';
    const deleteRes = await usersController.delete(nonExistentId);
    expect(deleteRes.status()).toBe(200);

    const deleteBody = await deleteRes.json();
    expect(deleteBody.message).toBe('Nenhum registro excluído');
  });

  test('TC-USER05: Should return validation error when mandatory fields are missing', async () => {
    const payloadWithoutEmail = {
      nome: 'Usuario Sem Email',
      password: 'password123',
      administrador: 'false'
    };

    const res = await usersController.create(payloadWithoutEmail);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('email');
    expect(body.email).toBe('email é obrigatório');
  });
});
