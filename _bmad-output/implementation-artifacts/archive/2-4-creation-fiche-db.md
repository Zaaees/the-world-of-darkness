# Story 2.4: Création de la Fiche en Base de Données

Status: done

## Story

As a joueur,
I want que mes choix soient sauvegardés à la validation du formulaire,
So that ma fiche soit créée et je puisse y accéder ultérieurement.

## Acceptance Criteria

1. **Given** un formulaire d'onboarding rempli et validé
   **When** je soumets le formulaire
   **Then** une entrée est créée dans `werewolf_data` avec mes attributs
   **And** je suis redirigé vers ma fiche (`/werewolf/sheet`)
   **And** un toast confirme "Bienvenue dans la Meute, [Nom] !"

## Tasks / Subtasks

- [x] Implémenter le Endpoint API
    - [x] `POST /api/modules/werewolf/character`
    - [x] Validation DTO Entrée
    - [x] Appel au Service Store (Story 2.1)
- [x] Connecter le Front (Story 2.3) à l'API
- [x] Gérer la redirection et le Toast
- [x] Tests Intégration / E2E
    - [x] Submission formulaire -> DB entry -> Redirection

## File List

- modules/werewolf/services/character_service.py
- modules/werewolf/routes.py
- web/src/modules/werewolf/pages/CreateCharacter.jsx
- web/src/modules/werewolf/pages/__tests__/CreateCharacter.test.jsx
- tests/modules/werewolf/test_create_sheet_atdd.py

## Change Log

- 2026-01-22: [Implémentation] Création du service `character_service.py` pour la persistance.
- 2026-01-22: [API] Ajout de la route `POST /api/modules/werewolf/character` dans `routes.py`.
- 2026-01-22: [Frontend] Connexion du formulaire `CreateCharacter.jsx` à l'API.
- 2026-01-22: [Tests] Ajout du test d'intégration ATDD et validation via script de debug.
- 2026-01-22: [Review] Fixes automatiques : tests API, tests Frontend, error handling `routes.py`.
