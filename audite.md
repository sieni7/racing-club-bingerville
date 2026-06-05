# Audit technique — Racing Club Bingerville

Date: 2026-06-05

Objectif: audit rapide « anti-hallucination + anti-spaghetti + safe rebuild » du workspace. Rapport concis, priorités et commandes sûres à exécuter localement.

---

## Résumé

- Le repo est un mono-repo clair (frontend / backend / shared) avec une architecture bien pensée.
- Problèmes bloquants identifiés lors de la tentative de rebuild/typecheck côté `backend` (voir détails). 
- Recommandations priorisées pour un rebuild sûr et pour rendre le projet « enterprise-ready ».

---

## Findings (concrets)

1. TypeScript: `backend/tsconfig.json` définit `"rootDir": "./src"` mais inclut `tests/**/*` → erreur TS6059 (tests hors de rootDir). Résultat: `npm run typecheck` échoue.
2. Contrôleurs: usages de `req.params.id` sans coercition — TypeScript signale `string | string[]` (TS2345). Cause: param route non normalisé avant appel au service.
3. Usages `any`: présence répandue de `any` (controllers, services, middleware) — technique tolérable mais risque dette technique et faux-positifs à la compilation stricte.
4. Validation: middleware Zod existe mais est commenté dans des routes (`userRoutes.ts`, `matchRoutes.ts`) — exposition d'API sans validation stricte.
5. Hygiene docs: fichiers `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` manquants.
6. `.env.example` absent ou incomplet — onboarding risqué.
7. CI: `.github/workflows/ci.yml` absent ou nécessite tuning pour monorepo (utiliser `npm ci`, cache, workspace-aware scripts). Badges README sont des placeholders.

---

## Priorités (ordre recommandé)

P1 — Corriger TypeScript pour permettre un typecheck propre
- Option A (rapide): mettre `"rootDir": "."` dans `backend/tsconfig.json` pour inclure `tests` dans la compilation.
- Option B (propre): retirer `tests` de `include` et créer un `tests/tsconfig.json` dédié.

P2 — Normaliser les params de route
- Coerce `req.params.id` dans les contrôleurs avant de l'envoyer aux services :
  ```ts
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) return res.status(400).json({ message: 'Invalid id' });
  ```

P3 — Réactiver la validation Zod
- Décommenter `validateRequest` dans `routes` et s'assurer que les schémas dans `shared/schemas` correspondent.

P4 — Ajouter fichiers de hygiene et `.env.example`
- `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, et `.env.example` à la racine.

P5 — CI tuning
- `npm ci`, `actions/cache`, publier coverage/artifacts, workspace-aware commands.

---

## Commandes sûres (exécuter localement)

1) Installer dépendances propres:
```bash
npm ci
```

2) Re-run typecheck (backend):
```bash
cd backend
npm run typecheck
```

3) Run backend tests only:
```bash
npm --workspace backend test
```

4) Lint:
```bash
npm run lint --if-present
```

---

## Fix snippets prêts à coller

- `backend/tsconfig.json` (quick fix) — changez `rootDir` en `.` :

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": ".",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

- Controller param normalization (ex. `backend/src/controllers/userController.ts`):

```ts
const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
if (!id) return res.status(400).json({ message: 'Invalid id' });
const user = await userService.getUserById(id);
```

- Re-enable validation in `backend/src/routes/userRoutes.ts`:

```ts
import { validateRequest } from '../middleware/validation';
import { UserSchema } from '../../../shared/schemas/user.schema';

router.post('/', validateRequest(UserSchema), createUser);
```

---

## Recommandations long terme (technical debt reduction)

- Remplacer `any` progressivement et ajouter règle ESLint `@typescript-eslint/no-explicit-any` en mode warning → puis error.
- Ajouter un `tests/tsconfig.json` séparé pour isoler tests et éviter erreurs `rootDir`.
- Mettre en place Dependabot / CodeQL et actions pour scanning sécurité.
- Ajouter `Dockerfile` et `docker-compose.dev.yml` pour reproducibility dev env.

---

## Prochaine étape possible (je peux fournir)

- A: Contenu complet pour `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `.env.example` (préparé précédemment).
- B: Diffs précis pour `backend/tsconfig.json` et exemples de corrections de contrôleurs (prêts à coller).
- C: Patchless scripts PowerShell/Bash pour créer ces fichiers localement.

Indiquez A, B ou C et je fournis le contenu exact à coller.