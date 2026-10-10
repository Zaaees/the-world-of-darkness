# Rééquilibrage de la Vitae — version 2

Proposition initiale du 24 septembre 2026, remplaçant celle du 23 septembre. Le catalogue de clans de la section 5 a été révisé et intégré le 10 octobre 2026. Les autres sections restent une proposition historique et ne décrivent pas nécessairement les règles actives.

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

Chaque entrée propose un accomplissement lié à l’héritage du clan, avec des pistes non exhaustives. Ces pistes sont des exemples, jamais une liste de tâches à cumuler ni une séquence obligatoire. Les rangs indiquent leur ouverture dans le catalogue rémunéré. Les anciennes entrées restent accessibles avec rendement réduit :

| Rang de l'entrée | N1 | N2 | N3 | N4 | N5 |
|---|---:|---:|---:|---:|---:|
| 1 | 3 | 2 | 1 | 1 | 0 |
| 2 | — | 5 | 4 | 2 | 0 |
| 3 | — | — | 8 | 6 | 0 |
| 4 | — | — | — | 12 | 0 |
| 5 | — | — | — | — | 0 |

Le tarif commun par degré de difficulté assure la comparaison entre clans ; le mélange des actions générales, uniques et de différents rangs produit les gains variables. Une réalisation de rang supérieur peut être jouée plus tôt et recevoir une récompense générale accessible si elle en remplit les conditions. Elle n'est pas conservée pour être réclamée après une montée.

Les objectifs N5 servent au RP d'aboutissement : aucun niveau 6 ou bonus de puissance parallèle. Les capacités surnaturelles doivent toujours être possédées. Un objectif ne donne jamais le pouvoir nécessaire pour le réussir.

Révision éditoriale du 10 octobre 2026 : les 90 actions de clans ci-dessous sont synchronisées avec le catalogue actif. Les autres sections conservent leur statut de proposition historique.

Les descriptions portent l’atmosphère et l’objectif. Les pistes précisent des réalisations possibles. Un petit nombre de partenaires et des lieux ordinaires du serveur doivent pouvoir suffire, y compris aux rangs élevés. Les PNJ et ressources suivent les règles habituelles du serveur : aucune disponibilité particulière n’est présumée. La difficulté vient des obstacles et des conséquences, pas du prestige des participants. Les réactions, secrets et pouvoirs d’un autre personnage ne se décrètent pas. Les objectifs de rang 5 se constatent dans des scènes de transmission, d’épreuve ou de résolution : ni départ du personnage ni attente de plusieurs mois ne sont requis.

### Brujah

**Axe : Donner à la révolte une prise sur le réel : refus, ralliement, conviction éprouvée et changement appliqué.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Refusez une autorité qui prétend décider à votre place et arrachez-lui une liberté qu’elle vous déniait. Que votre colère trouve une prise sur le monde : une interdiction bravée, un abus interrompu, quelque chose qui ne plie plus. |
| 2 — 5 pts | Faites de votre colère ou de votre conviction une étincelle que d’autres choisissent de suivre. |
| 3 — 8 pts | Portez votre conviction là où elle risque de se briser, puis faites de l’épreuve un changement que vos adversaires ne peuvent réduire à des paroles. La Bête réclame un ennemi. Donnez à votre colère une cause qui survive à l’affrontement. |
| 4 — 12 pts | Faites tomber une règle ou une domination établie, puis donnez corps à ce que vous vouliez mettre à sa place. L’épreuve commence lorsque les chaînes se rompent et que ceux qui les tenaient cherchent déjà à les reforger. |
| 5 — 0 pt | Faites d’une conviction quelque chose qui n’a plus besoin de vous pour exister. |

**1. Le prix du refus** — Défiez une interdiction pour venir en aide à quelqu’un, faites rendre un bien confisqué ou mettez fin à une intimidation. Le refus doit produire son effet malgré une résistance, et ses conséquences doivent être jouées.

**2. Les voix qui se lèvent** — Entraînez un ou plusieurs compagnons dans une contestation qui aboutit : défendre une personne menacée, faire lever une sanction ou ouvrir un accès réservé. Leur engagement doit peser sur le résultat. Une foule et un discours ne sont pas nécessaires.

**3. Le feu des idées** — Mettez au jour la contradiction d’un adversaire, ralliez un soutien qui vous résistait ou défendez vos principes au prix d’un avantage réel. Obtenez ainsi une réparation, la fin d’une contrainte ou la réussite d’une action jusque-là empêchée. Le débat seul ne suffit pas.

**4. Un ordre nouveau** — Changez le partage d’une ressource, les obligations d’une coterie ou les conditions d’accès à un lieu. Faites appliquer cette alternative malgré une tentative réelle de rétablir l’ancien usage. Un conflit local suffit, sans renverser le pouvoir de la ville.

**5. La cause vous survivra** — Confiez un combat à un compagnon, transmettez les moyens de le poursuivre et laissez-le conduire une action concrète à sa manière. La cause doit vivre dans ses choix, même lorsqu’ils s’écartent des vôtres. Votre départ et la fondation d’un mouvement ne sont pas requis.

Validation : Un refus doit produire une liberté ou une réparation. Le ralliement doit conduire à une action aboutie. Le débat du rang 3 doit changer la situation. Le rang 4 demande une alternative appliquée malgré une riposte. Un seul compagnon peut porter la transmission du rang 5.

### Gangrel

**Axe : Lire le territoire en prédateur, y survivre et transmettre une liberté de mouvement.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Là où vos habitudes ne vous protègent plus, apprenez à vivre en prédateur. Lisez les abris, les passages et les dangers d’un terrain mal connu jusqu’à y trouver de quoi traverser la nuit et cacher votre sommeil. |
| 2 — 5 pts | Retrouvez une personne, une créature ou une ressource disparue en reconstruisant sa piste à travers les traces qu’elle a laissées dans son environnement. Là où d’autres interrogent leurs contacts, apprenez à lire ce que le territoire raconte encore. |
| 3 — 8 pts | Partagez une portion de nuit avec un autre prédateur sans lui abandonner votre liberté. Nouez un accord de passage, de chasse ou de refuge, puis faites tenir cette parole lorsque le territoire oppose ses propres lois. |
| 4 — 12 pts | Ouvrez à d’autres une voie de survie à travers un territoire qui les enfermait. Quand la route se referme, faites de votre connaissance des lieux, de leurs bêtes et de leurs dangers ce qui permet encore de passer. |
| 5 — 0 pt | Confiez à un autre les chemins que votre sang a appris. Laissez-le reconnaître le danger, choisir son passage et trouver son abri, jusqu’à ce que la nuit cesse d’être pour lui un pays dont vous seul possédez la carte. |

**1. La nuit sans murs** — Dans une friche, sur les toits ou le long des berges, surmontez un obstacle de terrain ou une présence hostile et éprouvez un repli utilisable avant l’aube. Des compagnons peuvent vous aider. Une promenade et la désignation d’une cache ne suffisent pas.

**2. Ce que la pluie n’efface pas** — Suivez des habitudes de déplacement, des traces physiques, des témoins marginaux ou le comportement des animaux ; reconstituez le passage d’un fugitif, retrouvez un vampire qui ne veut pas l’être ou découvrez où une proie, un messager ou un intrus a réellement disparu.

