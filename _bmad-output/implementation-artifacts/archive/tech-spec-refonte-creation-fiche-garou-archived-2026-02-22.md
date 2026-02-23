---
title: 'Refonte Création Fiche Loup-Garou'
slug: 'refonte-creation-fiche-garou'
created: '2026-02-21'
status: 'review'
stepsCompleted: [1, 2, 3]
tech_stack: ['React 19', 'TailwindCSS', 'Python 3.11', 'discord.py', 'aiosqlite']
files_to_modify: ['web/src/modules/werewolf/pages/CreateCharacter.jsx', 'web/src/modules/werewolf/pages/CharacterSheet.jsx', 'modules/werewolf/routes.py', 'modules/werewolf/services/character_service.py', 'modules/werewolf/models/store.py']
code_patterns: ['Functional React Components', 'Tailwind Styling', 'Async Python', 'aiosqlite Database access']
test_patterns: ['Vitest Component Tests', 'Pytest Backend Tests']
---

# Tech-Spec: Refonte Création Fiche Loup-Garou

**Created:** 2026-02-21

## Overview

### Problem Statement

La création du personnage loup-garou actuelle est divisée en un "Wizard" de 4 étapes qui envoie la fiche sur le forum Discord et demande le nom du personnage trop tôt, dès la sélection du Lore (Race, Auspice, Tribu). De plus, la fiche écrite sur le site manque de profondeur narrative comparée à celle des vampires (pas de description physique, pas d'âge, pas de détails sur le premier changement, etc.), ce qui nuit à l'immersion Roleplay.

### Solution

Retirer la saisie du nom à l'étape du "Wizard" (qui ne concernera plus que la Race, l'Auspice et la Tribu) et la remplacer par l'attribution automatique d'un nom temporaire ("Jeune Garou inconnu"). Repousser l'envoi du message sur le forum Discord *uniquement* lors de la sauvegarde de la fiche écrite finale par le joueur. Enfin, remplacer le simple éditeur d'histoire de l'onglet "Ma Fiche" par un formulaire complet incluant des champs adaptés au Lore Garou (Nom, Âge, Sexe, Description Physique Homidée / Forme Crinos, Mentalité avant le changement, Le Premier Changement, et Histoire complète), tout en rappelant de manière élégante les caractéristiques de Lore choisies.

### Scope

**In Scope:**
- Suppression de l'étape 4 dans `CreateCharacter.jsx` (Désormais, la validation se fait après le choix de la Tribu).
- Modification de la création en base de données pour utiliser le nom temporaire "Jeune Garou inconnu" et ne pas publier le thread Discord immédiatement.
- Refonte complète du composant affichant l'onglet "Ma Fiche" (`CharacterSheet.jsx` côté client) pour inclure un formulaire d'édition complet détaillé, à l'image des vampires.
- Déplacement de l'appel d'API créant le fil de discussion Discord au moment de la première sauvegarde de la fiche écrite complétée.

**Out of Scope:**
- Ajout de nouveaux Dons, mécaniques de Renommée ou de Rang.
- Modification du fonctionnement interne de la recherche/affichage de Lore (bien que le rappel des choix sera affiché).
- Changement du fonctionnement des fiches Vampires actuelles.

## Context for Development

### Codebase Patterns

- **Frontend:** React Fonctionnel avec Hooks. TailwindCSS pour le style. Modèle d'onglets côté client géré par l'état `activeTab` dans `CharacterSheet.jsx`. Formulaire mode "édition" et "lecture" séparé (comme dans `vampire/components/CharacterSheet.jsx`).
- **Backend:** API aiohttp (`routes.py`). L'I/O asynchrone est obligatoire (`aiosqlite`, opérations Discord). Modèles avec `dataclasses` (`WerewolfData`). Un service métier intermédiaire (`character_service.py`).
- **Langue:** FR OBLIGATOIRE (commentaires, logs, interface).

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `web/src/modules/werewolf/pages/CreateCharacter.jsx` | Modifier le Wizard pour enlever l'étape Nom. |
| `web/src/modules/werewolf/pages/CharacterSheet.jsx` | Modifier l'onglet "Ma Fiche" pour intégrer le formulaire complet des descriptions. |
| `modules/werewolf/routes.py` | Ajouter un endpoint/handler (ou modifier l'existant) pour gérer la mise à jour complète de la fiche et post discordant différé. |
| `modules/werewolf/services/character_service.py` | Retirer la création Discord locale (`create_character_thread`) au moment du `create_character` initial. Refactorer la mise à jour. |
| `modules/werewolf/models/store.py` | Ajouter les nouveaux champs `age`, `sex`, `physical_desc`, `mental_desc_pre`, `first_change`, `image_url` à la structure `WerewolfData` et tables SQL. |
| `web/src/modules/vampire/components/CharacterSheet.jsx` | Inspiration pour le formulaire d'édition (Vue Lecture / Édition, upload d'image, style). |

### Technical Decisions

- **Nom Temporaire :** Lors de la soumission de `CreateCharacter.jsx`, le champ "name" du payload sera défini sur "Jeune Garou inconnu".
- **Discord Post Trigger :** Le webhook Discord (`create_character_thread`) qui se trouvait dans `create_character` de `character_service.py` sera déplacé ou appelé depuis la route de `PUT`/`POST` sur la mise à jour de la feuille (`update_character`), *uniquement* si c'est la première soumission de la fiche complète ou si le tag n'existe pas.
- **Nouvelles Données en Base :** Il va falloir modifier le schéma SQLite (`modules/werewolf/models/store.py`) pour inclure l'âge, sexe, les deux descriptions, image de manière analogue aux vampires.
- **Formulaire de la fiche :** Inspiré de la fiche Vampire (`web/src/modules/vampire/components/CharacterSheet.jsx`), le formulaire basculera entre un mode édition (si les descriptions sont vides) et un mode lecture.

