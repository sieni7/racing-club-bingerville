import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'COACH', 'PLAYER']),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
