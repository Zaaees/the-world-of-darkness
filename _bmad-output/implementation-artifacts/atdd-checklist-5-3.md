# ATDD Checklist - Epic 5, Story 5.3: Page de Consultation des Dons

**Date:** 2026-01-26
**Author:** Zaès
**Primary Test Level:** Component/Integration

---

## Story Summary

As a joueur, I want consulter la liste de mes Dons sur une page dédiée, so that je puisse voir mes capacités narratives disponibles.

---

## Acceptance Criteria

1. **Page Layout:** Grille responsive de `GiftCard`.
2. **Data:** Affiche tous les dons (Tribu), triés par Débloqué/Verrouillé.
3. **Filtering:** Filtre par Niveau et "Uniquement débloqués".

---

## Failing Tests Created (RED Phase)

### Component Tests (1 test file)

**File:** `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.test.jsx`

- ✅ **Test:** `renders the page title`
  - **Status:** RED - Component missing
  - **Verifies:** Basic page mounting.

- ✅ **Test:** `displays gifts grouped by locked/unlocked status`
  - **Status:** RED - Component missing
  - **Verifies:** Data integration and `GiftCard` usage.

- ✅ **Test:** `filters gifts by level`
  - **Status:** RED - Component missing
  - **Verifies:** Filtering logic.

---

## Implementation Checklist

### Test: GiftsPage

**File:** `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.test.jsx`

**Tasks to make this test pass:**

- [ ] Create `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.jsx`
- [ ] Implement data fetching (mock or real hook)
- [ ] Implement filtering logic
- [ ] Use `GiftCard` component
- [ ] Run test: `npm test src/modules/werewolf/pages/GiftsPage/GiftsPage.test.jsx`

**Estimated Effort:** 3 hours
