import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Actualite, actualitesService } from '../../features/actualites/actualitesService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function ActualitesList() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
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

  if (isLoading) return <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Club Newsfeed</h1>
          <p className="text-content-muted mt-1">Toutes les dernières informations du Racing CB.</p>
        </div>
        {isStaff && (
          <Link to="/actualites/nouvelle">
            <Button className="flex items-center gap-2 shadow-glow"><Plus size={18} /> Publier</Button>
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {actualites.length === 0 ? (
          <div className="text-content-muted italic text-center py-10">Aucune actualité pour le moment.</div>
        ) : actualites.map((actu, i) => (
          <motion.div
            key={actu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-0 overflow-hidden">
              {/* Post Header */}
              <div className="p-5 flex justify-between items-start border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-gray-900 dark:text-white text-lg">
                    RC
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white leading-tight">Racing Club Bingerville</h2>
                    <div className="flex items-center gap-2 text-xs text-content-muted mt-0.5">
                      <span>{actu.published_at ? format(new Date(actu.published_at), 'dd MMM à HH:mm', { locale: fr }) : 'Non publié'}</span>
                      {actu.statut === 'BROUILLON' && <Badge variant="warning" className="text-[10px] py-0">Brouillon</Badge>}
                    </div>
                  </div>
                </div>
                {isStaff && (
                  <div className="flex items-center gap-1">
                    <Link to={`/actualites/${actu.id}/editer`} className="p-2 text-content-muted hover:text-gray-900 dark:text-white transition"><Edit size={16} /></Link>
                    <button onClick={() => handleDelete(actu.id)} className="p-2 text-content-muted hover:text-accent-danger transition"><Trash2 size={16} /></button>
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="p-5">
                <Link to={`/actualites/${actu.slug}`} className="block group">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors mb-3">{actu.titre}</h3>
                  <p className="text-content-muted leading-relaxed line-clamp-4">
                    {actu.contenu}
                  </p>
                </Link>
              </div>

              {/* Fake Social Actions */}
              <div className="px-5 py-3 border-t border-white/5 bg-white/5 flex items-center gap-6">
                <button className="flex items-center gap-2 text-content-muted hover:text-accent-danger transition-colors group">
                  <Heart size={18} className="group-hover:fill-accent-danger" />
                  <span className="text-sm font-medium">J'aime</span>
                </button>
                <button className="flex items-center gap-2 text-content-muted hover:text-primary transition-colors group">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">Commenter</span>
                </button>
                <button className="flex items-center gap-2 text-content-muted hover:text-gray-900 dark:text-white transition-colors group ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
