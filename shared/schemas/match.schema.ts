import { z } from 'zod';

export const compositionJoueurSchema = z.object({
  joueurId: z.string(),
  role: z.enum(['TITULAIRE', 'REMPLACANT']),
  numero: z.number().int().min(1).max(99),
  poste: z.enum(['G', 'D', 'DC', 'M', 'A', 'BU'])
});

export const evenementMatchSchema = z.object({
  type: z.enum(['BUT', 'CARTON_JAUNE', 'CARTON_ROUGE', 'PASSE']),
  joueurId: z.string(),
  minute: z.number().int().min(0).max(120),
  details: z.string().optional()
});

export const matchSchema = z.object({
  date: z.string().datetime(),
  adversaire: z.string().min(2).max(100),
  lieu: z.enum(['DOMICILE', 'EXTERIEUR']),
  scoreRacing: z.number().int().min(0).default(0),
  scoreAdversaire: z.number().int().min(0).default(0),
  composition: z.array(compositionJoueurSchema).default([]),
  evenements: z.array(evenementMatchSchema).default([]),
  statut: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE']).default('PROGRAMME'),
  saison: z.string().regex(/^\d{4}-\d{4}$/)
});

export type ICompositionJoueur = z.infer<typeof compositionJoueurSchema>;
export type IEvenementMatch = z.infer<typeof evenementMatchSchema>;
