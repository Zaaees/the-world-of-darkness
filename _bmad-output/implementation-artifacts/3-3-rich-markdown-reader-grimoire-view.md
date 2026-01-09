# Story 3.3: Rich Markdown Reader (Grimoire View)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Player,
I want to read the full description of my rituals in a beautiful, readable format,
so that I can immerse myself in the lore and understand the narrative effects.

## Acceptance Criteria

1. **Given** I click on a ritual in my list (or "Lame Ardente"), **When** the Detail View opens, **Then** the `description_md` is rendered as rich HTML (Bold, Italic, Paragraphs, Lists).
2. **Given** the rendered view, **Then** the typography follows the "V5 Editorial" style:
    -   Headers use `Playfair Display` (Serif).
    -   Body text uses `Inter` (Sans).
    -   Marginalia/Notes use `Caveat` (Handwriting).
3. **Given** the text contains mechanical rules (e.g., "System:", "Dice Pool:"), **Then** these sections are visually distinguished (e.g., different color, boxed, or font style) from the narrative lore.
4. **Given** I am reading a ritual, **Then** the first letter of the first paragraph is styled as a Drop Cap (Lettrine).
5. **Given** I am on Mobile, **Then** the reader occupies the full screen (Sheet/Modal) and is easily dismissible to return to the list.
6. **Given** I am on Desktop, **Then** the reader appears in the right-hand panel (Master-Detail layout).

## Tasks / Subtasks

- [x] Task 1: Component Structure & Routing
    - [x] Create `RitualReader.jsx` in `src/modules/vampire/features/rituals/components/`.
    - [x] Implement `GrimoireReader` container layout.
        - [x] Desktop: Right panel integration in `RitualsTab.jsx`.
        - [x] Mobile: Full-screen overlay or Sheet component.
    - [x] Connect to `useGrimoireStore` to retrieve `selectedRitual`.

- [x] Task 2: Markdown Configuration (`react-markdown`)
    - [x] Configure `react-markdown` (v10.1.0+) with `components` prop.
    - [x] Implement Custom Renderers:
        - [x] **Paragraph (`p`)**: Handle specific typography (Inter). Implement Drop Cap (`first-letter` pseudo-element) for the *first* paragraph logic.
        - [x] **Strong (`strong` / `b`)**: Apply "Inked" style (slight blur or heavier weight) for emphasis.
        - [x] **Headers (`h1`-`h6`)**: Apply `Playfair Display` with vampire-appropriate spacing/colors.
        - [x] **Blockquote**: Apply `Caveat` font for flavor text/marginalia.

- [x] Task 3: Mechanics Isolation & Styling
    - [x] Identify strategy for isolating "System" text in Markdown (e.g., specific regex/parsing or distinct markdown syntax if available in data).
    - [x] *Fallback Strategy if data is plain markdown:* Use a custom renderer for specific patterns (e.g., if a line starts with `**System:**`) to apply a "Mechanical Box" style.

- [x] Task 4: UX & Responsive Polish
    - [x] Apply "V5 Editorial" CSS variables/Tailwind classes.
        -   Define `font-header`, `font-body`, `font-hand` in `tailwind.config.js` if not present.
    - [x] Implement transitions using `framer-motion` (Fade in / Slide up).
    - [x] Ensure "Empty State" (no ritual selected) displays a diegetic message (e.g., "Select a ritual to study...") on Desktop.

## Dev Notes

### Architecture Compliance

- **Library**: Use `react-markdown`. avoid `dangerouslySetInnerHTML`.
- **Styling**: Use Tailwind CSS classes. Create reusable "typography" utility classes if needed (e.g., `.prose-vampire`).
- **Data Source**: accessing `selectedRitual` from `useGrimoireStore`.
- **Component Location**: `src/modules/vampire/features/rituals/components/RitualReader.jsx`.

### UX Design Specification Goals

- **"Liseuse" Mode**: Minimize UI chrome. Focus on text.
- **Typography**:
    -   Header: `Playfair Display`
    -   Body: `Inter`
    -   Marginalia: `Caveat`
-   **Visuals**: Use "Chaos Layer" concepts (subtle text imperfections) via CSS if possible without hurting accessibility.

### Technical specifics

- **react-markdown usage**:
  ```jsx
  <ReactMarkdown
    components={{
      h1: ({node, ...props}) => <h1 className="font-header text-2xl text-blood-500" {...props} />,
      p: ({node, ...props}) => <p className="font-body mb-4 first-of-type:first-letter:text-4xl first-of-type:first-letter:font-header first-of-type:first-letter:float-left first-of-type:first-letter:mr-2" {...props} />,
    }}
  >
    {content}
  </ReactMarkdown>
  ```
- **Mobile vs Desktop**: Utilise CSS Grid/Flex for the Master-Detail view in `RitualsTab.jsx`.
    -   Mobile: List is visible, Reader is hidden/modal.
    -   Desktop: List col-span-4, Reader col-span-8.

### Previous Story Intelligence

- **Story 3.2**: `viewMode` (GM/PLAYER) might affect *what* is selected, but not *how* it is displayed. The Reader is "pure" display of the selected item.
- **Store**: Ensure `selectedRitual` is cleared or handled when switching filters/modes to avoid showing a ghost ritual.

### References

- [Epics: Story 3.3](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/epics.md)
- [Architecture: React Markdown](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/architecture.md)
- [UX Design: GrimoireReader](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/ux-design-specification.md)

## Dev Agent Record

### Agent Model Used

Gemini 2.0 Flash + Antigravity (Code Review Fix)

### Debug Log References

- Code Review performed 2026-01-09: Found 3 CRITICAL, 4 MEDIUM, 2 LOW issues

### Completion Notes List

- ✅ AC1-AC6 all implemented and verified
- ✅ `RitualReader.jsx` created with `react-markdown` custom components
- ✅ Typography: Headers (font-serif/Playfair), Body (font-body/Inter), Marginalia (font-hand/Caveat)
- ✅ System text detection and boxed styling implemented
- ✅ Drop Cap via CSS `first-of-type:first-letter` pseudo-selectors
- ✅ Mobile: Full-screen overlay in `RitualsTab.jsx`
- ✅ Desktop: Right panel Master-Detail layout
- ✅ framer-motion animations for transitions
- ✅ Empty state with diegetic message

### File List

| File | Action | Description |
|------|--------|-------------|
| `web/src/modules/vampire/features/rituals/components/RitualReader.jsx` | NEW | Main reader component with react-markdown integration |
| `web/src/modules/vampire/features/rituals/components/RitualReader.test.jsx` | NEW | Unit tests for RitualReader (2 tests) |
| `web/src/modules/vampire/components/RitualsTab.jsx` | MODIFIED | Added RitualReader import and Master-Detail layout |
| `web/tailwind.config.js` | MODIFIED | Added font-family tokens (serif, body, hand) |
| `web/package.json` | MODIFIED | Added react-markdown and framer-motion dependencies |
