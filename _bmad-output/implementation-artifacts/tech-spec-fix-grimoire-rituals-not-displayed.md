---
title: 'Fix Grimoire - Rituels Non-Affichés (react-window v2 API)'
slug: 'fix-grimoire-rituals-not-displayed'
created: '2026-01-10T21:18:00+01:00'
status: 'done'
stepsCompleted: [1, 2, 3, 4]
tech_stack: ['react-window v2.2.4', 'React 19', 'Zustand 5', 'Vitest', 'React Testing Library']
files_to_modify: ['web/src/modules/vampire/features/rituals/components/RitualCatalog.jsx', 'web/src/modules/vampire/features/rituals/components/RitualCatalog.test.jsx']
code_patterns: ['react-window v2 cellComponent API', 'useShallow for Zustand selectors', 'ResizeObserver for responsive Grid']
test_patterns: ['Vitest vi.mock() for react-window', 'useGrimoireStore mock with selector', 'HTMLElement.prototype mocking for dimensions']
---

# Tech-Spec: Fix Grimoire - Rituels Non-Affichés

**Created:** 2026-01-10T21:18:00+01:00  
**Status:** ✅ Implémentation Complète

## Overview

### Problem Statement

Le Grimoire Occulte affiche une zone de contenu vide (avec scrollbar visible) au lieu d'afficher les cartes de rituels. Ce bug est apparu lors de l'implémentation des nouveaux rituels et affecte tous les modes (MJ et Joueur).

**Symptômes observés :**
- La scrollbar est présente (indiquant que le Grid est monté)
- Aucune carte de rituel n'est visible
- Les filtres (disciplines, niveaux) fonctionnent correctement
- Si `rituals.length === 0`, le message "Le vide..." s'affiche correctement

### Solution

**Cause racine identifiée :** Le composant `RitualCatalog.jsx` utilise l'ancienne API react-window v1 (`children` avec render function) alors que le projet utilise **react-window v2.2.4** qui requiert l'API `cellComponent` + `cellProps`.

### Scope

**In Scope:**
- Migrer `RitualCatalog.jsx` vers l'API react-window v2 (`cellComponent`)
- Créer un composant `RitualCell` séparé recevant les props via `cellProps`
- Mettre à jour le mock react-window dans les tests
- Vérifier que les rituels s'affichent correctement

**Out of Scope:**
- Modification du store `useGrimoireStore`
- Modification de `RitualCard`
- Modifications aux données de rituels (`rituals.js`)

---

## Implementation Plan

### Task 1: Modifier RitualCatalog.jsx - Migration vers API v2

**File:** `web/src/modules/vampire/features/rituals/components/RitualCatalog.jsx`

**Actions:**

1. **Créer un composant `RitualCell`** (fonction séparée, pas inline) qui reçoit les props de react-window v2 :

```jsx
// Composant de cellule pour react-window v2
// Reçoit: columnIndex, rowIndex, style (de Grid) + rituals, columnCount (de cellProps)
const RitualCell = ({ columnIndex, rowIndex, style, rituals, columnCount }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= rituals.length) return null;

    return (
        <div style={style} className="p-2">
            <RitualCard ritual={rituals[index]} />
        </div>
    );
};
```

2. **Remplacer l'utilisation de `children`** par `cellComponent` et `cellProps` :

```jsx
// ❌ AVANT (ne fonctionne pas avec react-window v2)
<Grid ...>
    {CellRenderer}
</Grid>

// ✅ APRÈS
<Grid
    columnCount={columnCount}
    columnWidth={columnWidth}
    height={dimensions.height}
    rowCount={rowCount}
    rowHeight={CARD_HEIGHT}
    width={dimensions.width}
    overscanCount={OVERSCAN_COUNT}
    cellComponent={RitualCell}
    cellProps={{ rituals, columnCount }}
/>
```

3. **Supprimer le `useCallback`** pour `CellRenderer` (plus nécessaire car géré par react-window v2)

---

### Task 2: Modifier RitualCatalog.test.jsx - Mise à jour du mock

**File:** `web/src/modules/vampire/features/rituals/components/RitualCatalog.test.jsx`

**Actions:**

1. **Mettre à jour le mock de react-window** pour utiliser `cellComponent` et `cellProps` :

