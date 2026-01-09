---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments: ["c:\\Users\\freed\\Desktop\\the-world-of-darkness\\_bmad-output\\planning-artifacts\\prd.md"]
---

# UX Design Specification the-world-of-darkness

**Author:** Zaès
**Date:** 2026-01-08

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision
The "Grimoire" is not merely a list of spells; it is a digital artifact of forbidden knowledge. It represents a shift from a "Database" mental model to a "Collection" mental model. The interface must evoke the feeling of a personal, growing tome of power. It starts empty and fills as the player uncovers secrets (unlocks rituals). The experience should be diegetic and immersive, hiding mechanical complexity behind narrative elegance.

### Target Users
-   **The Initiate (Player):** Seeking immersion and utility. They need a distraction-free reading environment for their rituals on mobile devices. They want to feel "powerful" as their collection grows.
-   **The Storyteller (GM)::** Needs a "God View" to distribute knowledge. They require efficient filtering and clear indicators of player eligibility (Clan/Blood Potency).

### Key Design Challenges
-   **Localization:** The entire interface and content must be in **French**.
-   **Integration:** Must seamlessly integrate as a new **Tab** within the existing Character Sheet (Fiche/Vitae/Disciplines/Grimoire).
-   **Visual Balance:** Maintaining the "Goth" aesthetic without sacrificing legibility on small screens.
-   **Platform:** Designing a complex "Master-Detail" view that works on both Desktop (Side-by-side) and Mobile (Stacked).
-   **The Veil of Secrecy (Visibility Logic):**
    -   *Owned:* Fully visible, readable.
    -   *Unknown:* Completely invisible (does not appear in list).
    -   *Technically Known but Unusable:* Visible but "Locked" (Blurred? Chains? Warning?). Handling the distinction between "Wrong Clan" (Hard Lock?) and "Low Blood Potency" (Soft Lock/Warning?).
-   **Mobile Readability:** Rendering complex markdown (tables, lists, quotes) elegantly on small screens without horizontal scrolling issues.

### Design Opportunities
1.  **Diegetic UI Elements:** Using subtle textures (stone, ink) and lighting effects (glows) that respect the existing Dark Mode (`#0c0a09`) but add depth.
2.  **"Unlocking" Moments:** Creating a micro-interaction/animation when a new ritual is added, celebrating the acquisition of power.
3.  **The "Liseuse" Mode:** A dedicated reading view that minimizes UI chrome (navigation bars) to focus purely on the text.

### Experience Principles
1.  **Mystery over Efficiency:** For players, it is better to hide unknown options completely than to show a grayed-out list of everything they *don't* have.
2.  **Texture over Flatness:** Use visual depth (shadows, grain, ink) to sell the fantasy, respecting the existing Dark Mode.
3.  **Clarity in Restriction:** "Soft Locks" (Blood Potency) should appear as "Indecipherable" or "Dangerous".
4.  **Legibility First:** Texture must never compromise text contrast (WCAG AA). The user is reading in the dark; the text must be sharp.
5.  **Narrative Purity:** No visible game mechanics (dice rolls, difficulty checks) in the Grimoire. Only **Blood Cost** is displayed. The focus is purely on the lore and the effect.

## Core User Experience

### Defining Experience
The core experience is **"Consulting the Forbidden Tome"**. It is a solitary, contemplative act. The user is not "browsing a database"; they are studying their personal collection of secret arts. The distinct shift from "Empty" to "Populated" mimics the character's journey from neophyte to master.

### Platform Strategy
-   **Mobile (Primary):** The "Pocket Grimoire". Single-column focus. The list is an inventory; the detail view is a reading page.
-   **Desktop:** The "Scriptorium". Two-pane master-detail layout allowing GMs to cross-reference rapidly.
-   **Performance:** Search input must be **debounced** (300ms) to ensure the virtual keyboard remains responsive on low-end mobile devices.

