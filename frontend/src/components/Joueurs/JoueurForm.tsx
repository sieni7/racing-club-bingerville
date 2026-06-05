import React, { useState, useEffect } from 'react';

interface JoueurFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const JoueurForm: React.FC<JoueurFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    numeroLicence: '',
    nom: '',
    prenom: '',
    poste: '',
    dateNaissance: '',
    taille: '',
    poids: '',
    statut: 'ACTIF'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        numeroLicence: initialData.numeroLicence || '',
        nom: initialData.nom || '',
        prenom: initialData.prenom || '',
        poste: initialData.poste || '',
        dateNaissance: initialData.dateNaissance ? new Date(initialData.dateNaissance).toISOString().split('T')[0] : '',
        taille: initialData.taille || '',
        poids: initialData.poids || '',
        statut: initialData.statut || 'ACTIF'
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData: Record<string, unknown> = { ...formData };
    if (submitData.dateNaissance) {
        submitData.dateNaissance = new Date(submitData.dateNaissance as string).toISOString();
    }
    if (submitData.taille) submitData.taille = Number(submitData.taille);
    if (submitData.poids) submitData.poids = Number(submitData.poids);
    if (!submitData.taille) delete submitData.taille;
    if (!submitData.poids) delete submitData.poids;

    onSubmit(submitData);
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onCancel}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                {initialData ? 'Modifier Joueur' : 'Ajouter un Joueur'}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="numeroLicence" className="block text-sm font-medium text-gray-700">N° Licence</label>
                  <input type="text" name="numeroLicence" id="numeroLicence" required value={formData.numeroLicence} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700">Statut</label>
                  <select name="statut" id="statut" required value={formData.statut} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="ACTIF">Actif</option>
                    <option value="BLESSE">Blessé</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="INACTIF">Inactif</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="nom" id="nom" required value={formData.nom} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input type="text" name="prenom" id="prenom" required value={formData.prenom} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="poste" className="block text-sm font-medium text-gray-700">Poste</label>
                  <select name="poste" id="poste" required value={formData.poste} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    <option value="">Sélectionner</option>
                    <option value="Gardien">Gardien</option>
                    <option value="Défenseur">Défenseur</option>
                    <option value="Milieu">Milieu</option>
                    <option value="Attaquant">Attaquant</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">Date Naissance</label>
                  <input type="date" name="dateNaissance" id="dateNaissance" required value={formData.dateNaissance} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="taille" className="block text-sm font-medium text-gray-700">Taille (cm)</label>
                  <input type="number" name="taille" id="taille" value={formData.taille} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="poids" className="block text-sm font-medium text-gray-700">Poids (kg)</label>
                  <input type="number" name="poids" id="poids" value={formData.poids} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button type="button" onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
