---
title: 'Fix First Load Auth Redirect'
slug: 'fix-first-load-auth-redirect'
created: '2026-02-17'
status: 'completed'
stepsCompleted: [1, 2, 3, 4, 5, 6]
tech_stack: ['React', 'Vitest', 'react-router-dom']
files_to_modify: ['web/src/core/hooks/useUserRoles.js', 'web/src/core/auth/authUtils.js', 'web/src/modules/vampire/pages/SheetPage.jsx', 'web/src/core/hooks/useUserRoles.test.js']
code_patterns: ['Hook-based Auth', 'Hash Token Extraction', 'SRP', 'Dependency Injection']
test_patterns: ['Vitest hook testing', 'Global fetch mocking']
---

# Tech-Spec: Fix First Load Auth Redirect

**Created:** 2026-02-17

## Overview

### Problem Statement
Lors de la toute première connexion (cache vide), l'utilisateur est redirigé vers `/vampire` au lieu d'être correctement authentifié. Cela se produit car `AppRouter` vérifie le `localStorage` avant que le token OAuth retourné dans l'URL ne soit extrait. L'extraction du token se fait actuellement uniquement dans `VampireSheet` (`SheetPage.jsx`), créant une dépendance circulaire et du code legacy.

### Solution
Implémenter un intercepteur de token OAuth au niveau du hook principal `useUserRoles` qui s'exécute **avant** la vérification du stockage local. La logique d'extraction sera isolée dans un utilitaire dédié (`authUtils.js`) pour respecter le SRP et sera testable purement.

### Scope
- **Core**: `useUserRoles.js` (Logique principale), `authUtils.js` (Nouveau fichier).
- **Module Vampire**: `SheetPage.jsx` (Nettoyage legacy).
- **Verification**: Tests unitaires étendus.

## Context for Development

### Codebase Patterns
- **Auth**: Token JWT dans localStorage.
- **Routing**: `AppRouter` se base sur `useUserRoles`.
- **Conventions**: JSDoc en Français.

### Files to Reference

| File | Purpose | Changes |
| ---- | ------- | ------- |
| `web/src/core/auth/authUtils.js` | **[NEW]** Auth Utilities | Fonctions pures pour extraire/valider le token et nettoyer l'URL. Recçoit `location`/`history` en arguments. |
| `web/src/core/hooks/useUserRoles.js` | Auth Logic | Intégrer l'appel à `authUtils` dans le `useEffect` initial. Gérer l'expiration. |
| `web/src/modules/vampire/pages/SheetPage.jsx` | Vampire Sheet | Supprimer toute la logique d'extraction de token (Legacy). |
| `web/src/core/hooks/useUserRoles.test.js` | Tests | Ajouter les cas de tests Hash/Storage/Invalid/Expiry. |

### Technical Decisions
1. **Priorité Token**:
    - **Hash > Storage**: Si un token valide est présent dans l'URL (Hash), il **écrase** le token du `localStorage`.
    - **Invalid Hash**: Si le token dans le Hash est invalide ou malformé, l'URL est nettoyée et on **ignore** ce token (on ne fallback pas sur le Storage pour éviter les états incohérents, on force une nouvelle authentification propre).
2. **Nettoyage Intelligent & Pur**: `authUtils` prendra `window.location` et `window.history` en arguments pour faciliter les tests.
3. **Gestion Expiration (F11)**: Le paramètre `expires_in` du Hash sera extrait et stocké sous `discord_token_expires_at` (Timestamp). `useUserRoles` vérifiera cette date avant d'utiliser le token.

## Implementation Plan

### Tasks

- [x] **Task 1: Create `authUtils.js`** <!-- id: 0 -->
  - File: `web/src/core/auth/authUtils.js`
  - Action: Create utility functions:
    - `extractAuthData(hashString)`: Returns `{ token, expiresIn }` or null.
    - `clearAuthParams(history, location)`: Removes only OAuth params using `history.replaceState`, preserving other state.
    - `validateToken(token)`: Verify JWT format (3 parts) to reject OAuth errors.
  - Notes: Pure functions.

- [x] **Task 2: Update `useUserRoles.js`** <!-- id: 1 -->
  - File: `web/src/core/hooks/useUserRoles.js`
  - Action: Modify `useEffect` logic:
    1. Check Hash using `extractAuthData(window.location.hash)`.
    2. IF found: Validate.
       - If valid -> Calculate expiry (`Date.now() + expiresIn * 1000`), Save Token & Expiry to Storage, Clear Hash using `clearAuthParams(window.history, window.location)`.
       - If invalid -> Clear Hash, Clear Storage.
    3. THEN: Check Expiry. If expired -> Clear Storage.
    4. FINALLY: Proceed to fetch user if token exists.
  - Notes: Ensure `isLoading` remains `true` until the profile fetch determines final auth state.

- [x] **Task 3: Clean up `SheetPage.jsx`** <!-- id: 2 -->
  - File: `web/src/modules/vampire/pages/SheetPage.jsx`
  - Action: Remove the `useEffect` block lines ~467-516. Remove unused imports.
  - Notes: Ensure `handleLogin` remains functional.

- [x] **Task 4: Add Comprehensive Unit Tests** <!-- id: 3 -->
  - File: `web/src/core/hooks/useUserRoles.test.js`
  - Action: Add test cases:
    - `Case 1`: Hash contains valid JWT & Expiry -> Authenticates, Sets Expiry, Clears Hash.
    - `Case 2`: Hash contains invalid string -> Clears Hash/Storage.
    - `Case 3`: Token Logic checks expiry before fetch (mock Date.now).
    - `Case 4`: Deep Link preservation (mock location/history).
  - Notes: Use `vi.spyOn` for history and `vi.setSystemTime` for expiry tests.

## Review Notes
- Adversarial review completed (2026-02-17)
- Findings: 3 total, 2 fixed (F1, F3), 1 skipped (F2 - Low Priority)
- Resolution approach: Auto-fix
- **F1 (Medium)**: Implemented `safeStorage` to wrap localStorage calls.
- **F3 (Low)**: Changed invalid token logic to preserve existing sessions instead of clearing them.

### Acceptance Criteria

- [ ] AC 1: **Fresh Login**: Given empty localStorage, when accessing `/` with `#access_token=JWT&expires_in=604800`, then `localStorage` contains token and expiry, URL is cleaned, and user is authenticated.
- [ ] AC 2: **Deep Link Preservation**: Given URL `/#access_token=JWT&foo=bar`, after auth, URL becomes `/#foo=bar`.
- [ ] AC 3: **Expiration**: Given a stored token with past expiry date, when `useUserRoles` mounts, then storage is cleared and user is NOT authenticated.
- [ ] AC 4: **Impurity Free**: `authUtils` functions are testable without global window mock (passed as args in tests).

### Dependencies
- None.

### Testing Strategy
- **Automated**: `npm test useUserRoles`.
- **Manual**:
    1. **Happy Path**: Incognito window -> Discord Login -> Redirect to app -> Verify logged in & URL clean.
    2. **Expiry**: Manually set `discord_token_expires_at` to past in Console -> Reload -> Verify logout.