### Effortless Interactions
-   **"Living" Search:** Fuzzy search that reacts instantly.
-   **Contextual Reading:** Formatting that makes long text easy to scan on mobile without breaking immersion.
-   **Multi-sensory Feedback:** Success actions (unlocking) should trigger subtle Audio Feedback (SFX: quill scratch, page turn) to reinforce the "reality" of the object.

### Critical Success Moments
-   **The Acquisition:** The transition from "Zero State" to "First Ritual". It shouldn't just "appear"; it should be "inscribed" or "revealed" (Micro-animation).
-   **The Safety Check (GM):** Instantly seeing *why* a player can't learn a ritual (e.g., a "Blood Potency Too Low" warning).

## Desired Emotional Response

### Primary Emotional Goals
-   **Primary:** *Awe & Secret Power.* The feeling of holding forbidden knowledge.
-   **Secondary:** *Satisfaction of Growth.* The pride of seeing a once-empty book fill with dangerous arts.
-   **Avoid:** *Frustration of Ignorance.* Users should feel "curious" about what they don't know, not "blocked" by it.

### Emotional Journey Mapping
1.  **Discovery (Zero State):** *Intrigue.* "My book is empty. I must find a teacher." (Not "Error: No Data").
2.  **Acquisition (First Ritual):** *Achievement.* The book is no longer just an object; it is *yours*.
3.  **Consultation (Reading):** *Focus.* The world fades away; only the text matters.
4.  **Rejection (Low BP):** *Humility/Danger.* "This power is too great for me... yet."

### Micro-Emotions
-   **Mental Strain:** The feeling that the book is resisting you when you try to read something beyond your capability.
-   **Ownership:** The book feels personal, not generic.

### Design Implications
-   **Intrigue:** Use cryptic sigils or empty slots that hint at potential without showing spoilers.
-   **Focus:** When reading, dim the rest of the interface (Liseuse Mode).
-   **Danger as Distortion:** Instead of standard "Red Error" states, utilize **Visual Distortion** (blur, chromatic aberration) to represent "Forbidden Knowledge" that is too complex for the character's mind.

### Emotional Design Principles
1.  **Diegetic Friction:** Difficulty should feel like a challenge to the character (Lore), not a challenge to the user (Bad UX).
2.  **Visual Storytelling:** Use effects (distortion, lighting) to convey mechanical states (locked, available).
3.  **Accessible Magic:** Even distorted or "dangerous" elements must have clear, accessible labels ("Too Complex") for screen readers and clarity.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
-   **V5 Core Rulebooks (Visuals):** "Goth-Industrial". The gold standard for the brand. Combines high-fashion photography, neon accents, and decay.
-   **Cultist Simulator (Mood):** treats text fragments as gameplay objects. The feeling of "piecing together" a mystery.
-   **D&D Beyond (Utility):** Handles massive spell lists efficiently on mobile. Good filtering, but visually sterile.

### Transferable UX Patterns
-   **"Editorial" Layout:** Use pull-quotes, mixed typography (Serif Headers / Sans Body), and asymmetry in the *Ritual Detail* view to break up long text.
-   **"Object" Weight:** Rituals in the list shouldn't be simple 1px borders. They should look like thick cards or blocks of text to possess weight.

### Anti-Patterns to Avoid
-   **"Old Skeuomorphism":** No fake "page turn" animations. They are slow and annoying on mobile.
-   **"The Datagrid":** No dense tables. Each ritual needs breathing room to feel magical.

### Design Inspiration Strategy
**The "V5 Editorial" Style:** We take the robust utility of *D&D Beyond* (filters, search, speed) but skin it with the "Fashion Magazine from Hell" aesthetic of the V5 books. It remains a web app (scrolling, clicking) but *looks* like a curated art book.

## Design System Foundation

### Design System Choice
**Strategy:** "Themeable System (Tailwind First) + The Chaos Layer".
We will primarily use **Raw Tailwind CSS** for layout and structure, avoiding heavy component libraries (MUI/Ant) to maintain performance and visual control.

