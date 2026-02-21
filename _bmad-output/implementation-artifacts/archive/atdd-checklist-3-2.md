# ATDD Checklist: Story 3.2 - Composant StoryEditor

**Story**: [3-2-composant-storyeditor-edition-narrative.md](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/3-2-composant-storyeditor-edition-narrative.md)
**Status**: IN-PROGRESS (Verification phase)

## Acceptance Criteria Breakdown

| ID | Criterion | Level | Test File |
|---|---|---|---|
| AC1 | Activation du `StoryEditor` avec outils rich text (gras, italique, listes) | Component | `StoryEditor.test.jsx` |
| AC2 | Sauvegarde automatique toutes les 5 secondes si modifications | Component | `StoryEditor.test.jsx` |
| AC3 | Indicateur visuel "Sauvegardé" / "En cours..." | Component | `StoryEditor.test.jsx` |
| AC4 | Mode Focus (plein écran) | Component | `StoryEditor.test.jsx` |
| AC5 | Persistance en base de données via API | E2E / API | `story-persistence.spec.ts` (TBD) |
| AC6 | Sanitization du Markdown (XSS) | Unit / Component | `StoryEditor.test.jsx` |

## Supporting Infrastructure

### Data Factories
- **CharacterStoryFactory**: Génère du texte Markdown aléatoire pour les tests.

### Required data-testid Attributes
- `story-editor-textarea`: Zone de saisie principale.
- `save-status-indicator`: Petit indicateur d'état.
- `focus-mode-toggle`: Bouton pour le mode plein écran.
- `markdown-toolbar`: Barre d'outils.

## Implementation Checklist (Verification)

- [x] Créer le composant `StoryEditor.jsx`
- [x] Implémenter la logique d'auto-save (interval 5s)
- [x] Ajouter l'indicateur d'état de sauvegarde
- [x] Implémenter le mode Focus
- [x] Intégrer dans `CharacterSheet.jsx`
- [x] **[Pendent]** Vérifier la sanitization XSS du Markdown
- [x] **[Pendent]** Vérifier la persistance réelle via API (Test E2E)

## Execution Commands

```bash
# Lancer les tests du composant
npm test -- web/src/modules/werewolf/components/__tests__/StoryEditor.test.jsx

# (Optionnel) Lancer les tests E2E si configurés
# npx playwright test tests/e2e/werewolf/story-persistence.spec.ts
```

## Red-Green-Refactor Progress

- **RED**: Tests initiaux créés et échouent.
- **GREEN**: Implémentation réalisée, tests de base passent.
- **REFACTOR**: Corrections de Code Review appliquées (State sync, Sanitization).
