import { useEffect, useState } from 'react';
import { EvenementMatch, feuilleMatchService, TypeEvenement } from '../../features/matchs/feuilleMatchService';
import { Composition } from '../../features/matchs/feuilleMatchService';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const evtSchema = z.object({
  minute: z.preprocess((val) => Number(val), z.number().int().min(0, 'Minute invalide').max(120, 'Minute invalide')),
  type_evenement: z.enum(['BUT', 'PASSE', 'CARTON_JAUNE', 'CARTON_ROUGE', 'ENTREE', 'SORTIE']),
  joueur_id: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

type EvtFormData = z.infer<typeof evtSchema>;

export default function EvenementsTab({ matchId }: { matchId: string }) {
  const [evenements, setEvenements] = useState<EvenementMatch[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EvtFormData>({
    // @ts-ignore
    resolver: zodResolver(evtSchema)
  });

  useEffect(() => {
    loadData();
  }, [matchId]);

  const loadData = async () => {
    try {
      const [evts, comps] = await Promise.all([
        feuilleMatchService.getEvenementsByMatch(matchId),
        feuilleMatchService.getCompositionByMatch(matchId)
      ]);
      setEvenements(evts);
      setCompositions(comps);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<EvtFormData> = async (data) => {
    try {
      await feuilleMatchService.createEvenement({
        match_id: matchId,
        type_evenement: data.type_evenement as TypeEvenement,
        minute: data.minute,
        joueur_id: data.joueur_id || null,
        description: data.description || null
      });
      reset();
      loadData();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet événement ?')) {
      await feuilleMatchService.deleteEvenement(id);
      loadData();
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Liste des événements */}
      <div>
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Chronologie</h2>
        {evenements.length === 0 ? (
          <p className="text-gray-500 italic">Aucun événement enregistré.</p>
        ) : (
          <ul className="space-y-3">
            {evenements.map(evt => (
              <li key={evt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex gap-4 items-center">
                  <span className="font-bold text-gray-700 w-10 text-right">{evt.minute}'</span>
                  <div>
                    <span className={`font-semibold mr-2 
                      ${evt.type_evenement === 'BUT' ? 'text-green-600' : 
                        evt.type_evenement === 'CARTON_JAUNE' ? 'text-yellow-600' : 
                        evt.type_evenement === 'CARTON_ROUGE' ? 'text-red-600' : 'text-blue-600'}`}>
                      {evt.type_evenement.replace('_', ' ')}
                    </span>
                    {evt.joueurs ? `${evt.joueurs.prenom} ${evt.joueurs.nom}` : (evt.description || 'Adversaire')}
                  </div>
                </div>
                <button onClick={() => handleDelete(evt.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulaire ajout */}
      <div>
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">Ajouter un événement</h2>
        {/* @ts-ignore */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 border rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minute</label>
              <input type="number" {...register('minute')} className="w-full px-3 py-2 border rounded-lg" placeholder="ex: 15" />
              {errors.minute && <p className="text-red-500 text-xs mt-1">{errors.minute.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select {...register('type_evenement')} className="w-full px-3 py-2 border rounded-lg">
                <option value="BUT">But</option>
                <option value="PASSE">Passe décisive</option>
                <option value="CARTON_JAUNE">Carton Jaune</option>
                <option value="CARTON_ROUGE">Carton Rouge</option>
                <option value="ENTREE">Entrée en jeu</option>
                <option value="SORTIE">Sortie de jeu</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Joueur impliqué (Optionnel)</label>
            <select {...register('joueur_id')} className="w-full px-3 py-2 border rounded-lg">
              <option value="">Sélectionner un joueur...</option>
              {compositions.map(c => (
                <option key={c.joueur_id} value={c.joueur_id}>
                  {c.joueurs?.prenom} {c.joueurs?.nom} ({c.statut})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Adversaire (Optionnel)</label>
            <input type="text" {...register('description')} className="w-full px-3 py-2 border rounded-lg" placeholder="Ex: Contre son camp, Penalty..." />
          </div>

          <div className="pt-2 text-right">
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

