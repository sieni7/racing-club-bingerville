import mongoose from 'mongoose';
import { joueurRepository } from '../repositories/JoueurRepository';
import { userRepository } from '../repositories/UserRepository';
import { IJoueur } from '../models/Joueur';
import { IUser } from '../models/User';

export class JoueurService {
  async getAllJoueurs(filters: Record<string, unknown> = {}): Promise<IJoueur[]> {
    return joueurRepository.findAll(filters);
  }

  async getJoueurById(id: string): Promise<IJoueur | null> {
    return joueurRepository.findById(id);
  }

  async createJoueur(joueurData: Partial<IJoueur>): Promise<IJoueur> {
    return joueurRepository.create(joueurData);
  }

  async updateJoueur(id: string, joueurData: Partial<IJoueur>): Promise<IJoueur | null> {
    return joueurRepository.update(id, joueurData);
  }

  async deleteJoueur(id: string): Promise<boolean> {
    return joueurRepository.delete(id);
  }

  async getJoueursActifs(): Promise<IJoueur[]> {
    return joueurRepository.findByStatut('ACTIF');
  }

  async createWithUser(userData: Partial<IUser>, joueurData: Partial<IJoueur>): Promise<{ user: IUser; joueur: IJoueur }> {
    const isReplicaSet = (mongoose.connection as any).client?.s?.options?.replicaSet;
    if (!isReplicaSet && process.env.NODE_ENV !== 'test') {
      console.warn('⚠️ Transactions non disponibles - mode fallback activé');
      const user = await userRepository.create(userData);
      try {
        const joueur = await joueurRepository.create({ ...joueurData, userId: user._id as mongoose.Types.ObjectId });
        return { user, joueur };
      } catch (error) {
        await userRepository.delete(String(user._id));
        throw error;
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const user = await userRepository.create(userData, { session });
      const joueur = await joueurRepository.create({
        ...joueurData,
        userId: user._id as mongoose.Types.ObjectId
      }, { session });
      
      await session.commitTransaction();
      return { user, joueur };
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const joueurService = new JoueurService();
