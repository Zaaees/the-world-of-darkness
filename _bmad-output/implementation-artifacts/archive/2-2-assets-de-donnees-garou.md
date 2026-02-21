# Story 2.2: Assets de Données Garou (Races, Auspices, Tribus)

Status: done

## Story

As a développeur,
I want les données statiques des Races, Auspices et Tribus disponibles en JSON,
So that le formulaire d'onboarding puisse les afficher dynamiquement.

## Acceptance Criteria

1. **Given** le fichier `assets/werewolf_data.json` créé
   **When** je le charge
   **Then** il contient les listes : `breeds` (Homid, Metis, Lupus), `auspices` (Ragabash, Theurge, Philodox, Galliard, Ahroun), `tribes` (liste complète des 13 tribus)
   **And** chaque entrée a un `id`, `name_fr`, et optionnellement `description`

## Tasks / Subtasks

- [x] Créer le fichier JSON d'assets
    - [x] `modules/werewolf/assets/werewolf_data.json`
- [x] Créer le loader/service pour ces assets
    - [x] `modules/werewolf/services/assets_service.py` (ou similaire)
- [x] Tests Update
    - [x] Vérifier que le JSON est valide et complet

## File List

- `modules/werewolf/assets/werewolf_data.json`
- `modules/werewolf/services/assets_service.py`
- `modules/werewolf/tests/test_assets.py`
- `requirements.txt` (aiofiles ajouté)

## Senior Developer Review (AI)

**Date:** 2026-01-22
**Reviewer:** Antigravity

### Issues Found & Fixed
1. **[CRITICAL]** Tests manquants → Créé `test_assets.py` avec 3 tests unitaires
2. **[HIGH]** I/O bloquant → Refactoré `assets_service.py` pour utiliser `aiofiles` et `async/await`
3. **[MEDIUM]** Dépendance manquante → Ajouté `aiofiles>=23.2.0` à `requirements.txt`

### Verdict: ✅ APPROVED
