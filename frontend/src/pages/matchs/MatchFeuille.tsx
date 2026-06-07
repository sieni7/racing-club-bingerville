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
import { Download, ArrowLeft, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

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

  if (!match) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex flex-col">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5 flex-shrink-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <button onClick={() => navigate('/matchs')} className="inline-flex items-center text-primary hover:text-primary-light mb-6 transition font-medium">
            <ArrowLeft size={16} className="mr-2" /> Retour aux matchs
          </button>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Détails de la Rencontre</span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3 mb-2">
                <ClipboardList className="text-primary w-8 h-8" /> Feuille de match
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
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
                  <Button variant="secondary" disabled={loading} className="flex items-center bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                    <Download size={18} className="mr-2 text-primary" />
                    {loading ? 'Préparation...' : 'Exporter PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-grow flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden flex-grow border border-gray-100 dark:border-gray-800"
        >
          {/* Glassmorphism Tabs */}
          <div className="flex overflow-x-auto bg-gray-50/50 dark:bg-black/20 border-b border-gray-200 dark:border-white/5 p-2 gap-2">
            <button 
              className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'RESUME' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-200 dark:border-white/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'}`}
              onClick={() => setActiveTab('RESUME')}
            >
              Résumé
            </button>
            <button 
              className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'COMPOSITION' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-200 dark:border-white/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'}`}
              onClick={() => setActiveTab('COMPOSITION')}
            >
              Composition
            </button>
            <button 
              className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'EVENEMENTS' ? 'bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-200 dark:border-white/10' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'}`}
              onClick={() => setActiveTab('EVENEMENTS')}
            >
              Événements
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'RESUME' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">Détails de la rencontre</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5"><span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Adversaire</span> <span className="font-bold text-gray-900 dark:text-white text-lg">{match.adversaire}</span></div>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5"><span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Lieu</span> <span className="font-bold text-gray-900 dark:text-white text-lg">{match.lieu}</span></div>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5"><span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Compétition</span> <span className="font-bold text-gray-900 dark:text-white text-lg">{match.competition}</span></div>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5"><span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Statut</span> <span className="font-bold text-gray-900 dark:text-white text-lg">{match.statut.replace('_', ' ')}</span></div>
                  {match.statut === 'TERMINE' && (
                    <div className="col-span-1 md:col-span-2 text-center bg-primary/10 border border-primary/20 rounded-xl py-8 mt-4">
                      <span className="block text-sm text-primary font-bold tracking-widest uppercase mb-2">Score Final</span>
                      <div className="text-5xl font-black text-gray-900 dark:text-white">
                        {match.score_equipe} <span className="text-primary/50 mx-4">-</span> {match.score_adversaire}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'COMPOSITION' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CompositionTab matchId={match.id} />
              </div>
            )}
            {activeTab === 'EVENEMENTS' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <EvenementsTab matchId={match.id} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

