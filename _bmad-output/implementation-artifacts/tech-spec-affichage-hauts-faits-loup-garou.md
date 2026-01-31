---
title: 'Affichage des Hauts Faits Loup-Garou (Renommée)'
slug: 'affichage-hauts-faits-loup-garou'
created: '2026-01-30'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4, 5]
tech_stack: ['Python', 'aiohttp', 'React', 'Tailwind CSS', 'Framer Motion']
files_to_modify: 
  - 'modules/werewolf/routes.py'
  - 'web/src/modules/werewolf/components/WerewolfNavbar.jsx'
  - 'web/src/modules/werewolf/routes.jsx'
  - 'web/src/modules/werewolf/pages/WerewolfRenownPage.jsx'
  - 'web/src/modules/werewolf/components/RenownCard.jsx'
  - 'web/src/modules/werewolf/components/RenownGuide.jsx'
code_patterns: ['Service/Controller Pattern', 'React Container/Presentation Pattern']
test_patterns: ['pytest-asyncio', 'React Testing Library']
---

# Tech-Spec: Affichage des Hauts Faits Loup-Garou (Renommée)

**Created:** 2026-01-30

## Overview

### Problem Statement

Les joueurs avec le rôle Loup-Garou n'ont actuellement aucun moyen de consulter leurs "Hauts Faits" (Demandes de Renommée) une fois validés. Une fois qu'une demande est acceptée par un conteur, elle disparaît de la vue du joueur, ce qui nuit au sentiment de progression et d'accomplissement.

### Solution

Implémenter une section "Hauts Faits" dédiée dans le module Loup-Garou.
- **Backend** : Nouvel endpoint API pour récupérer la renommée validée de l'utilisateur connecté.
- **Frontend** : Une nouvelle page inspirée de l'onglet "Disciplines" du module Vampire :
    - **Visuels** : Cartes "Premium" avec dégradés, icônes représentant le type de Renommée (Gloire, Honneur, Sagesse).
    - **État Vide** : Un écran d'accueil accueillant ("Onboarding") qui explique ce que sont les Hauts Faits et guide l'utilisateur pour en proposer un.
    - **Guidance** : Explication narrative des trois types de Renommée pour guider le roleplay.

### Scope

**In Scope:**
- **API** : `GET /api/modules/werewolf/renown` (renvoie les hauts faits validés).
- **Frontend** : 
    - Nouvelle Page : `/werewolf/renown`.
    - Composant : `RenownPage.jsx` (Conteneur principal).
    - Composant : `RenownCard.jsx` (Affichage individuel).
    - Composant : `RenownGuide.jsx` (Texte explicatif / Accordéon).
    - Navigation : Mise à jour de `WerewolfNavbar` pour inclure le nouveau lien.

**Out of Scope:**
- Modification du processus de *soumission* (existe déjà).
- Modification du processus de *validation* (existe déjà).
- Changement du modèle de données `Renown`.

## Context for Development

### Codebase Patterns

- **Backend (Python/aiohttp)** :
    - Les routes sont définies dans `modules/werewolf/routes.py`.
    - L'accès à la BDD se fait via `aiosqlite.connect(DATABASE_PATH)`.
    - Les Handlers doivent être décorés avec `@require_werewolf_role`.
    - Les réponses JSON utilisent `web.json_response`.

- **Frontend (React)** :
    - Structure modulaire : `web/src/modules/werewolf/`.
    - Styles : Tailwind CSS pour le layout, Framer Motion pour les animations.
    - Icônes : `lucide-react`.

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `modules/werewolf/routes.py` | Ajouter l'endpoint GET. |
| `modules/werewolf/models/store.py` | Consulter pour les requêtes DB (ou ajouter une fonction helper). |
| `web/src/modules/werewolf/routes.jsx` | Ajouter la route frontend `/renown`. |
| `web/src/modules/werewolf/components/WerewolfNavbar.jsx` | Ajouter le lien de navigation. |
| `web/src/modules/vampire/components/DisciplinesTab.jsx` | Référence pour le design (à adapter). |

### Technical Decisions

- **Design System** : Adaptation du design "Vampire" (Rouge/Pierre) vers un design "Werewolf" (Ambre/Forêt/Terre).
- **Architecture Frontend** : Séparation claire entre `RenownPage` (qui fetch les données) et `RenownCard` (qui affiche).
- **Données** : L'API renverra une structure groupée par type (Glory, Honor, Wisdom) + le score total calculé de chaque type.
- **Contrat de Données (Fix F7)** :
    - API renvoie des clés `snake_case` (`renown_type`, `validated_at`).
    - Dates format ISO 8601 string.
    - Exclusions de sécurité (Fix F4) : pas de `validated_by`.

