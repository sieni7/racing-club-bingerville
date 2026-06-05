import React, { useState } from 'react';
import { 
  useGetJoueursQuery, 
  useCreateJoueurMutation, 
  useUpdateJoueurMutation, 
  useDeleteJoueurMutation 
} from '../features/api/joueursApi';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { JoueurTableRow } from '../components/Joueurs/JoueurTableRow';
import { JoueurForm } from '../components/Joueurs/JoueurForm';
import { ConfirmModal } from '../components/common/ConfirmModal';
import toast from 'react-hot-toast';

const Joueurs: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ statut: '', poste: '', search: '' });
  const { data: joueurs, isLoading, isError } = useGetJoueursQuery(filters);
  const [createJoueur, { isLoading: isCreating }] = useCreateJoueurMutation();
  const [updateJoueur, { isLoading: isUpdating }] = useUpdateJoueurMutation();
  const [deleteJoueur] = useDeleteJoueurMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJoueur, setEditingJoueur] = useState<Record<string, unknown> | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const canEdit = user?.role === 'STAFF' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  const handleCreateOrUpdate = async (data: Record<string, unknown>) => {
    try {
      if (editingJoueur) {
        await updateJoueur({ id: editingJoueur._id, ...data }).unwrap();
        toast.success('Joueur mis à jour');
      } else {
        await createJoueur(data).unwrap();
        toast.success('Joueur créé');
      }
      setIsFormOpen(false);
      setEditingJoueur(null);
    } catch (err: unknown) {
      toast.error(err.data?.message || 'Une erreur est survenue');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteJoueur(deleteId).unwrap();
      toast.success('Joueur supprimé');
    } catch (err: unknown) {
      toast.error(err.data?.message || 'Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredJoueurs = joueurs?.filter((j: Record<string, unknown>) => {
    if (filters.search && !`${j.nom} ${j.prenom}`.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Effectif</h1>
        {canEdit && (
          <button 
            onClick={() => { setEditingJoueur(null); setIsFormOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
          >
            Ajouter un joueur
          </button>
        )}
      </div>

      <div className="bg-white p-4 shadow rounded-lg flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <input 
          type="text" 
          placeholder="Rechercher par nom..." 
          className="border border-gray-300 rounded px-3 py-2 flex-grow"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <select 
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.poste}
          onChange={(e) => setFilters(prev => ({ ...prev, poste: e.target.value }))}
        >
          <option value="">Tous les postes</option>
          <option value="Gardien">Gardien</option>
          <option value="Défenseur">Défenseur</option>
          <option value="Milieu">Milieu</option>
          <option value="Attaquant">Attaquant</option>
        </select>
        <select 
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.statut}
          onChange={(e) => setFilters(prev => ({ ...prev, statut: e.target.value }))}
        >
          <option value="">Tous les statuts</option>
          <option value="ACTIF">Actif</option>
          <option value="BLESSE">Blessé</option>
          <option value="SUSPENDU">Suspendu</option>
          <option value="INACTIF">Inactif</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="text-red-600">Erreur lors du chargement des joueurs</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Naissance</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJoueurs?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucun joueur trouvé.</td>
                </tr>
              ) : (
                filteredJoueurs?.map((joueur: Record<string, unknown>) => (
                  <JoueurTableRow 
                    key={joueur._id} 
                    joueur={joueur} 
                    onEdit={(j) => { setEditingJoueur(j); setIsFormOpen(true); }}
                    onDelete={(id) => { if (canDelete) setDeleteId(id); else toast.error('Non autorisé'); }}
                    canEdit={canEdit}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <JoueurForm 
          initialData={editingJoueur}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => { setIsFormOpen(false); setEditingJoueur(null); }}
          isLoading={isCreating || isUpdating}
        />
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        title="Supprimer le joueur"
        message="Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Joueurs;
