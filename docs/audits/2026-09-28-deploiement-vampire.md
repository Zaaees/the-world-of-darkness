# Déploiement Vampire — 28 septembre 2026

Révision publiée : `13d3144f79f545d91ad6d7af3af8cb67f599d5e3` sur `main`.

## Contrôles réussis

- [Contrôles de régression](https://github.com/Zaaees/the-world-of-darkness/actions/runs/36377940528) : 26 tests Python, 3 tests Apps Script, 131 tests web Vampire, lint ciblé et compilation.
- [Déploiement du bot](https://github.com/Zaaees/the-world-of-darkness/actions/runs/36377940527) : tests Python sous Python 3.11, authentification du nouveau script vérifiée depuis le serveur, sauvegarde SQLite avant remplacement et contrôles Fly réussis.
- Sauvegarde privée conservée sur le volume du serveur : `/app/storage/backups/before-vampire-deploy-20260928T043006292479Z.db`. Son intégrité SQLite a été vérifiée. Cette sauvegarde ne couvre pas le classeur Google Sheets.
- [Publication du site](https://github.com/Zaaees/the-world-of-darkness/actions/runs/36377940496) réussie après confirmation du déploiement du bot.
- Vérification publique : `/health` renvoie HTTP 200 et `{"status":"ok"}` ; `/api/vampire/character` et `/api/character-sheet` refusent les appels sans connexion avec HTTP 401.
- Le site et ses ressources répondent HTTP 200. Le module Vampire publié contient le nouveau guide de première nuit ; le bundle utilise l’URL de production du bot et l’authentification Bearer.

## À terminer avant l’ouverture générale

1. Archiver l’ancien déploiement Apps Script dont l’identifiant commence par `AKfycbzx4Us0c5xd`. Conserver le nouveau, qui commence par `AKfycbz0olVswEHL`. Cette opération dans le compte Google n’a pas été effectuée par l’agent.
2. Effectuer une recette connectée avec un joueur et un MJ : connexion Discord, fiche, publication, goule, dépense, demande de récompense, validation et refus. Les contrôles automatisés et HTTP ne remplacent pas cette vérification des rôles et salons réels.
3. Confirmer une copie privée du classeur complet pour disposer d’une sauvegarde complémentaire à SQLite.

Aucune donnée de personnage ni aucun secret n’a été affiché dans les vérifications de déploiement. Les limites connues et les échecs de tests préexistants hors périmètre Vampire restent consignés dans le rapport de corrections du 27 septembre.
