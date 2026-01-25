# ATDD Checklist - Epic 4, Story 4.4: Validation et Mise à Jour du Rang

**Date:** 2026-01-25
**Author:** Zaès
**Primary Test Level:** API/Integration

---

## Story Summary

Le MJ doit pouvoir valider une demande de Renommée, ce qui déclenche automatiquement le calcul du nouveau Rang du joueur et l'en informe. Cela assure que la progression narrative est reflétée mécaniquement.

**As a** MJ
**I want** valider un Haut Fait et voir le rang du joueur évoluer
**So that** la progression narrative soit reflétée visuellement

---

## Acceptance Criteria

1. **Given** un MJ qui valide un Haut Fait
2. **When** il clique sur "Valider"
3. **Then** le statut passe à "approved"
4. **And** le rang du joueur est recalculé selon les règles de Renommée
5. **And** le joueur reçoit une notification Discord (DM)
6. **And** le composant RenownBadge reflète le nouveau rang

---

## Failing Tests Created (RED Phase)

### API/Integration Tests (4 tests)

**File:** `tests/modules/werewolf/test_renown_validation_atdd.py`

- ✅ **Test:** `test_rank_calculation_logic_unit`
  - **Status:** RED - Module `modules.werewolf.services.renown_service` not found
  - **Verifies:** La logique de calcul (Glory/Honor/Wisdom -> Rank) existe et est correcte.

- ✅ **Test:** `test_validate_request_triggers_rank_update`
  - **Status:** RED - Module `modules.werewolf.views.api_routes` not found / invalid
  - **Verifies:** L'endpoint de validation déclenche la mise à jour du rang et la notification.

- ✅ **Test:** `test_discord_notification_content`
  - **Status:** RED - Module `modules.werewolf.services.notification_service` not found
  - **Verifies:** La notification Discord est envoyée avec le bon contenu (Titre, Rang).

- ✅ **Test:** `test_rank_update_persisted`
  - **Status:** RED - Function `update_player_rank` not found
  - **Verifies:** Le nouveau rang est bien sauvegardé en base (`werewolf_data`).

---

## Data Factories Created

**Note:** Utilisation des helpers existants dans les tests précédents (`create_renown_request`, `create_werewolf_data`). Pas de nouvelle factory TS créée car projet Python.

---

## Mock Requirements

### Discord Notification Service

**File:** `modules/werewolf/services/notification_service.py` (To be created)

- **Function:** `send_renown_approval_notification(discord_client, user_id, renown_title, new_rank)`
- **Behavior:**
    - Récupérer l'utilisateur Discord via `user_id`.
    - Envoyer un DM : "Félicitations ! Votre Haut Fait '[Titre]' a été validé. Votre Rang est maintenant : [Rang]."
    - Gestion des erreurs si DM fermé.

---

## Required data-testid Attributes

Aucun attribut frontend spécifique requis pour ce workflow backend (Validation via API).
Cependant, pour l'affichage du badge (Story 3.1/4.4 Frontend) :
- `renown-badge-rank` : Pour vérifier le rang affiché (Responsabilité Frontend).

---

## Implementation Checklist

### Test: `test_rank_calculation_logic_unit` & `test_rank_update_persisted`

**File:** `modules/werewolf/services/renown_service.py`

- [ ] Créer `renown_service.py`
- [ ] Implémenter class `RankCalculator` avec méthode static `calculate_rank(glory, honor, wisdom)`
- [ ] Définir les seuils de rang (Rank 1 -> 5)
- [ ] Implémenter `update_player_rank(db, user_id, new_rank)` pour mettre à jour `werewolf_data`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_validation_atdd.py::TestStory4_4_RenownValidation::test_rank_calculation_logic_unit`
- [ ] ✅ Test passes

### Test: `test_discord_notification_content`

**File:** `modules/werewolf/services/notification_service.py`

- [ ] Créer `notification_service.py`
- [ ] Implémenter `send_renown_approval_notification`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_validation_atdd.py::TestStory4_4_RenownValidation::test_discord_notification_content`
- [ ] ✅ Test passes

### Test: `test_validate_request_triggers_rank_update`

**File:** `modules/werewolf/views/api_routes.py`

- [ ] Mettre à jour (ou créer) la route de validation pour intégrer la logique
- [ ] Appeler `RenownService.calculate_rank` après validation
- [ ] Appeler `RenownService.update_player_rank` si le rang change
- [ ] Appeler `NotificationService.send_renown_approval_notification`
- [ ] Run test: `pytest tests/modules/werewolf/test_renown_validation_atdd.py::TestStory4_4_RenownValidation::test_validate_request_triggers_rank_update`
- [ ] ✅ Test passes

---

## Running Tests

```bash
# Run all failing tests for this story
pytest tests/modules/werewolf/test_renown_validation_atdd.py

# Run specific test
pytest tests/modules/werewolf/test_renown_validation_atdd.py::TestStory4_4_RenownValidation::test_validate_request_triggers_rank_update
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**
- ✅ Failing tests created covering logic, persistence, and notifications.
- ✅ Structure defined for services (`renown_service`, `notification_service`).
- ✅ Implementation checklist ready.

---

## Next Steps

1. **Share this checklist** with the dev workflow.
2. **Implement services** first (`renown_service.py`).
3. **Integrate into API** (`api_routes.py`).
4. **Verify** all tests pass.
