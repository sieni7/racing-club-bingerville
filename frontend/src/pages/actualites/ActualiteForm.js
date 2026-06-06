import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { actualitesService } from '../../features/actualites/actualitesService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
const actuSchema = z.object({
    titre: z.string().min(3, 'Le titre doit faire au moins 3 caractères'),
    slug: z.string().optional(),
    contenu: z.string().min(10, 'Le contenu est trop court'),
    statut: z.enum(['BROUILLON', 'PUBLIE']),
});
export default function ActualiteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(actuSchema),
        defaultValues: {
            statut: 'BROUILLON'
        }
    });
    useEffect(() => {
        if (id) {
            // Find by ID - actualitesService currently only has getBySlug for single fetch, 
            // but in a real app we'd add getById. For now we use the ID for the update.
            // Assuming actualitesService.getAll() is lightweight for this demo:
            actualitesService.getAll(false).then(data => {
                const actu = data.find(a => a.id === id);
                if (actu)
                    reset(actu);
            });
        }
    }, [id, reset]);
    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                published_at: data.statut === 'PUBLIE' ? new Date().toISOString() : null
            };
            if (id) {
                await actualitesService.update(id, payload);
            }
            else {
                await actualitesService.create(payload);
            }
            navigate('/actualites');
        }
        catch (error) {
            console.error(error);
            alert('Une erreur est survenue');
        }
    };
    return (_jsxs("div", { className: "container mx-auto px-4 py-8 max-w-3xl", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: id ? "Modifier l'actualité" : 'Nouvelle actualité' }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white p-6 rounded-lg shadow-md space-y-4", children: [_jsx(Input, { label: "Titre", ...register('titre'), error: errors.titre?.message }), _jsx(Input, { label: "Slug (URL - Optionnel)", ...register('slug'), placeholder: "genere-automatiquement" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Contenu" }), _jsx("textarea", { ...register('contenu'), rows: 10, className: "w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" }), errors.contenu && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.contenu.message })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Statut" }), _jsxs("select", { ...register('statut'), className: "w-full px-3 py-2 border rounded-lg", children: [_jsx("option", { value: "BROUILLON", children: "Brouillon" }), _jsx("option", { value: "PUBLIE", children: "Publi\u00E9" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6 border-t pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => navigate('/actualites'), children: "Annuler" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: "Enregistrer" })] })] })] }));
}