---

## Implementation Plan

### Tasks

- [x] Tâche 1: Backend - Créer l'endpoint de récupération de renommée
  - File: `modules/werewolf/routes.py`
  - Action: Ajouter un handler `get_my_renown_handler` décoré par `@require_werewolf_role`.
  - Notes:
    - Récupérer l'ID utilisateur via header `X-Discord-User-ID`.
    - Requête SQL : `SELECT title, description, renown_type, validated_at FROM werewolf_renown WHERE user_id = ? AND status = 'approved' ORDER BY validated_at DESC LIMIT 50` (Fix F1, F2).
    - **Sécurité (Fix F4)** : Ne JAMAIS sélectionner/renvoyer `validated_by`.
    - Retourner : `{"results": [...]}`.

- [x] Tâche 2: Frontend - Créer le composant RenownGuide
  - File: `web/src/modules/werewolf/components/RenownGuide.jsx`
  - Action: Créer un composant accordéon qui explique les 3 piliers (Gloire, Honneur, Sagesse).
  - Notes: Texte narratif fourni dans la section Guidance.

- [x] Tâche 3: Frontend - Créer le composant RenownCard
  - File: `web/src/modules/werewolf/components/RenownCard.jsx`
  - Action: Créer une "carte" interactive pour un type de renommée.
  - Notes:
    - Props: `type` (glory, etc.), `score` (total), `items` (liste des hauts faits), `icon`.
    - Style: Gradients Ambre/Vert.
    - Interaction: Clic pour expand/collapse la liste des items.

- [x] Tâche 4: Frontend - Créer la page WerewolfRenownPage
  - File: `web/src/modules/werewolf/pages/WerewolfRenownPage.jsx`
  - Action: Page principale qui fetch `/api/modules/werewolf/renown`.
  - Notes:
    - Calculer les scores totaux à partir des données reçues.
    - Afficher le `RenownGuide`.
    - Afficher une grille de 3 `RenownCards`.
    - Gérer l'état de chargement et d'erreur.

- [x] Tâche 5: Frontend - Intégration Navigation et Routing
  - File: `web/src/modules/werewolf/routes.jsx`
  - Action: Ajouter la route path="/renown" vers `WerewolfRenownPage`.
  - File: `web/src/modules/werewolf/components/WerewolfNavbar.jsx`
  - Action: Ajouter un item de menu "Hauts Faits" (Icône: Trophy ou Star).

### Acceptance Criteria

- [x] AC 1: Given un utilisateur connecté, When il accède à `/werewolf/renown`, Then il voit ses scores de renommée (Gloire, Honneur, Sagesse).
- [x] AC 2: Given un utilisateur avec des hauts faits validés, When il clique sur une carte de renommée, Then la liste de ses hauts faits validés s'affiche, triée du plus récent au plus ancien.
- [x] AC 3: Given un utilisateur sans hauts faits, When il accède à la page, Then il voit un message d'encouragement et les scores à 0.
- [x] AC 4: Given la page de renommée, When l'utilisateur clique sur le guide, Then les descriptions narratives des types de renommée s'affichent.
- [x] AC 5: Given le backend, When une requête est faite sur `/api/modules/werewolf/renown` sans rôle Werewolf, Then une erreur 403 est retournée.
- [x] AC 6: (Sécurité) Given l'API, When je reçois la réponse, Then le champ `validated_by` est absent.

## Additional Context

### Dependencies

- `lucide-react` pour les icônes.
- `framer-motion` (déjà installé) pour les animations.

### Testing Strategy

- **Backend** : Test unitaire/d'intégration `test_renown_route.py` pour vérifier que l'API renvoie les bonnes données filtrées par utilisateur.
- **Frontend** : Vérification manuelle (Walkthrough) :
    1. Se connecter avec un compte Werewolf.
    2. Aller sur la page Hauts Faits.
    3. Vérifier l'affichage vide.
    4. Ajouter un haut fait via la DB ou un bot admin.
    5. Rafraîchir et vérifier l'affichage des données.

### Notes

- Veiller à ce que le design soit responsive (mobile-friendly).
- Les couleurs doivent rester lisibles (contraste texte blanc sur fond sombre).

## Review Notes
- Adversarial review completed (F1-F5).
- Findings: 5 total, 5 auto-fixed.
- Resolution approach: auto-fix
- Fixes applied:
  - F1, F2: API now returns `id` and `validated_at` (mapped from `submitted_at`) properly.
  - F2, F3: Frontend uses `id` for key and French date locale.
  - F5: Navbar link includes Trophy icon.
