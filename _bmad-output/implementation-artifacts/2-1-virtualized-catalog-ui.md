# Story 2.1: Virtualized Catalog UI

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Game Master,
I want to view the complete list of rituals in a scrollable, responsive grid,
so that I can quickly scan the available options without performance lag on my device.

## Acceptance Criteria

1. **Given** the store (`useGrimoireStore`) is loaded with 100+ rituals, **When** I render the `<RitualCatalog />` component, **Then** it displays the list using virtualization (`react-window` or `react-virtuoso`).
2. **Given** the list is displayed, **When** I scroll rapidly, **Then** the UI maintains ~60fps and DOM size remains constant.
3. **Given** a ritual item is rendered, **When** I inspect a card, **Then** it displays the Ritual Name, Level (Badge), and Discipline.
4. **Given** the viewport changes, **When** I switch between Desktop and Mobile, **Then** the card layout adapts (Grid for Desktop, Stack/List for Mobile).

## Tasks / Subtasks

- [x] Task 1: Create UI Components
  - [x] Create `src/modules/vampire/features/rituals/components/RitualCard.jsx` (Atomic display component).
  - [x] Create `src/modules/vampire/features/rituals/components/RitualCatalog.jsx` (Virtualization container).
- [x] Task 2: Implement Virtualization Logic
  - [x] Integrate `react-window` (Verified Library).
  - [x] Configure `FixedSizeList` or `VariableSizeList` (or Grid) based on layout requirements.
  - [x] Handle window resize events for responsive column count (Grid vs List).
- [x] Task 3: Integrate with Store
  - [x] Connect `RitualCatalog` to `useGrimoireStore` to retrieve `rituals` array.
- [x] Task 4: Verify Performance
  - [x] Manually verify scrolling smoothness with full dataset.

## Dev Notes

- **Architecture Compliance:**
  - **Virtualization:** MANDATORY. Do not render 100+ cards directly in DOM.
  - **Animation Warning:** Do NOT apply entering/exiting animations (`framer-motion`) to individual virtualized items, as this conflicts with mounting/unmounting logistics of `react-window`.
  - **Responsive Strategy:** `react-window` needs explicit dimensions. Use a wrapper (like `react-virtualized-auto-sizer` or simple standard hook) to feed dimensions.

### Technical Requirements
- **Library:** `react-window` (v2.2.4 or compatible).
- **Styling:** Tailwind CSS. Use `grid` classes for layout within the virtualized item if necessary, or calculate columns.
- **Component Path:** `src/modules/vampire/features/rituals/components/`

### References

- [Architecture: Performance UI](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#69)
- [Architecture: Components](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md#121)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

### File List
