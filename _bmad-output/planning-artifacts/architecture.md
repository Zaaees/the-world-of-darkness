---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
  - prd.md
  - ux-design-specification.md
  - ux-design-directions.html
  - docs/architecture-bot.md
  - docs/architecture-web.md
  - docs/data-models-bot.md
  - docs/project-overview.md
workflowType: 'architecture'
project_name: 'the-world-of-darkness'
user_name: 'Zaès'
date: '2026-01-20'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
Le système doit supporter deux "univers" distincts (Vampire & Werewolf) au sein d'une même application React + Python.
- **Routing Basé sur Rôle :** Middleware strict vérifiant les rôles Discord pour autoriser l'accès aux routes modules.
- **Gestion de Contenu Narratif :** Éditeurs de texte riche pour fiches et hauts faits, avec synchronisation vers des threads Discord forums.
- **Progression Asynchrone :** Système de soumission (Joueur) -> Validation (MJ) -> Notification (Bot).

**Non-Functional Requirements:**
- **Zero-Trust & Validation :** Validation backend stricte des rôles à chaque requête.
- **UX Thématique :** Capacité de changer complètement l'identité visuelle (CSS Variables) à la volée.
- **Résilience :** Mode dégradé si Discord API est lent/down (accès lecture seule cache local).

**Scale & Complexity:**
- Primary domain: **Hybrid Web/Bot Application**
- Complexity level: **Medium** (Integration heavy)
- Estimated architectural components: **~10-15** (Core Services + 2 Module Suites)

### Technical Constraints & Dependencies

- **Stack Imposée :** React (Vite), Python (Discord.py/Aiohttp), SQLite.
- **Discord Dependency :** Dépendance forte à l'API Discord pour l'authentification et le stockage "social".
- **Design System Existant :** Réutilisation obligatoire des composants UI "Vampire", adaptation par thèmes CSS uniquement.

### Cross-Cutting Concerns Identified

- **Authentication & Authorization :** Gestion unifiée des sessions basées sur OAuth2 Discord.
- **Module Loading Strategy :** Pattern Core/Module pour Backend et Frontend.
- **Data Synchronization Layer :** Abstraction pour gérer la synchro DB <-> Discord <-> GSheets.
- **Theme Engine :** Système de bascule de variables CSS global.

## Starter Template Evaluation

### Primary Technology Domain
**Hybrid Web/Bot Application (Existing Monorepo)**.
Le projet est une application composite : un Bot Discord (Python) couplé à une Web App (React) partageant un contexte d'authentification.

### Starter Options Considered
*   **New Vite Template:** Rejeté. Discontinuité avec le code existant.
*   **Existing "Vampire Code" Base:** Sélectionné. Architecture éprouvée, dépendances déjà configurées.

### Selected Starter: Existing Monorepo (Version 2026.1)

**Rationale for Selection:**
Le projet nécessite une intégration parfaite avec le module Vampire existant. Repartir sur une stack différente (ex: Next.js) briserait la cohérence UI et complexifierait le déploiement. Nous adoptons le "Vampire Core" comme framework.

**Initialization Command:**

```bash
# Pas de commande d'init, mais une structure de dossiers à respecter
mkdir -p modules/werewolf
mkdir -p web/src/modules/werewolf
```

**Architectural Decisions Provided by Existing Stack:**

**Language & Runtime:**
- **Frontend:** React 19.2.0 (Latest) + JavaScript Module (ESM)
- **Backend:** Python 3.10+ + Discord.py 2.3.0

**Styling Solution:**
- **TailwindCSS 3.4:** Pour les utilitaires layout.
- **CSS Variables:** Pour le moteur de thèmes (Switch Vampire vs Wild).
- **Lucide React:** Pour les icônes vectorielles.

**State Management & Routing:**
- **Zustand 5.0:** Gestion d'état global léger (Auth, Theme).
- **React Router 7:** Routage déclaratif moderne pour gérer les vues modules.

**Build Tooling:**
- **Vite 7.2:** HMR ultra-rapide et build optimisé.
- **Vitest:** Framework de test unitaire configuré.

**Development Experience:**
- **Eslint 9:** Linting strict déjà en place.
- **Framer Motion 12:** Animations UI fluides déjà disponibles.

## Core Architectural Decisions

### Data Architecture
**Decision:** Segregated Extension Tables
**Rationale:** Pour éviter d'avoir une table `users` géante avec des colonnes nulles (`clan` vs `tribu`), chaque Splat a sa propre table (`vampire_data`, `werewolf_data`). La table `users` ne contient que l'identité partagée (Discord ID, XP global).
**Implies:** Jointures SQL lors de la récupération du profil complet.

