import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Joueur, joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/ui/Button';
import { Edit, ArrowLeft, Activity, Calendar, Globe, Ruler, Weight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { calculatePlayerRating } from '../../utils/rating';
import { Badge } from '../../components/ui/Badge';

export default function JoueurDetail() {
  const { id } = useParams<{ id: string }>();
  const [joueur, setJoueur] = useState<Joueur | null>(null);

  const { profile } = useAuth();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (id) {
      joueursService.getById(id).then(setJoueur);
    }
  }, [id]);

  if (!joueur) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  const rating = calculatePlayerRating(joueur);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] pb-16">
      {/* Hero Header */}
      <div className="relative pt-20 pb-24 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link to="/joueurs" className="inline-flex items-center text-primary hover:text-primary-light mb-6 transition font-medium">
            <ArrowLeft size={16} className="mr-2" /> Retour à l'effectif
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-start">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Profil Joueur</span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">{joueur.prenom} {joueur.nom}</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-xl font-medium">{joueur.poste}</p>
            </div>
            {isAdmin && (
              <Link to={`/joueurs/${joueur.id}/editer`}>
                <Button variant="secondary" className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm"><Edit size={16} /> Éditer</Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-800"
        >
          {/* Card Style (Left) */}
          <div className="md:w-1/3 bg-gradient-to-br from-primary/10 to-transparent flex flex-col items-center p-8 border-r border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge variant={joueur.statut === 'ACTIF' ? 'success' : 'danger'}>{joueur.statut}</Badge>
            </div>
            
            <div className="relative mt-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              {joueur.photo_url ? (
                <img src={joueur.photo_url} alt="" className="w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-white dark:border-gray-800 relative z-10" />
              ) : (
                <div className="w-48 h-48 rounded-full bg-primary flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-800 relative z-10">
                  <span className="text-5xl font-black text-white">{joueur.prenom[0]}{joueur.nom[0]}</span>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex flex-col items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">Numéro</span>
              <div className="text-6xl font-black text-gray-900 dark:text-white drop-shadow-md">{joueur.numero}</div>
            </div>
            
            <div className="mt-8 w-full p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Note Globale (OVR)</span>
                <span className="text-xl font-black text-primary">{rating}</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${rating > 80 ? 'bg-green-500' : rating > 70 ? 'bg-primary' : 'bg-orange-500'}`} 
                  style={{ width: `${rating}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Info Details (Right) */}
          <div className="md:w-2/3 p-8 md:p-12">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <Activity className="text-primary" /> Informations Athlétiques & Personnelles
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/30 rounded-lg shadow-sm">
                  <Calendar className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Date de naissance</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{joueur.date_naissance ? format(new Date(joueur.date_naissance), 'dd MMM yyyy', { locale: fr }) : 'Non renseignée'}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/30 rounded-lg shadow-sm">
                  <Globe className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nationalité</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{joueur.nationalite || 'Non renseignée'}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/30 rounded-lg shadow-sm">
                  <Ruler className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Taille</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{joueur.taille ? `${joueur.taille} cm` : 'Non renseignée'}</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-black/30 rounded-lg shadow-sm">
                  <Weight className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Poids</p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{joueur.poids ? `${joueur.poids} kg` : 'Non renseignée'}</p>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
}

