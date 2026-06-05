import { Request, Response } from 'express';
import { joueurService } from '../services/JoueurService';

export const getAllJoueurs = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let joueurs;
    
    if (status === 'ACTIF') {
      joueurs = await joueurService.getJoueursActifs();
    } else {
      joueurs = await joueurService.getAllJoueurs();
    }
    
    res.status(200).json(joueurs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving joueurs' });
  }
};

export const getJoueurById = async (req: Request, res: Response) => {
  try {
    const joueur = await joueurService.getJoueurById(req.params.id);
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
    const joueur = await joueurService.createJoueur(req.body);
    res.status(201).json(joueur);
  } catch (error) {
    res.status(500).json({ message: 'Error creating joueur' });
  }
};
