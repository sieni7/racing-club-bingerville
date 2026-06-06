import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchsService } from '../../features/matchs/matchsService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export default function MatchsList() {
    const [matchs, setMatchs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        loadMatchs();
    }, []);
    const loadMatchs = async () => {
        try {
            const data = await matchsService.getAll();
            setMatchs(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
            await matchsService.delete(id);
            loadMatchs();
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Liste des Matchs" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/matchs/calendrier", children: _jsxs(Button, { variant: "secondary", className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 16 }), " Vue Calendrier"] }) }), _jsx(Link, { to: "/matchs/nouveau", children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Nouveau match"] }) })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Date" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Rencontre" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Comp\u00E9tition" }), _jsx("th", { className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase", children: "Score" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsxs("tbody", { className: "bg-white divide-y divide-gray-200", children: [matchs.map((match) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: format(new Date(match.date_heure), 'dd MMM yyyy HH:mm', { locale: fr }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: match.lieu === 'DOMICILE' ? (_jsxs("span", { children: ["Racing CB vs ", match.adversaire] })) : match.lieu === 'EXTERIEUR' ? (_jsxs("span", { children: [match.adversaire, " vs Racing CB"] })) : (_jsxs("span", { children: ["Racing CB vs ", match.adversaire, " (N)"] })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: match.competition }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-center text-sm font-bold", children: match.statut === 'TERMINE' ? `${match.score_equipe ?? '-'} : ${match.score_adversaire ?? '-'}` : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${match.statut === 'TERMINE' ? 'bg-gray-100 text-gray-800' : match.statut === 'A_VENIR' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`, children: match.statut.replace('_', ' ') }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/matchs/${match.id}/feuille`, className: "text-blue-600 hover:text-blue-900", title: "Feuille de match", children: _jsx(ClipboardList, { size: 18 }) }), _jsx(Link, { to: `/matchs/${match.id}/editer`, className: "text-indigo-600 hover:text-indigo-900", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(match.id), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { size: 18 }) })] }) })] }, match.id))), matchs.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-4 text-center text-gray-500", children: "Aucun match trouv\u00E9" }) }))] })] }) })] }));
}
