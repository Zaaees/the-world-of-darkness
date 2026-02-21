# Story 2.5: Publication Automatique sur le Forum Discord

Status: done

## Story

As a joueur,
I want que ma fiche soit automatiquement postée sur Discord à sa création,
So that les autres membres puissent la découvrir.

## Acceptance Criteria

1. **Given** une nouvelle fiche créée en base de données
   **When** le système publie sur Discord
   **Then** un nouveau thread est créé dans le Forum ID `1462941781761986732`
   **And** le titre du thread est le nom du personnage
   **And** le contenu inclut : Nom, Race, Auspice, Tribu (formaté en Embed Discord)
   **And** l'ID du thread est sauvegardé dans `werewolf_data.discord_thread_id`

## Tasks / Subtasks

- [x] Implémenter le Service Discord
    - [x] `modules/werewolf/services/discord/forum_service.py`
    - [x] Fonction `create_character_thread(character_data)`
- [x] Intégrer dans le flux de création (Event/Hook après Story 2.4)
- [x] Mettre à jour `werewolf_data` avec le `thread_id`
- [x] Tests Mockés
    - [x] Vérifier l'appel à l'API Discord (Mock)
    - [x] Vérifier la sauvegarde de l'ID
