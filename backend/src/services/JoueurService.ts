import { joueurRepository } from '../repositories/JoueurRepository';
import { IJoueur } from '../models/Joueur';

export class JoueurService {
  async getAllJoueurs(): Promise<IJoueur[]> {
    return joueurRepository.findAll();
  }

  async getJoueurById(id: string): Promise<IJoueur | null> {
    return joueurRepository.findById(id);
  }

  async createJoueur(joueurData: Partial<IJoueur>): Promise<IJoueur> {
    return joueurRepository.create(joueurData);
  }

  async getJoueursActifs(): Promise<IJoueur[]> {
    return joueurRepository.findByStatut('ACTIF');
  }
}

export const joueurService = new JoueurService();
