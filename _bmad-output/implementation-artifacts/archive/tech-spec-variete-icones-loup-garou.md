---
title: 'Variété des Icônes Loup-Garou'
slug: 'variete-icones-loup-garou'
created: '2026-02-22'
status: 'Completed'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['JSON']
files_to_modify: ['web/src/modules/werewolf/assets/werewolf_data.json']
code_patterns: ['Static JSON Data']
test_patterns: ['Manual React UI Check']
---

# Tech-Spec: Variété des Icônes Loup-Garou

**Created:** 2026-02-22

## Overview

### Problem Statement

Lors de la création d'un nouveau personnage Loup-Garou, la sélection des races, auspices et tribus affiche systématiquement le même emoji loup (🐺) comme visuel par défaut. Cela manque de variété et d'immersion pour les joueurs.

### Solution

Exploiter la propriété `icon` déjà supportée par le composant `WizardStep` en ajoutant des emojis uniques et thématiques pour chaque Race, Auspice et Tribu directement dans le fichier `werewolf_data.json`.

### Scope

**In Scope:**
- Ajout du champ `"icon"` pour chaque entrée dans `web/src/modules/werewolf/assets/werewolf_data.json`.

**Out of Scope:**
- Ajout d'images matricielles ou modifications structurelles du Wizard.
- Refonte des autres éléments de la fiche personnage.

## Context for Development

### Codebase Patterns
- Le composant frontend `WizardStep.jsx` (utilisé par `CreateCharacter.jsx`) parse les options et utilise déjà la logique `{option.icon || '🐺'}` pour afficher une icône au-dessus du titre si aucune image n'est fournie.
- Les données des options sont stockées statiquement dans `werewolf_data.json`.
- Aucune modification de code React ou Python n'est requise, uniquement de la donnée brute.

### Files to Reference
| File | Purpose |
| ---- | ------- |
| `web/src/modules/werewolf/assets/werewolf_data.json` | Fichier de données statiques à modifier pour ajouter la propriété `"icon"`. |
| `web/src/modules/werewolf/components/WizardStep.jsx` | Composant d'affichage (pour référence uniquement, gère déjà la fallback sur 🐺). |

### Technical Decisions
- Utiliser des emojis natifs standards reconnus par tous les navigateurs et OS sans nécessité d'assets externes pour rester léger et cohérent avec l'existant.
- L'ajout se fera dans l'ordre du fichier JSON : Breeds (Races), Auspices, Tribes (Tribus).

## Proposed Icons (from Advanced Elicitation)

Suite aux processus d'élicitation (Revue d'Experts Lore/UI et Scénarios 'What If'), voici la recommandation finale pour les NFTs:

**Races (Origine et nature)**
*   **Homid :** 👤 (Humain)
*   **Métis :** 🧬 (Mutation/Lignée interne - choix final au lieu du loup générique)
*   **Lupus :** 🐾 (Empreinte animale)

**Auspices (Liées aux phases de la lune - très lisible et logique)**
*   **Ragabash :** 🌑 (Nouvelle Lune - ombre, ruse)
*   **Theurge :** 🌒 (Croissant de Lune - mysticisme naissant)
*   **Philodox :** 🌓 (Demi-Lune - équilibre, justice)
*   **Galliard :** 🌔 (Lune Gibbeuse - passion croissante)
*   **Ahroun :** 🌕 (Pleine Lune - pleine puissance de la Rage)

**Tribus (Basées sur les Totems ou spécificités culturelles fortes)**
*   **Furies Noires :** 🏹 (Arc - Totem Pégase/Artémis, chasseuses)
*   **Rongeurs d'Os :** 🐀 (Rat - Totem Rat, survie urbaine)
*   **Enfants de Gaïa :** 🌿 (Branche/Feuille - Totem Licorne, nature/paix)
*   **Fianna :** 🦌 (Cerf - Totem Cerf, bardes celtiques)
*   **Rejetons de Fenris :** ⚔️ (Épées croisées - Totem Fenris, guerriers)
*   **Arpenteurs de Verre :** 💻 (Ordinateur - Totem Cafard, technologie)
*   **Griffes Rouges :** 🩸 (Goutte de Sang - Totem Griffon, sauvagerie pure)
*   **Seigneurs de l'Ombre :** 🌩️ (Éclair - Totem Grand-Père Tonnerre, tempête/ambition)
*   **Marcheurs Silencieux :** 🦉 (Hibou - Totem Hibou, mystère de la nuit/mort)
*   **Crocs d'Argent :** 👑 (Couronne - Totem Faucon, royauté)
*   **Astrolâtres :** 🌌 (Voie Lactée - Totem Chimère, astrologie/mysticisme)
*   **Uktena :** 🐍 (Serpent - Totem Uktena, magie occulte)
*   **Wendigo :** ❄️ (Flocon de neige - Totem Wendigo, blizzard du Grand Nord)

## Implementation Plan

### Tasks

- [x] Task 1: Ajouter les icônes pour les Races (Breeds)
  - File: `web/src/modules/werewolf/assets/werewolf_data.json`
  - Action: Ajouter la clé `"icon"` avec l'emoji correspondant à chaque race dans le tableau `breeds` (👤 pour homid, 🧬 pour metis, 🐾 pour lupus).

- [x] Task 2: Ajouter les icônes pour les Auspices
  - File: `web/src/modules/werewolf/assets/werewolf_data.json`
  - Action: Ajouter la clé `"icon"` avec la phase lunaire correspondante à chaque auspice dans le tableau `auspices` (🌑, 🌒, 🌓, 🌔, 🌕).

- [x] Task 3: Ajouter les icônes pour les Tribus (Tribes)
  - File: `web/src/modules/werewolf/assets/werewolf_data.json`
  - Action: Ajouter la clé `"icon"` avec l'emoji thématique défini pour chaque tribu dans le tableau `tribes`.

### Acceptance Criteria

- [x] AC 1: Given l'utilisateur est sur l'étape 1 (Race) du Wizard, when la page se charge, then les cartes affichent les emojis spécifiques (👤, 🐺, 🐾) au lieu du loup générique.
- [x] AC 2: Given l'utilisateur est sur l'étape 2 (Auspice) du Wizard, when la page se charge, then les cartes affichent les symboles des phases lunaires correspondantes au lieu du loup générique.
- [x] AC 3: Given l'utilisateur est sur l'étape 3 (Tribu) du Wizard, when la page se charge, then les cartes affichent les emojis thématiques correspondants au lieu du loup générique.

## Additional Context

### Dependencies
- Aucune dépendance externe requise (utilisation des emojis système).

### Testing Strategy
- Validation UI Manuelle: Lancer le serveur local (Vite) et vérifier visuellement chaque étape du wizard `CreateCharacter.jsx` pour confirmer que le composant gère correctement le centrage en texte taille `6xl`.
- Intégration Discord: S'assurer (via création d'un thread ou vérification du webhook) que les emojis UTF-8 (notamment les plus complexes comme 🌩️ ou ❄️) passent correctement dans le payload backend si ces données sont réutilisées hors du frontend.

### Notes
- Choix délibéré d'exclure les images lourdes. L'implémenteur veillera à ce que le rendu reste agréable indépendamment de l'OS du client (Windows, macOS).

## Review Notes
- Adversarial review completed
- Findings: 3 total, 0 fixed (F1 avoided as it explicitly contradicts the "no React modifications / use native emojis" constraints in the spec), 3 skipped
- Resolution approach: auto-fix
