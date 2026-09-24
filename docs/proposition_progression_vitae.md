# Proposition de progression de la Vitae pour le RP long

> **Version remplacée le 24 septembre 2026.** Consulter la [version 2](proposition_progression_vitae_v2.md), qui conserve les actions à valeurs différentes, autorise leur cumul et supprime les plafonds et restrictions temporelles proposés ici. Ce document est conservé uniquement comme historique ; ses règles ne sont plus la proposition recommandée.

Document de conception — 23 septembre 2026. Proposition uniquement : les règles et le code du serveur ne sont pas modifiés.

**Recommandation centrale : récompenser une expérience vampirique qui transforme une relation, une pratique ou un engagement, avec un rythme commun à tous les clans.** Une action spectaculaire ne doit pas rapporter davantage simplement parce qu'elle est violente, rare ou dépendante d'un événement MJ.

## 1. Périmètre et distinction indispensable

Dans le projet, « Vitae » recouvre deux mécanismes : la réserve consommable utilisée pour les pouvoirs, et la progression permanente de Puissance du Sang par points de saturation. Cette proposition concerne la seconde. Boire peut remplir la réserve sans donner de progression permanente.

Le catalogue réel contient 18 clans ou lignées jouables dans `data/clans.py`, plus Caïn réservé au MJ. Le document traite les 18, avec les adaptations Giovanni/Hecata et Séthites/Ministère. Il ne transforme pas Caïn en parcours de progression. Les Caitiff et Sang-Clair ne sont pas ajoutés au périmètre puisqu'ils ne figurent pas dans ce catalogue.

Le projet mélange des éléments de plusieurs éditions : Puissance du Sang et résonances proches de V5, Giovanni et lignées historiques, disciplines et malédictions issues d'autres versions. Je conserve ce cadre hybride, sans imposer une conversion intégrale.

En V5, la Puissance du Sang peut croître par expérience, âge et diablerie, dans les limites de la génération ; la torpeur prolongée peut la diminuer. Ce n'est pas une jauge officielle alimentée automatiquement par des actions de clan. Le barème ci-dessous est donc une **règle maison de progression narrative**, pas une restitution des règles officielles. Voir la [synthèse Blood Potency, avec références au jeu](https://whitewolf.fandom.com/wiki/Blood_Potency_(VTM)).

Conséquences pour le serveur :

- Une progression par RP peut représenter l'expérience et l'éveil du potentiel du sang, sans ellipse temporelle.
- Le niveau ne doit pas automatiquement conférer un âge, un titre politique ou une perte d'humanité.
- Si la génération est effectivement gérée, ses limites doivent être précisées séparément. Sinon, présenter les cinq niveaux comme l'échelle propre au serveur.
- Un personnage puissant peut conserver des attaches humaines. Un personnage débutant peut être atroce. La Bête ne disparaît pas au niveau 5.
- Les actions proposées ne donnent jamais une discipline, une immunité ou un pouvoir absent de la fiche.

## 2. Analyse du catalogue actuel

Les valeurs suivantes viennent de `data/blood_actions.py`. Leurs défauts ne sont pas seulement numériques : plusieurs récompensent un résultat trop vague, un comportement répétable sans enjeu ou l'accès privilégié au MJ.

| Action actuelle | Problème | Remplacement proposé |
|---|---|---|
| Première frénésie, 5 | Encourage à déclencher volontairement une crise pour obtenir une prime. | Jouer une confrontation avec la Bête et une conséquence ; résister et céder sont deux issues possibles au même tarif. |
| Premier meurtre, 8 | Rend le meurtre plus rentable que la retenue ; dicte une trajectoire morale. | « Décider du sort d'une proie » : tuer, épargner ou interrompre la chasse peuvent qualifier selon le coût réellement joué. |
| Première exposition solaire, 6 | Encourage une prise de risque artificielle et dépend de la clémence du MJ. | Survivre à une vulnérabilité vampirique déjà présente dans l'intrigue, puis modifier une pratique. |
| Premier lien de sang, 4 | Récompense l'asservissement en soi et peut se cumuler avec une goule. | Négocier ou subir une relation de dépendance, puis en jouer une obligation concrète. |
| Revoir un proche, 5, limité aux niveaux 1–3 | Une visite sans enjeu suffit ; la limite présume que les puissants sont détachés de l'humanité. | Une attache humaine menacée par la condition vampirique, accessible à tous les niveaux. |
| Première goule, 4 | Favorise les personnages qui recrutent ; risque de double récompense avec le lien. | Prendre une décision face à l'autonomie, au besoin ou à la dépendance d'un serviteur. |
| Posséder trois goules, 5 | Récompense un inventaire, favorise richesse et accumulation de PNJ. | Résoudre une responsabilité envers un seul dépendant suffit. |
| Accepter le monstre, 6 | Formulation invérifiable et voie morale obligatoire. | Définir, défendre ou abandonner une limite quand elle coûte réellement quelque chose. |
| Action de clan, 4 | Même prix pour un rituel routinier et une révolte ; un stéréotype par clan. | Plusieurs dilemmes par niveau, même unité de validation pour tous. |
| Quatre résonances, 1–2 | Permet une rotation de chasses et la fabrication opportuniste d'émotions. | Une scène de chasse avec choix et conséquence ; la résonance colore la scène sans ajouter de points. |
| Dyscrasie, 3–5 | Sa rareté dépend du narrateur ; peut pousser à surenchérir sur les émotions des victimes. | Élément exceptionnel d'une chasse ou d'un apprentissage, sans prime de saturation autonome. |
| Boire un vampire, 4 par mois | Deux partenaires peuvent organiser un échange mensuel rentable. | Traiter confiance, faim et dette ; boire seul ne valide rien. |
| Vider un vampire supérieur, 8 | Confusion entre vider, tuer et absorber l'âme ; impose une proie rare. | Retirer du catalogue normal. Un conflit éventuel relève des jalons communs. |
| Vaulderie, 5 par mois | Rituel de secte présenté comme accessible à tous ; rendez-vous mécanique rentable. | Si le contexte Sabbat le permet, jouer une obligation de meute ; pas de prime à la participation rituelle. |
| Diablerie, 25 par mois | Représente 83 % du premier seuil de 30 ; encourage la chasse aux personnages et peut cumuler plusieurs catégories. | Intrigue exceptionnelle avec règles dédiées ; aucun bouton mensuel et aucun cumul automatique de saturation. |
| Sang de Mathusalem, 15 | Dépend d'un PNJ exceptionnel ; « impossible à tuer » est une formulation absolue à retirer. | Supprimer de la progression courante ; conserver comme élément d'intrigue exceptionnel. |
| Sang d'un vampire en Wassail, 10 | Transforme des adversaires spécifiques en ressources de progression. | Le statut de la victime ne donne pas de prime. |
| Frôler la Mort Finale, 2–5 | Risque de provoquer des dangers ; la récompense baisse alors que le danger reste majeur. | Même tarif qu'un dilemme social substantiel, avec conséquence identifiable. |
| Résister à la frénésie, 2–3 | « À BP 5, la Bête est domptée » est une prémisse à supprimer. | Accessible à tout niveau, selon la situation ; aucune immunité obtenue par progression. |
| Céder à la frénésie, 4 | Plus rentable que résister aux premiers niveaux. | Même tarif et mêmes exigences que la résistance. |
| Survivre au pieu ou au soleil, 12 | Réunit deux situations différentes et double potentiellement une crise déjà récompensée. | Un seul jalon pour l'ensemble de l'événement. |
| Entrer/sortir de torpeur, 10 + 3 | Boucle de récompense, problème d'ellipse publique, sens inverse de la torpeur longue en V5. | Aucune récompense pour l'entrée ou le réveil ; seules les conséquences jouées peuvent constituer un jalon ordinaire. |

