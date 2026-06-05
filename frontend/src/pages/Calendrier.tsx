import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useGetMatchsQuery } from '../features/api/matchsApi';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Calendrier: React.FC = () => {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const { data: matchs, isLoading } = useGetMatchsQuery({});
  const navigate = useNavigate();

  if (isLoading) return <LoadingSpinner />;

  const events = (matchs || []).map((match: any) => ({
    id: match._id,
    title: `vs ${match.adversaire} (${match.lieu})`,
    start: new Date(match.date),
    end: new Date(new Date(match.date).getTime() + 2 * 60 * 60 * 1000), // Approx 2 hours
    resource: match,
  }));

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    switch (event.resource.statut) {
      case 'PROGRAMME':
        backgroundColor = '#3b82f6'; // blue
        break;
      case 'EN_COURS':
        backgroundColor = '#f59e0b'; // amber
        break;
      case 'TERMINE':
        backgroundColor = '#10b981'; // green
        break;
      case 'REPORTE':
        backgroundColor = '#ef4444'; // red
        break;
    }
    return { style: { backgroundColor } };
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 h-[800px] flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Calendrier des Matchs</h1>
        <button 
          onClick={() => navigate('/matchs/nouveau')}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Programmer un match
        </button>
      </div>
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="fr"
          view={view}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => navigate(`/matchs/${event.id}`)}
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
          }}
        />
      </div>
    </div>
  );
};

export default Calendrier;
