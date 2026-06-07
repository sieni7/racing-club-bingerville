import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Actualite, actualitesService } from '../../features/actualites/actualitesService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActualiteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      actualitesService.getBySlug(slug)
        .then(setActualite)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
  if (!actualite) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex items-center justify-center">
      <div className="text-center text-accent-danger font-bold">Actualité introuvable</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] pb-16">
      {/* Cover Image & Header Overlay */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-900">
        {actualite.image_url ? (
          <img src={actualite.image_url} alt={actualite.titre} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-gray-900 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 max-w-4xl pb-12">
            <Link to="/actualites" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition">
              <ArrowLeft size={16} className="mr-2" /> Retour aux actualités
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">{actualite.titre}</h1>
              <div className="flex flex-wrap items-center text-white/80 text-sm gap-4">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Calendar size={14} />
                  <span>{actualite.published_at ? format(new Date(actualite.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <User size={14} />
                  <span>Racing Club Bingerville</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-4 relative z-10">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 md:p-12"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {actualite.contenu}
          </div>
        </motion.article>
      </div>
    </div>
  );
}

