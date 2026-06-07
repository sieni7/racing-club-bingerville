import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { joueursService } from '../features/joueurs/joueursService';

const joueurSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  poste: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']),
  numero: z.coerce.number().int().positive('Numéro invalide'),
  statut: z.enum(['ACTIF', 'BLESSE', 'SUSPENDU', 'INACTIF']),
  date_naissance: z.string().optional(),
  nationalite: z.string().optional(),
  taille: z.coerce.number().positive().optional(),
  poids: z.coerce.number().positive().optional(),
  photo_url: z.string().optional()
});

export type JoueurFormData = z.infer<typeof joueurSchema>;

export const useJoueurForm = (initialData?: Partial<JoueurFormData> & { id?: string }, onSuccess?: () => void) => {
  const form = useForm<JoueurFormData>({
    // @ts-ignore
    resolver: zodResolver(joueurSchema),
    defaultValues: initialData
  });

  const onSubmit: SubmitHandler<JoueurFormData> = async (data) => {
    try {
      const payload = {
        ...data,
        date_naissance: data.date_naissance || null,
        nationalite: data.nationalite || null,
        taille: data.taille || null,
        poids: data.poids || null,
        photo_url: data.photo_url || null
      };
      
      if (initialData?.id) {
        // @ts-ignore
        await joueursService.update(initialData.id, payload);
      } else {
        // @ts-ignore
        await joueursService.create(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Erreur sauvegarde joueur:', error);
    }
  };

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
};

