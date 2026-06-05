import { z } from 'zod';

export const ActualiteSchema = z.object({
  titre: z.string().min(3).max(200),
  contenu: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
});

export type IActualiteInput = z.infer<typeof ActualiteSchema>;
