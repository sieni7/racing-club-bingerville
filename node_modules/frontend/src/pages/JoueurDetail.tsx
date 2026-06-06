import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetJoueurByIdQuery } from '../features/api/joueursApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { StatutBadge } from '../components/Joueurs/StatutBadge';

const JoueurDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: joueur, isLoading, isError } = useGetJoueurByIdQuery(id as string);

  if (isLoading) return <LoadingSpinner />;
  if (isError || !joueur) return <div className="text-red-600">Erreur lors du chargement ou joueur introuvable.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/joueurs')} className="text-blue-600 hover:text-blue-800">
          &larr; Retour à la liste
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {joueur.nom} {joueur.prenom}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Détails et informations personnelles.</p>
          </div>
          <StatutBadge statut={joueur.statut} />
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Numéro de Licence</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{joueur.numeroLicence}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Poste</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{joueur.poste}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date de Naissance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(joueur.dateNaissance).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Taille</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {joueur.taille ? `${joueur.taille} cm` : 'Non renseignée'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Poids</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {joueur.poids ? `${joueur.poids} kg` : 'Non renseigné'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques Individuelles</h3>
        <p className="text-gray-500">Les statistiques de match seront affichées ici une fois le module Matchs implémenté (Sprint 5).</p>
      </div>
    </div>
  );
};

export default JoueurDetail;
