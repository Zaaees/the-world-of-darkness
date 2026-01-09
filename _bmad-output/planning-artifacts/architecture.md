---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments: [
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\_bmad-output\\planning-artifacts\\prd.md",
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\_bmad-output\\planning-artifacts\\ux-design-specification.md",
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\_bmad-output\\planning-artifacts\\research\\domain-Rituels_V20_Thaumaturgie_et_Necromancie-research-2026-01-07.md",
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\_bmad-output\\planning-artifacts\\research\\technical-integration-rituels-v20-narratif-research-2026-01-08.md",
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\docs\\architecture-bot.md",
  "c:\\Users\\freed\\Desktop\\the-world-of-darkness\\docs\\architecture-web.md"
]
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
project_name: 'the-world-of-darkness'
user_name: 'Freed'
date: '2026-01-08'
lastStep: 8
status: 'complete'
completedAt: '2026-01-08'
---

# Architecture Decision Document

## Analyse du Contexte Projet

### Vue d'ensemble des Exigences

**Exigences Fonctionnelles (FR):**
-   **Catalogue de Rituels :** Consultation, filtrage (niveau, discipline), recherche floue.
-   **Fiche de Personnage :** Intégration transparente dans la fiche Vampire (Onglet).
-   **Gestion d'État :** Persistance de l'état de lecture et de la navigation.

**Exigences Non-Fonctionnelles (NFR):**
-   **Performance :** Rendu fluide (60fps) pour >100 rituels (Virtualisation requise).
-   **Localisation :** Support natif du Français (Data + UI).
-   **Accessibilité :** Support du "Reduced Motion" pour les effets de distorsion.
-   **Esthétique :** Respect strict du style "V5 Editorial" (Markdown riche, Typographie).

**Échelle & Complexité :**
-   Domaine Principal : Frontend Web (React SPA).
-   Niveau de Complexité : Moyenne (UI riche, Logique métier simple, Pas de Backend).
-   Composants Clés : ~5-7 composants majeurs (RitualCatalog, Reader, Filters, Card...).

### Contraintes Techniques & Dépendances

