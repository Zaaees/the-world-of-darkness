# Story 4.5: Fix GitHub Pages 404 Routing

Status: done

## Story

As a utilisateur,
I want pouvoir naviguer vers "Vampire: La Mascarade" sans erreur 404,
so that je puisse accéder au Grimoire depuis GitHub Pages.

## Acceptance Criteria

1. ✅ Cliquer sur "Vampire: La Mascarade" navigue correctement vers le module
2. ✅ Pas d'erreur 404 GitHub Pages lors de la navigation
3. ✅ Le routing SPA fonctionne sans rechargement de page
4. ✅ Tous les tests existants passent
5. ✅ Le build de production réussit

## Tasks / Subtasks

- [x] Task 1 (AC: 1, 2)
  - [x] Diagnostiquer la cause du 404
  - [x] Ajouter `basename` au BrowserRouter correspondant au `base` de Vite
- [x] Task 2 (AC: 3)
  - [x] Remplacer `<a href>` par `<Link to>` pour le routing SPA
- [x] Task 3 (AC: 4, 5)
  - [x] Exécuter les tests unitaires
  - [x] Vérifier le build de production

## Dev Notes

### Cause Racine
Le `BrowserRouter` n'avait pas de `basename` configuré. Sur GitHub Pages, l'app est déployée sous `/the-world-of-darkness/`, mais le router ne le savait pas.

De plus, le lien vers Vampire utilisait une balise `<a>` au lieu du composant `<Link>`, causant un rechargement complet de page (et donc un 404 sur GitHub Pages qui ne gère pas le routing côté serveur).

### Solution
1. **App.jsx** : Ajout de `basename={import.meta.env.BASE_URL}` au `BrowserRouter`
2. **AppRouter.jsx** : Remplacement de `<a href="/vampire">` par `<Link to="/vampire">`

### References

- [Source: web/src/App.jsx] - Ajout du basename
- [Source: web/src/core/router/AppRouter.jsx] - Conversion a → Link
- [Source: web/vite.config.js#base] - Configuration du base path

## Dev Agent Record

### Agent Model Used
Gemini 2.5 Pro

### Completion Notes List
- Bug identifié : erreur 404 GitHub Pages lors du clic sur "Vampire the Masquerade"
- Cause : BrowserRouter sans basename + utilisation de balise <a> au lieu de <Link>
- Fix appliqué et testé : 90 tests passent, build réussi

### File List
- web/src/App.jsx (modifié)
- web/src/core/router/AppRouter.jsx (modifié)
