---
title: 'Werewolf Sheet Performance Optimization'
slug: 'werewolf-sheet-optimization'
created: '2026-02-18'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React', 'React Router']
files_to_modify: 
  - 'web/src/modules/werewolf/pages/CharacterSheet.jsx'
  - 'web/src/modules/werewolf/pages/GiftsPage/GiftsPage.jsx'
  - 'web/src/modules/werewolf/pages/WerewolfRenownPage.jsx'
  - 'web/src/modules/werewolf/components/WerewolfNavbar.jsx'
  - 'web/src/modules/werewolf/routes.jsx'
code_patterns: ['SPA Tabs', 'Lifted State', 'Parallel Data Fetching', 'URL Synchronization']
test_patterns: ['Manual Verification', 'Component Smoke Tests']
---

# Overview

## Problem Statement
The Werewolf section of the website suffers from slow navigation between categories (Sheet, Gifts, Renown) because it relies on separate routes and full page reloads/fetches for each section. In contrast, the Vampire section is instant because it uses a single-page architecture with client-side tabs and pre-loaded data.

## Solution
Refactor the Werewolf section to use a single-page architecture (SPA) similar to the Vampire module. This involves converting separate pages (`GiftsPage`, `WerewolfRenownPage`) into tabs component within the main `CharacterSheet`. To achieve "instant" navigation, we will implement a strategy where data for all tabs is fetched in parallel upon initial load (or eagerly in the background), rather than waiting for user interaction. URL synchronization will be maintained so deep links to specific tabs still work.

## Scope
**In Scope:**
- **Refactoring `CharacterSheet.jsx`**: Transform it into the main container that manages state for all tabs (Sheet, Gifts, Renown).
- **Component Conversion**: 
  - Convert `GiftsPage` to `GiftsTab` (accepting props instead of self-fetching).
  - Convert `WerewolfRenownPage` to `RenownTab` (accepting props instead of self-fetching).
- **Navigation Update**: 
  - Update `WerewolfNavbar` to use local onClick handlers (or `Link`s that update state) instead of full route transitions, or simply rely on `CharacterSheet` to handle the routing params.
  - Simplify `routes.jsx` to route everything to `CharacterSheet`.
- **Data Optimization**: Implement parallel data fetching in `CharacterSheet` to load Character, Gifts, and Renown data simultaneously.

**Out of Scope:**
- Major visual design overhauls.
- Changes to the Admin section (`WerewolfAdminPage`).
- Backend API modifications.

# Context for Development

## Codebase Patterns
- **Vampire Reference**: `SheetPage.jsx` uses a simple `activeTab` state string ('character', 'disciplines', etc.) to conditionally render components.
- **Current Werewolf**: Uses `react-router-dom`'s `Routes` to unmount/remount entire pages, causing fetch waterfalls.
- **Goal**: Hybrid approach where `CharacterSheet` reads the URL param to set initial tab, but subsequent navigation is instant via state, while keeping the URL in sync (using `window.history.pushState` or `useSearchParams`).

## Technical Decisions
- **Routing Strategy**: We will use a query parameter `?tab=gifts` or path params `/werewolf/sheet/:tab?`. To minimize breaking changes and keep it simple, we'll likely Map the existing routes `/werewolf/gifts` -> renders `CharacterSheet` with `initialTab="gifts"`.
- **Data Fetching**: `useEffect` in `CharacterSheet` will trigger `Promise.all([fetchCharacter(), fetchGifts(), fetchRenown()])`. This ensures that by the time the user clicks a tab, data is likely ready. Loading states will be handled per-tab if data isn't ready, but the *UI shell* won't reload.

# Implementation Plan

## Task Breakdown

- [x] Task 1: Create Tab Components
  - File: `web/src/modules/werewolf/pages/GiftsPage/GiftsTab.jsx` (New)
  - Action: Create a wrapper/copy of `GiftsPage` that accepts `gifts`, `unlockedIds`, `playerTribe` as props. Remove its internal data fetching logic.
  - File: `web/src/modules/werewolf/pages/RenownTab.jsx` (New)
  - Action: Create a wrapper/copy of `WerewolfRenownPage` that accepts `renownData` and `scores` as props. Remove internal fetching.

- [x] Task 2: Refactor CharacterSheet to Manage State & Data
  - File: `web/src/modules/werewolf/pages/CharacterSheet.jsx`
  - Action: 
    - Add state for `activeTab` (default 'sheet').
    - Add state for `giftsData`, `renownData`.
    - Implement `fetchAllData` function using `Promise.all`.
    - Add method to determine initial tab from URL path (e.g., if path is `/werewolf/gifts`, set tab to 'gifts').
    - Render the appropriate tab component based on `activeTab`.

- [x] Task 3: Update Routing
  - File: `web/src/modules/werewolf/routes.jsx`
  - Action: Update routes so that `/sheet`, `/gifts`, and `/renown` all point to `CharacterSheet`.
  - Notes: Pass a prop `initialTab` to `CharacterSheet` for each route (e.g., `<Route path="gifts" element={<CharacterSheet initialTab="gifts" />} />`).

- [x] Task 4: Update Navbar (no changes needed)
  - File: `web/src/modules/werewolf/components/WerewolfNavbar.jsx`
  - Action: Ensure links still point to valid URLs (`/werewolf/gifts`), which now load `CharacterSheet` in the correct state.
  - Optimization: Ideally, clicking a link while already on `CharacterSheet` should just update the state/URL without a full remount. We can achieve this by using `Link` which React Router handles without full page reload, and `CharacterSheet` reacting to location changes.

## Acceptance Criteria

- [x] AC 1: Loading Speed
  - Given I am on the Werewolf Character Sheet, when I click "Mes Dons", then the Gifts section appears instantly (< 100ms) without a loading spinner (assuming data fetched).
- [x] AC 2: Deep Linking
  - Given I navigate directly to `/werewolf/renown`, then the Renown tab is displayed by default.
- [x] AC 3: Data Integrity
  - Given I am on the Gifts tab, when I purchase a gift (unlock it), then the UI updates immediately to show it as unlocked.
- [x] AC 4: Back Button
  - Given I navigate Sheet -> Gifts -> Renown, when I click Back, then I define whether it goes back to Gifts or the previous site. (Standard browser behavior is fine: Renown -> Gifts).

# Verification Plan

## Automated Tests
- Run existing component tests to ensure no regressions in logic.
  - `npm test modules/werewolf`

## Manual Verification
1. Open Network tab in DevTools.
2. Load `/werewolf/sheet`. Verify 3 API calls (character, gifts, renown) fire in parallel (or close to it).
3. Click "Dons" in Navbar. Verify NO new network request for page structure (only images if any). Verify instant switch.
4. Refresh the page while on `/werewolf/gifts`. Verify it loads back into the Gifts tab.
