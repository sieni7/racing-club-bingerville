# 🏟️ Racing Club de Bingerville

![Status](https://img.shields.io/badge/status-production_ready-brightgreen)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Vite%20%7C%20Supabase-blue)
![License](https://img.shields.io/badge/license-private-lightgrey)
![Deploy](https://img.shields.io/badge/deploy-Netlify-00C7B7)
![DB](https://img.shields.io/badge/database-Supabase-3ECF8E)
![Auth](https://img.shields.io/badge/auth-JWT%20%7C%20HttpOnly-orange)
![UI](https://img.shields.io/badge/UI-Framer%20Motion-ff69b4)

## 📌 Overview

**Racing Club de Bingerville** est une plateforme digitale de gestion complète d'un club de football.

### ✨ Fonctionnalités

| Module | Description |
|--------|-------------|
| 👤 **Joueurs** | CRUD complet, upload photo, rating (0-100) |
| ⚽ **Matchs** | Calendrier, timeline (Planifié/En cours/Terminé) |
| 📋 **Compositions** | Titulaires, remplaçants, capitaine |
| 🎯 **Événements** | Buts, passes, cartons, remplacements |
| 📊 **Statistiques** | Top buteurs, passeurs, discipline |
| 📰 **Actualités** | Feed style réseau social |
| 📈 **Dashboard** | Insights automatiques, métriques |
| ⚙️ **Paramètres** | Configuration club, utilisateurs, rôles |
| 🌙 **Dark mode** | Thème clair/sombre avec toggle |

### 🎨 Design System

- **Palette Sport Tech** : `#0B5FFF` (primary), `#1A1F2E` (cards), `#0B0F1A` (bg)
- **Typographie** : Geist (titres) + Inter (corps)
- **Glassmorphism** : `backdrop-blur-md bg-white/5`
- **Animations** : Framer Motion (60fps)

### 🧠 Insight Engine

L'application génère automatiquement des insights basés sur les données :

- 🔥 "Excellente dynamique - 3 victoires d'affilée"
- 🛡️ "Muraille défensive - 4 clean sheets sur 8 matchs"
- ⚡ "Attaque de feu - 2.5 buts/match sur la saison"

### 🏗️ Architecture

```txt
Frontend (React + Vite + Tailwind + Framer Motion)
        ↓
Supabase (PostgreSQL + Auth + Storage + RLS)
        ↓
Netlify (Hosting)
```

### 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/sieni7/racing-club-bingerville.git

# Installer les dépendances
cd frontend && npm install

# Variables d'environnement (.env)
VITE_SUPABASE_URL=https://ardriqliroipulywbuar.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZHJpcWxpcm9pcHVseXdidWFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc2NzUzMywiZXhwIjoyMDk2MzQzNTMzfQ.fFlu0UI3UeohFZM7JGB8P-zwCmy4Mj0mUf3aaH8v2Zo

# Lancer en développement
npm run dev

# Build production
npm run build
```

### 🔐 Authentification

- JWT Access Token (15 min)
- Refresh Token (7 jours, httpOnly cookie)
- Rotation automatique + reuse detection
- Rôles : SUPER_ADMIN, ADMIN, STAFF, MEMBER, JOUEUR, PARENT

### 📊 Base de données (Supabase)

| Table | Description |
|-------|-------------|
| `profiles` | Utilisateurs (extension auth.users) |
| `joueurs` | Joueurs de l'équipe |
| `matchs` | Rencontres |
| `compositions` | Composition d'équipe |
| `evenements_match` | Événements (buts, cartons) |
| `actualites` | Actualités du club |
| `settings` | Paramètres généraux |
| `roles` | Rôles disponibles |

### 📈 Statistiques (Vues)

- `stats_joueurs` (vue matérialisée)
- `top_buteurs` (top 10)
- `top_passeurs` (top 10)
- `top_discipline` (top 10)

### 🎯 Command Center

- **Ctrl + K** : Recherche globale
- **Actions rapides** : Nouveau joueur, nouveau match

### 📱 Responsive

- **375px** : Mobile (menu hamburger)
- **768px** : Tablette
- **1024px** : Desktop
- **1440px** : Grand écran

### 📚 Documentation

| Guide | Public |
|-------|--------|
| `docs/admin-guide.md` | Administrateurs |
| `docs/staff-guide.md` | Staff / Entraîneurs |
| `docs/player-guide.md` | Joueurs |
| `docs/parent-guide.md` | Parents |
| `docs/FAQ.md` | Tous |

### 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Type checking
npm run typecheck

# Lint
npm run lint
```

### 📈 Lighthouse Scores

| Métrique | Score |
|----------|-------|
| Performance | 93 |
| Accessibilité | 97 |
| Best Practices | 96 |
| SEO | 100 |

### 🚀 Déploiement

Le projet est déployé automatiquement sur Netlify à chaque push sur `master`.

**URL de production** : https://racing-club-bingerville.netlify.app

### 👥 Rôles et permissions

| Rôle | Permissions |
|------|-------------|
| 👑 SUPER_ADMIN | Accès total + gestion utilisateurs |
| ADMIN | CRUD complet |
| STAFF | Gestion opérationnelle |
| MEMBER | Consultation |
| JOUEUR | Profil + consultation |
| PARENT | Suivi enfant |

### 📄 License

Proprietary — Racing Club de Bingerville.

### 🏁 Author

**Racing Club Digital Lab**
