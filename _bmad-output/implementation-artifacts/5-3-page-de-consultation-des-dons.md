# Story 5.3: Page de Consultation des Dons

Status: done

<!-- Note: Validation of this story file against checklist.md is required before implementation. -->

## Story

As a joueur,
I want consulter la liste de mes Dons sur une page dédiée,
so that je puisse voir mes capacités narratives disponibles.

## Acceptance Criteria

1.  **Page Layout:**
    - La page est accessible via `/werewolf/gifts`.
    - Affiche une grille responsive de composants `GiftCard`.
2.  **Data Filtering & Sorting:**
    - Affiche **tous** les Dons de la Tribu du joueur (plus les dons génériques/races si applicable).
    - Les Dons débloqués apparaissent en premier.
    - Les Dons verrouillés apparaissent ensuite (grisés).
3.  **Filtering Controls:**
    - Un filtre par **Niveau** (1-5) est présent en haut de page.
    - Un filtre "Afficher tout / Uniquement débloqués" est présent.

## Tasks / Subtasks

- [x] **Routing & Page Structure**
  - [x] Créer `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.jsx`
  - [x] Ajouter la route `/werewolf/gifts` dans le routeur principal.
- [x] **Data Integration**
  - [x] Connecter le composant au store/API pour récupérer:
    - Le profil du joueur (Tribu).
    - Le catalogue complet des Dons (filtré par Tribu).
    - La liste des Dons débloqués du joueur.
- [x] **UI Implementation**
  - [x] Implémenter la grille de `GiftCard`.
  - [x] Implémenter la barre de filtres (Niveau, Débloqués).
- [x] **Testing**
  - [x] Créer `GiftsPage.test.jsx`.
  - [x] Vérifier le tri et le filtrage.

## Dev Notes

### Relevant architecture patterns and constraints
- **Composant Réutilisable**: Utiliser `GiftCard` (Story 5.2).
- **Consistance Visuelle**: "Deep Woods" theme.
- **State Management**: Utiliser React Query ou Zustand pour les données.

### Source tree components to touch
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.jsx` (NEW)
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.css` (NEW)
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.test.jsx` (NEW)

### References
- [Epic 5: Story 5.3](file:///f:/Dossiers%20Utilisateur/Desktop/World%20of%20Darkness%20Code%20-%20BMAT/_bmad-output/planning-artifacts/epics.md)
## Dev Agent Record

### Completion Notes
- Implémenté `GiftsPage` avec filtrage par Niveau et état (Débloqué/Verrouillé).
- Ajouté route backend `GET /api/modules/werewolf/gifts` pour servir le catalogue filtré par tribu.
- Corrigé un bug dans `GiftCard` (handleClick non défini).
- Tests ATDD validés (3 tests passants).
- Style aligné sur le thème Deep Woods.

### File List
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.jsx` (NEW)
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.css` (NEW)
- `web/src/modules/werewolf/pages/GiftsPage/GiftsPage.test.jsx` (MODIFY)
- `web/src/modules/werewolf/routes.jsx` (MODIFY)
- `modules/werewolf/routes.py` (MODIFY)
- `web/src/modules/werewolf/components/GiftCard/GiftCard.jsx` (FIX)

### Review Follow-ups (AI)
- [x] [AI-Review][High] Fix Backend Filtering to include Breed/Auspice gifts (routes.py)
- [x] [AI-Review][Medium] Implement Gift Details Modal (GiftsPage.jsx)
- [x] [AI-Review][Medium] Add Tests for filtering and modal (GiftsPage.test.jsx)
- [x] [AI-Review][Low] Safe sorting (GiftsPage.jsx)
