---
stepsCompleted: [1, 2, 3, 4]
workflowType: 'epics-and-stories'
project_name: 'the-world-of-darkness'
user_name: 'Freed'
date: '2026-01-08'
status: 'complete'
completedAt: '2026-01-08'
---

# the-world-of-darkness - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the-world-of-darkness, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: **Stockage de Données Statiques** - Le système doit charger les Rituels depuis un fichier statique `rituals_v20.js` contenant des objets structurés (id, name, level, discipline, clan_requirement, blood_requirement, description_md).
FR2: **Support Markdown** - Le système doit rendre le champ `description_md` en HTML formaté (gras, italique, sauts de ligne) pour une lecture riche.
FR3: **Recherche Floue Client-Side** - Le système doit filtrer les rituels par Titre et Mots-clés avec tolérance aux fautes de frappe (ex: "Tomaturgie" -> "Thaumaturgy").
FR4: **Filtrage Intelligent** - Le système doit filtrer les rituels par Niveau et Discipline pour la vue "Bibliothèque".
FR5: **Attribution GM "Soft Warning"** - Le GM doit pouvoir attribuer tout rituel, mais une modale de confirmation doit apparaître si les pré-requis (Clan/Sang) ne sont pas remplis par le joueur cible.
FR6: **Vue Joueur Restreinte** - Le joueur ne doit voir dans son grimoire **QUE** les rituels qu'il possède (Attribués par ID). Les autres sont invisibles.
FR7: **Mode Lecture "Grimoire"** - L'affichage du détail d'un rituel doit privilégier la lisibilité narrative et masquer les métadonnées techniques non-essentielles (Pureté Narrative).

### NonFunctional Requirements

NFR1: **Performance** - Le chargement du fichier de données et le rendu de la liste (>100 items) doivent être fluides (60fps), nécessitant de la virtualisation.
NFR2: **Compatibilité Mobile** - L'interface doit être conçue en priorité pour une lecture confortable sur mobile (Portrait).
NFR3: **Localisation** - L'interface et le contenu statique doivent être entièrement en Français.
NFR4: **Tolérance à la Sécurité** - Modèle "Fair-Play" accepté ; les données étant client-side, une protection robuste contre le datamining n'est pas requise.

### Additional Requirements

**Architecture Constraints:**
- **Stack:** Utiliser React, Vite, Tailwind CSS, Framer Motion (Existant) + `fuse.js`, `react-window`, `react-markdown`, `zustand` (Nouveaux).
- **Structure:** Implémenter dans `src/modules/vampire/features/rituals/`.
- **Validation:** Tests unitaires build-time pour `rituals_v20.js`.
- **Naming:** Code en Anglais, UI en Français.
- **Suffixe:** Utiliser `_md` pour les champs Markdown.
- **Animation:** Désactiver ou wrapper les animations d'entrée/sortie sur les listes virtualisées.
- **Decoupling:** `utils/search.js` doit être pur (pas de React).

**UX Design Constraints:**
- **Esthétique:** Style "V5 Editorial" (Goth-Industrial, Playfair Display).
- **Intégration:** Onglet dans la Fiche Personnage.
- **Pureté Narrative:** Masquer les règles mécaniques (dés, difficulté) dans la vue joueur.

### FR Coverage Map

FR1: Epic 1 - Static Data Loading
FR2: Epic 3 - Markdown Support (Reader)
FR3: Epic 2 - Client-Side Fuzzy Search
FR4: Epic 2 - Intelligent Filtering
FR5: Epic 3 - Attribution Logic (Soft Warning)
FR6: Epic 3 - Restricted Player View
FR7: Epic 3 - Narrative Reading Mode

## Epic List

## Epic 1: Core Foundation & Data

**Goal:** Establish the technical foundation, including static data loading, state management, and basic module structure, ensuring data integrity before UI development.

### Story 1.1: Project Structure & Dependencies

As a Developer,
I want to initialize the project structure and install necessary dependencies,
So that development can proceed with a stable and consistent environment.

**Acceptance Criteria:**

**Given** the project root
**When** I run `npm install fuse.js react-window react-markdown zustand`
**Then** the dependencies are added to `package.json`
**And** the directory structure `src/modules/vampire/features/rituals/` is created with subfolders `components`, `stores`, `utils`, `data`.

### Story 1.2: Static Data Integration

As a Developer,
I want to integrate the validated static data file and set up build-time validation,
So that the application has reliable source data without needing a database.

**Acceptance Criteria:**

**Given** the source file `rituals_v20.js` provided by the Content Team
**When** I place it in `src/modules/vampire/features/rituals/data/`
**Then** it exports a valid Javascript Array of objects
**And** a Vitest unit test confirms that all IDs are unique and required fields (`name`, `level`, `discipline`) are present.

### Story 1.3: State Management Setup

As a Developer,
I want to set up the Zustand store for the Grimoire,
So that the application can manage global state like the ritual list and active filters efficiently.

**Acceptance Criteria:**

**Given** the configured Zustand library
**When** I create `useGrimoireStore.js`
**Then** the store initializes with the full list of rituals from `rituals_v20.js`
**And** the store exposes a `filters` object (initial state empty)
**And** a simple test confirms the store mounts and returns data.

