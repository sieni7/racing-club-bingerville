import { BaseRepository } from './BaseRepository';
import Joueur, { IJoueur } from '../models/Joueur';

export class JoueurRepository extends BaseRepository<IJoueur> {
  constructor() {
    super(Joueur);
  }

  async findByUserId(userId: string): Promise<IJoueur | null> {
    return this.findOne({ userId });
  }

  async findByStatut(status: string): Promise<IJoueur[]> {
    return this.findAll({ status });
  }

  async findByPoste(position: string): Promise<IJoueur[]> {
    return this.findAll({ position });
  }
}

export const joueurRepository = new JoueurRepository();
