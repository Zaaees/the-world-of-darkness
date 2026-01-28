# ATDD Checklist - Epic 5, Story 5.4: Dashboard MJ - Déblocage des Dons

**Date:** 2026-01-26
**Author:** Zaès
**Primary Test Level:** Component/Integration

---

## Story Summary

As a MJ, I want débloquer des Dons spécifiques pour un joueur, so that je puisse récompenser sa progression narrative.

---

## Acceptance Criteria

1. **Admin UI:** Page réservée MJ (`/werewolf/admin/gifts`).
2. **Selection:** Choix du joueur.
3. **Action:** Liste des dons avec Checkbox/Toggle pour débloquer.

---

## Failing Tests Created (RED Phase)

### Component Tests (1 test file)

**File:** `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.test.jsx`

- ✅ **Test:** `renders the page title`
  - **Status:** RED - Component missing
  - **Verifies:** Page mounting.

- ✅ **Test:** `allows selecting a player`
  - **Status:** RED - Component missing
  - **Verifies:** User selection input.

- ✅ **Test:** `displays unlock toggles for gifts`
  - **Status:** RED - Component missing
  - **Verifies:** Admin controls.

---

## Implementation Checklist

### Test: AdminGiftsPage

**File:** `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.test.jsx`

**Tasks to make this test pass:**

- [ ] Create `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.jsx`
- [ ] Implement player selection (mock or API)
- [ ] Implement gift list with checkboxes
- [ ] Implement `unlock` mutation
- [ ] Run test: `npm test src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.test.jsx`

**Estimated Effort:** 3 hours
