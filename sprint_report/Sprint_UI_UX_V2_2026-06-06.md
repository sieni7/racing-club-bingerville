# SPRINT UI/UX V2 - SPORT INTELLIGENCE DASHBOARD

Date: 2026-06-06

---

## 1 - TITRE

**Sprint UI/UX V2 : Sport Intelligence Dashboard - Transformation Produit**

---

## 2 - OBJECTIFS STRATÉGIQUES

Transformer l'application CRUD actuelle en **"Sport Intelligence Dashboard"** de niveau professionnel (type FIFA + Stripe + Notion).

---

## 3 - ASSIGNATION

| Agent | Rôle | Responsabilités |
|-------|------|-----------------|
| **UX_STRATEGIST** | Vision produit | Définition des narratifs, insights, parcours |
| **UI_DESIGNER** | Design system | Composants, couleurs, typographie, animations |
| **FRONTEND_ENGINEER** | Intégration | Composants React, Framer Motion, Tailwind |
| **DATA_VIZ_ENGINEER** | Graphiques | Recharts, animations, storytelling |
| **ANIMATION_ENGINEER** | Micro-interactions | Transitions, hover, pulse, score updates |
| **QA_ENGINEER** | Validation | Performance, responsive, accessibilité |
| **TECH_LEAD** | Coordination | Revue finale, validation |

---

## 4 - DESIGN SYSTEM V2 (Enterprise Grade)

### Typographie

| Élément | Police | Taille | Usage |
|---------|--------|--------|-------|
| **H1** | Geist / Inter | 36px | Insights, titres principaux |
| **H2** | Geist / Inter | 24px | Sections |
| **Body** | Geist / Inter | 16px | Données |
| **Caption** | Geist / Inter | 13px | Métadonnées |

### Palette Sport Tech

```txt
Primary:     #0B5FFF  (Sport Tech Blue)
Success:     #22C55E  (Victoire / But)
Warning:     #F59E0B  (Alerte / Carton jaune)
Danger:      #EF4444  (Défaite / Carton rouge)
Background:  #0B0F1A  (Dark tech)
Card BG:     #1A1F2E  (Glass card)
Text:        #F1F5F9  (Principal)
Text muted:  #64748B  (Secondaire)
```

### UI Patterns

| Pattern | Valeur | Usage |
|---------|--------|-------|
| **Glass cards** | `backdrop-blur-md bg-white/5` | Cartes dashboard |
| **Hover lift** | `hover:-translate-y-2 transition-all` | Cartes joueurs |
| **Soft glow** | `shadow-[0_0_15px_rgba(11,95,255,0.3)]` | Éléments actifs |
| **Micro animations** | Framer Motion | Transitions |

---

## 5 - NOUVELLE ARCHITECTURE UX

### Dashboard (Match Intelligence Overview)

```txt
┌─────────────────────────────────────────────────────────────────┐
│  🟢 PROCHAIN MATCH (Hero Card)                                  │
│  Racing Club vs ASEC - Dimanche 15/06 - 16h00 - Domicile        │
│  [Prévisualisation] [Composition] [Notifications]               │
├───────────────────────────────┬─────────────────────────────────┤
│  ⚽ DERNIER RÉSULTAT           │  📈 TOP 3 JOUEURS               │
│  Racing 3-1 ASEC              │  🥇 Dupont (8 buts)              │
│  Victoire - 01/06/2026        │  🥈 Martin (5 passes)            │
│  [Voir les détails]           │  🥉 Koné (4 clean sheets)        │
├───────────────────────────────┴─────────────────────────────────┤
│  🧠 INSIGHT AUTOMATIQUE                                         │
│  "L'équipe marque 68% des buts en deuxième mi-temps"            │
│  "Dupont a marqué lors des 3 derniers matchs"                   │
├─────────────────────────────────────────────────────────────────┤
│  📅 TIMELINE SEMAINE                                            │
│  Lun │ Mar │ Mer │ Jeu │ Ven │ Sam │ Dim                        │
│       │     │     │     │     │     │ 🟢 Racing vs ASEC         │
└─────────────────────────────────────────────────────────────────┘
```

