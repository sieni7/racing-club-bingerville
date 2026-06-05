import React, { useState } from 'react';
import { useGetTopButeursQuery, useGetTopPasseursQuery } from '../features/api/statsApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const Statistiques: React.FC = () => {
  const [saison, setSaison] = useState('2023-2024');
  const { data: buteursData, isLoading: loadingButeurs } = useGetTopButeursQuery({ saison, limit: 10 });
  const { data: passeursData, isLoading: loadingPasseurs } = useGetTopPasseursQuery({ saison, limit: 10 });

  if (loadingButeurs || loadingPasseurs) return <LoadingSpinner />;

  const buteurs = buteursData?.data || [];
  const passeurs = passeursData?.data || [];

  const formatDataForChart = (data: Record<string, unknown>[], key: string) => {
    return data.map((stat) => {
      const joueur = stat.joueurId as Record<string, unknown>;
      return {
        name: joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu',
        [key]: stat[key]
      };
    });
  };

  const buteursChartData = formatDataForChart(buteurs, 'buts');
  const passeursChartData = formatDataForChart(passeurs, 'passes');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Statistiques ({saison})</h1>
        <select 
          value={saison} 
          onChange={(e) => setSaison(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="2023-2024">2023-2024</option>
          <option value="2024-2025">2024-2025</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Buteurs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Top Buteurs</h2>
          {buteurs.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={buteursChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="buts" fill="#3b82f6" name="Buts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible.</p>
          )}
        </div>

        {/* Top Passeurs */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Top Passeurs</h2>
          {passeurs.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={passeursChartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passes" fill="#10b981" name="Passes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500">Aucune donnée disponible.</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Buteurs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matchs</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Buts</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buteurs.map((stat, idx) => {
                const joueur = stat.joueurId as Record<string, unknown>;
                return (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {idx + 1}. {joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{stat.matchsJoues as number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold">{stat.buts as number}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Passeurs List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joueur</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matchs</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Passes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {passeurs.map((stat, idx) => {
                const joueur = stat.joueurId as Record<string, unknown>;
                return (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {idx + 1}. {joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{stat.matchsJoues as number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-bold">{stat.passes as number}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
