# Story 1.4: Routing Frontend Conditionnel

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a joueur avec le rôle Werewolf,
I want être automatiquement redirigé vers l'interface Garou à la connexion,
so that je n'aie pas à naviguer manuellement.

## Acceptance Criteria

1. **Given** un utilisateur ayant le rôle Discord `Werewolf`
   **When** il se connecte au site
   **Then** il est redirigé vers `/werewolf/dashboard` (ou sa fiche)
   **And** la navigation affiche le thème "Deep Woods"
   **And** il ne voit que les menus Werewolf (pas Vampire)

2. **Given** un utilisateur SANS le rôle Discord `Werewolf`
   **When** il se connecte au site
   **Then** il est redirigé vers `/vampire` (comportement actuel préservé)

3. **Given** un utilisateur avec les deux rôles (`Vampire` ET `Werewolf`)
   **When** il se connecte au site
   **Then** il voit un sélecteur d'univers OU est redirigé vers son dernier choix (à discuter)

## Tasks / Subtasks

- [x] Créer un hook/store pour gérer l'état utilisateur (AC: 1, 2)
  - [x] Créer `web/src/core/hooks/useUserRoles.js`
  - [x] Le hook doit exposer : `userRoles`, `hasRole(roleId)`, `isLoading`, `isAuthenticated`
  - [x] Consommer le token OAuth Discord pour récupérer les rôles (via API ou stockage local)
  - [x] Constantes de rôles : `WEREWOLF_ROLE_ID = '1453870972376584192'`

- [x] Modifier AppRouter pour le routing conditionnel (AC: 1, 2)
  - [x] Importer le module Werewolf : `import { WerewolfModule } from '../../modules/werewolf'`
  - [x] Ajouter la route `/werewolf/*` avec lazy loading
  - [x] Modifier `RootRedirect` pour vérifier les rôles et rediriger dynamiquement
  - [x] Si Werewolf rôle → redirect `/werewolf/dashboard`
  - [x] Si Vampire rôle (sans Werewolf) → redirect `/vampire` (comportement actuel)

- [x] Créer la page Dashboard Werewolf (AC: 1)
  - [x] Créer `web/src/modules/werewolf/pages/DashboardPage.jsx`
  - [x] Page placeholder avec thème Deep Woods et message de bienvenue
  - [x] Configurer la route interne dans `routes.jsx`

- [x] Exporter le module Werewolf correctement (AC: 1)
  - [x] Mettre à jour `web/src/modules/werewolf/index.js` pour exporter `WerewolfModule`
  - [x] Vérifier que `path`, `RootComponent`, `id`, `name`, `icon` sont définis

- [x] Tests Unitaires
  - [x] Tester `useUserRoles` hook
  - [x] Tester le routing conditionnel avec mock des rôles
  - [x] Utiliser Vitest + Testing Library

## Dev Notes

### Architecture Compliance

- **Module Isolation** : Le module Werewolf doit rester isolé. Pas d'import de composants Vampire.
- **Lazy Loading** : Utiliser `React.lazy()` pour le chargement différé du module.
- **State Management** : Utiliser Zustand pour l'état utilisateur si complexe, sinon un simple hook.
- **OAuth Hash** : Préserver le hash fragment lors des redirections (pattern existant dans `RootRedirect`).

### Existing Code Patterns

**AppRouter.jsx (Current Implementation):**
```jsx
// Pattern de redirection avec préservation du hash
const RootRedirect = () => {
    const { hash } = useLocation();
    return <Navigate to={`/vampire${hash}`} replace />;
};
```

**Module Export Pattern (from Vampire):**
```javascript
// Exemple attendu pour l'export du module Werewolf
export const WerewolfModule = {
    id: 'werewolf',
    name: 'Loup-Garou',
    path: '/werewolf',
    icon: '🐺',
    RootComponent: lazy(() => import('./routes'))
};
```

### Key Constants

- **Werewolf Role ID (Discord):** `1453870972376584192`
- **Werewolf API Prefix:** `/api/modules/werewolf/*`
- **Theme Class:** `.theme-werewolf`

### API Integration

