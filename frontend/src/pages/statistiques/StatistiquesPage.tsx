import { useEffect, useState } from 'react';
import { StatJoueur, statistiquesService } from '../../features/statistiques/statistiquesService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function StatistiquesPage() {
  const [buteurs, setButeurs] = useState<StatJoueur[]>([]);
  const [passeurs, setPasseurs] = useState<StatJoueur[]>([]);
  const [discipline, setDiscipline] = useState<StatJoueur[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      statistiquesService.getTopButeurs(),
      statistiquesService.getTopPasseurs(),
      statistiquesService.getTopDiscipline()
    ]).then(([b, p, d]) => {
      setButeurs(b);
      setPasseurs(p);
      setDiscipline(d);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) return <div className="text-center py-10">Chargement des statistiques...</div>;

  const buteursData = buteurs.map(b => ({
    name: b.prenom + ' ' + b.nom.substring(0, 1) + '.',
    Buts: b.buts
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Statistiques de l'équipe</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow h-96">
          <h2 className="text-lg font-semibold mb-4 text-center">Top Buteurs (Graphique)</h2>
          {buteursData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buteursData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Buts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Aucune donnée</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Classement des Buteurs</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Joueur</th>
                <th className="py-2 text-center">Matchs</th>
                <th className="py-2 text-center">Buts</th>
              </tr>
            </thead>
            <tbody>
              {buteurs.length > 0 ? buteurs.map(b => (
                <tr key={b.joueur_id} className="border-t">
                  <td className="py-2">{b.prenom} {b.nom}</td>
                  <td className="py-2 text-center">{b.matchs_joues}</td>
                  <td className="py-2 text-center font-bold text-blue-600">{b.buts}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="text-center py-4 text-gray-500">Aucun buteur</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Top Passeurs</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Joueur</th>
                <th className="py-2 text-center">Matchs</th>
                <th className="py-2 text-center">Passes</th>
              </tr>
            </thead>
            <tbody>
              {passeurs.length > 0 ? passeurs.map(p => (
                <tr key={p.joueur_id} className="border-t">
                  <td className="py-2">{p.prenom} {p.nom}</td>
                  <td className="py-2 text-center">{p.matchs_joues}</td>
                  <td className="py-2 text-center font-bold text-green-600">{p.passes_decisives}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="text-center py-4 text-gray-500">Aucun passeur</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Discipline (Cartons)</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Joueur</th>
                <th className="py-2 text-center">Matchs</th>
                <th className="py-2 text-center text-yellow-600">Jaunes</th>
                <th className="py-2 text-center text-red-600">Rouges</th>
              </tr>
            </thead>
            <tbody>
              {discipline.length > 0 ? discipline.map(d => (
                <tr key={d.joueur_id} className="border-t">
                  <td className="py-2">{d.prenom} {d.nom}</td>
                  <td className="py-2 text-center">{d.matchs_joues}</td>
                  <td className="py-2 text-center font-bold text-yellow-600">{d.cartons_jaunes}</td>
                  <td className="py-2 text-center font-bold text-red-600">{d.cartons_rouges}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-4 text-gray-500">Aucun avertissement</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
