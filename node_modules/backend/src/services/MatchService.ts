import { IMatch } from '../models/Match';
import { DomainEventBus } from '../events/DomainEventBus';
import { MATCH_COMPLETED, MATCH_EVENT_ADDED } from '../events/registry';
import { IEvenementMatch, ICompositionJoueur } from '../../../shared/schemas/match.schema';
import crypto from 'crypto';
import mongoose from 'mongoose';

// Interface pour le mock du repository
export interface IMatchRepository {
  findAll(filters?: Record<string, unknown>): Promise<IMatch[]>;
  findById(id: string): Promise<IMatch | null>;
  create(data: Partial<IMatch>, options?: { session?: mongoose.ClientSession }): Promise<IMatch>;
  update(id: string, data: Partial<IMatch>, options?: { session?: mongoose.ClientSession }): Promise<IMatch | null>;
  delete(id: string): Promise<boolean>;
  updateComposition(id: string, composition: ICompositionJoueur[], options?: { session?: mongoose.ClientSession }): Promise<IMatch | null>;
  addEvent(id: string, event: IEvenementMatch, options?: { session?: mongoose.ClientSession }): Promise<IMatch | null>;
}

export class MatchService {
  constructor(
    private readonly matchRepository: IMatchRepository,
    private readonly eventBus: DomainEventBus
  ) {}

  async getAllMatchs(filters?: Record<string, unknown>): Promise<IMatch[]> {
    return this.matchRepository.findAll(filters);
  }

  async getMatchById(id: string): Promise<IMatch | null> {
    return this.matchRepository.findById(id);
  }

  async createMatch(matchData: Partial<IMatch>): Promise<IMatch> {
    return this.matchRepository.create(matchData);
  }

  async updateMatch(id: string, data: Partial<IMatch>): Promise<IMatch | null> {
    const match = await this.matchRepository.update(id, data);
    if (match && data.statut === 'TERMINE') {
      await this.eventBus.emit({
        eventId: crypto.randomUUID(),
        type: MATCH_COMPLETED,
        payload: { matchId: id },
        aggregateId: id,
        source: 'match-service',
        timestamp: new Date()
      });
    }
    return match;
  }

  async deleteMatch(id: string): Promise<boolean> {
    return this.matchRepository.delete(id);
  }

  async updateComposition(id: string, composition: ICompositionJoueur[]): Promise<IMatch | null> {
    const match = await this.matchRepository.updateComposition(id, composition);
    if (match && match.statut === 'TERMINE') {
      await this.eventBus.emit({
        eventId: crypto.randomUUID(),
        type: MATCH_COMPLETED,
        payload: { matchId: id },
        aggregateId: id,
        source: 'match-service',
        timestamp: new Date()
      });
    }
    return match;
  }

  async addEvent(id: string, event: IEvenementMatch): Promise<IMatch | null> {
    const match = await this.matchRepository.addEvent(id, event);
    if (match && match.statut === 'TERMINE') {
      await this.eventBus.emit({
        eventId: crypto.randomUUID(),
        type: MATCH_EVENT_ADDED,
        payload: { matchId: id, joueurId: event.joueurId, saison: match.saison },
        aggregateId: id,
        source: 'match-service',
        timestamp: new Date()
      });
    }
    return match;
  }
}