Le frontend doit récupérer les rôles utilisateur. Options :
1. **Via API Backend** : Appeler `/api/user/profile` qui retourne les rôles Discord.
2. **Via localStorage** : Si les rôles sont stockés après OAuth (approche existante à vérifier).
3. **Via Context OAuth** : Si un AuthContext existe avec les infos utilisateur.

⚠️ **Point d'attention** : Vérifier comment le module Vampire accède aux informations utilisateur actuellement.

### Previous Story Learnings

**From Story 1-2 (Theme CSS):**
- Le `WerewolfLayout` applique automatiquement `.theme-werewolf` au conteneur.
- Les pages du module Werewolf sont déjà wrappées par ce layout.

**From Story 1-3 (Middleware):**
- La vérification côté backend est en place.
- Le frontend peut faire confiance au backend pour les appels API, mais doit aussi gérer l'UX.

### Project Structure Notes

**Fichiers à modifier/créer :**
- `web/src/core/router/AppRouter.jsx` [MODIFY] - Ajouter route Werewolf + redirection conditionnelle
- `web/src/core/hooks/useUserRoles.js` [NEW] - Hook pour récupérer les rôles utilisateur
- `web/src/modules/werewolf/index.js` [MODIFY] - Export complet du module
- `web/src/modules/werewolf/routes.jsx` [MODIFY] - Ajouter routes internes
- `web/src/modules/werewolf/pages/DashboardPage.jsx` [NEW] - Page dashboard

### References

- [Source: architecture.md#frontend-architecture](../planning-artifacts/architecture.md#frontend-architecture)
- [Source: epics.md#story-14-routing-frontend-conditionnel](../planning-artifacts/epics.md#story-14-routing-frontend-conditionnel)
- [Source: project-context.md#règles-spécifiques-aux-frameworks](../../project-context.md)
- [Source: 1-2-theme-deep-woods-css.md](./1-2-theme-deep-woods-css.md) - WerewolfLayout pattern
- [Source: 1-3-middleware-de-verification-de-role-discord.md](./1-3-middleware-de-verification-de-role-discord.md) - Role ID constant

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

- ESLint validation: All new files pass linting
- Test execution: 12 tests pass (6 useUserRoles + 6 AppRouter)

### Completion Notes List

- **2026-01-21**: Implemented `useUserRoles` hook with profile API pattern
- **Pattern Used**: Uses parallel calls to `/api/vampire/profile` and `/api/modules/werewolf/profile` to detect roles
- **Auth Flow**: Reads `discord_token` from localStorage → fetches Discord user → detects guild → checks profile APIs for roles
- **Redirection Logic**: Werewolf role → `/werewolf/dashboard`, else → `/vampire` (default preserved)
- **Hash Preservation**: Hash fragment preserved during redirects for OAuth flow
- **Tests**: 12 tests covering auth states, role detection, conditional routing, and error handling
- **Code Review**: Addressed missing git tracking for new files and removed junk test file.

### Change Log

- 2026-01-21: Created useUserRoles.js hook with role detection via profile APIs
- 2026-01-21: Created DashboardPage.jsx with Deep Woods theme placeholder
- 2026-01-21: Updated routes.jsx with internal routing and lazy loading
- 2026-01-21: Updated index.js with WerewolfModule export matching Vampire pattern
- 2026-01-21: Updated AppRouter.jsx with conditional RootRedirect based on roles
- 2026-01-21: Created tests: useUserRoles.test.js (6 tests), AppRouter.test.jsx (6 tests)
- 2026-01-21: Fixed untracked files issue during code review.

### File List

- `web/src/core/hooks/useUserRoles.js` [NEW] - Role detection hook
- `web/src/core/hooks/useUserRoles.test.js` [NEW] - Tests for useUserRoles
- `web/src/core/router/AppRouter.jsx` [MODIFIED] - Conditional routing + Werewolf route
- `web/src/core/router/AppRouter.test.jsx` [NEW] - Tests for conditional routing
- `web/src/modules/werewolf/index.js` [MODIFIED] - WerewolfModule export
- `web/src/modules/werewolf/routes.jsx` [MODIFIED] - Internal routes with dashboard
- `web/src/modules/werewolf/pages/DashboardPage.jsx` [NEW] - Dashboard page

