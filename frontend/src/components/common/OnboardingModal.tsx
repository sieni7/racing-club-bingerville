import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';

const steps = [
  {
    title: 'Bienvenue sur Racing Club de Bingerville',
    content: 'Votre plateforme de gestion de club de football.'
  },
  {
    title: 'Dashboard',
    content: 'Consultez les matchs à venir, les résultats et les insights générés automatiquement.'
  },
  {
    title: 'Joueurs',
    content: 'Gérez l’effectif, consultez les fiches et analysez les statistiques de chaque joueur.'
  },
  {
    title: 'Matchs',
    content: 'Planifiez, suivez la timeline et analysez les rencontres de la saison.'
  },
  {
    title: 'Command Center',
    content: 'Appuyez sur Ctrl+K à tout moment pour accéder rapidement aux actions clés.'
  }
];

export const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      // Small delay to let the UI load first
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-content-muted hover:text-white transition-colors bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black shadow-glow">
                  RC
                </div>
              </div>

              <div className="min-h-[120px] text-center">
                <motion.h2 
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-black text-white mb-4"
                >
                  {steps[currentStep].title}
                </motion.h2>
                <motion.p 
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-content-muted text-lg"
                >
                  {steps[currentStep].content}
                </motion.p>
              </div>

              <div className="flex flex-col items-center mt-8 gap-6">
                <div className="flex gap-2">
                  {steps.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-primary shadow-glow' : 'w-2 bg-white/20'}`}
                    />
                  ))}
                </div>

                <Button onClick={handleNext} className="w-full flex items-center justify-center gap-2 py-3 text-lg font-bold">
                  {currentStep < steps.length - 1 ? (
                    <>Suivant <ChevronRight size={20} /></>
                  ) : (
                    <>Commencer <Check size={20} /></>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
