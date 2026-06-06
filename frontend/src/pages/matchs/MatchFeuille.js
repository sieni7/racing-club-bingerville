import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { matchsService } from '../../features/matchs/matchsService';
import CompositionTab from '../../components/matchs/CompositionTab';
import EvenementsTab from '../../components/matchs/EvenementsTab';
import { Button } from '../../components/common/Button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
export default function MatchFeuille() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [activeTab, setActiveTab] = useState('RESUME');
    useEffect(() => {
        if (id) {
            matchsService.getById(id).then(setMatch).catch(console.error);
        }
    }, [id]);
    if (!match)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-5xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Feuille de match" }), _jsxs("p", { className: "text-gray-500", children: [match.lieu === 'DOMICILE' ? `Racing CB vs ${match.adversaire}` : `${match.adversaire} vs Racing CB`, " -", format(new Date(match.date_heure), ' dd MMMM yyyy à HH:mm', { locale: fr })] })] }), _jsx(Button, { variant: "secondary", onClick: () => navigate('/matchs'), children: "Retour" })] }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsxs("div", { className: "flex border-b", children: [_jsx("button", { className: `px-6 py-3 font-medium text-sm ${activeTab === 'RESUME' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`, onClick: () => setActiveTab('RESUME'), children: "R\u00E9sum\u00E9" }), _jsx("button", { className: `px-6 py-3 font-medium text-sm ${activeTab === 'COMPOSITION' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`, onClick: () => setActiveTab('COMPOSITION'), children: "Composition" }), _jsx("button", { className: `px-6 py-3 font-medium text-sm ${activeTab === 'EVENEMENTS' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`, onClick: () => setActiveTab('EVENEMENTS'), children: "\u00C9v\u00E9nements" })] }), _jsxs("div", { className: "p-6", children: [activeTab === 'RESUME' && (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-xl font-semibold border-b pb-2", children: "D\u00E9tails de la rencontre" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Adversaire :" }), " ", match.adversaire] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Lieu :" }), " ", match.lieu] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Comp\u00E9tition :" }), " ", match.competition] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Statut :" }), " ", match.statut.replace('_', ' ')] }), match.statut === 'TERMINE' && (_jsxs("div", { className: "col-span-2 text-center text-3xl font-bold py-4", children: [match.score_equipe, " - ", match.score_adversaire] }))] })] })), activeTab === 'COMPOSITION' && _jsx(CompositionTab, { matchId: match.id }), activeTab === 'EVENEMENTS' && _jsx(EvenementsTab, { matchId: match.id })] })] })] }));
}
