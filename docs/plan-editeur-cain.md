# Plan d’implémentation — Éditeur de textes CAIN

Date : 28 septembre 2026. Plan initial, simplifié selon les instructions utilisateur. L’implémentation locale et sa validation sont décrites dans [le guide de l’éditeur CAIN](editeur-cain.md), qui précise les choix finalement retenus.

## 1. Objectif et périmètre

Permettre au MJ de réécrire les textes du site depuis le mode CAIN. Chaque modification est enregistrée automatiquement et devient directement effective pour les joueurs, sans modifier le code ni redéployer le frontend.

Décision utilisateur : aucun brouillon privé, aucune étape de publication, aucun historique éditorial et aucune fonction de restauration. La base ne conserve que la valeur courante de chaque texte personnalisé.

Le périmètre cible comprend Vampire, les éléments communs et Loup-Garou. La première livraison fonctionnelle portera sur Vampire, point d’entrée actuel de CAIN. La couverture totale ne sera annoncée qu’après migration et recette de tous les écrans.

Par « textes », on entend les titres, paragraphes, règles rédigées, noms affichés des pouvoirs et clans, descriptions, étapes de rituels, menus, boutons, aides, infobulles, placeholders, libellés accessibles, confirmations et messages d’erreur applicatifs. Les textes des écrans de connexion et d’accès refusé font partie de l’inventaire.

Les valeurs des personnages, récits des joueurs, noms Discord et historiques de jeu restent des données propres à leurs auteurs, gérées par leurs formulaires actuels. Leurs libellés d’interface deviennent éditables. Les valeurs calculées, coûts numériques, seuils, permissions, commandes et identifiants techniques restent pilotés par le moteur de jeu. Les textes intégrés à des images nécessitent un remplacement d’image : les recenser explicitement s’il en existe. Les écrans appartenant à Discord ou au navigateur ne sont pas contrôlés par le site.

## 2. Constat dans le code

| Zone inspectée | Constat | Conséquence pour le chantier |
|---|---|---|
| `web/src/modules/vampire/pages/SheetPage.jsx` | 1 165 lignes ; état local `isCainMode`, bouton conditionné par `vampireProfile.is_gm`, navigation vers le tableau de bord | Introduire un état d’édition indépendant du personnage/PNJ et de la vue CAIN. Éviter d’alourdir encore ce composant. |
| `web/src/core/components/GmDashboard.jsx` | Tableau de bord principalement consacré aux PNJ | Ajouter une entrée « Éditer les textes du site ». |
| `web/src/modules/vampire/components/RulesTab.jsx` | 360 lignes mêlant textes, balisage, tableaux et navigation | Extraire des blocs éditoriaux sans perdre les interactions ni la structure. |
| `web/src/data/disciplines.js`, `rituals.js`, `clanDescriptions.js`, `originQuestions.js` | Catalogues contenant des textes et parfois des champs fonctionnels | Appliquer uniquement des surcharges aux champs éditoriaux autorisés. |
| `web/src/data/bloodActions.js` | Importe `data/blood_actions.json`, également utilisé côté Python | Ne pas réécrire ce catalogue métier depuis l’éditeur. Ajouter une couche d’affichage distincte. |
| Grimoire : store, lecteur et recherche | Objets sélectionnés conservés en mémoire, recherche sur `name`, `discipline`, `description_md` | Recalculer les données affichées et l’index après changement de version ; résoudre la sélection par ID. |
| `utils/api_auth.py`, `api_server.py` | Authentification OAuth côté serveur, identité vérifiée et contrôle MJ existant | Réutiliser cette base ; une variable React n’accorde aucun droit d’écriture. |
| `utils/database.py`, `fly.toml` | SQLite et montage de stockage `/app/storage` configurés | Stocker les textes dans la base persistante, vérifier la configuration effective au déploiement. |
| `tools/backup_game.py` | Sauvegarde SQLite cohérente et vérification d’intégrité | Inclure les nouvelles tables dans les exercices de sauvegarde/restauration. |
| `web/src/App.jsx`, `AppRouter.jsx`, composants et API | Textes dispersés, y compris hors des écrans de jeu | Un simple éditeur du règlement ne satisfait pas la demande globale. |

Ce relevé est une analyse statique ciblée, pas un audit exhaustif de sécurité ni une validation de la production. Aucun test d’exécution n’a été lancé pour cette étape de planification.

## 3. Parcours MJ proposé

1. Ouvrir CAIN puis « Éditer les textes du site ».
2. Choisir une page dans un catalogue ou activer le repérage des textes sur la page courante.
3. Sélectionner un texte : un panneau affiche son emplacement et sa valeur actuelle.
4. Modifier le texte. Les textes longs disposent d’un Markdown limité : paragraphes, emphase, listes et liens autorisés.
5. L’enregistrement automatique remplace directement la valeur courante côté serveur après une courte pause de saisie, par exemple 600 ms. Aucun bouton de publication ni confirmation supplémentaire.

