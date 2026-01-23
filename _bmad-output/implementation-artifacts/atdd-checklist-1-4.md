# ATDD Checklist: Story 1.4 - Routing Frontend Conditionnel

**Story**: [1-4-routing-frontend-conditionnel.md](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/1-4-routing-frontend-conditionnel.md)
**Status**: DONE

## Acceptance Criteria Breakdown

| ID | Criterion | Level | Test File |
|---|---|---|---|
| AC1 | Redirection vers `/werewolf/dashboard` si rôle présent | E2E / Router | `AppRouter.test.jsx` |
| AC2 | Persistance de la redirection vers `/vampire` par défaut | E2E / Router | `AppRouter.test.jsx` |
| AC3 | Hook `useUserRoles` détecte correctement les rôles via API | Unit / Hook | `useUserRoles.test.js` |
| AC4 | Préservation du hash fragment lors des redirections | Router | `AppRouter.test.jsx` |

## Implementation Checklist

- [x] Implémenter le hook `useUserRoles`
- [x] Modifier `AppRouter.jsx` pour inclure les routes Lazy-loaded
- [x] Configurer `RootRedirect` avec logique de rôles
- [x] Créer la page `DashboardPage` (placeholder)
- [x] Exporter `WerewolfModule` dans `index.js`

## Execution Commands

```bash
# Lancer les tests de routing et du hook
npm test -- web/src/core/hooks/useUserRoles.test.js
npm test -- web/src/core/router/AppRouter.test.jsx
```
