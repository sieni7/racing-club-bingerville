import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Calendar, Target, Newspaper, TrendingUp } from 'lucide-react';

interface Stats {
  joueurs: number;
  matchs: number;
  buts: number;
  actualites: number;
  utilisateurs: number;
  victoires: number;
  nuls: number;
  defaites: number;
}

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [
        { count: joueurs },
        { count: matchs },
        { count: actualites },
        { count: utilisateurs },
        { data: butsData },
      ] = await Promise.all([
        supabase.from('joueurs').select('*', { count: 'exact', head: true }),
        supabase.from('matchs').select('*', { count: 'exact', head: true }).eq('statut', 'TERMINE'),
        supabase.from('actualites').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('evenements_match').select('*').eq('type_evenement', 'BUT'),
      ]);

      // Calculer bilan W/D/L (à adapter selon votre schéma)
      const { data: matchsData } = await supabase.from('matchs').select('score_equipe, score_adversaire').eq('statut', 'TERMINE');
      let victoires = 0, nuls = 0, defaites = 0;
      matchsData?.forEach((m: any) => {
        if (m.score_equipe > m.score_adversaire) victoires++;
        else if (m.score_equipe === m.score_adversaire) nuls++;
        else defaites++;
      });

      setStats({
        joueurs: joueurs || 0,
        matchs: matchs || 0,
        buts: butsData?.length || 0,
        actualites: actualites || 0,
        utilisateurs: utilisateurs || 0,
        victoires,
        nuls,
        defaites,
      });
      setLoading(false);
    };

    fetchAll();
  }, []);

  const kpiCards = [
    { label: 'Joueurs', value: stats?.joueurs, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950' },
    { label: 'Matchs joués', value: stats?.matchs, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950' },
    { label: 'Buts marqués', value: stats?.buts, icon: Target, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
    { label: 'Actualités', value: stats?.actualites, icon: Newspaper, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
    { label: 'Utilisateurs', value: stats?.utilisateurs, icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950' },
  ];

  const bilanData = stats ? [
    { name: 'Victoires', value: stats.victoires, color: '#22c55e' },
    { name: 'Nuls', value: stats.nuls, color: '#f59e0b' },
    { name: 'Défaites', value: stats.defaites, color: '#ef4444' },
  ] : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm">
            {loading ? (
              <>
                <Skeleton className="h-8 w-8 mb-3" />
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-4 w-20" />
              </>
            ) : (
              <>
                <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
                  <card.icon size={20} />
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{card.label}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Graphiques */}
      {!loading && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Bilan des matchs</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bilanData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {bilanData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Activité récente</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Dernière actualité</span>
                <span className="text-sm font-medium">À venir</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Prochain match</span>
                <span className="text-sm font-medium">À venir</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