Un pieu dans le cœur paralyse normalement le vampire ; ce n'est pas automatiquement une Mort Finale. La diablerie implique l'absorption de l'âme : vider la réserve ne suffit pas à la définir. Références secondaires : [Mort Finale](https://whitewolf.fandom.com/wiki/Final_Death), [Diablerie](https://whitewolf.fandom.com/wiki/Diablerie_(VTM)).

**La difficulté d'accès ne se corrige pas en donnant davantage de points.** Une scène dépendante d'un Mathusalem restera moins accessible qu'une conversation, même avec une grosse prime. Le catalogue doit d'abord donner à chaque personnage des occasions comparables.

## 3. Un barème commun, suffisamment lent

### Unité de validation

Un **jalon** vaut **1 point de maturation** — nom proposé pour les points de saturation. Il demande trois éléments visibles :

1. Une tension liée à la condition vampirique : faim, secret, Bête, malédiction, dépendance, mortalité ou héritage du sang.
2. Un choix entre au moins deux options crédibles, ou une réaction jouée face à une contrainte réelle. Une victoire n'est pas obligatoire.
3. Une conséquence identifiable : dette reconnue, accès abandonné, confiance modifiée, méthode revue et appliquée, engagement accepté ou perte réellement actée.

Une conversation calme peut réunir les trois. Un combat très long peut n'en réunir aucun. Il n'y a ni quota de mots, ni minimum de messages, ni prime à la durée, à la qualité littéraire ou au nombre de participants.

Une complication de faible ampleur suffit : devoir un service à un interlocuteur vaut mieux, pour ce système, qu'exiger la perte d'un domaine. Le personnage ne doit pas constamment échouer ou se sacrifier pour progresser ; une obligation réellement assumée après un succès constitue aussi une conséquence.

### Limites proposées

- **1 jalon par personnage et par scène**, toutes catégories confondues.
- **Un bonus de conclusion de +1**, au maximum une fois par période de 28 jours, pour un fil narratif réparti sur au moins deux scènes distinctes où une conséquence antérieure est effectivement résolue ou mise à l'épreuve. Il n'est pas obligatoire de réussir.
- **Maximum 2 points sur la scène de conclusion** : son jalon normal et ce bonus. Aucun troisième point pour le même dénouement.
- **Maximum 6 points par personnage sur une période fixe de 28 jours**, bonus compris. Périodes communes au serveur, sans remise à zéro lors d'une montée de niveau.
- Les points d'une scène appartiennent à la période de sa clôture effective. Un retard du MJ ne les déplace pas vers une autre période. Un lot de validations doit être recalculé chronologiquement.
- Pas de report du plafond inutilisé, de crédits d'absence, de gain passif, ni de conservation de scènes excédentaires pour les réclamer plus tard.
- Pas de second jalon pour répéter le même événement, même si son nom, son salon ou sa catégorie changent. Une nouvelle scène avec le même partenaire reste admissible si la situation évolue vraiment.

Une scène est une unité dramatique autour d'un enjeu. Changer de salon ou couper le RP en trois messages de clôture ne crée pas trois scènes. Une scène étalée sur quinze jours reste une scène. À l'inverse, une nouvelle décision avec un nouvel enjeu peut former une nouvelle scène dans le même lieu.

Le plafond constitue une limite, pas un objectif de présence. On ne demande pas six scènes à chacun. Une période fixe facilite la gestion, mais permet deux lots rapprochés de part et d'autre de sa frontière : c'est un compromis assumé, pas une cadence quotidienne garantie.

### Seuils et rythme

Les seuils ci-dessous sont des coûts **par passage**, pas des totaux cumulés. Garder les seuils actuels de 30/60/120/250 avec de petits gains rendrait les derniers niveaux extrêmement lents.

| Niveau actuel | Orientation narrative | Coût vers le suivant | À 2 points / 28 j | À 4 points / 28 j | À 6 points / 28 j |
|---|---|---:|---:|---:|---:|
| 1 | Découvrir sa condition | 12 | 6 périodes | 3 périodes | 2 périodes |
| 2 | Construire ses habitudes et ses dettes | 18 | 9 périodes | 5 périodes | 3 périodes |
| 3 | Assumer les contradictions de ses habitudes | 24 | 12 périodes | 6 périodes | 4 périodes |
| 4 | Mettre son pouvoir à l'épreuve de ses limites | 30 | 15 périodes | 8 périodes | 5 périodes |
| 5 | Entretenir un héritage vivant et contestable | Aucun niveau 6 | Progression narrative | Progression narrative | Progression narrative |

Calcul : arrondi supérieur du coût divisé par le gain périodique. Les lignes sont indépendantes. Avec report des points au franchissement, le total 1 → 5 coûte **84 points** : 42 périodes à 2 points, 21 à 4, 14 à 6. Cela représente approximativement 39, 19 et 13 mois de périodes de jeu. Ce sont des trajectoires théoriques, pas des durées minimales exactes depuis la création du personnage : date d'entrée, frontière des périodes et disponibilité des scènes les modifient.

À une scène qualifiante par période et sans bonus, le parcours demande 84 périodes, soit plus de six ans. Il faut le dire clairement : ce réglage ne convient pas à un serveur où presque tout le monde ne termine qu'une scène par mois. Dans ce cas, baisser les coûts après observation est préférable à multiplier les primes ou à payer des messages intermédiaires. Le réglage recommandé suppose environ **deux à quatre jalons mensuels pour un personnage régulier** ; ce rythme réel reste à mesurer.

Sur chaque passage, demander au moins **un jalon lié à l'héritage du clan et un jalon commun**. Il ne s'agit pas de réussir une entrée précise du catalogue. Un équivalent adapté au personnage suffit. Deux scènes sont nécessaires pour ces deux validations : pas de double compte de la même scène. Aucun quota de violence, d'humanité perdue, de titre ou de partenaire différent.

Au seuil, la transformation du sang peut être décrite dans la clôture ou l'ouverture d'une scène ordinaire. Elle ne nécessite ni ellipse, ni cérémonie rare, ni rendez-vous exceptionnel. Les points excédentaires passent au niveau suivant ; les prérequis narratifs du nouveau niveau doivent néanmoins y être joués.

Au niveau 5, les entrées restent des propositions de RP, **sans nouveaux points ni bonus de réserve ou de puissance**. Elles produisent uniquement leurs conséquences fictionnelles ordinaires, selon les règles habituelles du serveur. On ne crée pas une monnaie cachée qui contournerait le plafond.

