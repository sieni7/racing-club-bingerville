import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { matchsService } from '../../features/matchs/matchsService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

const matchSchema = z.object({
  date_heure: z.string().min(1, 'La date est requise'),
  adversaire: z.string().min(1, "L'adversaire est requis"),
  lieu: z.enum(['DOMICILE', 'EXTERIEUR', 'NEUTRE']),
  competition: z.enum(['CHAMPIONNAT', 'COUPE', 'AMICAL']),
  score_equipe: z.coerce.number().nullable().optional(),
  score_adversaire: z.coerce.number().nullable().optional(),
  statut: z.enum(['A_VENIR', 'EN_COURS', 'TERMINE', 'ANNULE']),
});

type MatchFormData = z.infer<typeof matchSchema>;

export default function MatchForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<MatchFormData>({
    resolver: zodResolver(matchSchema) as any,
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
        // Format datetime-local string
        const dateStr = new Date(data.date_heure).toISOString().slice(0, 16);
        reset({
          ...data,
          date_heure: dateStr
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: MatchFormData) => {
    try {
      // Ensure scores are null if not TERMINE or empty
      if (data.statut !== 'TERMINE') {
        data.score_equipe = null;
        data.score_adversaire = null;
      }
      
      const matchData = {
        ...data,
        date_heure: new Date(data.date_heure).toISOString()
      };

      if (id) {
        await matchsService.update(id, matchData);
      } else {
        await matchsService.create(matchData as any);
      }
      navigate('/matchs');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Modifier le match' : 'Planifier un match'}</h1>
      <form onSubmit={handleSubmit(onSubmit as any)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date et Heure" type="datetime-local" {...register('date_heure')} error={errors.date_heure?.message} />
          <Input label="Adversaire" {...register('adversaire')} error={errors.adversaire?.message} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
            <select {...register('lieu')} className="w-full px-3 py-2 border rounded-lg">
              <option value="DOMICILE">Domicile</option>
              <option value="EXTERIEUR">Extérieur</option>
              <option value="NEUTRE">Neutre</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Compétition</label>
            <select {...register('competition')} className="w-full px-3 py-2 border rounded-lg">
              <option value="CHAMPIONNAT">Championnat</option>
              <option value="COUPE">Coupe</option>
              <option value="AMICAL">Amical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select {...register('statut')} className="w-full px-3 py-2 border rounded-lg">
              <option value="A_VENIR">À venir</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="ANNULE">Annulé</option>
            </select>
          </div>
        </div>

        {statut === 'TERMINE' && (
          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
            <h3 className="col-span-2 font-semibold text-gray-700">Résultat final</h3>
            <Input label="Score Racing CB" type="number" min="0" {...register('score_equipe')} error={errors.score_equipe?.message} />
            <Input label="Score Adversaire" type="number" min="0" {...register('score_adversaire')} error={errors.score_adversaire?.message} />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/matchs')}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}
