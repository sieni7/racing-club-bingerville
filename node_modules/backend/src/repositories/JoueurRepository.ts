import { BaseRepository } from './BaseRepository';
import Joueur, { IJoueur } from '../models/Joueur';

export class JoueurRepository extends BaseRepository<IJoueur> {
  constructor() {
    super(Joueur);
  }

  async findByUserId(userId: string): Promise<IJoueur | null> {
    return this.findOne({ userId });
  }

  async findByStatut(statut: string): Promise<IJoueur[]> {
    return this.findAll({ statut });
  }

  async findByPoste(poste: string): Promise<IJoueur[]> {
    return this.findAll({ poste });
  }

  async updateStatut(id: string, statut: string): Promise<IJoueur | null> {
    return this.update(id, { statut } as Partial<IJoueur>);
  }
}

export const joueurRepository = new JoueurRepository();
