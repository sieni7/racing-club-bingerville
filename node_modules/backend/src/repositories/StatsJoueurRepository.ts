import { StatsJoueur, IStatsJoueur } from '../models/StatsJoueur';
import { BaseRepository } from './BaseRepository';
import { IStatsJoueurInput } from '../../../shared/schemas/stats.schema';

export class StatsJoueurRepository extends BaseRepository<IStatsJoueur> {
  constructor() {
    super(StatsJoueur);
  }

  async upsertStats(joueurId: string, saison: string, stats: Partial<IStatsJoueurInput>): Promise<IStatsJoueur> {
    const updated = await this.model.findOneAndUpdate(
      { joueurId, saison },
      { $set: stats },
      { new: true, upsert: true }
    ).exec();
    return updated as IStatsJoueur;
  }

  async findTopButeurs(saison: string, limit: number = 10): Promise<IStatsJoueur[]> {
    return this.model.find({ saison, buts: { $gt: 0 } })
      .sort({ buts: -1 })
      .limit(limit)
      .populate('joueurId', 'nom prenom poste numeroLicence')
      .exec();
  }

  async findTopPasseurs(saison: string, limit: number = 10): Promise<IStatsJoueur[]> {
    return this.model.find({ saison, passes: { $gt: 0 } })
      .sort({ passes: -1 })
      .limit(limit)
      .populate('joueurId', 'nom prenom poste numeroLicence')
      .exec();
  }
}

export const statsJoueurRepository = new StatsJoueurRepository();
