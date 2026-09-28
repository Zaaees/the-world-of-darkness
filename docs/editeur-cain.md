# Éditeur de textes CAIN

## Utilisation

Dans le tableau de bord CAIN, cliquer sur **Éditer les textes du site**. Le panneau permet de rechercher un texte par contenu ou rubrique et de le modifier. Les textes statiques surlignés dans les pages peuvent également être sélectionnés directement. Pour les libellés d’attributs (infobulles, aides de saisie) et les textes des catalogues, utiliser la recherche du panneau.

La saisie s’enregistre automatiquement après 600 ms de pause. L’indication **Enregistré** signifie que le serveur a confirmé l’écriture. Le changement est alors effectif ; les autres pages ouvertes se mettent à jour au plus tard à la prochaine vérification, toutes les cinq secondes lorsque la page est visible, hors latence réseau. Aucun brouillon privé, publication manuelle, historique ou restauration éditoriale.

Le panneau peut être réduit pour naviguer. En cas de coupure réseau, la saisie reste dans le champ avec **Non enregistré** et un bouton de nouvelle tentative. Si un autre MJ a modifié le même texte, un message demande de recharger sa valeur ; aucune saisie concurrente n’est écrasée silencieusement. « Abandonner la saisie non enregistrée » concerne uniquement le champ en cours, pas les modifications déjà enregistrées.

Les variables comme `{v0}` doivent rester dans les phrases concernées : elles représentent les nombres ou informations dynamiques affichés par le site. Les paragraphes ordinaires sont du texte simple, en conservant la structure de la page. Le lecteur de rituels conserve son rendu Markdown sécurisé. Aucun HTML exécutable n’est accepté.

## Couverture et droits

Le registre initial contient 2 539 entrées : interface, règlement, clans, disciplines et pouvoirs, rituels, actions de Vitae, création de personnage, textes Loup-Garou et messages applicatifs connus. Les entrées répétées d’un catalogue peuvent partager la même personnalisation ; les textes d’interface ont des clés propres à leur source. Les textes par défaut restent embarqués pour que les pages fonctionnent en cas d’indisponibilité du serveur.

- MJ Vampire : textes Vampire, accès depuis CAIN.
- MJ Loup-Garou : textes Loup-Garou, accès aussi depuis son administration.
- Fondateur : tous les modules et les textes communs.
- Joueur : lecture uniquement. Les autorisations sont vérifiées côté serveur à chaque écriture.

Les noms et récits saisis par les joueurs, les historiques de personnages et les données de Discord restent gérés par leurs formulaires habituels. Les messages techniques inattendus provenant d’un service externe n’appartiennent pas au registre. Les commandes et valeurs métier restent inchangées : renommer l’affichage d’un pouvoir ne change ni son ID, ni son coût, ni son déblocage. Les données historiques déjà enregistrées dans une fiche ne sont pas réécrites par cet éditeur. Le texte incorporé à une image et les écrans de Discord ne sont pas modifiés.

## Fonctionnement technique

- `data/site_content.json` est le registre commun au frontend et à l’API. Ses clés sont stables et ne doivent pas être renumérotées. Pour corriger une valeur par défaut, conserver la clé de l’entrée correspondante.
- `web/src/core/content/` contient le résolveur, les composants de texte, le chargement périodique et le panneau chargé à la demande. La migration instrumente les sources React ; elle ne modifie pas le DOM après rendu.
- Les catalogues de jeu restent intacts. `displayText` résout les valeurs uniquement aux emplacements d’affichage explicitement raccordés. La recherche du grimoire utilise les noms et descriptions personnalisés et renvoie les objets de jeu d’origine.
- `modules/content/api.py` gère la validation et la persistance dans la base SQLite existante. Deux tables additives stockent les valeurs courantes et les compteurs de révision. Les anciennes valeurs ne sont pas conservées. Les révisions servent uniquement à détecter un conflit et à éviter un retour à une valeur ancienne après une réponse réseau retardée.
- La base et les caches sont isolés par serveur Discord. Un changement de session ou de serveur vide les textes et les permissions en mémoire.
- Routes : `GET /api/content`, `GET /api/gm/content/catalog`, `PUT /api/gm/content/entries/{key}`. L’identité provient du middleware OAuth existant, jamais de l’auteur fourni dans le corps de la requête.

La lecture avant connexion utilise `GET /content/public`, qui ne retourne que les clés explicitement publiques. Avec un seul serveur Discord connu du bot, il est choisi automatiquement. Avec plusieurs serveurs, définir `CONTENT_SITE_GUILD_ID` pour choisir celui dont les textes publics doivent apparaître avant connexion ; sans ce réglage, les valeurs par défaut sont affichées. Les textes des personnages ne sont jamais inclus dans cet endpoint.

Déployer le frontend et le backend avec le même registre. Le démarrage crée les tables si nécessaire, sans modifier les tables de personnages. Sur Fly.io, la persistance utilise le chemin de base déjà configuré sur `/app/storage`. Les sauvegardes techniques existantes de la base comprennent ces tables ; aucun outil de restauration n’est ajouté au parcours MJ.

## Maintenance et vérification

Les outils `tools/migrate_site_content.cjs` et `tools/extract_content_errors.py` ont servi à préparer l’inventaire et la migration. Examiner leurs différences avant de les utiliser sur de nouveaux écrans : une chaîne fonctionnelle, un texte utilisateur et un libellé éditorial ne doivent pas être traités de la même façon. Pour les nouvelles interfaces, utiliser directement `SiteText` ou `siteText`, ajouter l’entrée au registre et raccorder les libellés de catalogue uniquement à l’affichage.

Validation réalisée le 28 septembre 2026 :

- Compilation Vite réussie. Avertissement de taille du bundle principal à surveiller ; l’interface d’édition elle-même est chargée à la demande.
- Suite frontend complète : 198 tests réussis et 5 échecs, plus un fichier de test qui référence une page absente. Une copie isolée de `HEAD` reproduit exactement ces échecs préexistants : tests Loup-Garou de routage/création/fiche et import de `RenownAdminPage`. Après les derniers ajustements, la suite ciblée de l’éditeur contient 9 tests, tous réussis, incluant les réponses réseau retardées et le changement de serveur.
- 29 tests Python réussis : nouvelle API de textes, validation des textes d’origine et suite de sécurité/disponibilité Vampire. Bases temporaires exclusivement.
- Analyse ESLint sans erreur sur `web/src/core/content/`.
- Vérification navigateur locale sur 1 440 × 1 000 et 390 × 844 : enregistrement automatique simulé, mise à jour du titre dans la page, absence de débordement horizontal et d’erreur JavaScript. Les écritures réelles et leurs autorisations sont vérifiées séparément par les tests d’API.

La validation locale ne constitue pas un déploiement ni un essai sur les données de production.
