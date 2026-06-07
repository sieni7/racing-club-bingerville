import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowRight } from 'lucide-react';

export const NewsPreview = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase
        .from('actualites')
        .select('*')
        .eq('statut', 'PUBLIE')
        .order('date_publication', { ascending: false })
        .limit(3);
      
      if (data) setNews(data);
    };
    
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Actualités</span>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mt-2">Dernières News</h2>
          </div>
          <Link to="/actualites" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
            Toutes les actus <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Link key={item.id} to={`/actualites/${item.slug}`} className="group block bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-gray-500">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded">{item.categorie}</span>
                  <span>{format(new Date(item.date_publication), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">{item.titre}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{item.extrait || item.contenu.substring(0, 100) + '...'}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-10 text-center sm:hidden">
          <Link to="/actualites" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
            Toutes les actus <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

