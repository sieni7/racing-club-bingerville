import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { matchsService } from '../../features/matchs/matchsService';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
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
    const [matchs, setMatchs] = useState([]);
    const navigate = useNavigate();
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
    const onSelectEvent = (event) => {
        navigate(`/matchs/${event.id}/editer`);
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 h-screen flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Calendrier des Matchs" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/matchs", children: _jsxs(Button, { variant: "secondary", className: "flex items-center gap-2", children: [_jsx(List, { size: 16 }), " Vue Liste"] }) }), _jsx(Link, { to: "/matchs/nouveau", children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Nouveau match"] }) })] })] }), _jsx("div", { className: "bg-white p-4 rounded-lg shadow flex-grow", children: _jsx(Calendar, { localizer: localizer, events: events, startAccessor: "start", endAccessor: "end", style: { height: '100%' }, culture: "fr", messages: {
                        next: "Suivant",
                        previous: "Précédent",
                        today: "Aujourd'hui",
                        month: "Mois",
                        week: "Semaine",
                        day: "Jour",
                        agenda: "Agenda",
                    }, onSelectEvent: onSelectEvent, eventPropGetter: (event) => {
                        const match = event.resource;
                        let backgroundColor = '#3b82f6'; // blue (A_VENIR)
                        if (match.statut === 'TERMINE')
                            backgroundColor = '#6b7280'; // gray
                        if (match.statut === 'EN_COURS')
                            backgroundColor = '#eab308'; // yellow
                        if (match.statut === 'ANNULE')
                            backgroundColor = '#ef4444'; // red
                        return { style: { backgroundColor } };
                    } }) })] }));
}
