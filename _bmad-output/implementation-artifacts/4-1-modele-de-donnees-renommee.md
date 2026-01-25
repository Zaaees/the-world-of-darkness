# Story 4.1: Modèle de Données Renommée

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a système,
I want une table `werewolf_renown` en base de données,
so that les demandes de Hauts Faits soient stockées et suivies.

## Acceptance Criteria

1. **Given** le module werewolf initialisé
2. **When** je crée la table `werewolf_renown`
3. **Then** elle contient : `id`, `user_id` (FK), `title`, `description`, `renown_type` (Glory/Honor/Wisdom), `status` (pending/approved/rejected), `submitted_at`, `validated_at`, `validated_by`

## Tasks / Subtasks

- [x] Créer le modèle de données `WerewolfRenown` dans `modules/werewolf/models/store.py` (AC: 1, 3)
  - [x] Ajouter les colonnes : `id` (PK, AUTOINCREMENT), `user_id` (FK), `title`, `description`, `renown_type`, `status`, `submitted_at`, `validated_at`, `validated_by`
  - [x] Configurer les types de données appropriés (Integer, String, DateTime)
  - [x] Ajouter les constantes pour `renown_type` (Glory, Honor, Wisdom) et `status` (pending, approved, rejected)
- [x] Mettre à jour la base de données (AC: 2)
  - [x] Créer une migration ou mettre à jour le script d'initialisation SQL dans `modules/werewolf/models/store.py`
  - [x] Vérifier la création de la table au démarrage du bot
- [x] Tests Smoke & Persistance
  - [x] Créer un test `test_renown_table_exists` pour vérifier que la table existe
  - [x] Créer un test `test_renown_creation_persistence` pour tester la création et la récupération d'une entrée

## Dev Notes

### Relevant architecture patterns and constraints
- **Segregated Extension Tables**: La table `werewolf_renown` est spécifique au module werewolf. [Source: [architecture.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md#L103-105)]
- **Snake Case**: Utiliser `snake_case` pour les noms de colonnes et de tables. [Source: [project-context.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/project-context.md#L101)]
- **Async DB**: Utiliser `aiosqlite` pour les opérations DB. [Source: [project-context.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/project-context.md#L31)]
- **Foreign Key**: `user_id` doit pointer vers `users(id)`.

### Source tree components to touch
- `modules/werewolf/models/store.py`
- `tests/modules/werewolf/test_renown_db.py` (NEW)

### Testing standards summary
- **Backend**: `pytest` + `pytest-asyncio` + integration with in-memory SQLite. [Source: [project-context.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/project-context.md#L84-91)]

### Project Structure Notes
- Alignment with `modules/werewolf/models/` for data models.

### References
- [Source: epics.md#Story 4.1](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md#L368)
- [Source: test-design-epic-4.md#Story 4.1](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/test-design-epic-4.md#L254)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.5 Flash)

### Debug Log References

### Completion Notes List
- Implemented `WerewolfRenown` dataclass in `store.py`.
- Added `RenownType` and `RenownStatus` enums.
- Added `create_renown_table`, `create_werewolf_renown`, and `get_werewolf_renown_by_user` DB functions.
- Refactored `test_renown_atdd.py` to match the implemented `store.py` structure (Project Structure alignment).
- Validated all tests pass (`pytest tests/modules/werewolf/test_renown_atdd.py tests/modules/werewolf/test_store.py`).

- `modules/werewolf/models/store.py`
- `tests/modules/werewolf/test_renown_atdd.py`

### Review Fixes (AI)
- Implemented `update_werewolf_renown` in `store.py`.
- Added DB index on `werewolf_renown.user_id`.
- Removed outdated "RED PHASE" comments from tests.
- Tracked `tests/modules/werewolf/test_renown_atdd.py` in git.
