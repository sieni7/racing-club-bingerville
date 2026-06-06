import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { feuilleMatchService } from '../../features/matchs/feuilleMatchService';
import { joueursService } from '../../features/joueurs/joueursService';
import { Button } from '../common/Button';
export default function CompositionTab({ matchId }) {
    const [compositions, setCompositions] = useState([]);
    const [allJoueurs, setAllJoueurs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        Promise.all([
            feuilleMatchService.getCompositionByMatch(matchId),
            joueursService.getAll()
        ]).then(([comps, joueurs]) => {
            setCompositions(comps);
            setAllJoueurs(joueurs);
            setIsLoading(false);
        }).catch(console.error);
    }, [matchId]);
    const handleStatusChange = (joueurId, statut) => {
        setCompositions(prev => {
            const existingIndex = prev.findIndex(c => c.joueur_id === joueurId);
            if (statut === '') {
                if (existingIndex >= 0) {
                    const newComps = [...prev];
                    newComps[existingIndex].statut = 'ABSENT'; // Mark to remove/absent
                    return newComps;
                }
                return prev;
            }
            if (existingIndex >= 0) {
                const newComps = [...prev];
                newComps[existingIndex] = { ...newComps[existingIndex], statut };
                return newComps;
            }
            else {
                return [...prev, {
                        id: '',
                        match_id: matchId,
                        joueur_id: joueurId,
                        statut,
                        numero_maillot: null,
                        est_capitaine: false,
                        minutes_jouees: 0
                    }];
            }
        });
    };
    const handleSave = async () => {
        try {
            const payload = compositions.map(({ id, joueurs, ...rest }) => ({
                ...rest,
                // if id is empty, don't pass it so supabase generates one
                ...(id ? { id } : {})
            }));
            await feuilleMatchService.upsertComposition(payload);
            alert('Composition sauvegardée !');
            // Reload
            const comps = await feuilleMatchService.getCompositionByMatch(matchId);
            setCompositions(comps);
        }
        catch (error) {
            console.error(error);
            alert('Erreur lors de la sauvegarde');
        }
    };
    if (isLoading)
        return _jsx("div", { children: "Chargement..." });
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-4 border-b pb-2", children: [_jsx("h2", { className: "text-xl font-semibold", children: "S\u00E9lection des joueurs" }), _jsx(Button, { onClick: handleSave, children: "Enregistrer la composition" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 text-sm", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left", children: "Joueur" }), _jsx("th", { className: "px-4 py-2 text-left", children: "Poste" }), _jsx("th", { className: "px-4 py-2 text-center", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: allJoueurs.map(joueur => {
                                const comp = compositions.find(c => c.joueur_id === joueur.id);
                                const statut = comp?.statut || '';
                                return (_jsxs("tr", { children: [_jsxs("td", { className: "px-4 py-2 font-medium", children: [joueur.prenom, " ", joueur.nom] }), _jsx("td", { className: "px-4 py-2 text-gray-500", children: joueur.poste }), _jsx("td", { className: "px-4 py-2 text-center", children: _jsxs("select", { value: statut, onChange: (e) => handleStatusChange(joueur.id, e.target.value), className: "border rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500", children: [_jsx("option", { value: "", children: "Non s\u00E9lectionn\u00E9" }), _jsx("option", { value: "TITULAIRE", children: "Titulaire" }), _jsx("option", { value: "REMPLACANT", children: "Rempla\u00E7ant" }), _jsx("option", { value: "ABSENT", children: "Absent" })] }) })] }, joueur.id));
                            }) })] }) })] }));
}
