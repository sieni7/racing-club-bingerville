import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Match, matchsService } from '../../features/matchs/matchsService';
import CompositionTab from '../../components/matchs/CompositionTab';
import EvenementsTab from '../../components/matchs/EvenementsTab';
import { Button } from '../../components/ui/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { feuilleMatchService } from '../../features/matchs/feuilleMatchService';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MatchPDF } from '../../components/matchs/MatchPDF';
import { Download } from 'lucide-react';

export default function MatchFeuille() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [compositions, setCompositions] = useState<any[]>([]);
  const [evenements, setEvenements] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'RESUME' | 'COMPOSITION' | 'EVENEMENTS'>('RESUME');

  useEffect(() => {
    if (id) {
      matchsService.getById(id).then(setMatch).catch(console.error);
      feuilleMatchService.getCompositionByMatch(id).then(setCompositions).catch(console.error);
      feuilleMatchService.getEvenementsByMatch(id).then(setEvenements).catch(console.error);
    }
  }, [id]);

  if (!match) return <div>Chargement...</div>;

  const titulaires = compositions.filter(c => c.statut === 'TITULAIRE').map(c => ({
    id: c.id,
    numero: c.joueurs?.numero,
    nom: c.joueurs?.nom,
    prenom: c.joueurs?.prenom,
    composition_role: 'Titulaire'
  }));
  
  const remplacants = compositions.filter(c => c.statut === 'REMPLACANT').map(c => ({
    id: c.id,
    numero: c.joueurs?.numero,
    nom: c.joueurs?.nom,
    prenom: c.joueurs?.prenom,
    composition_role: 'Remplaçant'
  }));

  const events = evenements.map(e => ({
    minute: e.minute,
    joueur_nom: e.joueurs ? `${e.joueurs.prenom} ${e.joueurs.nom}` : '',
    type_evenement: e.type_evenement
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Feuille de match</h1>
          <p className="text-gray-500">
            {match.lieu === 'DOMICILE' ? `Racing CB vs ${match.adversaire}` : `${match.adversaire} vs Racing CB`} - 
            {format(new Date(match.date_heure), ' dd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PDFDownloadLink
            document={<MatchPDF match={match} titulaires={titulaires} remplacants={remplacants} events={events} />}
            fileName={`feuille-match-${match.adversaire}-${new Date(match.date_heure).toISOString().split('T')[0]}.pdf`}
          >
            {({ loading }) => (
              <Button variant="secondary" disabled={loading} className="flex items-center">
                <Download size={16} className="mr-2" />
                {loading ? 'Préparation...' : 'Exporter PDF'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button variant="secondary" onClick={() => navigate('/matchs')}>Retour</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'RESUME' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('RESUME')}
          >
            Résumé
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'COMPOSITION' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('COMPOSITION')}
          >
            Composition
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'EVENEMENTS' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('EVENEMENTS')}
          >
            Événements
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'RESUME' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Détails de la rencontre</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="font-medium">Adversaire :</span> {match.adversaire}</div>
                <div><span className="font-medium">Lieu :</span> {match.lieu}</div>
                <div><span className="font-medium">Compétition :</span> {match.competition}</div>
                <div><span className="font-medium">Statut :</span> {match.statut.replace('_', ' ')}</div>
                {match.statut === 'TERMINE' && (
                  <div className="col-span-2 text-center text-3xl font-bold py-4">
                    {match.score_equipe} - {match.score_adversaire}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'COMPOSITION' && <CompositionTab matchId={match.id} />}
          {activeTab === 'EVENEMENTS' && <EvenementsTab matchId={match.id} />}
        </div>
      </div>
    </div>
  );
}