L’interface distingue clairement « enregistrement en cours », « enregistré » et « échec ». Seule la réponse positive du serveur permet d’afficher « enregistré ». Une modification refusée reste dans le champ pour pouvoir être corrigée ou réessayée, sans être présentée comme appliquée.

Le bandeau d’édition indique le serveur concerné et l’état de l’enregistrement. La navigation reste utilisable ; la sélection d’un bouton à éditer ne déclenche pas son action métier. Clavier et mobile doivent être pris en charge. Le catalogue permet aussi d’atteindre les erreurs, modales et états rarement visibles, sans provoquer de vraies actions de jeu.

Prévoir une alerte uniquement avant de quitter avec un enregistrement en attente ou en échec. Les commandes de sortie et d’accès à l’éditeur conservent des libellés techniques de secours pour qu’une mauvaise personnalisation ne rende pas l’administration inutilisable.

## 4. Architecture recommandée

### Registre de textes versionné

Créer un registre de définitions partagé entre la validation serveur et le frontend. Chaque entrée contient une clé stable, un texte par défaut, une section, un type (`plain`, `markdown`, `template`), une longueur maximale, les variables autorisées et sa visibilité (`public`, membre, MJ).

Exemples : `vampire.rules.header.title`, `vampire.rituals.blood_walk.description`, `common.actions.save`. Ne jamais utiliser le texte lui-même ou sa position dans le DOM comme identifiant. Pour les pouvoirs sans ID propre, ajouter un identifiant éditorial stable avant migration ; ne pas dépendre de l’index du tableau.

Les listes de paragraphes et étapes ont des identifiants stables. Les tableaux interactifs restent structurés et leurs cellules textuelles sont éditables ; on ne transforme pas une page interactive entière en un seul champ Markdown.

Résolution d’un texte : valeur courante du périmètre concerné → texte par défaut embarqué si aucune personnalisation n’existe. Distinguer explicitement une valeur vide autorisée de l’absence de surcharge. Une clé supprimée ou renommée passe par une migration, jamais par une perte silencieuse de contenu. La version du registre décrit son schéma technique ; elle ne constitue pas un historique des textes.

### Frontend

Créer `web/src/core/content/` pour le chargement, la résolution, le contexte d’édition et le rendu sécurisé. Prévoir un hook `useContent()` pour les chaînes et un composant `EditableText` pour le repérage contextuel. Les attributs comme `title`, `placeholder` et `aria-label` passent aussi par le résolveur et sont modifiables dans le catalogue.

Créer une interface dédiée, par exemple `web/src/core/components/content-editor/`, au lieu d’intégrer toute la logique à `SheetPage.jsx`. Charger l’éditeur uniquement pour les utilisateurs autorisés. Charger les textes par namespace et par version, sans requête réseau par composant.

Les adaptateurs des catalogues fusionnent les surcharges d’affichage avec les données d’origine sans modifier les imports globaux. IDs, niveaux, prérequis, clés de clans et montants restent inchangés. Le nom traduit d’une discipline ne remplace jamais sa clé métier. La recherche et les cartes utilisent les mêmes données résolues que le lecteur détaillé.

Pour les phrases contenant des valeurs, utiliser des variables validées, par exemple « Coût : {cost} Vitae ». Interdire la suppression ou l’ajout de variables incompatibles et toute exécution de code. Une réécriture narrative ne modifie pas les règles calculées ; montrer au MJ les valeurs métier associées lorsqu’il édite une explication de règle.

### Persistance et enregistrement direct

Utiliser SQLite via `aiosqlite`, avec des migrations additives et un module dédié, par exemple `modules/content/`. Éviter d’ajouter tous les traitements dans `api_server.py` : ce fichier enregistre les nouvelles routes.

Modèle proposé :

- `content_scopes` : serveur/périmètre, version du registre et compteur de révision courant pour actualiser les caches.
- `content_entries` : périmètre, clé, valeur courante, révision du champ, dernier auteur et date de dernière modification. Une seule ligne par périmètre et clé, mise à jour sur place.

Chaque écriture indique la révision attendue du champ. Si un autre MJ a modifié ce même champ entre-temps, réponse `409` et message permettant de recharger sa valeur actuelle, sans écrasement silencieux. Les modifications de champs distincts ne se bloquent pas. Dans une transaction, valider la valeur, remplacer le champ et incrémenter les compteurs courants. Ces compteurs ne conservent aucune ancienne valeur et ne permettent pas de restauration.

