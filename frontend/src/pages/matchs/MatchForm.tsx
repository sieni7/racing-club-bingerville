import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/ui/Button';
import { useMatchForm } from '../../hooks/useMatchForm';
import { matchsService } from '../../features/matchs/matchsService';

export default function MatchForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(undefined);

  useEffect(() => {
    if (id) {
      matchsService.getById(id).then(data => {
        setInitialData({
          ...data,
          date_heure: new Date(data.date_heure).toISOString().slice(0, 16)
        });
      });
    } else {
      setInitialData({});
    }
  }, [id]);

  if (initialData === undefined) return <div>Chargement...</div>;

  return <MatchFormInner id={id} initialData={initialData} navigate={navigate} />;
}

function MatchFormInner({ id, initialData, navigate }: { id?: string, initialData: Partial<import('../../hooks/useMatchForm').MatchFormData> & { id?: string }, navigate: any }) {
  const { form, onSubmit, isSubmitting } = useMatchForm({ ...initialData, id }, () => {
    navigate('/matchs');
  });

  const { register, watch, formState: { errors } } = form;
  const statut = watch('statut');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Modifier le match' : 'Planifier un match'}</h1>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        
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
