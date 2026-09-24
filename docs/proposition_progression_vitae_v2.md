# Rééquilibrage de la Vitae — version 2

24 septembre 2026. Cette proposition remplace celle du 23 septembre. Aucun changement des règles actives ou du code.

**Conserver le système d'actions à points : valeurs différentes, cumul dans une même scène, aucun plafond mensuel, aucun délai de récupération.** La lenteur doit venir des réalisations demandées et des seuils, jamais d'une attente du calendrier.

## 1. Le changement de direction

La première proposition rémunérait des échanges relativement ordinaires puis les limitait artificiellement dans le temps. Elle s'éloignait du besoin. Cette approche est abandonnée.

Exprimer une conviction, accepter une dette, poser une limite ou reconnaître une erreur ne suffit plus à gagner des points. Ces actes peuvent servir une réalisation : gagner un accès protégé, découvrir un secret exploitable, neutraliser une menace, établir une influence ou réussir une opération occulte difficile.

Les intitulés sont des **objectifs ouverts**. Ils ne prescrivent ni dialogue, ni réaction d'un partenaire, ni décision morale. Leur difficulté vient d'un obstacle réel et d'un résultat effectivement obtenu.

On parle toujours de progression permanente de la Puissance du Sang, pas du remplissage de la réserve consommable. Ce catalogue est une règle maison représentant l'expérience vampirique. Puissance, génération, âge, humanité et titre politique restent distincts. Voir la [synthèse de la Puissance du Sang](https://whitewolf.fandom.com/wiki/Blood_Potency_(VTM)).

## 2. Règles de validation et cumul

Une action rémunérée demande un obstacle établi, un résultat observable et un enjeu vampirique ou lié à l'héritage du personnage. La longueur des messages, la durée réelle et le nombre de participants ne changent pas sa valeur.

Un accès doit être utilisable ; un accord doit être effectif ; un secret doit être vérifié ; une menace doit être neutralisée. Il n'est pas nécessaire d'attendre plusieurs semaines pour constater une réussite. En revanche, annoncer un projet ou promettre de discuter ne suffit pas.

**Plusieurs résultats indépendants se cumulent sans plafond de scène.** Au niveau 3, un Nosferatu peut obtenir un secret compromettant, puis extraire un informateur d'une embuscade : 4 + 6 = 10 points si les deux réussites ont chacune leur obstacle et leur résolution.

Ce qui ne se cumule pas est la répétition d'un même résultat sous plusieurs noms :

- « Découvrir un secret » et « obtenir cette information » sont une seule réalisation.
- Si le résultat du rituel est précisément cette information, ne pas payer automatiquement « rituel + secret ».
- Obtenir ensuite une concession supplémentaire par chantage peut constituer une deuxième réalisation si elle rencontre son propre obstacle. Une conséquence automatique n'est pas un nouvel accomplissement.
- Une expérience fondatrice et une action ordinaire décrivant le même événement ne s'ajoutent pas : retenir la plus élevée.
- Plusieurs personnages peuvent être récompensés pour leur contribution substantielle ; la présence seule ne suffit pas.

**Répétition sans calendrier :** une nouvelle réussite peut être récompensée immédiatement si un nouvel obstacle et un nouveau résultat existent. Entretenir un acquis ne le recrée pas. Chaque repas n'est pas une nouvelle source de chasse ; chaque conversation avec un fantôme n'est pas un nouveau pacte ; chaque garde n'est pas une nouvelle défense du refuge.

Changer seulement de PNJ ne rend pas difficile une tâche devenue automatique. À l'inverse, les mêmes partenaires peuvent produire une nouvelle réalisation si leurs circonstances évoluent réellement. Aucune rotation de partenaires n'est obligatoire.

Les intrigues préparées entre joueurs restent admissibles : leurs obstacles doivent être réellement joués. Une menace fictivement créée puis annulée sans résistance pour répéter une récompense ne compte pas.

Un échec ne donne pas les points de la réussite. Il peut contenir une autre réalisation : manquer un secret mais sauver sa source donne les points du sauvetage. Une bonne scène peut ne donner aucun point sans perdre sa valeur de RP.

## 3. Barème et rythme

