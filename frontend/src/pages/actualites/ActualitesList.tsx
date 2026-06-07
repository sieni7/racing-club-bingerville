import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Calendar, Eye, ArrowRight } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  titre: string;
  contenu: string;
  slug: string;
  image_url: string | null;
  published_at: string;
}

export default function ActualitesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('actualites')
      .select('id, titre, contenu, slug, image_url, published_at')
      .eq('statut', 'PUBLIE')  // ← CRUCIAL : seulement les articles publiés
      .order('published_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17]">
        <div className="relative pt-20 pb-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Médias</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Actualités</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Toute l'actualité du Racing Club Bingerville.</p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={6} />
          </div>
        </div>
      </div>
    );
    );
  }

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17]">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Médias</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Actualités</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg max-w-2xl">Découvrez les dernières annonces, résumés de matchs et moments forts de la vie du Racing Club Bingerville.</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {articles.length === 0 ? (
          <EmptyState title="Aucune actualité" message="Aucune actualité n'a encore été publiée." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/actualites/${article.slug}`}
                  className="group flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800"
                >
              <div className="aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Calendar size={14} />
                  <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('fr-FR') : 'Récemment'}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{article.titre}</h2>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                  {article.contenu.replace(/<[^>]*>/g, '').slice(0, 150)}...
                </p>
                <div className="flex items-center text-primary font-bold gap-1 mt-auto">
                  Lire la suite <Eye size={16} className="ml-1" />
                </div>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
      {!loading && articles.length > 0 && (
        <div className="mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
      </div>
    </div>
  );
}

