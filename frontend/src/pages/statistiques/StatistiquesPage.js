import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { statistiquesService } from '../../features/statistiques/statistiquesService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export default function StatistiquesPage() {
    const [buteurs, setButeurs] = useState([]);
    const [passeurs, setPasseurs] = useState([]);
    const [discipline, setDiscipline] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            statistiquesService.getTopButeurs(),
            statistiquesService.getTopPasseurs(),
            statistiquesService.getTopDiscipline()
        ]).then(([b, p, d]) => {
            setButeurs(b);
            setPasseurs(p);
            setDiscipline(d);
            setIsLoading(false);
        }).catch(console.error);
    }, []);
    if (isLoading)
        return _jsx("div", { className: "text-center py-10", children: "Chargement des statistiques..." });
    const buteursData = buteurs.map(b => ({
        name: b.prenom + ' ' + b.nom.substring(0, 1) + '.',
        Buts: b.buts
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold mb-8", children: "Statistiques de l'\u00E9quipe" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow h-96", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 text-center", children: "Top Buteurs (Graphique)" }), buteursData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: buteursData, margin: { top: 20, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "Buts", fill: "#3b82f6" })] }) })) : (_jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: "Aucune donn\u00E9e" }))] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 border-b pb-2", children: "Classement des Buteurs" }), _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-gray-500", children: [_jsx("th", { className: "py-2", children: "Joueur" }), _jsx("th", { className: "py-2 text-center", children: "Matchs" }), _jsx("th", { className: "py-2 text-center", children: "Buts" })] }) }), _jsx("tbody", { children: buteurs.length > 0 ? buteurs.map(b => (_jsxs("tr", { className: "border-t", children: [_jsxs("td", { className: "py-2", children: [b.prenom, " ", b.nom] }), _jsx("td", { className: "py-2 text-center", children: b.matchs_joues }), _jsx("td", { className: "py-2 text-center font-bold text-blue-600", children: b.buts })] }, b.joueur_id))) : (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "text-center py-4 text-gray-500", children: "Aucun buteur" }) })) })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 border-b pb-2", children: "Top Passeurs" }), _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-gray-500", children: [_jsx("th", { className: "py-2", children: "Joueur" }), _jsx("th", { className: "py-2 text-center", children: "Matchs" }), _jsx("th", { className: "py-2 text-center", children: "Passes" })] }) }), _jsx("tbody", { children: passeurs.length > 0 ? passeurs.map(p => (_jsxs("tr", { className: "border-t", children: [_jsxs("td", { className: "py-2", children: [p.prenom, " ", p.nom] }), _jsx("td", { className: "py-2 text-center", children: p.matchs_joues }), _jsx("td", { className: "py-2 text-center font-bold text-green-600", children: p.passes_decisives })] }, p.joueur_id))) : (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "text-center py-4 text-gray-500", children: "Aucun passeur" }) })) })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow", children: [_jsx("h2", { className: "text-lg font-semibold mb-4 border-b pb-2", children: "Discipline (Cartons)" }), _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-gray-500", children: [_jsx("th", { className: "py-2", children: "Joueur" }), _jsx("th", { className: "py-2 text-center", children: "Matchs" }), _jsx("th", { className: "py-2 text-center text-yellow-600", children: "Jaunes" }), _jsx("th", { className: "py-2 text-center text-red-600", children: "Rouges" })] }) }), _jsx("tbody", { children: discipline.length > 0 ? discipline.map(d => (_jsxs("tr", { className: "border-t", children: [_jsxs("td", { className: "py-2", children: [d.prenom, " ", d.nom] }), _jsx("td", { className: "py-2 text-center", children: d.matchs_joues }), _jsx("td", { className: "py-2 text-center font-bold text-yellow-600", children: d.cartons_jaunes }), _jsx("td", { className: "py-2 text-center font-bold text-red-600", children: d.cartons_rouges })] }, d.joueur_id))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-center py-4 text-gray-500", children: "Aucun avertissement" }) })) })] })] })] })] }));
}
