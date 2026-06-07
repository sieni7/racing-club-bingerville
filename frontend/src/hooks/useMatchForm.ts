import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { matchsService } from '../features/matchs/matchsService';

const matchSchema = z.object({
  date_heure: z.string().min(1, 'Date requise'),
  adversaire: z.string().min(2, 'Adversaire requis'),
  lieu: z.enum(['DOMICILE', 'EXTERIEUR', 'NEUTRE']),
  competition: z.enum(['CHAMPIONNAT', 'COUPE', 'AMICAL']),
  statut: z.enum(['A_VENIR', 'EN_COURS', 'TERMINE', 'ANNULE']),
  score_equipe: z.coerce.number().optional(),
  score_adversaire: z.coerce.number().optional()
});

export type MatchFormData = z.infer<typeof matchSchema>;

export const useMatchForm = (initialData?: Partial<MatchFormData> & { id?: string }, onSuccess?: () => void) => {
  const form = useForm<MatchFormData>({
    // @ts-ignore
    resolver: zodResolver(matchSchema),
    defaultValues: initialData
  });

  const onSubmit: SubmitHandler<MatchFormData> = async (data) => {
    try {
      const payload = {
        ...data,
        score_equipe: data.score_equipe ?? null,
        score_adversaire: data.score_adversaire ?? null
      };

      if (initialData?.id) {
        // @ts-ignore
        await matchsService.update(initialData.id, payload);
      } else {
        // @ts-ignore
        await matchsService.create(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erreur sauvegarde match:', error);
    }
  };

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
};

