import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { actualitesService } from '../../features/actualites/actualitesService';
import { Button } from '../../components/common/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
export default function ActualitesList() {
    const [actualites, setActualites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    // Show all news if ADMIN or STAFF
    const isStaff = user?.role === 'ADMIN' || user?.role === 'STAFF';
    useEffect(() => {
        loadActualites();
    }, []);
    const loadActualites = async () => {
        try {
            const data = await actualitesService.getAll(!isStaff);
            setActualites(data);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer cette actualité ?')) {
            await actualitesService.delete(id);
            loadActualites();
        }
    };
    if (isLoading)
        return _jsx("div", { className: "text-center py-10", children: "Chargement..." });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-8 border-b pb-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Actualit\u00E9s du Club" }), isStaff && (_jsx(Link, { to: "/actualites/nouvelle", children: _jsxs(Button, { className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), " Nouvelle actualit\u00E9"] }) }))] }), _jsx("div", { className: "space-y-6", children: actualites.length === 0 ? (_jsx("p", { className: "text-gray-500 italic text-center py-10", children: "Aucune actualit\u00E9 pour le moment." })) : actualites.map(actu => (_jsx("div", { className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx(Link, { to: `/actualites/${actu.slug}`, className: "hover:text-blue-600 transition", children: _jsx("h2", { className: "text-xl font-bold text-gray-900", children: actu.titre }) }), isStaff && (_jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: `px-2 py-1 text-xs font-semibold rounded-full ${actu.statut === 'PUBLIE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`, children: actu.statut }), _jsx(Link, { to: `/actualites/${actu.id}/editer`, className: "text-indigo-600 hover:text-indigo-900", children: _jsx(Edit, { size: 18 }) }), _jsx("button", { onClick: () => handleDelete(actu.id), className: "text-red-600 hover:text-red-900", children: _jsx(Trash2, { size: 18 }) })] }))] }), _jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["Publi\u00E9 le ", actu.published_at ? format(new Date(actu.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'] }), _jsx("p", { className: "text-gray-700 line-clamp-3", children: actu.contenu }), _jsx("div", { className: "mt-4", children: _jsx(Link, { to: `/actualites/${actu.slug}`, className: "text-blue-600 font-medium hover:underline", children: "Lire la suite \u2192" }) })] }) }, actu.id))) })] }));
}
