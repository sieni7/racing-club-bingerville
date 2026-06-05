import React, { useState } from 'react';
import { useGetJoueursQuery } from '../../features/api/joueursApi';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface CompositionFormProps {
  initialComposition?: any[];
  onSubmit: (composition: any[]) => void;
  isLoading: boolean;
}

export const CompositionForm: React.FC<CompositionFormProps> = ({ initialComposition = [], onSubmit, isLoading }) => {
  const { data: joueurs, isLoading: isLoadingJoueurs } = useGetJoueursQuery({ statut: 'ACTIF' });
  const [composition, setComposition] = useState<any[]>(initialComposition);

  if (isLoadingJoueurs) return <LoadingSpinner />;

  const handleAddPlayer = (joueurId: string, role: string, numero: number, poste: string) => {
    if (!joueurId || !role || !numero || !poste) return;
    setComposition(prev => [...prev.filter(c => c.joueurId !== joueurId), { joueurId, role, numero: Number(numero), poste }]);
  };

  const handleRemovePlayer = (joueurId: string) => {
    setComposition(prev => prev.filter(c => c.joueurId !== joueurId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(composition);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-md font-medium mb-4">Ajouter un joueur</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Joueur</label>
            <select id="joueurSelect" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
              <option value="">Sélectionner un joueur</option>
              {joueurs?.map((j: any) => (
                <option key={j._id} value={j._id}>{j.nom} {j.prenom} ({j.poste})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select id="roleSelect" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
              <option value="TITULAIRE">Titulaire</option>
              <option value="REMPLACANT">Remplaçant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro</label>
            <input type="number" id="numSelect" min="1" max="99" defaultValue="1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Poste</label>
            <select id="posteSelect" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
              <option value="G">G</option>
              <option value="D">D</option>
              <option value="DC">DC</option>
              <option value="M">M</option>
              <option value="A">A</option>
              <option value="BU">BU</option>
            </select>
          </div>
          <div className="sm:col-span-5 flex justify-end mt-2">
            <button 
              type="button" 
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              onClick={() => {
                const jSelect = document.getElementById('joueurSelect') as HTMLSelectElement;
                const rSelect = document.getElementById('roleSelect') as HTMLSelectElement;
                const nSelect = document.getElementById('numSelect') as HTMLInputElement;
                const pSelect = document.getElementById('posteSelect') as HTMLSelectElement;
                handleAddPlayer(jSelect.value, rSelect.value, Number(nSelect.value), pSelect.value);
                jSelect.value = '';
              }}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-md font-medium mb-4">Composition Actuelle ({composition.length} joueurs)</h4>
        <ul className="divide-y divide-gray-200 border-t border-b">
          {composition.map((comp) => {
            const joueur = joueurs?.find((j: any) => j._id === comp.joueurId);
            return (
              <li key={comp.joueurId} className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white font-bold mr-3">
                    {comp.numero}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{joueur ? `${joueur.nom} ${joueur.prenom}` : 'Joueur inconnu'}</p>
                    <p className="text-xs text-gray-500">{comp.role} - {comp.poste}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemovePlayer(comp.joueurId)} className="text-red-600 hover:text-red-900 text-sm font-medium">
                  Retirer
                </button>
              </li>
            );
          })}
          {composition.length === 0 && <li className="py-4 text-center text-gray-500 text-sm">Aucun joueur dans la composition</li>}
        </ul>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? 'Enregistrement...' : 'Sauvegarder Composition'}
        </button>
      </div>
    </form>
  );
};