```jsx
// ❌ AVANT (mock de l'API v1)
vi.mock('react-window', async () => {
    return {
        Grid: ({ children, ...props }) => (
            <div data-testid="virtual-grid" data-overscan={props.overscanCount}>
                {children({ columnIndex: 0, rowIndex: 0, style: {} })}
            </div>
        )
    };
});

// ✅ APRÈS (mock de l'API v2)
vi.mock('react-window', async () => {
    return {
        Grid: ({ cellComponent: CellComponent, cellProps, ...props }) => (
            <div data-testid="virtual-grid" data-overscan={props.overscanCount}>
                <CellComponent 
                    columnIndex={0} 
                    rowIndex={0} 
                    style={{}} 
                    {...cellProps} 
                />
            </div>
        )
    };
});
```

---

## Acceptance Criteria

### AC 1: Affichage des rituels en mode MJ
- [ ] **Given:** L'utilisateur accède au Grimoire en mode MJ (Bibliothèque)
- [ ] **When:** La page se charge complètement  
- [ ] **Then:** Les cartes de rituels s'affichent dans une grille virtualisée

### AC 2: Affichage des rituels en mode Joueur
- [ ] **Given:** L'utilisateur accède au Grimoire en mode Joueur
- [ ] **When:** La page se charge complètement
- [ ] **Then:** Les cartes de rituels du personnage s'affichent

### AC 3: État vide
- [ ] **Given:** Aucun rituel ne correspond aux filtres actifs
- [ ] **When:** L'utilisateur consulte le Grimoire
- [ ] **Then:** Le message "Le vide... Aucun rituel ne correspond à votre recherche" s'affiche

### AC 4: Tests unitaires passent
- [ ] **Given:** Le code est modifié
- [ ] **When:** On exécute `npm test` dans le dossier `web/`
- [ ] **Then:** Tous les tests de `RitualCatalog.test.jsx` passent

---

## Context for Development

### Codebase Patterns

- **Zustand + useShallow**: Déjà utilisé dans `RitualCatalog.jsx` pour éviter les re-renders infinis
- **react-window v2 API**: Le projet utilise `Grid` avec `cellComponent` (pas `FixedSizeGrid`)
- **ResizeObserver**: Utilisé pour les dimensions responsives du Grid

### Files to Reference

| File | Purpose |
| ---- | ------- |
| [RitualCatalog.jsx](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/web/src/modules/vampire/features/rituals/components/RitualCatalog.jsx) | Composant à corriger |
| [RitualCatalog.test.jsx](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/web/src/modules/vampire/features/rituals/components/RitualCatalog.test.jsx) | Tests à mettre à jour |
| [RitualCard.jsx](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/web/src/modules/vampire/features/rituals/components/RitualCard.jsx) | Composant enfant (ne pas modifier) |

### Technical Decisions

1. **Extraire `RitualCell` comme fonction séparée** (pas de composant imbriqué dans le render) pour respecter les bonnes pratiques React  
2. **Utiliser `cellProps`** pour passer `rituals` et `columnCount` - react-window v2 gère automatiquement le memoization
3. **Ne pas utiliser `useCallback`** car react-window v2 mémorise automatiquement les props

---

## Verification Plan

### Tests Automatisés

**Commande:** 
```bash
cd web && npm test -- --run RitualCatalog
```

**Tests existants qui doivent passer :**
- `renders and connects to store` - Vérifie que le Grid est monté
- `passes overscanCount to Grid` - Vérifie le passage des props
- `uses correct itemSize` - Vérifie les constantes
- `displays empty state when no rituals match filters` - Vérifie l'état vide

### Vérification Manuelle

**Étapes :**
1. Lancer le serveur de développement :
   ```bash
   cd web && npm run dev
   ```
2. Ouvrir l'application dans le navigateur (généralement http://localhost:5173)
3. Naviguer vers le Grimoire Occulte
4. **Vérifier :**
   - Les cartes de rituels s'affichent (avec nom, niveau, discipline)
   - Le scroll fonctionne correctement (virtualisation)
   - Les filtres (disciplines, niveaux) fonctionnent
   - La recherche fonctionne

---

## Additional Context

### Dependencies

- **react-window v2.2.4** (déjà installé)
- Aucune nouvelle dépendance requise

### Notes

- L'erreur 404 "vampire:1" dans la console est liée à une ressource externe et n'est pas la cause du bug
- Plusieurs tentatives de fix précédentes sont visibles dans l'historique Git, mais aucune n'a migré vers l'API `cellComponent` correcte
- Le mock de test utilisait aussi l'ancienne API, ce qui explique pourquoi les tests passaient mais l'application échouait

### Risk Assessment

| Risque | Probabilité | Impact | Mitigation |
| ------ | ----------- | ------ | ---------- |
| Régression des tests | Faible | Moyen | Exécuter tous les tests après modification |
| Performance dégradée | Très faible | Faible | react-window v2 gère le memoization automatiquement |
