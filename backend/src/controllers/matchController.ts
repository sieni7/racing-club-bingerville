import { Request, Response } from 'express';
import { matchService } from '../services/MatchService';

export const getAllMatchs = async (req: Request, res: Response) => {
  try {
    const matchs = await matchService.getAllMatchs();
    res.status(200).json(matchs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving matchs' });
  }
};

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const match = await matchService.getMatchById(req.params.id);
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
    const match = await matchService.createMatch(req.body);
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error creating match' });
  }
};
