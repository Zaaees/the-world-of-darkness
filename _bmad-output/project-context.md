---
project_name: 'the-world-of-darkness'
user_name: 'Zaès'
date: '2026-01-20'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'critical_rules']
existing_patterns_found: 7
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Backend (Discord Bot)
- **Language:** Python 3.11
- **Framework:** discord.py >= 2.3.0
- **Database:** aiosqlite >= 0.19.0
- **Async HTTP:** aiohttp >= 3.9.0
- **Config:** python-dotenv >= 1.0.0

### Frontend (Web)
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** TailwindCSS 3.4.19
- **Routing:** React Router 7.12.0
- **State Management:** Zustand 5.0.9

## Critical Implementation Rules

### Règles Spécifiques aux Langages

#### Python (Backend)
- **Async Obligatoire :** Toutes les opérations I/O (DB, HTTP, Discord) DOIVENT utiliser `async/await`.
- **Logging :** Utiliser `logger = logging.getLogger(__name__)` pour chaque module.
- **Typage :** Utiliser les types hints de Python 3.11 (ex: `Optional[tuple]`).
- **Langue Interne :** Les commentaires et docstrings sont en **Français**.
- **Configuration :** Charger les variables d'environnement via `python-dotenv`.

#### JavaScript/React (Frontend)
- **Modules ESM :** Toujours utiliser les imports/exports ES6.
- **Composants Fonctionnels :** Pas de classes React. Utiliser des fonctions et Hooks.
- **Extension :** Utiliser `.jsx` pour les fichiers contenant du JSX.

### Règles Spécifiques aux Frameworks

#### React (Frontend)
- **Lazy Loading Modules :** Chaque module DOIT exporter un `index.js` avec : `id`, `name`, `path`, `icon`, `RootComponent` (lazy loaded).
- **Routing :** Utiliser React Router 7 avec `<Suspense>` pour le chargement différé.
- **State Management :** Utiliser Zustand pour l'état global. Pas de Redux.
- **Redirection Auth :** Préserver le hash fragment lors des redirections (OAuth Discord).

#### discord.py (Backend)
- **Module Manifest :** Chaque module DOIT avoir un `manifest.json` avec : `id`, `name`, `version`, `entry_points`, `dependencies`.
- **Cogs Structure :** Placer les commandes slash dans `modules/{module_id}/cogs/`.
- **No Cross-Module Imports :** Les modules NE DOIVENT PAS s'importer directement. Utiliser l'Event Bus du Core.

### Règles de Test

#### Frontend (Vitest + Testing Library)
- **Framework :** Utiliser Vitest (configuré dans `vite.config.js`).
- **Colocation :** Tests placés à côté des fichiers testés (`Component.jsx` → `Component.test.jsx`).
- **Testing Library :** Utiliser `@testing-library/react` pour les tests de composants.
- **Environment :** `jsdom` (pas de browser réel).
- **Structure :** Utiliser `describe`/`it`/`expect` de Vitest.

#### Backend (Python)
- Aucun test automatisé actuellement (considérer `pytest` + `pytest-asyncio`).

### Règles de Qualité & Style

#### Linting (ESLint)
- **Config :** ESLint 9+ avec flat config (`eslint.config.js`).
- **Plugins :** `react-hooks` (recommended), `react-refresh` (Vite HMR).
- **Unused Vars :** Variables commençant par majuscule ou underscore sont ignorées.
- **Run :** `npm run lint` avant chaque commit.

#### Styling (TailwindCSS)
- **Fonts Personnalisées :**
  - `font-serif` / `font-header` → Playfair Display
  - `font-body` → Inter
  - `font-hand` → Caveat
- **Classes Utilitaires :** Préférer les classes Tailwind au CSS inline.

#### Organisation du Code
- **Features Pattern :** Dans les modules, organiser par fonctionnalité (`features/{feature}/components/`).
- **Core Components :** Composants réutilisables dans `src/core/components/`.

### Règles de Workflow de Développement

#### Déploiement (CI/CD)
- **Bot (Backend) :** Déploiement automatique sur **Fly.io** via GitHub Actions.
  - Trigger : Push sur `main` avec modifications dans `*.py`, `cogs/`, `modules/`, etc.
  - Région : `cdg` (Paris)
- **Web (Frontend) :** Déploiement automatique sur **GitHub Pages**.
  - Trigger : Push sur `main` avec modifications dans `web/**`.
  - Build : Node 20, `npm ci && npm run build`.
  - URL API : `https://world-of-darkness-bot.fly.dev`

#### Git
- **Branches :** `main` est la branche de production.
- **Path-based Triggers :** Les workflows sont déclenchés uniquement si les fichiers pertinents sont modifiés.

### Règles Critiques (Don't-Miss)

#### Anti-Patterns à Éviter
- ❌ **Ne PAS** importer directement entre modules (ni Backend ni Frontend).
- ❌ **Ne PAS** utiliser d'I/O bloquant (`open()`, `requests`) dans le code Python. Utiliser `aiofiles`, `aiohttp`.
- ❌ **Ne PAS** créer de composants React sous forme de classes.

#### Edge Cases & Gotchas
- **IDs Discord (JS) :** Convertir les IDs numériques Discord en `string` côté API pour éviter la perte de précision en JavaScript.
- **OAuth Hash Fragment :** Lors des redirections, préserver le hash (`#access_token=...`) pour l'auth Discord Implicit Grant.
- **CORS :** Le middleware CORS n'autorise que les origines listées dans `ALLOWED_ORIGINS`.

#### Sécurité
- **Tokens :** Ne JAMAIS commiter de tokens ou secrets. Utiliser `.env` et `.gitignore`.
- **Auth Headers :** Valider `X-Discord-User-ID` et `X-Discord-Guild-ID` pour chaque requête API protégée.

---

## Usage Guidelines

**Pour les Agents IA :**
- Lire ce fichier AVANT d'implémenter du code.
- Suivre TOUTES les règles exactement comme documentées.
- En cas de doute, préférer l'option la plus restrictive.

**Pour les Humains :**
- Garder ce fichier concis et focalisé sur les besoins des agents.
- Mettre à jour lors de changements de stack technologique.
- Réviser trimestriellement pour supprimer les règles obsolètes.

*Dernière mise à jour : 2026-01-20*
