import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus, Upload, X, Eye } from 'lucide-react';

interface Article {
  id: string;
  titre: string;
  contenu: string;
  slug: string;
  image_url: string | null;
  statut: 'PUBLIE' | 'BROUILLON';
  created_at: string;
}

const schema = z.object({
  titre: z.string().min(5, 'Titre trop court (min. 5 caractères)'),
  contenu: z.string().min(20, 'Contenu trop court (min. 20 caractères)'),
  statut: z.enum(['PUBLIE', 'BROUILLON']),
  image_url: z.string().nullable().optional(),
});

type FormData = z.infer<typeof schema>;

const generateSlug = (titre: string) =>
  titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const SkeletonRow = () => (
  <div className="animate-pulse flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
    </div>
  </div>
);

export const AdminActualites = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { statut: 'BROUILLON' },
  });

  const titre = watch('titre');

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('actualites')
      .select('id, titre, contenu, slug, image_url, statut, created_at')
      .order('created_at', { ascending: false });
    setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const openModal = (article?: Article) => {
    if (article) {
      setEditing(article);
      setImageUrl(article.image_url);
      reset({
        titre: article.titre,
        contenu: article.contenu,
        statut: article.statut,
        image_url: article.image_url,
      });
    } else {
      setEditing(null);
      setImageUrl(null);
      reset({ titre: '', contenu: '', statut: 'BROUILLON', image_url: null });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setImageUrl(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('actualites').upload(filename, file);
    if (error) {
      toast.error("Erreur lors de l'upload");
    } else {
      const { data } = supabase.storage.from('actualites').getPublicUrl(filename);
      setImageUrl(data.publicUrl);
      setValue('image_url', data.publicUrl);
      toast.success('Image uploadée');
    }
    setUploading(false);
  };

  const onSubmit = async (data: FormData) => {
    const slug = generateSlug(data.titre);
    const payload = {
      titre: data.titre,
      contenu: data.contenu,
      statut: data.statut,
      slug,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
      ...(data.statut === 'PUBLIE' && !editing ? { published_at: new Date().toISOString() } : {}),
    };

    const { error } = editing
      ? await supabase.from('actualites').update(payload).eq('id', editing.id)
      : await supabase.from('actualites').insert(payload);

    if (!error) {
      toast.success(editing ? 'Article modifié' : 'Article créé');
      closeModal();
      fetchArticles();
    } else {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (article: Article) => {
    if (!confirm(`Supprimer "${article.titre}" ?`)) return;

    if (article.image_url) {
      const parts = article.image_url.split('/');
      const filename = parts[parts.length - 1];
      if (filename) {
        await supabase.storage.from('actualites').remove([filename]);
      }
    }

    const { error } = await supabase.from('actualites').delete().eq('id', article.id);
    if (!error) {
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      toast.success('Article supprimé');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Actualités</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} />
          Nouvelle actualité
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : articles.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400">
            Aucune actualité. Créez la première.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Titre</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium line-clamp-1">{article.titre}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      article.statut === 'PUBLIE'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {article.statut === 'PUBLIE' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button
                        title="Voir"
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        onClick={() => window.open(`/actualites/${article.slug}`, '_blank')}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Modifier"
                        className="text-gray-400 hover:text-primary transition-colors"
                        onClick={() => openModal(article)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        title="Supprimer"
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => handleDelete(article)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold">
                {editing ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Image de couverture</label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <img src={imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
                  )}
                  <label className={`cursor-pointer flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-3 text-sm transition-colors ${
                    uploading ? 'border-primary/50 text-primary' : 'border-gray-300 text-gray-500 hover:border-primary hover:text-primary'
                  }`}>
                    <Upload size={16} />
                    {uploading ? 'Upload en cours...' : imageUrl ? 'Changer l\'image' : 'Choisir une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <input
                  {...register('titre')}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre.message}</p>}
                {titre && (
                  <p className="text-xs text-gray-400 mt-1">
                    Slug : <span className="font-mono">{generateSlug(titre)}</span>
                  </p>
                )}
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-medium mb-1">Contenu *</label>
                <textarea
                  {...register('contenu')}
                  rows={8}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {errors.contenu && <p className="text-red-500 text-xs mt-1">{errors.contenu.message}</p>}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  {...register('statut')}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIE">Publié</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm bg-primary text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
