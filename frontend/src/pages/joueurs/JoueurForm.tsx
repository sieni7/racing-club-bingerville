import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Joueur, joueursService } from '../../features/joueurs/joueursService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

const joueurSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  date_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  poste: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']),
  numero: z.coerce.number().min(1).max(99),
  taille: z.coerce.number().optional(),
  poids: z.coerce.number().optional(),
  statut: z.enum(['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF']),
});

type JoueurFormData = z.infer<typeof joueurSchema>;

export default function JoueurForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JoueurFormData>({
    resolver: zodResolver(joueurSchema) as any,
    defaultValues: {
      poste: 'MILIEU',
      statut: 'ACTIF'
    }
  });

  useEffect(() => {
    if (id) {
      joueursService.getById(id).then(data => {
        reset({
          ...data,
          date_naissance: data.date_naissance ? data.date_naissance.substring(0, 10) : ''
        } as any);
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: JoueurFormData) => {
    try {
      let savedJoueur: Joueur;
      if (id) {
        savedJoueur = await joueursService.update(id, data as any);
      } else {
        savedJoueur = await joueursService.create(data as any);
      }
      
      if (photo) {
        const photo_url = await joueursService.uploadPhoto(photo, savedJoueur.id);
        await joueursService.update(savedJoueur.id, { photo_url });
      }
      navigate('/joueurs');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Modifier le joueur' : 'Ajouter un joueur'}</h1>
      <form onSubmit={handleSubmit(onSubmit as any)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
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
