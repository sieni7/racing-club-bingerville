import { z } from 'zod';

export const JoueurSchema = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  position: z.string(),
  number: z.number().int().positive().optional(),
  birthDate: z.date().optional(),
  teamId: z.string().optional(),
});