### Rationale for Selection
-   **Performance:** Raw Tailwind is significantly lighter than full UI kits, critical for the "Mobile First" Grimoire.
-   **Aesthetic Flexibility:** The "V5 Editorial" style requires asymmetrical layouts and unique text effects that are difficult to force into rigid components like Material UI.
-   **Maintenance:** By isolating complex visual effects (The "Chaos Layer") into custom utility classes or plugins, we keep the JSX clean while allowing for "messy" visuals.

### Implementation Approach
1.  **Strict Foundation:** Use standard Tailwind for layout (Flex/Grid), spacing, and sizing.
2.  **Custom Configuration (`tailwind.config.js`):**
    -   **Typography:** Define semantic font tokens: `font-header` (Serif) and `font-body` (Sans).
    -   **Colors:** Extend palette with semantic "Grimoire" colors: `blood` (red), `ink` (dark gray), `parchment` (off-white/gold).
3.  **The "Chaos Layer" (Visuals):**
    -   Create reusable CSS utility classes (e.g., `.fx-distortion`, `.fx-ink-bleed`) or custom Tailwind plugins for high-end visual effects.
    -   Do not inline these complex styles; abstract them to keep code readable.

### Customization Strategy
-   **Rich Text Rendering:** Use `react-markdown` with custom renderers to automatically apply "Chaos" styles to standard markdown syntax (e.g., making `**bold**` text look like it was inked heavily).
-   **Component Atoms:** Build specific "Grimoire Atoms" (e.g., `<SigilHeader />`, `<GrimoireCard />`) rather than generic UI atoms.

## 2. Core User Experience

### 2.1 Defining Experience
**"Consulting the Forbidden Tome."**
The defining interaction is the shift from "External List" (Inventory) to "Internal Reading" (Study). It is a transition from utility to immersion.

### 2.2 User Mental Model
Currently, users are used to "Databases" (click -> load page -> read data).
We are shifting to a "Collection" model. The book is empty until filled. The "Back" button doesn't just go back; it "Closes the Book".

### 2.3 Success Criteria
-   **Deep Linking:** Every ritual must have a diverse URL (`/rituals/:id`) for GM sharing.
-   **State Preservation:** Returning to the list MUST preserve the exact scroll position (essential for large lists on mobile).
-   **Tactile Feel:** Navigation shouldn't feel like a standard web page reload. It needs weight.

### 2.4 Novel UX Patterns
-   **"The Chaos Layer" Typography:** Standard text rendered with slight, varied imperfections (via CSS) to simulate ink without hurting legibility.
-   **Distortion as Lock:** Using visual noise to represent "Locked" content instead of graying it out.

### 2.5 Experience Mechanics
**The "Master-Detail" Routing Flow**

1.  **Initiation:**
    -   User taps a Ritual Card.
    -   **Interaction:** Card "presses down" (visual feedback).
    -   **Action:** URL changes to `/rituals/:id`.

2.  **Transition:**
    -   **Mobile:** A "Slide Over" or "Page Turn" animation takes over the screen.
    -   **Desktop:** The Right Panel updates instantly with an "Ink Bleed" fade-in effect.
    -   **Tech:** Powered by `framer-motion` + `react-router`.

3.  **The Reading State:**
    -   Fullscreen immersion (Mobile).
    -   Typography switches to `font-header` (Serif).
    -   Background textures (smoke/dust) are subtle and behind the text.

4.  **Completion (Closing):**
    -   User clicks "Close" or Browser "Back".
    -   **Tech:** URL reverts to `/rituals`.
    -   **Result:** View returns to the List at the *exact same scroll position*.

## Visual Design Foundation

### Color System (Dark Mode Extended)
**Palette: "Goth-Industrial"**
-   **Base:** `#0c0a09` (Warm Black / Stone) - Existing site background.
-   **Blood (Danger/Action):** `#be123c` (Rose-700) for borders/accents. `#fb7185` (Rose-400) for text legibility.
-   **Gold (Success/Arcane):** `#ca8a04` (Yellow-700). Used for "Learned" icons and borders.
-   **Ink (Text):** `#e7e5e4` (Warm Gray). Never pure white.
-   **Chaos Texture:** `#4c0519` (Rose-950) - Very dark red for background bleeds.

