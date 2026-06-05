import { z } from 'zod';

export const JoueurSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  numeroLicence: z.string().min(1, "Le numéro de licence est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
  poste: z.string().min(1, "Le poste est requis"),
  dateNaissance: z.coerce.date(),
  taille: z.number().positive().optional().nullable(),
  poids: z.number().positive().optional().nullable(),
  statut: z.enum(['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF']).default('ACTIF'),
});

export type JoueurInput = z.infer<typeof JoueurSchema>;
