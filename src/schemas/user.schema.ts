import { z } from 'zod';

/**
 * Schema for a single user record
 */
export const UserSchema = z.object({
  _id: z.string().min(1),
  nome: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  administrador: z.enum(['true', 'false'])
});

/**
 * Schema for GET /usuarios response (list)
 */
export const UserListSchema = z.object({
  quantidade: z.number().int().nonnegative(),
  usuarios: z.array(UserSchema)
});

/**
 * Schema for POST /usuarios request payload
 */
export const CreateUserPayloadSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
  administrador: z.enum(['true', 'false'])
});

/**
 * Schema for POST /usuarios response (success)
 */
export const CreateUserResponseSchema = z.object({
  message: z.string(),
  _id: z.string().min(1)
});

/**
 * Schema for PUT /usuarios/{id} response
 */
export const UpdateUserResponseSchema = z.object({
  message: z.string(),
  _id: z.string().optional()
});

/**
 * Schema for DELETE /usuarios/{id} response
 */
export const DeleteUserResponseSchema = z.object({
  message: z.string()
});

/**
 * Schema for POST /login request payload
 */
export const LoginPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

/**
 * Schema for POST /login success response
 */
export const LoginResponseSchema = z.object({
  message: z.string(),
  authorization: z.string().min(1)
});

/**
 * Generic API Error response schema
 */
export const ApiErrorResponseSchema = z.object({
  message: z.string()
});

// Inferred TypeScript Types
export type User = z.infer<typeof UserSchema>;
export type UserListResponse = z.infer<typeof UserListSchema>;
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;
export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