### Page Joueurs (Cards + Insights)

```txt
┌─────────────────────────────────────────────────────────────────┐
│  [🔍 Search] [⚡ Forme: Tous] [🎯 Poste: Tous] [📊 Rating]       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ [Photo]      │ │ [Photo]      │ │ [Photo]      │             │
│  │ Jean Dupont  │ │ Mamadou Koné │ │ Lucas Martin │             │
│  │ Attaquant    │ │ Défenseur    │ │ Milieu       │             │
│  │ 🔥 8 buts    │ │ 🛡️ 4 clean   │ │ 🎯 5 passes   │             │
│  │ ⚡ Forme: +  │ │ 📉 Forme: =  │ │ 🔥 Forme: +  │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│  👤 Drawer latéral (clic joueur)                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Détails joueur + heatmap performance + dernier match        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Page Matchs (Timeline System)

```txt
┌─────────────────────────────────────────────────────────────────┐
│  📅 CALENDRIER + TIMELINE                                       │
├─────────────────────────────────────────────────────────────────┤
│  🟢 PLANIFIÉ                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Racing Club vs ASEC - Dimanche 15/06 - 16h00               ││
│  │ [Préparer la composition] [Notifier]                        ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  🟡 EN COURS                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Racing 2-1 Africa Sports                                    ││
│  │ ████████████░░░░ 67'                                        ││
│  │ 🟢 But: Dupont (32')  🟡 Carton: Koné (45')                 ││
│  └─────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  🔵 TERMINÉ                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Racing 3-1 ASEC - Victoire                                  ││
│  │ Feuille de match │ Statistiques │ Résumé                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Navigation (Command Center)

