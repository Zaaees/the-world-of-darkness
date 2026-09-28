# Mise en service des corrections Vampire

Cette version change le protocole entre le navigateur, le bot et Google Sheets. Les trois composants doivent être mis à jour ensemble. Le dépôt contient les corrections ; il ne configure pas les services distants à lui seul.

## Configuration et ordre de déploiement

1. Suspendre les nouvelles demandes pendant la bascule. Conserver une copie privée complète du classeur (tous ses onglets), une sauvegarde cohérente de SQLite, les versions du code et les identifiants de déploiement. Ne pas publier ces copies dans Git.
2. Dans les propriétés du projet Apps Script, définir `SHEETS_API_SECRET` avec un secret aléatoire long. Configurer exactement la même valeur dans les secrets du serveur du bot. Ne pas la transmettre dans une URL, un fichier versionné, une variable `VITE_*` ou un message Discord.
3. Installer `docs/google-apps-script.js`, publier sa nouvelle version et configurer son URL `/exec` dans `GOOGLE_SHEETS_API_URL` côté serveur. Le script est appelé par le bot, en POST JSON. « Tout le monde » permet le transport vers Apps Script ; le secret vérifié dans `doPost` contrôle les opérations. Les GET ne renvoient plus de personnages.
4. **Désactiver les anciens déploiements Apps Script non protégés.** Changer uniquement l’URL utilisée par le bot laisse une ancienne URL exploitable si elle reste active.
5. Déployer le bot/API et le site de cette même révision. Vérifier `DISCORD_CLIENT_ID` côté bot et le client OAuth du site ; la valeur actuelle par défaut est `1453866706546987064`. Garder le scope `identify` et les URI de redirection Discord configurées. Les anciennes sessions sont acceptées si leur jeton est valide ; les nouvelles connexions vérifient aussi un paramètre `state` à usage unique.
6. Vérifier dans un compte de recette : connexion, sélection du clan, fiche, publication, goule, demande de récompense, validation et refus. Contrôler ensuite l’absence de double attribution après une nouvelle tentative. Réactiver les demandes lorsque ces contrôles passent.

Les colonnes complémentaires des goules et des scènes sont ajoutées par le script. Les anciennes origines sont conservées et continuent à afficher les anciennes questions. Une demande ancienne peut ne pas contenir de lien : demander le contexte au joueur avant de décider. Les demandes déjà présentes dans SQLite gardent leurs identifiants.

Sans secret serveur, les opérations Sheets échouent explicitement. Ne pas rétablir l’ancien accès public pour contourner cette erreur. Un retour de version doit conserver la protection de l’API et de Sheets ; si nécessaire, maintenir le service en maintenance jusqu’à correction.

## Sauvegarde et exercice de restauration

`tools/backup_game.py` utilise l’API de sauvegarde SQLite et contrôle l’intégrité. Il refuse d’écraser un fichier. Remplacer les chemins ci-dessous par les chemins réellement utilisés sur l’hôte du bot :

```text
python tools/backup_game.py /chemin/jeu.db /chemin/prive/jeu-2026-09-27.db
python tools/backup_game.py /chemin/prive/jeu-2026-09-27.db
python tools/backup_game.py /chemin/prive/jeu-2026-09-27.db /chemin/recette/restaure.db
```

La dernière commande réalise une restauration isolée. Vérifier les personnages, fiches, rituels et demandes dans cette copie. Pour remettre une copie en production : arrêter les écritures du bot, conserver la base actuelle, choisir la copie vérifiée dans la configuration, puis redémarrer et contrôler un compte de recette. Ne pas remplacer une base ouverte.

SQLite et Sheets contiennent des informations complémentaires : aucune sauvegarde de l’un ne remplace celle de l’autre. Pendant une sauvegarde destinée à une restauration globale, suspendre les validations afin d’obtenir un état cohérent des deux. Conserver aussi l’historique Sheets : il porte les identifiants qui empêchent de payer une récompense deux fois. Restaurer un historique plus ancien sans réconcilier les demandes peut rendre ces protections incomplètes.

## Recette et critères d’ouverture

- Un appel API sans jeton, avec un identifiant utilisateur falsifié, sans rôle requis ou vers un PNJ d’un autre serveur est refusé.
- Un GET Apps Script et un POST sans secret ne renvoient ni ne modifient les données.
- Retour puis reconnexion ne perdent pas les origines ; le brouillon d’un personnage n’est pas chargé sur un autre. Les brouillons restent locaux à l’appareil et nécessitent un stockage navigateur disponible.
- Une fiche enregistrée mais non publiée affiche cette différence et propose une reprise.
- Une demande montre le lien, les participants, l’obstacle et le résultat au MJ. Une reprise ne donne pas une seconde récompense ; une panne garde une décision réessayable.
- Un PNJ privé reste privé après une modification. Son rang ne change pas à cause d’une lecture du PJ.
- Le MJ et le joueur vérifient ensemble une dépense, une chasse et les trois cas de résistance mentale. Une dépense impossible ne retire aucun point.
- La copie restaurée passe le contrôle d’intégrité et contient les données attendues.

Après activation, commencer avec trois à cinq joueurs. Observer le temps jusqu’à la première scène, les demandes à clarifier, les délais MJ, les désaccords de règles et les pertes de texte. La progression reste fondée sur les accomplissements, sans plafond par scène, calendrier de progression ni délai de récupération ajouté.
