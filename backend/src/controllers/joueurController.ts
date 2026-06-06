import { Request, Response } from 'express';
import { joueurService } from '../services/JoueurService';
import { JoueurSchema } from '../../../shared/schemas/joueur.schema';

export const getAllJoueurs = async (req: Request, res: Response) => {
  try {
    const { statut, poste } = req.query;
    const filters: Record<string, unknown> = {};
    if (statut) filters.statut = statut;
    if (poste) filters.poste = poste;

    const joueurs = await joueurService.getAllJoueurs(filters);
    res.status(200).json(joueurs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving joueurs' });
  }
};

export const getJoueurById = async (req: Request, res: Response) => {
  try {
    const joueur = await joueurService.getJoueurById(String(req.params.id));
    if (!joueur) {
      return res.status(404).json({ message: 'Joueur not found' });
    }
    res.status(200).json(joueur);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving joueur' });
  }
};

export const createJoueur = async (req: Request, res: Response) => {
  try {
    const validatedData = JoueurSchema.parse(req.body);
    const joueur = await joueurService.createJoueur(validatedData as Parameters<typeof joueurService.createJoueur>[0]);
    res.status(201).json(joueur);
  } catch (error: unknown) {
    if ((error as any)?.errors) {
      return res.status(400).json({ message: 'Validation error', errors: (error as any).errors });
    }
    res.status(500).json({ message: 'Error creating joueur' });
  }
};

export const updateJoueur = async (req: Request, res: Response) => {
  try {
    const validatedData = JoueurSchema.partial().parse(req.body);
    const joueur = await joueurService.updateJoueur(String(req.params.id), validatedData as any);
    if (!joueur) {
      return res.status(404).json({ message: 'Joueur not found' });
    }
    res.status(200).json(joueur);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating joueur' });
  }
};

export const deleteJoueur = async (req: Request, res: Response) => {
  try {
    const success = await joueurService.deleteJoueur(String(req.params.id));
    if (!success) {
      return res.status(404).json({ message: 'Joueur not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting joueur' });
  }
};
