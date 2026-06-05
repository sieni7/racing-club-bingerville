import { Request, Response } from 'express';
import { matchRepository } from '../repositories/MatchRepository';
import { matchSchema } from '../../../shared/schemas/match.schema';
import { z } from 'zod';
import { statsService } from '../services/StatsService';
import mongoose from 'mongoose';

export const getAllMatchs = async (req: Request, res: Response) => {
  try {
    const { saison, statut } = req.query;
    const filters: Record<string, unknown> = {};
    if (saison) filters.saison = saison;
    if (statut) filters.statut = statut;

    const matchs = await matchRepository.findAll(filters);
    res.status(200).json(matchs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving matchs' });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const match = await matchRepository.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving match' });
  }
};

export const createMatch = async (req: Request, res: Response) => {
  try {
    const validatedData = matchSchema.parse(req.body);
    const match = await matchRepository.create(validatedData as Parameters<typeof matchRepository.create>[0]);
    res.status(201).json(match);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error creating match' });
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = matchSchema.partial().parse(req.body);
    const match = await matchRepository.update(req.params.id, validatedData as Parameters<typeof matchRepository.update>[1]);
    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Match not found' });
    }
    
    // Trigger stats rebuild if match becomes TERMINE or is updated
    if (match.statut === 'TERMINE') {
      for (const comp of match.composition || []) {
        await statsService.recalculateForJoueur(comp.joueurId?.toString() as string, match.saison);
      }
    }

    await session.commitTransaction();
    res.status(200).json(match);
  } catch (error: unknown) {
    await session.abortTransaction();
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating match' });
  } finally {
    session.endSession();
  }
};

export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const success = await matchRepository.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting match' });
  }
};

export const updateComposition = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Expected body: { composition: ICompositionJoueur[] }
    const { composition } = req.body;
    if (!Array.isArray(composition)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Composition must be an array' });
    }

    const match = await matchRepository.updateComposition(req.params.id, composition);
    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.statut === 'TERMINE') {
      for (const comp of match.composition || []) {
        await statsService.recalculateForJoueur(comp.joueurId?.toString() as string, match.saison);
      }
    }

    await session.commitTransaction();
    res.status(200).json(match);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Error updating composition' });
  } finally {
    session.endSession();
  }
};

export const addMatchEvent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Expected body: IEvenementMatch
    const evenement = req.body;
    if (!evenement.type || !evenement.joueurId || typeof evenement.minute !== 'number') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid event data' });
    }

    const match = await matchRepository.addEvent(req.params.id, evenement);
    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.statut === 'TERMINE') {
      await statsService.recalculateForJoueur(evenement.joueurId, match.saison);
    }

    await session.commitTransaction();
    res.status(200).json(match);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Error adding event' });
  } finally {
    session.endSession();
  }
};
