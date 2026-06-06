import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actualitesService } from '../../features/actualites/actualitesService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft } from 'lucide-react';
export default function ActualiteDetail() {
    const { slug } = useParams();
    const [actualite, setActualite] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (slug) {
            actualitesService.getBySlug(slug)
                .then(setActualite)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [slug]);
    if (isLoading)
        return _jsx("div", { className: "text-center py-10", children: "Chargement..." });
    if (!actualite)
        return _jsx("div", { className: "text-center py-10 text-red-500", children: "Actualit\u00E9 introuvable" });
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: [_jsxs(Link, { to: "/actualites", className: "inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition", children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), " Retour aux actualit\u00E9s"] }), _jsxs("article", { className: "bg-white rounded-xl shadow-lg overflow-hidden", children: [actualite.image_url && (_jsx("div", { className: "w-full h-64 bg-gray-200", children: _jsx("img", { src: actualite.image_url, alt: actualite.titre, className: "w-full h-full object-cover" }) })), _jsxs("div", { className: "p-8 md:p-12", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-extrabold text-gray-900 mb-4", children: actualite.titre }), _jsxs("div", { className: "flex items-center text-gray-500 text-sm mb-8 border-b pb-4", children: [_jsxs("span", { children: ["Publi\u00E9 le ", actualite.published_at ? format(new Date(actualite.published_at), 'dd MMMM yyyy', { locale: fr }) : 'Non publié'] }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsx("span", { children: "Par le Club" })] }), _jsx("div", { className: "prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap", children: actualite.contenu })] })] })] }));
}
