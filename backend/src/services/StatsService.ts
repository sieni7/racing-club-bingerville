import { matchRepository } from '../repositories/MatchRepository';
import { joueurRepository } from '../repositories/JoueurRepository';
import { statsJoueurRepository } from '../repositories/StatsJoueurRepository';
import { IStatsJoueur } from '../models/StatsJoueur';

export class StatsService {
  async recalculateForJoueur(joueurId: string, saison: string): Promise<IStatsJoueur> {
    // Récupérer tous les matchs terminés de la saison
    // Note: On pourrait filtrer les matchs où le joueur est dans la compo ou a des événements
    const matchs = await matchRepository.findAll({ saison, statut: 'TERMINE' });
    
    let matchsJoues = 0;
    let buts = 0;
    let passes = 0;
    let cartonsJaunes = 0;
    let cartonsRouges = 0;

    for (const match of matchs) {
      // Vérifier si le joueur était dans la composition
      const dansCompo = match.composition?.some((comp: any) => comp.joueurId?.toString() === joueurId.toString());
      if (dansCompo) {
        matchsJoues++;
      }

      // Parcourir les événements du match
      if (match.evenements) {
        for (const event of match.evenements) {
          if (event.joueurId?.toString() === joueurId.toString()) {
            if (event.type === 'BUT') buts++;
            if (event.type === 'PASSE') passes++;
            if (event.type === 'CARTON_JAUNE') cartonsJaunes++;
            if (event.type === 'CARTON_ROUGE') cartonsRouges++;
          }
        }
      }
    }

    const statsData = {
      joueurId,
      saison,
      matchsJoues,
      buts,
      passes,
      cartonsJaunes,
      cartonsRouges
    };

    return await statsJoueurRepository.upsertStats(joueurId, saison, statsData);
  }

  async recalculateAllStats(saison: string): Promise<void> {
    const joueurs = await joueurRepository.findAll();
    for (const joueur of joueurs) {
      await this.recalculateForJoueur(String(joueur._id), saison);
    }
  }
}

export const statsService = new StatsService();
