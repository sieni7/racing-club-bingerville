import React from 'react';

interface StatutBadgeProps {
  statut: 'ACTIF' | 'BLESSE' | 'SUSPENDU' | 'INACTIF' | string;
}

export const StatutBadge: React.FC<StatutBadgeProps> = ({ statut }) => {
  let colorClass = '';
  
  switch (statut) {
    case 'ACTIF':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'BLESSE':
      colorClass = 'bg-red-100 text-red-800';
      break;
    case 'SUSPENDU':
      colorClass = 'bg-orange-100 text-orange-800';
      break;
    case 'INACTIF':
      colorClass = 'bg-gray-100 text-gray-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {statut}
    </span>
  );
};