| Importance | Valeur indicative | Condition |
|---|---:|---|
| Expérience fondatrice | 2–4 | Première expérience importante, non répétable. |
| Réalisation notable | 3–5 | Obstacle concret et résultat dépassant l'activité ordinaire. |
| Réalisation difficile | 6–8 | Opposition crédible ou contraintes combinées, enjeu substantiel. |
| Réalisation majeure | 10–12 | Opposition solidement établie et résultat important pour une coterie ou un réseau local. |

Ces fourchettes servent à concevoir le catalogue. Chaque entrée a ensuite une valeur fixe : pas de prime subjective à la qualité littéraire. Une réussite habile ne perd pas ses points parce qu'elle est obtenue rapidement. La routine sans obstacle est exclue, pas la compétence.

Conserver les seuils principaux actuels : **30 / 60 / 120 / 250 points**, par passage. Reporter les points excédentaires au niveau suivant. Aucun quota de catégories ni cérémonie obligatoire ne s'ajoute au seuil. Le niveau 5 reste le plafond du système existant.

Attention : `get_saturation_threshold` utilise 25/50/80/120, alors que le front, `add_saturation_points` et le script Apps Script local utilisent 30/60/120/250. Harmoniser cette contradiction avant une intégration.

Sans plafond temporel, qui accomplit davantage progresse plus vite. On ne peut pas garantir un minimum de mois sans réintroduire le verrou refusé. La cible se mesure en accomplissements :

| Passage | Coût | Gain moyen hypothétique par réalisation | Nombre indicatif |
|---|---:|---:|---:|
| 1 → 2 | 30 | 3–4 | 8–10 |
| 2 → 3 | 60 | 4–6 | 10–15 |
| 3 → 4 | 120 | 5–8 | 15–24 |
| 4 → 5 | 250 | 6–10 | 25–42 |

Environ **58–91 accomplissements** au total, pas autant de scènes : certaines n'en concluent aucun, d'autres plusieurs. Ces moyennes sont des hypothèses à vérifier, pas des résultats de tests. Au niveau 4, 21 actions à 12 points suffisent à dépasser 250 : la progression n'est lente que si ces actions restent réellement majeures.

## 4. Révision des actions générales

Les valeurs sont indiquées aux niveaux actuels N1/N2/N3/N4. « — » signifie que l'entrée ne rapporte plus à ce niveau, sans interdire l'événement en RP. Au N5, aucun point vers un niveau supérieur.

### Actions uniques

| Action | Condition | N1 | N2 | N3 | N4 |
|---|---|---:|---:|---:|---:|
| Première confrontation décisive avec la Bête | Crise réelle menaçant une personne, un engagement ou une couverture ; résolution jouée. Résister et céder ont le même tarif. | 3 | 2 | 1 | 1 |
| Première dépendance de sang établie | Goule ou lien réellement constitué selon les règles, avec dépendance mise en jeu. | 3 | 2 | 1 | 1 |
| Première rupture irréversible avec la vie mortelle | Identité, accès ou relation importante effectivement abandonnés pour préserver sa condition. Une visite à un proche ne suffit pas. | 4 | 3 | 2 | 1 |
| Première chasse autonome compromise puis réussie | Obstacle réel, alimentation obtenue et exposition immédiate traitée. | 2 | 1 | — | — |

Retirer la prime autonome de premier meurtre et celle du nombre de goules. Le meurtre peut appartenir à une crise sans être intrinsèquement plus rentable que la retenue. Posséder trois goules n'est pas une réalisation en soi.

### Actions répétables

