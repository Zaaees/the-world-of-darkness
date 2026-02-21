# Code Review Findings: Story 5.2 Component GiftCard

**Story:** `5-2-composant-giftcard.md`
**Reviewer:** Antigravity (Adversarial Mode)

## 🔴 CRITICAL / HIGH ISSUES
1.  **AC Violation (CSS Variables):**
    - **Requirement:** AC 3 states "Must use the 'Deep Woods' CSS variables (`--wild-primary`, `--wild-surface`, etc.)".
    - **Implementation:** `GiftCard.css` uses generic variables (`--surface-color`, `--primary-color`).
    - **Impact:** Breaks visual consistency with the specific "Deep Woods" theme requirements.

## 🟡 MEDIUM ISSUES
1.  **Accessibility (A11y):**
    - **Issue:** The main container is a `div` with `onClick` but lacks `role="button"`, `tabIndex="0"`, and `onKeyDown` handlers.
    - **Impact:** Keyboard users and screen readers cannot interact with the unlocked card.
2.  **Missing Content (AC Partial):**
    - **Requirement:** AC 1 Unlocked state lists "Tribe (if applicable)".
    - **Implementation:** Code displays `name_fr`, `level`, `gnosis_cost`, but **missing** `tribe`.

## 🟢 LOW ISSUES
1.  **Hardcoded Fallbacks:**
    - **Issue:** CSS uses hardcoded hex codes as fallbacks (`#261a12`, `#CC7722`).
    - **Impact:** Maintenance burden if theme values change; fallbacks might mislead during dev if theme fails to load.

## Decisions

Please select an action:
1.  **Fix them automatically** (I will update CSS to use `--wild-*`, add Tribe to JSX, and fix A11y).
2.  **Create action items** (I will add tasks to the story).
3.  **Show me details**.
