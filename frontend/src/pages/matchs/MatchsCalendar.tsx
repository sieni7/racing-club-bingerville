import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Match, matchsService } from '../../features/matchs/matchsService';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { List, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function MatchsCalendar() {
  const [matchs, setMatchs] = useState<Match[]>([]);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  useEffect(() => {
    matchsService.getAll().then(setMatchs).catch(console.error);
  }, []);

  const events = matchs.map(match => ({
    id: match.id,
    title: match.lieu === 'DOMICILE' ? `Racing CB vs ${match.adversaire}` : `${match.adversaire} vs Racing CB`,
    start: new Date(match.date_heure),
    end: new Date(new Date(match.date_heure).getTime() + 2 * 60 * 60 * 1000), // approx 2 hours
    resource: match
  }));

  const onSelectEvent = (event: any) => {
    if (isAdmin) {
      navigate(`/matchs/${event.id}/editer`);
    } else {
      // Just show details or do nothing for public users
      // navigate(`/matchs/${event.id}`); if there was a public detail page
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0E17] flex flex-col">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-200 dark:border-white/5 flex-shrink-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Saison 2026</span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <CalendarIcon className="w-10 h-10 text-primary" /> Calendrier des Matchs
              </h1>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/matchs">
                <Button variant="secondary" className="flex items-center gap-2 bg-white dark:bg-gray-800 shadow-sm"><List size={18} /> Vue Liste</Button>
              </Link>
              {isAdmin && (
                <Link to="/matchs/nouveau">
                  <Button className="flex items-center gap-2 shadow-glow"><Plus size={18} /> Nouveau match</Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-soft flex-grow border border-gray-100 dark:border-gray-800"
        >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="fr"
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
          }}
          onSelectEvent={onSelectEvent}
          eventPropGetter={(event) => {
            const match = event.resource as Match;
            let backgroundColor = '#3b82f6'; // CHAMPIONNAT (blue)
            if (match.competition === 'COUPE') backgroundColor = '#ef4444'; // red
            if (match.competition === 'AMICAL') backgroundColor = '#10b981'; // green
            
            return { style: { backgroundColor } };
          }}
        />
        </motion.div>
      </div>
    </div>
  );
}

