# ATDD Checklist: Story 1.2 - Thème "Deep Woods" CSS

**Story**: [1-2-theme-deep-woods-css.md](file:///c:/Users/freed/Desktop/the-world-of-darkness/_bmad-output/implementation-artifacts/1-2-theme-deep-woods-css.md)
**Status**: DONE

## Acceptance Criteria Breakdown

| ID | Criterion | Level | Test File |
|---|---|---|---|
| AC1 | Palette Gaia appliquée (#1a110a, #C19A6B, #E8DCC5) | Visual | `werewolf-theme.css` |
| AC2 | Contraste WCAG AA (ratio ≥ 4.5:1) | Accessibility | Manual / Design |
| AC3 | Activation du thème via `WerewolfLayout` | Component | `WerewolfLayout.test.jsx` |
| AC4 | Polices thématiques (Cinzel/Bitter) | Visual | `werewolf-theme.css` |

## Implementation Checklist

- [x] Créer `werewolf-theme.css` avec variables root
- [x] Implémenter `WerewolfLayout.jsx` avec `.theme-werewolf`
- [x] Intégrer le layout dans `routes.jsx`
- [x] Vérifier les contrastes (Blanc Os sur Noyer Sombre)
- [x] Vérifier le chargement des polices Google Fonts

## Execution Commands

```bash
# Lancer les tests du layout
npm test -- web/src/modules/werewolf/components/WerewolfLayout.test.jsx
```
