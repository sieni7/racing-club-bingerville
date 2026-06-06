import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../../components/common/Button';
import { Edit, ArrowLeft } from 'lucide-react';
export default function JoueurDetail() {
    const { id } = useParams();
    const [joueur, setJoueur] = useState(null);
    useEffect(() => {
        if (id) {
            joueursService.getById(id).then(setJoueur);
        }
    }, [id]);
    if (!joueur)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs(Link, { to: "/joueurs", className: "text-blue-600 flex items-center mb-6 hover:underline", children: [_jsx(ArrowLeft, { size: 16, className: "mr-1" }), " Retour \u00E0 la liste"] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row", children: [_jsxs("div", { className: "md:w-1/3 bg-gray-50 flex flex-col items-center p-8 border-r", children: [joueur.photo_url ? (_jsx("img", { src: joueur.photo_url, alt: "", className: "w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white" })) : (_jsx("div", { className: "w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white", children: _jsxs("span", { className: "text-4xl text-gray-400", children: [joueur.prenom[0], joueur.nom[0]] }) })), _jsxs("h2", { className: "text-2xl font-bold mt-4", children: [joueur.prenom, " ", joueur.nom] }), _jsx("p", { className: "text-gray-500", children: joueur.poste }), _jsxs("div", { className: "mt-2 text-3xl font-black text-blue-900", children: ["N\u00B0 ", joueur.numero] })] }), _jsxs("div", { className: "md:w-2/3 p-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Informations personnelles" }), _jsx(Link, { to: `/joueurs/${joueur.id}/editer`, children: _jsxs(Button, { variant: "secondary", className: "flex items-center gap-2", children: [_jsx(Edit, { size: 16 }), " \u00C9diter"] }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-y-4 gap-x-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Date de naissance" }), _jsx("p", { className: "font-medium", children: joueur.date_naissance || 'Non renseignée' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Nationalit\u00E9" }), _jsx("p", { className: "font-medium", children: joueur.nationalite || 'Non renseignée' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Taille" }), _jsx("p", { className: "font-medium", children: joueur.taille ? `${joueur.taille} cm` : 'Non renseignée' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Poids" }), _jsx("p", { className: "font-medium", children: joueur.poids ? `${joueur.poids} kg` : 'Non renseignée' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Statut" }), _jsx("span", { className: `px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${joueur.statut === 'ACTIF' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`, children: joueur.statut })] })] })] })] })] }));
}
