# Story 5.4: Dashboard MJ - Déblocage des Dons

Status: done

<!-- Note: Validation of this story file against checklist.md is required before implementation. -->

## Story

As a MJ,
I want débloquer des Dons spécifiques pour un joueur,
so that je puisse récompenser sa progression narrative.

## Acceptance Criteria

1.  **Admin Interface:**
    - La page est accessible via `/werewolf/admin/gifts` (Réservé rôle MJ).
    - Permet de sélectionner un joueur dans une liste déroulante ou recherche.
2.  **Gift Management:**
    - Affiche la liste des Dons disponibles pour la Tribu du joueur sélectionné.
    - Indique visuellement l'état actuel (Débloqué/Verrouillé).
    - Permet de cocher/décocher un Don pour changer son état.
    - Met à jour la base de données en temps réel ou via bouton "Sauvegarder".
3.  **Notification:**
    - L'action de déblocage envoie une notification (Toaster UI + Discord optional).

## Tasks / Subtasks

- [x] **Page Implementation**
  - [x] Créer `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.jsx`.
  - [x] Implémenter la sélection de joueur.
- [x] **Gift List & Actions**
  - [x] Afficher la liste des dons sous forme de tableau ou grille administrative.
  - [x] Ajouter les contrôles (Checkbox/Switch).
  - [x] Raccorder à l'API `POST /api/werewolf/gifts/unlock`.
- [x] **Testing**
  - [x] Créer `AdminGiftsPage.test.jsx`.
  - [x] Tester les permissions (MJ only).
  - [x] Tester la mutation de données.

## File List
- web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.jsx
- web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.test.jsx
- modules/werewolf/routes.py
- modules/werewolf/middleware.py
- modules/werewolf/models/store.py

## Change Log
- 2026-01-26: Implemented AdminGiftsPage with player selection and gift unlocking logic. Added unit tests for MJ permission and interaction.
- 2026-01-26: [Code Review] Fixed security vulnerability by implementing real API MJ role check. Replaced Mock data with real API endpoints. implementing real backend implementation.

## Dev Agent Record
- **Debug Log**:
  - Initial tests for `AdminGiftsPage` failed as expected (Red Phase).
  - Encountered import error for `API_URL` configuration, fixed by correcting relative path.
  - Accessibility check failed on gift checkboxes, fixed by adding `aria-label`.
- **Code Review Fixes (Auto-Applied)**:
  - **CRITICAL**: Fixed missing server-side security enforcement for Admin page by adding `require_mj_role` middleware and verifying it on API calls.
  - **CRITICAL**: Replaced hardcoded player list placeholder with real `GET /api/modules/werewolf/admin/players` endpoint.
  - **HIGH**: Implemented actual API handlers in backend (`routes.py`) for listing players and gifts.
  - **MEDIUM**: Added real Toaster notification (Success Message) for better UX.
  - **CLEANUP**: Removed garbage `AdminGiftsPage.test.tsx` file.
- **Completion Notes**:
  - Implemented full Admin Dashboard for Gifts.
  - Used `useUserRoles` for permission handling.
  - Mocked API responses in tests to verify UI behavior.
  - Verified accessibility compliance for key interactions.
  - **Verified Security**: Admin routes are now protected by `require_mj_role`.

## Dev Notes

### Relevant architecture patterns and constraints
- **Permissions**: Vérifier le rôle MJ côté frontend et backend.
- **Optimistic UI**: Mettre à jour l'interface immédiatement au clic.

### Source tree components to touch
- `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.jsx` (NEW)
- `web/src/modules/werewolf/pages/AdminGiftsPage/AdminGiftsPage.test.jsx` (NEW)

### References
- [Epic 5: Story 5.4](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md)