| Action | Condition | N1 | N2 | N3 | N4 |
|---|---|---:|---:|---:|---:|
| Acquérir une source de chasse exploitable | Accès obtenu malgré une contrainte de territoire, proie ou couverture ; pas simplement une victime supplémentaire. | 3 | 2 | 1 | 1 |
| Reconstituer une ressource de chasse compromise | Cause de la perte traitée et nouvel accès opérationnel. | 4 | 4 | 3 | 2 |
| Neutraliser une menace contre la Mascarade | Preuve, témoin ou enquête effectivement dangereux ; obstacle résolu. | 5 | 5 | 4 | 3 |
| Déjouer une emprise structurante | Levier neutralisé ou autonomie concrète obtenue. Aucun lien magique supprimé par déclaration. | 6 | 6 | 5 | 4 |
| Extraire un allié ou une ressource vivante | Danger établi, opposition crédible, extraction incertaine puis réussie. | 6 | 6 | 6 | 5 |
| Surmonter une crise vampirique majeure | Faim, Bête, feu ou exposition menaçant un objectif important ; crise réellement résolue. | 5 | 5 | 4 | 3 |
| Obtenir un apprentissage occulte difficile | Accès non trivial et apprentissage validé selon les règles de pouvoirs. | 4 | 4 | 3 | 2 |
| Rompre une offensive contre un refuge ou réseau de chasse | Menace organisée effectivement défaite ou détournée. | 8 | 8 | 8 | 6 |
| Exploiter une résonance marquée | Émotion établie, source identifiée, chasse non triviale et alimentation réussie. | 2 | 1 | — | — |
| Exploiter une dyscrasie reconnue par le MJ | Particularité exceptionnelle établie, accès difficile et conditions remplies. | 5 | 5 | 3 | 2 |

Les actions générales difficiles restent accessibles à un débutant qui y contribue réellement. Elles ne sont pas obligatoires pour progresser.

Les quatre émotions ne donnent pas quatre boutons cumulables. Reboire une source dans les mêmes circonstances n'est pas une nouvelle découverte. Une dyscrasie ne se crée pas en déclarant opportunément une émotion extrême. Ne pas additionner chasse, résonance et acquisition si elles décrivent le même résultat.

Boire un vampire, participer à une Vaulderie ou boire à un donneur puissant ne donne **aucune saturation automatique**. Ces actes gardent leurs effets propres dans le serveur et peuvent participer à d'autres réalisations. Un échange convenu de sang ne doit pas produire une progression infinie. Le statut Wassail n'est pas une prime spécifique.

**Diablerie : retirer le forfait répétable de 25 points.** Proposition : pas de forfait de saturation, mais les effets exceptionnels définis par les règles de diablerie du serveur, avec résolution et conséquences MJ. Si elles manquent, les écrire avant d'en faire une voie de puissance. Ce document n'invente pas son bénéfice chiffré. Voir la distinction entre prise de sang et absorption de l'âme : [Diablerie](https://whitewolf.fandom.com/wiki/Diablerie_(VTM)).

