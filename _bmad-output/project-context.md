---
project_name: 'the-world-of-darkness'
user_name: 'Zaès'
date: '2026-01-23'
sections_completed:
  ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 50
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Frontend (Web)
- **Core:** React 19.2.0, Vite 7.2.4
- **Styling:** TailwindCSS 3.4.19, Framer Motion 12.25.0
- **Routing:** React Router 7.12.0
- **State:** Zustand 5.0.9
- **Icons:** Lucide React 0.562.0
- **Testing:** Vitest 4.0.16 + React Testing Library

### Backend (Discord Bot)
- **Language:** Python 3.11
- **Framework:** discord.py >= 2.3.0
- **Data:** aiosqlite >= 0.19.0
- **Module System:** Custom `manifest.json` based architecture
- **Async HTTP:** aiohttp >= 3.9.0
- **Config:** python-dotenv >= 1.0.0

## Critical Implementation Rules

### Règles Spécifiques aux Langages

#### Python (Backend)
- **Async System:** `async/await` obligatoire pour tout I/O (DB, Discord, HTTP).
- **Typing:** Typage strict (`Optional`, `List`) et `dataclasses` pour les modèles.
- **Documentation (STRICT) :**
  - **Langue :** 🇫🇷 **Français UNIQUEMENT** pour tout (Docstrings et Commentaires).
  - **Format:** Google Style en Français (ex: `"""Crée un nouveau personnage."""`).
  - **Dette Technique :** Les docstrings existantes en Anglais doivent être traduites lors de leur prochaine modification.

#### JavaScript/React (Frontend)
- **Composants :** Fonctionnels + Hooks uniquement (Pas de classes).
- **Extension:** `.jsx` obligatoire pour le code React.
- **Documentation :** JSDoc en **Français** obligatoire pour tous les composants et hooks exportés.

### Règles Spécifiques aux Frameworks

#### React (Frontend)
- **State Management :**
  - Global : Zustand (`useStore`) pour auth/thèmes.
  - Local : `useState` pour l'UI éphémère.
- **Styling :**
  - **TailwindCSS** pour le layout et spacing.
  - **CSS Variables** pour le theming dynamique.
  - **Framer Motion** pour TOUTES les animations complexes.
- **Performance :**
  - Lazy Loading des pages module.
  - Debouncing pour les sauvegardes automatiques (ex: StoryEditor).

#### discord.py (Backend)
- **Structure :**
  - `cogs/` : Interface Discord (Commandes/Events).
  - `services/` : Logique métier pure.
  - `models/` : Accès données (Data Classes).
- **Isolation :** Pas d'imports croisés entre modules.
- **Database:** `aiosqlite` avec `Row` factory.

### Règles de Test

#### Frontend (Vitest + Testing Library)
- **Framework :** Vitest (configuré avec `vi.mock` et `vi.hoisted`).
- **Composants :** `@testing-library/react` (`render`, `screen`, `expect`).
- **Structure :** `describe`/`it` pattern.
- **Routing :** Utiliser `MemoryRouter` pour tester les redirections.
- **Colocation :** Fichier test à côté du composant (`Comp.test.jsx`).

#### Backend (pytest)
- **Framework :** `pytest` + `pytest-asyncio` pour les tests asynchrones.
- **Database :** Tests d'intégration utilisant `aiosqlite` en mémoire (via fixture `db_connection`).
- **Patterns :**
  - **GIVEN-WHEN-THEN :** Structure de test explicite dans les commentaires.
  - **Fixtures :** Utilisation de factories (`tests/fixtures/factories.py`).
  - **Smoke Tests :** Validation SQL basique avant logique complexe.

### Règles de Qualité & Style

#### Linting (Standardisation)
- **Frontend :** `npm run lint` obligatoire avant commit (ESLint 9 + React Hooks).
- **Backend :** 
  - Respect du **PEP 8** (manuel pour l'instant).
  - Imports triés : Stdlib > Third-party > Local.
  - **Dette Technique :** Le code existant n'est pas strictement linté. L'installation de `ruff` est prévue.
- **Convention de Nommage :**
  - Python : `snake_case` (variables, fonctions, modules).
  - JS/React : `camelCase` (props, vars), `PascalCase` (Composants).

### Règles de Workflow (AUTOMATISATION)
- **ATDD Checklists (OBLIGATOIRE) :**
  - **POUR CHAQUE STORY `X-Y`** : L'Agent **DOIT** lire le fichier `implementation-artifacts/atdd-checklist-X-Y.md` AVANT de commencer le code.
  - Ce fichier contient les cas limites et les ID HTML requis pour les tests.
  - Si le fichier n'est pas trouvé, l'Agent doit le signaler.

### Règles de Workflow de Développement

#### Git et Versioning
- **Branches :** `main` est stable. Développer dans `feature/nom-feature`.
- **Commits :** Conventional Commits (ex: `feat(werewolf): add story editor`).
- **Review :** Validation humaine ou par Agent Reviewer requise.

#### Déploiement (Monolithe)
- **Synchro :** Le Frontend et Backend sont versionnés et déployés ensemble.
- **Bot :** Redémarrage nécessaire pour prise en compte des modifications Python (`cogs`).

### Règles Critiques (Don't-Miss)

#### Anti-Patterns
- ❌ **Pas d'imports croisés** entre modules (Vampire <-> Werewolf). Utiliser le Core Event Bus.
- ❌ **Pas d'I/O bloquant** dans le bot (jamais de `time.sleep` ou `requests`).
- ❌ **Pas de classes React**.

#### Edge Cases
- **IDs Discord :** Toujours traiter les IDs Discord comme des **Strings** en JS (BigInt loss warning).
- **Error Handling :** Le Backend ne doit jamais crasher. Catcher `Exception` dans les Tasks et logger.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

*Dernière mise à jour : 2026-01-23*
