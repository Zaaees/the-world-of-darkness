---
title: 'Starter Pack RP'
slug: 'starter-pack-rp'
created: '2026-02-23'
status: 'ready-for-dev'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React', 'Vite', 'TailwindCSS', 'Zustand (Global)', 'React Context / Local State', 'discord.py (Backend API)', 'aiosqlite']
files_to_modify: [
  'web/src/modules/werewolf/pages/CreateCharacter.jsx', 
  'web/src/modules/werewolf/pages/CharacterSheet.jsx',
  'web/src/modules/vampire/pages/CreateCharacter.jsx',
  'web/src/modules/vampire/components/CharacterSheet.jsx',
  'backend/models/... (ou services/data_manager.py)'
]
code_patterns: [
  'Composants fonctionnels + Hooks',
  'TailwindCSS pour le layout/spacing',
  'fetch() direct pour les appels API (pas d\'Axios)',
  'JSON statique (werewolf_data.json) pour les données de lore',
  'Architecture SPA avec onglets (CharacterSheet)'
]
test_patterns: ['Vitest + Testing Library', 'describe/it pattern', 'vi.mock pour fetch']
---

# Tech-Spec: Starter Pack RP

**Created:** 2026-02-23

## Overview

### Problem Statement

Les joueurs ont besoin d'un pont entre les choix mécaniques effectués lors de la création de leur personnage (Race, Auspice, Tribu pour Loup-Garou ; Clan pour Vampire) et la rédaction concrète de l'historique de ce dernier. Il arrive qu'ils manquent d'inspiration pour démarrer leur "Background" une fois le wizard terminé.

### Solution

### Solution

Créer un générateur "Starter Pack RP" ou "Boîte à idées". Selon les choix du joueur (Race, Auspice, Tribu / Clan), un ensemble de questions personnalisées lui sera posé lors de la création de son personnage (la quantité de questions pouvant varier, ex: plus pour la Tribu).
Le joueur y répondra pendant le processus de création. Ces questions et leurs réponses respectives seront ensuite sauvegardées et réaffichées comme références lors de la rédaction finale et libre de l'historique de son personnage sur sa fiche.

### Scope

**In Scope:**
- Lecture du format de données JSON : le fichier `starter_pack_data.json` sera créé au préalable par l'agent Storyteller.
- Architecture de stockage et récupération des **questions ET des réponses obligatoires** de l'utilisateur dans le front-end React et en base de données.
- Affichage de ces questions/réponses comme références visuelles (design responsive : panneau latéral sur desktop, accordéon collapsable sur mobile) sur la page d'édition de l'histoire du personnage (`CharacterSheet.jsx` pour Garou et Vampire).
- Ajout d'une étape spécifique dans le Wizard de création (`CreateCharacter.jsx` Garou et Vampire) pour poser ces questions et récolter les réponses obligatoirement avant validation.
- Mise à jour du schéma de base de données (ajout de la colonne `starter_pack_answers` dans les tables correspondantes) via le `DataManager` du bot Discord.

**Out of Scope:**
- Génération en temps réel des accroches par une IA (les questions sont statiques dans le JSON produit par Storyteller).
- Gestion de la rétrocompatibilité (pas de personnages existants à migrer, données de tests actuelles ignorées/supprimées).

## Context for Development

### Codebase Patterns

