import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Newspaper, Calendar, Trophy } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const mockChartData = [
  { name: 'Jan', vues: 4000, inscrits: 240 },
  { name: 'Fév', vues: 3000, inscrits: 139 },
  { name: 'Mar', vues: 2000, inscrits: 980 },
  { name: 'Avr', vues: 2780, inscrits: 390 },
  { name: 'Mai', vues: 1890, inscrits: 480 },
  { name: 'Juin', vues: 2390, inscrits: 380 },
  { name: 'Juil', vues: 3490, inscrits: 430 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    joueurs: 0,
    actualites: 0,
    matchs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch counts from real tables
        const [joueursRes, actusRes, matchsRes] = await Promise.all([
          supabase.from('joueurs').select('*', { count: 'exact', head: true }),
          supabase.from('actualites').select('*', { count: 'exact', head: true }),
          supabase.from('matchs').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          joueurs: joueursRes.count || 0,
          actualites: actusRes.count || 0,
          matchs: matchsRes.count || 0,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/4 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 h-32 rounded-xl border border-gray-100 dark:border-gray-700"></div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Joueurs', value: stats.joueurs, icon: <Users size={24} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Actualités', value: stats.actualites, icon: <Newspaper size={24} />, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Matchs Joués', value: stats.matchs, icon: <Calendar size={24} />, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { title: 'Victoires', value: '75%', icon: <Trophy size={24} />, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Visites du site (Vues)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="vues" stroke="#E63946" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Nouvelles inscriptions</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                  itemStyle={{ color: '#F3F4F6' }}
                  cursor={{ fill: '#374151', opacity: 0.1 }}
                />
                <Bar dataKey="inscrits" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