### Typography System
**Strategy: "Editorial Contrast"**
-   **Headers (The Voice of Authority):** `Playfair Display`. High-contrast Serif. Elegant, fashion-forward, dangerous.
-   **Body (The Legible Truth):** `Inter`. Clean, modern Sans. High x-height for mobile reading.
-   **Marginalia (Notes):** `Caveat`. Handwritten cursive for flavor text.

### Spacing & Layout Foundation
-   **List View:** Dense (Inventory feel). 4px padding between items to maximize visibility on mobile.
-   **Reader View:** Expansive. 24px margins, 1.8 line-height. Breathing room for the text to feel insignificant/important.

### Accessibility Considerations
-   **Contrast compliance:** Red is used for decoration/glows. Critical text uses High Contrast Red (`#fb7185`) or Gold.
-   **No "Green" Success:** Success is Gold. Failure is Ash/Gray.
-   **Reduced Motion:** All "Ink Bleed" or "Distortion" effects must respect `prefers-reduced-motion` queries.

## User Journey Flows

### 1. L'Initiation (Acquisition)
*Objectif : Transformer un grimoire vide en un outil de pouvoir.*
**Scénario :** Un nouveau joueur (Victor) ouvre l'onglet Grimoire pour la première fois.

```mermaid
graph TD
    A[Joueur ouvre Onglet Grimoire] --> B{Grimoire Vide ?}
    B -- Oui --> C[Affiche 'Zero State' Intrigant]
    C --> D[Texte: 'Le savoir se mérite... Cherchez un Mentor']
    D --> E[Action RP: Joueur apprend 'Défense du Havre Sacré']
    E --> F[GM débloque le rituel (Dashboard/Discord)]
    F --> G[Notification In-Game: 'Nouveau Rituel Inscrit']
    G --> H[Animation: Encre s'écrit sur la page]
    H --> I[Lecture du Rituel]
```

### 2. Le Combat (Consultation Rapide)
*Objectif : Accès immédiat à l'information critique sous pression.*
**Scénario :** Victor est attaqué et doit lancer *Lame Ardente* immédiatement.

```mermaid
graph TD
    A[Situation de Stress] --> B[Clic Onglet 'Grimoire']
    B --> C[Focus Barre de Recherche]
    C --> D[Tape 'Lame']
    D --> E[Filtrage Instantané (Fuzzy)]
    E --> F[Affiche Résultat: 'Lame Ardente']
    F --> G[Clic sur la Carte]
    G --> H[Affichage Lecture (Panel Droit)]
    H --> I[Vérification Coût: '1 Point de Sang']
    I --> J[Exécution RP]
```

### 3. Le Fruit Défendu (Restriction)
*Objectif : Créer du désir et du mystère, pas de la frustration technique.*
**Scénario :** Victor (Niveau 2) voit un rituel de Niveau 5.

```mermaid
graph TD
    A[Navigation Liste Rituels] --> B[Voit 'Protection contre les Démons']
    B --> C{Test Niveau Joueur < 5}
    C -- Vrai --> D[Affichage: Distorsion Visuelle (Chaos Layer)]
    D --> E[Label 'Trop Complexe' (Pas de Cadenas banalisé)]
    E --> F[Clic Tentative]
    F --> G[Feedback Narratif: 'Votre esprit rejette ces symboles']
    G --> H[Reste sur la Liste (Pas d'ouverture)]
```

### Flow Optimization Principles
1.  **Zero State Narratif :** Ne jamais dire "Aucun résultat". Dire "Le savoir est caché".
2.  **Recherche Instantanée :** Le filtrage doit être < 50ms pour être viable en combat.
## Component Strategy

### Design System Components (Foundations)
We will leverage standard primitives (ShadCN/Radix + Tailwind) for base interactions to ensure accessibility and reliability:
-   **Navigation:** `Tabs` (Radix) for switching between Disciplines/Grimoire.
-   **Input:** `Input` with fuzzy search capability.
-   **Layout:** `ScrollArea` for the ritual list, `Sheet` or `Dialog` for mobile details.

