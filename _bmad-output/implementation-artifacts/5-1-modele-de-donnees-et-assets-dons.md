# Story 5.1: Modèle de Données et Assets Dons

Status: done

<!-- Note: Validation of this story file against checklist.md is required before implementation. -->

## Story

As a système,
I want une structure de données pour les Dons,
so that le catalogue et les déblocages soient gérés.

## Acceptance Criteria

1.  **Fichier Asset (Catalogue):** `modules/werewolf/assets/gifts_data.json` existe et contient le catalogue complet des Dons.
    - Propriétés requises par Don: `id`, `name_fr`, `tribe`, `level`, `description`, `gnosis_cost`.
    - Doit inclure des exemples de Dons pour au moins 3 tribus différentes.
2.  **Table de Données (Déblocages):** La table `werewolf_player_gifts` est créée via une migration SQLAlchemy/SQLite.
    - Colonnes requises: `user_id` (FK vers `users.discord_id`), `gift_id` (string id du JSON), `unlocked_at` (timestamp), `unlocked_by` (ID Discord du MJ).
    - Contrainte d'unicité sur `(user_id, gift_id)`.
3.  **Service Access:** Une méthode dans `modules/werewolf/services/gifts.py` (ou `store.py`) permet de charger le catalogue JSON.
4.  **Database Access:** Le modèle est ajouté à `modules/werewolf/models/store.py`.

## Tasks / Subtasks

- [x] **Data: Gift Catalogue Asset**
  - [x] Créer `modules/werewolf/assets/gifts_data.json`
  - [x] Remplir avec les données initiales (exemples pour Ragabash, Ahroun, Theurge)
- [x] **Backend: Database Model**
  - [x] Mettre à jour `modules/werewolf/models/store.py`
  - [x] Ajouter la classe `WerewolfPlayerGift` (Table: `werewolf_player_gifts`)
  - [x] Configurer les relations et contraintes
- [x] **Backend: Gift Service**
  - [x] Créer `modules/werewolf/services/gifts.py`
  - [x] Implémenter `load_gift_catalogue()` (Lit le JSON)
  - [x] Implémenter `get_player_gifts(user_id)` (Jointure entre table et catalogue)
- [x] **Verification: Database Migration**
  - [x] Exécuter le script de migration ou s'assurer que `init_db` gère la nouvelle table
  - [x] Vérifier la structure de la table avec `sqlite3`

## Dev Notes

### Relevant architecture patterns and constraints
- **Isolation Stricte**: Ne pas importer de modèles Vampire.
- **Naming**: Utiliser `snake_case` pour les colonnes et les noms de fichiers.
- **Assets Position**: Les assets statiques de jeu vont dans `modules/werewolf/assets/`.
- **Data Integrity**: La table `werewolf_player_gifts` est la source de vérité pour ce qui est débloqué. Le JSON est la source de vérité pour les descriptions.

### Source tree components to touch
- `modules/werewolf/assets/gifts_data.json` (NEW)
- `modules/werewolf/models/store.py` (MODIFY)
- `modules/werewolf/services/gifts.py` (NEW)

### Project Structure Notes
- S'aligner sur le pattern de Story 4.1 (`werewolf_renown`) pour la structure des tables de liaison.

### References
- [Architecture: Data Architecture](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md#L102-L106)
- [Epic 5: Story 5.1](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md#L430-L446)

## Dev Agent Record

### Agent Model Used
Antigravity (Gemini 2.0 Flash)

### Debug Log References
- Assets created: `modules/werewolf/assets/gifts_data.json`
- Model added: `WerewolfPlayerGift` in `modules/werewolf/models/store.py`
- Service implemented: `modules/werewolf/services/gifts.py`
- DB init added to `api_server.py`.

### Completion Notes List
- Catalogue JSON implémenté avec 5 dons initiaux.
- Modèle de données ajouté et initialisé au démarrage de l'API.
- Service de gestion des dons fonctionnel et testé.
- Tests Model mis à jour vers async/aiosqlite.
- **Scope Creep (AI Review)**: Implémentation anticipée des composants Frontend (`GiftCard`, `GiftsPage`, `AdminGiftsPage`) et des factories de test associées.

### File List
- `modules/werewolf/assets/gifts_data.json` (NEW)
- `modules/werewolf/models/store.py` (MODIFY)
- `modules/werewolf/services/gifts.py` (NEW)
- `api_server.py` (MODIFY)
- `tests/modules/werewolf/test_gifts_data_integrity.py` (STABLE)
- `tests/modules/werewolf/test_gifts_model.py` (MODIFY)
- `tests/modules/werewolf/test_gifts_service.py` (NEW)
- `web/src/modules/werewolf/components/GiftCard/` (NEW - Scope Creep)
- `web/src/modules/werewolf/pages/GiftsPage/` (NEW - Scope Creep)
- `web/src/modules/werewolf/pages/AdminGiftsPage/` (NEW - Scope Creep)
- `web/src/test/factories/gift-factory.ts` (NEW - Scope Creep)
