# Story 5.2: Composant GiftCard

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a joueur,
I want voir mes Dons dans un format visuel attractif,
so that je comprenne immédiatement ce qui est disponible ou non.

## Acceptance Criteria

1.  **Visual States (Locked vs Unlocked):**
    - **Locked:** Display "Don Mystère" instead of name. Show a lock icon/glyph. Appearance should be "dimmed" or "grayed out" (Deep Woods variations). No details visible.
    - **Unlocked:** Display full details: Name, Level, Tribe (if applicable), Gnosis Cost. Appearance should be "active" (Gold/Amber accents).
    - **CRITICAL:** Use correct Deep Woods CSS variables (`--wild-primary`, `--wild-surface`, etc.).
2.  **Interaction:**
    - **Locked:** Not clickable (or shows "Locked" tooltip).
    - **Unlocked:** Clickable, triggering an action (e.g., opening a modal).
3.  **Technical Compliance:**
    - Must pass the existing test suite `web/src/modules/werewolf/components/GiftCard/GiftCard.test.jsx`.
    - Component must be a `.jsx` file.

## Tasks / Subtasks

- [x] **Component Implementation**
  - [x] Create `web/src/modules/werewolf/components/GiftCard/GiftCard.jsx`
  - [x] Implement `GiftCard` component logic (Visual states, Props: `gift`, `isUnlocked`, `onClick`)
  - [x] Ensure `data-testid` attributes match the test file: `gift-card-{id}`, `gift-card-locked-icon`.
- [x] **Styling**
  - [x] Create/Update CSS (either `GiftCard.module.css` or scoped CSS) using `werewolf-theme.css` variables.
  - [x] Implement classes: `gift-card--locked`, `gift-card--unlocked`.
- [x] **Testing**
  - [x] Run existing test `web/src/modules/werewolf/components/GiftCard/GiftCard.test.jsx`.
  - [x] Fix any mismatches between component and test.
  - [x] (Optional) Add visual regression check (manual).

### Review Follow-ups (AI)
- [x] [AI-Review][High] Fix CSS Variables to use Deep Woods theme (`--wild-*`) [GiftCard.css]
- [x] [AI-Review][Medium] Add Accessibility support (button role, keyboard) [GiftCard.jsx]
- [x] [AI-Review][Medium] Add missing Tribe field display [GiftCard.jsx]

## Dev Notes

### Relevant architecture patterns and constraints
- **Visual Identity**: Use "Deep Woods" palette.
  - Locked: Background `--wild-surface` (dark), Text `--wild-text-muted`.
  - Unlocked: Border `--wild-primary` (Amber), Text `--wild-text-main`.
- **File Structure**: Component + Style + Test in `web/src/modules/werewolf/components/GiftCard/`.
- **Existing Assets**: Use Lucide React for the Lock icon (already in dependencies).

### Source tree components to touch
- `web/src/modules/werewolf/components/GiftCard/GiftCard.jsx` (NEW)
- `web/src/modules/werewolf/components/GiftCard/GiftCard.css` (NEW)
- `web/src/modules/werewolf/components/GiftCard/GiftCard.test.tsx` (EXISTING - DO NOT DELETE)

### Testing standards summary
- Test file is ALREADY CREATED (Scope Creep from 5.1).
- **CRITICAL**: The test file uses `.tsx` extension but project rule says `.jsx` for components.
  - **ACTION**: Rename `GiftCard.test.tsx` to `GiftCard.test.jsx` if possible, OR ensure the `.jsx` component is correctly imported.
  - Note: `createGift` factory is imported from `../../../test/factories/gift-factory`. Ensure this exists.

### Project Structure Notes
- **TDD Ready**: The tests exist before the code. This is a perfect TDD scenario. Run tests `npm test` (or vitest) immediately to fail, then implement to pass.

### References
- [UX Design Specification: GiftCard](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/ux-design-specification.md#L287-L291)
- [Architecture: Frontend Architecture](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md#L117-L121)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List
- Implemented `GiftCard` component with locked/unlocked states.
- Created `GiftCard.css` using `werewolf-theme.css` variables (`--primary-color`, `--surface-color` mapped to design requirements).
- Renamed test file to `.jsx` and updated to use `jsdom` environment via `web/vite.config.js`.
- Verified component tests pass (4/4 passed).
- Note: Full regression suite showed failures in `vampire` module (unrelated to `werewolf` changes).

### File List
web/src/modules/werewolf/components/GiftCard/GiftCard.jsx
web/src/modules/werewolf/components/GiftCard/GiftCard.css
web/src/modules/werewolf/components/GiftCard/GiftCard.test.jsx
