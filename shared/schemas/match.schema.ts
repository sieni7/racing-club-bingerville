import { z } from 'zod';

export const matchSchema = z.object({
  date: z.string().datetime(),
  adversaire: z.string().min(2).max(100),
  lieu: z.enum(['DOMICILE', 'EXTERIEUR']),
  scoreRacing: z.number().int().min(0).default(0),
  scoreAdversaire: z.number().int().min(0).default(0),
  composition: z.array(z.object({
    joueurId: z.string(),
    role: z.enum(['TITULAIRE', 'REMPLACANT']),
    numero: z.number().int().min(1).max(99),
    poste: z.enum(['G', 'D', 'DC', 'M', 'A', 'BU']) // Removed duplicate 'G'
  })).default([]),
  evenements: z.array(z.object({
    type: z.enum(['BUT', 'CARTON_JAUNE', 'CARTON_ROUGE', 'PASSE']),
    joueurId: z.string(),
    minute: z.number().int().min(0).max(120),
    details: z.string().optional()
  })).default([]),
  statut: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE']).default('PROGRAMME'),
  saison: z.string().regex(/^\d{4}-\d{4}$/)
});
