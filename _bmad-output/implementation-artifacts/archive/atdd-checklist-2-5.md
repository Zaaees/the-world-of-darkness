# ATDD Checklist - Epic 2, Story 2.5: Publication Automatique sur le Forum Discord

**Date:** 2026-01-22
**Author:** Antigravity
**Primary Test Level:** Unit/Integration (Mocked)

---

## Story Summary

**As a** joueur
**I want** que ma fiche soit automatiquement postée sur Discord à sa création
**So that** les autres membres puissent la découvrir

---

## Acceptance Criteria

1. **Given** une nouvelle fiche créée en base de données
   **When** le système publie sur Discord
   **Then** un nouveau thread est créé dans le Forum ID `1462941781761986732`
   **And** le titre du thread est le nom du personnage
   **And** le contenu inclut : Nom, Race, Auspice, Tribu (formaté en Embed Discord)
   **And** l'ID du thread est sauvegardé dans `werewolf_data.discord_thread_id`

---

## Failing Tests Created (RED Phase)

### Integration Tests (Mocked)

**File:** `tests/modules/werewolf/test_discord_publish_atdd.py`

- ✅ **Test:** `test_publish_to_forum`
  - **Status:** RED - Module missing or Mock verification failed
  - **Verifies:** Correct channel targeting, thread creation, and content formatting.

---

## Implementation Checklist

### Test: test_publish_to_forum

**Tasks to make this test pass:**

- [ ] Créer `modules/werewolf/services/discord/forum_service.py`
- [ ] Implémenter `create_character_thread(bot, data)`
- [ ] Utiliser `bot.get_channel(FORUM_ID)`
- [ ] Créer un Embed avec les stats
- [ ] Appeler `channel.create_thread(name=..., embed=...)`
- [ ] Retourner l'ID du thread
- [ ] Mettre à jour la DB (appel Store)
- [ ] Run test: `pytest tests/modules/werewolf/test_discord_publish_atdd.py`

### Mock Requirements

- **Discord API**: `create_thread`
- **Success**: Returns Thread object with ID
- **Failure**: Raise Exception (handle gracefully)

---

## Running Tests

```bash
pytest tests/modules/werewolf/test_discord_publish_atdd.py
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ All tests written and failing
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)

1. **Implement Forum Service**
2. **Integrate with Creation Flow**
3. **Run Tests**

---
