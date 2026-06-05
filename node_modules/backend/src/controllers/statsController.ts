import { Request, Response } from 'express';
import { statsJoueurRepository } from '../repositories/StatsJoueurRepository';
import { eventBus } from '../server';
import crypto from 'crypto';

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

  await eventBus.emit({
    eventId: crypto.randomUUID(),
    type: 'STATS_RECALCULATION_REQUESTED',
    payload: { saison },
    aggregateId: 'global',
    source: 'stats-controller',
    timestamp: new Date()
  });
  
  res.json({ success: true, message: `Stats recalculées pour la saison ${saison}` });
};