**3. Les pactes de la lisière** — Entendez-vous avec un voisin ou un compagnon sur une limite, un abri ou un avertissement, puis résolvez l’intrusion, la pénurie ou la traque qui met l’accord à l’épreuve. Le lien se prouve dans l’entraide et la connaissance du terrain, sans exiger une assemblée de Gangrel.

**4. Les routes n’ont pas de prince** — Préparez un itinéraire et un repli, puis conduisez au moins un compagnon à travers une surveillance ou une traque organisée. Surmontez la perte d’un passage ou une autre complication établie. Une traversée décisive suffit, sans posséder un réseau à l’échelle de la ville.

**5. Ce que la piste enseigne** — Transmettez vos repères, les usages des prédateurs locaux et les solutions de repli, puis laissez votre compagnon mener une traversée ou une recherche de refuge avec un imprévu réel. Il doit adapter ce savoir sans attendre vos instructions.

Validation : Le terrain et la survie portent la réalisation. Un abri doit être utilisable, une piste aboutir, un accord être éprouvé. Le rang 4 combine préparation, menace organisée et traversée réussie. Aucun isolement forcé, Garou ou exil nécessaire.

### Malkavien

**Axe : Faire de perceptions discordantes une piste jouable, sans omniscience ni prophétie obligatoirement vraie.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Suivez une obsession, une perception discordante ou une association que les autres jugent absurde, puis tirez de cette démarche un avantage concret face à un problème immédiat. Votre interprétation peut être juste, trompeuse ou demeurer inexpliquée. |
| 2 — 5 pts | Amenez quelqu’un à accepter une idée ou une vérité qu’il avait de fortes raisons de rejeter. Par des rapprochements troublants, des paroles à double sens ou des détails que personne n’avait su lire, fissurez ses certitudes jusqu’à obtenir un changement concret et significatif dans ses actes. |
| 3 — 8 pts | À partir de présages, d’obsessions ou de coïncidences, élaborez une piste que les autres avaient écartée, puis utilisez-la pour débloquer une affaire importante jusque-là dans l’impasse. Surmontez un obstacle réel et obtenez une avancée décisive, même si votre interprétation initiale se révèle fausse. |
| 4 — 12 pts | Portez une lecture de la nuit que vos compagnons refusent de considérer, puis donnez-lui assez de prise pour changer le cours d’une affaire menacée. Parmi les voix qui vous traversent, faites entendre celle qui ouvre encore une issue. |
| 5 — 0 pt | Donnez à une découverte la forme d’un récit, d’un signe ou d’un motif qu’un autre pourra reconnaître dans le vacarme de la nuit. Laissez votre vision rencontrer la sienne, jusqu’à produire une lecture qui ne vous appartient plus tout à fait. |

**1. La fissure du réel** — Attachez-vous à un détail que tous écartent, rapprochez des paroles apparemment sans rapport ou poursuivez un motif récurrent. Laissez cette piste vous conduire à un moyen d’échapper à une menace, d’atteindre quelqu’un ou de contourner une difficulté de la nuit.

**2. Le miroir se fend** — Trouvez ce qui nourrit son refus, puis faites apparaître ce que sa lecture de la situation laisse dans l’ombre. Votre interlocuteur doit avoir une raison réelle de résister, et son acceptation doit l’engager au-delà des mots : un simple acquiescement ou un doute passager ne suffit pas.

**3. La toile murmure** — Retrouvez une personne dont la piste s’était perdue, découvrez un passage vers un lieu que l’on croyait inaccessible ou dénouez une situation où chaque issue semblait condamnée. Faites de votre lecture singulière des signes le moyen de franchir l’obstacle qui tenait l’affaire en échec.

**4. Le présage à contre-voix** — Face à une opposition établie, obtenez qu’une coterie ou quelques interlocuteurs modifient un plan important et le mettent à exécution malgré le risque. Vos présages peuvent rester incertains. Leur interprétation doit permettre de surmonter un obstacle concret, sans exiger l’oreille d’un Prince.

**5. Ce que la toile n’oublie pas** — Transmettez votre motif à un autre Malkavien, ou à un compagnon qui apprend à vous comprendre, puis jouez sa réinterprétation et son usage face à une difficulté réelle. Une transmission personnelle suffit. Le Réseau de Folie ne donne ici ni message universel ni savoir automatique.

Validation : Les perceptions ouvrent des pistes, pas des faits inventés. Le résultat doit être observable même si l’interprétation reste incertaine. Le rang 4 peut engager une coterie. Au rang 5, un seul destinataire suffit. Aucun comportement caricatural ni pouvoir collectif automatique.

### Nosferatu

**Axe : Recueillir, vérifier et faire circuler les secrets en préservant les invisibles qui les portent.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faites d’une personne bien placée une source régulière d’informations dans un milieu fermé, puis obtenez d’elle un renseignement que vous aurez pu vérifier sans révéler qui vous êtes réellement. |
| 2 — 5 pts | Donnez à un secret un chemin que les regards ne savent pas suivre. Établissez un relais discret, puis faites parvenir un renseignement vérifié à celui qui en a besoin sans livrer votre source à ceux qui la cherchent. |
| 3 — 8 pts | Allez chercher une vérité là où quelqu’un travaille à la garder ensevelie. Glissez-vous dans ses habitudes, ses échanges ou ses angles morts, puis rapportez de quoi agir sans abandonner derrière vous ceux qui vous ont ouvert le passage. |
| 4 — 12 pts | Identifiez les relais d’une surveillance organisée puis brisez, détournez ou corrompez son fonctionnement jusqu’à rendre les renseignements de vos adversaires incomplets, trompeurs ou dangereux à utiliser. |
| 5 — 0 pt | Placez entre d’autres mains une part des secrets que la ville vous a confiés. Préservez les voix qui les portent et les chemins qui les relient, afin qu’un silence de votre part ne condamne pas tous ceux qui dépendent de vos murmures. |

**1. Une oreille derrière le mur** — Gagnez la confiance d’un gardien, d’un technicien, d’un employé de nuit ou d’un habitué invisible aux yeux des puissants ; aménagez un moyen discret de communiquer avec lui et recoupez l’une de ses informations avant d’agir.

**2. Les voix sous la ville** — Une boîte morte, un intermédiaire ou un passage oublié peut suffire. Contournez une surveillance, une méfiance ou un accès fermé, puis jouez la transmission et la protection de son origine. Il n’est pas nécessaire de disposer de plusieurs informateurs.

**3. Une écharde dans la toile** — Interceptez une transmission protégée, infiltrez un lieu où se négocie un secret ou exfiltrez un informateur avec ses preuves. Vérifiez ce que vous avez recueilli et traitez le risque de découverte. Un adversaire et une source suffisent, sans infiltrer une organisation entière.

**4. Aveugler les guetteurs** — Repérez comment une surveillance remonte jusqu’à une source ou un refuge, puis coupez ou trompez ses relais malgré les précautions adverses. Vérifiez que la personne ou le lieu visé échappe effectivement à cette recherche. Quelques guetteurs peuvent porter toute l’intrigue.

**5. Les murmures demeurent** — Confiez à un relais les accès et les précautions nécessaires, puis laissez-le obtenir et transmettre un renseignement sans votre intervention. Éprouvez une solution de rechange lorsque le canal habituel devient dangereux. Une source, un successeur et un destinataire suffisent.

Validation : Information vérifiée, transmission accomplie et exposition traitée selon l’objectif. L’infiltration du rang 3 n’exige pas un réseau adverse entier. La surveillance du rang 4 doit être effectivement déjouée. Le rang 5 éprouve une relève et un canal de rechange à petite échelle.

