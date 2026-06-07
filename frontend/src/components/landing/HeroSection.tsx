import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';

export const HeroSection = () => {
  const [index, setIndex] = useState(0);

  const images = [
    'https://unsplash.com/photos/qowyMze7jqg/download?w=2000', // personnes-regardant-larene-de-football
    'https://unsplash.com/photos/kTxAcjN2VtQ/download?w=2000', // un-ballon-de-football-pose-sur-un-terrain-verdoyant
    'https://unsplash.com/photos/hQBIJsBtyBw/download?w=2000', // personnes-regardant-un-match-de-football-dans-le-stade
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCTAClick = (ctaName: string) => {
    // Analytics tracking (placeholder)
    console.log(`[Analytics] CTA Clicked: ${ctaName}`);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', {
        event_category: 'CTA',
        event_label: ctaName,
      });
    }
  };

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image / Video Carousel */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src={images[index]} 
              alt="Terrain de football" 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-sm mb-6 uppercase tracking-widest">
            Saison 2025-2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            L'excellence <br className="hidden md:block" /> par la <span className="text-primary">passion</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Plus qu'un club, une famille. Rejoignez le Racing Club de Bingerville 
            et faites partie d'une histoire forgée sur le respect, le travail et la victoire.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register?role=JOUEUR" 
              onClick={() => handleCTAClick('rejoindre')}
              className="bg-primary hover:bg-primary-light text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-glow flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Rejoindre le club
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/actualites" 
              onClick={() => handleCTAClick('actus')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Dernières actus
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ChevronDown className="text-white opacity-50 w-8 h-8" />
      </div>
    </section>
  );
};
