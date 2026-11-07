# Module Loup-Garou (backend) — ⏸️ EN PAUSE

Le développement de ce module est suspendu depuis le 2026-11-07 ; le projet se concentre sur le module Vampire.

- Le module reste **chargé et en service** : routes et tables enregistrées dans `api_server.py`, cog `cogs/werewolf.py` chargé par `main.py`.
- **Ne pas** y ajouter de fonctionnalités ni le refondre sans décision explicite de reprise.
- **Ne pas** le supprimer. Une modification partagée (core, base de données, authentification) doit le garder fonctionnel ; corriger seulement ce qu'elle casse, a minima.

Fichiers associés : `cogs/werewolf.py`, `views/lycan_panel.py`, `data/auspices.py`, `web/src/modules/werewolf/`, `tests/modules/werewolf/`, `docs/werewolf_rank_requirements.md`.

Le plan de conception initial (PRD, epics, architecture, UX) a été retiré du dépôt le 2026-11-07 ; il reste consultable dans l'historique git (dossier `_bmad-output/planning-artifacts/`).
