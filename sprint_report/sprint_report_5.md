# RAPPORT DE SPRINT

## Métadonnées
| Champ | Valeur |
|-------|--------|
| Sprint | 5 - Module Matchs + Calendrier |
| Date début | 2026-06-05 |
| Date fin | 2026-06-05 |
| Statut | PASSED |

## Tâches exécutées
| ID | Tâche | Agent | Statut | Commentaire |
|----|-------|-------|--------|-------------|
| T5.1 | Modèle Match | DATABASE | ✅ DONE | Ajout composition, événements, score |
| T5.2 | Schéma Zod Match | DATABASE | ✅ DONE | Validation complète du CRUD + events |
| T5.3 | MatchRepository | DATABASE | ✅ DONE | updateComposition, addEvent, etc. |
| T5.4 | Contrôleurs Match | CODE | ✅ DONE | CRUD + endpoints personnalisés |
| T5.5 | Routes Match | CODE | ✅ DONE | Protection des rôles (STAFF/ADMIN) |
| T5.6 | Install Calendar | CODE | ✅ DONE | react-big-calendar + date-fns |
| T5.7 | matchsApi (RTK) | CODE | ✅ DONE | Query et Mutations |
| T5.8 | Calendrier.tsx | UX | ✅ DONE | Vue mensuelle interactive |
| T5.9 | MatchDetail.tsx | UX | ✅ DONE | Onglets infos, composition, événements |
| T5.10 | CompositionForm | UX | ✅ DONE | Interface d'assignation des joueurs |
| T5.11 | MatchEventForm | UX | ✅ DONE | Interface de saisie rapide d'événements |
| T5.12 | Routing | CODE | ✅ DONE | Intégration App.tsx + Header.tsx |
| T5.13 | Tests Backend | QA | ✅ DONE | Tests supertest |
| T5.14 | Tests Calendrier | QA | ✅ DONE | Tests RTL |
| T5.15 | Tests MatchDetail| QA | ✅ DONE | Tests RTL |
| T5.16 | Couverture | QA | ✅ DONE | |

## Décisions et Remarques
- Utilisation de `react-big-calendar` avec une vue interactive.
- Les événements de match sont stockés sous forme de tableau de sous-documents dans le modèle `Match` pour simplifier la structure.
- Les notifications et la mise à jour automatique des statistiques individuelles des joueurs (buts, cartons) ont été reportées pour les sprints suivants (Sprint 6).
