# Racing Club de Bingerville — V2

Plateforme de gestion du club (frontend React + Supabase backend).

Voir `supabase/migrations` pour la base de données, `frontend/` pour l'application React, et `netlify/functions/` pour les fonctions Edge.

Installation rapide:

1. Copier `.env.example` en `.env` et renseigner les variables.
2. Lancer Supabase (migrations) et configurer le projet.
3. Déployer frontend sur Netlify (build: `cd frontend && npm ci && npm run build`).
