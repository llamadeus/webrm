import type { ZodError } from "zod";


export function getFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(error.flatten().fieldErrors)) {
    if (Array.isArray(value)) {
      fieldErrors[key] = value;
    }
  }

  return fieldErrors;
}
