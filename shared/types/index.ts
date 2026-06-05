import { z } from 'zod';
import { UserSchema, JoueurSchema, MatchSchema } from '../schemas';

export type User = z.infer<typeof UserSchema>;
export type Joueur = z.infer<typeof JoueurSchema>;
export type Match = z.infer<typeof MatchSchema>;
