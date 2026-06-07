import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const demoPhotos = [
  { src: 'https://images.unsplash.com/photo-mY2ZHBU6GRk?q=80&w=800&auto=format&fit=crop', title: 'Action de jeu' },
  { src: 'https://images.unsplash.com/photo-nTIkwCmUmNU?q=80&w=800&auto=format&fit=crop', title: 'Esprit d\'équipe' },
  { src: 'https://images.unsplash.com/photo-unPrQUcWfI4?q=80&w=800&auto=format&fit=crop', title: 'Entraînement intense' },
  { src: 'https://images.unsplash.com/photo-jaODdxmamsg?q=80&w=800&auto=format&fit=crop', title: 'Passion du terrain' },
];

export const PhotoGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % demoPhotos.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + demoPhotos.length) % demoPhotos.length);
    }
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Galerie</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Moments Forts</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {demoPhotos.map((photo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelectedIndex(idx)}
            >
              <img 
                src={photo.src} 
                alt={photo.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <span className="text-white font-bold">{photo.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-2"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors p-4 hidden md:block"
              onClick={handlePrev}
            >
              <ChevronLeft size={48} />
            </button>

            <motion.img
              key={selectedIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              src={demoPhotos[selectedIndex].src}
              alt={demoPhotos[selectedIndex].title}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />

            <button 
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white hover:text-primary transition-colors p-4 hidden md:block"
              onClick={handleNext}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-medium bg-black/50 px-4 py-2 rounded-full">
              {demoPhotos[selectedIndex].title} ({selectedIndex + 1}/{demoPhotos.length})
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
