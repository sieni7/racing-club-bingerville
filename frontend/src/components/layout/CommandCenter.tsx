import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, CalendarPlus, FileText, BarChart2, Users, Trophy } from 'lucide-react';

export const CommandCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useHotkeys('ctrl+k, meta+k', (e) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  });

  useHotkeys('esc', () => setIsOpen(false), { enableOnFormTags: true });

  const handleAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-background-card border border-white/10 shadow-glow rounded-xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="text-content-muted w-5 h-5" />
              <input 
                autoFocus
                placeholder="Rechercher ou exécuter une commande..."
                className="w-full bg-transparent border-none text-content focus:outline-none placeholder:text-content-muted text-lg"
              />
              <div className="text-xs text-content-muted border border-white/20 rounded px-2 py-1">ESC</div>
            </div>
            
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              <div className="px-3 py-2 text-xs font-semibold text-content-muted uppercase tracking-wider">Navigation</div>
              <button onClick={() => handleAction('/dashboard')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <BarChart2 className="text-primary w-5 h-5" />
                <span className="text-content">Dashboard</span>
              </button>
              <button onClick={() => handleAction('/joueurs')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <Users className="text-primary w-5 h-5" />
                <span className="text-content">Effectif (Joueurs)</span>
              </button>
              <button onClick={() => handleAction('/matchs')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <Trophy className="text-primary w-5 h-5" />
                <span className="text-content">Matchs</span>
              </button>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-content-muted uppercase tracking-wider">Actions Rapides</div>
              <button onClick={() => handleAction('/joueurs/nouveau')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <UserPlus className="text-accent-success w-5 h-5" />
                <span className="text-content">Ajouter un joueur</span>
              </button>
              <button onClick={() => handleAction('/matchs/nouveau')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <CalendarPlus className="text-accent-success w-5 h-5" />
                <span className="text-content">Planifier un match</span>
              </button>
              <button onClick={() => handleAction('/actualites/nouvelle')} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 rounded-lg text-left transition-colors">
                <FileText className="text-accent-success w-5 h-5" />
                <span className="text-content">Rédiger une actualité</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

