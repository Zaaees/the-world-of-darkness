# Story 4.2: Mobile UX & Responsive Check

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Mobile User,
I want the interface to adapt perfectly to my small screen,
so that I can use the tool comfortably during a live game session without zooming or horizontal scrolling.

## Acceptance Criteria

1. **Given** a viewport width of < 768px (Mobile), **When** I access the Ritual filters, **Then** they appear in a collapsible Drawer/Accordion instead of a permanent Sidebar.
2. **Given** I am on mobile, **When** I interact with any touch target (buttons, cards, inputs), **Then** all touch targets are at least 44x44px (Apple HIG / WCAG 2.5.5).
3. **Given** I am reading a ritual on mobile, **When** I want to go back to the list, **Then** the navigation logic handles the "Back to List" flow intuitively (close button, swipe gesture, or browser back).
4. **Given** I open the mobile filter drawer, **When** it animates in, **Then** it uses a slide/fade transition consistent with the rest of the app (`AnimatedView` pattern with `slideUp` variant).
5. **Given** I am on mobile, **When** viewing the ritual list or detail, **Then** no horizontal scrolling occurs and all text is legible without zooming.
6. **Given** the layout is responsive, **When** I switch between mobile and desktop viewports, **Then** the layout transitions smoothly between stacked (mobile) and master-detail (desktop) modes.

## Tasks / Subtasks

- [x] Task 1: Mobile Filter Drawer/Accordion (AC: 1, 4)
    - [x] Create `MobileFilterDrawer.jsx` component with collapsible accordion or slide-up sheet behavior.
    - [x] Add "Filtres" button in mobile header that toggles the drawer visibility.
    - [x] Move filter content from `RitualFilter.jsx` into a shared component for reuse.
    - [x] Apply `AnimatedView` with `slideUp` variant for smooth animation.
    - [x] Include close/dismiss button (X or "Fermer") with minimum 44x44px touch target.
    - [x] Ensure the drawer closes automatically when a filter is selected (optional UX improvement).

- [x] Task 2: Touch Target Audit & Fix (AC: 2)
    - [x] Audit all interactive elements in `/rituals/components/*.jsx` for touch target sizes.
    - [x] Fix any elements smaller than 44x44px:
        - [x] `RitualCard.jsx`: Learn button min-height fixed.
        - [x] `SearchInput.jsx`: Clear button (X) increased to 44x44px.
        - [x] Level buttons in `FilterContent.jsx` (44x44px w-11 h-11).
        - [x] Discipline checkboxes min-h-[44px] per row.
    - [x] Added `min-w-[44px] min-h-[44px]` to all touch targets.

- [x] Task 3: Back Navigation Flow (AC: 3)
    - [x] Verify `RitualReader.jsx` close button works correctly on mobile (confirmed working).
    - [x] Close button has 44x44px touch target with aria-label.
    - [x] Browser back functionality preserved via existing state management.

- [x] Task 4: Horizontal Scroll Prevention (AC: 5)
    - [x] Add `overflow-x-hidden` to content container.
    - [x] Audit markdown content in `RitualReader.jsx` for potential overflow.
    - [x] Add `break-words` and `[overflow-wrap:anywhere]` to text containers.

- [x] Task 5: Responsive Layout Verification (AC: 6)
    - [x] Verify `RitualsTab.jsx` correctly switches between mobile (stacked) and desktop (master-detail) layouts.
    - [x] Breakpoint consistent (`md:` = 768px throughout).
    - [x] `RitualReader` fullscreen sheet on mobile vs. side panel on desktop (confirmed).

- [x] Task 6: Testing & Verification
    - [x] Add tests for `MobileFilterDrawer` component (12 tests covering visibility, content, close, touch targets, accessibility).
    - [x] All 84 tests pass including new MobileFilterDrawer tests.

## Dev Notes

### Architecture Compliance

- **Library**: Use `framer-motion` (already installed) for drawer animations.
- **Component Location**: New `src/modules/vampire/features/rituals/components/MobileFilterDrawer.jsx`.
- **State Management**: Use local component state for drawer open/close, or extend `useGrimoireStore` if needed for persistence.
- **Styling**: Tailwind CSS with mobile-first responsive design (`md:` breakpoint at 768px).
- **Pattern**: Follow existing `AnimatedView.jsx` pattern for consistent animations.

### UX Design Specification Goals

- **Mobile Strategy** (from UX spec):
    - Layout: List View by default, tap opens "Full Screen Sheet" for ritual details.
    - Closing: Swipe down or Close button. One-thumb friendly.
- **Touch Targets**: All interactive elements minimum 44x44px per Apple HIG and WCAG 2.5.5.
- **Search Debounce**: Already implemented (300ms) for keyboard responsiveness.
- **Accessibility**: Reduced motion support already present via `useReducedMotion` hook.

