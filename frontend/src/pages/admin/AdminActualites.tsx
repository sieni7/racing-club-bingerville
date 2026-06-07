import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Actualite {
  id: string;
  title: string;
  content: string;
  slug: string | null;
  image_url: string | null;
  author_id: string;
  published: boolean;
  created_at: string;
}

export default function AdminActualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchActualites();
  }, []);

  const fetchActualites = async () => {
    try {
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('actualites')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('actualites')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview; // keep existing if editing and not changed

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const slug = generateSlug(title);
      const user = (await supabase.auth.getUser()).data.user;

      const payload = {
        title,
        content,
        slug,
        image_url: imageUrl,
        published: true, // simple default
      };

      if (editingId) {
        const { error } = await supabase
          .from('actualites')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('actualites')
          .insert([{ ...payload, author_id: user?.id }]);
        if (error) throw error;
      }

      closeModal();
      fetchActualites();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;

    try {
      // Opt: Delete image from storage
      if (imageUrl && imageUrl.includes('supabase.co')) {
        const path = imageUrl.split('/actualites/')[1];
        if (path) {
          await supabase.storage.from('actualites').remove([path]);
        }
      }

      const { error } = await supabase.from('actualites').delete().eq('id', id);
      if (error) throw error;
      
      setActualites(actualites.filter(a => a.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert("Erreur lors de la suppression.");
    }
  };

  const openModal = (actu?: Actualite) => {
    if (actu) {
      setEditingId(actu.id);
      setTitle(actu.title);
      setContent(actu.content);
      setImagePreview(actu.image_url);
      setImageFile(null);
    } else {
      setEditingId(null);
      setTitle('');
      setContent('');
      setImagePreview(null);
      setImageFile(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Actualités</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Nouvelle actu
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Titre</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {actualites.map((actu) => (
                  <tr key={actu.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-4">
                      {actu.image_url ? (
                        <img src={actu.image_url} alt={actu.title} className="w-16 h-12 object-cover rounded-md" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-md">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{actu.title}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(actu.created_at), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openModal(actu)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(actu.id, actu.image_url)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {actualites.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">Aucune actualité trouvée.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
                <textarea 
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image de couverture</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                    Choisir un fichier
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {imageFile && <span className="text-sm text-gray-500">{imageFile.name}</span>}
                </div>
                {imagePreview && (
                  <div className="mt-4 relative w-full sm:w-1/2 aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</> : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