```txt
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ Racing Club de Bingerville                                   │
│                                                                  │
│  [Dashboard] [Joueurs] [Matchs] [Stats] [Actualités]            │
│                                                                  │
│  🔍 Ctrl + K (Recherche globale)                                │
│  ⚡ Actions rapides : + Joueur  + Match  + Actualité            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6 - TÂCHES PAR AGENT

### UX_STRATEGIST (1j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| UX.1 | Définir les insights automatiques | 0.5j | 5 règles métier |
| UX.2 | Définir les narratifs dashboard | 0.5j | Storytelling validé |
| UX.3 | Définir le scoring joueur (rating) | 0.5j | Formule mathématique |

### UI_DESIGNER (1j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| UI.1 | Créer palette Sport Tech | 0.25j | Tokens CSS |
| UI.2 | Configurer typographie (Inter/Geist) | 0.25j | Google Fonts |
| UI.3 | Créer composants Glass card | 0.25j | `backdrop-blur` |
| UI.4 | Créer système d'ombres/glow | 0.25j | 3 niveaux |

### FRONTEND_ENGINEER (2j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| FE.1 | Refonte Dashboard (hero + insights) | 1j | Design validé |
| FE.2 | Refonte Joueurs (cards + drawer) | 1j | Layout moderne |
| FE.3 | Refonte Matchs (timeline) | 1j | UX storytelling |
| FE.4 | Refonte Stats (narrative) | 0.5j | Insights dynamiques |
| FE.5 | Refonte Actualités (feed) | 0.5j | Style média |
| FE.6 | Navigation Command Center | 0.5j | Ctrl+K + actions |

### DATA_VIZ_ENGINEER (0.5j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| DV.1 | Créer heatmap performance joueur | 0.25j | Visualisation |
| DV.2 | Créer momentum bar (domination) | 0.25j | Animation |
| DV.3 | Créer graphiques storytelling | 0.25j | Recharts |

### ANIMATION_ENGINEER (0.5j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| AN.1 | Installer Framer Motion | 0.25j | Dépendance |
| AN.2 | Ajouter hover lift cartes | 0.25j | Transition |
| AN.3 | Ajouter pulse sur but/score | 0.25j | Animation |
| AN.4 | Ajouter skeletons loading | 0.25j | Shimmer |

### QA_ENGINEER (0.5j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| QA.1 | Tester responsive complet | 0.25j | Mobile first |
| QA.2 | Tester performances (Lighthouse) | 0.25j | ≥90 |
| QA.3 | Tester animations (60fps) | 0.25j | Pas de lag |

### TECH_LEAD (0.25j)

| # | Tâche | Durée | Critère |
|---|-------|-------|---------|
| TL.1 | Revue architecture UI | 0.25j | Composants réutilisables |
| TL.2 | Validation finale | 0.25j | Build OK |

---

## 7 - DÉROULEMENT

### Jour 1 - Foundation & Design System

| Horaire | Tâche | Agent |
|---------|-------|-------|
| 09h-11h | Définition insights + scoring | UX_STRATEGIST |
| 11h-13h | Palette + typographie + glass cards | UI_DESIGNER |
| 14h-16h | Installation Framer Motion + animations | ANIMATION_ENGINEER |
| 16h-17h | Dashboard refonte début | FRONTEND_ENGINEER |

### Jour 2 - Components & Pages

| Horaire | Tâche | Agent |
|---------|-------|-------|
| 09h-12h | Dashboard complet | FRONTEND_ENGINEER |
| 12h-13h | Joueurs cards + drawer | FRONTEND_ENGINEER |
| 14h-16h | Matchs timeline | FRONTEND_ENGINEER |
| 16h-17h | Stats narrative | FRONTEND_ENGINEER |

### Jour 3 - Polish & Validation

| Horaire | Tâche | Agent |
|---------|-------|-------|
| 09h-10h | Actualités feed | FRONTEND_ENGINEER |
| 10h-12h | Command Center (Ctrl+K) | FRONTEND_ENGINEER |
| 12h-13h | Graphiques + heatmap | DATA_VIZ_ENGINEER |
| 14h-15h | Tests QA | QA_ENGINEER |
| 15h-16h | Corrections finales | FRONTEND_ENGINEER |
| 16h-17h | Revue TECH_LEAD + build | TL |

---

## 8 - DURÉE TOTALE

| Composant | Durée |
|-----------|-------|
| UX_STRATEGIST | 1j |
| UI_DESIGNER | 1j |
| FRONTEND_ENGINEER | 2j |
| DATA_VIZ_ENGINEER | 0.5j |
| ANIMATION_ENGINEER | 0.5j |
| QA_ENGINEER | 0.5j |
| TECH_LEAD | 0.25j |
| **TOTAL** | **4 jours** |

---

## 9 - INSTALLATION DÉPENDANCES

```bash
cd frontend
npm install framer-motion
npm install react-hotkeys-hook  # Pour Ctrl+K
```

---

## 10 - COMMIT

```bash
git add .
git commit -m "feat(ui): Sport Intelligence Dashboard V2 - Enterprise UX

UX TRANSFORMATION:
- Dashboard narratif avec insights automatiques
- Hero card prochain match
- Timeline match semaine
- Insight engine (5 règles métier)

DESIGN SYSTEM V2:
- Palette Sport Tech (#0B5FFF, #22C55E, #F59E0B, #EF4444)
- Typographie Inter/Geist
- Glass cards (backdrop-blur)
- Hover lift + soft glow

COMPOSANTS:
- Player cards avec rating
- Drawer latéral détails joueur
- Match timeline (planifié/en cours/terminé)
- Feed actualités style média

ANIMATIONS:
- Framer Motion
- Score pulse animation
- Loading skeletons

NAVIGATION:
- Command Center (Ctrl+K)
- Quick actions

STORYTELLING:
- Heatmap performance
- Momentum bar
- Graphiques narratifs

UI/UX V2 completed in 4 days
"

git push origin master
```

---

## 11 - MÉTRIQUES CIBLES

| Métrique | Cible |
|----------|-------|
| Lighthouse Performance | ≥90 |
| Lighthouse Accessibility | ≥95 |
| Lighthouse Best Practices | ≥95 |
| First Contentful Paint | <1.5s |
| Time to Interactive | <3s |

---

**✅ Sprint UI/UX V2 prêt à être exécuté. 4 jours de développement.**

**Fin de transmission.**
