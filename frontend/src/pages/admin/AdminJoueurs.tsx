import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Eye, Pencil, Trash2, LayoutList, LayoutGrid, Plus } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';
interface Joueur {
  id: string;
  nom: string;
  prenom: string;
  numero: number;
  poste: 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT';
  statut: 'ACTIF' | 'INACTIF' | 'BLESSE';
  photo_url: string | null;
}

type ViewMode = 'table' | 'cards';

const POSTE_COLORS: Record<string, string> = {
  GARDIEN:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DEFENSEUR: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MILIEU:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ATTAQUANT: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const STATUT_COLORS: Record<string, string> = {
  ACTIF:   'bg-green-100 text-green-700',
  INACTIF: 'bg-gray-100 text-gray-500',
  BLESSE:  'bg-orange-100 text-orange-700',
};

const Avatar = ({ joueur }: { joueur: Joueur }) =>
  joueur.photo_url ? (
    <img src={joueur.photo_url} alt="" className="w-9 h-9 rounded-full object-cover" loading="lazy" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
      {joueur.prenom[0]}{joueur.nom[0]}
    </div>
  );

const AvatarLg = ({ joueur }: { joueur: Joueur }) =>
  joueur.photo_url ? (
    <img src={joueur.photo_url} alt="" className="w-16 h-16 rounded-full object-cover mx-auto" loading="lazy" />
  ) : (
    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500 mx-auto">
      {joueur.prenom[0]}{joueur.nom[0]}
    </div>
  );

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded" /></td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </td>
    <td className="px-6 py-4"><div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
    <td className="px-6 py-4"><div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" /></td>
    <td className="px-6 py-4"><div className="flex justify-center gap-2">
      {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />)}
    </div></td>
  </tr>
);

export const AdminJoueurs = () => {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(
    (localStorage.getItem('admin_joueurs_view') as ViewMode) || 'table'
  );
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; joueur: Joueur | null }>({
    isOpen: false,
    joueur: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from('joueurs')
      .select('id, nom, prenom, numero, poste, statut, photo_url')
      .order('numero')
      .then(({ data }) => {
        setJoueurs(data || []);
        setLoading(false);
      });
  }, []);

  const setView = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('admin_joueurs_view', mode);
  };

  const handleDeleteClick = (joueur: Joueur) => {
    setConfirmModal({ isOpen: true, joueur });
  };

  const handleConfirmDelete = async () => {
    if (!confirmModal.joueur) return;
    setIsDeleting(true);
    const { error } = await supabase.from('joueurs').delete().eq('id', confirmModal.joueur.id);
    if (!error) {
      setJoueurs((prev) => prev.filter((j) => j.id !== confirmModal.joueur?.id));
      toast.success(`${confirmModal.joueur.prenom} ${confirmModal.joueur.nom} supprimé`);
    } else {
      toast.error("Erreur lors de la suppression");
    }
    setIsDeleting(false);
    setConfirmModal({ isOpen: false, joueur: null });
  };

  const Actions = ({ joueur }: { joueur: Joueur }) => (
    <div className="flex items-center gap-3 text-gray-400">
      <button
        title="Voir fiche"
        className="hover:text-blue-500 transition-colors"
        onClick={() => navigate(`/joueurs/${joueur.id}`)}
      >
        <Eye size={17} />
      </button>
      <button
        title="Modifier"
        className="hover:text-primary transition-colors"
        onClick={() => navigate(`/admin/joueurs/${joueur.id}/edit`)}
      >
        <Pencil size={17} />
      </button>
      <button
        title="Supprimer"
        className="hover:text-red-500 transition-colors"
        onClick={() => handleDeleteClick(joueur)}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Joueurs</h1>
        <div className="flex items-center gap-2">
          {/* Toggle vue */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              title="Vue tableau"
            >
              <LayoutList size={17} />
            </button>
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-2 transition-colors ${viewMode === 'cards' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              title="Vue grille"
            >
              <LayoutGrid size={17} />
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/joueurs/new')}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {/* VUE TABLEAU */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-6 py-3 text-left">N°</th>
                <th className="px-6 py-3 text-left">Joueur</th>
                <th className="px-6 py-3 text-left">Poste</th>
                <th className="px-6 py-3 text-left">Statut</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : joueurs.map((joueur) => (
                    <tr key={joueur.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-400 text-sm">{joueur.numero}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar joueur={joueur} />
                          <span className="font-medium">{joueur.prenom} {joueur.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${POSTE_COLORS[joueur.poste] || 'bg-gray-100 text-gray-600'}`}>
                          {joueur.poste}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUT_COLORS[joueur.statut] || 'bg-gray-100 text-gray-600'}`}>
                          {joueur.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <Actions joueur={joueur} />
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VUE GRILLE */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm animate-pulse text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-3" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mx-auto" />
                </div>
              ))
            : joueurs.map((joueur) => (
                <div key={joueur.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm text-center">
                  <AvatarLg joueur={joueur} />
                  <div className="font-medium text-sm mt-3">{joueur.prenom} {joueur.nom}</div>
                  <div className="text-xs text-gray-400 mt-0.5">#{joueur.numero}</div>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-2 ${POSTE_COLORS[joueur.poste] || ''}`}>
                    {joueur.poste}
                  </span>
                  <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Actions joueur={joueur} />
                  </div>
                </div>
              ))}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Supprimer le joueur"
        message={`Voulez-vous vraiment supprimer ${confirmModal.joueur?.prenom} ${confirmModal.joueur?.nom} ? Cette action est irréversible.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, joueur: null })}
        isDeleting={isDeleting}
      />
    </div>
  );
};

