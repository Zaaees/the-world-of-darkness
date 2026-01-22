# Epic 1: Fondation & Accès Garou - Test Design

**Epic**: 1
**Story**: 1.5 Protection des Routes - Accès Refusé
**Scope**: Targeted (Story 1.5)
**Status**: Draft

## Risk Assessment (Story 1.5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- |
| R-1-5-01 | SEC | **Auth Bypass**: Direct access to `/werewolf/*` deep links without role | 2 (Possible) | 3 (Critical) | **6** | Implement `RequireWerewolfRole` Guard wrapper on ALL module routes |
| R-1-5-02 | BUS | **UX Degradation**: Content flashing before redirect | 3 (Likely) | 1 (Minor) | 3 | Use `isLoading` state in `useUserRoles` to blockade rendering until check complete |
| R-1-5-03 | SEC | **API Abuse**: Direct API calls to backend without UI checks | 2 (Possible) | 3 (Critical) | **6** | Verify Backend Middleware (Story 1.3) verifies role on every request |

## Coverage Matrix (Story 1.5)

| Requirement | Test Level | Priority | Risk Link | Test Count | Owner |
| ----------- | ---------- | -------- | --------- | ---------- | ----- |
| **FR2** (Block Access) | Component | P0 | R-1-5-01 | 2 | Dev |
| **FR2** (Redirection) | Component | P1 | R-1-5-02 | 2 | Dev |
| **FR2** (403 Message) | Component | P2 | - | 1 | Dev |
| **FR2** (Deep Link Prot) | E2E | P0 | R-1-5-01 | 1 | QA |

## Test Scenarios & Execution Order

### P0 Tests (Critical - Run on Every Commit)

1.  **Component**: `RequireWerewolfRole` should render children if role is present.
2.  **Component**: `RequireWerewolfRole` should redirect to `/vampire` if role is absent.
3.  **E2E**: User *without* role accessing `/werewolf/sheet` directly is redirected to `/vampire`.

### P1 Tests (Important - Run on PR)

1.  **Component**: `RequireWerewolfRole` should show `LoadingSpinner` while `isLoading` is true.
2.  **Component**: `RequireWerewolfRole` should NOT render children while loading.

### P2 Tests (Nice to Have)

1.  **Component**: Verify 403 error message wording if redirect is not used (Generic 403 page).

## Resource Estimates

- **P0 Scenarios**: 3 tests (1h)
- **P1 Scenarios**: 2 tests (0.5h)
- **Total Effort**: ~1.5 hours

## Quality Gate Criteria

- ✅ All P0 Tests Pass
- ✅ No High-Risk (Score ≥ 6) Unmitigated
    - *R-1-5-01 Mitigation*: Implemented in `web/src/modules/werewolf/routes.jsx`
    - *R-1-5-03 Mitigation*: Verified in Backend (Story 1.3)