-   **Architecture Modulaire :** Isolation stricte dans `src/modules/vampire`.
-   **Data Source :** Fichier statique `rituals_v20.js` (Pas d'API externe).
-   **Stack existante :** React, Tailwind, Framer Motion.

### Préoccupations Transversales (Cross-Cutting Concerns)

-   **Gestion des Assets :** Chargement des images/textures (Poids vs Qualité).
-   **Navigation :** Routage profond (Deep Linking) et synchronisation URL.
## Socle Technique (Architecture Brownfield)

### Domaine Principal
**Frontend Web (SPA React)** - Extension du socle existant.

### Stack Validée
Nous ne partons pas d'un template vierge, mais étendons l'architecture existante avec des librairies ciblées pour répondre aux exigences de performance et de narration du Grimoire.

**1. Socle Existant (Conservé) :**
-   **Runtime/Build :** React + Vite
-   **Routing :** React Router Dom (v6+)
-   **Styling :** Tailwind CSS + Framer Motion

**2. Nouvelles Briques (Validées) :**
-   **Recherche :** `fuse.js` (v7.1.0)
    *   *Role :* Recherche floue côté client (Indexation des titres et descriptions).
-   **Performance UI :** `react-window` (v2.2.4)
    *   *Role :* Virtualisation des listes pour supporter >100 rituels sans dégradation du DOM.
-   **Rendu Contenu :** `react-markdown` (v10.1.0)
    *   *Role :* Transformation sécurisée du Markdown riche (Description des rituels) en composants React typographiés.

### Commandes d'Installation
## Décisions Architecturales Cœurs

### Architecture de Données
**Stratégie :** Données Statiques Validées
-   **Stockage :** Fichier source `src/modules/vampire/data/rituals_v20.js` (Export JS Array).
-   **Validation :** **Build-time uniquement**. Des tests unitaires (Vitest) scanneront le fichier pour garantir l'unicité des IDs et la présence des champs requis. Pas de surcoût runtime (Zod exclu).
-   **Décision :** Option B (Tests Unitaires).

### Architecture Frontend
**Gestion d'État :** Store Atomique
-   **Librairie :** `zustand` (v4+)
-   **Scope :** Un store dédié `useGrimoireStore` encapsulera toute la logique UI (Filtres, Recherche, Selection).
-   **Décision :** Option A (Zustand) pour la clarté et la performance (évite les re-renders excessifs du Context).

### Résumé des Commandes
## Patrons d'Implémentation & Règles

### Règles de Consistance (Agents AI)

**1. Convention de Nommage (Langue)**
-   **Règle :** Code en **Anglais** (Variables, Fonctions, Commentaires techniques). Contenu et Strings UI en **Français**.
-   **Exemple Correct :** `const bloodCost = 2; // Coût en point de sang`
-   **Anti-Pattern :** `const coutSang = 2;`

**2. Structure des Dossiers (Modularité)**
-   **Règle :** Organisation par **Feature** (Fonctionnalité) au sein des modules.
-   **Application :** Tout ce qui concerne le Grimoire va dans `src/modules/vampire/features/rituals/`. Pas de composants rituels dispersés dans un dossier générique `components/`.

**3. Format des Données (Markdown)**
-   **Règle :** Suffixe explicite `_md` pour les champs contenant du texte riche.
-   **Exemple :** `{ system_md: "**Jet de dés:** ...", description_md: "..." }`
-   **Pourquoi :** Signale immédiatement au développeur (et à l'AI) qu'il faut utiliser `<MarkdownRenderer>` et pas juste `{text}`.

## Structure du Projet & Frontières

### Arborescence Complète (Vampire Module)
```text
src/
└── modules/
    └── vampire/
        ├── data/
        │   └── rituals_v20.js              # Base de données statique (Source de vérité)
        │
        └── features/
            └── rituals/ (Feature Grimoire)
                ├── components/             # UI Components
                │   ├── RitualCatalog.jsx   # Container Virtuoso (Liste Virtuelle)
                │   ├── RitualReader.jsx    # Vue Détail (Markdown Rendering)
                │   ├── RitualFilter.jsx    # Sidebar Filtres (Discipline/Niveau)
                │   └── RitualCard.jsx      # Composant Atomique (Liste Item)
                │
                ├── stores/
                │   └── useGrimoireStore.js # État Zustand (Search, Filter, Selection)
                │
                ├── utils/
                │   ├── search.js           # Configuration Fuse.js
                │   └── transform.js        # Helpers (Level to Badge, etc.)
                │
                └── index.js                # Point d'entrée public de la feature
```

### Frontières Architecturales

**Boundary de Données :**
-   `rituals_v20.js` est Immutable au runtime. Aucune écriture.
-   Toute transformation de donnée (recherche, tri) se fait dans les sélecteurs Zustand, jamais dans le fichier source.

**Boundary d'État :**
-   `useGrimoireStore` encapsule 100% de la logique métier UI.
-   Les composants React sont "dumb" : ils affichent ce que le store leur donne et dispatch des actions, sans gérer d'état complexe eux-mêmes.

**Boundary d'Isolation :**
-   Le dossier `src/modules/vampire/features/rituals` est privé.
-   ## Validation & Handoff

### Résultats de la Validation (Party Mode)
**✅ Cohérence Globale :** L'architecture est stable et alignée avec les besoins.
**⚠️ Points de Vigilance (Ajoutés) :**
1.  **Conflit Virtualisation/Animation :** Les animations d'entrée/sortie sur la liste des rituels doivent être désactivées ou gérées via un wrapper spécifique pour éviter les bugs visuels avec `react-window`.
2.  **Découplage Search :** Le fichier `utils/search.js` doit être une librairie pure (sans dépendance React) pour faciliter les tests unitaires.
3.  **CI/CD :** Les tests validant `rituals_v20.js` doivent être bloquants dans le pipeline de déploiement.

### Checklist de Pré-Implémentation
**Avant de commencer à coder, l'agent Dev doit :**
- [ ] Installer les dépendances : `npm install fuse.js react-window react-markdown zustand`
- [ ] Créer la structure de dossiers `src/modules/vampire/features/rituals/`
- [ ] Copier/Créer le fichier `rituals_v20.js` et le valider.
- [ ] Configurer le store Zustand vide.

**Démarrage :**
L'implémentation commencera par la création de la structure et du store.
