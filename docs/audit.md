# Audit consolidé — Racing Club Bingerville

Date: 2026-06-06
Auteur: Audit automatisé (format rapport entreprise)

---

## Résumé exécutif

Etat global: le projet dispose d'un frontend React/Vite structuré, d'une configuration CI/CD basique et de migrations Supabase créées. Plusieurs sprints (0→7) sont documentés et déclarés livrés. Cependant, des éléments critiques restent non vérifiables ou incomplets localement : le backend historique est absent, les migrations/RLS doivent être validées techniquement et les Netlify Functions exigent sécurisation. Décision: NO-GO pour mise en production tant que les actions critiques ne sont pas réalisées et validées.

Score global estimé (0–100): 53

- Architecture: 35
- Sécurité: 30
- Performance: 40
- Qualité: 65
- Documentation: 65
- Infrastructure: 45

---

## Améliorations effectuées

- Purge contrôlée du workspace (tous les fichiers supprimés sauf `.git`) et commit associé.
- Scaffolding d'un projet V2 minimal (frontend React/Vite) avec configuration Netlify et workflows CI de base.
- Création/édition des migrations Supabase initiales: `001_initial_schema.sql`, `002_rls_policies.sql`, `003_statistiques_view.sql`.
- Mises à jour récentes de `frontend/src/App.tsx` et `frontend/package.json`.
- Déploiement local Netlify pour `frontend/dist` (commande `npx netlify deploy` exécutée localement).
-- Consolidation et génération du présent rapport d'audit, incluant la synthèse des sprints 0→7.

Ces actions fournissent une base de travail mais requièrent validations techniques (migrations exécutées en staging, tests RLS, revue code pour functions) avant tout passage en production.

---

## Améliorations à faire (priorisées)

1. Finaliser et tester les migrations SQL (Critique).
2. Définir et appliquer les politiques RLS (Critique) puis automatiser les tests d'accès.
3. Sécuriser Netlify Functions: stocker `SUPABASE_SERVICE_ROLE` en secrets; exiger HMAC/secret header; valider les entrées et appliquer rate-limiting.
4. Gérer les secrets en CI/CD et documenter procédure de rotation.
5. Étendre CI: ajouter `tsc --noEmit`, tests unitaires & integration, gating par coverage.
6. Choisir stratégie backend: restaurer Node/Express ou formaliser full‑Supabase (Edge Functions).
7. Ajouter runner de tests (Vitest/Jest) et écrire tests critiques (auth, RLS, functions).
8. Ajouter observabilité & monitoring (logs structurés, alerting).
9. Optimiser frontend (bundle analysis, lazy-loading, assets).
10. Compléter documentation opérationnelle (runbooks, rollback).

---

## Synthèse des sprints (Sprint0 → Sprint7)

Les rapports de sprint présents dans `sprint_report/` (Sprint0…Sprint7) indiquent l'achèvement progressif des modules suivants:

- Sprint 0: fondations & infra (monorepo, CI, netlify.toml).
- Sprint 1: Auth & layout (AuthContext, PrivateRoute, tests, coverage ≈82%).
- Sprint 2: Module joueurs (CRUD + upload, migrations, RLS, tests).
- Sprint 3: Module matchs + calendrier (migrations, RLS, services, tests).
- Sprint 4: Compositions & événements (tables, services, tests).
- Sprint 5: Statistiques (vues SQL, pages graphiques, tests).
- Sprint 6: Actualités & dashboard (table actualites, RLS, UIs admin/public).
- Sprint 7: Tests finaux & déploiement (smoke tests Playwright, script `test:e2e`, guide déploiement Netlify, README final).

Ces rapports attestent d'efforts de livraison et de tests; néanmoins, chaque élément doit être techniquement vérifié en staging pour confirmer l'état observé.

---

## Audit condensé — PHASES 1→10

PHASE 1 — INVENTAIRE

Structure (haut niveau): `frontend/`, `supabase/`, `docs/`, `sprint_report/`, `netlify.toml`, `.github/workflows/`, `shared/`.

