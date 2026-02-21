# Story 3.2: Composant StoryEditor (Édition Narrative)

Status: review

## Story

As a joueur,
I want une zone de texte enrichie pour éditer mon Histoire,
So that je puisse rédiger un récit immersif sans perdre mon travail.

## Acceptance Criteria

1. **Given** la fiche personnage en mode consultation
   **When** je clique sur la zone "Histoire"
   **Then** le `StoryEditor` s'active avec des outils de texte enrichi (gras, italique, listes)
2. **And** le système effectue une sauvegarde automatique toutes les 5 secondes si des modifications sont détectées
3. **And** un indicateur visuel affiche "Sauvegardé" ou "En cours de sauvegarde..." de manière non-intrusive
4. **And** un bouton permet de passer en "Mode Focus" (plein écran) pour une rédaction immersive
5. **And** la modification est persistée en base de données via l'API existante (ou mise à jour)

## Tasks / Subtasks

- [x] Créer le composant `web/src/modules/werewolf/components/StoryEditor.jsx`
- [x] Implémenter la logique d'auto-save avec `useEffect` et `setTimeout/setInterval`
- [x] Ajouter l'indicateur d'état de sauvegarde
- [x] Implémenter le mode Focus (Overlay CSS)
- [x] Intégrer `StoryEditor` dans `CharacterSheet.jsx`
- [x] Vérifier la persistance via API
- [x] [AI-Review] Corriger la sychronisation d'état React dans `StoryEditor`
- [x] [AI-Review] Implémenter la sauvegarde périodique (Interval) vs Débounce
- [x] [AI-Review] Ajouter la sanitization du Markdown (XSS)
- [x] [AI-Review] Consolider la logique de sauvegarde et feedback d'erreur

## Dev Notes

- Utiliser Tailwind CSS pour le style.
- L'indicateur de sauvegarde est une petite puce animée avec du texte discret.
- Le mode Focus utilise `fixed inset-0` et un z-index élevé.

## Dev Agent Record

### Implementation Plan
- [x] Création du composant `StoryEditor.jsx`.
- [x] Logique d'auto-save avec debounce (5s).
- [x] Intégration dans `CharacterSheet.jsx`.
- [x] Correction des issues de Code Review (State sync, Auto-save interval, Sanitization, Error handling).

### Debug Log
- Correction des imports de `act` et `waitFor` dans les tests unitaires.
- Ajout de `handleAutoSave` dans `CharacterSheet` pour éviter de fermer l'éditeur lors de la sauvegarde auto.

### Completion Notes
- Composant `StoryEditor` fonctionnel avec barre d'outils Markdown.
- Auto-save persistant vers l'API.
- Support du Markdown dans la vue consultation via `react-markdown`.

## File List

- `web/src/modules/werewolf/components/StoryEditor.jsx`
- `web/src/modules/werewolf/components/__tests__/StoryEditor.test.jsx`
- `web/src/modules/werewolf/pages/CharacterSheet.jsx`
- `modules/werewolf/routes.py`
- `modules/werewolf/services/character_service.py`

## Change Log

- 2026-01-23: Initialisation du développement par l'agent.
- 2026-01-23: Implémentation complète et intégration.
- 2026-01-23: Code Review adversarial et application des corrections (AI).

