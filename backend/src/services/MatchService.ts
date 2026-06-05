import { matchRepository } from '../repositories/MatchRepository';
import { IMatch } from '../models/Match';

export class MatchService {
  async getAllMatchs(): Promise<IMatch[]> {
    return matchRepository.findAll();
  }

  async getMatchById(id: string): Promise<IMatch | null> {
    return matchRepository.findById(id);
  }

  async createMatch(matchData: Partial<IMatch>): Promise<IMatch> {
    return matchRepository.create(matchData);
  }
}

export const matchService = new MatchService();