### Toreador

**Axe : Faire de la fascination une création, une protection ou une influence par l’art et la sensibilité.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Gagnez une place reconnue dans un cercle artistique ou culturel jusque-là fermé en prouvant la valeur de votre regard, de votre talent ou de votre intervention. Votre présence doit désormais y être acceptée, recherchée ou difficile à écarter. |
| 2 — 5 pts | Donnez une forme ou une audience à ce qui a réveillé votre cœur mort. Par votre art, votre mécénat ou votre regard, arrachez une œuvre à l’obstacle qui la condamnait à rester inachevée, cachée ou défigurée. |
| 3 — 8 pts | Préservez une œuvre, un artiste ou un lieu auquel vous vous êtes attaché lorsque sa perte devient le choix le plus commode. Que votre fascination vous coûte quelque chose et laisse à cette beauté une chance réelle de durer. |
| 4 — 12 pts | Faites d’une rencontre autour de l’art le lieu où une rivalité change de visage. Par ce que vous montrez, ce que vous taisez et ceux que vous rapprochez, faites peser votre goût sur une décision que les seuls rapports de force tenaient figée. |
| 5 — 0 pt | Créez ou accompagnez une œuvre qu’un autre choisira de reprendre, de défendre ou de transformer. Acceptez que ce qui vous avait rendu un instant à la vie continue de toucher les vivants sans obéir tout à fait à votre désir. |

**1. Entrer dans la lumière** — Sauvez une exposition compromise, obtenez qu’un artiste vous introduise dans son cercle, imposez votre contribution à un événement sélectif ou transformez un premier refus en invitation durable.

**2. Le prix de la muse** — Achevez votre propre création malgré une contrainte réelle, obtenez pour un artiste un moyen qui lui manquait ou faites présenter une œuvre que quelqu’un cherchait à écarter. Jouez ce que cette réalisation change pour son créateur ou son public, sans exiger une carrière consacrée.

**3. Sauver la dernière beauté** — Soustrayez une œuvre à sa destruction, dénouez le chantage qui étouffe un créateur ou maintenez un lieu de création menacé. Surmontez les intérêts qui poussaient à sa disparition et obtenez une protection effective. Une pièce, un atelier ou un seul artiste suffit.

**4. Le salon des immortels** — Préparez une exposition intime, une représentation ou une réception malgré une opposition réelle. Servez-vous de l’œuvre et de sa présentation pour obtenir un soutien disputé, une réconciliation effective ou la fin d’une exclusion. Quelques invités suffisent, sans devenir l’arbitre culturel de la ville.

**5. L’œuvre vous échappe** — Laissez un interprète donner sa lecture de votre création, un protégé porter seul un projet ou un amateur sauver une œuvre à laquelle vous l’avez attaché. Jouez cette appropriation et ses conséquences. Une seule relation peut porter cet héritage.

Validation : L’obstacle à la création, à sa diffusion ou à sa préservation doit être résolu. Le rang 4 exige un effet social concret par l’art, malgré opposition. Ni célébrité, fortune, jugement esthétique du MJ ou talent artistique hors RP ne conditionnent les points.

### Ventrue

**Axe : Faire reconnaître une autorité en répondant de ses engagements, de ses dépendants et de sa succession.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Réclamez une responsabilité que l’on vous refuse, puis prouvez que votre parole protège autre chose que votre orgueil. Faites reconnaître votre place en réglant ce que les autres vous croyaient incapable de prendre en charge. |
| 2 — 5 pts | Engagez votre nom pour que des intérêts contraires puissent traiter. Lorsque vient le moment de payer, faites honorer les obligations que vous avez garanties et montrez ce que vaut une promesse placée sous votre sceau. |
| 3 — 8 pts | Gardez la charge des vôtres lorsqu’un revers rend votre autorité coûteuse. Tranchez entre des besoins incompatibles, assumez ce que votre décision exige et rétablissez ce qui permet encore à ceux qui vous suivent de tenir. |
| 4 — 12 pts | Réunissez sous votre garantie des volontés qui préféreraient se déchirer. Donnez à chacune une place, un dû et une obligation, puis faites tenir cet ordre lorsque l’un de ses adversaires tente d’en acheter la ruine. |
| 5 — 0 pt | Préparez quelqu’un à porter une responsabilité dont votre nom était devenu la clef. Transmettez les moyens, les obligations et la reconnaissance nécessaires, puis laissez sa décision engager l’ordre que vous avez bâti. |

**1. Le droit de réclamer** — Obtenez la charge d’un accès, d’une réserve ou d’un accord contesté et résolvez le problème qui menaçait ses bénéficiaires. Votre autorité doit être reconnue et exercée. Une responsabilité dans une coterie suffit, sans titre officiel ni fortune.

**2. La parole fait loi** — Négociez les termes d’un accord, garantissez une livraison, un droit de passage ou une protection, puis surmontez une résistance à son exécution. Jouez votre propre part du risque. Un contrat signé mais jamais appliqué ne suffit pas.

**3. Une couronne éprouvée** — Lors d’une perte de refuge, d’un conflit de chasse ou d’une rupture d’accord, obtenez une coopération contestée et remettez en service la ressource menacée. Vos restrictions de proies peuvent compliquer la décision sans imposer de jeûne artificiel. Donner des ordres ne suffit pas.

**4. Tenir la cour** — Établissez un partage de chasse, une défense ou une intendance commune entre quelques partenaires rivaux. Déjouez une contestation organisée et faites appliquer une décision difficile tout en remplissant vos engagements. Une coterie élargie peut constituer toute votre cour.

**5. Le trône après vous** — Confiez une charge précise à un successeur et obtenez que les partenaires concernés reconnaissent son mandat. Laissez-le résoudre un différend ou un imprévu sans décider à sa place, puis honorez les conséquences de cette délégation. Vous n’avez pas à quitter votre personnage.

Validation : Responsabilité reconnue et exercée, garantie honorée ou crise résolue. La légitimité se mesure aux obligations assumées. Le rang 4 fait fonctionner un accord collectif contesté, le rang 5 une délégation effective. Aucun titre politique ni usage obligatoire de Domination.

### Tremere

**Axe : Acquérir, pratiquer, développer et transmettre la science rituelle du sang.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Trouvez un rituel que vous ne connaissez pas, obtenez les moyens de l’apprendre et accomplissez-le pour la première fois. Faites du secret convoité une œuvre véritable, au prix de l’étude, des préparatifs et du sang. |
| 2 — 5 pts | Enrichissez votre répertoire en recherchant, en apprenant et en accomplissant plusieurs nouveaux rituels. De maître en manuscrit, nouez les relations et consentez aux échanges qui ouvriront les portes du savoir. Faites grandir votre science au-delà du premier secret, jusqu’à pouvoir choisir entre plusieurs œuvres du sang. |
| 3 — 8 pts | Engagez votre savoir au service d’un autre personnage et accomplissez le travail occulte convenu avec lui. Que votre maîtrise vous gagne une dette, une rémunération ou une confiance que les paroles seules n’auraient pas obtenue. |
| 4 — 12 pts | Menez une recherche rituelle là où vos notes ne suffisent plus. Reconstituez un rite lacunaire, résolvez l’échec d’un rituel connu ou développez une œuvre nouvelle, jusqu’à pouvoir reproduire ce que vos premières tentatives ne faisaient qu’entrevoir. |
| 5 — 0 pt | Rassemblez votre expérience en un enseignement transmissible et formez un autre Tremere à plusieurs rituels que vous maîtrisez. Laissez derrière vous des pages dont il saura comprendre les exigences et poursuivre l’usage sans attendre votre voix. |

