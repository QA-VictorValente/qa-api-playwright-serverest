import { z } from 'zod';
import { expect } from '@playwright/test';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodIssue[];
}

/**
 * Validates data against a Zod schema returning a structured result
 */
export function validateSchema<T>(schema: z.ZodType<T>, data: unknown): ValidationResult<T> {
  const parseResult = schema.safeParse(data);
  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.issues
    };
  }
  return {
    success: true,
    data: parseResult.data
  };
}

/**
 * Asserts that data matches the Zod schema, attaching detailed error diagnostics to Playwright assertion
 */
export function assertSchema<T>(
  schema: z.ZodType<T>,
  data: unknown,
  message = 'Contract Schema Validation Failed'
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const detailedErrors = JSON.stringify(result.error.issues, null, 2);
    expect(
      result.success,
      `${message}. Issues encountered:\n${detailedErrors}`
    ).toBe(true);
    throw result.error;
  }
  return result.data;
}
