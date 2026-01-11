---
stepsCompleted: [1, 2]
inputDocuments: ['_bmad-output/implementation-artifacts/tech-spec-wip.md']
---

# the-world-of-darkness - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the-world-of-darkness, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Update `web/src/data/disciplines.js` to include complete power definitions (name, level, mechanics/narrative) for Discipline levels 6-10.
FR2: Update `getAvailableDisciplines` logic to correctly calculate `maxAccessibleLevel` for levels > 5, ensuring it respects Blood Potency/Generation limits.
FR3: Update `DisciplinesTab.jsx` to dynamically render up to 10 dots/levels instead of the current hardcoded 5.
FR4: Update `DisciplineCard` and modal components to handle the display of longer text and larger dot arrays associated with Elder powers.
FR5: Ensure "Caine Mode" or any dev/admin overrides correctly display all 10 levels when active.

### NonFunctional Requirements

NFR1: Performance - The UI must remain responsive when rendering 10 levels of powers across multiple disciplines.
NFR2: Usability - The expanded dot display must be visually clear and manageable on standard screen sizes, potentially requiring layout adjustments for 6-10 dots.
NFR3: maintainability - Implementation should rely on data-driven patterns (constants) rather than hardcoded checks where possible.

### Additional Requirements

- **No New Mechanics Engine**: The update is purely narrative/display for now; strict game rule enforcement (dice pools for new powers) is out of scope.
- **Files to Modify**: `web/src/data/disciplines.js`, `web/src/modules/vampire/components/DisciplinesTab.jsx`.
- **Testing**: Manual verification is the primary test pattern.
- **Data Source**: Use existing `DISCIPLINES` structure; `MAX_DISCIPLINE_LEVEL` is likely already 10 but requires verifying usage.
- **UI Constraints**: `DisciplinesTab.jsx` currently hardcodes to 5. `PowerCard` renders based on `power.level`.

### FR Coverage Map

FR1: Epic 5 - Update disciplines.js with level 6-10 data
FR2: Epic 5 - Update getAvailableDisciplines logic
FR3: Epic 5 - Update DisciplinesTab.jsx for 10 dots
FR4: Epic 5 - Update DisciplineCard for longer text
FR5: Epic 5 - Ensure Caine Mode shows all 10 levels

## Epic List


## Epic 5: Methuselah Disciplines Support

Enable players to view and interact with Discipline powers from levels 6 to 10.

### Story 5.1: Data Population - Elder Powers (Levels 6-10)

As a Developer,
I want to populate the `disciplines.js` file with power definitions for levels 6 through 10,
So that the application has the necessary data to display Elder powers to users.

**Acceptance Criteria:**

**Given** the existing `disciplines.js` file contains powers only up to level 5
**When** I add the provided data for levels 6-10 for all implemented disciplines
**Then** the `DISCIPLINES` object should contain valid power objects (name, level, cost, description) for levels 6-10
**And** no existing low-level powers should be modified or deleted
**And** the data structure should remain consistent with levels 1-5 (narrative focus)

### Story 5.2: Business Logic - Unlock Elder Levels

As a Player,
I want my available discipline level cap to reflect my Blood Potency,
So that I can access level 6+ disciplines if my generation allows it.

**Acceptance Criteria:**

**Given** a character with high Blood Potency (allowing levels > 5)
**When** the `getAvailableDisciplines` (or equivalent logic) is evaluated
**Then** the `maxAccessibleLevel` property should return the correct value (6 to 10) based on the V20 generation table
**And** characters with lower Blood Potency should still be capped at level 5 or lower
**And** this logic should apply automatically based on the character sheet stats

### Story 5.3: UI Update - Refactor Disciplines Tab Layout

As a User,
I want the Disciplines tab to display up to 10 dots for my powers,
So that I can see my Elder mastery progression visually.

**Acceptance Criteria:**

**Given** I am on the Disciplines tab with a character capable of level 6+ disciplines
**When** I view my discipline list
**Then** the dot display should show up to 10 slots instead of being hardcoded to 5
**And** the layout should handle the wider/larger dot array without breaking responsiveness on desktop
**And** clicking the 6th+ dot should function identical to lower dots (purchasing/viewing) if logic permits

### Story 5.4: UI Update - Enhanced Discipline Card & Modal

As a User,
I want the discipline details to display correctly for high-level powers,
So that I can read the longer narrative descriptions of Methuselah powers clearly.

**Acceptance Criteria:**

**Given** I click on a level 6-10 power dot
**When** the `DisciplineCard` or detail modal opens
**Then** the full name, cost, and extensive narrative description should be visible
**And** the layout should accommodate potentially longer text blocks typical of Elder powers
**And** the level indicator in the modal should correctly show 6+ dots

### Story 5.5: Caine Mode High-Level Display

As an Admin/Developer,
I want "Caine Mode" to reveal all 10 levels of every discipline,
So that I can verify the full dataset and UI behavior instantly.

**Acceptance Criteria:**

**Given** I activate "Caine Mode" (or equivalent "Unlock All" debug feature)
**When** I view the Disciplines tab
**Then** every discipline should show all 10 dots as accessible/purchased (or viewable)
**And** I should be able to inspect any level 10 power without restrictions

