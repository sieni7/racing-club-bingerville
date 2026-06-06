import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
export default function JoueursList() {
    const [joueurs, setJoueurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        loadJoueurs();
    }, []);
    const loadJoueurs = async () => {
        try {
            const data = await joueursService.getAll();
            setJoueurs(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer ce joueur ?')) {
            await joueursService.delete(id);
            loadJoueurs();
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Effectif" }), _jsx(Link, { to: "/joueurs/nouveau", children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Ajouter un joueur"] }) })] }), _jsx("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "N\u00B0" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Joueur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Poste" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: joueurs.map((joueur) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: joueur.numero }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [joueur.photo_url ? (_jsx("img", { className: "h-10 w-10 rounded-full object-cover", src: joueur.photo_url, alt: "" })) : (_jsx("div", { className: "h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center", children: _jsxs("span", { className: "text-gray-500 font-medium", children: [joueur.prenom[0], joueur.nom[0]] }) })), _jsx("div", { className: "ml-4", children: _jsxs("div", { className: "text-sm font-medium text-gray-900", children: [joueur.prenom, " ", joueur.nom] }) })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: joueur.poste }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: joueur.statut }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Link, { to: `/joueurs/${joueur.id}`, className: "text-blue-600 hover:text-blue-900", children: _jsx(Eye, { size: 18 }) }), _jsx(Link, { to: `/joueurs/${joueur.id}/editer`, className: "text-indigo-600 hover:text-indigo-900", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(joueur.id), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { size: 18 }) })] }) })] }, joueur.id))) })] }) })] }));
}
