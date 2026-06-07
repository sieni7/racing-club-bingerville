import { Joueur } from '../features/joueurs/joueursService';
import { StatJoueur } from '../features/statistiques/statistiquesService';

export const calculatePlayerRating = (joueur: Joueur, stats?: StatJoueur): number => {
  const baseScore = 70;
  if (!stats) return baseScore; // S'il n'a pas de stats, note de base

  let bonus = 0;

  switch (joueur.poste) {
    case 'ATTAQUANT':
      bonus = stats.buts * 3 + stats.passes_decisives * 1.5;
      break;
    case 'MILIEU':
      bonus = stats.buts * 2 + stats.passes_decisives * 2 + (stats.matchs_joues * 0.5);
      break;
    case 'DEFENSEUR':
      bonus = (stats.matchs_joues * 0.5) + (stats.cartons_jaunes > 3 ? -5 : 0);
      break;
    case 'GARDIEN':
      bonus = (stats.matchs_joues * 0.5) + (stats.buts === 0 && stats.matchs_joues > 0 ? 5 : -2);
      break;
  }

  // Malus pour cartons
  bonus -= stats.cartons_rouges * 5 + stats.cartons_jaunes * 1;

  return Math.min(99, Math.max(50, Math.floor(baseScore + bonus)));
};