### Authentication & Security
**Decision:** Omni-Channel Role Verification (Zero Trust)
**Rationale:** La sécurité ne doit pas dépendre du client. Le Backend revérifie le Rôle Discord (via cache) à chaque requête `/api/modules/*`.
**Safety:** Si un utilisateur perd son rôle Discord pendant sa session, ses actions API échoueront immédiatement.

### API & Communication Patterns
**Decision:** Fractal Module API
**Rationale:** Chaque module expose son propre `router.py` monté sur `/api/modules/{module_id}`. Le Core ne connaît pas les routes internes des modules.
**Standard:** Erreurs API standardisées (403 Forbidden, 404 Not Found) renvoyées en JSON `{ error: str, code: int }`.

### Frontend Architecture
**Decision:** Context-Driven Theming
**Rationale:** Le changement d'ambiance ne doit pas nécessiter de rechargement. Un Context React injecte les variables CSS dynamiques au niveau du conteneur racine du module.
**Scope:** Les styles globaux (Reset, Fonts) sont partagés. Les styles sémantiques (Couleurs, Paddings) sont thémables.

### Infrastructure & Deployment
**Decision:** Monolithic Deployment (Keep it Simple)
**Rationale:** Le trafic attendu ne justifie pas une séparation en micro-services. Le déploiement unique garantit que le Frontend (React) et le Backend (API) sont toujours synchronisés en version.

## Implementation Patterns & Consistency Rules

### Naming Patterns
**Database & Backend (Python):** `snake_case` usage mandatory. Table names are `plural` (e.g., `werewolf_gifts`).
**Frontend (React):** `camelCase` for props/variables. `PascalCase` for components.
**API Contract:** JSON keys retain `snake_case` from DB to minimize mapping overhead (e.g., `data.gift_name`).

### Structure Patterns
**Co-Location Strategy:**
- React: Component + Style + Test in same directory.
- Python: Module folders contain their own `models`, `views`, `services`.
**Strict Module Isolation:**
- No cross-module imports (e.g., `werewolf` cannot import `vampire`).
- Shared logic goes to `@core`.

### Format Patterns
**API Response Standard:**
```json
{
  "status": "success" | "error",
  "data": { ...contents... }, // Only on success
  "message": "Human readable error", // Only on error
  "code": "ERROR_CODE_CONSTANT" // For programmatic handling
}
```

### Communication Patterns
**State Management:**
- Each Module has its own Zustand Store (`useWerewolfStore`).
- Stores reset on unmount/logout.

**Error Handling:**
- Frontend: Global `ErrorBoundary` catches React crashes. `toast.error()` displays API messages.
- Backend: Global Exception Handler converts Python Exceptions to JSON 500 responses.

### Enforcement Guidelines
**All AI Agents MUST:**
1. Check `manifest.json` before creating new module files.
2. Use the provided `ServiceResponse` class for ALL API returns.
3. Verify `snake_case` in DB schemas before migrations.

## Project Structure & Boundaries

### Complete Project Directory Structure
L'architecture suit strictement le pattern **Core/Modules** défini précédemment. Voici les nouveaux dossiers et fichiers requis.

```text
root/
├── modules/                        # BACKEND (Python)
│   └── werewolf/                   # [NEW] Le Module Loup-Garou
│       ├── __init__.py
│       ├── manifest.json           # ID: "werewolf", Version: 1.0.0
│       ├── cogs/                   # Slash Commands Discord
│       │   ├── commands.py         # /werewolf ...
│       │   └── admin.py            # /admin werewolf ...
│       ├── models/                 # Base de données (SQLite models)
│       │   └── store.py            # Table `werewolf_data` + DTOs
│       ├── services/               # Logique Métier (Règles)
│       │   ├── sheet.py            # Gestion de la Fiche
│       │   └── renown.py           # Gestion des Hauts Faits
│       ├── views/                  # Vues Discord (Modales/Boutons)
│       │   └── onboarding.py       # Menu de création de personnage
│       └── assets/                 # Données statiques (JSON)
│           └── gifts_data.json     # DB statique des Dons
│
├── web/src/modules/                # FRONTEND (React)
│   └── werewolf/                   # [NEW] Le Frontend Loup-Garou
│       ├── index.js                # Point d'entrée (Manifeste JS)
│       ├── routes.jsx              # Routing interne (/sheet, /gifts)
│       ├── components/             # Composants exclusifs
│       │   ├── WerewolfSheet.jsx
│       │   ├── GiftCard.jsx
│       │   └── RenownBadge.jsx
│       ├── pages/                  # Vues principales
│       │   ├── SheetPage.jsx
│       │   └── GiftsPage.jsx
│       ├── hooks/
│       │   └── useWerewolfStore.js # State (Zustand)
│       └── assets/                 # Styles & Images
│           ├── werewolf-theme.css  # Variables CSS (Surcharge)
│           └── glyphs/             # SVGs Tribaux
```