## 4. Catalogue commun à tous les clans

Toutes les entrées valent 1 point aux niveaux 1–4 si les trois critères sont réunis. Elles valent 0 point au niveau 5. Les niveaux décrivent un angle conseillé, pas une interdiction de jouer des enjeux plus simples en étant puissant.

| Famille | Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4 | Niveau 5 |
|---|---|---|---|---|---|
| Chasse et faim | Une interruption oblige à choisir entre faim et discrétion ; jouer le choix. | Un accès habituel au sang devient conditionnel ; négocier ou renoncer. | Une proie ou un intermédiaire conteste les habitudes établies ; modifier un accord. | Deux obligations rendent la méthode habituelle intenable ; choisir une limite et l'appliquer. | Transmettre une pratique à un autre vampire, puis accepter qu'il refuse une partie du modèle. |
| Bête et vulnérabilité | Identifier en situation un déclencheur et réagir à son effet. | Tenir ou rompre une précaution convenue devant une provocation réelle. | Jouer l'après-crise avec une personne affectée, qu'il y ait eu résistance ou frénésie. | Un adversaire connaît la faille ; choisir entre dissimulation, aide ou concession. | Reconnaître devant un allié une vulnérabilité que la puissance n'a pas effacée. |
| Mascarade | Un témoin remarque une incohérence ; lui répondre et assumer sa réaction. | Protéger sa couverture exige une dette ou l'abandon d'un confort. | Deux versions précédentes deviennent incompatibles ; décider qui mettre dans la confidence. | Protéger un autre expose son propre réseau ; négocier une répartition du risque. | Préparer une relève de couverture et accepter qu'elle ne dépende plus entièrement de soi. |
| Attaches et dépendances | Un proche, une proie ou un allié demande une présence difficile à fournir. | Un serviteur ou un contact pose une condition nouvelle. | Un personnage réclame son autonomie malgré le besoin que le vampire a de lui. | Deux engagements légitimes entrent en conflit ; un interlocuteur voit le prix du choix. | Revoir une dépendance ancienne sans effacer les décisions de l'autre personnage. |
| Héritage et apprentissage | Mettre à l'épreuve une consigne du sire dans une situation réelle. | Appliquer un enseignement qui exige de changer une habitude. | Constater une limite de cet enseignement et tester une adaptation. | Défendre ou contester une transmission face à quelqu'un qui en subit les effets. | Laisser un successeur reprendre, détourner ou refuser un enseignement. |

**Non admissible seul :** se nourrir, utiliser une discipline, réciter une théorie, remplir un journal, décrire une émotion, remporter un duel ou assister à une réunion. Ces éléments deviennent admissibles lorsqu'ils portent le choix et la conséquence d'un jalon.

**Échec admissible :** un Nosferatu échoue à préserver son anonymat, mais doit négocier avec le témoin désormais informé. **Échec non suffisant :** le joueur annonce simplement que sa tentative rate et ferme la scène sans effet observable.

## 5. Actions propres aux clans et lignées, niveau par niveau

Les propositions ci-dessous sont originales et destinées au serveur. Les fondements des clans principaux s'appuient sur la [présentation officielle de World of Darkness](https://www.paradoxinteractive.com/games/world-of-darkness/discover-world-of-darkness/vampire-the-masquerade/clans). Les actions, conditions et coûts ne sont pas des prescriptions officielles.

**Mode d'emploi commun :** chaque ligne fournit une action, une alternative qui évite d'enfermer le personnage et une preuve de conséquence. Le joueur choisit une voie ou propose un équivalent. Les alternatives ne se cumulent pas. Toutes les lignes 1–4 valent 1 point, celles du niveau 5 valent 0. Le bonus de conclusion, s'il s'applique, reste soumis à la règle commune. Aucune ligne ne demande plusieurs années, un pouvoir absent ou un événement global.

### Brujah — une conviction confrontée à la colère

Le défaut du « poing levé » est de compter pareil une phrase contestataire et une insurrection. Pour ce parcours, le cœur du personnage est la tension entre ce qu'il défend et la manière dont sa colère affecte ceux qu'il prétend défendre. Une cause réactionnaire ou personnelle peut aussi produire ce conflit : aucun alignement politique n'est imposé.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Le prix de la contradiction.** Contester une exigence qui touche à sa conviction ; ou accepter une concession en expliquant la limite qu'on refuse de franchir. | L'interlocuteur oppose un coût crédible et le personnage le traite : faveur perdue, promesse ou accès compromis. |
| 2 | **Protéger sans confisquer.** Soutenir quelqu'un qui demande une aide différente de celle qu'on voulait imposer ; ou assumer d'avoir ignoré sa demande. | La personne protégée exprime son choix et la relation est redéfinie. |
| 3 | **Le camp qui déçoit.** Confronter un allié dont la méthode trahit une conviction partagée ; ou rester à ses côtés à une condition concrète. | Une obligation, une rupture ou une concession engage les deux parties. |
| 4 | **La colère utile.** Face à une provocation visant à saboter un accord, choisir l'affrontement ou la retenue. | Jouer l'effet sur cet accord ; ni gagner ni rester calme ne suffisent seuls. |
| 5 | **L'héritier qui contredit.** Laisser un protégé contester sa doctrine et décider quelle place lui conserver. | Une responsabilité est réellement partagée, reprise ou abandonnée. |

Accessibilité : un débat avec un allié suffit. Pas besoin de manifestation publique, de combat ou d'une victoire contre une autorité.

### Gangrel — survivre sans faire de l'autonomie une prison

« Survivre seul en milieu hostile » pénalise le RP partagé et pousse à inventer des périls. Ici, le Gangrel explore sa relation au refuge, à l'instinct et à la confiance. Une friche urbaine ou un toit est aussi jouable qu'une forêt.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Trouver sa place.** Négocier un abri nocturne malgré une habitude bestiale ; ou renoncer à cet abri pour éviter d'y attirer un danger. | Jouer un nouvel arrangement ou une solution de repli avec un interlocuteur. |
| 2 | **Partager la piste.** Guider quelqu'un vers un refuge en adaptant le trajet à ses limites ; ou accepter d'être guidé. | Une préférence personnelle est abandonnée et un engagement réciproque est établi. |
| 3 | **Le territoire habité.** Découvrir qu'un lieu utilisé comme terrain de chasse compte aussi pour quelqu'un d'autre. | Négocier un usage, déplacer une chasse ou défendre une exclusion et subir sa contestation. |
| 4 | **Revenir vers la meute.** Demander de l'aide lorsque l'autosuffisance menace un lien ; ou assumer une séparation plutôt que simuler la confiance. | La demande ou la rupture change concrètement la coopération. |
| 5 | **Le refuge transmis.** Confier à un autre l'accès ou la surveillance d'un lieu. | Accepter ses décisions lors d'une difficulté réelle, sans reprendre automatiquement tout contrôle. |

Accessibilité : aucune attaque de Garou, survie solaire ou exploration solitaire n'est nécessaire. Les traits animaux restent ceux effectivement retenus par le serveur.

### Malkavien — une perception singulière qui rencontre la contradiction

