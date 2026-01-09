# Story 3.1: Attribution Logic with Soft Warning

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Game Master,
I want to assign rituals to players with a warning if they don't meet the requirements,
so that I can manage character progression while maintaining game balance rules (with override capability).

## Acceptance Criteria

1. **Given** a selected ritual and a target player (character state), **When** I click "Learn/Assign", **Then** the system checks Clan and Blood Potency requirements against the character's stats.
2. **Given** requirements are met, **When** the action is triggered, **Then** the ritual ID is added to the player's ritual list immediately.
3. **Given** requirements are NOT met (e.g. wrong Clan), **When** the action is triggered, **Then** a Confirmation Modal appears stating "Pré-requis non remplis" and detailing the mismatch.
4. **Given** the warning modal is open, **When** I click "Forcer l'apprentissage" (Override), **Then** the ritual is added despite the mismatch.
5. **Given** the warning modal is open, **When** I click "Annuler", **Then** no change occurs.

## Tasks / Subtasks

- [x] Task 1: Store Logic for Attribution
  - [x] Update `useGrimoireStore.js` to include a mock character state (or connect to real character state if available - likely mock for now).
  - [x] Implement `canLearnRitual(character, ritual)` utility/selector checks:
    - Logic: `ritual.clan_requirement` vs `character.clan`.
    - Logic: `ritual.level` vs `character.bloodPotency` (or specific discipline level? usually Discipline Level, but story serves Blood Potency or "requirements"). Let's assume standard V20: Character needs Discipline at Ritual Level.
    - **Clarification**: FR5 says "Clan et Sang". Let's implement checks for Discipline Level and Clan.
  - [x] Implement `learnRitual(ritualId)` action.

- [x] Task 2: UI Implementation (Attribution Action)
  - [x] Add "Apprendre" button to `RitualCard` (GM View only? For now assume GM mode active).
  - [x] Create `ConfirmationModal` component (Generic or specific?). Specific `RequirementWarningModal` might be better.
  - [x] Connect button to store action with validation check.

- [x] Task 3: Testing
  - [x] Unit Test `canLearnRitual` logic (Success, Fail Clan, Fail Level).
  - [x] Unit Test `learnRitual` action (updates state).
  - [x] Component Test for Modal appearance on failure.

- [x] [AI-Review][Medium] Fix fragile UI logic in RitualCard (Done)

## Dev Notes

### Technical Debt
- **Mock Character**: `useGrimoireStore.js` uses a hardcoded `MOCK_CHARACTER`. This must be replaced with real character state in a future story.
- **Strings**: `rules.js` uses hardcoded French error messages.

### Architecture Compliance

- **State**: Attribution logic belongs in the Store (`useGrimoireStore`), or a dedicated `useCharacterStore` if it exists. *Note: For this story, extending `useGrimoireStore` to mock/manage "Active Character" context is acceptable if no global character store exists yet.*
- **UI**: Modals should use a Portal or be top-level.
- **Naming**: Code in English, UI text in specific French ("Pré-requis non remplis").

### Technical Requirements

- **Validation Logic**:
  - `ritual.discipline` level check.
  - `ritual.clan` check (if specific clan required).
- **Mocking**: Since full character sheet integration isn't complete, mock a `currentUser` or `targetCharacter` object in the store for testing usage.

### References

- [Epics: Story 3.1](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/epics.md)
- [Architecture: Frontend](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md)

## Dev Agent Record

### Agent Model Used

Antigravity

### Completion Notes List

- Implemented `rules.js` for validation logic (English code, French messages).
- Updated `useGrimoireStore.js` with `MOCK_CHARACTER`, attribution logic, and restored filter/setRituals actions for compatibility.
- Created `RequirementWarningModal.jsx` using Portals and Framer Motion.
- Updated `RitualCard.jsx` to include "Apprendre" button and modal integration.
- Added comprehensive tests in `rules.test.js` and updated `useGrimoireStore.test.js`.

### File List

- src/modules/vampire/features/rituals/stores/useGrimoireStore.js
- src/modules/vampire/features/rituals/stores/useGrimoireStore.test.js (Updated)
- src/modules/vampire/features/rituals/components/RitualCard.jsx
- src/modules/vampire/features/rituals/components/RequirementWarningModal.jsx (New)
- src/modules/vampire/features/rituals/utils/rules.js (New)
- src/modules/vampire/features/rituals/utils/rules.test.js (New)
