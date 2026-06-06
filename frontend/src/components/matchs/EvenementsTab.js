import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { feuilleMatchService } from '../../features/matchs/feuilleMatchService';
import { Button } from '../common/Button';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
const evtSchema = z.object({
    minute: z.coerce.number().min(1).max(120),
    type_evenement: z.enum(['BUT', 'PASSE', 'CARTON_JAUNE', 'CARTON_ROUGE', 'ENTREE', 'SORTIE']),
    joueur_id: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});
export default function EvenementsTab({ matchId }) {
    const [evenements, setEvenements] = useState([]);
    const [compositions, setCompositions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(evtSchema)
    });
    useEffect(() => {
        loadData();
    }, [matchId]);
    const loadData = async () => {
        try {
            const [evts, comps] = await Promise.all([
                feuilleMatchService.getEvenementsByMatch(matchId),
                feuilleMatchService.getCompositionByMatch(matchId)
            ]);
            setEvenements(evts);
            setCompositions(comps);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const onSubmit = async (data) => {
        try {
            await feuilleMatchService.createEvenement({
                match_id: matchId,
                type_evenement: data.type_evenement,
                minute: data.minute,
                joueur_id: data.joueur_id || null,
                description: data.description || null
            });
            reset();
            loadData();
        }
        catch (error) {
            console.error(error);
            alert('Erreur lors de l\'ajout');
        }
    };
    const handleDelete = async (id) => {
        if (confirm('Supprimer cet événement ?')) {
            await feuilleMatchService.deleteEvenement(id);
            loadData();
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold border-b pb-2 mb-4", children: "Chronologie" }), evenements.length === 0 ? (_jsx("p", { className: "text-gray-500 italic", children: "Aucun \u00E9v\u00E9nement enregistr\u00E9." })) : (_jsx("ul", { className: "space-y-3", children: evenements.map(evt => (_jsxs("li", { className: "flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm", children: [_jsxs("div", { className: "flex gap-4 items-center", children: [_jsxs("span", { className: "font-bold text-gray-700 w-10 text-right", children: [evt.minute, "'"] }), _jsxs("div", { children: [_jsx("span", { className: `font-semibold mr-2 
                      ${evt.type_evenement === 'BUT' ? 'text-green-600' :
                                                        evt.type_evenement === 'CARTON_JAUNE' ? 'text-yellow-600' :
                                                            evt.type_evenement === 'CARTON_ROUGE' ? 'text-red-600' : 'text-blue-600'}`, children: evt.type_evenement.replace('_', ' ') }), evt.joueurs ? `${evt.joueurs.prenom} ${evt.joueurs.nom}` : (evt.description || 'Adversaire')] })] }), _jsx("button", { onClick: () => handleDelete(evt.id), className: "text-red-500 hover:text-red-700", children: _jsx(Trash2, { size: 16 }) })] }, evt.id))) }))] }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold border-b pb-2 mb-4", children: "Ajouter un \u00E9v\u00E9nement" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white p-4 border rounded-lg shadow-sm space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Minute" }), _jsx("input", { type: "number", ...register('minute'), className: "w-full px-3 py-2 border rounded-lg", placeholder: "ex: 15" }), errors.minute && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.minute.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { ...register('type_evenement'), className: "w-full px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "BUT", children: "But" }), _jsx("option", { value: "PASSE", children: "Passe d\u00E9cisive" }), _jsx("option", { value: "CARTON_JAUNE", children: "Carton Jaune" }), _jsx("option", { value: "CARTON_ROUGE", children: "Carton Rouge" }), _jsx("option", { value: "ENTREE", children: "Entr\u00E9e en jeu" }), _jsx("option", { value: "SORTIE", children: "Sortie de jeu" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Joueur impliqu\u00E9 (Optionnel)" }), _jsxs("select", { ...register('joueur_id'), className: "w-full px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un joueur..." }), compositions.map(c => (_jsxs("option", { value: c.joueur_id, children: [c.joueurs?.prenom, " ", c.joueurs?.nom, " (", c.statut, ")"] }, c.joueur_id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description / Adversaire (Optionnel)" }), _jsx("input", { type: "text", ...register('description'), className: "w-full px-3 py-2 border rounded-lg", placeholder: "Ex: Contre son camp, Penalty..." })] }), _jsx("div", { className: "pt-2 text-right", children: _jsx(Button, { type: "submit", children: "Ajouter" }) })] })] })] }));
}
