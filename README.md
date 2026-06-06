# 🏟️ Racing Club de Bingerville

![Status](https://img.shields.io/badge/status-production_ready-brightgreen)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Supabase-blue)
![License](https://img.shields.io/badge/license-private-lightgrey)
![Deploy](https://img.shields.io/badge/deploy-Netlify-00C7B7)
![DB](https://img.shields.io/badge/database-Supabase-3ECF8E)
![Auth](https://img.shields.io/badge/auth-JWT%20%7C%20HttpOnly-orange)

---

## 📌 Overview

**Racing Club de Bingerville** est une plateforme digitale de gestion complète d'un club de football :

- Gestion des joueurs
- Planification des matchs
- Feuilles de match & événements
- Statistiques automatiques (buteurs, passeurs, discipline)
- Publication d'actualités
- Tableau de bord administratif

Architecture orientée **production**, scalable et sécurisée.

---

## ⚙️ Architecture

```txt
Frontend (React + Vite + Tailwind)
        ↓
Supabase (PostgreSQL + Auth + Storage)
        ↓
Netlify (Hosting + Functions)
```

### Stack technique

- **Frontend** : React 19 + Vite + TailwindCSS
- **Backend logique** : Supabase (PostgreSQL + RLS)
- **Auth** : JWT + Refresh tokens (httpOnly cookies)
- **Storage** : Supabase Storage (images joueurs)
- **Hosting** : Netlify
- **CI/CD** : GitHub Actions

---

## 📁 Structure du projet

```txt
frontend/
  src/
    components/     # Composants réutilisables
    pages/          # Pages de l'application
    hooks/          # Hooks personnalisés
    lib/            # Configuration Supabase
    context/        # Contextes React (Auth, etc.)
    features/       # Services métier
  e2e/              # Tests end-to-end (Playwright)

supabase/
  migrations/       # Migrations SQL
  seed.sql          # Données initiales

.github/
  workflows/        # CI/CD (lint, typecheck, build, deploy)
```

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/sieni7/racing-club-bingerville.git

cd racing-club-bingerville

# Installer dépendances frontend
cd frontend
npm install
```

---

## 🧪 Mode développement

```bash
npm run dev
```

Frontend disponible sur :

```
http://localhost:5173
```

---

## 🏗️ Build production

```bash
npm run build
```

Preview :

```bash
npm run preview
```

---

## 🔐 Variables d'environnement

Créer `.env` dans `/frontend` :

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🗄️ Base de données (Supabase)

### Modules principaux

| Table | Description |
|-------|-------------|
| `profiles` | Utilisateurs (extension auth.users) |
| `joueurs` | Joueurs de l'équipe |
| `matchs` | Rencontres |
| `compositions` | Composition d'équipe |
| `evenements_match` | Événements (buts, cartons, remplacements) |
| `stats_joueurs` | Vue matérialisée des statistiques |
| `actualites` | Actualités du club |

### Sécurité

- Row Level Security (RLS) activé
- Policies par rôle (ADMIN / STAFF / MEMBER)
- Accès contrôlé par JWT

---

## 🔐 Authentification

Système sécurisé :

- JWT Access Token (15 min)
- Refresh Token (7 jours, httpOnly cookie)
- Rotation automatique des tokens
- Protection anti-reuse (familyId + compromised flag)

### Rôles disponibles

| Rôle | Permissions |
|------|-------------|
| ADMIN | Accès total |
| STAFF | Gestion matchs, joueurs, actualités |
| MEMBER | Consultation uniquement |

---

## 📊 Fonctionnalités

### 👤 Joueurs

- CRUD complet
- Upload photo (Supabase Storage)
- Filtres par poste / statut
- Profil détaillé avec statistiques

### ⚽ Matchs

- Création de matchs
- Calendrier interactif (react-big-calendar)
- Statuts : PLANIFIE / EN_COURS / TERMINE / ANNULE

### 📋 Compositions & Événements

- Sélection titulaires/remplaçants
- Saisie événements (buts, passes, cartons, remplacements)
- Feuille de match unifiée (onglets)

### 📈 Statistiques

- Classement buteurs
- Classement passeurs
- Classement discipline
- Mise à jour automatique après match (vue SQL)
- Graphiques Recharts

### 📰 Actualités

- Publication admin (BROUILLON / PUBLIE)
- Flux public avec slugs SEO
- Image d'illustration

### 📊 Dashboard

- Prochain match
- Dernier résultat
- Top 3 buteurs
- Joueurs actifs (compteur)
- Dernières actualités

---

## 🔄 CI/CD

Pipeline GitHub Actions :

- Lint (ESLint)
- Typecheck (TypeScript)
- Tests unitaires (Vitest)
- Build (Vite)
- Deploy Netlify (auto sur main)

---

## 📦 Scripts disponibles

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc --noEmit",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

---

## 🧪 Tests

- **Unit tests** : Vitest + React Testing Library
- **E2E** : Playwright (smoke test login)
- Coverage cible : **80%+**

---

## 📈 Performance

- Lighthouse target : **90+**
- Lazy loading des pages (React.lazy)
- Code splitting automatique Vite
- Bundle size optimisé

---

## 🛡️ Sécurité

- JWT sécurisé (httpOnly cookies)
- RLS Supabase activé
- Protection CORS
- Headers sécurisés Netlify
- Rate limiting sur les fonctions

---

## 🚀 Déploiement Netlify

### Étapes

1. **Se connecter à Netlify** : `app.netlify.com`
2. **Add new site** → **Import an existing project**
3. **Connecter GitHub** : sélectionner `sieni7/racing-club-bingerville`
4. **Configurer** :
   - Build command : `cd frontend && npm install && npm run build`
   - Publish directory : `frontend/dist`
5. **Variables d'environnement** :
   ```
   VITE_SUPABASE_URL = https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY = votre-clé-anonyme
   ```
6. **Déployer**

### URL finale

```
https://racing-club-bingerville.netlify.app
```

---

## 🧭 Roadmap post-MVP

- [x] Authentification multi-rôles
- [x] Gestion joueurs
- [x] Gestion matchs
- [x] Compositions & événements
- [x] Statistiques automatiques
- [x] Actualités
- [x] Dashboard administratif
- [ ] Notifications temps réel (email/SMS)
- [ ] Application mobile (React Native)
- [ ] Analyse IA performances joueurs
- [ ] Export PDF (feuilles de match, stats)

---

## 📊 Status projet

| Module           | Status |
| ---------------- | ------ |
| Authentification | ✅      |
| Joueurs          | ✅      |
| Matchs           | ✅      |
| Compositions     | ✅      |
| Événements       | ✅      |
| Statistiques     | ✅      |
| Actualités       | ✅      |
| Dashboard        | ✅      |
| Déploiement      | ✅      |

---

## 🤝 Contribution

Projet privé — contribution interne uniquement.

---

## 📄 License

Proprietary — Racing Club de Bingerville.

---

## 🏁 Author

**Racing Club Digital Lab** — Département technique du Racing Club de Bingerville.
