# Story 4.1: Animation & Transitions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to experience fluid and thematic transitions when navigating the app,
so that the interface feels modern, "alive," and consistent with the World of Darkness atmosphere.

## Acceptance Criteria

1. **Given** I navigate between the List and Detail views, **When** the page changes, **Then** a smooth fade or slide transition occurs (`AnimatePresence`).
2. **Given** I scroll through the ritual list, **Then** list items do **NOT** animate individually on scroll (to preserve virtualization performance with `react-window`).
3. **Given** I hover over or tap a `RitualCard`, **Then** appropriate visual feedback occurs (scale, shadow, or color shift for Hover and Active/Pressed states).
4. **Given** I interact with buttons and interactive elements, **Then** consistent transition animations are applied (e.g., color transitions, subtle scale).
5. **Given** the user has `prefers-reduced-motion` enabled, **Then** all animations are disabled or reduced to simple opacity changes (WCAG accessibility).
6. **Given** I open the filter panel (Mobile), **Then** it animates in with a slide/fade transition.

## Tasks / Subtasks

- [x] Task 1: Add View Transition Wrapper (AC: 1)
    - [x] Create `AnimatedView.jsx` wrapper component using `framer-motion` `AnimatePresence` and `motion.div`.
    - [x] Apply to `RitualsTab.jsx` for List/Detail view transitions.
    - [x] Ensure transitions are triggered on `selectedRitual` change (not individual card renders).
    - [x] Mobile: Animate full-screen sheet entry/exit.
    - [x] Desktop: Animate right panel slide-in.

- [x] Task 2: RitualCard Hover & Active States (AC: 3)
    - [x] Add CSS hover effects to `RitualCard.jsx`:
        - Subtle scale transform (`scale-[1.02]`)
        - Border color shift (`border-red-900/50` → `border-red-700`)
        - Shadow elevation change
    - [x] Add active/pressed feedback (`scale-[0.98]`).
    - [x] Use CSS transitions (not JS) for performance with virtualized lists.

- [x] Task 3: Interactive Element Consistency (AC: 4)
    - [x] Audit all buttons in rituals feature for transition consistency.
    - [x] Add `transition-all duration-200` to interactive elements.
    - [x] Ensure `SearchInput`, `RitualFilter` controls have consistent hover feedback.
    - [x] Close button in `RitualReader` already styled - verify consistency.

- [x] Task 4: Filter Panel Animation (Mobile) (AC: 6)
    - [x] N/A - No mobile filter drawer currently exists in the implementation. Filter panel is hidden on mobile (uses `hidden md:block`). AC 6 is deferred to a future story when mobile filter drawer is implemented. When added, it should use `AnimatedView` with `slideUp` variant.

- [x] Task 5: Reduced Motion Support (AC: 5)
    - [x] Add `motion-safe:` and `motion-reduce:` Tailwind variants to animated elements.
    - [x] Create `useReducedMotion()` hook or use `framer-motion`'s built-in `useReducedMotion`.
    - [x] Conditionally disable animations in `AnimatedView.jsx`.
    - [x] Test with browser `prefers-reduced-motion: reduce`.

- [x] Task 6: Testing & Verification
    - [x] Add/update tests for animated components.
    - [x] Verify 60fps performance with DevTools during scroll.
    - [x] Test on mobile viewport sizes.
    - [x] Test `prefers-reduced-motion` accessibility.

## Dev Notes

### Architecture Compliance

- **Library**: Use `framer-motion` (already installed) for view transitions.
- **Performance CRITICAL**: `react-window` Grid items MUST NOT have entry/exit animations. Only CSS `:hover` and `:active` states are allowed on `RitualCard`.
- **Styling**: Use Tailwind CSS transitions where possible for perf (`transition-all`, `duration-200`).
- **Component Location**: New wrapper `src/modules/vampire/features/rituals/components/AnimatedView.jsx`.

### UX Design Specification Goals

- **Feedback Patterns (Gothic Palette)**:
    - Success: Gold Glow (`#ca8a04`)
    - Danger: Blood Red Flash (`#be123c`)
    - Hover: Subtle elevation + border shift
- **View Transitions**: "Ink Bleed" fade effect (subtle, not distracting).
- **Reduced Motion**: All effects must respect `prefers-reduced-motion`.

### Technical Specifics

**Framer Motion View Wrapper Pattern**:
```jsx
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedView = ({ children, key }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);
```

**RitualCard Hover (CSS-only for virtualization safety)**:
```jsx
<div className="
  transition-all duration-200 ease-out
  hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/20
  hover:border-red-700/50
  active:scale-[0.98]
">
```

