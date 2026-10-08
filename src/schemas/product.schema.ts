import { z } from 'zod';

/**
 * Schema for a single product record
 */
export const ProductSchema = z.object({
  _id: z.string().min(1),
  nome: z.string().min(1),
  preco: z.number().nonnegative(),
  descricao: z.string(),
  quantidade: z.number().int().nonnegative()
});

/**
 * Schema for GET /produtos response (list)
 */
export const ProductListSchema = z.object({
  quantidade: z.number().int().nonnegative(),
  produtos: z.array(ProductSchema)
});

/**
 * Schema for POST /produtos request payload
 */
export const CreateProductPayloadSchema = z.object({
  nome: z.string().min(1),
  preco: z.number().nonnegative(),
  descricao: z.string().min(1),
  quantidade: z.number().int().nonnegative()
});

/**
 * Schema for POST /produtos response (success)
 */
export const CreateProductResponseSchema = z.object({
  message: z.string(),
  _id: z.string().min(1)
});

/**
 * Schema for PUT /produtos/{id} response
 */
export const UpdateProductResponseSchema = z.object({
  message: z.string(),
  _id: z.string().optional()
});

/**
 * Schema for DELETE /produtos/{id} response
 */
export const DeleteProductResponseSchema = z.object({
  message: z.string()
});

// Inferred TypeScript Types
export type Product = z.infer<typeof ProductSchema>;
export type ProductListResponse = z.infer<typeof ProductListSchema>;
export type CreateProductPayload = z.infer<typeof CreateProductPayloadSchema>;
export type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>;
export type UpdateProductResponse = z.infer<typeof UpdateProductResponseSchema>;
export type DeleteProductResponse = z.infer<typeof DeleteProductResponseSchema>;
