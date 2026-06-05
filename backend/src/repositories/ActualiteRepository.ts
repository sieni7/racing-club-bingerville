import { Actualite, IActualite } from '../models/Actualite';
import { BaseRepository } from './BaseRepository';

export class ActualiteRepository extends BaseRepository<IActualite> {
  constructor() {
    super(Actualite);
  }

  async findRecent(limit: number = 10): Promise<IActualite[]> {
    return this.model.find()
      .sort({ datePublication: -1 })
      .limit(limit)
      .populate('auteurId', 'email role')
      .exec();
  }
}

export const actualiteRepository = new ActualiteRepository();
