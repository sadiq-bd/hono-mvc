import { z } from 'zod';

export const getExampleSchema = z.object({
  id: z.string().min(1)
});

export const createExampleSchema = z.object({
  name: z.string().min(1)
});

export const updateExampleSchema = createExampleSchema.partial();