Sérialiser les enregistrements automatiques par champ et regrouper les frappes en attente afin qu’une requête ancienne ne remplace pas une saisie plus récente. Limiter la taille des requêtes et des champs. Aucun stockage de brouillons, de copies de publications ou d’historique éditorial n’est nécessaire.

### API et droits

Contrat indicatif à finaliser au lot 1 :

| Route | Usage | Accès |
|---|---|---|
| `GET /api/content` | Textes courants, namespace et révision | Membre autorisé du serveur ; filtrage par visibilité |
| `GET /api/gm/content/catalog` | Définitions et textes d’origine | Éditeur autorisé |
| `PUT /api/gm/content/entries/{key}` | Remplacement immédiat du texte avec révision attendue | Éditeur autorisé |

Le serveur déduit l’auteur de `verified_user_id` et le serveur Discord de `verified_guild_id`. Il vérifie les droits à chaque opération, y compris chaque enregistrement automatique. Il refuse les clés inconnues et les propriétés métier même si une requête est forgée.

Pour Vampire, conserver la politique existante MJ Vampire/Fondateur. Pour Loup-Garou, utiliser une permission éditoriale correspondant au rôle MJ concerné ; les textes communs et publics sont réservés au Fondateur par défaut. Cette séparation doit être exposée dans le catalogue, sans donner implicitement au MJ Vampire le contrôle d’un autre module.

### Textes avant connexion et erreurs

Le middleware actuel exige une session pour les routes `/api/` : le chargement avant connexion doit donc être traité explicitement. Prévoir un endpoint de lecture publique distinct, ne retournant que les clés marquées publiques. Les pages publiques utilisent un périmètre de site configuré côté serveur, pas un `guild_id` arbitraire fourni par un visiteur. En contexte multi-serveur, seuls les textes propres au site sont disponibles avant sélection/authentification.

Les messages d’erreur API doivent progressivement exposer un code stable et des paramètres contrôlés. Le frontend traduit ce code via le registre. Ne pas rendre éditables ni afficher les traces techniques brutes ; une erreur inconnue utilise un message générique. Une erreur réseau ou de chargement du registre conserve toujours un texte embarqué de secours.

### Rendu, disponibilité et mises à jour

Rendre les chaînes en texte échappé. Réutiliser les dépendances Markdown et de nettoyage déjà présentes avec une politique explicite : aucun HTML arbitraire, script, iframe ou lien à schéma dangereux. La validation serveur complète la protection du rendu. Les liens externes et les textes accessibles passent aussi par la validation.

Après chaque enregistrement, la nouvelle valeur est immédiatement effective côté serveur et appliquée dans la session du MJ. Les autres clients la récupèrent au chargement, au retour au premier plan et par une vérification légère toutes les 5 secondes lorsque la page est visible. Ils voient ainsi les changements sans rechargement manuel, avec un délai de propagation explicite pouvant atteindre environ 5 secondes hors latence réseau. Le compteur de révision permet d’éviter les téléchargements inutiles et d’invalider la recherche. Les caches sont séparés par serveur et par visibilité, puis vidés au changement de session.

En cas d’indisponibilité, afficher les dernières valeurs chargées, ou les valeurs embarquées en dernier recours, avec un indicateur de contenu potentiellement ancien. Ne pas confondre cet état avec un enregistrement réussi. Une saisie non enregistrée reste uniquement dans le champ de l’éditeur ; elle ne constitue pas un brouillon sauvegardé.

## 5. Lots d’implémentation et critères de sortie

| Lot | Livrable | Critère de sortie |
|---|---|---|
| 0 — Inventaire | Matrice page/état/source/clé/type/permission ; inventaire des textes d’API et des valeurs dynamiques ; baseline de tests | Chaque zone est recensée, y compris mobile, modales, connexion, erreurs et modules communs. |
| 1 — Socle | Registre partagé, migration SQLite, routes, droits et remplacement direct des textes | Un MJ autorisé peut modifier un texte via l’API ; la lecture suivante retourne la nouvelle valeur ; un joueur ne peut pas écrire. |
| 2 — Parcours pilote | Entrée CAIN, catalogue, panneau et enregistrement automatique du règlement Vampire | Une modification du MJ apparaît dans une session joueur sans action supplémentaire, puis persiste après rechargement. |
| 3 — Couverture Vampire | Clans, disciplines, rituels, Vitae, fiches, goules, création, PNJ et interface Vampire | Renommer un pouvoir se répercute sur carte, détail et recherche, sans modifier les permissions ou règles de jeu. |
| 4 — Couverture complète | Écrans communs/publics, Loup-Garou, messages d’API et états rares | Matrice intégralement traitée ; chaque exception restante est explicitement justifiée. |
| 5 — Mise en service | Recette, migration sur copie de base, sauvegarde technique existante, déploiement progressif et documentation MJ | Textes conservés après redémarrage/déploiement ; enregistrement et propagation vérifiés. |