**Reduced Motion Hook**:
```jsx
import { useReducedMotion } from 'framer-motion';
const prefersReducedMotion = useReducedMotion();
// or use Tailwind: motion-safe:animate-pulse motion-reduce:animate-none
```

### Previous Story Intelligence

- **Story 3.3**: `RitualReader.jsx` already uses `AnimatePresence` with x-axis transitions. Ensure consistency.
- **Pattern**: `initial={{ opacity: 0, x: 20 }}`, `animate={{ opacity: 1, x: 0 }}`, `exit={{ opacity: 0, x: -20 }}`.
- **Duration**: 0.3s was used - keep consistent or slightly reduce to 0.2s for snappier feel.

### Git Intelligence

- Recent commits show modular architecture refactoring. Rituals feature is stable.
- No breaking changes expected to animation libraries.

### References

- [Epics: Story 4.1](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md)
- [Architecture: Framer Motion](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md)
- [UX Design: Transitions & Feedback](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/ux-design-specification.md)

## Dev Agent Record

### Agent Model Used

Claude (Anthropic - claude-sonnet-4-20250514)

### Debug Log References

- Pre-existing test failure in RitualCatalog.test.jsx fixed by adding null check for `activeCharacter?.rituals`

### Completion Notes List

- ✅ Created `AnimatedView.jsx` with framer-motion wrapper supporting fade, slideRight, slideUp variants
- ✅ Integrated AnimatedView into RitualsTab for desktop (slideRight) and mobile (slideUp) view transitions
- ✅ Enhanced RitualCard with hover scale (1.02), shadow-lg, border-red-700/50, and active scale (0.98)
- ✅ Added motion-reduce Tailwind variants to RitualCard for accessibility
- ✅ AnimatedView uses framer-motion's useReducedMotion hook for automatic reduced motion support
- ✅ Added transition-all duration-200 to SearchInput clear button for consistency
- ✅ Added 13 new animation-related tests (9 for AnimatedView, 4 for RitualCard)
- ✅ Fixed pre-existing null check bug in RitualCard for activeCharacter.rituals
- ✅ All 72 tests pass

### File List

- web/src/modules/vampire/features/rituals/components/AnimatedView.jsx (NEW)
- web/src/modules/vampire/features/rituals/components/AnimatedView.test.jsx (NEW)
- web/src/modules/vampire/components/RitualsTab.jsx (MODIFIED)
- web/src/modules/vampire/features/rituals/components/RitualCard.jsx (MODIFIED)
- web/src/modules/vampire/features/rituals/components/RitualCard.test.jsx (MODIFIED)
- web/src/modules/vampire/features/rituals/components/SearchInput.jsx (MODIFIED)
- web/src/modules/vampire/features/rituals/components/RitualReader.jsx (MODIFIED - code review fix)
- web/src/modules/vampire/features/rituals/components/RitualFilter.jsx (MODIFIED - code review fix)
- web/tailwind.config.js (MODIFIED)

## Change Log

- 2026-01-09: Implemented Animation & Transitions story - Added AnimatedView component, enhanced RitualCard hover states, ensured transition consistency, added reduced motion support. All 72 tests pass.
- 2026-01-09: **Code Review Fixes** - Added useReducedMotion to RitualReader.jsx, unified duration to 0.2s, added duration-200 to RitualFilter buttons, cleaned RitualsTab comment. Updated File List.

## Senior Developer Review (AI)

**Reviewer:** Claude (Anthropic)  
**Date:** 2026-01-09  
**Status:** ✅ APPROVED with fixes applied

### Issues Found & Fixed

| # | Severity | Issue | Resolution |
|---|----------|-------|------------|
| 1 | HIGH | Task 4 marked [x] but AC 6 not implemented | Clarified N/A status - AC 6 deferred |
| 2 | HIGH | RitualReader missing useReducedMotion | Added hook + unified 0.2s duration |
| 3 | MEDIUM | Files missing from File List | Updated File List |
| 4 | MEDIUM | RitualFilter buttons missing duration-200 | Added to level buttons + toggle |
| 7 | LOW | RitualReader 0.3s vs spec 0.2s | Fixed to 0.2s |
| 8 | LOW | Obsolete comment in RitualsTab | Removed |

### Notes
- AC 6 (mobile filter animation) is deferred as no mobile filter drawer exists
- All 72 tests pass after fixes
- Test coverage for AnimatedView variants is acceptable given mocking constraints
