import { z } from 'zod';

export const MatchSchema = z.object({
  id: z.string().optional(),
  date: z.date(),
  opponent: z.string(),
  location: z.enum(['HOME', 'AWAY']),
  score: z.object({
    home: z.number().int().nonnegative().optional(),
    away: z.number().int().nonnegative().optional(),
  }).optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED']),
});
