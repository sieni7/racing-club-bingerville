import { z } from 'zod';

export const StatsJoueurSchema = z.object({
  joueurId: z.string().min(1),
  saison: z.string().min(1),
  matchsJoues: z.number().int().min(0).default(0),
  buts: z.number().int().min(0).default(0),
  passes: z.number().int().min(0).default(0),
  cartonsJaunes: z.number().int().min(0).default(0),
  cartonsRouges: z.number().int().min(0).default(0),
});

export type IStatsJoueurInput = z.infer<typeof StatsJoueurSchema>;
