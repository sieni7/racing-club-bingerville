import React from 'react';
import { useGetTopButeursQuery } from '../features/api/statsApi';
import { useGetActualitesQuery } from '../features/api/actualitesApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data: buteursData, isLoading: isLoadingButeurs } = useGetTopButeursQuery({ limit: 3 });
  const { data: actualitesData, isLoading: isLoadingActus } = useGetActualitesQuery({ limit: 3 });

  if (isLoadingButeurs || isLoadingActus) return <LoadingSpinner />;

  const buteurs = buteursData?.data || [];
  const actualites = actualitesData?.data || [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Dernières Actualités</h2>
            <Link to="/actualites" className="text-blue-600 hover:text-blue-800 text-sm font-medium">Voir tout &rarr;</Link>
          </div>
          {actualites.length > 0 ? (
            <div className="space-y-4">
              {actualites.map((actu) => (
                <div key={actu._id as string} className="border-b pb-3 last:border-0 last:pb-0">
                  <h3 className="font-semibold text-gray-900">{actu.titre as string}</h3>
                  <p className="text-xs text-gray-500">{new Date(actu.datePublication as string).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune actualité récente.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Top Buteurs Actuels</h2>
            <Link to="/statistiques" className="text-green-600 hover:text-green-800 text-sm font-medium">Statistiques complètes &rarr;</Link>
          </div>
          {buteurs.length > 0 ? (
            <ul className="space-y-3">
              {buteurs.map((stat, idx) => {
                const joueur = stat.joueurId as Record<string, unknown>;
                return (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu'}</span>
                    <span className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                      {stat.buts as number} buts
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune statistique disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
