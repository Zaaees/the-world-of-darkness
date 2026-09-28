**Audit global — préparation au lancement du RP Vampire**

26 septembre 2026. Périmètre : site Vampire, règles et contenus associés, API, bot Discord, circulation des données et travail du MJ.

**Verdict : une base jouable et évocatrice existe, mais je déconseille une ouverture générale en l’état.** Le blocage principal est la confiance accordée aux identifiants transmis à l’API. Avant une première chronique, il faut également lever les contradictions de règles et vérifier réellement la chaîne de sauvegarde et de validation. Une fois ces points traités, un petit pilote accompagné est préférable à l’ajout de nouvelles fonctionnalités.

Le projet a surtout besoin de rendre fiable le passage du personnage à la scène, puis de la scène à ses conséquences. Il possède déjà beaucoup de contenu.

**1. Méthode et domaines à examiner**

J’ai commencé par croiser des références de conception avec l’intention du projet : un arbitre narratif sans dés, associé au RP écrit sur Discord. Le présent audit ne cherche donc pas à transformer le site en jeu vidéo, ni à imposer une conformité stricte à V5 ou V20.

| Domaine | Angle d’analyse | Question de lancement |
|---|---|---|
| Accueil et création | Joueur novice, charge de lecture, choix réversibles | Puis-je comprendre le jeu, créer un personnage et savoir quoi faire ensuite ? |
| Narration | Désirs, relations, dilemmes, conséquences | Le site me donne-t-il des raisons de jouer avec les autres ? |
| Game design | Liberté d’action, arbitrage, ressources, progression | Deux joueurs peuvent-ils comprendre la même règle et accepter son résultat ? |
| Ergonomie | Tâches fréquentes, erreurs, continuité site/Discord | Puis-je consulter une règle et revenir à ma scène sans perdre mon travail ? |
| Accessibilité | Clavier, formulaires, mobile, lecture | Puis-je utiliser les fonctions essentielles sans souris et sur petit écran ? |
| Fiabilité | Persistance, synchronisation, pannes partielles | Une action annoncée comme sauvegardée est-elle conservée et correctement publiée ? |
| Maîtrise et communauté | Charge MJ, validation, conflits, rythme asynchrone | Le serveur reste-t-il gérable quand plusieurs scènes avancent en parallèle ? |
| Sécurité et exploitation | Identité, permissions, sauvegardes, déploiement | Les personnages, récompenses et fonctions MJ sont-ils protégés ? |

Les [heuristiques de Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/) ont servi à examiner la compréhension des états, la prévention des erreurs et la récupération. Les [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/) fournissent les critères de contrôle clavier, d’étiquetage et de lisibilité ; cet audit n’est pas une certification d’accessibilité.