Les lots dépendent du précédent. Le lot 2 constitue un premier résultat utilisable ; il ne constitue pas la fin du chantier. Garder chaque lot dans une modification relisible avec tests ciblés. Éviter une réécriture globale des composants et des règles pendant cette migration.

Charge indicative de planification révisée : 1–2 jours pour l’inventaire, 2–3 pour le socle, 2–3 pour le pilote, 4–7 pour Vampire, 4–7 pour les autres zones et 2–3 pour la recette/mise en service. Total : 15–25 jours-personne, à réestimer après l’inventaire ; ce n’est ni une mesure issue d’une implémentation, ni une promesse de délai. La suppression du circuit éditorial allège le socle et l’interface ; la migration des textes reste le principal travail.

## 6. Validation attendue

- Autorisation : visiteur, joueur, MJ du bon/mauvais module, Fondateur, session expirée, rôle retiré, identité et serveur usurpés. Refus serveur indépendant de la présence du bouton CAIN.
- Contenu : valeurs par défaut, texte vide autorisé, accents, longues chaînes, variables conservées, listes, tableaux, liens, clés inconnues et entrées de type HTML/script.
- Isolation : absence de fuite entre serveurs, réponse publique strictement limitée aux clés publiques.
- Concurrence : deux MJ modifient le même champ, détection de conflit, saisie rapide avec réseau lent, réponses retardées et transaction interrompue ; aucune ancienne requête ne remplace une saisie plus récente.
- Métier : IDs de rituels/clans et déblocages identiques avant/après édition ; recherche cohérente avec les nouveaux noms ; aucune mutation des montants ou seuils.
- Interface : clavier, mobile, lecteur d’écran, textes longs, contrôle de navigation, enregistrement automatique, échec d’enregistrement, déconnexion et perte réseau ; propagation dans une session joueur déjà ouverte.
- Exploitation : installation sur base existante, inclusion des tables dans la sauvegarde technique existante, redémarrage et nouvelle version applicative sans perte des textes ; compatibilité des anciennes clés avec les nouvelles définitions.

Utiliser Vitest/Testing Library pour résolution et interface, pytest pour routes et transactions. Ajouter des scénarios de bout en bout sur les parcours critiques si l’outillage est introduit ; sinon documenter une recette manuelle reproductible avec comptes de test. Un contrôle statique peut repérer des chaînes non migrées, mais ne remplace pas la matrice de couverture et la recette visuelle.

## 7. Principaux risques et mesures

| Risque | Mesure |
|---|---|
| Édition perdue au prochain déploiement | Surcharges en base persistante, migration de clés et sauvegarde technique existante. |
| Altération accidentelle des règles | Champs éditoriaux autorisés explicitement, variables pour les valeurs calculées, tests d’invariance métier. |
| Texte expliquant une règle devenu inexact | Afficher les données métier associées dans l’éditeur et valider les variables lors de l’enregistrement. |
| Modification d’un texte qui casse un identifiant | Clés stables, séparation nom affiché/ID, suppression des comparaisons métier sur libellés modifiables pendant la migration. |
| Fonctionnalité prétendument globale mais incomplète | Inventaire des états rares et des textes serveur, suivi de couverture par lot. |
| Injection de contenu actif | Markdown restreint, rendu nettoyé, validation des liens et variables côté serveur et client. |
| Écrasement du travail d’un autre MJ | Contrôle de révision par champ et conflit explicite. |
| Éditeur inaccessible après une mauvaise modification | Commandes d’accès et de sortie stables pour pouvoir corriger directement le texte. |
| Incohérence avec les messages Discord | Périmètre initial limité à l’affichage du site ; une personnalisation ne change pas les messages du bot. Une unification ultérieure nécessite un chantier explicite. |
| Régression lors de l’extraction des textes | Migration progressive, conservation du balisage fonctionnel, tests ciblés et recette visuelle. |

## 8. Décision technique proposée

Construire un éditeur direct dans l’architecture existante : React pour l’édition et l’enregistrement automatique, API Python pour les droits et les mises à jour, SQLite pour la valeur courante. Le premier jalon à implémenter est un règlement Vampire dont chaque modification enregistrée devient directement visible par les joueurs. Étendre ensuite ce mécanisme jusqu’à couvrir la totalité de l’inventaire.

Les sauvegardes techniques de la base, déjà présentes dans le projet, restent une responsabilité d’exploitation ; elles n’ajoutent aucun historique, bouton de restauration ou étape supplémentaire au parcours MJ.

La difficulté principale est la migration fiable et complète des textes, davantage que le formulaire de saisie. Un remplacement automatique du DOM ou un simple `contentEditable` persistant dans le navigateur ne répondrait pas aux exigences de partage, de sécurité, de stabilité et de maintenance.
