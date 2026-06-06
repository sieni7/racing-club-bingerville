import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { matchsService } from '../features/matchs/matchsService';
import { actualitesService } from '../features/actualites/actualitesService';
import { statistiquesService } from '../features/statistiques/statistiquesService';
import { joueursService } from '../features/joueurs/joueursService';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Trophy, Users, FileText } from 'lucide-react';
export default function Dashboard() {
    const { user } = useAuth();
    const [prochainMatch, setProchainMatch] = useState(null);
    const [dernierMatch, setDernierMatch] = useState(null);
    const [topButeurs, setTopButeurs] = useState([]);
    const [dernieresActus, setDernieresActus] = useState([]);
    const [joueursActifsCount, setJoueursActifsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [matchs, buteurs, actus, joueurs] = await Promise.all([
                    matchsService.getAll(),
                    statistiquesService.getTopButeurs(),
                    actualitesService.getLatest(3),
                    joueursService.getAll()
                ]);
                const aVenir = matchs.filter(m => m.statut === 'A_VENIR').sort((a, b) => new Date(a.date_heure).getTime() - new Date(b.date_heure).getTime());
                const termines = matchs.filter(m => m.statut === 'TERMINE').sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());
                if (aVenir.length > 0)
                    setProchainMatch(aVenir[0]);
                if (termines.length > 0)
                    setDernierMatch(termines[0]);
                setTopButeurs(buteurs.slice(0, 3));
                setDernieresActus(actus);
                setJoueursActifsCount(joueurs.filter(j => j.statut === 'ACTIF').length);
            }
            catch (error) {
                console.error(error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    if (isLoading)
        return _jsx("div", { className: "text-center py-10", children: "Chargement du tableau de bord..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Bienvenue, ", user?.prenom, " \uD83D\uDC4B"] }), _jsx("p", { className: "text-gray-600 mt-2", children: "Voici le r\u00E9sum\u00E9 des activit\u00E9s du Racing Club de Bingerville." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4", children: [_jsx("div", { className: "p-3 bg-blue-100 text-blue-600 rounded-full", children: _jsx(Users, { size: 24 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 font-medium", children: "Joueurs Actifs" }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: joueursActifsCount })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Calendar, { size: 20, className: "text-blue-500" }), _jsx("h2", { className: "font-bold text-gray-900", children: "Prochain Match" })] }), prochainMatch ? (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-semibold text-lg", children: prochainMatch.lieu === 'DOMICILE' ? 'Racing CB' : prochainMatch.adversaire }), _jsx("span", { className: "bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600", children: "VS" }), _jsx("span", { className: "font-semibold text-lg", children: prochainMatch.lieu === 'DOMICILE' ? prochainMatch.adversaire : 'Racing CB' })] }), _jsxs("div", { className: "mt-4 text-sm text-gray-500 flex justify-between", children: [_jsx("span", { children: format(new Date(prochainMatch.date_heure), 'dd MMMM yyyy HH:mm', { locale: fr }) }), _jsx("span", { children: prochainMatch.competition })] })] })) : (_jsx("p", { className: "text-gray-500 italic", children: "Aucun match planifi\u00E9" }))] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Trophy, { size: 20, className: "text-yellow-500" }), _jsx("h2", { className: "font-bold text-gray-900", children: "Dernier R\u00E9sultat" })] }), dernierMatch ? (_jsxs("div", { className: "text-center", children: [_jsxs("p", { className: "text-sm font-medium text-gray-600 mb-2", children: ["vs ", dernierMatch.adversaire] }), _jsxs("div", { className: "text-3xl font-black text-gray-800", children: [dernierMatch.score_equipe, " - ", dernierMatch.score_adversaire] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: format(new Date(dernierMatch.date_heure), 'dd/MM/yyyy') })] })) : (_jsx("p", { className: "text-gray-500 italic", children: "Aucun r\u00E9sultat" }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { size: 20, className: "text-indigo-500" }), _jsx("h2", { className: "font-bold text-gray-900 text-lg", children: "Derni\u00E8res Actualit\u00E9s" })] }), _jsx(Link, { to: "/actualites", className: "text-sm text-blue-600 hover:underline", children: "Tout voir" })] }), _jsx("div", { className: "space-y-4", children: dernieresActus.length > 0 ? dernieresActus.map(actu => (_jsxs("div", { className: "border-b pb-4 last:border-0 last:pb-0", children: [_jsx(Link, { to: `/actualites/${actu.slug}`, className: "hover:text-blue-600 font-semibold block mb-1", children: actu.titre }), _jsxs("div", { className: "flex items-center text-xs text-gray-500 gap-2", children: [_jsx("span", { children: format(new Date(actu.published_at), 'dd MMM yyyy', { locale: fr }) }), actu.statut === 'BROUILLON' && _jsx("span", { className: "text-orange-500 bg-orange-100 px-2 rounded-full", children: "Brouillon" })] })] }, actu.id))) : (_jsx("p", { className: "text-gray-500 italic", children: "Aucune actualit\u00E9 publi\u00E9e" })) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "font-bold text-gray-900 text-lg", children: "Top Buteurs" }), _jsx(Link, { to: "/statistiques", className: "text-sm text-blue-600 hover:underline", children: "D\u00E9tails" })] }), _jsx("div", { className: "space-y-4", children: topButeurs.length > 0 ? topButeurs.map((buteur, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}`, children: index + 1 }), _jsxs("span", { className: "font-medium", children: [buteur.prenom, " ", buteur.nom] })] }), _jsxs("span", { className: "font-bold text-blue-600", children: [buteur.buts, " \u26BD"] })] }, buteur.joueur_id))) : (_jsx("p", { className: "text-gray-500 italic", children: "Aucun buteur" })) })] })] })] }));
}
