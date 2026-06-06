import { useEffect, useState } from 'react';
import { Composition, feuilleMatchService, StatutComposition } from '../../features/matchs/feuilleMatchService';
import { joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../common/Button';

export default function CompositionTab({ matchId }: { matchId: string }) {
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [allJoueurs, setAllJoueurs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      feuilleMatchService.getCompositionByMatch(matchId),
      joueursService.getAll()
    ]).then(([comps, joueurs]) => {
      setCompositions(comps);
      setAllJoueurs(joueurs);
      setIsLoading(false);
    }).catch(console.error);
  }, [matchId]);

  const handleStatusChange = (joueurId: string, statut: StatutComposition | '') => {
    setCompositions(prev => {
      const existingIndex = prev.findIndex(c => c.joueur_id === joueurId);
      if (statut === '') {
        if (existingIndex >= 0) {
          const newComps = [...prev];
          newComps[existingIndex].statut = 'ABSENT'; // Mark to remove/absent
          return newComps;
        }
        return prev;
      }

      if (existingIndex >= 0) {
        const newComps = [...prev];
        newComps[existingIndex] = { ...newComps[existingIndex], statut };
        return newComps;
      } else {
        return [...prev, {
          id: '',
          match_id: matchId,
          joueur_id: joueurId,
          statut,
          numero_maillot: null,
          est_capitaine: false,
          minutes_jouees: 0
        }];
      }
    });
  };

  const handleSave = async () => {
    try {
      const payload = compositions.map(({ id, joueurs, ...rest }) => ({
        ...rest,
        // if id is empty, don't pass it so supabase generates one
        ...(id ? { id } : {})
      }));
      await feuilleMatchService.upsertComposition(payload);
      alert('Composition sauvegardée !');
      // Reload
      const comps = await feuilleMatchService.getCompositionByMatch(matchId);
      setCompositions(comps);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Sélection des joueurs</h2>
        <Button onClick={handleSave}>Enregistrer la composition</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Joueur</th>
              <th className="px-4 py-2 text-left">Poste</th>
              <th className="px-4 py-2 text-center">Statut</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allJoueurs.map(joueur => {
              const comp = compositions.find(c => c.joueur_id === joueur.id);
              const statut = comp?.statut || '';
              
              return (
                <tr key={joueur.id}>
                  <td className="px-4 py-2 font-medium">{joueur.prenom} {joueur.nom}</td>
                  <td className="px-4 py-2 text-gray-500">{joueur.poste}</td>
                  <td className="px-4 py-2 text-center">
                    <select 
                      value={statut} 
                      onChange={(e) => handleStatusChange(joueur.id, e.target.value as any)}
                      className="border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Non sélectionné</option>
                      <option value="TITULAIRE">Titulaire</option>
                      <option value="REMPLACANT">Remplaçant</option>
                      <option value="ABSENT">Absent</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