**1. Le premier sceau** — Négociez un enseignement ou l’accès à un texte, rassemblez les composants nécessaires et préparez un lieu discret. Menez l’apprentissage selon les règles en vigueur, puis racontez l’exécution du rituel et son résultat.

**2. Les secrets se rassemblent** — Recherchez deux nouveaux rituels auprès de praticiens ou dans des ouvrages accessibles en jeu. Négociez des leçons, échangez un savoir ou rendez les services convenus pour obtenir cet enseignement. Réunissez les composants nécessaires, menez chaque apprentissage et accomplissez chacun des deux rituels avec succès.

**3. Le sang tient parole** — Employez un rituel maîtrisé pour résoudre le problème d’un commanditaire. Surmontez un obstacle établi dans l’accès aux composants, la préparation, la protection du lieu ou l’usage du résultat. Une exécution routinière et un simple échange de paiement ne suffisent pas.

**4. Un sceau de votre main** — Rassemblez les sources et les composants, éprouvez une hypothèse face à une difficulté occulte établie, puis consignez et reproduisez le résultat. Un rituel existant convient. Tout effet inédit reste soumis aux règles de création et à la validation du serveur.

**5. Le grimoire change de mains** — Organisez vos notes, consignez les leçons de votre pratique et accompagnez un élève dans ses apprentissages. Achevez la transmission lorsqu’il sait préparer et accomplir les rituels enseignés sans votre assistance.

Validation : Apprentissage, service, recherche ou transmission effectifs selon le rang. Les deux rituels du rang 2 ne se cumulent pas avec des récompenses de rang 1 pour les mêmes apprentissages. Le service du rang 3 doit surmonter un obstacle. Le rang 4 accepte un rite existant avec une difficulté de recherche réelle et un résultat reproduit. Création et enseignement restent soumis aux règles des pouvoirs.

### Lasombra

**Axe : Conquérir une prise sur les autres, gouverner par des relais et prouver son ambition dans l’épreuve.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Trouvez la main qui peut ouvrir une porte que votre présence refermerait. Gagnez son concours malgré ses réticences, puis obtenez par elle l’accès ou la concession dont vous avez besoin, à l’abri des regards qui vous attendaient ailleurs. |
| 2 — 5 pts | Poursuivez votre ambition lorsque l’appui sur lequel vous comptiez se dérobe. Trouvez ce que vous pouvez encore sacrifier, retourner ou saisir et obtenez le résultat que vos adversaires croyaient avoir rendu impossible. |
| 3 — 8 pts | Découvrez de quoi dépend celui qui vous barre la route et faites de cette dépendance votre levier. Laissez-lui le visage du pouvoir, si cela vous sert, mais obtenez qu’une décision importante porte désormais votre volonté. |
| 4 — 12 pts | Gardez votre prise lorsqu’un adversaire a compris d’où venait votre pouvoir. Déplacez vos relais, abandonnez ce qui doit l’être et retournez sa riposte jusqu’à préserver l’essentiel de votre entreprise. |
| 5 — 0 pt | Élevez un relais au point qu’il puisse vous contredire sans devenir inutile. Éprouvez ce qui vous lie lorsque son ambition rencontre la vôtre, puis faites naître de cette rivalité un arrangement que ni l’un ni l’autre ne tient pour une faveur. |

**1. La main invisible** — Convainquez un intermédiaire réticent d’obtenir une entrevue, un document ou un passage pour vous. Donnez-lui une raison d’agir et jouez la réalisation de la mission. Votre avantage doit venir de ce relais, sans exiger une influence déjà installée.

**2. L’épreuve du vide** — Après la perte établie d’un soutien, d’une couverture ou d’un accès, remplacez ce moyen et menez le projet à terme. Mettez en jeu le coût humain ou politique de votre méthode. Ne créez pas une perte de façade pour aussitôt l’annuler.

**3. L’ombre derrière le siège** — Prenez une place décisive dans son ravitaillement, ses soutiens ou l’exécution de ses projets, puis arrachez une concession malgré sa résistance. Quelques relations suffisent. Le levier doit fonctionner en jeu, sans supposer l’obéissance d’un partenaire.

**4. L’ombre tient le terrain** — Face à une attaque organisée contre vos intermédiaires ou votre couverture, reconstruisez une voie d’action et faites aboutir l’objectif contesté. La victoire doit venir de vos choix et de votre emprise indirecte. Les ténèbres surnaturelles restent un moyen éventuel, selon votre fiche.

**5. Celui qui peut vous défier** — Confiez une initiative réelle à un protégé ou un associé, jouez son désaccord sur les moyens ou les bénéfices et concluez un partage d’influence effectivement utilisé. Il n’est pas nécessaire de créer un Infant, de briser un lien surnaturel ou d’organiser une trahison.

Validation : La prise indirecte, la dépendance ou le rebond après un revers doit servir un résultat obtenu. Les rangs 1 et 3 distinguent un service ponctuel d’un levier sur une décision importante. Ni fonction religieuse, meurtre, trahison ni pouvoir des ténèbres obligatoires.

### Tzimisce

**Axe : Donner forme à ce que le Dragon appelle sien : seuil, possessions, chair et hospitalité.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Faites d’un lieu votre seuil : un endroit où l’invité sait ce qui lui est offert et ce qu’il ne peut prendre. Lorsque quelqu’un éprouve cette hospitalité, faites respecter vos conditions sans trahir la parole qui l’a laissé entrer. |
| 2 — 5 pts | Donnez à votre refuge, à votre corps ou à une possession la forme qu’une nécessité exige. Que l’œuvre cesse d’être un caprice du Dragon et devienne une réponse éprouvée à ce qui menaçait son repos, son secret ou son emprise. |
| 3 — 8 pts | Reprenez ce qu’une main étrangère a soustrait à votre garde. Retrouvez sa trace, affrontez la prétention de celui qui le retient et rétablissez une emprise que vos seuls mots ne suffisent plus à défendre. |
| 4 — 12 pts | Achevez une œuvre dans laquelle votre volonté a pris demeure. Faites de votre domaine ou d’une transformation autorisée un tout capable de remplir sa fonction malgré ceux qui veulent vous en déposséder ou le ramener à leur mesure. |
| 5 — 0 pt | Achevez de faire de votre corps ou de votre demeure une expression de ce que vous avez choisi de devenir. Quittez une ancienne manière d’exister et donnez à cette forme nouvelle une place réelle dans vos nuits. |

**1. Le seuil du Dragon** — Accueillez dans une chambre, un atelier ou un refuge dont vous disposez, puis réglez une demande ou une intrusion contraire aux termes annoncés. Obtenez le respect concret d’une limite ou d’une protection. Un château et un domaine politique ne sont pas nécessaires.

**2. Façonner ce qui est sien** — Remaniez un lieu pour une contrainte d’accueil ou de protection, ou réalisez une transformation permise par vos pouvoirs et les accords de jeu. Surmontez un obstacle matériel ou occulte, puis mettez le résultat à l’épreuve. La Vicissitude n’est pas un prérequis.

