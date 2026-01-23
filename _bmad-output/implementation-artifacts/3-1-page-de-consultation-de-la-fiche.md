# Story 3.1: Page de Consultation de la Fiche

Status: done

## Story

As a joueur Loup-Garou,
I want consulter ma fiche personnage sur une page dédiée,
So that je puisse voir toutes mes informations narratives en un coup d'œil.

## Acceptance Criteria

1. **Given** un joueur avec une fiche existante
   **When** il accède à `/werewolf/sheet`
   **Then** il voit : Nom, Race, Auspice, Tribu (lecture seule), Histoire (éditable), Rang actuel
2. **And** la page utilise le thème "Deep Woods"
3. **And** le composant `RenownBadge` affiche son rang visuel

## Tasks / Subtasks

- [x] Créer la page `web/src/modules/werewolf/pages/CharacterSheet.jsx`
- [x] Implémenter le fetch des données depuis `/api/modules/werewolf/character`
- [x] Intégrer le composant `RenownBadge`
- [x] Appliquer le style "Deep Woods"
- [x] Vérifier la redirection depuis le dashboard
- [x] Implémenter la persistance de l'histoire (PUT API)

## Dev Agent Record

### Implementation Plan
- Backend : Ajout de `get_character` et `update_character` dans `character_service.py` et des routes `GET/PUT /api/modules/werewolf/character` dans `routes.py`.
- Frontend : Récupération du composant `RenownBadge.jsx`, création de la page `CharacterSheet.jsx` avec support de l'édition persistante de l'histoire.

### File List
- `modules/werewolf/routes.py` (API endpoints)
- `modules/werewolf/services/character_service.py` (Business logic)
- `web/src/modules/werewolf/pages/CharacterSheet.jsx` (Frontend UI)
- `web/src/modules/werewolf/components/RenownBadge.jsx` (UI component)
- `tests/modules/werewolf/test_character_sheet_atdd.py` (Integration tests)
- `web/src/modules/werewolf/pages/__tests__/CharacterSheet.test.jsx` (Frontend tests)

### Completion Notes
- Tous les tests unitaires et d'intégration passent.
- Persistance de l'histoire implémentée via une route PUT.
- Correction du header `X-Discord-User-ID` pour utiliser les données de session réelles.
