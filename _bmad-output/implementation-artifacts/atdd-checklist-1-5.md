# ATDD Checklist - Epic 1, Story 1.5: Protection des Routes - Accès Refusé

**Date:** 2026-01-21
**Author:** Antigravity (Assistant)
**Primary Test Level:** Component

---

## Story Summary

L'utilisateur vampire sans rôle "Werewolf" ne doit pas pouvoir accéder aux pages du module loup-garou. S'il essaie, il doit être redirigé vers sa fiche vampire ou voir un message d'accès refusé thématique.

**As a** joueur Vampire (sans rôle Werewolf)
**I want** être bloqué si j'essaie d'accéder aux pages Werewolf
**So that** la séparation des univers soit maintenue

---

## Acceptance Criteria

1. **Given** un utilisateur SANS le rôle Discord `Werewolf`
   **When** il tente d'accéder à `/werewolf/*`
   **Then** il est redirigé vers `/vampire` OU page 403
   **And** si page 403, message thématique ("Accès Refusé" / "Appel de la meute non entendu")

2. **Given** un utilisateur AVEC le rôle Discord `Werewolf`
   **When** il accède à `/werewolf/*`
   **Then** l'accès est autorisé et la page s'affiche

3. **Given** l'application en cours de chargement
   **When** l'utilisateur accède à une route protégée
   **Then** un indicateur de chargement thématique est affiché

---

## Failing Tests Created (RED Phase)

### Component Tests (4 tests)

**File:** `web/src/modules/werewolf/components/RequireWerewolfRole.test.jsx`

- ✅ **Test:** renders loading spinner when isLoading is true
  - **Status:** RED - Component not implemented
  - **Verifies:** Loading state UX
  
- ✅ **Test:** redirects to /vampire when user has NO werewolf role but HAS vampire role
  - **Status:** RED - Component not implemented
  - **Verifies:** Redirection logic for existing vampires
  
- ✅ **Test:** shows 403 or access denied message when user has NO werewolf role and NO vampire role
  - **Status:** RED - Component not implemented
  - **Verifies:** Security fallback for unauthorized users
  
- ✅ **Test:** renders children when user HAS werewolf role
  - **Status:** RED - Component not implemented
  - **Verifies:** Access granted for authorized users

---

## Data Factories & Mocks

**Hook Mock Strategy:**
We mock `web/src/core/hooks/useUserRoles.js` to simulate different auth states without backend dependency.

```javascript
vi.mock('../../../core/hooks/useUserRoles', () => ({
    useUserRoles: vi.fn(),
    WEREWOLF_ROLE_ID: '1453870972376584192'
}));
```

---

## Mock Requirements

None (Hook mocked internally).

---

## Required data-testid Attributes

- `loading-spinner` - For loading state (or text matching /chargement/i)
- `vampire-page` - Target of redirection (simulated in test)
- `protected-content` - Content that should be protected (simulated in test)
- Message "Accès Refusé" - For 403 state

---

## Implementation Checklist

### Test: RequireWerewolfRole Tests

**File:** `web/src/modules/werewolf/components/RequireWerewolfRole.test.jsx`

**Tasks to make these tests pass:**

- [ ] Créer `web/src/modules/werewolf/components/RequireWerewolfRole.jsx`
- [ ] Implémenter la logique `useUserRoles`
- [ ] Gérer l'état de chargement (Spinner)
- [ ] Gérer la redirection `/vampire` si `hasVampireRole` et `!hasWerewolfRole`
- [ ] Gérer l'affichage 403 si `!hasVampireRole` et `!hasWerewolfRole`
- [ ] Render `children` si `hasWerewolfRole`
- [ ] Ajouter `WEREWOLF_ROLE_ID` constant import
- [ ] Run test: `npx vitest run web/src/modules/werewolf/components/RequireWerewolfRole.test.jsx`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run failing tests
npx vitest run web/src/modules/werewolf/components/RequireWerewolfRole.test.jsx
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**
- ✅ Failing tests written
- ✅ Mocks defined
- ✅ Checklist created

### GREEN Phase (DEV Team - Next Steps)
1. Pick failing test
2. Implement code in `RequireWerewolfRole.jsx`
3. Verify pass
4. Repeat

---

## Next Steps

1. **Wait for test run completion** (Step currently running)
2. **Hand off to DEV** (Manual update of sprint-status / Notify User)