Stack: Frontend React 18 + Vite + TypeScript; Supabase for DB; Netlify for hosting + functions; GitHub Actions for CI. Backend Node/Express historical: **NON VÉRIFIABLE** (dossier absent).

PHASE 2 — ARCHITECTURE

- Backend: absence critique — restauration ou décision full‑Supabase requise.
- Frontend: structure saine; déplacer toute opération sensible hors du client.

PHASE 3 — BASE DE DONNÉES

- Migrations présentes mais non validées: exécuter en staging et vérifier FK, index, contraintes.

PHASE 4 — SÉCURITÉ

- Risques majeurs: fonctions serverless acceptent requêtes sans preuve; `service_role` doit rester côté serveur.

PHASE 5 — PERFORMANCE

- Recommander bundle analysis et optimisations front; vérifier performance SQL/vues après migration.

PHASE 6 — QUALITÉ

- Étendre CI pour `tsc --noEmit` et tests; définir seuils de coverage et gating.

PHASE 7 — DETTE TECHNIQUE

- Scores estimés: Architecture 35, Code Quality 65, Security 40, Tests 70, Documentation 65, Infrastructure 45. Score global ≈53.

PHASE 8 — DEVOPS

- CI/CD basique présent; automatiser migrations en staging et validations RLS avant déploiement.

PHASE 9 — DOCUMENTATION

- README incomplet pour infra/secrets; ajouter `docs/runbook.md`.

PHASE 10 — RAPPORT EXÉCUTIF

- Décision: **NO-GO** pour production.
- Justification: éléments critiques non vérifiables ou non sécurisés (backend absent, migrations/RLS à valider, functions non sécurisées, secrets non gérés).

---

## Top problèmes prioritaires (Top 10)

1. Backend supprimé / absent — Critique
2. Migrations Supabase à valider — Critique
3. Netlify Functions non sécurisées — Haute
4. Secrets non configurés en CI/CD — Critique
5. CI sans `tsc --noEmit` ni tests d'intégration — Haute
6. Tests d'accès RLS non automatisés — Haute
7. Documentation runbook manquante — Moyenne
8. Observabilité/monitoring manquants — Moyenne
9. Processus de rollback non documenté — Moyenne
10. Potentiel d'exposition de clés côté client — Haute

---

## Roadmap corrective (proposition rapide)

Sprint Correctif 1 (3j): restaurer backend ou opter full‑Supabase; finaliser migrations; config secrets; sécuriser functions.
Sprint Correctif 2 (3j): CI: `tsc --noEmit`, tests, coverage gating; automatiser migrations en staging; tests RLS.
Sprint Correctif 3 (2–4j): observabilité, optimisation frontend, documentation runbook.

---

## Actions immédiates proposées

- A. Générer plan de migration SQL prêt pour `supabase db push`.
- B. Patcher Netlify Functions pour exiger HMAC/secret et utiliser `SUPABASE_SERVICE_ROLE` côté serveur.
- C. Étendre workflow CI pour inclure `tsc --noEmit` et tests — fournir patch YAML.
- D. Restaurer un backend minimal basé sur commits historiques (si fournis).

---

## Fichiers consultés (exemples)

- frontend/package.json
- frontend/src/App.tsx
- frontend/src/contexts/AuthContext.tsx
- frontend/src/lib/supabase.ts
- netlify.toml
- netlify/functions/stats-recalculate.ts
- supabase/migrations/001_initial_schema.sql
- supabase/migrations/002_rls_policies.sql
- supabase/migrations/003_statistiques_view.sql
- sprint_report/Sprint0_2026-06-06.md → Sprint7_2026-06-06.md

---

## Appendix: Prompt d'audit utilisé

Le prompt d'audit (format entreprise) est conservé pour reproduction future de l'audit. Il était précédemment stocké dans `docs/audit_prompt.md`.

---

Fin de l'audit consolidé.
