---
title: 'Refonte Création et Fiche de Personnage Garou'
slug: 'refonte-creation-fiche-garou'
created: '2026-02-19T22:12:13+01:00'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['React', 'React Router', 'TailwindCSS']
files_to_modify: ['web/src/modules/werewolf/assets/werewolf_data.json', 'web/src/modules/werewolf/pages/CreateCharacter.jsx', 'web/src/modules/werewolf/components/WizardStep.jsx', 'web/src/modules/werewolf/pages/CharacterSheet.jsx']
code_patterns: ['React Functional Components', 'Tailwind Styling', 'Wizard Step Pattern']
test_patterns: ['Vitest', 'React Testing Library']
---

# Spécification Technique : Refonte Création et Fiche de Personnage Garou

## 1. Vue d'ensemble (Overview)

### Problème
La création de personnage loup-garou actuelle (`CreateCharacter.jsx` et `WizardStep.jsx`) est trop basique et manque d'immersion par rapport à la création de vampire (`ClanSelectionPage.jsx`). Les descriptions des races, auspices et tribus sont très courtes, alors que les clans vampires bénéficient de citations, de détails de roleplay et de descriptions étendues. De plus, la fiche de personnage actuelle (`CharacterSheet.jsx`) manque de profondeur et se contente d'afficher une simple description de l'histoire et les informations de base.

### Solution
1. Utiliser un agent 'writer' (ex: `/storyteller` ou `/creative-problem-solver`) pour générer le contenu lore étendu pour les loups-garous (citations, descriptions longues, roleplay, spécificités).
2. Enrichir les données de création Garou (`werewolf_data.json`) avec ce nouveau contenu.
3. Refondre l'interface de sélection (`WizardStep.jsx` ou créer un nouveau composant) pour afficher des cartes extensibles (afficher/réduire les détails) avant confirmation du choix.
4. Refondre la vue de la fiche de personnage principale (`CharacterSheet.jsx` onglet 'sheet') pour intégrer ces informations de lore de manière plus immersive et détaillée, s'inspirant de la richesse visuelle de la sélection de clan vampire.

### Périmètre (Scope)
**Inclus :**
- Génération de contenu lore (via agent).
- Enrichissement de `werewolf_data.json`.
- Refonte UI de `WizardStep.jsx`.
- Refonte UI de l'onglet principal de `CharacterSheet.jsx`.

**Exclus :**
- Modification de la logique backend de sauvegarde/création.
- Modification des onglets Dons et Renommée.

## 2. Contexte pour le Développement (Context for Development)

### Codebase Patterns
- Utilisation stricte de composants fonctionnels React.
- Stylisation globale et spécifique aux composants gérée par TailwindCSS, complétée par des thèmes CSS spécifiques (`.theme-werewolf`).
- Les données de création sont séparées dans un fichier JSON statique.
- L'application utilise `react-router-dom` pour la navigation.

### Files to Reference

| Fichier | Raison |
| :--- | :--- |
| `web/src/modules/vampire/pages/ClanSelectionPage.jsx` | Modèle d'UI cible (cartes extensibles, design riche). |
| `web/src/modules/werewolf/assets/werewolf_data.json` | Fichier source des données à enrichir. |
| `web/src/modules/werewolf/pages/CreateCharacter.jsx` | Logique principale du wizard de création à adapter potentiellement. |
| `web/src/modules/werewolf/components/WizardStep.jsx` | Composant d'UI pour chaque étape de création (doit devenir des cartes extensibles). |
| `web/src/modules/werewolf/pages/CharacterSheet.jsx` | Composant d'UI pour l'affichage de la fiche complète après création. |

## 3. Plan d'Implémentation (Implementation Plan)

- [x] Task 1: Génération du Lore (Action Requise Utilisateur/Agent)
  - Action: Utiliser un agent (ex: `/storyteller`) pour rédiger le contenu étendu (quote, description longue, roleplay, spécificités) pour chaque race, auspice et tribu.
  - Notes: Ce texte doit être produit avant de modifier massivement le JSON.

- [x] Task 2: Enrichissement du Modèle de Données
  - File: `web/src/modules/werewolf/assets/werewolf_data.json`
  - Action: Ajouter les champs `quote`, `long_description`, `roleplay` et `specificities` pour chaque entrée de `breeds`, `auspices`, et `tribes` avec les données générées à la Task 1.

- [x] Task 3: Refonte du Composant WizardStep
  - File: `web/src/modules/werewolf/components/WizardStep.jsx`
  - Action: Transformer le système de carte simple en un système de carte avec extension (bouton "Voir les détails" / "Réduire") similaire à `ClanSelectionPage`.
  - Notes: Ajouter un état local pour gérer l'expansion d'une carte. Intégrer les nouveaux champs (quote, long_description, etc.) dans la zone étendue.

- [x] Task 4: Adaptation de la Page CreateCharacter
  - File: `web/src/modules/werewolf/pages/CreateCharacter.jsx`
  - Action: Ajuster le layout global si nécessaire pour s'accommoder des nouvelles cartes plus grandes de `WizardStep`. Vérifier que l'étape 4 (Récapitulatif et Nom) s'affiche correctement et a un style à la hauteur de la refonte.

- [x] Task 5: Refonte de l'Onglet 'Ma Fiche' dans CharacterSheet
  - File: `web/src/modules/werewolf/pages/CharacterSheet.jsx`
  - Action: Repenser la disposition des informations de base (Race, Auspice, Tribu). Actuellement ce sont 3 blocs simples. L'améliorer pour afficher un résumé lore ou un design plus riche reprenant les données enrichies (ex: afficher la citation de la tribu du joueur).
  - Notes: Conserver le fonctionnement de l'éditeur d'histoire (`StoryEditor`).

## 4. Critères d'Acceptation (Acceptance Criteria)

- [x] AC 1: Étant donné un nouvel utilisateur, lorsqu'il navigue vers la création de personnage loup-garou, alors il voit des cartes interactives pour les races, contenant un bouton permettant de développer pour lire la description complète, citation, et roleplay.
- [x] AC 2: Étant donné qu'un joueur a étendu une carte dans la création, lorsqu'il clique sur "Réduire", alors le contenu détaillé se masque.
- [x] AC 3: Étant donné qu'un utilisateur consulte sa fiche (`/werewolf/sheet`), lorsqu'il regarde ses informations de base (Race, Tribu, Auspice), alors le design est plus élaboré que les simples blocs grisés actuels et s'intègre au thème "Deep Woods" avec potentiellement un rappel du lore.
- [x] AC 4: Étant donné l'exécution des tests existants, lorsqu'on lance la suite de tests, alors `CreateCharacter.test.jsx` passe toujours au vert.

## 5. Dépendances et Stratégie de Test

### Dependencies
- Nécessite la génération de textes narratifs par un agent externe ou par le client.

### Testing Strategy
- Mettre à jour `web/src/modules/werewolf/pages/__tests__/CreateCharacter.test.jsx` si la logique de clic change (par exemple si un double clic ou clic sur un bouton spécifique est désormais requis pour sélectionner).
- Vérification visuelle (Manual Testing) de l'UI des cartes étendues et de la nouvelle disposition de la fiche.