**3. Ce que le Dragon réclame** — Récupérez une possession liée à votre repos, un lieu occupé ou les moyens de poursuivre une transformation compromise. Résolvez aussi la prise qui rendait cette dépossession possible. Une personne protégée conserve ses propres choix et ne devient pas un bien par déclaration.

**4. Le domaine consacré** — Réunissez les ressources, les aménagements et les accords nécessaires à un refuge singulier, ou menez une métamorphose complexe selon les règles du serveur. Surmontez une opposition établie et éprouvez l’ensemble en situation. Un seul lieu ou un seul corps peut porter l’œuvre.

**5. La forme que vous avez choisie** — Jouez les conséquences d’une métamorphose autorisée ou d’un domaine profondément remanié : un nouvel usage, une hospitalité différente, un attachement abandonné. Mettez ce choix à l’épreuve d’une relation ou d’une contrainte. Aucun pouvoir supplémentaire ni abandon forcé de vos possessions n’en découle.

Validation : Hospitalité appliquée, transformation utile et éprouvée ou possession récupérée avec sa vulnérabilité traitée. Le rang 4 demande une œuvre complexe mise à l’épreuve. Le rang 5 joue une manière nouvelle d’exister. Aucun château, Vicissitude obligatoire ou droit sur un PJ par déclaration.

### Giovanni / Hecata

**Axe : Faire des attaches laissées par les morts une dette, un savoir ou un pouvoir entre les deux rives.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Retrouvez ce qu’un défunt a laissé d’inachevé et mettez la main sur l’attache qui permet encore d’agir en son nom. Dans une lettre, un objet ou une promesse, faites apparaître la dette que les vivants espéraient enterrer avec lui. |
| 2 — 5 pts | Négociez avec ceux que la mort lie encore : un esprit, un héritier ou le gardien d’un souvenir. Acquittez ce qu’ils exigent pour qu’un secret, un service ou un bien franchisse enfin la rive qui le retenait. |
| 3 — 8 pts | Remontez la chaîne par laquelle un mort continue de peser sur les vivants. Découvrez qui tient son souvenir, ses biens ou son esprit captif, puis dénouez ou détournez cette emprise pour changer réellement le sort de ceux qu’elle lie. |
| 4 — 12 pts | Faites tenir ensemble les exigences d’un disparu et les intérêts de ceux qui lui survivent. Lorsque chacun voudrait recueillir l’héritage sans en payer le prix, imposez un règlement qui donne aux dettes des morts une issue effective. |
| 5 — 0 pt | Choisissez ce que vous conserverez des dettes des morts et ce que vous consentirez enfin à clore. Réglez un héritage qui vous liait, puis remettez ce qui demeure à quelqu’un qui en connaît désormais le prix. |

**1. Ce que les morts réclament** — Obtenez un bien funéraire disputé, retrouvez un testament retenu ou vérifiez une obligation contestée, puis utilisez cette découverte pour obtenir un accès ou une restitution. Les archives et les proches suffisent, sans contact obligatoire avec un esprit.

**2. La dette au-delà du souffle** — Faites honorer une dernière volonté contre une information vérifiée, réglez un héritage en échange d’un accès ou obtenez le service d’un mort accessible selon vos pouvoirs. L’échange doit rencontrer une résistance et être accompli des deux côtés.

**3. Délier les ombres** — Retrouvez la preuve d’un héritage falsifié, soustrayez une attache à un maître chanteur ou traitez une contrainte nécromantique avec les moyens autorisés. Vérifiez la responsabilité et mettez fin au levier choisi. Résoudre un conflit d’héritiers constitue une voie sans pouvoir de nécromancie.

**4. L’accord des deux rives** — Dans une succession disputée, une obligation familiale ou une affaire de hantise, surmontez une opposition organisée et faites exécuter les concessions des parties. Un défunt, ses traces et quelques héritiers suffisent. Aucun esprit ne peut être invoqué sans les moyens de jeu nécessaires.

**5. Un héritage sans repos** — Restituez une attache, accomplissez une obligation ancienne ou transmettez une charge funéraire avec ses accès et ses conditions. Jouez son règlement ou sa prise en charge par un autre. La disparition d’un fantôme n’est pas obligatoire et ne s’obtient pas par simple déclaration.

Validation : Les attaches d’un défunt doivent être au cœur du résultat. Archives et héritiers permettent chaque étape sans apparition imposée. Un effet nécromantique exige les pouvoirs appropriés. Giovanni et Hecata gardent leurs distinctions historiques malgré la clé technique commune.

### Séthites / Ministère

**Axe : Reconnaître le désir, éprouver les interdits et conduire une initiation dont la liberté reste ambiguë.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Écoutez le désir caché sous une interdiction que quelqu’un défend encore. Offrez-lui une occasion de franchir cette limite, puis accompagnez le premier choix par lequel sa règle cesse de gouverner tous ses actes. |
| 2 — 5 pts | Faites éprouver à quelqu’un la liberté que vous lui promettez. Aidez-le à quitter une dépendance précise, mais laissez apparaître ce que votre porte ouverte lui demande en retour : confiance, dette ou nouvel attachement. |
| 3 — 8 pts | Portez votre tentation au cœur d’une certitude qui tient encore quelqu’un captif. Mettez à nu ce que son autorité exige, cache ou renie, puis faites de cette contradiction le passage par lequel une allégeance peut se défaire. |
| 4 — 12 pts | Ouvrez un lieu ou un cercle où ceux que vous avez ébranlés peuvent vivre autrement. Lorsque leurs anciennes attaches viennent réclamer leur dû, faites tenir votre promesse de délivrance et affrontez le prix de l’asile offert. |
| 5 — 0 pt | Laissez votre enseignement rencontrer sa plus inconfortable épreuve : quelqu’un qui s’en sert pour contester l’ascendant que vous avez pris sur lui. Faites de cette rupture une initiation achevée, ou refondez ouvertement le lien dont vous dissimuliez le prix. |

**1. La première entrave tombe** — Proposez une rencontre interdite, un savoir proscrit ou une faveur contraire à une loyauté établie. La personne doit choisir et accomplir une transgression qui change sa situation. Un interdit politique ou personnel suffit, sans vice imposé ni adhésion automatique.

**2. Le goût de la délivrance** — Rendez possible une décision jusque-là empêchée par un protecteur, un dogme ou une dette, puis jouez ses conséquences et votre place dans cette émancipation. Obtenez un changement concret au-delà d’une confession. Un lien de sang conserve ses règles propres.

**3. Le dogme fissuré** — Établissez une contradiction réelle entre une règle et les actes de son gardien, puis amenez un fidèle à retirer un soutien ou à choisir une voie jusque-là interdite malgré les représailles. Les faits doivent être établis en jeu et la décision appartient au personnage concerné.

**4. Le sanctuaire des désirs** — Une arrière-salle et quelques initiés suffisent. Organisez l’accueil et les ressources, puis résolvez une pression organisée qui menace leur accès ou leur autonomie. Le cercle doit effectivement permettre un choix auparavant empêché, sans exiger un temple ni une conversion de masse.

**5. Le serpent se retourne** — Jouez la contestation d’une dette, d’une règle ou d’une dépendance née de votre accompagnement. Accordez une autonomie effective ou négociez une nouvelle relation dont les conditions sont appliquées. Une conversation sans changement du lien ne clôt pas ce parcours.

