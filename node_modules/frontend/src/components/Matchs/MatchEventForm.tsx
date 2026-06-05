import React, { useState } from 'react';

interface MatchEventFormProps {
  matchId: string;
  composition: Record<string, unknown>[];
  joueurs: Record<string, unknown>[];
  onSubmit: (eventData: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const MatchEventForm: React.FC<MatchEventFormProps> = ({ composition, joueurs, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'BUT',
    joueurId: '',
    minute: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.joueurId || !formData.minute) return;
    
    onSubmit({
      ...formData,
      minute: Number(formData.minute)
    });
    
    // Reset form after submit
    setFormData(prev => ({ ...prev, type: 'BUT', joueurId: '', minute: '', details: '' }));
  };

  // Only show players from composition
  const matchPlayers = composition.map(comp => {
    const joueur = joueurs?.find((j: Record<string, unknown>) => j._id === comp.joueurId);
    return { ...comp, nomComplet: joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu' };
  });

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow border border-gray-200">
      <h4 className="text-md font-medium mb-4">Ajouter un événement</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select name="type" required value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="BUT">But</option>
            <option value="PASSE">Passe décisive</option>
            <option value="CARTON_JAUNE">Carton Jaune</option>
            <option value="CARTON_ROUGE">Carton Rouge</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Joueur</label>
          <select name="joueurId" required value={formData.joueurId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
            <option value="">Sélectionner...</option>
            {matchPlayers.map(p => (
              <option key={p.joueurId} value={p.joueurId}>{p.numero} - {p.nomComplet}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Minute</label>
          <input type="number" name="minute" min="1" max="120" required value={formData.minute} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="ex: 45" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Détails (opt)</label>
          <input type="text" name="details" value={formData.details} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="ex: sur penalty" />
        </div>
        <div className="sm:col-span-4 flex justify-end mt-2">
          <button 
            type="submit" 
            disabled={isLoading || !formData.joueurId}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Ajout...' : 'Ajouter événement'}
          </button>
        </div>
      </div>
    </form>
  );
};
