import { Match } from '../matchs/matchsService';
import { StatJoueur } from '../statistiques/statistiquesService';
import { Joueur } from '../joueurs/joueursService';

export interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'info' | 'warning' | 'success';
  title: string;
  description: string;
  icon: string;
}

export const generateInsights = (matchs: Match[], joueurs: Joueur[], stats: StatJoueur[]): Insight[] => {
  const insights: Insight[] = [];
  const termines = matchs.filter(m => m.statut === 'TERMINE').sort((a, b) => new Date(b.date_heure).getTime() - new Date(a.date_heure).getTime());

  // 1. Win Streak / Forme récente
  const recentMatches = termines.slice(0, 5);
  let victoires = 0;
  for (const m of recentMatches) {
    if ((m.score_equipe || 0) > (m.score_adversaire || 0)) victoires++;
  }
  if (victoires >= 3) {
    insights.push({
      id: 'win_streak',
      type: 'positive',
      title: 'Excellente dynamique',
      description: `L'équipe a remporté ${victoires} de ses 5 derniers matchs.`,
      icon: '🔥'
    });
  } else if (recentMatches.length > 0 && victoires === 0) {
    insights.push({
      id: 'bad_streak',
      type: 'negative',
      title: 'Dynamique difficile',
      description: `L'équipe n'a remporté aucun de ses ${recentMatches.length} derniers matchs.`,
      icon: '📉'
    });
  }

  // 2. Joueur en feu (Buteur sur plusieurs matchs)
  if (stats.length > 0 && stats[0].buts > 0) {
    const topButeur = stats[0];
    insights.push({
      id: 'top_buteur_form',
      type: 'positive',
      title: 'Buteur en forme',
      description: `${topButeur.prenom} ${topButeur.nom} est le meilleur buteur avec ${topButeur.buts} réalisations.`,
      icon: '⚽'
    });
  }

  // 3. Efficacité Défensive (Clean sheets)
  let cleanSheets = 0;
  termines.forEach(m => {
    if (m.score_adversaire === 0) cleanSheets++;
  });
  if (termines.length > 0) {
    const ratio = Math.round((cleanSheets / termines.length) * 100);
    if (ratio > 40) {
      insights.push({
        id: 'clean_sheets_good',
        type: 'positive',
        title: 'Muraille défensive',
        description: `L'équipe a gardé sa cage inviolée dans ${ratio}% des matchs.`,
        icon: '🛡️'
      });
    } else if (ratio < 15 && termines.length > 3) {
      insights.push({
        id: 'clean_sheets_bad',
        type: 'warning',
        title: 'Défense perméable',
        description: `L'équipe encaisse souvent des buts (seulement ${cleanSheets} clean sheets).`,
        icon: '⚠️'
      });
    }
  }

  // 4. Discipline
  const totalJaunes = stats.reduce((acc, curr) => acc + curr.cartons_jaunes, 0);
  const totalRouges = stats.reduce((acc, curr) => acc + curr.cartons_rouges, 0);
  if (termines.length > 0 && (totalJaunes / termines.length) > 2) {
    insights.push({
      id: 'discipline_warning',
      type: 'warning',
      title: 'Problème de discipline',
      description: `L'équipe récolte en moyenne ${(totalJaunes / termines.length).toFixed(1)} cartons jaunes par match.`,
      icon: '🟨'
    });
  } else if (termines.length > 0 && (totalJaunes / termines.length) <= 1) {
    insights.push({
      id: 'discipline_good',
      type: 'success',
      title: 'Équipe fair-play',
      description: `Très peu de cartons reçus récemment.`,
      icon: '✅'
    });
  }

  // 5. Ratio de buts
  let butsMarques = 0;
  let butsEncaisses = 0;
  termines.forEach(m => {
    butsMarques += (m.score_equipe || 0);
    butsEncaisses += (m.score_adversaire || 0);
  });
  if (butsMarques > butsEncaisses * 1.5) {
    insights.push({
      id: 'attack_domination',
      type: 'info',
      title: 'Attaque prolifique',
      description: `L'équipe marque 1.5x plus de buts qu'elle n'en encaisse.`,
      icon: '🎯'
    });
  }

  // Fill up to 5 if not enough
  if (insights.length === 0) {
    insights.push({
      id: 'welcome',
      type: 'neutral',
      title: 'En attente de données',
      description: `Jouez plus de matchs pour débloquer des analyses intelligentes.`,
      icon: '🧠'
    });
  }

  return insights.slice(0, 5);
};

