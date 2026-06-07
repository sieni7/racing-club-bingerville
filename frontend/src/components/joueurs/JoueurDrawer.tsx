import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, Shield, Activity, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Joueur } from '../../features/joueurs/joueursService';
import { Badge } from '../ui/Badge';
import { calculatePlayerRating } from '../../utils/rating';
import { ActivityHeatmap } from './ActivityHeatmap';
import { useAuth } from '../../contexts/AuthContext';
// In a real app, we would fetch stats and matchs for the specific player
// Here we mock the data for the heatmap

interface JoueurDrawerProps {
  joueur: Joueur | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const JoueurDrawer = ({ joueur, isOpen, onClose, onDelete }: JoueurDrawerProps) => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  if (!joueur) return null;

  const mockMatchs = Array.from({ length: 12 }).map((_, i) => ({
    date: new Date(Date.now() - (11 - i) * 86400000 * 3).toISOString(),
    buts: Math.random() > 0.7 ? 1 : 0,
    passes: Math.random() > 0.8 ? 1 : 0,
    minutes: Math.random() > 0.2 ? 90 : 0
  }));

  const rating = calculatePlayerRating(joueur);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background-card border-l border-white/10 shadow-glow z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-8">
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5 text-content-muted" />
                </button>
                <div className="flex gap-2">
                  {isAdmin && (
                    <>
                      <Link to={`/joueurs/${joueur.id}/editer`} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-primary-light">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => { onDelete(joueur.id); onClose(); }} className="p-2 bg-accent-danger/20 rounded-full hover:bg-accent-danger/40 transition-colors text-accent-danger">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  {joueur.photo_url ? (
                    <img src={joueur.photo_url} alt="" className="w-32 h-32 rounded-full object-cover border-4 border-background" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center border-4 border-background">
                      <span className="text-4xl font-bold text-primary">{joueur.prenom[0]}{joueur.nom[0]}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-background border-2 border-white/10 rounded-full w-12 h-12 flex items-center justify-center shadow-glow">
                    <span className="font-black text-lg text-gray-900 dark:text-white">{rating}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mt-4">{joueur.prenom} {joueur.nom}</h2>
                <p className="text-content-muted font-medium mt-1 uppercase tracking-wider">{joueur.poste} • N°{joueur.numero}</p>
                <div className="mt-3">
                  <Badge variant={joueur.statut === 'ACTIF' ? 'success' : 'danger'}>{joueur.statut}</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Activité Récente
                  </h3>
                  <ActivityHeatmap matchs={mockMatchs} />
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-secondary" />
                    Informations
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-content-muted">Nationalité</span>
                      <span className="text-gray-900 dark:text-white font-medium">{joueur.nationalite || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-content-muted">Date de naissance</span>
                      <span className="text-gray-900 dark:text-white font-medium">{joueur.date_naissance ? new Date(joueur.date_naissance).toLocaleDateString() : 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-content-muted">Taille</span>
                      <span className="text-gray-900 dark:text-white font-medium">{joueur.taille ? `${joueur.taille} cm` : 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-content-muted">Poids</span>
                      <span className="text-gray-900 dark:text-white font-medium">{joueur.poids ? `${joueur.poids} kg` : 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