### Architectural Boundaries

**API Boundaries:**
- **Endpoints:** Toutes les routes du module sont montées sur `/api/modules/werewolf/*`.
- **Isolation:** Le module backend n'a **AUCUNE** route racine. Il ne répond qu'à travers ce préfixe.

**Component Boundaries:**
- **Pages:** Les pages `SheetPage` et `GiftsPage` sont chargées en Lazy Loading par le Router Core.
- **Shared UI:** Le module utilise `@core/components/Button` mais ne doit JAMAIS importer `modules/vampire/BloodOrb`.

**Data Boundaries:**
- **Own Tables:** Le module possède la table SQL `werewolf_data`.
- **No Shared Writes:** Seul le module Werewolf écrit dans sa table. Le Core ne fait que lire via des interfaces génériques si nécessaire.

### Requirements to Structure Mapping

**Epic: "Le Premier Pas" (Onboarding)**
- **Backend:** `modules/werewolf/views/onboarding.py` (Formulaire Discord)
- **Frontend:** `web/src/modules/werewolf/pages/SheetPage.jsx` (Première visite)

**Epic: "La Gloire" (Hauts Faits)**
- **Backend:** `modules/werewolf/services/renown.py` (Validation logique)
- **Frontend:** `web/src/modules/werewolf/components/RenownBadge.jsx` (Affichage)

**Cross-Cutting: Authentication**
- **Middleware:** Géré par `api_server.py` (Core) qui injecte `request.user` dans les routes du module.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Toutes les décisions sont compatibles. L'architecture miroir (Backend Python / Frontend React) est cohérente avec l'existant. Pas de conflit de paradigme détecté.

**Pattern Consistency:**
Les patterns de nommage (Snake vs Camel) et de structure (Co-location) sont définis et alignés avec les technologies choisies.

**Structure Alignment:**
L'arborescence `modules/werewolf` est symétrique entre Backend et Frontend, respectant la décision d'isolation "Fractale".

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- **Onboarding:** Couvert par les vues `onboarding.py` et pages `SheetPage`.
- **Hauts Faits:** Couvert par le service `renown.py` et composants `RenownBadge`.
- **Dons:** Couvert par `gifts_data.json` et `GiftCard`.

**Functional Requirements Coverage:**
- **Routing (FR1-3):** Couvert par Auth Middleware + Routes Préfixées.
- **Narratif (FR4-7):** Couvert par Table dédiée + StoryEditor.
- **Progression (FR8-11):** Couvert par Service Renown + Validation MJ.

**Non-Functional Requirements Coverage:**
- **Sécurité (Zero Trust):** Vérification rôle Backend à chaque appel.
- **Performance:** Thème CSS (pas de flash) + Lazy Loading.

### Implementation Readiness Validation ✅

**Decision Completeness:**
Les décisions critiques (Stack, DB, Auth) sont actées.

**Structure Completeness:**
L'arborescence est complète et explicite.

**Pattern Completeness:**
Les règles de nommage et de communication sont établies.

### Gap Analysis Results

**Minor Gaps:**
- Le format exact du JSON `gifts_data.json` reste à définir lors de l'implémentation de la User Story "Consultation des Dons". Non bloquant.

### Validation Issues Addressed

Aucun problème bloquant identifié. L'architecture est saine.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Intégration transparente dans l'existant (DRY).
- Séparation nette des univers (Werewolf isolé de Vampire).
- UX adaptée au RP (Thème immersif).

### Implementation Handoff

**AI Agent Guidelines:**
- Respectez scrupuleusement l'isolation des modules : Pas d'import croisé !
- Vérifiez le fichier `manifest.json` pour la structure.
- Utilisez `ServiceResponse` pour standardiser les retours API.

**First Implementation Priority:**
Création de l'arborescence `modules/werewolf` et `web/src/modules/werewolf` selon le schéma défini.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-20
**Document Location:** planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project directory structure
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- All architectural decisions made
- Implementation patterns defined
- Architectural components specified
- Requirements fully supported

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing the-world-of-darkness. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**
Création de l'arborescence `modules/werewolf` et `web/src/modules/werewolf` selon le schéma défini.

**Development Sequence:**

1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen starter template and architectural patterns provide a production-ready foundation following current best practices.

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.






