# ATDD Checklist - Epic 5, Story 5.2: Composant GiftCard

**Date:** 2026-01-26
**Author:** Zaès
**Primary Test Level:** Component

---

## Story Summary

As a joueur, I want voir mes Dons dans un format visuel attractif, so that je comprenne immédiatement ce qui est disponible ou non.

---

## Acceptance Criteria

1. **Visual States (Locked vs Unlocked):**
    - **Locked:** Display "Don Mystère" instead of name. Show a lock icon/glyph. Appearance should be "dimmed" or "grayed out" (Deep Woods variations). No details visible.
    - **Unlocked:** Display full details: Name, Level, Tribe (if applicable), Gnosis Cost. Appearance should be "active" (Gold/Amber accents).
2. **Interaction:**
    - **Locked:** Not clickable (or shows "Locked" tooltip).
    - **Unlocked:** Clickable, triggering an action (e.g., opening a modal).
3. **Technical Compliance:**
    - Must pass the existing test suite `web/src/modules/werewolf/components/GiftCard/GiftCard.test.tsx`.
    - Must use the "Deep Woods" CSS variables (`--wild-primary`, `--wild-surface`, etc.).
    - Component must be a `.jsx` file: `web/src/modules/werewolf/components/GiftCard/GiftCard.jsx`.

---

## Failing Tests Created (RED Phase)

### Component Tests (1 test file)

**File:** `web/src/modules/werewolf/components/GiftCard/GiftCard.test.tsx` (59 lines)

- ✅ **Test:** `GiftCard Component > renders locked state correctly`
  - **Status:** RED - `Failed to resolve import "./GiftCard"` (Missing implementation)
  - **Verifies:** Locked state UI (name hidden, lock icon, styling)

- ✅ **Test:** `GiftCard Component > renders unlocked state correctly`
  - **Status:** RED - `Failed to resolve import "./GiftCard"` (Missing implementation)
  - **Verifies:** Unlocked state UI (details visible, styling)

- ✅ **Test:** `GiftCard Component > calls onClick handler when unlocked`
  - **Status:** RED - `Failed to resolve import "./GiftCard"` (Missing implementation)
  - **Verifies:** Interaction (click handler)

- ✅ **Test:** `GiftCard Component > does NOT call onClick handler when locked`
  - **Status:** RED - `Failed to resolve import "./GiftCard"` (Missing implementation)
  - **Verifies:** Interaction (locked state)

---

## Data Factories Created

### Gift Factory

**File:** `web/src/test/factories/gift-factory.ts` (Existing)

**Exports:**
- `createGift(overrides?)`

---

## Fixtures Created

None required for this pure component test (uses `render` from `@testing-library/react`).

---

## Mock Requirements

None.

---

## Required data-testid Attributes

### GiftCard Component

- `gift-card-{id}` - The main card container
- `gift-card-locked-icon` - The lock icon element in locked state

---

## Implementation Checklist

### Test: GiftCard Component

**File:** `web/src/modules/werewolf/components/GiftCard/GiftCard.test.tsx`

**Tasks to make this test pass:**

- [ ] Create `web/src/modules/werewolf/components/GiftCard/GiftCard.jsx`
- [ ] Create `web/src/modules/werewolf/components/GiftCard/GiftCard.css` (or module)
- [ ] Implement `GiftCard` component logic (Visual states, Props: `gift`, `isUnlocked`, `onClick`)
- [ ] Implement Locked state rendering (Don Mystère, Icon)
- [ ] Implement Unlocked state rendering (Details)
- [ ] Add `data-testid="gift-card-{id}"` and `gift-card-locked-icon`
- [ ] Implement CSS styling using "Deep Woods" variables
- [ ] Run test: `npm test src/modules/werewolf/components/GiftCard/GiftCard.test.tsx`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 2 hours

---

## Running Tests

```bash
# Run failing test
npm test src/modules/werewolf/components/GiftCard/GiftCard.test.tsx
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**
- ✅ Failing tests identified and verified (import fixed)
- ✅ Factory availability confirmed
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)

1. **Pick one failing test**
2. **Implement minimal code** (Create JSX, CSS)
3. **Run the test**
4. **Repeat**

---

## Knowledge Base References Applied

- **component-tdd.md**: Used standard Red-Green-Refactor loop for component.
- **data-factories.md**: Verified use of `createGift` factory.
