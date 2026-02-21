# ATDD Checklist - Epic 2, Story 2.3: Formulaire de Création de Personnage

**Date:** 2026-01-22
**Author:** Antigravity
**Primary Test Level:** Component (Vitest/RTL)

---

## Story Summary

**As a** nouveau joueur Loup-Garou
**I want** un formulaire pour définir mon personnage (Race, Auspice, Tribu, Nom)
**So that** mon identité narrative soit établie dès ma première connexion

---

## Acceptance Criteria

1. **Given** un joueur Werewolf sans fiche existante
   **When** il accède à `/werewolf/create`
   **Then** il voit un formulaire avec : Sélecteur Race, Sélecteur Auspice, Sélecteur Tribu, Champ Nom de personnage
   **And** tous les champs sont obligatoires
   **And** le formulaire utilise le thème "Deep Woods"
   **And** un avertissement indique que ces choix sont définitifs

---

## Failing Tests Created (RED Phase)

### Component Tests

**File:** `web/src/modules/werewolf/pages/__tests__/CreateCharacter.test.jsx`

- ✅ **Test:** `renders the creation form with all mandatory fields`
  - **Status:** RED - Component missing or Fields not found
  - **Verifies:** UI composition and Accessibility labels

- ✅ **Test:** `shows warning about definitive choices`
  - **Status:** RED - Text missing
  - **Verifies:** User guidance compliance

- ✅ **Test:** `uses the Deep Woods theme class`
  - **Status:** RED - Class missing
  - **Verifies:** Visual integration

---

## Implementation Checklist

### Test: renders the creation form...

**Tasks to make this test pass:**

- [ ] Créer le fichier `web/src/modules/werewolf/pages/CreateCharacter.jsx`
- [ ] Ajouter les inputs : Nom (Text), Race, Auspice, Tribu (Select)
- [ ] Ajouter les labels accessibles (`htmlFor`, `aria-label`)
- [ ] Marquer les inputs comme `required`
- [ ] Run test: `npm run test -- CreateCharacter`

### Test: shows warning...

**Tasks to make this test pass:**

- [ ] Ajouter un paragraphe/alert d'avertissement contenant "définitif"

### Dependencies
- Needs Story 2.2 (Assets) to populate Select options (Mock inputs for now)

---

## Running Tests

```bash
# From web directory
cd web
npm run test -- CreateCharacter
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

- ✅ All tests written and failing
- ✅ Implementation checklist created

### GREEN Phase (DEV Team - Next Steps)

1. **Create Component**
2. **Implement Layout**
3. **Run Tests**

---
