import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Actualite, actualitesService } from '../../features/actualites/actualitesService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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
          <Card key={actu.id} className="p-6">
            <div className="flex justify-between items-start mb-2">
              <Link to={`/actualites/${actu.slug}`} className="hover:text-primary transition">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{actu.titre}</h2>
              </Link>
              {isStaff && (
                <div className="flex gap-2">
                  <Badge variant={actu.statut === 'PUBLIE' ? 'success' : 'secondary'}>
                    {actu.statut}
                  </Badge>
                  <Link to={`/actualites/${actu.id}/editer`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18} /></Link>
                  <button onClick={() => handleDelete(actu.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><Trash2 size={18} /></button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Publié le {actu.published_at ? format(new Date(actu.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'}
            </p>
            <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
              {actu.contenu}
            </p>
            <div className="mt-4">
              <Link to={`/actualites/${actu.slug}`} className="text-primary font-medium hover:underline">
                Lire la suite →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
