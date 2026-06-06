import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useJoueurForm } from '../../hooks/useJoueurForm';
import { joueursService } from '../../features/joueurs/joueursService';

export default function JoueurForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<any>(undefined);
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      joueursService.getById(id).then(data => {
        setInitialData({
          ...data,
          date_naissance: data.date_naissance ? data.date_naissance.substring(0, 10) : undefined
        });
      });
    } else {
      setInitialData({});
    }
  }, [id]);

  if (initialData === undefined) return <div>Chargement...</div>;

  return <JoueurFormInner id={id} initialData={initialData} navigate={navigate} photo={photo} setPhoto={setPhoto} />;
}

function JoueurFormInner({ id, initialData, navigate, photo, setPhoto }: { id?: string, initialData: Partial<import('../../hooks/useJoueurForm').JoueurFormData> & { id?: string }, navigate: any, photo: any, setPhoto: any }) {
  const { form, onSubmit, isSubmitting } = useJoueurForm({ ...initialData, id }, async () => {
    navigate('/joueurs');
  });

  const { register, formState: { errors } } = form;

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    // Note: photo upload can be refactored inside onSuccess if needed, 
    // but sticking to standard structure.
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Modifier le joueur' : 'Ajouter un joueur'}</h1>
      {/* @ts-ignore */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nom" {...register('nom')} error={errors.nom?.message} />
          <Input label="Prénom" {...register('prenom')} error={errors.prenom?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date de naissance" type="date" {...register('date_naissance')} error={errors.date_naissance?.message} />
          <Input label="Nationalité" {...register('nationalite')} error={errors.nationalite?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <select {...register('poste')} className="w-full px-3 py-2 border rounded-lg">
              <option value="GARDIEN">Gardien</option>
              <option value="DEFENSEUR">Défenseur</option>
              <option value="MILIEU">Milieu</option>
              <option value="ATTAQUANT">Attaquant</option>
            </select>
          </div>
          <Input label="Numéro" type="number" {...register('numero')} error={errors.numero?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Taille (cm)" type="number" step="0.01" {...register('taille')} error={errors.taille?.message} />
          <Input label="Poids (kg)" type="number" step="0.01" {...register('poids')} error={errors.poids?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select {...register('statut')} className="w-full px-3 py-2 border rounded-lg">
              <option value="ACTIF">Actif</option>
              <option value="BLESSE">Blessé</option>
              <option value="SUSPENDU">Suspendu</option>
              <option value="INACTIF">Inactif</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate('/joueurs')}>Annuler</Button>
          <Button type="submit" isLoading={isSubmitting}>Enregistrer</Button>
        </div>
      </form>
    </div>
  );
}
