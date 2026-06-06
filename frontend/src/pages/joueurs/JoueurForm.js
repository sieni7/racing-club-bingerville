import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { joueursService } from '../../features/joueurs/joueursService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
const joueurSchema = z.object({
    nom: z.string().min(1, 'Le nom est requis'),
    prenom: z.string().min(1, 'Le prénom est requis'),
    date_naissance: z.string().optional(),
    nationalite: z.string().optional(),
    poste: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']),
    numero: z.coerce.number().min(1).max(99),
    taille: z.coerce.number().optional(),
    poids: z.coerce.number().optional(),
    statut: z.enum(['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF']),
});
export default function JoueurForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [photo, setPhoto] = useState(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(joueurSchema),
        defaultValues: {
            poste: 'MILIEU',
            statut: 'ACTIF'
        }
    });
    useEffect(() => {
        if (id) {
            joueursService.getById(id).then(data => {
                reset({
                    ...data,
                    date_naissance: data.date_naissance ? data.date_naissance.substring(0, 10) : ''
                });
            });
        }
    }, [id, reset]);
    const onSubmit = async (data) => {
        try {
            let savedJoueur;
            if (id) {
                savedJoueur = await joueursService.update(id, data);
            }
            else {
                savedJoueur = await joueursService.create(data);
            }
            if (photo) {
                const photo_url = await joueursService.uploadPhoto(photo, savedJoueur.id);
                await joueursService.update(savedJoueur.id, { photo_url });
            }
            navigate('/joueurs');
        }
        catch (error) {
            console.error(error);
            alert('Une erreur est survenue');
        }
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-2xl", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: id ? 'Modifier le joueur' : 'Ajouter un joueur' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white p-6 rounded-lg shadow-md space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Nom", ...register('nom'), error: errors.nom?.message }), _jsx(Input, { label: "Pr\u00E9nom", ...register('prenom'), error: errors.prenom?.message })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Date de naissance", type: "date", ...register('date_naissance'), error: errors.date_naissance?.message }), _jsx(Input, { label: "Nationalit\u00E9", ...register('nationalite'), error: errors.nationalite?.message })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Poste" }), _jsxs("select", { ...register('poste'), className: "w-full px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "GARDIEN", children: "Gardien" }), _jsx("option", { value: "DEFENSEUR", children: "D\u00E9fenseur" }), _jsx("option", { value: "MILIEU", children: "Milieu" }), _jsx("option", { value: "ATTAQUANT", children: "Attaquant" })] })] }), _jsx(Input, { label: "Num\u00E9ro", type: "number", ...register('numero'), error: errors.numero?.message })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "Taille (cm)", type: "number", step: "0.01", ...register('taille'), error: errors.taille?.message }), _jsx(Input, { label: "Poids (kg)", type: "number", step: "0.01", ...register('poids'), error: errors.poids?.message })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Statut" }), _jsxs("select", { ...register('statut'), className: "w-full px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "ACTIF", children: "Actif" }), _jsx("option", { value: "BLESSE", children: "Bless\u00E9" }), _jsx("option", { value: "SUSPENDU", children: "Suspendu" }), _jsx("option", { value: "INACTIF", children: "Inactif" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Photo" }), _jsx("input", { type: "file", accept: "image/*", onChange: (e) => setPhoto(e.target.files?.[0] || null), className: "w-full" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => navigate('/joueurs'), children: "Annuler" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: "Enregistrer" })] })] })] }));
}