Validation : Transgression, émancipation ou changement d’allégeance effectivement joués. L’initiation se distingue d’un simple service social par le désir et l’interdit qu’elle met à l’épreuve. Aucun vice particulier, acte sexuel ou consentement imposé. Le rang 5 traite aussi les dépendances créées par le mentor.

### Banu Haqim

**Axe : Enquêter, peser et faire appliquer un code jusque contre ses propres intérêts.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Recevez une accusation sans laisser la colère peser à la place des faits. Établissez ce qui a été transgressé, confrontez les versions et rendez un jugement dont vous pouvez défendre les raisons devant ceux qu’il engage. |
| 2 — 5 pts | Donnez à votre jugement une conséquence que la nuit ne puisse réduire à une menace. Retrouvez celui qui s’y soustrait, obtenez ce qui a été décidé et arrêtez votre main lorsque la mesure de la sentence est atteinte. |
| 3 — 8 pts | Poursuivez l’affaire lorsque le rang, la dette ou l’amitié voudraient soustraire quelqu’un à la balance. Ôtez ce qui empêche les faits d’être entendus, puis faites appliquer une réparation malgré ceux qui avaient intérêt au silence. |
| 4 — 12 pts | Appliquez votre code là où votre propre camp en souhaiterait l’oubli. Faites prévaloir les faits sur une loyauté commode et portez jusqu’à son exécution une décision dont vos alliés voudraient vous faire payer l’audace. |
| 5 — 0 pt | Soumettez votre propre conduite à la mesure dont vous avez pesé celle des autres. Là où votre code rencontre ses limites, acceptez d’en répondre et donnez à ceux qui le reprendront autre chose que la certitude d’avoir toujours raison. |

**1. La balance du sang** — Vérifiez une preuve disputée, cherchez ce qui peut contredire l’accusation et établissez une responsabilité ou une innocence jusque-là incertaine. Le code invoqué doit être explicite. Le titre de juge et une condamnation ne sont pas nécessaires.

**2. La sentence accomplie** — Faites restituer un bien, respecter une protection ou exécuter une réparation malgré un refus réel. Une traque peut conduire à cette issue sans imposer la mort de la cible. La peine doit répondre à des faits établis, et non servir de prétexte à une chasse ordinaire.

**3. Derrière les protections** — Protégez un témoignage menacé, déjouez une preuve falsifiée ou retirez le levier qui interdit à une victime de réclamer son dû. Obtenez ensuite la réparation ou la levée d’une accusation injuste. Un responsable local protégé par un seul allié influent peut suffire.

**4. Nul au-dessus du jugement** — Traitez un abus couvert par vos partenaires ou une accusation dirigée contre votre protégé. Surmontez leur opposition organisée et faites appliquer les obligations du jugement, y compris les vôtres. La difficulté vient du conflit de loyautés, sans exiger un ancien ou un dignitaire.

**5. La balance vous attend** — Faites examiner une de vos décisions contestées, établissez ce qu’elle a protégé et ce qu’elle a lésé, puis appliquez une réparation ou une obligation issue de cet examen. Transmettez ce précédent à un pair ou un élève qui pourra s’en servir, sans imposer une confession de faute inexistante.

Validation : Les faits doivent étayer le jugement. Les rangs 2 à 4 demandent son application, avec une opposition croissante et un conflit de loyautés au rang 4. Le rang 5 applique aussi le code au juge. Ni assassinat, titre ni condamnation systématique requis.

### Ravnos

**Axe : Faire agir une apparence trompeuse, puis conserver la liberté de quitter ses propres mensonges.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Offrez aux regards le récit qu’ils s’attendent à reconnaître, puis passez par la porte qu’ils vous fermaient. Faites de votre rôle, de votre détour ou de votre mise en scène le moyen d’atteindre quelque chose de réellement gardé. |
| 2 — 5 pts | Laissez derrière vous une histoire plus facile à suivre que vos pas. Donnez à un poursuivant de quoi croire qu’il tient votre trace, puis mettez cette erreur à profit pour soustraire quelqu’un ou quelque chose à sa portée. |
| 3 — 8 pts | Construisez une tromperie dont les pièces se répondent, jusqu’à ce que celui qui vous résiste agisse dans le monde que vous lui avez préparé. Obtenez par ce détour ce que la confrontation directe vous aurait fait perdre. |
| 4 — 12 pts | Affrontez un adversaire qui sait déjà que les apparences mentent. Faites de ses précautions une partie de votre mise en scène, jusqu’à retourner une chasse ou un piège organisé contre ceux qui croyaient vous y enfermer. |
| 5 — 0 pt | Quittez un visage dont les mensonges ont fini par vous retenir. Dénouez ce que cette identité engageait, sauvez ce que vous choisissez d’en garder et reprenez la route sans laisser vos compagnons payer seuls le prix de votre disparition. |

**1. Passer entre les regards** — Endossez une couverture crédible, détournez l’attention ou utilisez une illusion que vous possédez pour obtenir un passage, un objet ou une entrevue. Jouez la vigilance adverse et le résultat de la ruse. Un mensonge sans obstacle franchi ne suffit pas.

**2. La fausse piste** — Composez des indices, une diversion ou une substitution face à une recherche réelle. Obtenez une sortie ou un repli utilisable et vérifiez que la poursuite immédiate est déjouée. Les illusions sont facultatives, et leur effet dépend des règles et des réactions jouées.

**3. Le décor se referme** — Associez une couverture, un indice et une intervention complice, ou des moyens équivalents, pour détourner une garde ou provoquer un échange disputé. Adaptez la mise en scène à une vérification adverse et atteignez l’objectif. Une seule illusion lancée sans difficulté ne suffit pas.

**4. Le piège retourné** — Découvrez comment l’adversaire vérifie vos histoires, préparez une ruse qui tient compte de ces contrôles, puis sauvez la cible ou obtenez l’accès qu’il défendait. Les réactions adverses doivent être jouées. Ni une armée de complices ni la fuite hors de la ville ne sont requises.

**5. Un nom laissé derrière** — Abandonnez une couverture compromise, réglez ou transformez une obligation qu’elle portait et établissez une manière viable de poursuivre vos activités. Jouez les conséquences avec les personnes concernées. Changer de nom sur le papier ou quitter le serveur n’est pas l’objectif.

Validation : La tromperie doit contourner un obstacle et atteindre son objectif. Le rang 3 affronte une vérification, le rang 4 un adversaire préparé aux ruses. Aucun vol compulsif, illusion gratuite, voyage hors serveur ou réaction imposée.

### Salubri

**Axe : Soulager la souffrance et accompagner une autonomie sans transformer le soin en possession.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Approchez une souffrance dont les autres se détournent et obtenez de quoi la soulager. Faites place à celui qui la porte, même lorsque l’aider risque d’attirer les regards sur ce que vous êtes. |
| 2 — 5 pts | Accompagnez quelqu’un jusqu’à ce que la douleur ou la peur cesse de décider de chacun de ses gestes. Rendez-lui un moyen d’agir dont il était privé, sans faire de sa gratitude une nouvelle chaîne. |
| 3 — 8 pts | Poursuivez le secours lorsque votre compassion devient une piste que l’on peut remonter jusqu’à vous. Protégez celui que vous accompagnez et empêchez qu’en cherchant un guérisseur on ne trouve seulement une proie. |
| 4 — 12 pts | Refusez qu’une promesse de guérison devienne un instrument de captivité. Défaites l’emprise de ceux qui veulent disposer de vos dons ou de leurs bénéficiaires, tout en préservant le secours qu’ils menaçaient d’interrompre. |
| 5 — 0 pt | Accompagnez un être jusqu’au moment où il peut poursuivre son chemin sans attendre votre main. Transmettez ce qui lui permet de tenir et acceptez que sa guérison, sa paix ou sa liberté ne prennent pas la forme que vous espériez. |

