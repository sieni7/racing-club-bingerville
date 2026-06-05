# Racing Club Bingerville

## Installation

1. Cloner le repository
2. `npm install` à la racine pour installer les dépendances de tous les workspaces.

## Structure

- `frontend/` : Application React (Vite)
- `backend/` : Serveur Express / Node.js
- `shared/` : Schémas Zod et types partagés

## Variables d'environnement

Copier `.env.example` en `.env` à la racine et remplir les valeurs.

## Scripts

- `npm run dev` : Lance le frontend et le backend en mode développement.
- `npm run build` : Compile le code.
- `npm run test` : Lance les tests.
- `npm run lint` : Vérifie le linting.

## Documentation de l'API

L'API REST est exposée sous `/api`. Tous les retours utilisent un format standardisé `ApiResponse`.

- `GET /api/health` : Vérifie le statut de l'application et la connexion DB.
- `GET /api/users` : Liste les utilisateurs.
- `GET /api/users/:id` : Récupère un utilisateur.
- `GET /api/joueurs` : Liste les joueurs (accepte le filtre `?status=ACTIF`).
- `GET /api/matchs` : Liste les matchs.

## Résumé des rapports de sprint

Les rapports de sprint sont disponibles dans le dossier `sprint_report/` (sprint_report_0..3.md).

- Sprint 0 → Fondations : monorepo, configs, CI, ESLint, README initial. (PASSED)
- Sprint 1 → Backend : Express + MongoDB, pattern repository, modèles Mongoose, tests d'intégration. (PASSED)
- Sprint 2 → Auth : JWT avec rotation des refresh tokens, reuse detection, endpoints `/auth` complets. (PASSED)
- Sprint 3 → Frontend : React + RTK Query, intégration Auth, pages et composants principaux, tests frontend. (PASSED)

Prochaines actions ciblées :

- Sprint 4 : Module Joueurs complet (CRUD) — priorité CODE.
- Sprint 5 : Module Matchs + Calendrier — priorité CODE.

Voir les fichiers `sprint_report/sprint_report_*.md` pour le détail des tâches, décisions techniques et signatures.