**Torpeur, soleil et pieu :** retirer les primes d'entrée en torpeur, réveil et exposition volontaire. Une extraction ou une survie réellement difficile peut relever d'une action générale. Ne pas additionner les différentes descriptions du même danger. Le pieu paralyse normalement ; il ne constitue pas automatiquement une Mort Finale : [Mort Finale](https://whitewolf.fandom.com/wiki/Final_Death).

## 5. Catalogue par clan et par niveau

Ces objectifs originaux s'appuient sur les orientations de la [présentation officielle des clans](https://www.paradoxinteractive.com/games/world-of-darkness/discover-world-of-darkness/vampire-the-masquerade/clans), avec les lignées historiques présentes dans le projet. Les objectifs et tarifs ne sont pas officiels.

Chaque entrée comporte deux voies ouvertes. Ce ne sont pas deux récompenses automatiques ni une séquence obligatoire. Les rangs indiquent leur ouverture dans le catalogue rémunéré. Les anciennes entrées restent accessibles avec rendement réduit :

| Rang de l'entrée | N1 | N2 | N3 | N4 | N5 |
|---|---:|---:|---:|---:|---:|
| 1 | 3 | 2 | 1 | 1 | 0 |
| 2 | — | 5 | 4 | 2 | 0 |
| 3 | — | — | 8 | 6 | 0 |
| 4 | — | — | — | 12 | 0 |
| 5 | — | — | — | — | 0 |

Le tarif commun par degré de difficulté assure la comparaison entre clans ; le mélange des actions générales, uniques et de différents rangs produit les gains variables. Une réalisation de rang supérieur peut être jouée plus tôt et recevoir une récompense générale accessible si elle en remplit les conditions. Elle n'est pas conservée pour être réclamée après une montée.

Les objectifs N5 servent au RP d'aboutissement : aucun niveau 6 ou bonus de puissance parallèle. Les capacités surnaturelles doivent toujours être possédées. Un objectif ne donne jamais le pouvoir nécessaire pour le réussir.

### Brujah

**Axe : obtenir un changement malgré la résistance.** Défendre verbalement une cause ne suffit plus ; ni violence ni orientation politique ne sont imposées.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faire reculer une contrainte imposée ; obtenir réparation d'un abus établi. |
| 2 — 5 pts | Rassembler des soutiens qui passent effectivement à l'action ; faire aboutir une contestation locale. |
| 3 — 8 pts | Briser un dispositif de coercition ; préserver un objectif collectif menacé par une rupture d'alliance. |
| 4 — 12 pts | Transformer les règles d'un groupe malgré une opposition organisée ; mettre fin à une domination locale établie. |
| 5 — 0 pt | Faire vivre une cause indépendante de soi ; résoudre une contradiction centrale entre convictions et méthodes. |

Validation : concession appliquée, dispositif neutralisé ou action collective effectivement réalisée. Un discours ou des sympathisants passifs ne suffisent pas. Une coterie peut constituer l'échelle du conflit.

### Gangrel

**Axe : gagner une autonomie dans un environnement disputé.** Ne pas rémunérer la solitude ou le simple fait d'aller en forêt.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Sécuriser un abri difficile d'accès ; établir un passage malgré un obstacle territorial. |
| 2 — 5 pts | Conduire un déplacement collectif sous menace ; obtenir l'usage d'un terrain disputé. |
| 3 — 8 pts | Récupérer un territoire de survie compromis ; rompre une traque dirigée contre sa coterie. |
| 4 — 12 pts | Préserver un réseau de refuges face à une offensive ; ouvrir une voie de survie à un groupe isolé. |
| 5 — 0 pt | Transmettre un territoire utilisable ; établir un équilibre viable entre autonomie et appartenance. |

Validation : accès opérationnel, objectif atteint ou menace réellement traitée. Une cache temporaire ne brise pas à elle seule une traque. Friches et toits conviennent ; aucun Garou ou exil requis.

### Malkavien

**Axe : rendre exploitable une vérité difficile à établir.** Aucune prophétie vraie obligatoire ; les éléments doivent être vérifiables dans la fiction.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Mettre au jour une contradiction cachée ; rendre exploitable un indice incompris. |
| 2 — 5 pts | Dévoiler une tromperie par des indices négligés ; faire adopter une précaution malgré la méfiance grâce à un avertissement étayé. |
| 3 — 8 pts | Reconstituer un schéma dissimulé menaçant un groupe ; déjouer une manipulation de ses perceptions. |
| 4 — 12 pts | Faire échouer un plan grâce à une vérité difficilement établie ; faire reconnaître une révélation face à des intérêts organisés. |
| 5 — 0 pt | Transmettre un savoir sans le rendre incontestable ; résoudre une contradiction centrale de sa lecture du monde. |

Validation : conclusion fondée et utile ou effet concret obtenu. Exprimer une intuition ne suffit pas. Aucun secret inventé, omniscience ou comportement caricatural requis.

### Nosferatu

**Axe : acquérir et exploiter du renseignement protégé.** Une rumeur banale n'est pas un secret compromettant.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Établir une source dans un milieu fermé ; obtenir une information protégée et vérifiable. |
| 2 — 5 pts | Découvrir un secret compromettant ; obtenir une concession effective grâce à un renseignement. |
| 3 — 8 pts | Infiltrer un réseau hostile ; soustraire une source compromise à ceux qui l'exploitent. |
| 4 — 12 pts | Démanteler une surveillance organisée ; retourner un réseau de renseignement dans un conflit local. |
| 5 — 0 pt | Transmettre un réseau viable ; préserver un secret décisif malgré une rupture interne. |

Validation : accès gagné, information confirmée et exploitable ou concession exécutée. Consulter une source déjà acquise ne rapporte pas automatiquement. Aucun secret du Prince nécessaire.

### Toreador

**Axe : faire d'un attachement esthétique une réalisation effective.** La valeur ne dépend pas de l'appréciation artistique personnelle du MJ.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faire accepter une création dans un cercle réticent ; gagner un accès réservé par une intervention esthétique. |
| 2 — 5 pts | Faire d'une œuvre un levier d'influence ; établir un mécénat qui transforme réellement les moyens d'un artiste ou lieu. |
| 3 — 8 pts | Sauver un foyer culturel menacé ; retourner une réputation par une intervention créative. |
| 4 — 12 pts | Faire aboutir un projet culturel contre une opposition organisée ; établir un lieu d'influence convoité. |
| 5 — 0 pt | Créer un héritage repris par d'autres ; préserver une relation vivante malgré la tentation de la figer en idéal. |

Validation : accès, décision, soutien ou position effectivement modifiés. Un compliment ne suffit pas. Mécènes et collectionneurs sont viables ; aucune œuvre hors RP ou émotion imposée aux PJ.

### Ventrue

**Axe : rendre une autorité effective.** Donner un ordre, posséder de l'argent ou s'attribuer un titre ne suffit pas.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Établir un accès fiable à des proies compatibles ; faire reconnaître une responsabilité disputée. |
| 2 — 5 pts | Conclure un accord entre intérêts divergents ; placer une ressource sous contrôle effectif. |
| 3 — 8 pts | Résoudre une crise d'autorité ; rallier un intermédiaire jusque-là hostile. |
| 4 — 12 pts | Unifier des intérêts rivaux dans un dispositif commun ; préserver une structure d'influence face à une offensive. |
| 5 — 0 pt | Assurer une relève fonctionnelle ; maintenir une légitimité sans exiger une obéissance absolue. |

Validation : coopération, contrôle ou obligations effectivement appliqués malgré résistance. Une petite organisation suffit ; l'utilisation routinière de Domination n'est pas une récompense en soi.

### Tremere

**Axe : obtenir une maîtrise occulte applicable.** Répéter un rituel dans ses conditions habituelles est une routine.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Élucider un phénomène sanguin ; acquérir un savoir protégé et démontrer son usage. |
| 2 — 5 pts | Réussir un rituel sous contraintes inhabituelles ; récupérer un texte ou matériau occulte réellement protégé. |
| 3 — 8 pts | Neutraliser un effet occulte ; reconstituer une méthode fragmentaire autorisée. |
| 4 — 12 pts | Déjouer une opération occulte adverse ; établir une protection majeure pour un lieu ou une coterie. |
| 5 — 0 pt | Transmettre un corpus éprouvé ; obtenir son indépendance face à une tutelle occulte établie. |

Validation : question ouverte résolue, accès défendu gagné ou effet réalisé. Les règles de pouvoirs et d'apprentissage restent applicables ; aucun rituel nouveau offert par le barème.

### Lasombra

**Axe : retourner les rapports de force et maîtriser ses dépendances.** L'ambition déclarée ne vaut rien sans résultat.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Renverser une négociation défavorable ; gagner un intermédiaire indispensable malgré une dépendance compromettante. |
| 2 — 5 pts | Écarter un obstacle établi à son ambition ; faire échouer une mise sous tutelle. |
| 3 — 8 pts | Retourner une alliance hostile ; accomplir un plan après la perte d'un moyen essentiel. |
| 4 — 12 pts | Prendre l'ascendant sur une structure adverse ; rendre une position conquise viable face à une contre-offensive. |
| 5 — 0 pt | Construire un pouvoir supportant la contestation ; surmonter l'émancipation de ses agents. |

Validation : avantage effectif, autonomie obtenue ou objectif préservé. La maîtrise des moyens distingue ce parcours de la légitimité Ventrue. Aucun rôle religieux obligatoire.

### Tzimisce

**Axe : exercer une souveraineté concrète sur un domaine ou une transformation.** La voie territoriale évite d'imposer la sculpture de chair.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faire respecter une hospitalité contestée ; adapter un refuge à une contrainte réelle de sa condition. |
| 2 — 5 pts | Réaliser une transformation répondant à un besoin difficile ; soustraire une dépendance du domaine à une ingérence. |
| 3 — 8 pts | Reprendre un domaine compromis ; achever une transformation complexe sous contraintes. |
| 4 — 12 pts | Protéger un lieu disputé par un accord effectif ; achever une œuvre de transformation structurante pour le domaine. |
| 5 — 0 pt | Faire exister un héritage au-delà de sa possession ; accomplir une métamorphose autorisée de longue portée narrative. |

Validation : lieu utilisable, souveraineté reconnue ou transformation autorisée et utile. Modification cosmétique routinière exclue. Pas de château ni de pouvoir inventé ; les accords de jeu restent applicables aux PJ.

### Giovanni / Hecata

**Axe : exploiter les obligations des morts et des vivants.** Archives, héritiers et dettes fournissent une voie sans fantôme obligatoire.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Récupérer un bien funéraire disputé ; faire exécuter une obligation liée à un défunt. |
| 2 — 5 pts | Obtenir un service d'un mort réticent ; résoudre un conflit d'héritage utile au réseau. |
| 3 — 8 pts | Neutraliser une emprise nécromantique ; obtenir une vérité protégée par des intérêts familiaux concurrents. |
| 4 — 12 pts | Résoudre une crise entre intérêts vivants et morts ; établir un dispositif patrimonial ou nécromantique contesté. |
| 5 — 0 pt | Transmettre un réseau d'obligations viable ; résoudre un héritage menaçant la continuité de la lignée locale. |

Validation : obligation exécutée, service rendu, vérité démontrée ou dispositif opérationnel. Rituel funéraire routinier et conversation ordinaire avec un esprit exclus. Giovanni et Hecata ne sont pas de simples synonymes historiques.

### Séthites / Ministère

**Axe : transformer les attachements et allégeances.** Proposer un vice ou faire un discours de libération ne suffit plus.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faire abandonner une interdiction défendue ; entrer dans un cercle fermé par une offre ciblée. |
| 2 — 5 pts | Détacher une personne d'une emprise structurante ; établir une adhésion qui modifie ses actes. |
| 3 — 8 pts | Retourner un relais d'influence ; dévoiler une contradiction qui compromet une autorité locale. |
| 4 — 12 pts | Briser l'emprise d'un groupe ; établir un cercle autonome malgré une opposition organisée. |
| 5 — 0 pt | Faire survivre un enseignement à son appropriation ; résoudre les dépendances créées au nom de la liberté. |

Validation : transgression, adhésion ou émancipation réellement jouées et ayant un effet. Aucun consentement de façade. Ni pratique sexuelle, addiction ou humiliation nécessaire : une fidélité politique peut suffire.

### Banu Haqim

**Axe : établir puis faire appliquer un jugement.** Enquête, restitution et arbitrage constituent des voies aussi légitimes que la traque.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Établir une responsabilité contestée ; obtenir une réparation dans un différend. |
| 2 — 5 pts | Mener une traque ciblée à son terme ; faire appliquer un arbitrage initialement refusé. |
| 3 — 8 pts | Confondre un coupable protégé ; rendre possible une justice empêchée par un intérêt établi. |
| 4 — 12 pts | Démanteler la protection organisée d'un abus ; obtenir une réparation majeure contre les intérêts de son propre camp. |
| 5 — 0 pt | Établir un arbitrage indépendant de soi ; appliquer son code à un conflit qui en révèle les limites. |

Validation : preuve établie, objectif accompli ou réparation exécutée. Tuer et détenir un titre ne sont pas requis. Une mission ne devient pas difficile simplement parce qu'on l'appelle contrat.

### Ravnos

**Axe : réussir par le détour ce qui résiste à l'approche directe.** Mentir ou changer de refuge ne rapporte pas automatiquement.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Franchir une barrière d'accès par la ruse ; obtenir un abri dans un milieu méfiant. |
| 2 — 5 pts | Détourner une poursuite ; réussir une substitution contre un adversaire vigilant. |
| 3 — 8 pts | Désorganiser une opération hostile ; obtenir un bien protégé en contournant ses défenses. |
| 4 — 12 pts | Retourner une chasse organisée contre ses moyens ; établir une voie de passage sous surveillance active. |
| 5 — 0 pt | Transmettre une liberté de mouvement ; sortir d'une identité construite devenue contraignante. |

Validation : obstacle contourné et objectif atteint selon la résolution de jeu. Une illusion seule ne suffit pas ; ses pouvoirs doivent être possédés. Pas de vol compulsif ni de départ du serveur imposé.

### Salubri

**Axe : fournir une aide réellement difficile sans devenir une ressource exploitée.** Écoute et soins ordinaires ne suffisent pas.

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Mettre une personne vulnérable à l'abri malgré opposition ; obtenir une assistance qui lui était refusée. |
| 2 — 5 pts | Restaurer une capacité compromise par des moyens autorisés ; soustraire un bénéficiaire à une dépendance dangereuse. |
| 3 — 8 pts | Sauver un dispositif d'accueil menacé ; protéger une personne activement recherchée. |
| 4 — 12 pts | Mettre fin à l'exploitation organisée de ses dons ; préserver un sanctuaire visé par une offensive. |
| 5 — 0 pt | Transmettre une capacité d'aide indépendante ; résoudre un conflit entre protection, autonomie et survie. |

Validation : aide effectivement fournie, autonomie obtenue ou menace surmontée. Protection et négociation restent possibles sans guérison spécialisée. Aucun miracle gratuit, sacrifice obligatoire ou accès automatique à Golconde.

### Gargouilles

**Axe : accomplir une protection difficile ou conquérir une autonomie.** Leur histoire permet les deux voies ; voir [Gargouilles](https://whitewolf.fandom.com/wiki/Gargoyle_(VTM)).

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Empêcher une intrusion réelle ; obtenir une liberté jusque-là refusée. |
| 2 — 5 pts | Protéger une cible contre une attaque ; neutraliser un levier de servitude. |
| 3 — 8 pts | Faire tenir une défense malgré une faiblesse exploitée ; libérer une personne d'un dispositif de contrôle. |
| 4 — 12 pts | Faire reconnaître une autonomie contre une opposition organisée ; préserver un refuge collectif attaqué. |
| 5 — 0 pt | Former une relève volontaire ; établir une protection qui ne reproduit pas la servitude. |

Validation : menace déjouée, cible préservée ou droit effectivement exercé. Garde sans incident exclue. Créateur disponible comme PNJ et révolte générale inutiles ; aucune faculté hors fiche.

### Samedi

**Axe : agir là où la condition cadavérique ferme les accès.** Choisir la version retenue par le serveur sans cumuler les malédictions : [Samedi](https://whitewolf.fandom.com/wiki/Samedi).

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Gagner un accès refusé à cause de sa condition ; récupérer un corps ou bien funéraire protégé. |
| 2 — 5 pts | Réussir une opération discrète malgré son apparence ; obtenir un résultat défendu en employant l'effroi. |
| 3 — 8 pts | Neutraliser une exploitation des morts ; établir une ressource dans un milieu qui l'excluait. |
| 4 — 12 pts | Sauver un refuge de marginaux attaqué ; obtenir une coopération structurante de ceux qui l'instrumentalisaient. |
| 5 — 0 pt | Transmettre une place reconnue ; maintenir des liens indépendants de son utilité macabre. |

Validation : obstacle social ou matériel résolu, selon la réponse des participants. Décrire la décomposition ou imposer la peur ne suffit pas. Ni contagion ni nécromancie gratuites.

### Filles de la Cacophonie

**Axe : produire un effet difficile par la voix.** Chant et musique intérieure inspirent le parcours : [Daughters of Cacophony](https://whitewolf.fandom.com/wiki/Daughters_of_Cacophony).

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Gagner une audience inaccessible ; réussir une intervention vocale décisive dans une situation perturbée. |
| 2 — 5 pts | Briser une hostilité par une intervention autorisée ; transmettre un message malgré une opposition à sa réception. |
| 3 — 8 pts | Déjouer une manipulation collective par sa voix ; protéger une opération quand son expression est compromise. |
| 4 — 12 pts | Retourner une confrontation organisée par une intervention vocale ; établir un cercle d'influence contre des adversaires actifs. |
| 5 — 0 pt | Transmettre une tradition vivante ; réaliser une œuvre collective laissant leur autonomie aux autres voix. |

Validation : accès, décision ou opération réellement modifiés. Une prestation applaudie ne suffit pas. Une poignée d'interlocuteurs peut convenir ; aucun chant hors RP ni pouvoir collectif gratuit.

### Baali

**Axe : maîtriser une dette ou une influence occulte compromettante.** Le courant retenu détermine le contexte : [Baali](https://whitewolf.fandom.com/wiki/Baali).

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Récupérer une preuve menaçante de ses pratiques ; gagner un intermédiaire dans un milieu occulte fermé. |
| 2 — 5 pts | Accomplir une opération clandestine liée à un engagement occulte ; soustraire un complice à une enquête. |
| 3 — 8 pts | Déjouer un adversaire connaissant son secret ; neutraliser un levier d'emprise lié à une dette occulte. |
| 4 — 12 pts | Démanteler un dispositif occulte adverse ; obtenir son autonomie face à une tutelle établie. |
| 5 — 0 pt | Résoudre le prix d'un engagement majeur ; transmettre ou abolir une structure occulte sans effacer ses conséquences. |

Validation : menace supprimée, accès gagné ou objectif accompli malgré obstacle. Invoquer ou mentionner un maître ne suffit pas. Un complice ou un objet peut porter l'intrigue ; aucun sacrifice croissant ou événement apocalyptique requis.

### Caïn

L'entrée `cain` est réservée au MJ dans le projet. Aucun parcours chiffré. Les Caitiff et Sang-Clair ne sont pas ajoutés au périmètre des 18 clans et lignées examinés.

## 6. Difficulté et accessibilité

Des objectifs plus exigeants ne doivent pas devenir des rendez-vous avec des PNJ exceptionnels. Deux ou trois joueurs peuvent porter une opposition réelle. Les PNJ ordinaires suivent les usages du serveur.

L'obstacle doit précéder sa résolution dans la fiction, sans imposer une demande préalable au MJ pour chaque scène. Le validateur peut vérifier le résultat à la lecture. Les ressources, propriétés et territoires suivent les règles d'autorité existantes : le barème n'autorise pas à inventer un contrôle par déclaration.

Un personnage atypique dispose des actions générales. Aucun clan n'a le monopole d'un comportement ; un Ventrue peut enquêter et un Nosferatu diriger. Ne pas additionner une entrée générale et sa variante de clan pour un seul résultat.

Les hauts niveaux demandent des résultats plus structurants, pas des exploits mondiaux. La difficulté doit rester locale et jouable. Le problème n'est pas qu'un personnage puisse discuter tous les jours : c'est qu'une discussion sans réalisation ne doit pas être rémunérée comme un accord difficile effectivement obtenu.

## 7. Vérification et intégration éventuelle

Ce barème n'a pas été testé sur les joueurs. Observer les gains moyens par accomplissement, les réalisations nécessaires par niveau, les actions devenues routinières et les écarts d'accès selon les clans. Examiner les cumuls pour détecter le double compte, sans les plafonner.

Si la progression est trop rapide, corriger les entrées trop faciles ou trop rentables avant d'augmenter tous les seuils. Si elle est trop lente, élargir les moyens d'atteindre les objectifs sans les réduire à une conversation quotidienne. Aucun délai de récupération ne sert de correctif.

Pour une intégration ultérieure :

1. Supprimer les délais de récupération des actions de progression ; ne pas créer de plafond périodique.
2. Conserver actions uniques, catégories, valeurs différentes et rendement selon le niveau.
3. Enregistrer la scène et le résultat de chaque action ; plusieurs récompenses par scène restent possibles.
4. Unifier les seuils dans Python, le front et Apps Script.
5. Harmoniser `giovanni/hecata` et `setite/setites/ministry` sans dupliquer les récompenses.
6. Ajouter les six lignées/clans absents du catalogue spécifique actuel : Ravnos, Salubri, Gargouilles, Samedi, Filles de la Cacophonie et Baali.
7. Calculer les points côté serveur. `_process_pending_action_from_sheets` transmet actuellement `action_info["points"]` sans appel visible au scaling dans ce chemin.
8. Pour une scène, figer les valeurs au niveau à son ouverture, appliquer les récompenses une fois et reporter l'excédent aux seuils suivants. L'ordre des clics du MJ ne doit pas changer le total. Une scène ne peut pas être réclamée de nouveau après une montée.
9. Conserver niveaux et historiques acquis. Vérifier les cas touchés par les seuils contradictoires avant toute migration.

Les sources liées soutiennent les distinctions de lore. White Wolf Wiki reste une source secondaire ; les règles détaillées suivent l'édition retenue par le serveur. Tous les objectifs et tarifs sont ici des propositions originales, pas un catalogue officiel.