**1. Un abri pour la douleur** — Obtenez un abri, des soins ou une assistance jusque-là refusés à une personne blessée ou traquée. Surmontez une méfiance ou un danger établi et jouez le secours reçu. L’aide matérielle convient sans don de guérison, et le bénéficiaire reste libre de ses choix.

**2. Délivrer sans posséder** — Rétablissez une capacité par des soins autorisés ou rendez possible une démarche concrète empêchée par une détresse établie, avec une aide adaptée. Faites jouer l’usage retrouvé de cette autonomie. Une écoute seule et une guérison psychique déclarée à la place de l’autre ne suffisent pas.

**3. Le troisième œil veille** — Face à une recherche établie visant votre sang, vos dons ou leur bénéficiaire, obtenez les moyens de mener le soin ou l’extraction à terme et déjouez la piste immédiate. Le risque peut rester celui d’un seul adversaire, sans imposer une chasse générale contre les Salubri.

**4. La miséricorde a un seuil** — Déjouez un chantage organisé sur l’accès aux soins, soustrayez un bénéficiaire à ceux qui exploitent sa détresse ou protégez un lieu de secours. Obtenez une continuité d’aide et la fin du levier choisi. Un guérisseur, un bénéficiaire et leurs partenaires peuvent porter cette épreuve.

**5. La main peut se retirer** — Préparez avec lui des appuis utilisables, puis jouez une difficulté qu’il traverse sans votre intervention décisive. Un relais peut poursuivre les soins nécessaires. Il ne s’agit ni d’imposer une guérison définitive ni d’atteindre automatiquement Golconde.

Validation : Secours reçu, autonomie effectivement exercée ou exploitation défaite. La protection reste liée à une personne et à son besoin de soin. Aucune guérison déclarée pour autrui, Golconde automatique ou chasse générale obligatoire.

### Gargouilles

**Axe : Passer du gardien façonné pour servir à la sentinelle qui choisit et fait respecter son serment.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Choisissez ce que vous garderez et pour qui vous tiendrez le seuil. Lorsque vient une menace, faites de votre vigilance la preuve d’un engagement dont les termes vous appartiennent, même si votre corps fut façonné pour obéir. |
| 2 — 5 pts | Lisez dans les murs ce qu’ils peuvent encore protéger. Préparez une défense à la mesure de votre corps et de vos sens, puis faites de ce lieu un obstacle que la menace ne parvient pas à franchir. |
| 3 — 8 pts | Défaites une prise par laquelle on prétend encore disposer de vous comme d’un outil. Faites respecter votre choix sans abandonner à la menace ceux que votre parole engage à protéger. |
| 4 — 12 pts | Gardez votre serment lorsqu’un adversaire a appris à se servir de votre devoir contre vous. Reprenez l’initiative, changez la manière de protéger et sauvez ce que vous aviez choisi de défendre sans redevenir l’arme de celui qui commande. |
| 5 — 0 pt | Donnez à votre veille une suite que personne n’aura à subir comme une servitude. Apprenez à un autre à garder, à décider et à refuser, puis laissez son engagement prendre le relais du vôtre. |

**1. Le gardien choisit** — Convenez d’une protection précise, puis empêchez une intrusion, une saisie ou une mise en danger réelle. Faites jouer les limites de votre engagement avec la personne protégée. Une garde sans incident et une simple proclamation de liberté ne suffisent pas.

**2. La pierre ne cède pas** — Repérez une faille, aménagez un poste ou un passage et mettez cette préparation à l’épreuve d’une intrusion ou d’une extraction difficile. Un escalier, une cour ou un toit suffit. Le vol et la Visceratika ne sont employés que si votre fiche les permet.

**3. Briser la main du maître** — Neutralisez un chantage sur votre refuge, contestez une obligation imposée ou obtenez la fin d’un ordre qui déborde votre engagement, puis exercez la liberté gagnée. Une autorité actuelle suffit, sans retrouver votre créateur. Toute contrainte surnaturelle suit ses propres règles.

**4. Le serment tient encore** — Déjouez une diversion, un siège ou un ultimatum organisé contre votre protégé ou votre refuge. Coordonnez une défense ou une évacuation et menez-la à terme malgré une faille exploitée. La protection peut concerner une seule personne, sans forteresse ni bataille générale.

**5. Des ailes sans chaînes** — Transmettez les moyens d’une protection et convenez d’une relève volontaire, puis laissez ce gardien répondre à un incident sans vos ordres. Il peut appartenir à un autre clan. La liberté réside dans les termes effectivement respectés du serment, sans obligation de rompre toute loyauté.

Validation : Protection éprouvée et engagements librement définis ou renégociés. Chaque rang relie garde, architecture ou servitude à une réalisation. La liberté ne supprime pas une contrainte surnaturelle par simple décision. Créateur présent, armée et forteresse inutiles.

### Samedi

**Axe : Faire de sa condition cadavérique un moyen d’agir, puis conquérir une place au-delà de cette utilité.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Obtenez une place là où votre corps vous condamnait à rester dehors. Trouvez un passage, un arrangement ou un interlocuteur qui rende possible votre présence sans livrer votre nature aux regards des vivants. |
| 2 — 5 pts | Faites de votre proximité avec le cadavre une erreur dans le regard de ceux qui vous surveillent. Traversez ce qu’ils réservent aux morts, puis relevez-vous là où votre présence peut encore changer l’issue de la nuit. |
| 3 — 8 pts | Portez l’image de la mort là où quelqu’un se croyait à l’abri de ses conséquences. Faites de cette confrontation un levier pour obtenir ce que l’on vous refusait, puis traitez les traces que votre apparition menace de laisser. |
| 4 — 12 pts | Faites reconnaître votre place à ceux qui ne voulaient de vous que pour les besognes dont ils détournent les yeux. Quand votre condition leur sert de prétexte pour vous priver de votre dû, rendez cette exclusion impossible à maintenir. |
| 5 — 0 pt | Faites vivre auprès de quelqu’un ce que la tombe n’a pas emporté de vous. Donnez à cette relation une place qui ne dépende ni du dégoût, ni de la peur, ni des services que votre corps permet de rendre. |

**1. Franchir le dégoût** — Gagnez un accès utilisable à une morgue, un refuge ou un lieu de rencontre malgré les contraintes de votre apparence cadavérique. Jouez la couverture et l’obstacle rencontré. Cacher simplement votre visage ou décrire le dégoût des autres ne suffit pas.

**2. Ce que l’on prend pour un mort** — Exploitez une méprise sur votre état, un transport funéraire ou une mise en scène macabre pour franchir une garde, échapper à une recherche ou atteindre un objet protégé. Adaptez la ruse aux vérifications réellement jouées. Votre apparence n’accorde aucune immunité nouvelle.

**3. La peur a un prix** — Préparez une confrontation macabre avec une cible qui vous résiste et obtenez un retrait, un accès ou une restitution. L’effroi dépend de sa réaction ou des pouvoirs autorisés. Résolvez le risque d’exposition créé par la scène, sans imposer la terreur ni une contagion imaginaire.

