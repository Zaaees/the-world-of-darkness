# Story 2.3: Formulaire de Création de Personnage

Status: done

## Story

As a nouveau joueur Loup-Garou,
I want un formulaire pour définir mon personnage (Race, Auspice, Tribu, Nom),
So that mon identité narrative soit établie dès ma première connexion.

## Acceptance Criteria

1. **Given** un joueur Werewolf sans fiche existante
   **When** il accède à `/werewolf/create`
   **Then** il voit un formulaire avec : Sélecteur Race, Sélecteur Auspice, Sélecteur Tribu, Champ Nom de personnage
   **And** tous les champs sont obligatoires
   **And** le formulaire utilise le thème "Deep Woods"
   **And** un avertissement indique que ces choix sont définitifs

## Tasks / Subtasks

- [x] Créer la page Frontend
    - [x] `web/src/modules/werewolf/pages/CreateCharacter.jsx`
- [x] Implémenter le formulaire
    - [x] Intégration des assets (Story 2.2) pour les sélecteurs
    - [x] Validation des champs
    - [x] Thème CSS "Deep Woods"
- [x] Tests E2E / Component
    - [x] Vérifier l'affichage et la validation

## Dev Notes

### Architecture
- Utilise `WerewolfLayout` pour appliquer le thème
- Wrapper `theme-deep-woods` pour compatibilité avec les tests
- Données importées depuis `werewolf_data.json` (copie frontend des assets Story 2.2)
- Route ajoutée dans `routes.jsx` avec lazy loading

### Dépendances
- Story 2.2 (Assets de Données Garou) - données copiées en frontend JSON
- `@testing-library/jest-dom` ajouté aux devDependencies

## Dev Agent Record

### Implementation Plan
1. ✅ Créer `CreateCharacter.jsx` avec formulaire complet
2. ✅ Ajouter les champs: Nom, Race, Auspice, Tribu (tous required)
3. ✅ Ajouter l'avertissement "définitif"
4. ✅ Appliquer le thème Deep Woods via wrapper
5. ✅ Configurer vitest setup file pour jest-dom matchers
6. ✅ Ajouter la route `/werewolf/create` dans routes.jsx

### Debug Log
- Tests échouaient initialement: `@testing-library/jest-dom` non installé
- Solution: Installé le package et créé `src/setupTests.js`

### Completion Notes
- Composant `CreateCharacter.jsx` créé avec formulaire complet
- 4 champs: Nom (text), Race (select), Auspice (select), Tribu (select)
- Tous les champs marqués `required` avec validation minLength/maxLength
- Avertissement "définitif" affiché avec style alert et lié via aria-describedby
- Thème appliqué via `theme-deep-woods` class
- 3 tests passent (création form, warning, theme class)
- Route `/werewolf/create` ajoutée avec lazy loading

## Senior Developer Review (AI)

**Date:** 2026-01-22
**Reviewer:** Antigravity

### Issues Found & Fixed
1. **[MEDIUM]** Données hardcodées au lieu d'utiliser Story 2.2 → Créé `werewolf_data.json` frontend et importé correctement
2. **[MEDIUM]** Fichiers non trackés dans git → Ajouté `setupTests.js` et `werewolf_data.json` au staging
3. **[LOW]** Validation nom insuffisante → Ajouté `minLength={2}` et `maxLength={50}`
4. **[LOW]** Accessibilité incomplète → Ajouté `aria-describedby="definitive-warning"` sur tous les champs
5. **[LOW]** Tests incomplets → Ajouté assertions pour Auspice et Tribu `required`

### Verdict: ✅ APPROVED

## File List

- `web/src/modules/werewolf/pages/CreateCharacter.jsx` [NEW]
- `web/src/modules/werewolf/assets/werewolf_data.json` [NEW - Code Review Fix]
- `web/src/modules/werewolf/routes.jsx` [MODIFIED]
- `web/src/modules/werewolf/pages/__tests__/CreateCharacter.test.jsx` [PRE-EXISTING - ATDD, MODIFIED]
- `web/src/setupTests.js` [NEW]
- `web/vite.config.js` [MODIFIED]
- `web/package.json` [MODIFIED - @testing-library/jest-dom added]

## Change Log

- 2026-01-22: Story implémentée - Formulaire de création avec tous les champs obligatoires, route configurée, tests passants
- 2026-01-22: Code Review - Corrigé intégration assets, validation, accessibilité, couverture tests

