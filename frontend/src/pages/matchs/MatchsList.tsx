import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Match, matchsService } from '../../features/matchs/matchsService';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit, Trash2, Calendar, ClipboardList, Clock, CheckCircle2, PlayCircle, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';

export default function MatchsList() {
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMatchs();
  }, []);

  const loadMatchs = async () => {
    try {
      const data = await matchsService.getAll();
      setMatchs(data.sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime()));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
      await matchsService.delete(id);
      loadMatchs();
    }
  };

  if (isLoading) return <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

  const aVenir = matchs.filter(m => m.statut === 'A_VENIR').reverse(); // Chronological for future
  const enCours = matchs.filter(m => m.statut === 'EN_COURS');
  const termines = matchs.filter(m => m.statut === 'TERMINE');

  const renderMatchCard = (match: Match) => {
    const isRacingHome = match.lieu === 'DOMICILE';
    const win = (match.score_equipe || 0) > (match.score_adversaire || 0);
    const draw = (match.score_equipe || 0) === (match.score_adversaire || 0);
    
    // Fake momentum calculation for UI
    const momentumValue = match.statut === 'EN_COURS' ? 65 : (win ? 70 : draw ? 50 : 30);
    
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={match.id} className="relative pl-8 md:pl-0">
        {/* Desktop Timeline Node */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background z-10" />
        
        {/* Mobile Timeline Node */}
        <div className="md:hidden absolute left-0 -translate-y-1/2 top-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10" />

        <div className={`md:w-1/2 ${isRacingHome ? 'md:pr-12 md:ml-auto md:text-left' : 'md:pl-12 md:mr-auto md:text-right'}`}>
          <Card className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between group overflow-hidden relative">
            {/* Momentum Bar Background */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/5">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${momentumValue}%` }} 
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full ${momentumValue > 50 ? 'bg-accent-success' : momentumValue < 50 ? 'bg-accent-danger' : 'bg-accent-warning'}`}
              />
            </div>

            <div className="flex-1 flex flex-col items-center md:items-start w-full">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={match.statut === 'TERMINE' ? 'secondary' : match.statut === 'A_VENIR' ? 'primary' : 'warning'} className="text-[10px]">
                  {match.statut.replace('_', ' ')}
                </Badge>
                <span className="text-xs text-content-muted">{format(new Date(match.date_heure), 'dd MMM yyyy HH:mm', { locale: fr })}</span>
              </div>
              
              <div className="flex items-center justify-between w-full gap-4 my-2">
                <span className={`font-bold ${isRacingHome ? 'text-gray-900 dark:text-white' : 'text-content-muted'}`}>Racing CB</span>
                
                {match.statut === 'TERMINE' || match.statut === 'EN_COURS' ? (
                  <div className="bg-background px-3 py-1 rounded-md border border-white/10 font-black text-lg text-primary-light">
                    {match.score_equipe} - {match.score_adversaire}
                  </div>
                ) : (
                  <span className="bg-white/5 px-2 py-1 rounded text-xs font-bold text-content-muted">VS</span>
                )}
                
                <span className={`font-bold ${!isRacingHome ? 'text-gray-900 dark:text-white' : 'text-content-muted'}`}>{match.adversaire}</span>
              </div>
              
              <div className="text-xs text-content-muted font-medium uppercase tracking-wider">{match.competition}</div>
            </div>

            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <Link to={`/matchs/${match.id}/feuille`} className="p-2 bg-white/5 hover:bg-primary hover:text-gray-900 dark:text-white rounded-lg transition text-content-muted"><ClipboardList size={18} /></Link>
              <Link to={`/matchs/${match.id}/editer`} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition text-content-muted"><Edit size={18} /></Link>
              <button onClick={() => handleDelete(match.id)} className="p-2 bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger rounded-lg transition"><Trash2 size={18} /></button>
            </div>
          </Card>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Matchs & Calendrier</h1>
          <p className="text-content-muted mt-1">Suivez l'historique et planifiez les prochaines rencontres.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/matchs/calendrier">
            <Button variant="secondary" className="flex items-center gap-2"><Calendar size={18} /> Vue Calendrier</Button>
          </Link>
          <Link to="/matchs/nouveau">
            <Button className="flex items-center gap-2"><Plus size={18} /> Nouveau match</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-1/2 ml-1.5 md:ml-0" />

        <div className="space-y-12">
          {/* A VENIR */}
          {aVenir.length > 0 && (
            <div className="relative">
              <div className="flex justify-center md:justify-center mb-6 pl-8 md:pl-0">
                <Badge variant="primary" className="flex items-center gap-2 px-4 py-1.5 shadow-glow z-10"><Clock size={14} /> À VENIR</Badge>
              </div>
              <div className="space-y-6">
                {aVenir.map(renderMatchCard)}
              </div>
            </div>
          )}

          {/* EN COURS */}
          {enCours.length > 0 && (
            <div className="relative">
              <div className="flex justify-center md:justify-center mb-6 pl-8 md:pl-0">
                <Badge variant="warning" className="flex items-center gap-2 px-4 py-1.5 shadow-glow animate-pulse z-10"><PlayCircle size={14} /> EN COURS</Badge>
              </div>
              <div className="space-y-6">
                {enCours.map(renderMatchCard)}
              </div>
            </div>
          )}

          {/* TERMINÉS */}
          {termines.length > 0 && (
            <div className="relative">
              <div className="flex justify-center md:justify-center mb-6 pl-8 md:pl-0">
                <Badge variant="secondary" className="flex items-center gap-2 px-4 py-1.5 z-10"><CheckCircle2 size={14} /> TERMINÉS</Badge>
              </div>
              <div className="space-y-6">
                {termines.map(renderMatchCard)}
              </div>
            </div>
          )}
          
          {matchs.length === 0 && (
            <div className="text-center py-12 text-content-muted">
              Aucun match enregistré.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
