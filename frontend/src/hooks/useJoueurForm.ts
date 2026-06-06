import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Joueur, joueursService } from '../features/joueurs/joueursService';

export const joueurSchema = z.object({
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

export type JoueurFormData = z.infer<typeof joueurSchema>;

export function useJoueurForm(id?: string) {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<File | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<JoueurFormData>({
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
          nom: data.nom,
          prenom: data.prenom,
          date_naissance: data.date_naissance ? data.date_naissance.substring(0, 10) : undefined,
          nationalite: data.nationalite || undefined,
          poste: data.poste as any,
          numero: data.numero || undefined,
          taille: data.taille || undefined,
          poids: data.poids || undefined,
          statut: data.statut as any,
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: JoueurFormData) => {
    try {
      let savedJoueur: Joueur;
      
      const payload = {
        ...data,
        date_naissance: data.date_naissance || null,
        nationalite: data.nationalite || null,
        taille: data.taille || null,
        poids: data.poids || null,
      };

      if (id) {
        savedJoueur = await joueursService.update(id, payload as any);
      } else {
        savedJoueur = await joueursService.create(payload as any);
      }
      
      if (photo) {
        const photo_url = await joueursService.uploadPhoto(photo, savedJoueur.id);
        await joueursService.update(savedJoueur.id, { photo_url });
      }
      navigate('/joueurs');
    } catch (error) {
      console.error(error);
      alert('Une erreur est survenue');
    }
  };

  return { register, handleSubmit, onSubmit, errors, isSubmitting, setPhoto };
}
