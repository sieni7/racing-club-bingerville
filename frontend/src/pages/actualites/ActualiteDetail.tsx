import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Actualite, actualitesService } from '../../features/actualites/actualitesService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';

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

  if (isLoading) return <div className="text-center py-10">Chargement...</div>;
  if (!actualite) return <div className="text-center py-10 text-red-500">Actualité introuvable</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/actualites" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
        <ArrowLeft size={16} className="mr-2" /> Retour aux actualités
      </Link>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {actualite.image_url && (
          <div className="w-full h-64 bg-gray-200">
            <img src={actualite.image_url} alt={actualite.titre} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{actualite.titre}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-8 border-b pb-4">
            <span>Publié le {actualite.published_at ? format(new Date(actualite.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'}</span>
            <span className="mx-2">•</span>
            <span>Par le Club</span>
          </div>
          
          <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
            {actualite.contenu}
          </div>
        </div>
      </article>
    </div>
  );
}