Exiger une vision vraie rend la progression dépendante de révélations du MJ. Ce parcours récompense la confrontation d'une interprétation aux faits et aux autres, sans rendre toute intuition exacte. Le trouble du personnage ne doit pas devenir une suite de comportements aléatoires obligatoires.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Donner forme au pressentiment.** Traduire une perception troublante en une hypothèse compréhensible ; ou demander à quelqu'un de la vérifier. | L'autre peut contredire l'hypothèse et une décision tient compte de sa réponse. |
| 2 | **Le point d'ancrage.** Convenez d'un moyen de vérifier une perception lors d'un échange difficile. | Utiliser ce moyen en scène, puis accepter ou contester son résultat avec un effet sur la confiance. |
| 3 | **L'erreur qui demeure.** Reconnaître qu'une interprétation antérieure a nui ; ou défendre une lecture encore incertaine sans la présenter comme un fait. | Réparer un effet, concéder une vérification ou accepter la méfiance obtenue. |
| 4 | **Qui porte la vérité ?** Décider quoi transmettre d'un indice établi mais personnellement déstabilisant. | Quelqu'un reçoit une information exploitable, ou le silence entraîne une obligation assumée. |
| 5 | **Être entendu sans être oracle.** Aider un interlocuteur à examiner un problème tout en acceptant qu'il refuse son interprétation. | Sa décision propre reste effective et la relation évolue. |

Accessibilité : partir d'éléments déjà présents dans la scène. Aucune révélation secrète, lecture de pensées ou prédiction n'est accordée gratuitement.

### Nosferatu — savoir, exposition et réciprocité

« Révéler une information qui change la donne » favorise les détenteurs de secrets majeurs. Un secret local suffit si son usage engage le personnage. L'intérêt spécifique est le prix de l'information lorsque se rendre visible coûte déjà beaucoup.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Être utile sans se livrer.** Fournir un renseignement limité tout en négociant son anonymat ; ou choisir de se montrer pour être cru. | Le destinataire formule une contrepartie ou une réserve qui modifie l'échange. |
| 2 | **Protéger la source.** Refuser de vendre un détail qui exposerait un informateur ; ou le vendre puis gérer la demande de protection. | Une dette, un accès perdu ou une responsabilité envers la source est jouée. |
| 3 | **Le secret des siens.** Traiter une information utile qui compromet un proche ou un refuge partagé. | Le personnage consulte, dissimule ou divulgue et affronte une réaction réelle. |
| 4 | **Savoir se taire.** Renoncer à un moyen de pression pour préserver une relation ; ou l'exercer en acceptant une rupture durable. | Le levier est effectivement abandonné ou ses conséquences commencent à s'appliquer. |
| 5 | **Un réseau qui répond.** Transmettre une source ou une méthode à quelqu'un qui en refuse les règles. | Renégocier un fonctionnement commun plutôt qu'obtenir une obéissance fictive. |

Accessibilité : horaires d'un refuge, identité d'un intermédiaire ou témoin gênant suffisent ; pas besoin d'un secret du Prince. Ne pas rendre chaque apparition automatiquement catastrophique.

### Toreador — attachement, regard et appropriation

Une « œuvre marquante » dépend trop du goût du validateur. L'œuvre peut être modeste ; la scène doit montrer ce que l'attachement du vampire lui fait demander, sacrifier ou déformer. Être collectionneur, mécène ou observateur fonctionne aussi.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **La beauté qui détourne.** Une fascination entre en conflit avec une obligation nocturne ; choisir laquelle suivre. | Quelqu'un subit le retard, le refus ou la renonciation et réagit. |
| 2 | **Une muse qui répond.** Un artiste ou un proche refuse l'image que le vampire projette sur lui. | Accepter sa limite, renégocier le lien ou imposer une emprise dont la conséquence est jouée. |
| 3 | **L'œuvre et le vivant.** Protéger une création ou son auteur lorsque les deux intérêts divergent. | Une ressource, une attribution ou une relation est effectivement engagée. |
| 4 | **Le goût qui n'est plus le sien.** Un protégé transforme une création ou un lieu précieux. | Soutenir, négocier ou combattre ce changement auprès de lui ; sa réponse compte. |
| 5 | **Laisser une trace imparfaite.** Transmettre une œuvre, une collection ou un projet sans en maîtriser toute la réception. | Jouer une interprétation qui déplaît au personnage et sa réponse. |

Accessibilité : une photographie, un vêtement, une chanson ou un souvenir suffisent. Aucun concert, chef-d'œuvre ou jugement esthétique du MJ n'est requis.

### Ventrue — autorité, dépendance et responsabilité

« Écraser un rival » confond leadership et domination sans coût. Ici, le Ventrue doit composer avec les conditions de son autorité, y compris ses besoins alimentaires lorsque la restriction de proie est utilisée.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Demander malgré le rang.** Obtenir l'accès à une proie compatible ou à un service nocturne auprès de quelqu'un qui pose une condition. | Accepter une dette, renoncer ou trouver une autre solution réellement jouée. |
| 2 | **La parole donnée.** Tenir une promesse devenue inconfortable ; ou annoncer qu'on la rompt. | Le bénéficiaire réagit et une obligation ou une perte de confiance est actée. |
| 3 | **La faute du responsable.** Un subordonné ou partenaire conteste une décision du personnage. | Prendre sa part, déléguer une réparation ou désigner un responsable en assumant le conflit. |
| 4 | **L'autorité limitée.** Confier une décision à quelqu'un qui choisit une option déplaisante. | Maintenir la délégation ou la retirer en payant le prix relationnel de ce retrait. |
| 5 | **Gouverner après soi.** Préparer une relève limitée : réunion, ressource ou petit réseau. | Le successeur prend une décision effective que le personnage doit traiter. |

Accessibilité : pas besoin d'entreprise, de fortune ou de charge politique. Le responsable d'un simple refuge partagé dispose des mêmes occasions.

### Tremere — connaissance, transmission et dépendance

Lancer un rituel « significatif » peut devenir une tâche de routine ou dépendre d'un pouvoir inaccessible. Le progrès proposé vient du rapport au savoir et aux détenteurs de ce savoir. L'appartenance à une Pyramide intacte n'est pas présumée.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Un savoir qui se paie.** Obtenir une explication ou une méthode connue auprès d'un interlocuteur exigeant une contrepartie. | Mettre l'enseignement en pratique ou refuser le prix et revoir son projet. |
| 2 | **L'hypothèse contrariée.** Utiliser un savoir ou rituel possédé sur une difficulté locale ; accepter qu'un résultat limite la théorie. | Réviser la méthode avec quelqu'un ou assumer l'effet d'un refus de révision. |
| 3 | **Partager sans posséder.** Transmettre un résultat utile malgré une exigence de secret ; ou retenir ce résultat et négocier une autre aide. | Une responsabilité, une dette ou une confiance modifiée en découle. |
| 4 | **L'autorité du maître.** Un enseignement transmis a une conséquence imprévue pour un élève ou partenaire. | Corriger, retirer ou défendre cet enseignement devant la personne concernée. |
| 5 | **Le savoir contestable.** Laisser un autre examiner une méthode que l'on contrôle. | Accepter une critique concrète ou en assumer le refus dans la relation. |

