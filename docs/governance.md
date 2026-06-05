# Governance du Projet

## Règles d'Or
> "If it's not enforceable by CI, it does not exist."

## Gates de Validation

### 1. Type Safety Gate
- ❌ No `any`
- ❌ No `as any`
- ❌ No `@ts-ignore`

### 2. API Contract Gate
- Toute route POST/PUT doit avoir une validation Zod (ex: `validateRequest(schema)`).

### 3. Architecture Gate
- **Controllers** : Orchestration uniquement.
- **Services** : Logique métier.
- **Repositories** : Accès base de données uniquement.
- ❌ Aucun appel direct à `Model.find()` ou équivalent en dehors des repositories.
- ❌ **Stats Engine** : Interdiction absolue de mettre à jour manuellement les statistiques (ex: `$inc`). Seul le rebuild idempotent via `recalculateForJoueur` est autorisé.

### 4. Security Gate
- **Routes sensibles** : Doivent être protégées par les middlewares `authenticate` et `authorize()`.
- **Routes publiques** : Uniquement pour la lecture.

### 5. Data Integrity Gate
- Les événements de match doivent avoir une minute valide ∈ [0, 120].
- L'ID du joueur (playerId) doit être présent et correct.

### 6. Test Coverage Gate
- Backend : Couverture minimale ≥ 80%
- Frontend : Couverture minimale ≥ 70%

### 7. Debt Scoring Engine
Un moteur de calcul évalue la dette technique à chaque pull request. Chaque violation augmente le score :

| Type de violation | Score | Détection |
|-------------------|-------|-----------|
| `any` | +3 | TypeScript AST / Regex |
| `as any` | +3 | AST / Regex Scanner |
| `@ts-ignore` | +5 | AST / Regex Scanner |
| Zod validation missing | +10 | Scan des routes POST/PUT |
| DB access in controller | +15 | Scan de l'utilisation des Modèles |
| Manual stats update | +20 | Scan de `$inc` ou `update` sur StatsJoueur |
| Missing test | +5 | Coverage Report |
| Security guard missing | +20 | Scan des routes |
| Data integrity violation| +10 | Validation de données |

**Seuils d'alerte CI :**
| Score | Action CI |
|-------|-----------|
| > 60  | ❌ BLOCK (Échec du workflow) |
| 30-60 | ⚠️ WARN (Passe avec avertissements) |
| < 30  | ✅ PASS (Succès) |

## Exécution
Pour exécuter l'ensemble des règles de gouvernance en local :
```bash
npm run governance:full
```
