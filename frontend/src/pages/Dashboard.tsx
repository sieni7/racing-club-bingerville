import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { matchsService, Match } from '../features/matchs/matchsService';
import { statistiquesService, StatJoueur } from '../features/statistiques/statistiquesService';
import { joueursService, Joueur } from '../features/joueurs/joueursService';
import { Link } from 'react-router-dom';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Trophy, Users, FileText, ArrowRight, BrainCircuit, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { generateInsights, Insight } from '../features/insights/insightEngine';
import { TooltipHelper } from '../components/common/TooltipHelper';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
export default function Dashboard() {
  const { user } = useAuth();
  const [prochainMatch, setProchainMatch] = useState<Match | null>(null);
  const [dernierMatch, setDernierMatch] = useState<Match | null>(null);
  const [topButeurs, setTopButeurs] = useState<StatJoueur[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [matchsSemaine, setMatchsSemaine] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matchs, buteurs, joueurs] = await Promise.all([
          matchsService.getAll(),
          statistiquesService.getTopButeurs(),
          joueursService.getAll()
        ]);

        const aVenir = matchs.filter(m => m.statut === 'A_VENIR').sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
        const termines = matchs.filter(m => m.statut === 'TERMINE').sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());

        if (aVenir.length > 0) setProchainMatch(aVenir[0]);
        if (termines.length > 0) setDernierMatch(termines[0]);
        
        setTopButeurs(buteurs.slice(0, 3));
        
        // Insights
        setInsights(generateInsights(matchs, joueurs, buteurs));

        // Timeline Semaine
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const weekMatches = matchs.filter(m => {
          const mDate = new Date(m.date_heure);
          return mDate >= start && mDate <= addDays(start, 6);
        });
        setMatchsSemaine(weekMatches);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-20">
        <div className="md:col-span-3">
          <SkeletonLoader type="card" count={1} />
        </div>
        <div className="md:col-span-2">
          <SkeletonLoader type="card" count={1} />
        </div>
        <div className="md:col-span-1">
          <SkeletonLoader type="card" count={1} />
        </div>
        <div className="md:col-span-3">
          <SkeletonLoader type="card" count={1} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900 dark:text-white">Bienvenue, {user?.user_metadata?.prenom} 👋</h1>
          <p className="text-gray-600 dark:text-content-muted mt-2">Vue d'ensemble de la performance (Sport Intelligence).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Hero Card : Prochain Match */}
        <Card className="p-0 overflow-hidden md:col-span-3 border-l-4 border-l-primary relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={120} />
          </div>
          <div className="p-8 relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="success" className="animate-pulse">PROCHAIN MATCH</Badge>
              {prochainMatch && <span className="text-sm text-content-muted font-medium">{format(new Date(prochainMatch.date_heure), 'EEEE dd MMMM - HH:mm', { locale: fr })}</span>}
            </div>
            
            {prochainMatch ? (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    <span className={prochainMatch.lieu === 'DOMICILE' ? 'text-gray-900 dark:text-white' : 'text-content-muted'}>{prochainMatch.lieu === 'DOMICILE' ? 'Racing CB' : prochainMatch.adversaire}</span>
                    <span className="text-xl text-primary font-bold">VS</span>
                    <span className={prochainMatch.lieu === 'EXTERIEUR' ? 'text-gray-900 dark:text-white' : 'text-content-muted'}>{prochainMatch.lieu === 'EXTERIEUR' ? 'Racing CB' : prochainMatch.adversaire}</span>
                  </div>
                  <div className="mt-3 text-content-muted flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{prochainMatch.competition} - {prochainMatch.lieu === 'DOMICILE' ? 'Domicile' : 'Extérieur'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/matchs/${prochainMatch.id}/feuille`} className="bg-primary text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition shadow-glow">
                    Préparer la composition
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-content-muted italic">Aucun match planifié pour le moment.</p>
            )}
          </div>
        </Card>

        {/* Dernier Résultat */}
        <Card className="p-6 md:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-accent-info" />
            <h2 className="font-bold text-gray-900 dark:text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center">
              Dernier Résultat
              <TooltipHelper id="tt-dernier-resultat" content="Le résultat du dernier match joué par l'équipe" />
            </h2>
          </div>
          {dernierMatch ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-content-muted mb-1">{dernierMatch.competition}</p>
                <div className="flex items-center gap-3 text-2xl font-black text-gray-900 dark:text-white">
                  <span>{dernierMatch.lieu === 'DOMICILE' ? 'Racing CB' : dernierMatch.adversaire}</span>
                  <span className="bg-white/10 px-4 py-1 rounded-md text-primary-light border border-white/10">
                    {dernierMatch.lieu === 'DOMICILE' ? dernierMatch.score_equipe : dernierMatch.score_adversaire} - {dernierMatch.lieu === 'DOMICILE' ? dernierMatch.score_adversaire : dernierMatch.score_equipe}
                  </span>
                  <span>{dernierMatch.lieu === 'EXTERIEUR' ? 'Racing CB' : dernierMatch.adversaire}</span>
                </div>
                <p className="text-xs text-content-muted mt-3">{format(new Date(dernierMatch.date_heure), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
              <Badge variant={(dernierMatch.score_equipe || 0) > (dernierMatch.score_adversaire || 0) ? 'success' : (dernierMatch.score_equipe || 0) < (dernierMatch.score_adversaire || 0) ? 'danger' : 'warning'}>
                {(dernierMatch.score_equipe || 0) > (dernierMatch.score_adversaire || 0) ? 'VICTOIRE' : (dernierMatch.score_equipe || 0) < (dernierMatch.score_adversaire || 0) ? 'DÉFAITE' : 'NUL'}
              </Badge>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Aucun résultat récent</p>
          )}
        </Card>

        {/* Top 3 Joueurs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 dark:text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
              <Trophy size={16} className="text-secondary" /> Top Joueurs
              <TooltipHelper id="tt-top-joueurs" content="Classement basé sur le nombre de buts marqués" />
            </h2>
            <Link to="/statistiques" className="text-xs text-primary hover:underline">Détails</Link>
          </div>
          <div className="space-y-4">
            {topButeurs.length > 0 ? topButeurs.map((buteur, index) => (
              <div key={buteur.joueur_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-secondary text-gray-900 dark:text-white shadow-glow' : index === 1 ? 'bg-gray-300 text-gray-800' : 'bg-orange-200 text-orange-800'}`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <span className="font-medium text-sm dark:text-gray-200">{buteur.prenom} {buteur.nom}</span>
                </div>
                <span className="font-bold text-primary dark:text-primary-light text-sm">{buteur.buts} ⚽</span>
              </div>
            )) : (
              <p className="text-content-muted italic text-sm">Aucun buteur</p>
            )}
          </div>
        </Card>

        {/* Insights Automatiques */}
        <Card className="p-6 md:col-span-3 bg-gradient-to-br from-background-card to-background">
          <div className="flex items-center gap-2 mb-6">
            <BrainCircuit size={20} className="text-purple-500" />
            <h2 className="font-bold text-gray-900 dark:text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center">
              Intelligence & Insights
              <TooltipHelper id="tt-insights" content="Analyse automatique des performances et tendances de l'équipe" />
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map(insight => (
              <motion.div 
                key={insight.id} 
                whileHover={{ y: -2 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="text-2xl">{insight.icon}</div>
                <div>
                  <h3 className={`font-semibold text-sm ${insight.type === 'positive' ? 'text-accent-success' : insight.type === 'negative' ? 'text-accent-danger' : insight.type === 'warning' ? 'text-accent-warning' : 'text-accent-info'}`}>
                    {insight.title}
                  </h3>
                  <p className="text-xs text-content-muted mt-1 leading-relaxed">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
        
        {/* Timeline Semaine */}
        <Card className="p-6 md:col-span-3">
          <div className="flex items-center gap-2 mb-6">
            <Calendar size={20} className="text-content-muted" />
            <h2 className="font-bold text-gray-900 dark:text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center">
              Timeline de la Semaine
              <TooltipHelper id="tt-timeline" content="Calendrier des matchs prévus cette semaine" />
            </h2>
          </div>
          
          <div className="flex justify-between items-stretch gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
              const matchForDay = matchsSemaine.find(m => format(new Date(m.date_heure), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
              const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
              
              return (
                <div key={i} className={`flex-1 min-w-[100px] flex flex-col items-center p-3 rounded-lg border ${isToday ? 'bg-primary/20 border-primary' : 'bg-white/5 border-white/5'} ${matchForDay ? 'border-accent-info/50 shadow-glow' : ''}`}>
                  <span className="text-xs text-content-muted uppercase font-semibold">{format(day, 'EEE', { locale: fr })}</span>
                  <span className={`text-lg font-black ${isToday ? 'text-primary-light' : 'text-gray-900 dark:text-white'}`}>{format(day, 'dd')}</span>
                  
                  <div className="mt-4 flex-grow flex flex-col justify-end w-full">
                    {matchForDay ? (
                      <div className="bg-accent-info/20 text-accent-info text-[10px] p-2 rounded text-center border border-accent-info/30 leading-tight">
                        <span className="font-bold block mb-1">{format(new Date(matchForDay.date_heure), 'HH:mm')}</span>
                        {matchForDay.adversaire}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

      </div>
    </div>
  );
}