**4. La part des revenants** — Dans une affaire funéraire ou une opération où votre condition a compté, déjouez une manœuvre organisée pour vous sacrifier ou vous écarter. Obtenez votre part, une protection ou un accès durable, puis exercez ce droit malgré la résistance. Un groupe local suffit.

**5. Un nom au-delà du corps** — Partagez un savoir, un attachement ou une œuvre, puis faites traverser à ce lien une difficulté liée à votre condition. Jouez l’engagement réciproque qui en résulte au-delà d’une commande macabre. Votre apparence demeure, mais elle ne résume plus votre place auprès de cette personne.

Validation : Le parcours suit la condition cadavérique déjà retenue dans les fiches du serveur, sans lui ajouter une malédiction d’une autre édition. Accès, ruse, effroi ou droit doivent produire un résultat joué. Aucune peur imposée, contagion gratuite ni nécromancie obligatoire.

### Filles de la Cacophonie

**Axe : Faire du chant un langage agissant, maîtriser sa portée et transmettre sa musique intérieure.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Tirez du tumulte intérieur une voix capable d’atteindre quelqu’un qui se fermait à vous. Que le chant ouvre une écoute, une rencontre ou un passage que vos paroles ordinaires n’obtenaient pas. |
| 2 — 5 pts | Donnez à votre mélodie quelque chose qu’il faut faire entendre malgré ceux qui voudraient l’étouffer. Portez un avertissement, une invitation ou une vérité jusqu’à son destinataire et faites du chant le chemin de sa réception. |
| 3 — 8 pts | Faites de votre voix l’instrument d’un changement précis au milieu d’émotions qui menacent de tout emporter. Trouvez à qui adresser le chant, ce qu’il doit atteindre et la limite au-delà de laquelle votre œuvre vous échapperait. |
| 4 — 12 pts | Faites parvenir votre œuvre à son terme alors qu’un adversaire connaît sa portée et cherche à vous réduire au silence. Changez le lieu, les relais ou la manière de chanter jusqu’à faire aboutir ce que votre voix devait permettre. |
| 5 — 0 pt | Confiez à une autre voix un fragment de la musique qui vous habite. Laissez-la en trouver le souffle, les silences et les blessures, jusqu’à ce qu’elle puisse porter votre chant sans devenir votre écho. |

**1. Une voix franchit la porte** — Préparez une adresse chantée, un air ou une intervention vocale pour obtenir une audience réellement refusée ou rétablir un échange interrompu. Jouez la réaction de l’interlocuteur et l’accès obtenu. Aucun enregistrement ni talent musical hors RP n’est demandé.

**2. Le chant perce le silence** — Cachez un message dans un refrain convenu, détournez l’attention par une prestation ou employez un pouvoir vocal maîtrisé. Contournez un obstacle à la transmission et jouez la compréhension du message. La voix ne traverse pas automatiquement les murs ni les distances.

**3. La juste dissonance** — Dans une confrontation tendue, obtenez par une intervention chantée une trêve appliquée, une diversion décisive ou la reprise d’une coopération rompue. Surmontez une perturbation réelle. L’émotion et les effets surnaturels suivent les réactions jouées et les pouvoirs possédés, sans emprise automatique.

**4. La voix qu’on voulait éteindre** — Face à un sabotage ou une interdiction organisée, préparez et menez une intervention vocale qui rend possible une extraction, une rencontre décisive ou la fin d’un affrontement. Quelques auditeurs suffisent. La réussite tient à l’effet obtenu, sans concert public ni manipulation d’une foule.

**5. D’autres voix après vous** — Transmettez un répertoire, une technique ou une œuvre et accompagnez sa réinterprétation. Jouez une situation où cette personne l’emploie seule pour atteindre quelqu’un ou surmonter une difficulté. L’enseignement artistique ne transmet pas automatiquement Melpominée ni une autre Discipline.

Validation : La voix chantée doit être le moyen décisif de l’accès, de la transmission ou du changement obtenu. Applaudissements et narration de chant ne suffisent pas. Aucun chant hors RP, salle de spectacle ou public nombreux requis. La portée et les effets suivent la fiche.

### Baali

**Axe : Approcher un secret infernal, engager une dette et en affronter les exigences sans les banaliser.**

| Niveau | Réalisations possibles |
|---|---|
| 1 — 3 pts | Suivez la trace d’un savoir infernal que quelqu’un a voulu cacher, puis obtenez de quoi en comprendre un usage ou un danger. Gardez assez d’ombre autour de votre recherche pour que le secret gagné ne devienne pas aussitôt votre condamnation. |
| 2 — 5 pts | Acquittez une exigence précise d’un engagement infernal, ou obtenez d’en déplacer le prix. Faites apparaître ce que votre promesse prend dans vos nuits, au-delà des mots que l’on prononce devant une flamme. |
| 3 — 8 pts | Amenez quelqu’un à rendre un service qui nourrit votre entreprise occulte malgré ses réticences. Faites du bénéfice promis le voile sous lequel avance une dette dont vous connaissez mieux que lui la portée. |
| 4 — 12 pts | Affrontez le moment où votre entreprise infernale menace de dévorer ce qui la rendait possible. Contenez, détournez ou accomplissez l’exigence qui revient vers vous, et sauvez de cette crise ce que vous refusez encore de livrer. |
| 5 — 0 pt | Donnez une issue à un engagement dont le prix a façonné votre existence. Honorez-le, renégociez-le ou brisez sa prise si vous en avez les moyens, puis vivez ce que cette décision laisse dans vos liens et dans votre sang. |

**1. Les cendres du secret** — Récupérez un fragment disputé, déchiffrez un témoignage avec les moyens disponibles ou négociez l’accès à un objet déjà établi en jeu. Vérifiez ce qu’il apprend et traitez une trace compromettante. Découvrir un nom n’invoque rien et ne confère aucun pouvoir.

**2. Le prix du pacte** — Pour un engagement établi en jeu, récupérez un objet, gardez un secret menacé ou rendez le service exigé malgré un obstacle. Un intermédiaire, une clause écrite ou un signe convenu peut porter l’intrigue. Ni invocation nouvelle ni sacrifice ne sont obligatoires.

**3. L’offrande sous le voile** — Obtenez la garde d’un objet, l’ouverture d’un lieu ou le silence d’un intermédiaire en surmontant sa méfiance. Le service doit avoir une fonction infernale établie dans l’intrigue et être réellement rendu. La tromperie du personnage ne dispense pas des accords entre joueurs sur la scène.

**4. Ce qui réclame son dû** — Traitez un objet compromis, une clause devenue dangereuse ou un dépositaire qui retourne vos engagements contre vous. Surmontez une opposition organisée et obtenez une issue vérifiable avec les moyens autorisés. Une affaire locale suffit, sans démon incarné ni menace apocalyptique.

**5. La dette ultime** — Résolvez les obligations d’un pacte établi et jouez au moins une conséquence durable de cette issue. Un objet ou un intermédiaire peut représenter le créancier. Aucun abandon de pacte ne supprime de lui-même une malédiction, une dette ou un pouvoir selon votre seule volonté.

Validation : Le secret, la clause ou l’entreprise infernale doit être établi dans l’intrigue. L’objectif ne crée ni entité, ni pouvoir, ni pacte aux effets automatiques. Un objet et un intermédiaire suffisent. Aucun sacrifice croissant ou événement apocalyptique requis.

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
