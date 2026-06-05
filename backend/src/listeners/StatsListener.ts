import { DomainEvent } from '../events/types';
import { StatsService } from '../services/StatsService';

export class StatsListener {
  constructor(private readonly statsService: StatsService) {}

  onMatchCompleted = async (event: DomainEvent & { payload: { matchId: string } }): Promise<void> => {
    const { matchId } = event.payload;
    // Recalcul complet à partir des événements du match
    await this.statsService.recalculateForMatch(matchId);
  };

  onMatchEventAdded = async (event: DomainEvent & { payload: { matchId: string; joueurId: string } }): Promise<void> => {
    const { joueurId } = event.payload;
    await this.statsService.recalculateForJoueur(joueurId, '2023-2024');
  };

  onStatsRecalculationRequested = async (event: DomainEvent & { payload: { saison: string } }): Promise<void> => {
    const { saison } = event.payload;
    await this.statsService.recalculateAllStats(saison);
  };
}
