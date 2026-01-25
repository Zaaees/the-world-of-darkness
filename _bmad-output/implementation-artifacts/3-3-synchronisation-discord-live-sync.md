# Story 3.3: Synchronisation Discord (Live Sync)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a joueur,
I want que ma fiche soit mise à jour sur Discord à chaque sauvegarde,
so that les autres membres voient toujours la version la plus récente.

## Acceptance Criteria

1. **Given** une fiche modifiée et sauvegardée (StoryEditor)
2. **When** le système déclenche la synchronisation vers Discord
3. **Then** le contenu du thread existant (`discord_thread_id`) est mis à jour avec le nouveau contenu narratif
4. **And** un toast confirme "Synchronisé avec Discord"
5. **And** si la synchronisation échoue (API Discord down), un fallback silencieux est géré (Log erreur, Toast "Sauvegarde locale uniquement")
6. **And** les Rate Limits Discord (429) sont respectés (pas de bloque sur le thread principal)

## Tasks / Subtasks

- [x] Créer la méthode `sync_sheet_to_discord` dans `modules/werewolf/services/sheet.py`
  - [x] Récupérer le `discord_thread_id` de la fiche
  - [x] Récupérer le message initial du thread
  - [x] Éditer le contenu du message (`message.edit(content=...)`)
  - [x] Gérer les exceptions Discord (`Forbidden`, `HTTPException`)
- [x] Mettre à jour `modules/werewolf/routes.py`
  - [x] Endpoint `/api/modules/werewolf/sheet/sync` (ou intégrer au Save existant ?)
  - [x] Intégrer la synchro dans la méthode update existante (recommandé)
- [x] Mettre à jour `web/src/modules/werewolf/components/StoryEditor.jsx` (ou le parent `CharacterSheet.jsx`)
  - [x] Vérifier que la synchro est déclenchée lors du `handleAutoSave`
  - [x] Ajouter le feedback Toast spécifique
- [x] Tests Unitaires & Intégration
  - [x] Backend: Mocker `discord.Thread` et `edit`
  - [x] Frontend: Vérifier l'appel API et le Toast

## Dev Notes

### Relevant architecture patterns and constraints
- **Async mandatory**: Tous les appels Discord doivent être `await`.
- **Backend-Driven**: La logique Discord est 100% backend python. Le frontend ne fait qu'appeler l'API.
- **Fail-Safe**: Une erreur Discord ne doit JAMAIS faire échouer la sauvegarde SQL locale (Vérité Terrain = DB).
- **Service Layer**: Logique métier dans `services/sheet.py`.

### Source tree components to touch
- `modules/werewolf/services/sheet.py`
- `modules/werewolf/routes.py` (si nécessaire)
- `web/src/modules/werewolf/pages/CharacterSheet.jsx` (ou `services/character_service.py` frontend)

### Testing standards summary
- **Backend:** `pytest-asyncio`. Utiliser `unittest.mock.AsyncMock` pour `message.edit`.
- **Frontend:** `vi.mock` pour simuler le retour API.

### Project Structure Notes
- Respecter l'isolation `modules/werewolf`. Pas d'import de `modules/vampire`.

### References
- [Source: epics.md#Story 3.3](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/planning-artifacts/epics.md)
- [Source: project-context.md#Règles Spécifiques aux Langages](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/project-context.md)

## Dev Agent Record

### Agent Model Used
Antigravity

### Debug Log References
-

### Completion Notes List
- Implémentation du service backend `sync_sheet_to_discord` dans `services/sheet.py`
- Intégration dans `routes.py` au niveau de `update_character_handler`
- Modification de `CharacterSheet.jsx` pour retourner le statut de synchro
- Mise à jour de `StoryEditor.jsx` pour afficher "Synchronisé avec Discord" quand applicable
- Tests backend `test_sheet.py` et `test_sync_route_atdd.py`
- Tests frontend `StoryEditorSync.test.jsx`

### Code Review Fixes (Auto-Applied)
- **Refactoring**: Deduplicated Embed creation logic between `sheet.py` and `forum_service.py`.
- **Git**: Staged previously untracked files (`sheet.py`, tests).
- **Process**: Created missing `atdd-checklist-3-3.md`.
- **Docs**: Noted `package-lock.json` update (dependency lock).

### File List
- `modules/werewolf/services/sheet.py`
- `modules/werewolf/services/discord/forum_service.py`
- `modules/werewolf/routes.py`
- `web/src/modules/werewolf/pages/CharacterSheet.jsx`
- `web/src/modules/werewolf/components/StoryEditor.jsx`
- `web/package-lock.json`
- `tests/modules/werewolf/services/test_sheet.py`
- `tests/modules/werewolf/test_sync_route_atdd.py`
- `web/src/modules/werewolf/components/__tests__/StoryEditorSync.test.jsx`
