---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 6
research_type: 'technical'
research_topic: 'Integration des Rituels V20 (Narratif)'
research_goals: 'Intégrer les rituels V20 traduits dans le site existant sans mécaniques de jeu (100% narratif).'
user_name: 'Zaès'
date: '2026-01-08'
web_research_enabled: true
source_verification: true
---

# Technical Integration: V20 Rituals (Narrative Approach)

## Executive Summary

This technical research defines the strategy for integrating **V20 Thaumaturgy and Necromancy Rituals** into the existing "The World of Darkness" React website. The primary goal is **narrative immersion** without game mechanics constraints (dice rolling).

**Key Technical Decisions:**
*   **Data Structure**: Identify a **JavaScript Module (`rituals_v20.js`)** as the optimal format. It offers improved Developer Experience (DX) over JSON by supporting comments and multi-line Template Literals for rich descriptions, while avoiding the complexity of a backend database.
*   **Component Architecture**: Adapt a **Master-Detail** pattern. A virtualized list (using `react-window`) ensures performance for hundreds of rituals, while a dedicated Detail view renders rich Markdown content (via `react-markdown`).
*   **Search**: Implement **Fuse.js** for client-side fuzzy searching, ensuring users can find rituals even with minor spelling errors or by English/French terms.
*   **Deep Linking**: Ensure every ritual has a unique ID/Slug to support direct URL sharing (e.g., `/vampire/rituals?id=blood-walk`).

**Strategic Recommendation**:
Adopt a **Manual Data Entry** approach with AI assistance. The source text is too unstructured for reliable automated parsing. A phased implementation (Shell -> Pilot Data -> Bulk Data) minimizes risk and delivers immediate value.

## Table of Contents

