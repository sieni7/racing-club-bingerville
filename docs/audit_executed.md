# Rapport d'audit exécuté — Racing Club Bingerville

Date: 2026-06-06
Auteur: Audit automatisé (format rapport entreprise)

Résumé: audit exécuté selon le prompt "AUDIT COMPLET DU REPOSITORY (MODE AUDITEUR SENIOR)" fourni dans `docs/audit_prompt.md`. Le rapport ci‑dessous suit les 10 phases demandées, cite les fichiers inspectés et indique clairement les éléments `NON VÉRIFIABLE` lorsque les artefacts n'existent pas localement.

PHASE 1 — INVENTAIRE

Repository structure (haut niveau):

- frontend/
- supabase/
- docs/
- sprint_report/
- netlify.toml
- .github/workflows/
- shared/

Stack technique et métadonnées:
- Frontend: React 18 + Vite + TypeScript + TailwindCSS (packages vus dans frontend/package.json).
- Backend: historiquement Node/Express + TypeScript + Mongoose ; **ACTUELLEMENT NON VÉRIFIABLE** (dossier `backend/` absent après purge).
- frontend/src/contexts/AuthContext.tsx
- frontend/src/lib/supabase.ts
- sprint_report/Sprint0_2026-06-06.md → Sprint6_2026-06-06.md


État observé:
- Migrations présentes: `001_initial_schema.sql`, `002_rls_policies.sql`, `003_statistiques_view.sql` — contenu à examiner et valider (présence ok mais nécessite exécution et tests en staging).

- Si migrations incomplètes → incohérences de schéma, pertes d'index, risques de performance.


PHASE 4 — AUDIT SÉCURITÉ

Auth & Secrets:
- Netlify Functions actuelles ne valident pas la provenance des requêtes ni n'exigent d'authentification HMAC/secret. Risque: fuite ou usage abusif des endpoints. Sévérité: Haute.

- Stocker `SUPABASE_SERVICE_ROLE` dans les secrets Netlify/GitHub.
- Ajouter validation HMAC/secret header sur toutes functions qui utilisent `service_role`.

PHASE 5 — AUDIT PERFORMANCE

Frontend:
Backend/DB:
- NON VÉRIFIABLE localement — exiger tests de charge sur endpoints backend ou queries SQL (vues statistiques) après migration.
TypeScript & Tests:
- Observations: frontend inclut TypeScript; CI existant mais n'inclut pas explicitement `tsc --noEmit` ou tests d'intégration complets.
- Recommandation: étendre CI pour `tsc --noEmit`, tests unitaires et integration; ajouter seuils de coverage.


Score proposé (estimation):
- Code Quality: 65/100
- Security: 40/100
- Tests: 70/100
- Documentation: 65/100
Score global approximatif: 53/100 (réévaluation nécessaire après vérifications techniques en staging)

PHASE 8 — DEVOPS

- Déploiement: secrets gérés via Netlify/GitHub, déploiement de functions conditionné à tests et revue.

PHASE 9 — DOCUMENTATION

Observations:
- README existant mais incomplet pour procédure infra, secrets et migrations.
- Ajouter `docs/runbook.md` couvrant: configuration des secrets, déploiement Netlify, exécution migrations Supabase, rollback.

Résumé chiffré (sur 10):
- Architecture: 3.5/10
- Sécurité: 3.0/10
- Performance: 4.0/10
- Documentation: 6.0/10
- Infrastructure: 4.5/10
Décision: NO-GO pour mise en production.
Justification: éléments critiques manquants ou non vérifiables (backend supprimé, migrations à valider, fonctions serverless non sécurisées, secrets non gérés). Les risques de sécurité et d'intégrité des données empêchent un déploiement sécurisé.

Top 20 problèmes prioritaires (résumé rapide):
7. Documentation runbook manquante — Moyenne — Effort: faible
8. Observabilité/monitoring manquants — Moyenne — Effort: moyen
9. Processus de rollback non documenté — Moyenne — Effort: faible
10. Potentiel d'exposition de clés côté client (audit requis) — Haute — Effort: moyen
11–20. (voir sections détaillées précédentes pour détails par catégorie)

Roadmap corrective (proposition rapide)
- Sprint Correctif 1 (3 jours):
  - Restaurer backend ou décider full‑Supabase
  - Finaliser migrations `001`/`002`/`003` et valider en staging
  - Configurer secrets (`SUPABASE_SERVICE_ROLE`) dans Netlify/GitHub
  - Sécuriser Netlify Functions (HMAC/secret + validation)
- Sprint Correctif 2 (3 jours):
  - Étendre CI: `tsc --noEmit`, tests unitaires & integration, coverage gating
  - Automatiser migrations en staging
  - Tests d'accès RLS automatisés
- Sprint Correctif 3 (2–4 jours):
- A. Exécuter et valider les migrations SQL en générant un plan de migration prêt pour `supabase db push`.
- B. Patcher les Netlify Functions pour exiger HMAC/secret et utiliser `SUPABASE_SERVICE_ROLE` côté serveur.
- docs/audit.md
- docs/audit_prompt.md
- Aucune hypothèse non vérifiable n'a été faite sans l'étiquette NON VÉRIFIABLE.
- Pour transformer ce rapport en état vérifié, exécuter les étapes de validation en staging listées ci‑dessus.
