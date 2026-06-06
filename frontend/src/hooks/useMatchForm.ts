import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { matchsService } from '../features/matchs/matchsService';

export const matchSchema = z.object({
  date_heure: z.string().min(1, 'La date est requise'),
  adversaire: z.string().min(1, "L'adversaire est requis"),
  lieu: z.enum(['DOMICILE', 'EXTERIEUR', 'NEUTRE']),
  competition: z.enum(['CHAMPIONNAT', 'COUPE', 'AMICAL']),
  score_equipe: z.coerce.number().optional().nullable(),
  score_adversaire: z.coerce.number().optional().nullable(),
  statut: z.enum(['A_VENIR', 'EN_COURS', 'TERMINE', 'ANNULE']),
});

export type MatchFormData = z.infer<typeof matchSchema>;

export function useMatchForm(id?: string) {
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      lieu: 'DOMICILE',
      competition: 'CHAMPIONNAT',
      statut: 'A_VENIR',
      score_equipe: null,
      score_adversaire: null,
    }
  });

  const statut = watch('statut');

  useEffect(() => {
    if (id) {
      matchsService.getById(id).then(data => {
        const dateStr = new Date(data.date_heure).toISOString().slice(0, 16);
        reset({
          date_heure: dateStr,
          adversaire: data.adversaire,
          lieu: data.lieu as any,
          competition: data.competition as any,
          statut: data.statut as any,
          score_equipe: data.score_equipe,
          score_adversaire: data.score_adversaire,
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: MatchFormData) => {
    try {
      const payload: any = {
        ...data,
        date_heure: new Date(data.date_heure).toISOString()
      };

      if (data.statut !== 'TERMINE') {
        payload.score_equipe = null;
        payload.score_adversaire = null;
      }

      if (id) {
        await matchsService.update(id, payload);
      } else {
        await matchsService.create(payload);
      }
      navigate('/matchs');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, statut };
}
