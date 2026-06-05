import { Request, Response } from 'express';
import { actualiteRepository } from '../repositories/ActualiteRepository';
import { ActualiteSchema } from '../../../shared/schemas/actualite.schema';

export const getActualites = async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const actualites = await actualiteRepository.findRecent(limit);
  res.json({ success: true, data: actualites });
};

export const getActualiteById = async (req: Request, res: Response) => {
  const actualite = await actualiteRepository.findById(req.params.id);
  if (!actualite) {
    return res.status(404).json({ success: false, error: 'Actualité non trouvée' });
  }
  res.json({ success: true, data: actualite });
};

export const createActualite = async (req: Request, res: Response) => {
  const parsed = ActualiteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.errors });
  }

  const user = (req as Record<string, unknown>).user as { _id: string };
  const actualiteData = {
    ...parsed.data,
    auteurId: user._id
  };

  const actualite = await actualiteRepository.create(actualiteData);
  res.status(201).json({ success: true, data: actualite });
};

export const updateActualite = async (req: Request, res: Response) => {
  const parsed = ActualiteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.errors });
  }

  const actualite = await actualiteRepository.update(req.params.id, parsed.data);
  if (!actualite) {
    return res.status(404).json({ success: false, error: 'Actualité non trouvée' });
  }
  res.json({ success: true, data: actualite });
};

export const deleteActualite = async (req: Request, res: Response) => {
  const success = await actualiteRepository.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, error: 'Actualité non trouvée' });
  }
  res.json({ success: true, message: 'Actualité supprimée' });
};
