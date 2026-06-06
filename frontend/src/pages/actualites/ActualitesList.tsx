import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Actualite, actualitesService } from '../../features/actualites/actualitesService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

export default function ActualitesList() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Show all news if ADMIN or STAFF
  const isStaff = user?.role === 'ADMIN' || user?.role === 'STAFF';

  useEffect(() => {
    loadActualites();
  }, []);

  const loadActualites = async () => {
    try {
      const data = await actualitesService.getAll(!isStaff);
      setActualites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette actualité ?')) {
      await actualitesService.delete(id);
      loadActualites();
    }
  };

  if (isLoading) return <div className="text-center py-10">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Actualités du Club</h1>
        {isStaff && (
          <Link to="/actualites/nouvelle">
            <Button className="flex items-center gap-2"><Plus size={16} /> Nouvelle actualité</Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {actualites.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">Aucune actualité pour le moment.</p>
        ) : actualites.map(actu => (
          <div key={actu.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/actualites/${actu.slug}`} className="hover:text-blue-600 transition">
                  <h2 className="text-xl font-bold text-gray-900">{actu.titre}</h2>
                </Link>
                {isStaff && (
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${actu.statut === 'PUBLIE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {actu.statut}
                    </span>
                    <Link to={`/actualites/${actu.id}/editer`} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></Link>
                    <button onClick={() => handleDelete(actu.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Publié le {actu.published_at ? format(new Date(actu.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'}
              </p>
              <p className="text-gray-700 line-clamp-3">
                {actu.contenu}
              </p>
              <div className="mt-4">
                <Link to={`/actualites/${actu.slug}`} className="text-blue-600 font-medium hover:underline">
                  Lire la suite →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
