import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const demoPhotos = [
  { src: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop', title: 'Entraînement' },
  { src: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop', title: 'Match Officiel' },
  { src: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop', title: 'Victoire' },
  { src: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop', title: 'Esprit d\'équipe' },
  { src: 'https://images.unsplash.com/photo-1551280857-2b9b71a17726?q=80&w=800&auto=format&fit=crop', title: 'Le Stade' },
  { src: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=800&auto=format&fit=crop', title: 'Célébration' },
];

export const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Galerie</span>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Moments Forts</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {demoPhotos.map((photo, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group shadow-sm hover:shadow-xl transition-all"
              onClick={() => setSelectedPhoto(photo.src)}
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
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={selectedPhoto}
              alt="Vue agrandie"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
