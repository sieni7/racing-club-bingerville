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

Note sur le versioning : l'API n'est pas (encore) versionnée en production — nous conservons `/api` (option recommandée). Si un versioning explicite est souhaité plus tard, nous migrerons vers `/api/v1` et mettrons à jour backend, frontend et documentation.

Endpoints principaux disponibles après Sprint 6.1 :

- `GET /api/health` : Vérifie le statut de l'application et la connexion DB.
- Auth :
	- `POST /api/auth/register`
	- `POST /api/auth/login`
	- `POST /api/auth/refresh`
	- `POST /api/auth/logout`
	- `GET /api/auth/me`
- Utilisateurs :
	- `GET /api/users`
	- `GET /api/users/:id`
- Joueurs :
	- `GET /api/joueurs` (filtre `?status=ACTIF`)
	- `GET /api/joueurs/:id`
	- `POST /api/joueurs`
	- `PUT /api/joueurs/:id`
	- `DELETE /api/joueurs/:id`
- Matchs :
	- `GET /api/matchs`
	- `GET /api/matchs/:id`
	- `POST /api/matchs`
	- `PUT /api/matchs/:id`
	- `DELETE /api/matchs/:id`
- Statistiques :
	- `GET /api/stats` (résumés, top-scorers)
	- endpoints RTK/REST pour consultation et recalculs via events
- Actualités :
	- `GET /api/actualites`
	- `POST /api/actualites` (ADMIN)


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

## Résumé des rapports de sprint

Les rapports de sprint complets sont disponibles dans le dossier `sprint_report/` (sprint_report_0..6_1.md). Statut et synthèse :

- **Sprint 0 — Fondations** : ✅ PASSED
- **Sprint 1 — Backend** : ✅ PASSED
- **Sprint 2 — Auth** : ✅ PASSED
- **Sprint 3 — Frontend** : ✅ PASSED
- **Sprint 4 — Module Joueurs (CRUD)** : ✅ PASSED
- **Sprint 5 — Module Matchs & Calendrier** : ✅ PASSED
- **Sprint 5.5 — Governance Layer** : ✅ PASSED
- **Sprint 5.6 — Debt Remediation** : ✅ PASSED
- **Sprint 6 — Statistiques & Actualités** : ✅ PASSED
- **Sprint 6.1 — Domain Event Layer** : ✅ PASSED

## Variables d'environnement (exemples)

Copier `.env.example` en `.env` et remplir les valeurs. Principales variables à documenter :

- `PORT` — port d'écoute du backend
- `MONGO_URI` — URI MongoDB
- `JWT_SECRET` — secret JWT access
- `REFRESH_SECRET` — secret JWT refresh
- `ACCESS_TOKEN_EXPIRES_IN` — ex. `15m`
- `REFRESH_TOKEN_EXPIRES_IN` — ex. `7d`
- `CORS_ORIGIN` — origine front, ex. `http://localhost:5173`
- `RATE_LIMIT_WINDOW_MS` — fenêtre rate-limit en ms
- `RATE_LIMIT_MAX_REQUESTS` — nombre max de requêtes

## Architecture (haute-niveau)

Le projet suit désormais un pattern Event-Driven à l'intérieur du monolith modulaire :

Controller -> Service -> EventBus -> Listener -> Worker/Service (ex: `StatsService`)

Les Domain Events (EventBus) découpent la logique métier et permettent aux listeners (ex: `StatsListener`) de recalculer les statistiques sans appels directs synchrones.

## Structure du projet (extrait)

- `frontend/`
- `backend/`
	- `controllers/`
	- `services/`
	- `repositories/`
	- `events/`
	- `listeners/`
	- `middleware/`
	- `routes/`
	- `models/`
	- `tests/`
- `shared/`

## État actuel et prochaines actions

- **Système** : Prêt (gates de gouvernance et remediation passées).
- **Priorités recommandées** : Sprint 7 — Audit pré-déploiement et préparation production (déploiement, monitoring, secrets management, CI final).

## Conclusion & recommandation

Le `README` était obsolète ; il est maintenant aligné avec les rapports de sprint (0..6.1). Je recommande d'inclure une version `README v2` dédiée production lors du Sprint 7 (checklist déploiement, variables d'env, runbooks, rollback, monitoring, run-commands).

