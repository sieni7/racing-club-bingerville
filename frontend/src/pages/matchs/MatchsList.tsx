import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, matchsService } from '../../features/matchs/matchsService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MatchsList() {
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatchs();
  }, []);

  const loadMatchs = async () => {
    try {
      const data = await matchsService.getAll();
      setMatchs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
      await matchsService.delete(id);
      loadMatchs();
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Matchs</h1>
        <div className="flex gap-2">
          <Link to="/matchs/calendrier">
            <Button variant="secondary" className="flex items-center gap-2"><Calendar size={16} /> Vue Calendrier</Button>
          </Link>
          <Link to="/matchs/nouveau">
            <Button className="flex items-center gap-2"><Plus size={16} /> Nouveau match</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rencontre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétition</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {matchs.map((match) => (
              <tr key={match.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(match.date_heure), 'dd MMM yyyy HH:mm', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {match.lieu === 'DOMICILE' ? (
                    <span>Racing CB vs {match.adversaire}</span>
                  ) : match.lieu === 'EXTERIEUR' ? (
                    <span>{match.adversaire} vs Racing CB</span>
                  ) : (
                    <span>Racing CB vs {match.adversaire} (N)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{match.competition}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                  {match.statut === 'TERMINE' ? `${match.score_equipe ?? '-'} : ${match.score_adversaire ?? '-'}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${match.statut === 'TERMINE' ? 'bg-gray-100 text-gray-800' : match.statut === 'A_VENIR' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {match.statut.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link to={`/matchs/${match.id}/editer`} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></Link>
                    <button onClick={() => handleDelete(match.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {matchs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Aucun match trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