Pour le jeu d’horreur, les ressources officielles [World of Darkness — Free Content](https://www.paradoxinteractive.com/games/world-of-darkness/community/free-content) et [Consent in Gaming](https://www.montecookgames.com/store/product/consent-in-gaming/) aident à distinguer les contraintes subies par le personnage de l’accord des participants. L’[OWASP API Security](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) sert de référence pour les droits sur les objets manipulés.

**Ce qui a été vérifié.** Lecture du code et des contenus actuels, compilation, tests automatisés existants, contrôle isolé de l’authentification, inspection du site publié et aperçu local de composants réels avec données fictives. L’aperçu local désactivait tous les appels API ; création de clan, règles, disciplines et fiche ont pu être examinées sans écrire sur le serveur. Vérifications visuelles avec des fenêtres cibles de 390 × 844 et 1440 × 900.

**Limites.** Une fiche connectée a été visible sur le site publié, puis la navigation s’est retrouvée sur l’écran de connexion ; je n’en déduis pas un défaut certain d’OAuth. Le parcours authentifié complet n’est pas validé. Aucune action RP, récompense, publication Discord ou création de personnage réel n’a été effectuée. Le script Apps Script déployé, les permissions effectives des salons, les backups et les chroniques privées n’ont pas été inspectés. Les constats locaux ne prouvent pas que chaque version déployée est identique.

**2. Ce qui mérite d’être conservé**

- **Une identité visuelle cohérente.** Papier, archives, sang et lieux nocturnes créent une atmosphère reconnaissable. La fiche ressemble à un document de personnage plutôt qu’à un tableau administratif.
- **Une bonne séparation générale des outils.** Fiche, Vitae, Disciplines, Goules et Grimoire répondent à des besoins distincts.
- **Un catalogue de progression substantiel.** Le fichier partagé contient 104 actions, dont 90 voies couvrant 18 clans/lignées. Les pistes orientent vers des réalisations concrètes ; ce sont de bons générateurs de scènes.
- **Une progression qui conserve les excédents.** Les tests couvrent les seuils, les aliases et le report des points. Le bot recalcule la récompense lors de l’enregistrement : il ne se contente pas du montant envoyé par le navigateur sur ce chemin.
- **Une place réelle laissée à la découverte.** Les rituels des joueurs passent par l’apprentissage et l’attribution MJ ; une commande Discord existe pour les accorder.
- **Des efforts d’accessibilité déjà présents.** Focus visuel, réduction des animations, fenêtres de pouvoirs avec rôle de dialogue et fermeture par Échap. La fenêtre de pouvoir observée sur mobile tient dans la largeur et reste lisible.

La bonne direction consiste à consolider ces atouts et à rendre la première soirée plus facile à lancer.

**3. Points à régler avant l’ouverture**

Les priorités ci-dessous désignent l’ordre de traitement : P0 avant ouverture générale, P1 avant usage du parcours concerné, P2 pendant ou après le pilote. Les appréciations narratives sont des propositions de conception ; les bugs reproductibles sont identifiés comme tels.

**P0 — L’API n’authentifie pas réellement l’identité annoncée.**

La fonction `verify_vampire_auth` accepte deux en-têtes numériques et les retourne sans vérifier de jeton. J’ai exécuté cette fonction isolément, avec les identifiants fictifs 123 et 456 et sans jeton : elle accepte le couple. Ce contrôle n’a contacté aucun service et n’a lu aucune fiche réelle.

Le contrôle MJ vérifie ensuite les rôles du membre désigné par cette identité, ce qui ne prouve pas que l’appelant est ce membre. Conséquence : les protections de fiche, de goules et de PNJ reposent sur une identité déclarée par le client. CORS ne remplace pas l’authentification.

**Amélioration :** vérifier l’identité côté serveur à partir d’une session ou d’un jeton valide, dériver l’utilisateur de cette preuve, puis contrôler rôle, serveur et propriété de chaque ressource. Tester explicitement le refus d’un identifiant falsifié, d’un joueur sans rôle et d’un accès interserveur.

Preuve : [authentification API](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/api_server.py:120>).

**P0 conditionnel — Le chemin Google Sheets doit recevoir la même protection.**

Le navigateur appelle directement Apps Script avec `userId`, y compris pour sauvegarder et soumettre une action. La copie locale expose aussi la suppression et le marquage des demandes sans contrôle d’identité visible. Son en-tête recommande un déploiement accessible à tout le monde.

Je n’ai pas vérifié que cette copie est celle actuellement déployée. **Si elle l’est, corriger seulement l’API Python laisserait un accès parallèle non protégé.**

**Amélioration :** faire passer les écritures par le serveur authentifié, limiter les champs modifiables et réserver les opérations internes au bot. Préférer POST aux écritures encodées dans des URLs GET. Vérifier la version du script en production.

Preuves : [contrat Apps Script](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/docs/google-apps-script.js:29>), [sauvegarde du joueur](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/SheetPage.jsx:536>).

**P1 — Les règles de résistance mentale se contredisent.**

Le règlement affirme une immunité absolue contre un attaquant moins puissant, puis donne des exemples où ce même défenseur supérieur doit payer davantage pour résister. Il décrit aussi la résistance contre un rang égal ou inférieur, alors que la note finale parle du jeune vampire soumis à un Ancien.

Il ne s’agit pas d’un simple problème de vocabulaire : deux joueurs peuvent en tirer des résultats opposés.

**Amélioration :** choisir une règle et publier une table couvrant attaquant inférieur, égal et supérieur, avec le coût et les issues possibles. Par exemple, si l’intention est l’immunité du supérieur : défenseur supérieur = aucun coût ; égal = coût de base ; inférieur = règle spécifique explicitée. Ce choix appartient au design du serveur.

Ajouter les limites de durée, de portée et d’autorité sur les actes d’un autre PJ. Une contrainte sur le personnage ne doit pas laisser entendre que son joueur perd toute possibilité d’arbitrage HRP.

Preuve : [résistance mentale](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/RulesTab.jsx:258>).

**P1 — Le rafraîchissement du joueur peut modifier les données d’un PNJ en cours d’édition.**

Le rafraîchissement lit le personnage du compte connecté toutes les dix secondes et remplace sa puissance, ses points et potentiellement son clan dans l’état `character`. Rectification lors de la relecture du 27 septembre : une garde `if (npcCharacter) return` existait, mais `npcCharacter` manquait aux dépendances de l’effet. Le minuteur pouvait donc conserver l’ancienne valeur du mode et une réponse déjà lancée pouvait arriver après le changement de personnage. L’autosauvegarde, elle, écrit cet état dans le PNJ sélectionné.

**Scénario à reproduire en recette :** un MJ possédant un PJ de rang 1 ouvre un PNJ de rang 4 ; la lecture du PJ peut ramener l’état du PNJ au rang 1, puis l’autosauvegarde le persister. C’est un risque identifié par le chemin de code, non une corruption provoquée pendant cet audit.

**Amélioration :** séparer les états PJ/PNJ, suspendre la synchronisation PJ pendant l’édition PNJ et tester ce scénario avec des données isolées.

Preuves : [sauvegarde PNJ](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/SheetPage.jsx:491>), [rafraîchissement du PJ](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/SheetPage.jsx:575>).

**P1 — « Sauvegardé » ne garantit pas que la fiche soit publiée sur Discord.**

L’API enregistre d’abord la fiche puis tente la publication Discord. Le gestionnaire peut retourner `None` si le salon est introuvable ou si une erreur survient, alors que la réponse finale reste un succès. L’interface promet pourtant une publication automatique.

**Amélioration :** distinguer « fiche enregistrée », « publication Discord réussie » et « publication à réessayer ». Conserver une tâche de reprise et éviter de dupliquer les posts. Tester un refus de permission Discord après une sauvegarde réussie.

Preuves : [sauvegarde et publication](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/api_server.py:553>), [gestionnaire Discord](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/utils/sheet_manager.py:49>).

**4. Narration : passer d’un personnage documenté à un personnage qui a quelque chose à faire**

**L’accueil ne conduit pas encore suffisamment vers une première scène.** Le site explique surtout comment gérer son personnage. Je n’ai pas trouvé, dans le parcours Vampire examiné, un dispositif aussi clair pour répondre à : « Où commence-t-on ? Qui peut jouer avec moi ? Quelle situation m’attend ? ». Des réponses peuvent exister dans Discord, mais elles ne sont pas reliées explicitement ici.

Proposition prioritaire : un bloc « Votre première nuit » avec le lieu d’accueil, le salon utile, un contact MJ et trois accroches ouvertes. Exemple : obtenir l’autorisation de chasser, retrouver une personne liée à son passé, répondre à une dette du Sire. Pour chaque accroche : un interlocuteur, un obstacle, un choix et une conséquence possible.

**Les origines sont parfois trop dirigistes.** Les questions imposent fréquemment un événement violent déjà accompli, une réaction spécifique ou une ancienneté. Le questionnaire Ventrue présuppose par exemple un acte à l’aube du siècle précédent ; celui du Toreador évoque les Années Folles. Cela gêne un personnage récemment étreint.

Proposition : conserver la couleur du clan, mais proposer trois portes d’entrée : événement suggéré, variante plus intime, réponse libre. Remplacer l’obligation d’avoir déjà vécu un fait précis par une question sur une tension actuelle. Un Brujah peut vouloir résister à une injustice sans être forcé d’avoir déjà déclenché une scène de rage à l’Élyséum.

Il existe aussi un décalage éditorial : l’éditeur de fiche relabellise les trois réponses « Première Nuit », « La Bête », « Lien à l’Humanité », alors que les questions propres à chaque clan ne correspondent pas systématiquement à ces thèmes. Afficher les questions réellement posées.

Preuves : [questions d’origine](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/assets/starter_pack_data.json:115>), [restitution des réponses](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/CharacterSheet.jsx:394>).

**La corruption est très présente ; ce que l’on risque de perdre l’est moins.** La fiche développe la mentalité avant/après et l’histoire, mais ne structure pas directement désir actuel, attachement humain, limite personnelle et lien à un autre PJ.

Proposition légère : quatre champs narratifs, sans jauge supplémentaire : « ce que je veux maintenant », « qui je refuse de perdre », « ce que je ne veux pas devenir », « à qui je dois quelque chose ». Ils créent des prises pour les scènes et donnent un sens à la prédation.

**La ville a une atmosphère, mais chaque lieu doit aussi offrir du jeu.** Le guide de la Périphérie fournit des décors concrets. Pour les lieux d’ouverture, ajouter seulement : qui le contrôle, ce qui y manque, une rumeur et un conflit en cours. Une friche devient jouable quand elle est à la fois un refuge possible, une ressource disputée et un problème pour quelqu’un.

Une petite chronique de départ peut tenir sur une page : un domaine, trois PNJ, deux tensions, un événement imminent et les raisons de s’impliquer. Ce contenu compte davantage au lancement qu’un nouveau catalogue.

**5. Game design : rendre les choix et les conséquences prévisibles**

**Clarifier le contrat des pouvoirs.** Les descriptions sont évocatrices, mais certaines formulations absolues peuvent être prises comme des garanties de victoire. « Tu esquives un coup que tu n’avais même pas vu venir » ne précise pas les limites face à un autre vampire. L’aide définit aussi une scène comme « le temps du combat », trop restrictive pour du RP social.

Ajouter à chaque pouvoir sensible un court bloc : effet permis, limites, cible, durée, possibilité de résistance et conséquence pour la Mascarade. Définir une scène comme une unité de situation narrative, avec début et fin convenus, qu’elle contienne un combat ou non. Aucun système de dés n’est nécessaire.

Preuves : [durée des pouvoirs](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/DisciplinesTab.jsx:256>), [description de Célérité](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/data/disciplines.js:183>).

**Rendre la prédation cohérente entre règles et boutons.** Le règlement impose une chasse jouée et létale sous 40 % de réserve. Le bot déclenche son état maximal de frénésie à zéro ; le bouton de nourriture remet directement la réserve au maximum. Cela peut être un choix d’auto-déclaration, mais il faut distinguer clairement « chasse dangereuse », « compulsion » et « frénésie », ainsi que le moment où l’on peut cliquer.

La dépense accepte également une quantité supérieure au disponible et ramène simplement la réserve à zéro. Cela ne lance pas automatiquement un pouvoir, mais laisse ambigu le statut d’une action que le joueur ne pouvait pas payer.

**Amélioration :** une table commune des états avec exemples aux bornes, et une règle explicite sur les dépenses impossibles. Préciser ce qu’une chasse restaure, quand une ellipse est autorisée et quelles conséquences suivent un meurtre. Pour un rang 1, deux dépenses de 2 sur une réserve de 5 laissent 20 % : la cadence de chasse doit être testée en situation.

Preuves : [alimentation](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/RulesTab.jsx:321>), [états du panneau](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/modules/vampire/views/panel.py:275>), [bornes de dépense](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/utils/database.py:1534>).

**Conserver la progression par accomplissements, mais mieux la documenter.** La proposition v2 demande explicitement des récompenses cumulables sans plafond ni délai ; il serait contre-productif de réintroduire ces restrictions par réflexe. Les véritables garde-fous sont l’obstacle réel, le résultat distinct et la contribution substantielle.

Les seuils cumulés représentent 460 points du rang 1 au rang 5. À titre d’illustration uniquement, une moyenne de 5 à 10 points par scène récompensée représenterait 92 à 46 scènes. Ce n’est pas une prédiction : les récompenses varient et plusieurs résultats peuvent se cumuler. Le pilote doit mesurer la cadence réelle.

L’échec et les dilemmes peuvent produire des conséquences, relations ou découvertes sans donner automatiquement des points. Éviter que toute scène intéressante soit réduite à une quête rentable.

**Distinguer puissance, âge et statut social.** La proposition v2 le dit, mais l’écran attribue automatiquement des rangs comme « Ancien » ou « Sommité », tandis que le règlement nomme le niveau 5 « Mathusalem ». Harmoniser les intitulés et préciser qu’un gain mécanique ne confère pas automatiquement un siècle d’histoire ni une autorité politique.

Preuves : [intention de progression](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/docs/proposition_progression_vitae_v2.md:5>), [présentation des rangs](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/SheetPage.jsx:38>).

**Encadrer les conflits de domaine et le jeu entre PJ.** Revendiquer un lieu par tag est simple ; résoudre deux revendications incompatibles ne l’est pas. Il faut préciser la contestation, l’absence d’un propriétaire, l’intervention MJ et la différence entre possession revendiquée et reconnue.

Avant le pilote, écrire une page couvrant contrôle mental, chasse sur un PJ, mort définitive, atteinte aux proches, destruction d’un refuge et limites de contenu. Prévoir une pause ou une ellipse sans justification personnelle exigée. Ce cadre soutient l’horreur en évitant que le conflit fictif devienne une pression sur le participant.

Pour suivre une enquête ou une menace, un compteur narratif partagé peut suffire. Les [horloges de progression de Blades in the Dark](https://bladesinthedark.com/progress-clocks) offrent un exemple officiel de représentation d’un obstacle qui évolue ; leur adaptation ici resterait facultative, sans importer les dés ni tout le système.

**6. Ergonomie et accessibilité**

**P1 — Le bouton Retour efface le travail d’origine.** Reproduction locale : sélectionner Brujah, continuer, saisir une réponse, revenir puis continuer à nouveau ; les trois champs sont vides. La remise à zéro est explicite dans le code.

Conserver un brouillon par clan et prévenir avant de l’effacer. Même principe pour une fiche non enregistrée lors d’un changement d’onglet. Sur une interface où l’utilisateur rédige longtemps, la conservation du texte est une fonction essentielle.

Preuve : [retour destructif du brouillon](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/ClanSelectionPage.jsx:112>).

**P1 — Certaines actions essentielles restent dépendantes de la souris.** Les cartes de clan et de pouvoir sont des `div` cliquables sans sémantique de bouton ni activation clavier équivalente ; les cartes de rituel suivent le même schéma. Les champs d’origine sont présentés avec des paragraphes et trois placeholders identiques, sans association programmatique à leur question.

Utiliser des boutons ou des contrôles de sélection pour les clans, relier chaque champ à son libellé, puis parcourir la création et la consultation uniquement avec Tab, Entrée et Échap. Les bons comportements déjà observés dans la fenêtre de pouvoir sont à étendre à son déclencheur.

Preuves : [cartes de clan](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/ClanSelectionPage.jsx:157>), [cartes de pouvoir](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/DisciplinesTab.jsx:75>), [questionnaire](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/StarterPackStep.jsx:20>).

**P2 — Améliorer la hiérarchie sans retirer l’ambiance.** La création sur mobile demande beaucoup de défilement et certaines questions deviennent des colonnes étroites au milieu de marges imbriquées. Afficher « étape 1 sur 3 », raccourcir les consignes et réserver les longs exemples à une ouverture volontaire.

La fiche publique observée pouvait être largement vide alors qu’un bandeau global annonçait une sauvegarde. Ce n’est pas une preuve de perte de données, mais cela illustre un mauvais signal de préparation. Un état « fiche à compléter » doit aider à distinguer un personnage initialisé d’un personnage prêt à jouer.

**P2 — Séparer les mots employés.** « Vitae » désigne à la fois un onglet de progression et le sang dépensable. « Soif », « réserve », « points de sang », « PS » et « saturation » demandent au novice une traduction constante. Employer partout trois notions : réserve de sang, état de faim, progression de puissance. Donner accès au panneau Discord depuis l’endroit où l’on explique une dépense.

**7. Charge MJ, fiabilité et maintenance**

**P1 — Les demandes de récompense manquent de contexte.** La soumission transmet l’identité et l’action, mais aucun lien de scène, résumé d’obstacle ou résultat revendiqué. Le bot ajoute la description du catalogue, pas celle de ce qui a réellement été joué.

Proposition minimale : lien Discord, obstacle, résultat, participants et éventuelle demande liée. Le MJ doit pouvoir vérifier le non-double-compte sans rechercher tout le RP. Les retours au joueur doivent différencier « reçu », « transmis au MJ », « informations manquantes », « accepté » et « refusé avec motif ».

Le pipeline comporte en outre plusieurs étapes : Apps Script, base locale, message Discord, marquage de traitement. Une erreur après création locale doit pouvoir reprendre l’envoi ; la présence d’une demande en base ne doit pas bloquer indéfiniment sa transmission. Ce scénario de panne reste à tester.

Preuves : [soumission web](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/pages/SheetPage.jsx:637>), [traitement par le bot](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/cogs/blood_actions.py:70>).

**P1 pour ce clan — Les goules Salubri n’ont pas de discipline définie dans l’écran.** Salubri est proposé à la création, mais absent de la table locale de disciplines des goules. Le tirage se fait alors sur une liste vide et le pouvoir de secours est « Pouvoir Inconnu ».

Plus généralement, l’écran conserve ses goules via l’état du personnage et Apps Script, alors qu’une API de goules séparée existe. Il faut identifier la source réellement utilisée et éviter deux registres divergents. Le formulaire ne matérialise pas non plus les trois nuits prescrites par les règles : préciser si le MJ valide cette condition ou si le joueur l’atteste.

Preuve : [création des goules](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/components/GhoulsTab.jsx:14>).

**P2 — Le lecteur de rituels contient un hook conditionnel.** `useReducedMotion` est appelé après un retour anticipé quand aucun rituel n’est sélectionné. Le lint signale cette violation. Les tests actuels rendent les états séparément et ne suffisent pas à valider les transitions.

Déplacer le hook avant ce retour et tester les transitions vide → rituel → vide. Aucun crash de ce lecteur n’a été reproduit dans le navigateur pendant cet audit.

Preuve : [lecteur de rituels](<F:/Dossiers Utilisateur/Desktop/World of Darkness Code - BMAT/web/src/modules/vampire/features/rituals/components/RitualReader.jsx:25>).

**P1 de préparation opérationnelle — Vérifier la restauration, pas seulement le stockage.** Le projet utilise SQLite, Google Sheets et Discord ; le volume Fly persistant est configuré, mais je n’ai pas trouvé de procédure de restauration validée dans les fichiers examinés. La persistance d’un volume n’est pas une preuve de sauvegarde récupérable.

Avant lancement : exporter les données, restaurer dans un environnement isolé et retrouver une fiche, une réserve, des rituels et une demande en attente. Documenter également quoi faire quand le bot, Sheets ou Discord est indisponible.

**Tests et preuves d’exécution**

| Vérification | Résultat | Portée |
|---|---|---|
| Build Vite de production | Réussi, 20,50 s | Le site se compile ; ne prouve pas la chaîne distante |
| Tests web complets | 187 réussis, 5 échoués ; 32 fichiers réussis, 4 échoués | Les échecs sont dans Werewolf, dont une suite qui ne se charge pas |
| Sous-ensemble Vampire + données disciplines/rituels + ATDD disciplines | 119 tests réussis dans 17 fichiers | Beaucoup de tests de composants ; pas une recette RP complète |
| Catalogue Python | 4 tests réussis | Couverture des clans, aliases, seuils, excédents, actions retirées |
| ESLint | 81 erreurs et 15 avertissements | Mélange de configuration, nettoyage et défauts significatifs |
| Contrôle d’identité isolé | Deux IDs fictifs acceptés sans jeton | Confirme la faiblesse de la fonction locale |
| Brouillon d’origine | Perte reproduite après Retour | Bug utilisateur confirmé |
| Fenêtre de discipline sur mobile | Lisible, fermeture Échap vérifiée | Vérification ponctuelle, pas certification mobile globale |

Les premiers lancements de Vite/Vitest ont été bloqués par les permissions d’exécution du bac à sable ; les relances autorisées ont permis d’obtenir les résultats ci-dessus. Ces refus initiaux ne sont pas des bugs du projet. Le workflow de déploiement web construit le site, mais ne lance actuellement ni tests ni lint.

**8. Ordre de travail recommandé**

| Lot | Actions | Condition pour passer à la suite |
|---|---|---|
| 1 — Protéger les personnages | Authentification serveur et Apps Script ; séparation PJ/PNJ ; sauvegarde/publication explicites | Aucun accès usurpé ; aucune modification croisée ; une panne ne se présente pas comme un succès complet |
| 2 — Fixer le contrat de jeu | Résistance mentale, dépenses, chasse, durée des pouvoirs, conflits PJ/domaines | Deux personnes arrivent au même résultat sur les exemples de référence |
| 3 — Faciliter l’entrée en RP | Brouillons conservés, choix clavier, première nuit guidée, accroches et liens entre PJ | Un novice rejoint une scène avec un personnage utilisable |
| 4 — Pilote accompagné | Trois à cinq joueurs, plusieurs scènes et une validation MJ complète | Aucun incident bloquant ; charge MJ et cadence de progression observables |
| 5 — Amélioration continue | Navigation, terminologie, harmonisation éditoriale, petits outils de suivi | Priorités déterminées par les usages du pilote |

Aucun plafond temporel de progression ni refonte esthétique complète n’est nécessaire pour exécuter ce plan.

**Recette de lancement proposée**

- Un nouveau joueur choisit son clan, rédige une origine, revient en arrière sans la perdre, puis retrouve sa fiche après reconnexion.
- Une personne sans rôle voit une explication exploitable ; une API indisponible n’est pas présentée comme une absence de rôle.
- Un personnage utilise un pouvoir : coût, limites, résistance et fin d’effet sont compris sans interprétations incompatibles.
- Une chasse est jouée avec les conséquences convenues ; les seuils de faim correspondent aux règles affichées.
- Une demande comporte la scène ; le MJ accepte ou refuse ; le résultat est reçu une seule fois et les excédents sont conservés.
- Un rituel attribué par le MJ apparaît dans le bon grimoire et persiste après reconnexion.
- Une goule reçoit un pouvoir valide pour chacun des clans autorisés, y compris Salubri.
- Un MJ consulte ou modifie un PNJ sans y importer les données de son PJ.
- Une panne de Discord préserve la fiche et affiche l’échec de publication ; la reprise ne crée pas de doublon.
- Une restauration isolée récupère les données ; la création et la consultation restent utilisables au clavier et sur mobile.

Mesurer pendant le pilote : délai entre inscription et première scène, demandes nécessitant une clarification, temps MJ par validation, points par accomplissement et par scène, conflits de règles et pertes de texte. Ces observations permettront de décider des améliorations suivantes sans multiplier les fonctionnalités à l’aveugle.

**Décision proposée : préparer un pilote après correction des accès et des règles contradictoires, puis ouvrir progressivement.** La matière narrative et visuelle est suffisante pour commencer. Ce qui manque surtout est un contrat de jeu clair, un parcours de première scène et une chaîne de données dont les joueurs et le MJ peuvent comprendre l’état.