### Custom Components (The "Goth" Layer)
These components carry the unique aesthetic and narrative weight.

#### 1. `RitualCard` (The List Item)
-   **Purpose:** Summarize a ritual in the selection list.
-   **Mobile-First Design:** No critical information hidden behind "Hover".
-   **States:**
    -   *Default:* Title, Level, Blood Cost (Visible Icon).
    -   *Locked:* Distorted visual, "Indecipherable" label.
    -   *Active:* High-contrast border, "Pressed" elevation.

#### 2. `GrimoireReader` (The Detail View)
-   **Purpose:** Immersive reading experience for the selected ritual.
-   **Tech Strategy:** `react-markdown` with strict typography plugins.
-   **Key Features:**
    -   *Drop Caps (Lettrines):* CSS `::first-letter` implementation for the first paragraph.
    -   *Marginalia:* Handwriting font (`Caveat`) for flavor text boundaries.
-   **Content Safety:** Must gracefully handle rich text from `rituals_v20.js` without breaking layout.

#### 3. `ChaosOverlay` (The Restriction Effect)
-   **Purpose:** Obscure content that is too high level.
-   **Visuals:** `backdrop-filter: blur()`, contrast boost, and noise texture.
-   **Performance Fallback:**
    -   *High-End:* Animated noise and blur.
    -   *Low-End/Mobile:* Static corrupt image opacity overlay (to prevent FPS drop).
    -   *Reduced Motion:* Simple opaque grayscale overlay.

### Implementation Roadmap
1.  **Phase 1 (Core):** Implement `RitualCard`, `GrimoireReader`, and basic `Tabs` integration.
2.  **Phase 2 (Polish):** Add `ChaosOverlay` with performance fallbacks and `BloodCostIndicator` animations.
## UX Consistency Patterns

### Feedback Patterns (The "Danger" Palette)
In a dark, gothic UI, standard "Green/Red" patterns fail. We use a thematic approach:
-   **Success (Safe/Learned):** Gold Glow (`#ca8a04`) + Parchment Sound. *Never use Green.*
-   **Failure (Danger/Rejected):** Blood Red Flash (`#be123c`) + Shake Animation.
-   **Neutral (Info):** Stone/Ash Gray (`#a8a29e`).

### Navigation Patterns
-   **Tabs:** Always "Sticky" at the top. Allow horizontal swipe on Mobile.
-   **State Persistence:** Returning to a tab restores the exact scroll position and last open item.

### Search Patterns
-   **Type:** Instant filtering (< 50ms).
-   **Scope:** Matches Title (FR/EN) and System Tags.
-   **Empty State:** Diegetic message ("Le Grimoire reste muet...") instead of technical "0 results".

### Overlay Patterns (Modals)
-   **Desktop:** Right-side Slide-over panel (Master-Detail preservation).
## Responsive Design & Accessibility

### Responsive Strategy
**Desktop (Master-Detail):**
-   **Layout:** Split View. 30% Left (List) / 70% Right (Reader).
-   **Benefits:** Rapid browsing without losing context. Ideal for GM dashboard usage.

**Mobile (Stacked Navigation):**
-   **Layout:** List View by default.
-   **Interaction:** Tap opens a "Full Screen Sheet" (Modal) with the ritual details.
-   **Closing:** Swipe down or Close button. One-thumb friendly.

### Accessibility Strategy (WCAG AA)
**Visuals:**
-   **Contrast:** Main text (`#e7e5e4`) on Dark BG (`#1c1917`) ensures > 7:1 ratio.
-   **Text Sizing:** Base font 16px. Headers Scale.

**Reduced Motion:**
-   **Chaos Overlay:** If `prefers-reduced-motion` is detected, replace animated noise/glitch with a static grayscale blur.
-   **Animations:** Disable "Ink Bleed" writing effects.

**Screen Readers (SR):**
-   **Locked Content:** Must explicitly announce "Content Locked: Level too high" via `aria-label`, not just rely on visual distortion.
-   **Icons:** "Blood Drop" icon = `aria-label="Cost: 1 Blood Point"`.
