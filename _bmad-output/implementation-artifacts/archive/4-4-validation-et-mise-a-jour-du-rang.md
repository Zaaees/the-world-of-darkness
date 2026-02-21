# Story 4.4: Validation et Mise à Jour du Rang

Status: done

<!-- Note: Validation of this story file against checklist.md is required before implementation. -->

## Story

As a MJ,
I want valider un Haut Fait et voir le rang du joueur évoluer,
So that la progression narrative soit reflétée visuellement.

## Acceptance Criteria

1.  **Given** un MJ qui valide un Haut Fait sur `/werewolf/admin/renown`
2.  **When** il clique sur "Valider"
3.  **Then** le statut de la demande passe à "approved" en base de données
4.  **And** le système recalcule le rang du joueur basé sur son total de Renommée validée
    - 0-2 Renommée: Rang 1 (Cliath)
    - 3-9 Renommée: Rang 2 (Fostern)
    - 10-19 Renommée: Rang 3 (Adren)
    - 20-29 Renommée: Rang 4 (Athro)
    - 30+ Renommée: Rang 5 (Elder)
5.  **And** si le rang augmente, la table `werewolf_data` est mise à jour
6.  **And** le joueur reçoit une notification Discord (DM ou Mention dans channel Logs) confirmant la validation et le nouveau rang
7.  **And** le composant `RenownBadge` sur la fiche du joueur reflète immédiatement le nouveau rang

## Tasks / Subtasks

- [x] **Backend: Renown Service Logic**
  - [x] Mettre à jour `modules/werewolf/services/renown.py` -> `update_request_status`
    - [x] Implémenter la logique de changement de statut (Pending -> Approved/Rejected)
    - [x] **Trigger**: Si Approved, appeler `recalculate_player_rank(user_id)`
    - [x] Implémenter `recalculate_player_rank(user_id)`:
      - [x] Compter total demandes `approved`
      - [x] Appliquer seuils (3, 10, 20, 30)
      - [x] Mettre à jour `werewolf_data.rank` si changé
      - [x] Logger le changement de rang

- [x] **Backend: Discord Notification**
  - [x] Créer `modules/werewolf/services/notifications.py` (ou méthode dans `renown.py`)
    - [x] `notify_renown_update(user_id, request_title, new_rank)`
    - [x] Utiliser le Bot pour envoyer un DM ou poster dans `#logs-werewolf` (`1457856977660022844`)
    - [x] Message RP: "Les Esprits ont entendu ton exploit : [Titre]. Ta Renommée grandit."

- [x] **Backend: API Endpoint**
  - [x] Vérifier/Mettre à jour `modules/werewolf/views/api.py`
    - [x] Endpoint `POST /api/modules/werewolf/admin/renown/{id}/validate`
    - [x] Endpoint `POST /api/modules/werewolf/admin/renown/{id}/reject`
    - [x] Vérification stricte rôle MJ
    - [x] Retourner le nouveau statut et le nouveau rang potentiellement

- [x] **Frontend: Wiring**
  - [x] Mettre à jour `web/src/modules/werewolf/pages/RenownAdminPage.jsx`
  - [x] Connecter le bouton "Valider" à l'API `validate`
  - [x] Connecter le bouton "Rejeter" à l'API `reject`
  - [x] Gérer l'optimistic UI ou re-fetch après action pour mettre à jour la liste
  - [x] Afficher un Toast de succès confirmant l'action

## Dev Notes

### Relevant architecture patterns and constraints
- **Atomic Transactions**: La validation + mise à jour rang doit être atomique ou sûre. Si Discord échoue, la DB doit quand même être à jour (Priorité Data Integrity).
- **Service Layer**: Toute la logique métier (calcul rang) doit être dans `RenownService`, pas dans la Vue API.
- **Discord Async**: L'envoi de notification ne doit pas bloquer la réponse API (utiliser `asyncio.create_task` ou background task si possible, sinon attendre car c'est une action admin faible volume).

### Source tree components to touch
- `modules/werewolf/services/renown.py` (Main Logic)
- `modules/werewolf/models/store.py` (Data access)
- `modules/werewolf/views/api.py` (Endpoints)
- `web/src/modules/werewolf/pages/RenownAdminPage.jsx` (UI)

### Project Structure Notes
- **Notifications**: Si pas de service de notif centralisé, créer une fonction simple dans `services` qui utilise le `bot` instance.

### Details on Rank Thresholds
- **Rank 1 (Cliath)**: 0-2 Renown
- **Rank 2 (Fostern)**: 3-9 Renown
- **Rank 3 (Adren)**: 10-19 Renown
- **Rank 4 (Athro)**: 20-29 Renown
- **Rank 5 (Elder)**: 30+ Renown

## Dev Agent Record

### Agent Model Used
Antigravity (Gemini 2.5 Flash)

### Debug Log References

### Completion Notes List
- Implemented Rank Calculation logic (RenownService)
- Created NotificationService for DM Application
- Updated API routes to trigger calculation and notification overlap
- Added Toast component for frontend feedback
- Verified with ATDD tests (Backend) and Unit tests (Frontend)

### File List
- modules/werewolf/services/renown.py
- modules/werewolf/services/notifications.py
- modules/werewolf/views/api_routes.py
- web/src/modules/werewolf/hooks/useRenownAdmin.js
- web/src/modules/werewolf/pages/RenownAdminPage.jsx
- web/src/components/Toast.jsx
- tests/modules/werewolf/test_renown_validation_atdd.py
- web/src/modules/werewolf/pages/RenownAdminPage.test.jsx
- web/src/modules/werewolf/components/RenownRequestList.jsx
- web/src/modules/werewolf/components/__tests__/RenownRequestList.test.jsx