- **Frontend:** React + Vite, utilisation de TailwindCSS.
- **State :** État local robuste dans `CreateCharacter` et `CharacterSheet` via `useState`. Les appels API utilisent la fonction `fetch` classique.
- **Chargement des données :** L'actuel `werewolf_data.json` stocke le lore. Le format `werewolf_data.json` sera étendu, ou un fichier `starter_pack_data.json` séparé sera créé pour contenir les questions indexées par `breed`, `auspice` et `tribe`.
- **Langue de dev :** Commentaires, JSDoc et tout affichage front-end en Français obligatoirement.
- **Backend Communication:** Les composants envoient l'ID Discord via des headers personnalisés (`X-Discord-User-ID`, `X-Discord-Guild-ID`).

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `web/src/modules/werewolf/pages/CreateCharacter.jsx` | Utilisé pour le wizard de création. Devra intégrer un nouveau `WizardStep` (étape 4), mettre à jour la logique de la barre de progression `(step / 4) * 100%`, et exiger une réponse dans `canProceed()`. |
| `web/src/modules/vampire/pages/CreateCharacter.jsx` | Équivalent pour Vampire. Ajouter l'étape des questions liées au Clan avec la même validation stricte. |
| `web/src/modules/werewolf/pages/CharacterSheet.jsx` | Intégration UI : mode édition d'histoire : prévoir un affichage responsive (side-panel/accordion) pour que les questions ne cassent pas le layout. |
| `web/src/modules/vampire/components/CharacterSheet.jsx` | Équivalent pour Vampire. Intégration UI similaire. |
| `assets/starter_pack_data.json` | Fichier créé par Storyteller, contenant la totalité des questions formatées. |
| Backend Python (`DataManager` / queries) | Identifier l'endroit où la création des tables et les requêtes `INSERT`/`UPDATE` pour les fiches persos sont faites et y inclure `starter_pack_answers`. |

### Technical Decisions

