import { BaseRepository } from './BaseRepository';
import Match, { IMatch } from '../models/Match';

export class MatchRepository extends BaseRepository<IMatch> {
  constructor() {
    super(Match);
  }

  async findByDate(date: Date): Promise<IMatch[]> {
    return this.findAll({ date });
  }

  async findUpcoming(): Promise<IMatch[]> {
    return this.findAll({ status: 'SCHEDULED', date: { $gte: new Date() } });
  }

  async findPast(): Promise<IMatch[]> {
    return this.findAll({ status: 'FINISHED' });
  }
  
  async findBySaison(saison: string): Promise<IMatch[]> {
    return this.findAll({ saison });
  }
}

export const matchRepository = new MatchRepository();
