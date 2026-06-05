import React from 'react';
import { StatCard } from '../components/common/StatCard';
import { useGetGlobalStatsQuery } from '../features/api/statsApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { data, isLoading } = useGetGlobalStatsQuery(undefined);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Joueurs Actifs" value={data?.data?.activePlayers || 0} trend={{ value: 5, isPositive: true }} />
        <StatCard title="Matchs Joués" value={data?.data?.matchesPlayed || 0} />
        <StatCard title="Victoires" value={data?.data?.wins || 0} trend={{ value: 2, isPositive: true }} />
      </div>
    </div>
  );
};

export default Dashboard;
