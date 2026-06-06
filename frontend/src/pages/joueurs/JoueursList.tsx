import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Joueur, joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function JoueursList() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJoueurs();
  }, []);

  const loadJoueurs = async () => {
    try {
      const data = await joueursService.getAll();
      setJoueurs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
      await joueursService.delete(id);
      loadJoueurs();
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Effectif</h1>
        <Link to="/joueurs/nouveau">
          <Button className="flex items-center gap-2"><Plus size={16} /> Ajouter un joueur</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joueur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Poste</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {joueurs.map((joueur) => (
              <tr key={joueur.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{joueur.numero}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {joueur.photo_url ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={joueur.photo_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">{joueur.prenom[0]}{joueur.nom[0]}</span>
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{joueur.prenom} {joueur.nom}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{joueur.poste}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {joueur.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link to={`/joueurs/${joueur.id}`} className="text-blue-600 hover:text-blue-900"><Eye size={18} /></Link>
                    <Link to={`/joueurs/${joueur.id}/editer`} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></Link>
                    <button onClick={() => handleDelete(joueur.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
