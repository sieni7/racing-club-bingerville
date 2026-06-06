import { Request, Response } from 'express';
import { matchSchema } from '../../../shared/schemas/match.schema';
import { z } from 'zod';
import { MatchService } from '../services/MatchService';
import mongoose from 'mongoose';

export const createMatchController = (matchService: MatchService) => ({
  getAllMatchs: async (req: Request, res: Response) => {
    try {
      const { saison, statut } = req.query;
      const filters: Record<string, unknown> = {};
      if (saison) filters.saison = saison;
      if (statut) filters.statut = statut;

      const matchs = await matchService.getAllMatchs(filters);
      res.status(200).json(matchs);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving matchs' });
    }
  },

  getMatchById: async (req: Request, res: Response) => {
    try {
      const match = await matchService.getMatchById(String(req.params.id));
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving match' });
    }
  },

  createMatch: async (req: Request, res: Response) => {
    try {
      const validatedData = matchSchema.parse(req.body);
      const match = await matchService.createMatch(validatedData as any);
      res.status(201).json(match);
    } catch (error: unknown) {
      if ((error as any)?.errors) {
        return res.status(400).json({ message: 'Validation error', errors: (error as any).errors });
      }
      res.status(500).json({ message: 'Error creating match' });
    }
  },

  updateMatch: async (req: Request, res: Response) => {
    try {
      const validatedData = matchSchema.partial().parse(req.body);
      const match = await matchService.updateMatch(String(req.params.id), validatedData as any);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.status(200).json(match);
    } catch (error: unknown) {
      if ((error as any)?.errors) {
        return res.status(400).json({ message: 'Validation error', errors: (error as any).errors });
      }
      res.status(500).json({ message: 'Error updating match' });
    }
  },

  deleteMatch: async (req: Request, res: Response) => {
    try {
      const success = await matchService.deleteMatch(String(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting match' });
    }
  },

  updateComposition: async (req: Request, res: Response) => {
    try {
      const { composition } = req.body;
      if (!Array.isArray(composition)) {
        return res.status(400).json({ message: 'Composition must be an array' });
      }

      const match = await matchService.updateComposition(String(req.params.id), composition as any);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: 'Error updating composition' });
    }
  },

  addMatchEvent: async (req: Request, res: Response) => {
    try {
      const evenement = req.body;
      if (!evenement.type || !evenement.joueurId || typeof evenement.minute !== 'number') {
        return res.status(400).json({ message: 'Invalid event data' });
      }

      const match = await matchService.addEvent(String(req.params.id), evenement as any);
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      res.status(200).json(match);
    } catch (error) {
      res.status(500).json({ message: 'Error adding event' });
    }
  }
});
