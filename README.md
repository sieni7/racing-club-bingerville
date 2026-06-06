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

## 🚀 Déploiement sur Netlify

### Prérequis
- Compte Netlify (https://netlify.com)
- Dépôt GitHub synchronisé

### Étapes

1. **Se connecter à Netlify**
   - Aller sur `app.netlify.com`
   - Cliquer sur "Add new site" → "Import an existing project"

2. **Connecter GitHub**
   - Sélectionner `sieni7/racing-club-bingerville`
   - Branche: `master`

3. **Configurer le build**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`

4. **Variables d'environnement**
   - Cliquer sur "Advanced" → "Environment variables"
   - Ajouter :
     ```
     VITE_SUPABASE_URL = https://votre-projet.supabase.co
     VITE_SUPABASE_ANON_KEY = votre-clé-anonyme-supabase
     ```

5. **Déployer**
   - Cliquer sur "Deploy site"

6. **Vérifier**
   - Une fois le build terminé, cliquer sur l'URL générée
   - Exemple : `https://racing-club-bingerville.netlify.app`