### Technical Specifics

**Mobile Filter Drawer Pattern (Slide-Up Sheet)**:
```jsx
import AnimatedView from './AnimatedView';

export default function MobileFilterDrawer({ isOpen, onClose }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 md:hidden" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50" /> {/* Backdrop */}
            <AnimatedView variant="slideUp">
                <div 
                    className="absolute bottom-0 left-0 right-0 bg-stone-900 rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Filter content here */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                        ✕
                    </button>
                </div>
            </AnimatedView>
        </div>
    );
}
```

**Touch Target Fix Pattern**:
```jsx
// Before (32x32px level button)
<button className="w-8 h-8 rounded-full ...">

// After (44x44px with visual 32x32)
<button className="w-11 h-11 flex items-center justify-center">
    <span className="w-8 h-8 rounded-full ...">
```

**Horizontal Scroll Prevention**:
```jsx
// In RitualReader.jsx markdown container
<div className="prose prose-invert max-w-none overflow-x-hidden break-words">
```

### Previous Story Intelligence

- **Story 4.1**: Deferred AC 6 (mobile filter animation) to this story. The mobile filter drawer should use `AnimatedView` with `slideUp` variant.
- **AnimatedView.jsx**: Already supports `fade`, `slideRight`, `slideUp` variants.
- **RitualReader.jsx**: Already has close button with `aria-label`. Already uses `AnimatePresence` for animations.
- **RitualFilter.jsx**: Currently uses `hidden md:block` - completely hidden on mobile. Filter content needs to be extracted for reuse.

### Existing Code Patterns

- **Breakpoint**: Uses `md:` (768px) throughout for responsive design.
- **Color Scheme**: Stone-900 backgrounds, red accents (`red-700`, `red-900`), gold for success.
- **Animation Duration**: 0.2s (unified in story 4.1).
- **Font**: Serif (`font-serif`) for "V5 Editorial" gothic feel.

### Edge Cases to Handle

1. **Very long filter lists**: Ensure drawer has max-height with scroll.
2. **Ritual with no description**: Graceful fallback in reader.
3. **Rapid open/close**: Debounce or use `AnimatePresence mode="wait"` to prevent animation glitches.
4. **Keyboard users on mobile**: Ensure drawer can be closed with Escape key if keyboard attached.

### References

- [Epics: Story 4.2](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md)
- [UX Design: Responsive Design & Accessibility](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design)
- [Previous Story 4.1: Animation & Transitions](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/implementation-artifacts/4-1-animation-and-transitions.md)
- [AnimatedView Component](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/web/src/modules/vampire/features/rituals/components/AnimatedView.jsx)
- [RitualFilter Component](file:///F:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/web/src/modules/vampire/features/rituals/components/RitualFilter.jsx)

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

### Completion Notes List

- ✅ Created `FilterContent.jsx` - extracted reusable filter UI from RitualFilter with 44px touch targets
- ✅ Created `MobileFilterDrawer.jsx` - slide-up drawer using framer-motion with accessibility features
- ✅ Updated `RitualFilter.jsx` - simplified to use shared FilterContent
- ✅ Updated `RitualsTab.jsx` - added mobile filter button and MobileFilterDrawer integration
- ✅ Fixed touch targets: SearchInput clear button, RitualReader close button, RitualCard learn button
- ✅ Added horizontal scroll prevention to RitualReader with overflow-x-hidden and break-words
- ✅ Created `MobileFilterDrawer.test.jsx` with 12 comprehensive tests
- ✅ All 84 tests pass (72 original + 12 new)

### File List

- `web/src/modules/vampire/features/rituals/components/FilterContent.jsx` (NEW)
- `web/src/modules/vampire/features/rituals/components/MobileFilterDrawer.jsx` (NEW)
- `web/src/modules/vampire/features/rituals/components/MobileFilterDrawer.test.jsx` (NEW)
- `web/src/modules/vampire/features/rituals/components/RitualFilter.jsx` (MODIFIED)
- `web/src/modules/vampire/features/rituals/components/SearchInput.jsx` (MODIFIED)
- `web/src/modules/vampire/features/rituals/components/RitualReader.jsx` (MODIFIED)
- `web/src/modules/vampire/features/rituals/components/RitualCard.jsx` (MODIFIED)
- `web/src/modules/vampire/components/RitualsTab.jsx` (MODIFIED)

### Code Review Fixes Applied

- ✅ Added `min-w-[44px]` to RitualCard Learn button for full 44x44px touch target compliance
- ✅ Added Escape key close test to MobileFilterDrawer.test.jsx
- ✅ Added backdrop click close test to MobileFilterDrawer.test.jsx
- ✅ Improved JSDoc typing in FilterContent.jsx
- ✅ All 86 tests pass (84 original + 2 new from code review)