## Epic 2: "The Forbidden Library" (GM View)

**Goal:** Enable Game Masters to browse, search, and filter the complete catalog of rituals efficiently, even with large datasets.

### Story 2.1: Virtualized Catalog UI

As a Game Master,
I want to view the complete list of rituals in a scrollable, responsive grid,
So that I can quickly scan the available options without performance lag on my device.

**Acceptance Criteria:**

**Given** the store is loaded with 100+ rituals
**When** I scroll through the list
**Then** the rendering frames per second remains constant (approx 60fps) using virtualization
**And** the layout adapts to Grid (Desktop) or List (Mobile)
**And** each card displays the basic info (Name, Level, Discipline).

### Story 2.2: Filter Logic Implementation

As a Game Master,
I want to filter the ritual list by Discipline and Level,
So that I can narrow down my search to specific criteria (e.g., "Level 3 Thaumaturgy").

**Acceptance Criteria:**

**Given** the Filter Sidebar/Panel is open
**When** I select "Thaumaturgy" and "Level 3"
**Then** the displayed list updates immediately to show only matching rituals
**And** the filters are cumulative (AND logic)
**And** clear buttons allow resetting the view.

### Story 2.3: Fuzzy Search Integration

As a Game Master,
I want to search for rituals by name or keywords, even with typos,
So that I can find a specific ritual quickly during a game session.

**Acceptance Criteria:**

**Given** the Search Bar
**When** I type "tomaturgie" (misspelled)
**Then** the result for "Thaumaturgy" appears (Fuzzy Logic)
**And** the search filters the already filtered list (Search within Filter)
**And** clearing the search restores the previous list state.

## Epic 3: "Grimoire & Attribution" (Player/Interactive View)

**Goal:** Implement the core roleplay experience: unlocking rituals (Attribution logic) and reading them in an immersive, narrative-focused interface.

### Story 3.1: Attribution Logic with Soft Warning

As a Game Master,
I want to assign rituals to players with a warning if they don't meet the requirements,
So that I can manage character progression while maintaining game balance rules (with override capability).

**Acceptance Criteria:**

**Given** a selected ritual and a target player
**When** I click "Learn/Assign"
**Then** the system checks Clan and Blood Potency requirements
**And** if requirements are met, the ritual ID is added to the player's list
**And** if NOT met, a Confirmation Modal appears warning of the mismatch
**And** confirming the modal forces the addition (Override).

### Story 3.2: Restricted Player View

As a Player,
I want to see ONLY the rituals I have learned in my list,
So that I am not spoiled by unknown content and can focus on my character's actual capabilities.

**Acceptance Criteria:**

**Given** I am logged in as a Player (not GM)
**When** I access the Rituals tab
**Then** the displayed list corresponds strictly to the IDs in `myCharacter.rituals`
**And** I cannot search for or see rituals I do not possess (Ghost/Hidden).

### Story 3.3: Rich Markdown Reader (Grimoire View)

As a Player,
I want to read the full description of my rituals in a beautiful, readable format,
So that I can immerse myself in the lore and understand the narrative effects.

**Acceptance Criteria:**

**Given** I click on a ritual in my list
**When** the Detail View opens
**Then** the `description_md` is rendered as rich HTML (Bold, Italic, Paragraphs)
**And** the typography follows the "V5 Editorial" style (Serif fonts, margins)
**And** mechanics (dice pools) are clearly distinguished or styled differently from lore text.

## Epic 4: Polish & Release

**Goal:** Finalize the user experience with animations, mobile optimization, and visual polish to meet the "V5 Editorial" aesthetic.

### Story 4.1: Animation & Transitions

As a User,
I want to experience fluid and thematic transitions when navigating the app,
So that the interface feels modern, "alive," and consistent with the World of Darkness atmosphere.

**Acceptance Criteria:**

**Given** I navigate between the List and Detail views
**When** the page changes
**Then** a smooth fade or slide transition occurs (`AnimatePresence`)
**And** list items do NOT animate individually on scroll (to preserve virtualization performance)
**And** interactive elements (buttons, cards) have appropriate Hover and Active states.

### Story 4.2: Mobile UX & Responsive Check

As a Mobile User,
I want the interface to adapt perfectly to my small screen,
So that I can use the tool comfortably during a live game session without zooming or horizontal scrolling.

**Acceptance Criteria:**

**Given** I assume a viewport width of < 768px (Mobile)
**When** I access the Ritual filters
**Then** they appear in a collapsible Drawer/Accordion instead of a permanent Sidebar
**And** all touch targets are at least 44x44px
**And** navigation logic handles the "Back to List" flow intuitively.

### Story 4.3: Content Quality Review

As a Content Manager,
I want to ensure all ritual descriptions display correctly,
So that there are no layout breaks or readable issues regardless of text length.

**Acceptance Criteria:**

**Given** the full dataset of rituals
**When** I browse through items with very long or very short descriptions
**Then** the layout adapts gracefully (scrolling containers, flexible heights)
**And** no text is truncated unintentionally or overflows its container.
