# Story 4.2: Formulaire de soumission de haut fait

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a joueur,
I want soumettre un Haut Fait pour validation,
so that mes accomplissements narratifs soient reconnus.

## Acceptance Criteria

1. **Given** un joueur sur sa fiche
2. **When** il clique sur "Ajouter un Haut Fait"
3. **Then** un modal s'ouvre avec : Champ Titre, Champ Description, Sélecteur Type (Gloire/Honneur/Sagesse)
4. **And** à la soumission, le statut est "En attente"
5. **And** un toast confirme "Envoyé aux Esprits (MJ)"

## Tasks / Subtasks

- [x] Créer le composant `RenownSubmissionModal` (AC: 3)
  - [x] Intégrer le formulaire avec les champs : Titre, Description, Type
  - [x] Utiliser les composants UI existants (Modal, Input, Select, Button)
  - [x] Appliquer le design system "Deep Woods"
- [x] Implémenter le service Backend `modules/werewolf/services/renown.py` (AC: 4)
  - [x] Méthode `submit_renown_request(user_id, data)`
  - [x] Validation des entrées
  - [x] Insertion en base avec statut `pending`
- [x] Créer l'endpoint API `POST /api/modules/werewolf/renown` (AC: 4)
  - [x] Vérification du rôle Discord (Middleware)
  - [x] Appel du service
  - [x] Retour JSON standardisé
- [x] Connecter le Frontend au Backend (AC: 4, 5)
  - [x] Appel API via `useWerewolfStore` ou service API
  - [x] Gestion des états de chargement
  - [x] Afficher Toast de succès "Envoyé aux Esprits (MJ)"
  - [x] Fermer la modale après succès

## Dev Notes

### Relevant architecture patterns and constraints
- **Fractal Module API**: L'endpoint doit être monté sur `/api/modules/werewolf/renown`. [Source: [architecture.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md#L113)]
- **Strict Module Isolation**: Ne pas importer de composants Vampire. Utiliser `@core/components`. [Source: [architecture.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/architecture.md#L137)]
- **Zero-Trust**: Validation du rôle Discord côté serveur obligatoire. [Source: [project-context.md](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/project-context.md#L109)]
- **Async System**: Utiliser `async/await` pour toutes les opérations I/O.

### Source tree components to touch
- `web/src/modules/werewolf/components/RenownSubmissionModal.jsx` (NEW)
- `modules/werewolf/services/renown.py` (NEW/UPDATE)
- `modules/werewolf/views/api.py` (ou `routes.py` selon ce qui existe pour le module)
- `web/src/modules/werewolf/hooks/useWerewolfStore.js`

### Testing standards summary
- **Frontend**: Tests avec `Vitest` et `@testing-library/react`. Mocker l'API.
- **Backend**: Tests integration avec `pytest-asyncio` et `aiosqlite`.
- **ATDD**: Lire impérativement `implementation-artifacts/atdd-checklist-4-2.md` pour les IDs de test.

### Project Structure Notes
- Composants front dans `web/src/modules/werewolf/components/`.
- Backend services dans `modules/werewolf/services/`.

### References
- [Source: epics.md#Story 4.2](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md#L382)
- [Source: ux-design-specification.md#Parcours 3](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/ux-design-specification.md#L254)

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.5 Flash)

### Debug Log References

### Completion Notes List

### File List

- modules/werewolf/models/renown.py
- modules/werewolf/services/renown.py
- modules/werewolf/views/api_routes.py
- web/src/modules/werewolf/components/RenownSubmissionModal.jsx
- web/src/modules/werewolf/hooks/useRenown.js
- tests/modules/werewolf/test_renown_atdd.py
- tests/modules/werewolf/test_renown_submission_atdd.py
