# Racing Club Bingerville

## Description
Plateforme de gestion pour le Racing Club Bingerville (v2).

## Stack Technique
- Frontend: React, Vite, TailwindCSS
- Backend/BaaS: Supabase
- Hébergement: Netlify
- CI/CD: GitHub Actions

## Prérequis
- Node.js (v18+)
- Compte Supabase
- Compte Netlify

## Installation
```bash
cd frontend
npm install
```

## Variables d'environnement
Copiez `.env.example` vers `frontend/.env` et remplissez les valeurs.

## Structure du projet
- `frontend/`: Code React
- `supabase/`: Migrations et configuration BD
- `netlify/`: Serverless functions

## Commandes disponibles
- `npm run dev`: Lancer le serveur de développement
- `npm run build`: Build pour la production

## Déploiement
Déploiement automatique via GitHub Actions sur Netlify.