Accessibilité : un échantillon autorisé, un texte accessible ou un rituel déjà connu suffit. Pas d'invention de pouvoir, de découverte mondiale ou de bibliothèque privilégiée obligatoire.

### Lasombra — contrôle, épreuve et dépendance dissimulée

« Éliminer un obstacle par ambition » couvre presque n'importe quelle action. Ce parcours teste la capacité à supporter une perte de contrôle et à reconnaître le prix de ses méthodes. Il se distingue du Ventrue par l'épreuve des moyens et des dépendances, davantage que par la légitimité du commandement.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **L'intermédiaire indispensable.** Une faiblesse retenue pour la lignée rend une démarche difficile ; négocier l'aide d'un tiers. | L'aide crée une condition réelle, ou son refus oblige à changer de méthode. |
| 2 | **L'épreuve refusée.** Un allié refuse le test ou la méthode que le personnage voulait lui imposer. | Modifier l'épreuve, négocier ou perdre son concours ; ne pas déclarer sa soumission. |
| 3 | **Le moyen qui compromet.** Un succès local expose une méthode incompatible avec une alliance. | Avouer, dissimuler ou réparer auprès d'une personne effectivement concernée. |
| 4 | **Le contrôle abandonné.** Laisser un partenaire conduire une partie d'un plan dont dépend le personnage. | Traiter son initiative imprévue sans annuler rétrospectivement sa liberté. |
| 5 | **Survivre à son propre modèle.** Un protégé applique les méthodes du personnage contre ses intérêts. | Réviser une alliance ou une doctrine dans un échange effectif. |

Accessibilité : un intermédiaire pour un rendez-vous ou une négociation suffit. Les problèmes de reflet ou de technologie suivent la version choisie par le serveur ; aucune panne universelle n'est ajoutée.

### Tzimisce — possession, hospitalité et souveraineté du corps

« Modifier sa chair ou défendre son domaine » juxtapose un geste parfois routinier et un conflit territorial. Le parcours explore ce que le personnage appelle « sien » lorsque cela résiste. L'hospitalité offre une voie distincte de la chirurgie.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Le seuil et l'invité.** Accueillir quelqu'un qui conteste une règle du refuge ; ou demander l'hospitalité sous une règle déplaisante. | Une condition concrète de séjour est négociée et appliquée. |
| 2 | **La forme discutée.** Un bénéficiaire conteste une transformation envisagée ou déjà permise par les pouvoirs possédés ; ou un invité réclame de modifier une pièce. | Adapter, refuser ou imposer le projet en jouant sa conséquence relationnelle. |
| 3 | **Ce qui se dit possédé.** Un proche, un serviteur ou un partenaire refuse d'être traité comme une dépendance du domaine. | Redéfinir le lien, renoncer à une prérogative ou assumer le conflit. |
| 4 | **L'hospitalité coûteuse.** Une promesse d'accueil entre en conflit avec une autre obligation concrète. | Décider qui protéger ou repousser et traiter la réaction d'un interlocuteur lésé. |
| 5 | **Un domaine qui échappe.** Confier une règle d'un lieu ou un projet de transformation à un autre. | Accepter ou contester son évolution sans faire disparaître l'autonomie accordée. |

Accessibilité : une chambre ou un objet investi affectivement suffit. Aucun château, nouveau pouvoir de chair ou contrôle automatique d'un PJ n'est requis.

### Giovanni / Hecata — les obligations survivent aux morts

Le projet utilise Giovanni d'un côté et Hecata de l'autre. Ils ne sont pas de simples synonymes historiques : la proposition fournit un parcours commun adaptable à la famille Giovanni ou au cadre Hecata. L'intérêt est de faire entrer un mort ou son héritage dans les obligations des vivants ; réciter un rite ne suffit pas.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **L'objet laissé.** Récupérer un bien funéraire ou un souvenir dont quelqu'un conteste l'usage. | Négocier avec un vivant ; un fantôme n'est utilisé que si la fiction et les pouvoirs le permettent. |
| 2 | **La dette du défunt.** Un proche ou un esprit réclame un service lié à une ancienne obligation. | Accepter une tâche limitée, négocier son prix ou refuser et perdre une coopération. |
| 3 | **La vérité inconvenante.** Une information sur un mort nuit à la famille ou au client qui la demandait. | Choisir ce qui est transmis et affronter la réaction du destinataire. |
| 4 | **L'héritage partagé.** Deux intérêts incompatibles portent sur un bien, une sépulture ou une obligation. | Arbitrer ou négocier sans présumer la victoire ; une partie garde une revendication réelle. |
| 5 | **Ce qu'on laisse partir.** Renoncer à un levier sur un mort ou confier une obligation à un successeur. | Jouer la perte de contrôle avec les personnes concernées. |

Accessibilité : la voie par les vivants est toujours possible. Ni invocation autonome sans discipline, ni famille puissante disponible en permanence. La source officielle décrit les Hecata comme un ensemble de lignées nécromantiques ; les modalités précises restent celles du serveur.

### Séthites / Ministère — libération proclamée, emprise possible

« Répandre le vice » réduit le personnage à la corruption. Le parcours oppose ce qu'il promet de libérer et la dépendance qu'il peut construire. Une voie religieuse séthite peut donner un sens spirituel à ces choix, sans imposer cette croyance à tous les membres du Ministère.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **L'offre révélatrice.** Proposer une échappatoire à une contrainte exprimée par l'autre personnage. | Un prix ou une limite est discuté ; un refus peut qualifier si le personnage doit revoir son approche. |
| 2 | **La liberté conditionnelle.** Un bénéficiaire demande à recevoir l'aide sans accepter une dépendance. | Retirer la condition, la renégocier ou perdre ce lien en la maintenant. |
| 3 | **Le dogme chez soi.** Un interlocuteur retourne contre le personnage son propre discours de libération. | Réexaminer une règle personnelle ou assumer publiquement une contradiction auprès de lui. |
| 4 | **L'adepte qui s'en va.** Quelqu'un souhaite quitter une relation, un cercle ou une pratique établie. | Libérer, négocier ou retenir par les moyens autorisés, en jouant la conséquence de ce choix. |
| 5 | **L'enseignement retourné.** Un ancien bénéficiaire construit une voie qui s'oppose à celle du personnage. | Composer avec cette autonomie dans une relation effective. |

Accessibilité : une confession, une promesse ou un service suffit. Aucun culte de grande taille, acte sexuel, addiction ou corruption réussie n'est exigé.

### Banu Haqim — rendre un jugement sans confondre justice et appétit

