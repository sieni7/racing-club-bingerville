import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Loader2, LayoutGrid, List } from 'lucide-react';

interface Joueur {
  id: string;
  prenom: string;
  nom: string;
  poste: string;
  numero: number | null;
  photo_url: string | null;
  statut: string;
}

export default function AdminJoueurs() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [poste, setPoste] = useState('');
  const [numero, setNumero] = useState('');
  const [statut, setStatut] = useState('ACTIF');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJoueurs();
  }, []);

  const fetchJoueurs = async () => {
    try {
      const { data, error } = await supabase
        .from('joueurs')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setJoueurs(data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        prenom,
        nom,
        poste,
        numero: numero ? parseInt(numero) : null,
        statut,
      };

      if (editingId) {
        const { error } = await supabase
          .from('joueurs')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('joueurs')
          .insert([payload]);
        if (error) throw error;
      }

      closeModal();
      fetchJoueurs();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return;

    try {
      const { error } = await supabase.from('joueurs').delete().eq('id', id);
      if (error) throw error;
      setJoueurs(joueurs.filter(j => j.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert("Erreur lors de la suppression.");
    }
  };

  const openModal = (joueur?: Joueur) => {
    if (joueur) {
      setEditingId(joueur.id);
      setPrenom(joueur.prenom);
      setNom(joueur.nom);
      setPoste(joueur.poste);
      setNumero(joueur.numero ? joueur.numero.toString() : '');
      setStatut(joueur.statut);
    } else {
      setEditingId(null);
      setPrenom('');
      setNom('');
      setPoste('');
      setNumero('');
      setStatut('ACTIF');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Joueurs</h1>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <List size={20} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Nouveau Joueur
          </button>
        </div>
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
        <>
          {viewMode === 'table' ? (
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poste</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N°</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {joueurs.map((joueur) => (
                      <tr key={joueur.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="p-4 font-medium text-gray-900 dark:text-white">
                          {joueur.prenom} {joueur.nom}
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{joueur.poste}</td>
                        <td className="p-4 text-gray-500 dark:text-gray-400">{joueur.numero || '-'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {joueur.statut}
                          </span>
                        </td>
                        <td className="p-4 flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openModal(joueur)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(joueur.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {joueurs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">Aucun joueur trouvé.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {joueurs.map((joueur) => (
                <div key={joueur.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col relative group">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center overflow-hidden">
                    {joueur.photo_url ? (
                      <img src={joueur.photo_url} alt={joueur.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-4xl font-black text-gray-400 dark:text-gray-600">
                        {joueur.numero || '?'}
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(joueur)} className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-full shadow-sm">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(joueur.id)} className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {joueur.prenom} {joueur.nom}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{joueur.poste}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {joueur.statut}
                      </span>
                      {joueur.numero && (
                        <span className="font-bold text-gray-300 dark:text-gray-600">#{joueur.numero}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Modifier le joueur' : 'Nouveau joueur'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                  <input 
                    type="text" 
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poste</label>
                  <select 
                    required
                    value={poste}
                    onChange={(e) => setPoste(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Gardien">Gardien</option>
                    <option value="Défenseur">Défenseur</option>
                    <option value="Milieu">Milieu</option>
                    <option value="Attaquant">Attaquant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro (Optionnel)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="99"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input 
                    type="checkbox" 
                    checked={statut === 'ACTIF'}
                    onChange={(e) => setStatut(e.target.checked ? 'ACTIF' : 'INACTIF')}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Joueur actif (Affiche sur le site)</span>
                </label>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 mt-6">
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
