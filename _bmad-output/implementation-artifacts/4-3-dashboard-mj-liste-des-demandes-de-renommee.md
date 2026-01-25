# Story 4.3: Dashboard MJ - Liste des Demandes de Renommée

Status: done

<!-- Note: Validation of this story file against checklist.md is required before implementation. -->

## Story

As a MJ,
I want voir toutes les demandes de Hauts Faits en attente,
So that je puisse les valider ou les rejeter.

## Acceptance Criteria

1.  **Given** un utilisateur avec le rôle MJ (`1462941982161764556`)
2.  **When** il accède à `/werewolf/admin/renown`
3.  **Then** il voit la liste des demandes avec : Nom joueur, Titre, Type, Date de soumission
4.  **And** chaque entrée a des boutons "Valider" et "Rejeter"

## Tasks / Subtasks

- [x] **Backend: Service & API**
  - [x] Mettre à jour `modules/werewolf/services/renown.py`
    - [x] Ajouter `get_all_renown_requests(status=None)` -> Retourne liste triée par date (plus ancien en premier)
    - [x] S'assurer que les jointures (pour le nom du joueur) sont performantes
  - [x] Mettre à jour `modules/werewolf/views/api.py` (ou `routes.py`)
    - [x] Ajouter endpoint `GET /api/modules/werewolf/admin/renown`
    - [x] **Sécurité Critque**: Vérifier rôle MJ (`1462941982161764556`) côté serveur
    - [x] Retourner JSON liste standardisée

- [x] **Frontend: Dashboard Page**
  - [x] Créer `web/src/modules/werewolf/pages/RenownAdminPage.jsx`
  - [x] Intégrer la protection de route (Role Guard MJ)
  - [x] Fetch des données au montage (ou via Hook `useRenownRequests`)
  - [x] Afficher un tableau (Responsive si possible, ou liste de cartes sur mobile)
  - [x] Colonnes : Joueur, Titre, Type (Icône/Badge), Date, Actions

- [x] **Frontend: Integration**
  - [x] Ajouter la route `/werewolf/admin/renown` dans `web/src/modules/werewolf/routes.jsx`
  - [x] Connecter bouton "Valider" / "Rejeter" (Stub pour l'instant, ou préparer pour Story 4.4)

## Dev Notes

### Relevant architecture patterns and constraints
- **Fractal Module API**: L'endpoint doit être monté sur `/api/modules/werewolf/admin/renown`.
- **Zero-Trust Security**: Le rôle MJ (`1462941982161764556`) doit être vérifié *avant* toute logique métier.
- **Deep Woods Theme**: L'interface admin doit conserver le thème Garou (Noyer Sombre/Or Antique), ne pas utiliser le style Vampire par défaut.
- **Async System**: Python `async/await` obligatoire pour DB.

### Source tree components to touch
- `modules/werewolf/services/renown.py` (UPDATE)
- `modules/werewolf/views/api.py` (UPDATE)
- `web/src/modules/werewolf/pages/RenownAdminPage.jsx` (NEW)
- `web/src/modules/werewolf/routes.jsx` (UPDATE)

### Previous Story Intelligence (From Story 4.2)
- **Patterns**: Le modèle `RenownRequest` existe déjà (créé en 4.2).
- **Service**: `submit_renown_request` existe déjà. Étendre la classe `RenownService`.
- **UI**: Réutiliser les composants de base (Table, Button, Badge) du Design System existant.

### Testing standards summary
- **Frontend**: Test de rendu de la liste (`Vitest`). Mocker la réponse API avec plusieurs demandes.
- **Backend**: Test `get_all_renown_requests` avec `pytest-asyncio`. Vérifier le filtrage et l'ordre.
- **Permission**: Test d'intégration vérifiant que l'accès sans rôle MJ retourne 403.
- **ATDD**: Lire `implementation-artifacts/atdd-checklist-4-3.md` pour les IDs de test requis.

### Latest Technical Specifics
- **React 19**: Utiliser les Hooks standards. Pas de `useEffect` inutile si `useSuspenseQuery` (ou équivalent stack) est disponible, sinon `useEffect`/`useState` classique propre.
- **Vite 7**: Aucun impact spécifique, build standard.

## Dev Agent Record

### Agent Model Used
Antigravity (Gemini 2.5 Flash)

### Completion Notes List
- Implemented `get_all_requests` and `update_request_status` in `RenownService`.
- Added protected API endpoints for MJ only access (`admin/renown`).
- Created `RenownAdminPage` and `RenownRequestList` frontend components.
- Added localized Renown badges (Gloire, Honneur, Sagesse).
- Verified implementation with ATDD backend tests and new frontend component tests.
- **Code Review**: Fixed robustness issues in Role Checks (Async Fallback) and Frontend API usage (`useRenownAdmin` hook).