1.  [Technical Overview & Scope](#1-technical-overview--scope)
2.  [Technology Stack Analysis](#2-technology-stack-analysis)
3.  [Integration Patterns Analysis](#3-integration-patterns-analysis)
4.  [Architectural Patterns and Design](#4-architectural-patterns-and-design)
5.  [Implementation Approaches](#5-implementation-approaches)
6.  [Strategic Recommendations](#6-strategic-recommendations)
7.  [Conclusion](#7-conclusion)

---

## 1. Technical Overview & Scope

**Research Topic:** Integration des Rituels V20 (Narratif)
**Research Goals:** Intégrer les rituels V20 traduits dans le site existant sans mécaniques de jeu (100% narratif).

**Technical Research Scope:**
- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Research Methodology:**
- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

---

## 2. Technology Stack Analysis

### Programming Languages

**HTML5/CSS3/JavaScript (ES6+)**:
*   **Analysis**: The updated site uses the modern React ecosystem (Javascript ES6+).
*   **Use for Rituals**:
    *   **Data Structure**: Javascript Objects or JSON are the natural formats for static content integration in a React app.
    *   **Logic**: Javascript array methods (`.filter()`, `.map()`, `.reduce()`) are highly optimized in modern browsers for managing lists of hundreds of items.

**Markdown (via Parsers)**:
*   **Analysis**: For rich narrative descriptions, standard strings are insufficient.
*   **Recommendation**: Use a Markdown parser (like `react-markdown`) to render the "Description" and "System" fields. This allows formatting (bold, italics, lists) within the ritual text without writing HTML in the data file.

### Development Frameworks and Libraries

**React.js (Existing Stack)**:
*   **Component Structure**: The `RitualsTab.jsx` component needs to be refactored to handle the new data structure.
*   **State Management**: `useState` and `useMemo` will be critical for performance when filtering the new, larger dataset.

**Data Storage Format: JSON vs. Javascript Objects**:
*   *Research Insight*: For static content that doesn't change often but is complex (nested fields for Reference, Duration, etc.), **JSON** files imported as modules are ideal. However, exporting a `const` array from a `.js` file (e.g., `web/src/data/rituals_v20.js`) allows for comments and easier maintenance in a code editor without strict JSON syntax errors.
*   **Recommendation**: Use a `.js` file exporting a constant array of objects. It offers better DX (Developer Experience) for editing ritual text than raw JSON.

### Database and Storage Technologies

**NoSQL / Static File Storage**:
*   Since the user specifies "no game mechanics" and implies a static site update, a backend database (SQL/Mongo) is likely overkill and adds deployment complexity.
*   **Approach**: "Client-side Database". The entire ritual catalog (probably < 500KB text) can be loaded as a static asset chunk. This ensures instant search response without API latency.

### Development Tools and Platforms

**Virtualization Libraries**:
*   **Problem**: Rendering 100+ rituals with full text descriptions will lag the DOM.
*   **Solution**: **`react-window`** or **`react-virtualized`**. These libraries only render the items currently visible in the viewport.
*   *Research Insight*: Essential for "Master lists" of spells/rituals to maintain 60FPS scrolling.

### Technology Adoption Trends

**"Master-Detail" UI Pattern**:
*   **Trend**: Instead of long scrolling pages of text, modern RPG tools (like D&D Beyond or similar 5e tools) use a searchable table/list (Master) that opens a side panel or modal (Detail) for the full description.
*   **Relevance**: This fits perfectly with the "Narrative" focus. Users scan titles/levels, then click to read the lore.

**Client-Side Fuzzy Search**:
*   **Trend**: Libraries like `fuse.js` allow for "fuzzy" searching (finding "fire" matches "flame") entirely in the browser.
*   **Relevance**: Greatly improves usability for finding specific rituals without knowing the exact name.

---

## 3. Integration Patterns Analysis

### Client-Side Data Integration Strategy

**No-API Architecture (Client-Side "Static API")**:
*   *Approach*: Instead of fetching from a remote server/database, we treat the `rituals_v20.js` file as a local data source.
*   *Pattern*: **Singleton Data Module**. The file exports a single, read-only array of objects.
*   *Benefit*: Zero-latency filtering, instant search, works offline, no backend maintenance.

### Data Schema Design (JSON/Object Structure)

A robust schema is critical for the "Master-Detail" UI.

**Proposed Schema for `Ritual` Object:**
```javascript
{
  id: "blood-walk-level-2",        // Unique slug for URL routing/keys
  name: "Promenade du Sang",       // Primary display name (French)
  name_en: "Blood Walk",           // Searchable alias (English)
  level: 1,                        // Integer for sorting filters
  discipline: "Thaumaturgie",      // "Thaumaturgie" or "Nécromancie"
  type: "Rituel",                  // "Rituel" (future proofing via "Sort" or "Pouvoir")
  
  // Filtering Meta-data
  duration_raw: "Une heure",       // Text to display
  system_tags: ["Mental", "Scène"],// Tags for advanced filtering

  // Rich Narrative Content (Markdown supported)
  reference: "V20 Core Rulebook, p. 230",
  description_md: `
**Ingrédients**: Le sang d'un sorcier...
  
Le thaumaturge se concentre sur...
`, // Template literal for multi-line support
  
  system_md: `
Le joueur fait un jet de **Intelligence + Occultisme** (difficulté 7)...
* **1 succès**: Le thaumaturge voit...
* **5 succès**: Le thaumaturge apprend...
`
}
```

### Component Integration Patterns

**Master-Detail State Management**:
*   **Pattern**: Lifted State to `RitualCatalog` container.
*   **State**:
    *   `searchQuery` (string)
    *   `selectedFilters` (object: { level: [], discipline: [] })
    *   `selectedRitualId` (string | null) - Controls the Detail Modal/Panel.
*   **Optimization**: Use `useMemo` to derive the `filteredRituals` list from the source data whenever state changes.

**Component Props Interface (Draft)**:
*   **`RitualCard` (Master Item)**:
    *   `ritual`: Object (The full ritual data)
    *   `onSelect`: Function (Callback to open detail view)
    *   *Role*: Displays Name, Level, and small summary/icons.
*   **`RitualDetail` (Detail View)**:
    *   `ritual`: Object
    *   `onClose`: Function
    *   *Role*: Renders full Markdown description and System rules.

### Performance Integration

**Search Indexing Strategy**:
*   **Library**: `fuse.js`
*   **Configuration**:
    *   `keys`: ['name', 'name_en', 'description_md']
    *   `threshold`: 0.3 (Fuzzy matching)
*   **Integration**: Initialize Fuse instance **once** outside the render cycle or inside a `useMemo` hook to avoid rebuilding the index on every keystroke.

### URL Routing Integration

**Deep Linking Support**:
*   *Goal*: Users should be able to share a link to a specific ritual (e.g., `/vampire/rituals/promenade-du-sang`).
*   *Pattern*: **URL Sync**.
    *   When a ritual is selected, update URL query param or route (`?id=promenade-du-sang`).
    *   `useEffect` on mount: Check URL, if ID exists, find ritual and open Detail view automatically.

---

## 4. Architectural Patterns and Design

### System Architecture Patterns

**Feature-Based Module Architecture**:
*   *Analysis*: The user's project already leans towards a `modules/vampire` structure. We should reinforce this.
*   *Design*: All ritual-related logic sits inside `src/modules/vampire/features/rituals`.
*   *Encapsulation*: The rest of the app (Core) shouldn't know about rituals; only the `RitualPage` acts as the public entry point.

**Component Hierarchy (Master-Detail)**:
*   `RitualPage` (Container): Connects to Store/Context, manages URL sync.
    *   `RitualCatalog` (Smart Component): Manages local state (search, filters, virtualization).
        *   `RitualFilters`: Sidebar/Top bar with dropdowns.
        *   `RitualList` (Virtual List): Uses `react-window` to render rows.
            *   `RitualRow` (Presentational): Atomic display of 1 ritual summary.
    *   `RitualDetailModal` (Smart Component): Renders the active ritual if ID is present.
        *   `RitualFullView` (Presentational): Renders the Markdown content.

### Directory Structure Proposal

```text
src/
  modules/
    vampire/
      data/
        rituals_v20.js         <-- The Static Database
      features/
        rituals/
          components/
            RitualCatalog.jsx  <-- Main View
            RitualList.jsx
            RitualDetail.jsx
            atoms/
              LevelBadge.jsx
          hooks/
            useRituals.js      <-- Logic (Filter, Search)
```

### Scalability and Performance Patterns

**Lazy Loading**:
*   *Pattern*: Code-splitting the Rituals feature.
*   *Implementation*: In the main Router, use `React.lazy(() => import('./modules/vampire/features/rituals/RitualPage'))`.
*   *Benefit*: Users who only visit the "Clans" page don't download the 200KB of ritual text.

**Memoization**:
*   *Pattern*: Memoize the `filteredRituals` array.
*   *Implementation*: `const filteredList = useMemo(() => allRituals.filter(...), [search, filters])`.
*   *Why*: Prevents re-filtering 500 items every time the user types 1 character (if combined with debounce).

### Security and Data Architecture

**Client-Side Sanitization**:
*   *Risk*: If `description_md` contains user-generated content (it won't here, but good practice).
*   *Mitigation*: Ensure `react-markdown` is configured to sanitize HTML output (though mostly safe by default for static trusted data).

---

## 5. Implementation Approaches

### Technology Adoption Strategies

**Migration Roadmap**:
*   *Strategy*: **Manual Data Entry with AI Assistance**.
*   *Rationale*: The source material (V20 Core Rulebook translation) is unstructured text. Writing a "parser" for inconsistent PDF/Wikis is harder than manually copying.
*   *Adoption*:
    1.  **Phase 1**: Setup the React components and Filter logic (Skeleton).
    2.  **Phase 2**: Populate `rituals_v20.js` with 1 real ritual to test the UI.
    3.  **Phase 3**: Bulk entry of remaining rituals (Copy-Paste from research doc -> JS Object). Use AI (Cursor/Copilot) to format the Markdown.

### Development Workflows and Tooling

**Data Entry Workflow**:
*   *Tools*: VS Code + Copilot / Custom Snippets.
*   *Snippet*: Create a VS Code user snippet for the `Ritual` object structure to speed up entry.
    ```json
    "New Ritual": {
      "prefix": "ritual",
      "body": [
        "{",
        "  id: \"$1\",",
        "  name: \"$2\",",
        "  level: ${3:1},",
        "  description_md: `",
        "    $0",
        "  `,",
        "},"
      ]
    }
    ```

### Testing and Quality Assurance

**Sanity Checks**:
*   *Test*: Ensure every ID is unique (duplicates break React keys).
*   *Test*: Verify Markdown rendering for edge cases (lists inside blockquotes).
*   *Test*: Search functionality (Does "sang" find "Promenade du Sang"?).

### Cost Optimization

**Optimization**: Use this Research Document's "Ritual List" section (from the Domain Research) as the source of truth. Copying from a clean Markdown file is faster than from a PDF. A 2-column layout (Browser with Research Doc | VS Code with JS file) is recommended.

---

## 6. Strategic Recommendations

### Implementation Roadmap

1.  **Setup**: Create `src/modules/vampire/data/rituals_v20.js` and export empty array.
2.  **UI**: Build `RitualCatalog`, `RitualList`, `RitualFilters`.
3.  **Data**: Add the first 5 rituals (Level 1 Thaumaturgy).
4.  **Verify**: Check UI layout and filtering.
5.  **Scale**: Add the rest of the rituals.
6.  **Release**: Add the link to the main navigation.

### Technology Stack Recommendations

*   **React** (Existing)
*   **react-markdown** (For rendering descriptions)
*   **fuse.js** (For search)
*   **react-window** (If list > 100 items)
*   **TailwindCSS / StyledComponents** (Match existing site style)

### Success Metrics

*   **Load Time**: Ritual list loads in < 200ms.
*   **Search**: Results appear in < 50ms after typing.
*   **Completeness**: 100% of translated rituals are present.

---

## 7. Conclusion

### Summary of Key Technical Findings
The research confirms that a **Client-Side Static Data** approach is perfectly viable and optimal for the user's needs. The volume of data (< 500KB text) does not justify a complex backend system. React's ecosystem provides all necessary tools (`react-window`, `react-markdown`, `fuse.js`) to create a premium, responsive "Grimoire" experience.

### Next Steps
1.  **Immediate**: Initialize the `rituals_v20.js` file structure.
2.  **Short Term**: Refactor `RitualsTab.jsx` to consume this new format.
3.  **Medium Term**: Begin the content entry process for Level 1 rituals.

**Technical Research Completion Date:** 2026-01-08
**Research Status:** Complete
**Confidence Level:** High
