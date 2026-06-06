import React, { useState } from 'react';
import { useGetActualitesQuery, useCreateActualiteMutation, useDeleteActualiteMutation } from '../features/api/actualitesApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Actualites: React.FC = () => {
  const { data: actualitesData, isLoading } = useGetActualitesQuery({});
  const [createActualite, { isLoading: isCreating }] = useCreateActualiteMutation();
  const [deleteActualite] = useDeleteActualiteMutation();
  
  const { user } = useAuth();
  const isAdminOrStaff = user?.role === 'ADMIN' || user?.role === 'STAFF';

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titre: '', contenu: '', imageUrl: '', tags: '' });

  if (isLoading) return <LoadingSpinner />;

  const actualites = actualitesData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
      await createActualite({ ...formData, tags: tagsArray }).unwrap();
      toast.success('Actualité publiée');
      setFormData({ titre: '', contenu: '', imageUrl: '', tags: '' });
      setShowForm(false);
    } catch (err: unknown) {
      toast.error('Erreur lors de la publication');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      try {
        await deleteActualite(id).unwrap();
        toast.success('Actualité supprimée');
      } catch (err: unknown) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Actualités du Club</h1>
        {isAdminOrStaff && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            {showForm ? 'Fermer' : 'Rédiger une actualité'}
          </button>
        )}
      </div>

      {showForm && isAdminOrStaff && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium mb-4">Nouvelle Actualité</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input 
                type="text" required 
                value={formData.titre} onChange={e => setFormData({...formData, titre: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenu</label>
              <textarea 
                required rows={5}
                value={formData.contenu} onChange={e => setFormData({...formData, contenu: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL (Optionnel)</label>
              <input 
                type="url" 
                value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (séparés par des virgules)</label>
              <input 
                type="text" placeholder="Equipe A, Victoire, Transferts"
                value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" 
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={isCreating} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">
                {isCreating ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actualites.map((actu: any) => (
          <div key={actu._id as string} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
            {actu.imageUrl && (
              <img src={actu.imageUrl as string} alt={actu.titre as string} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{actu.titre as string}</h3>
                {user?.role === 'ADMIN' && (
                  <button onClick={() => handleDelete(actu._id as string)} className="text-red-500 hover:text-red-700 text-sm">
                    Supprimer
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Publié le {new Date(actu.datePublication as string).toLocaleDateString()}
              </p>
              <p className="text-gray-700 flex-grow mb-4 whitespace-pre-line line-clamp-4">
                {actu.contenu as string}
              </p>
              {Array.isArray(actu.tags) && actu.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {(actu.tags as string[]).map((tag: string, idx: number) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {actualites.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune actualité pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default Actualites;
