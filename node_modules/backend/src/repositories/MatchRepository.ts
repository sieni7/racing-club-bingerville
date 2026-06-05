import { BaseRepository } from './BaseRepository';
import Match, { IMatch, ICompositionJoueur, IEvenementMatch } from '../models/Match';

export class MatchRepository extends BaseRepository<IMatch> {
  constructor() {
    super(Match);
  }

  async findByDate(date: Date): Promise<IMatch[]> {
    return this.findAll({ date });
  }

  async findUpcoming(): Promise<IMatch[]> {
    return this.findAll({ statut: 'PROGRAMME', date: { $gte: new Date() } });
  }

  async findPast(): Promise<IMatch[]> {
    return this.findAll({ statut: 'TERMINE' });
  }
  
  async findBySaison(saison: string): Promise<IMatch[]> {
    return this.findAll({ saison });
  }

  async updateComposition(matchId: string, composition: ICompositionJoueur[]): Promise<IMatch | null> {
    return this.update(matchId, { composition });
  }

  async addEvent(matchId: string, evenement: IEvenementMatch): Promise<IMatch | null> {
    return this.model.findByIdAndUpdate(
      matchId,
      { $push: { evenements: evenement } },
      { new: true }
    ).exec();
  }

  async updateScoreAndStatus(matchId: string, scoreRacing: number, scoreAdversaire: number, statut: IMatch['statut']): Promise<IMatch | null> {
    return this.update(matchId, { scoreRacing, scoreAdversaire, statut });
  }
}

export const matchRepository = new MatchRepository();
