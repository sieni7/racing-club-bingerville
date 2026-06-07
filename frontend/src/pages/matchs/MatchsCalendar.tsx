import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Match, matchsService } from '../../features/matchs/matchsService';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { List, Plus } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendrier des Matchs</h1>
        <div className="flex gap-2">
          <Link to="/matchs">
            <Button variant="secondary" className="flex items-center gap-2"><List size={16} /> Vue Liste</Button>
          </Link>
          {isAdmin && (
            <Link to="/matchs/nouveau">
              <Button className="flex items-center gap-2"><Plus size={16} /> Nouveau match</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex-grow">
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
      </div>
    </div>
  );
}