- **Stockage des Questions (Données de Référence) :** Les listes de questions seront figées dans un fichier JSON (`starter_pack_data.json`) créé par le **Storyteller** *avant* le début du développement de cette feature. Ce JSON dictera la structure exacte à utiliser pour le rendu front-end (F11, F19).
- **Stockage des Réponses (Données Joueur) :** Les réponses des joueurs nécessiteront l'ajout d'une colonne de type `TEXT` en base de données sur le backend (SQLite n'ayant pas de vrai type JSON, il faudra parser avec `json.loads` et sérialiser avec `json.dumps` dans `DataManager.py`) (F15).
- **Obligation des Réponses :** Les questions posées dans le Wizard seront obligatoires. La validation technique stricte (ex: champ texte non vide) suffira, la profondeur de la réponse dépendra du joueur (F13).
- **UI du Wizard :** Une nouvelle étape finale sera ajoutée dans `CreateCharacter` pour collecter les réponses. **IMPORTANT :** La logique d'appel API et de bouton de soumission finale devra être déplacée de l'étape précédente vers cette nouvelle étape finale (F12). Pour Vampire, bien identifier l'étape finale dynamique, qui n'est pas forcément "l'étape 3" (F17).
- **UI de la Fiche :** Dans `CharacterSheet`, un panneau collapsable/adjacent affichera les questions ET les réponses du joueur pour référence pendant l'écriture. Les réponses seront en **Lecture seule** (F16). L'intégration sur mobile (accordéon) devra s'assurer de ne pas pousser le champ "Histoire" hors de l'écran lors de son ouverture (F18).

## Implementation Plan

### Tasks

- [ ] Task 1: Modification du modèle de base de données (Backend)
  - File: Fichiers de DB du bot python (`DataManager.py`, setup db) et API routes.
  - Action: Ajouter une colonne `starter_pack_answers` de type TEXT aux tables des personnages (Loup-Garou et Vampire). Modifier le script de setup ou spécifier la commande `ALTER TABLE ... ADD COLUMN` pour forcer la migration de la structure locale (F20).
  - Notes: Utiliser `json.dumps()` et `json.loads()` dans `DataManager.py` pour gérer cette colonne sqlite comme un dictionnaire (F15). Mettre à jour l'API POST et PUT.

- [ ] Task 2: Mise à jour du Wizard de création Werewolf (Frontend)
  - File: `web/src/modules/werewolf/pages/CreateCharacter.jsx`
  - Action: Ajouter un `step 4` "Starter Pack RP". Ajuster la barre de progression (diviser par 4).
  - Notes: Rendre ces questions obligatoires textuellement. **Déplacer le bouton de soumission API et sa logique** (actuellement step 3) vers ce nouveau step 4 (F12). Mettre à jour le payload de création.

- [ ] Task 3: Mise à jour du Wizard de création Vampire (Frontend)
  - File: `web/src/modules/vampire/pages/CreateCharacter.jsx`
  - Action: Similaire à Task 2, mais basé sur les choix de Clan. Rendre obligatoire et corriger la barre de progression.
  - Notes: S'assurer d'insérer cette étape **à la toute fin du wizard Vampire**, quel que soit le nombre d'étapes existantes (F17). Déplacer le bouton de soumission finale.

- [ ] Task 4: Intégration UI "Boîte à idées" dans Fiche Werewolf
  - File: `web/src/modules/werewolf/pages/CharacterSheet.jsx`
  - Action: En mode d'édition de l'histoire (`sheetData.story`), afficher un panneau contenant les questions du JSON croisées avec les réponses de l'utilisateur (`character.starter_pack_answers`) en lecture seule (F14, F16).
  - Notes: Attention au Layout Shift sur mobile (F18) ; préférer un side-panel sur Desktop. Ajouter l'option visuelle de "supprimer/cacher" cette référence si l'histoire est complétée (F16).

- [ ] Task 5: Intégration UI "Boîte à idées" dans Fiche Vampire
  - File: `web/src/modules/vampire/components/CharacterSheet.jsx`
  - Action: Même comportement et design que la Task 4, appliqué à la structuration du composant Vampire.

### Acceptance Criteria

- [ ] AC 1: Given que je suis à l'avant-dernière étape de création (Garou ou Vampire), quand je clique sur Suivant, then j'arrive sur le Starter Pack RP affichant les questions de `starter_pack_data.json` correspondant à mes choix.
- [ ] AC 2: Given que je suis sur l'étape Starter Pack, quand j'essaie de confirmer sans avoir rempli de texte, then le bouton de validation reste désactivé ou l'API bloque l'envoi.
- [ ] AC 3: Given que je valide la création, then la DB SQLite enregistre ce dictionnaire en sérialisant via JSON sans crash, et la logique finale soumet toutes les données correctement (boutons bien déplacés).
- [ ] AC 4: Given que je suis sur ma Fiche en mode édition de l'histoire, then je vois mes questions/réponses combinées de manière lisible et non éditable, sans que cela "pousse" le champ Histoire hors de l'écran sur mobile.

## Additional Context

### Dependencies

- Le backend Discord Bot doit être mis à jour pour persister les nouvelles colonnes (`starter_pack_answers`) dans SQLite.
- Le fichier `starter_pack_data.json` **doit être généré par le Storyteller** avant de commencer le développement impliquant l'affichage final, afin que le parseur React puisse être codé selon la structure exacte fournie.

### Testing Strategy

- **Tests unitaires (Frontend) :** Vérifier que `CreateCharacter` affiche bien le nouveau step, gère l'état visuel du bouton de confirmation de façon bloquante, et que la barre de progression s'affiche normalement.
- **Tests d'intégration (Frontend) :** Vérifier que les réponses obligatoires sont bien inclues dans le payload `POST` vers l'API lors de la soumission.
- **Tests Backend :** Tester l'absence d'erreurs d'ajout SQLite d'une nouvelle colonne sur le backend, et vérifier l'Endpoint.
- **Tests Visuels :** Valider explicitement l'affichage responsive (accordéon mobile vs panneau desktop) sur la feuille d'Édition Fiche.

### Notes

- **Performance :** L'affichage en mode édition sur la fiche de personnage utilise un panneau ou accordéon dédié pour ne pas alourdir la lecture globale de la fiche, limitant l'impact du composant sur les performances de rendu global.
- Retro-compatibilité ignorée en accord avec les indications (pas de persos prod).
