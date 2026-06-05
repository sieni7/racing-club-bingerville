import React from 'react';
import { Link } from 'react-router-dom';
import { StatutBadge } from './StatutBadge';

interface JoueurTableRowProps {
  joueur: any;
  onEdit: (joueur: any) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
}

export const JoueurTableRow: React.FC<JoueurTableRowProps> = ({ joueur, onEdit, onDelete, canEdit }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              <Link to={`/joueurs/${joueur._id}`} className="hover:text-blue-600">
                {joueur.nom} {joueur.prenom}
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              Licence: {joueur.numeroLicence}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{joueur.poste}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatutBadge statut={joueur.statut} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(joueur.dateNaissance).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link to={`/joueurs/${joueur._id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
          Détails
        </Link>
        {canEdit && (
          <>
            <button onClick={() => onEdit(joueur)} className="text-blue-600 hover:text-blue-900 mr-4">
              Modifier
            </button>
            <button onClick={() => onDelete(joueur._id)} className="text-red-600 hover:text-red-900">
              Supprimer
            </button>
          </>
        )}
      </td>
    </tr>
  );
};