Le contrat d'assassinat est une possibilité, pas une identité complète. Le parcours met à l'épreuve un code personnel face aux faits et aux intérêts du juge. Le sang vampirique peut être une tentation lorsque le cadre le prévoit, jamais une condition obligatoire de progression.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Entendre avant de trancher.** Examiner une accusation locale dont la version initiale est contestée. | Une réponse de l'intéressé ou un élément établi modifie, confirme avec coût, ou suspend le jugement. |
| 2 | **La sanction proportionnée.** Choisir entre restitution, service, exclusion ou autre réponse autorisée. | Présenter cette réponse à la personne concernée et jouer son accord ou son refus. |
| 3 | **Le proche mis en cause.** Appliquer son code à un allié ou reconnaître une exception intéressée. | Assumer la conséquence sur l'alliance et sur une personne lésée. |
| 4 | **La sentence révisée.** Un élément nouveau remet en cause une décision déjà jouée. | Réparer, rouvrir l'affaire ou maintenir le jugement et traiter sa contestation. |
| 5 | **Être jugé à son tour.** Soumettre une décision personnelle à la critique d'un pair ou d'une personne lésée. | Accepter une obligation ou expliquer un refus qui transforme le lien. |

Accessibilité : un prêt non rendu, une chasse contestée ou une promesse rompue suffisent. Pas besoin d'être shérif, guerrier ou assassin.

### Ravnos — détourner les attentes sans devenir une caricature

Cette lignée manque dans les actions spécifiques actuelles. Le parcours proposé porte sur la ruse, l'instabilité et la confiance. Il n'impose pas de vol compulsif ni de stéréotype ethnique. Les malédictions variant selon les éditions, aucun déplacement hors de la ville n'est exigé.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Le détour utile.** Employer une diversion crédible pour éviter une confrontation vampirique ; ou révéler une partie du stratagème à un allié. | La diversion crée une obligation, une méfiance ou un choix de route réellement joué. |
| 2 | **Le refuge emprunté.** Négocier un hébergement temporaire malgré une réputation ou une difficulté à rester. | Une condition d'accueil est mise à l'épreuve avec l'hôte. |
| 3 | **Le mensonge hérité.** Un ancien récit ou déguisement empêche désormais de tenir une promesse. | Corriger l'histoire, avouer ou prolonger la ruse en traitant son coût pour un proche. |
| 4 | **Rester lié en partant.** Transférer une obligation à un relais sans disparaître devant ceux qui comptaient sur soi. | Le relais peut refuser ; un accord ou une rupture est réellement joué. |
| 5 | **Une vérité à préserver.** Révéler une vérité personnelle à quelqu'un habitué à ses détours, ou choisir un mensonge dont on assume la distance créée. | La réaction de l'autre redéfinit le lien. |

Accessibilité : deux refuges dans la même ville suffisent pour une version itinérante. Les illusions n'existent que si les pouvoirs sont acquis ; une ruse ordinaire reste valable.

### Salubri — aider sans devenir une ressource possédée

Le parcours conserve la tension entre soin, vulnérabilité et persécution, sans transformer tous les Salubri en saints ni leur attribuer des miracles gratuits. L'assistance peut être pratique, protectrice ou relationnelle si aucun pouvoir de guérison approprié n'est possédé.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Aider en se cachant.** Assister quelqu'un alors que rester auprès de lui expose une particularité du personnage. | Négocier la discrétion, se retirer ou assumer une confidence réelle. |
| 2 | **Le refus du remède.** Un bénéficiaire refuse la forme d'aide proposée. | Adapter l'aide, respecter le refus ou imposer une intervention autorisée et affronter la réaction. |
| 3 | **La compassion sélective.** Un adversaire ou quelqu'un de déplaisant a besoin d'une assistance accessible. | Aider sous condition, refuser ou transmettre à un tiers ; la relation doit en porter la trace. |
| 4 | **Ne pas devenir indispensable.** Un proche attend du personnage une disponibilité qu'il ne peut plus maintenir. | Poser une limite ou partager la charge avec une obligation concrète. |
| 5 | **Transmettre sans sauver tout le monde.** Aider un autre à prendre une responsabilité de soin ou de protection. | Accepter sa méthode et ses limites, ou traiter ouvertement le désaccord. |

Accessibilité : aucun combat contre les Tremere, sacrifice final, Golconde ou guérison de l'âme n'est requis. Le troisième œil ne constitue pas une autorisation universelle de lire les autres.

### Gargouilles — être une personne au-delà de la fonction

La création servile et l'émancipation constituent un fondement de cette lignée ; toutes les Gargouilles ne restent pas esclaves. Voir la [synthèse historique des Gargouilles](https://whitewolf.fandom.com/wiki/Gargoyle_(VTM)). Le parcours oppose une mission de protection et la capacité à choisir ses propres engagements.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Une consigne négociée.** Demander le sens ou les limites d'une tâche de garde ; ou proposer une autre manière de la remplir. | Le donneur d'ordre répond et une condition de la mission change ou devient un conflit déclaré. |
| 2 | **Protéger sans retenir.** La personne protégée refuse une précaution. | Modifier la garde, respecter son choix ou imposer une restriction autorisée en assumant sa réaction. |
| 3 | **Deux loyautés.** Une mission contredit un engagement personnel déjà établi. | Choisir, négocier un relais ou refuser ; une partie concernée constate la décision. |
| 4 | **Choisir son service.** Renégocier un rôle dont dépend un refuge ou un allié. | Une responsabilité devient volontaire, conditionnelle ou transférée, sans libération mondiale obligatoire. |
| 5 | **La relève libre.** Apprendre à quelqu'un une tâche de protection sans exiger son obéissance. | Accepter une initiative différente dans une situation concrète. |

Accessibilité : un seul refuge et un interlocuteur suffisent. Pas besoin de rencontrer son créateur, de voler sans pouvoir approprié ou de déclencher une révolte.

### Samedi — la personne derrière le corps mort

