import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMatchByIdQuery, useUpdateCompositionMutation, useAddMatchEventMutation } from '../features/api/matchsApi';
import { useGetJoueursQuery } from '../features/api/joueursApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CompositionForm } from '../components/Matchs/CompositionForm';
import { MatchEventForm } from '../components/Matchs/MatchEventForm';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const MatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: match, isLoading, isError } = useGetMatchByIdQuery(id);
  const { data: joueurs } = useGetJoueursQuery({});
  
  const [updateComposition, { isLoading: isUpdatingComp }] = useUpdateCompositionMutation();
  const [addMatchEvent, { isLoading: isAddingEvent }] = useAddMatchEventMutation();

  const [activeTab, setActiveTab] = useState<'INFOS' | 'COMPOSITION' | 'EVENEMENTS'>('INFOS');
  
  const isStaffOrAdmin = user?.role === 'STAFF' || user?.role === 'ADMIN';

  const handleUpdateComposition = async (composition: any[]) => {
    try {
      await updateComposition({ id, composition }).unwrap();
      toast.success('Composition mise à jour');
    } catch (err: any) {
      toast.error(err.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleAddEvent = async (event: any) => {
    try {
      await addMatchEvent({ id, event }).unwrap();
      toast.success('Événement ajouté');
    } catch (err: any) {
      toast.error(err.data?.message || 'Erreur lors de l\'ajout');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !match) return <div className="text-red-600">Match introuvable.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/calendrier')} className="text-blue-600 hover:text-blue-800">
          &larr; Retour au calendrier
        </button>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Racing Club vs {match.adversaire}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {new Date(match.date).toLocaleString()} - {match.lieu}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">
              {match.scoreRacing} - {match.scoreAdversaire}
            </span>
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {match.statut}
            </span>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('INFOS')}
              className={`${activeTab === 'INFOS' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab('COMPOSITION')}
              className={`${activeTab === 'COMPOSITION' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Composition
            </button>
            <button
              onClick={() => setActiveTab('EVENEMENTS')}
              className={`${activeTab === 'EVENEMENTS' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Événements
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'INFOS' && (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Saison</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.saison}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Adversaire</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.adversaire}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lieu</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.lieu}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1 text-sm text-gray-900">{match.statut}</dd>
              </div>
            </dl>
          )}

          {activeTab === 'COMPOSITION' && (
            <div>
              <h4 className="text-md font-medium mb-4">Équipe Titulaire et Remplaçants</h4>
              
              {isStaffOrAdmin ? (
                <CompositionForm 
                  initialComposition={match.composition}
                  onSubmit={handleUpdateComposition}
                  isLoading={isUpdatingComp}
                />
              ) : (
                <ul className="divide-y divide-gray-200 border-t border-b mb-6">
                  {match.composition?.map((comp: any) => {
                    const joueur = joueurs?.find((j: any) => j._id === comp.joueurId);
                    return (
                      <li key={comp.joueurId} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-500 text-white font-bold mr-3">
                            {comp.numero}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{joueur ? `${joueur.nom} ${joueur.prenom}` : 'Joueur inconnu'}</p>
                            <p className="text-xs text-gray-500">{comp.role} - {comp.poste}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  {!match.composition?.length && <li className="py-4 text-center text-gray-500 text-sm">Composition non renseignée.</li>}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'EVENEMENTS' && (
            <div>
              <h4 className="text-md font-medium mb-4">Fil du match</h4>
              
              <ul className="divide-y divide-gray-200 border-t border-b mb-8">
                {match.evenements?.map((event: any, idx: number) => {
                  const joueur = joueurs?.find((j: any) => j._id === event.joueurId);
                  return (
                    <li key={idx} className="py-3 flex items-center">
                      <span className="text-sm font-bold text-gray-900 w-12">{event.minute}'</span>
                      <span className="text-sm text-gray-900 w-32">{event.type}</span>
                      <span className="text-sm font-medium text-gray-900 flex-grow">
                        {joueur ? `${joueur.nom} ${joueur.prenom}` : 'Inconnu'}
                      </span>
                      {event.details && <span className="text-sm text-gray-500 italic">({event.details})</span>}
                    </li>
                  );
                })}
                {!match.evenements?.length && <li className="py-4 text-center text-gray-500 text-sm">Aucun événement enregistré.</li>}
              </ul>

              {isStaffOrAdmin && (
                <MatchEventForm 
                  composition={match.composition}
                  joueurs={joueurs || []}
                  onSubmit={handleAddEvent}
                  isLoading={isAddingEvent}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
