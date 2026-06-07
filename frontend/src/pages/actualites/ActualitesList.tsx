import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Calendar, Eye } from 'lucide-react';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';

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
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Actualités</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="card" count={6} />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(articles.length / itemsPerPage);
  const paginatedArticles = articles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Actualités</h1>

      {articles.length === 0 ? (
        <EmptyState title="Aucune actualité" message="Aucune actualité n'a encore été publiée." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <Link
              key={article.id}
              to={`/actualites/${article.slug}`}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
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
          ))}
        </div>
      )}
      
      {!loading && articles.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

