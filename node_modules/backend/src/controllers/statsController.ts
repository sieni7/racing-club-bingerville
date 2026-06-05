import { Request, Response } from 'express';
import { statsJoueurRepository } from '../repositories/StatsJoueurRepository';
import { statsService } from '../services/StatsService';

export const getTopButeurs = async (req: Request, res: Response) => {
  const saison = req.query.saison as string || '2023-2024';
  const limit = parseInt(req.query.limit as string) || 10;
  
  const stats = await statsJoueurRepository.findTopButeurs(saison, limit);
  res.json({ success: true, data: stats });
};

export const getTopPasseurs = async (req: Request, res: Response) => {
  const saison = req.query.saison as string || '2023-2024';
  const limit = parseInt(req.query.limit as string) || 10;
  
  const stats = await statsJoueurRepository.findTopPasseurs(saison, limit);
  res.json({ success: true, data: stats });
};

export const recalculateAllStats = async (req: Request, res: Response) => {
  const { saison } = req.params;
  
  if (!saison) {
    return res.status(400).json({ success: false, error: 'Saison requise' });
  }

  // Lancé de manière synchrone car c'est le MVP. 
  await statsService.recalculateAllStats(saison);
  
  res.json({ success: true, message: `Stats recalculées pour la saison ${saison}` });
};
