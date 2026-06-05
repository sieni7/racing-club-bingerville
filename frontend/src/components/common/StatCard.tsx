import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
        </div>
        {icon && <div className="p-3 bg-blue-50 rounded-full text-blue-600">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-4">
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">depuis le mois dernier</span>
        </div>
      )}
    </div>
  );
};
