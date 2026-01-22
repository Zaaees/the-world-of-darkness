# Story 2.1: Modèle de Données Werewolf

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a système,
I want une table `werewolf_data` en base de données,
so that les données des personnages Garou soient stockées de manière persistante.

## Acceptance Criteria

1. **Given** le module werewolf initialisé
   **When** je crée la table `werewolf_data`
   **Then** elle contient les colonnes : `user_id` (FK), `breed` (Race), `auspice`, `tribe` (Tribu), `name`, `story` (Histoire), `rank`, `discord_thread_id`, `created_at`, `updated_at`
   **And** `user_id` est la cléf primaire (ou index unique) liant à l'utilisateur Discord
   **And** les champs `breed`, `auspice`, `tribe` sont définis comme des textes (ou enums)

2. **Given** une entrée `werewolf_data` existante
   **When** une tentative de mise à jour des champs immuables (`breed`, `auspice`, `tribe`) est effectuée via le service
   **Then** le système doit empêcher ou ignorer cette modification (logique applicative)
   **And** les autres champs (`name`, `story`, `rank`, `discord_thread_id`) restent modifiables

## Tasks / Subtasks

- [x] Créer le modèle de données Backend
    - [x] Créer `modules/werewolf/models/store.py`
    - [x] Définir la classe DTO `WerewolfData` (Dataclass ou Pydantic)
    - [x] Implémenter la fonction de création de table `create_werewolf_table` (SQL DDL)
    - [x] Implémenter les fonctions CRUD de base : `get_werewolf_data(user_id)`, `create_werewolf_data(...)`, `update_werewolf_data(...)`

- [x] Intégration dans le cycle de vie du Bot
    - [x] S'assurer que la table est créée au démarrage du module (dans `__init__.py` ou via un hook d'initialisation)

- [x] Tests Unitaires / Intégration
    - [x] Tester la création de la table (in-memory SQLite)
    - [x] Tester l'insertion d'un nouveau loup-garou
    - [x] Tester la récupération des données
    - [x] Tester l'immuabilité (test logique service)

- [x] Review Follow-ups (AI)
    - [x] [AI-Review][High] Fix SQL Injection vulnerability in `update_werewolf_data`
    - [x] [AI-Review][Medium] Improve type hints and Enum validation for `WerewolfData`
    - [x] [AI-Review][Low] Ensure tests cover security fixes

## Dev Notes

### Architecture Compliance

- **Database Spec**: Utiliser `aiosqlite`.
- **Location**: `modules/werewolf/models/store.py` est l'emplacement correct selon l'architecture.
- **Naming**: Table `werewolf_data`.
- **Security**: Utiliser des requêtes paramétrées pour éviter les injections SQL (par défaut avec `aiosqlite`).

### Technical Recommendations

- **Discord IDs**: Stocker les IDs Discord (User ID, Thread ID) sous forme d'`INTEGER` (BigInt dans SQLite) ou `TEXT` pour éviter les soucis de précision JS si transmis au front. Le contexte projet suggère `string` côté API/Front, donc stockage `INTEGER` ou `TEXT` en DB est acceptable, mais la conversion doit être gérée dans le DTO/Service lors de l'envoi au front.
- **Service Layer**: Ne pas appeler la DB directement depuis les Cogs/Views. Passer par un `WerewolfService`.

### References

- [Source: epics.md#story-21-modèle-de-données-werewolf](../planning-artifacts/epics.md#story-21-modèle-de-données-werewolf) - Exigences métier.
- [Source: architecture.md#models](../planning-artifacts/architecture.md#models) - Structure des modèles.

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

- Implemented `modules/werewolf/models/store.py` with `WerewolfData` dataclass and CRUD operations.
- Added `create_werewolf_table` SQL logic.
- Created `modules/werewolf/cogs/lifecycle.py` to initialize tables on module load.
- Updated `modules/werewolf/manifest.json` to register the lifecycle cog.
- Added `tests/modules/werewolf/test_store.py` covering table creation, CRUD, and field immutability.
- Added project-level `pytest.ini` and `__init__.py` files to support testing.
- Confirmed all tests pass with `pytest`.
- **Code Review Update**: Fixed SQL injection vulnerability in `update_werewolf_data` by whitelisting columns.
- **Code Review Update**: Added `WerewolfBreed`, `WerewolfAuspice`, `WerewolfTribe` Enums and improved validation.

### File List

- modules/werewolf/models/store.py
- modules/werewolf/cogs/lifecycle.py
- modules/werewolf/manifest.json
- tests/modules/werewolf/test_store.py
- pytest.ini
- modules/__init__.py
- tests/__init__.py
