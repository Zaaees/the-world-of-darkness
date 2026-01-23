# ATDD Checklist - Epic 3, Story 3.1: Page de Consultation de la Fiche

**Date:** {date}
**Author:** Antigravity
**Primary Test Level:** E2E / Component

---

## Story Summary

**As a** joueur Loup-Garou
**I want** consulter ma fiche personnage sur une page dédiée
**So that** je puisse voir toutes mes informations narratives en un coup d'œil.

---

## Acceptance Criteria

1. **Given** un joueur avec une fiche existante
   **When** il accède à `/werewolf/sheet`
   **Then** il voit : Nom, Race, Auspice, Tribu (lecture seule), Histoire (éditable), Rang actuel
2. **And** la page utilise le thème "Deep Woods"
3. **And** le composant `RenownBadge` affiche son rang visuel

---

## Failing Tests Created (RED Phase)

### API Integration Tests
**File:** `tests/modules/werewolf/test_character_sheet_atdd.py`
- [ ] `test_get_character_data_api`: Verifies the API returns all narrative fields.
- [ ] `test_get_character_not_found`: Verifies 404 for missing character.

### Component Tests (Vitest)
**File:** `web/src/modules/werewolf/pages/__tests__/CharacterSheet.test.jsx`
- [ ] `renders character information from API`: Verifies page display.
- [ ] `displays the Deep Woods theme elements`: Verifies theme application.
- [ ] `renders the RenownBadge with correct rank`: Verifies badge integration.

**File:** `web/src/modules/werewolf/components/__tests__/RenownBadge.test.jsx`
- [ ] `renders the correct rank name`: Verifies rank logic (1=Cliath).

---

## Implementation Checklist

### Backend: API Endpoint
- [ ] Implement `get_character_handler` in `modules/werewolf/routes.py`
- [ ] Implement `get_character_by_user_id` in `modules/werewolf/services/character_service.py`
- [ ] Ensure `WerewolfStore` supports fetching narrative data.

### Frontend: Components & Pages
- [ ] Create `web/src/modules/werewolf/components/RenownBadge.jsx` with rank logic.
- [ ] Create `web/src/modules/werewolf/pages/CharacterSheet.jsx`.
- [ ] Add route for `/werewolf/sheet` in `web/src/modules/werewolf/routes.jsx`.
- [ ] Use `DeepWoods` context or CSS classes for theme.

### Verification
- [ ] Run backend tests: `pytest tests/modules/werewolf/test_character_sheet_atdd.py`
- [ ] Run frontend tests: `npm test web/src/modules/werewolf/pages/__tests__/CharacterSheet.test.jsx`

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅
- ✅ All tests written and failing.
- ✅ Implementation checklist created.

### GREEN Phase (DEV Team)
- Implement minimal code to pass each test.
- Use `data-testid` for reliable assertions.

### REFACTOR Phase
- Improve UI layout and narrative editing UX.
- Ensure performant API calls.