Le projet retient une apparence décomposée héritée des versions anciennes. Les Samedi rattachés aux Hecata en V5 présentent des différences de malédiction et de disciplines : ne pas cumuler automatiquement toutes les versions. Voir [Samedi et différences d'édition](https://whitewolf.fandom.com/wiki/Samedi). Ce parcours travaille l'accès aux autres, la dignité et l'usage de l'effroi, distinctement des contrats avec les morts du parcours Giovanni.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Être reçu malgré le corps.** Chercher une interaction nécessaire dans un lieu où l'apparence ou la présence pose problème. | Négocier des conditions avec quelqu'un, ou renoncer et organiser une autre rencontre. |
| 2 | **La peur comme outil.** Choisir d'utiliser ou de contenir l'effroi que l'on inspire pour régler un problème. | Jouer l'effet sur une relation, au-delà de la simple description de dégoût. |
| 3 | **Le mort et les proches.** Un vivant conteste le traitement d'un corps, d'un souvenir ou d'un lieu funéraire. | Traiter sa revendication par un accord, un refus ou une réparation. |
| 4 | **Ne plus être l'instrument.** Un allié ne sollicite le personnage que pour intimider ou traiter les tâches macabres. | Renégocier ce rôle, le revendiquer à son prix ou rompre cette coopération. |
| 5 | **Une présence reconnue.** Confier un accès ou une responsabilité à quelqu'un qui voit au-delà du rôle macabre. | Jouer un désaccord réel sans réduire la relation à la peur. |

Accessibilité : aucune nécromancie ni pouvoir de putréfaction n'est présumé. Un local discret et un interlocuteur suffisent ; l'effroi n'est jamais dicté au joueur d'en face.

### Filles de la Cacophonie — voix, écoute et influence

La musique intérieure et la voix distinguent cette lignée ; voir [Daughters of Cacophony](https://whitewolf.fandom.com/wiki/Daughters_of_Cacophony). Le parcours se distingue des Toreador en examinant comment le personnage écoute et influence pendant l'échange, plutôt que la possession ou la réception d'une œuvre.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Entendre l'autre.** Lors d'un échange important, la préoccupation musicale du personnage perturbe son écoute. | Demander une reformulation, s'appuyer sur un partenaire ou assumer le malentendu et sa correction. |
| 2 | **La voix retenue.** Résoudre une tension alors qu'influencer par la voix serait tentant ; ou utiliser un pouvoir possédé et en traiter le prix relationnel. | L'interlocuteur répond selon les règles et une limite ou une obligation apparaît. |
| 3 | **L'auditeur qui résiste.** Quelqu'un refuse l'émotion ou l'interprétation que le personnage veut transmettre. | Modifier l'adresse, écouter le refus ou assumer une rupture ; la performance ne garantit aucun effet. |
| 4 | **Le silence coûteux.** Choisir de parler, chanter ou se taire quand sa voix peut compromettre une promesse. | Une personne concernée reçoit les conséquences de cette décision. |
| 5 | **Une autre voix.** Transmettre un répertoire ou une pratique à quelqu'un qui le détourne. | Jouer une collaboration ou un désaccord où l'autre garde sa place. |

Accessibilité : une conversation à deux suffit. Pas besoin de composer réellement une chanson, de prestation vocale hors RP, de public ou de pouvoir inconnu.

### Baali — secret infernal, dette et emprise

Leur association à l'infernalisme connaît des courants différents selon les sources. Le parcours doit suivre celui retenu par le serveur, pas inventer un maître démoniaque universel. Voir [Baali](https://whitewolf.fandom.com/wiki/Baali). L'enjeu distinct du Ministère est ici la dette occulte ou le secret lié à une influence infernale effectivement présente dans la fiction.

| Niveau | Action ou alternative | Condition concrète |
|---|---|---|
| 1 | **Le secret compromettant.** Un interlocuteur remarque un indice lié à un engagement occulte déjà établi. | Négocier son silence, fournir une explication contestable ou accepter de perdre un accès. |
| 2 | **Le prix du service.** Un intermédiaire réclame une contrepartie limitée à une faveur occulte. | Accepter, négocier ou refuser en jouant le changement de relation ; aucune apparition démoniaque requise. |
| 3 | **Le pacte et le proche.** Une obligation établie menace une alliance personnelle. | Choisir qui informer et quelle limite défendre ; une partie réagit. |
| 4 | **L'emprise contestée.** Un complice remet en cause le prix d'un engagement ou une instruction. | Renégocier, transférer ou rompre une obligation et jouer la conséquence locale. |
| 5 | **Le pouvoir refusé ou assumé.** Une ancienne promesse exige désormais un prix incompatible avec une limite du personnage. | Décider devant un interlocuteur concerné, sans récompense de puissance supplémentaire. |

Accessibilité : un complice, un courrier déjà établi ou une obligation connue suffisent. Ne pas générer des pactes puissants pour obtenir des points. Si aucun contexte occulte n'existe, utiliser les jalons communs et adapter une scène d'héritage ; l'accès à un démon ne doit jamais bloquer un niveau.

### Caïn — hors progression

L'entrée `cain` porte déjà `gm_only: True`. Elle doit rester un outil narratif du MJ. Lui attribuer cinq paliers d'actions ordinaires contredirait à la fois sa fonction et l'équité entre joueurs. Aucun gain de maturation n'est proposé.

## 6. Ce qui rend ces parcours réellement équitables

L'équilibre ne signifie pas que tout le monde joue la même scène. Il signifie qu'un point demande une implication et une accessibilité comparables.

| Risque d'inégalité | Règle de conception |
|---|---|
| Le Ventrue a des ressources que le nouveau Gangrel n'a pas. | Une promesse locale ou un abri vaut une négociation d'entreprise ; l'échelle ne change pas la récompense. |
| Le Tremere dispose de davantage d'actions surnaturelles. | Employer un pouvoir ne donne pas de point en soi ; toutes ses lignes ont une voie relationnelle. |
| Le Malkavien dépend des secrets du MJ. | Une hypothèse infirmée peut progresser autant qu'une hypothèse confirmée, si ses conséquences sont jouées. |
| Le Giovanni dépend de fantômes joués par le staff. | Toujours proposer une voie par les héritiers, souvenirs, clients ou obligations entre vivants. |
| Le joueur sociable dispose de nombreux partenaires. | Aucun quota de partenaires, aucune prime à la foule ; un duo récurrent reste viable. |
| Le personnage solitaire serait exclu. | Autoriser un PNJ ordinaire joué par un partenaire, selon les usages du serveur ; pas d'événement staff indispensable. |
| Les joueurs rapides terminent beaucoup plus de scènes. | Plafond commun de 6 par période ; durée et quantité de texte ne rapportent rien. |
| Les joueurs lents attendent des semaines une clôture. | Seuils modestes, conservation des acquis et aucun délai RP artificiel ajouté. Surveiller leur cadence réelle. |
| Les niveaux élevés doivent accumuler des exploits mondiaux. | Exigence de profondeur personnelle et de continuité, sans agrandir obligatoirement la portée du conflit. |
| Les bons rôlistes deviennent ceux que le MJ préfère. | Validation sur choix, tension vampirique et conséquence observables, pas sur beauté du texte ou conformité au stéréotype. |

Une action de clan est **thématique, pas un monopole comportemental**. Un Toreador peut protéger une source ; un Nosferatu peut créer une œuvre. Ils utilisent alors le jalon commun adapté. Ce qui qualifie le jalon d'héritage est le rapport explicite à la lignée du personnage, pas l'interdiction faite aux autres d'agir pareil.

Refuser une tradition de clan peut parfaitement être un jalon de clan : le personnage doit rencontrer cette tradition dans la fiction et traiter le coût de son refus. Aucune punition mécanique pour un concept atypique.

Les effets sur un autre PJ suivent les règles du serveur et sa réponse. « Il est convaincu », « elle est corrompue », « il me craint » ne sont pas des preuves si le joueur concerné ne les a pas joués ou si la résolution ne les autorise pas. Les points récompensent aussi la négociation et le refus ; la soumission d'un partenaire n'est jamais indispensable.

## 7. Exemples complets de validation

**Toreador niveau 2 — La muse qui répond.** Un mortel demande de retirer un portrait qui révèle un détail intime. Le vampire veut conserver son œuvre et craint que le refus attire l'attention sur leur relation nocturne. Il accepte de modifier le portrait en échange d'une dernière séance ; le mortel accepte, mais refuse désormais les visites improvisées. Tension vampirique, choix et conséquence : **1 point**. Si le vampire a simplement peint quelque chose de beau : **0**.

**Tremere niveau 3 — Partager sans posséder.** Un résultat obtenu avec une méthode déjà possédée pourrait aider un allié, mais identifierait la source qui a demandé le secret. Le Tremere négocie une transmission partielle et devient personnellement garant de sa fiabilité. L'information demeure incomplète et l'allié l'accepte avec réserve : **1 point**, sans rituel rare ni résultat scientifique révolutionnaire.

**Banu Haqim niveau 4 — La sentence révisée.** Après une sanction jouée dans une scène antérieure, une preuve établie montre qu'un témoin a omis un détail. Le vampire reprend l'affaire avec la personne lésée et accepte une restitution. **1 point**, éventuellement **+1 de conclusion** si ce fil remplit les conditions, si le bonus de période est disponible et si le plafond le permet. Pas de point supplémentaire pour « justice », « clan » et « réparation » sur la même scène.

**Gangrel et Ventrue dans la même scène.** L'un doit préserver un refuge ; l'autre cherche un accès discret à une proie compatible. Ils négocient des conditions et chacun abandonne une option réellement utile. Chacun peut recevoir **1 point pour son propre choix**. Le total n'est pas partagé entre eux, mais aucun ne reçoit de prime pour avoir aidé l'autre à progresser.

**Abus à refuser.** Deux vampires boivent régulièrement l'un sur l'autre, puis déclarent une nouvelle « dette » immédiatement annulée. Aucune évolution effective : **0 point**, même si le délai de 28 jours est passé. À l'inverse, un couple récurrent peut progresser si leur dépendance évolue réellement ; il n'est pas nécessaire de changer de partenaires.

**Crise fabriquée.** Le personnage provoque délibérément sa Bête uniquement pour cocher une action, puis tout revient à l'identique : **0**. S'il a réellement commis une imprudence dans l'histoire et doit ensuite en traiter les conséquences, ces conséquences peuvent former un jalon ordinaire. On juge ce qui est joué, pas une intention supposée du joueur.

## 8. Validation légère et suivi de l'équilibrage

Une demande devrait contenir : personnage, niveau au début de la scène, lien vers la scène, date de clôture et trois courtes phrases : « tension vampirique », « choix », « conséquence ». Ajouter l'identifiant du fil narratif uniquement pour réclamer un bonus de conclusion.

Le MJ vérifie les trois critères, le non-cumul et le plafond. Il ne doit pas exiger des conséquences toujours plus graves à force de connaître le joueur. Une évolution modeste et claire reste recevable. Un refus indique le critère manquant, avec possibilité de faire valider ultérieurement une vraie scène de conséquence ; il n'invite pas à gonfler artificiellement le danger.

**Pilote proposé : trois périodes de 28 jours.** Mesurer : points par personnage actif, nombre de scènes closes, délai médian de clôture, proportion de refus, raisons des refus, dépendance au staff et distribution par clan. Une médiane globale ne suffit pas : examiner aussi les joueurs à une ou deux scènes par mois.

- Si presque tous les actifs restent à 0–1 point par période, vérifier d'abord si les critères sont trop stricts ou les scènes trop rares. Réduire les seuils si le rythme du serveur l'exige.
- Si beaucoup atteignent 6 à chaque période, vérifier les découpages artificiels et les conséquences annulées. N'augmenter les coûts qu'après cette vérification.
- Si une lignée reçoit nettement plus de refus, comparer les conditions d'accès avant de conclure à une différence de qualité de RP.
- Si la majorité progresse à 2–4 points, le parcours théorique d'environ 19–39 mois est cohérent avec la cible lente retenue ici.

Ces chiffres sont une calibration initiale calculée, **pas un équilibrage déjà testé sur les joueurs**. Le nombre réel de scènes terminées par mois est la principale donnée manquante. Une nouvelle économie de points ne compense pas à elle seule un trop grand écart de puissance entre niveaux.

## 9. Points du projet à harmoniser avant une éventuelle intégration

Constats issus de la lecture locale ; aucun déploiement ni audit exhaustif du service distant n'a été réalisé.

1. **Seuils contradictoires.** `SheetPage.jsx`, `add_saturation_points` et le script Apps Script local emploient 30/60/120/250 ; `get_saturation_threshold` emploie 25/50/80/120. Un seul catalogue de règles doit fournir calculs et affichages.
2. **Actions de clan divergentes.** Python emploie notamment `hecata` et `ministry`, alors que le catalogue de clans emploie `giovanni` et `setite`. Le front contient `giovanni` et `setites`. Les alias doivent être explicites et ne pas compter comme actions supplémentaires.
3. **Lignées sans action dédiée.** Le catalogue Python des actions ne couvre pas Ravnos, Salubri, Gargouilles, Samedi, Filles de la Cacophonie et Baali. Fournir une voie de progression commune et les variantes d'héritage.
4. **Calcul de récompense incohérent.** Dans `_process_pending_action_from_sheets`, les points transmis sont `action_info["points"]`, sans appel visible à `get_action_points`. Le barème variable affiché peut donc diverger des points mis en attente dans ce chemin. Vérifier toute la chaîne lors de l'implémentation.
5. **Progression et psychologie.** Retirer des textes l'idée qu'un haut niveau supprime la Bête, impose d'abandonner ses proches ou confère automatiquement un âge et un rang social.
6. **Historique nécessaire.** Enregistrer scène, fil, période de clôture, niveau de référence et règles appliquées. Le seul identifiant d'action ne suffit pas à contrôler le non-cumul.
7. **Validation fiable.** Recalculer les points côté serveur, empêcher le double crédit, appliquer le plafond avant attribution, préserver la période d'origine et reporter l'excédent au changement de niveau. Une validation en retard ne doit pas créer un gain gratuit ou effacer des points légitimes.
8. **Migration équitable.** Conserver le niveau déjà acquis. Convertir le progrès partiel proportionnellement : `nouveaux points = partie entière(ancien progrès / ancien seuil effectif × nouveau seuil)`, après avoir identifié le seuil qui gouvernait réellement le personnage. Ne pas choisir arbitrairement entre les seuils contradictoires. Au niveau 5, arrêter l'accumulation destinée à un niveau suivant.

L'ancienne réserve de Vitae et ses dépenses peuvent rester un sujet séparé. Il faudra toutefois vérifier leurs effets sur l'intérêt des niveaux : ralentir l'accès à un niveau ne suffit pas si ce niveau rend toute interaction avec les débutants impossible.

## 10. Statut des sources

La [présentation officielle des clans](https://www.paradoxinteractive.com/games/world-of-darkness/discover-world-of-darkness/vampire-the-masquerade/clans) fournit les orientations générales. Les pages White Wolf Wiki liées dans le texte servent de sources secondaires pour les distinctions d'édition, la Puissance du Sang et les lignées historiques ; elles ne remplacent pas les livres de l'édition finalement retenue par le serveur. Certains accès directs au wiki Paradox étaient indisponibles lors de la recherche.

Les 90 propositions de niveau, les alternatives, les conditions de validation, les seuils et les plafonds sont une conception originale pour ce serveur. Elles cherchent une cohérence de ton et de contraintes avec Vampire : The Masquerade, sans prétendre que les clans disposent officiellement de ces quêtes de progression.
