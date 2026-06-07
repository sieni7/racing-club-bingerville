import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Joueur, joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculatePlayerRating } from '../../utils/rating';
import { JoueurDrawer } from '../../components/joueurs/JoueurDrawer';
import { Card } from '../../components/ui/Card';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { useNavigate } from 'react-router-dom';
export default function JoueursList() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoueur, setSelectedJoueur] = useState<Joueur | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

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

  const filteredJoueurs = joueurs.filter(j => 
    `${j.prenom} ${j.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.poste.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJoueurs.length / itemsPerPage);
  const paginatedJoueurs = filteredJoueurs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
        <SkeletonLoader type="card" count={8} />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Effectif</h1>
          <p className="text-content-muted mt-1">Gérez vos joueurs et analysez leurs performances.</p>
        </div>
        <Link to="/joueurs/nouveau">
          <Button className="flex items-center gap-2"><Plus size={18} /> Ajouter un joueur</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher un joueur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <Button variant="secondary" className="px-4"><Filter size={18} /></Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredJoueurs.length === 0 ? (
          <div className="col-span-full">
            <EmptyState 
              title="Aucun joueur" 
              message="Aucun joueur n'a encore été enregistré ou ne correspond à votre recherche." 
              action={{ label: 'Ajouter un joueur', onClick: () => navigate('/joueurs/nouveau') }} 
            />
          </div>
        ) : (
          paginatedJoueurs.map((joueur, i) => {
          const rating = calculatePlayerRating(joueur);
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={joueur.id}
            >
              <Card 
                className="overflow-hidden cursor-pointer group h-full flex flex-col relative"
                onClick={() => setSelectedJoueur(joueur)}
              >
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant={joueur.statut === 'ACTIF' ? 'success' : 'danger'}>{joueur.statut}</Badge>
                </div>
                
                <div className="relative h-32 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-glass-gradient opacity-50"></div>
                  <span className="absolute left-3 bottom-3 text-4xl font-black text-gray-900 dark:text-white/10">{joueur.numero}</span>
                  {joueur.photo_url ? (
                    <img src={joueur.photo_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-background z-10" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center border-2 border-background z-10">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{joueur.prenom[0]}{joueur.nom[0]}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-light transition-colors">{joueur.prenom} {joueur.nom}</h3>
                  <p className="text-xs text-content-muted font-medium uppercase tracking-wider mb-4">{joueur.poste}</p>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-content-muted">Rating OVR</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${rating > 80 ? 'bg-accent-success' : rating > 70 ? 'bg-primary' : 'bg-accent-warning'}`} 
                          style={{ width: `${rating}%` }}
                        />
                      </div>
                      <span className="font-black text-gray-900 dark:text-white">{rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {!isLoading && filteredJoueurs.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <JoueurDrawer 
        joueur={selectedJoueur} 
        isOpen={!!selectedJoueur} 
        onClose={() => setSelectedJoueur(null)} 
        onDelete={handleDelete} 
      />
    </div>
  );
}