## Implementation Plan

### Tasks

- [ ] Task 1: Mettre à jour le schéma de base de données WerewolfData
  - File: `modules/werewolf/models/store.py`
  - Action: Ajouter `age`, `sex`, `physical_desc`, `mental_desc_pre`, `first_change`, `image_url` à la `dataclass` `WerewolfData` (Optional[str]). Mettre à jour `werewolf_data_to_dict`, `create_werewolf_table` (ajouter les colonnes), `get_werewolf_data`, `create_werewolf_data`, `update_werewolf_data` pour gérer ces nouveaux champs.
  - Notes: Gérer les migrations si nécessaire (ALTER TABLE) dans `create_werewolf_table` si les colonnes n'existent pas.

- [ ] Task 2: Refactorer la création initiale backend
  - File: `modules/werewolf/services/character_service.py`
  - Action: Dans `create_character`, retirer l'appel à `create_character_thread` (Discord) et la sauvegarde de `discord_thread_id`. Le personnage est juste enregistré en base avec le nom fourni (qui viendra du front).
  - Notes: Conserver la synchronisation Google Sheets (`set_player`) car elle est utile pour les rôles/outils externes.

- [ ] Task 3: Modifier le Wizard Frontend pour supprimer l'étape Nom
  - File: `web/src/modules/werewolf/pages/CreateCharacter.jsx`
  - Action: Supprimer `case 4` du rendu. Au moment où le joueur clique sur la Tribu (étape 3), ou s'il y a un bouton valider, on envoie directement le payload avec `name: "Jeune Garou inconnu"`.
  - Notes: Ajuster le composant `WizardStep` si nécessaire pour qu'il déclenche la soumission, ou ajouter un écran de confirmation de Lore avec le bouton "Terminer".

- [ ] Task 4: Refactorer le Backend pour la mise à jour de fiche & Thread Discord
  - File: `modules/werewolf/routes.py`
  - Action: Dans `update_character_handler` (ou là où est traité le `PUT /api/modules/werewolf/character`), gérer la mise à jour des nouveaux champs. Surtout, **si `old_character.discord_thread_id` est vide ET que le nom n'est plus "Jeune Garou inconnu"** (c'est-à-dire que le joueur a validé sa fiche complète), alors appeler `create_character_thread` et sauvegarder le `discord_thread_id`.
  - Notes: S'assurer que ça ne recrée pas un thread à chaque mise à jour de la fiche.

- [ ] Task 5: Refonte du composant CharacterSheet Frontend (Onglet Ma Fiche)
  - File: `web/src/modules/werewolf/pages/CharacterSheet.jsx`
  - Action: Remplacer le simple affichage d'histoire par deux modes: `isEditing` et `!isEditing`.
    - Édition: Formulaire avec champs `name`, `age`, `sex`, `image_url`, `physical_desc`, `mental_desc_pre`, `first_change`, `story`.
    - Lecture: Affichage structuré avec l'image, nom, âge, sexe, et les différentes sections de texte.
  - Notes: Copier/Adapter le pattern visuel de `vampire/components/CharacterSheet.jsx`.

### Acceptance Criteria

- [ ] AC 1: Given le joueur lance la création de personnage loup-garou, when il sélectionne Race, Auspice, Tribu et continue, then son personnage est créé avec le nom "Jeune Garou inconnu" SANS message envoyé sur Discord, et il est redirigé vers sa fiche.
- [ ] AC 2: Given un joueur a une fiche loup-garou sans attributs complets, when il va sur l'onglet "Ma Fiche", then il voit le formulaire d'édition.
- [ ] AC 3: Given le joueur remplit son formulaire avec nom, âge, sexe, descriptions et confirme, then les données sont sauvegardées en base et la vue bascule en mode Lecture.
- [ ] AC 4: Given c'est la première soumission complète de la fiche du joueur, when le backend sauvegarde les informations, then un thread Discord est créé avec les détails du personnage.
- [ ] AC 5: Given le joueur modifie sa fiche à nouveau plus tard, when il sauvegarde, then le thread Discord N'EST PAS dupliqué (seulement mis à jour ou journalisé via audit log selon l'existant).

## Additional Context

### Dependencies

- API de téléchargement d'image (existante pour vampire) fonctionnant depuis le composant Werewolf.
- Table `werewolf_data` SQLite capable d'ajouter de nouvelles colonnes si non existantes.

### Testing Strategy

- Tests unitaires/composant: Vérifier que `CreateCharacter.jsx` soumet la bonne structure sans le nom explicite.
- Tests manuels OBLIGATOIRES:
  1. Utiliser `!reset` pour nettoyer le profil test.
  2. Effectuer le Wizard -> vérifier SQLite local + pas de ping Discord.
  3. Compléter la Fiche -> vérifier sauvegarde SQLite + ping Discord.
  4. Ré-éditer la Fiche -> vérifier mise à jour SQLite sans nouveau ping Discord.

### Notes

- L'upload d'image doit utiliser le même endpoint (ex: `/api/upload`) et envoyer la logique comme pour les vampires.
- Attention aux variables `null` vs `""` dans la base SQLite lors des formulaires de l'UI.
- Il est possible que des fonctions d'audit log du bot s'emballent si beaucoup de champs textes sont modifiés d'un coup. S'assurer que le payload Discord reste dans les limites Discord API.
