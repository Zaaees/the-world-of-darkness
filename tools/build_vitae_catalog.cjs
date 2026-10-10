// Editorial import from the approved proposal; runtime uses the generated JSON.
const fs = require('node:fs');
const source = fs.readFileSync('docs/proposition_progression_vitae_v2.md', 'utf8');
const entries = [
  [
    "Brujah",
    "brujah",
    "Le prix du refus|Les voix qui se lèvent|Le feu des idées|Un ordre nouveau|La cause vous survivra",
    "Défiez une interdiction pour venir en aide à quelqu’un, faites rendre un bien confisqué ou mettez fin à une intimidation. Le refus doit produire son effet malgré une résistance, et ses conséquences doivent être jouées.|Entraînez un ou plusieurs compagnons dans une contestation qui aboutit : défendre une personne menacée, faire lever une sanction ou ouvrir un accès réservé. Leur engagement doit peser sur le résultat. Une foule et un discours ne sont pas nécessaires.|Mettez au jour la contradiction d’un adversaire, ralliez un soutien qui vous résistait ou défendez vos principes au prix d’un avantage réel. Obtenez ainsi une réparation, la fin d’une contrainte ou la réussite d’une action jusque-là empêchée. Le débat seul ne suffit pas.|Changez le partage d’une ressource, les obligations d’une coterie ou les conditions d’accès à un lieu. Faites appliquer cette alternative malgré une tentative réelle de rétablir l’ancien usage. Un conflit local suffit, sans renverser le pouvoir de la ville.|Confiez un combat à un compagnon, transmettez les moyens de le poursuivre et laissez-le conduire une action concrète à sa manière. La cause doit vivre dans ses choix, même lorsqu’ils s’écartent des vôtres. Votre départ et la fondation d’un mouvement ne sont pas requis."
  ],
  [
    "Gangrel",
    "gangrel",
    "La nuit sans murs|Ce que la pluie n’efface pas|Les pactes de la lisière|Les routes n’ont pas de prince|Ce que la piste enseigne",
    "Dans une friche, sur les toits ou le long des berges, surmontez un obstacle de terrain ou une présence hostile et éprouvez un repli utilisable avant l’aube. Des compagnons peuvent vous aider. Une promenade et la désignation d’une cache ne suffisent pas.|Suivez des habitudes de déplacement, des traces physiques, des témoins marginaux ou le comportement des animaux ; reconstituez le passage d’un fugitif, retrouvez un vampire qui ne veut pas l’être ou découvrez où une proie, un messager ou un intrus a réellement disparu.|Entendez-vous avec un voisin ou un compagnon sur une limite, un abri ou un avertissement, puis résolvez l’intrusion, la pénurie ou la traque qui met l’accord à l’épreuve. Le lien se prouve dans l’entraide et la connaissance du terrain, sans exiger une assemblée de Gangrel.|Préparez un itinéraire et un repli, puis conduisez au moins un compagnon à travers une surveillance ou une traque organisée. Surmontez la perte d’un passage ou une autre complication établie. Une traversée décisive suffit, sans posséder un réseau à l’échelle de la ville.|Transmettez vos repères, les usages des prédateurs locaux et les solutions de repli, puis laissez votre compagnon mener une traversée ou une recherche de refuge avec un imprévu réel. Il doit adapter ce savoir sans attendre vos instructions."
  ],
  [
    "Malkavien",
    "malkavian",
    "La fissure du réel|Le miroir se fend|La toile murmure|Le présage à contre-voix|Ce que la toile n’oublie pas",
    "Attachez-vous à un détail que tous écartent, rapprochez des paroles apparemment sans rapport ou poursuivez un motif récurrent. Laissez cette piste vous conduire à un moyen d’échapper à une menace, d’atteindre quelqu’un ou de contourner une difficulté de la nuit.|Trouvez ce qui nourrit son refus, puis faites apparaître ce que sa lecture de la situation laisse dans l’ombre. Votre interlocuteur doit avoir une raison réelle de résister, et son acceptation doit l’engager au-delà des mots : un simple acquiescement ou un doute passager ne suffit pas.|Retrouvez une personne dont la piste s’était perdue, découvrez un passage vers un lieu que l’on croyait inaccessible ou dénouez une situation où chaque issue semblait condamnée. Faites de votre lecture singulière des signes le moyen de franchir l’obstacle qui tenait l’affaire en échec.|Face à une opposition établie, obtenez qu’une coterie ou quelques interlocuteurs modifient un plan important et le mettent à exécution malgré le risque. Vos présages peuvent rester incertains. Leur interprétation doit permettre de surmonter un obstacle concret, sans exiger l’oreille d’un Prince.|Transmettez votre motif à un autre Malkavien, ou à un compagnon qui apprend à vous comprendre, puis jouez sa réinterprétation et son usage face à une difficulté réelle. Une transmission personnelle suffit. Le Réseau de Folie ne donne ici ni message universel ni savoir automatique."
  ],
  [
    "Nosferatu",
    "nosferatu",
    "Une oreille derrière le mur|Les voix sous la ville|Une écharde dans la toile|Aveugler les guetteurs|Les murmures demeurent",
    "Gagnez la confiance d’un gardien, d’un technicien, d’un employé de nuit ou d’un habitué invisible aux yeux des puissants ; aménagez un moyen discret de communiquer avec lui et recoupez l’une de ses informations avant d’agir.|Une boîte morte, un intermédiaire ou un passage oublié peut suffire. Contournez une surveillance, une méfiance ou un accès fermé, puis jouez la transmission et la protection de son origine. Il n’est pas nécessaire de disposer de plusieurs informateurs.|Interceptez une transmission protégée, infiltrez un lieu où se négocie un secret ou exfiltrez un informateur avec ses preuves. Vérifiez ce que vous avez recueilli et traitez le risque de découverte. Un adversaire et une source suffisent, sans infiltrer une organisation entière.|Repérez comment une surveillance remonte jusqu’à une source ou un refuge, puis coupez ou trompez ses relais malgré les précautions adverses. Vérifiez que la personne ou le lieu visé échappe effectivement à cette recherche. Quelques guetteurs peuvent porter toute l’intrigue.|Confiez à un relais les accès et les précautions nécessaires, puis laissez-le obtenir et transmettre un renseignement sans votre intervention. Éprouvez une solution de rechange lorsque le canal habituel devient dangereux. Une source, un successeur et un destinataire suffisent."
  ],
  [
    "Toreador",
    "toreador",
    "Entrer dans la lumière|Le prix de la muse|Sauver la dernière beauté|Le salon des immortels|L’œuvre vous échappe",
    "Sauvez une exposition compromise, obtenez qu’un artiste vous introduise dans son cercle, imposez votre contribution à un événement sélectif ou transformez un premier refus en invitation durable.|Achevez votre propre création malgré une contrainte réelle, obtenez pour un artiste un moyen qui lui manquait ou faites présenter une œuvre que quelqu’un cherchait à écarter. Jouez ce que cette réalisation change pour son créateur ou son public, sans exiger une carrière consacrée.|Soustrayez une œuvre à sa destruction, dénouez le chantage qui étouffe un créateur ou maintenez un lieu de création menacé. Surmontez les intérêts qui poussaient à sa disparition et obtenez une protection effective. Une pièce, un atelier ou un seul artiste suffit.|Préparez une exposition intime, une représentation ou une réception malgré une opposition réelle. Servez-vous de l’œuvre et de sa présentation pour obtenir un soutien disputé, une réconciliation effective ou la fin d’une exclusion. Quelques invités suffisent, sans devenir l’arbitre culturel de la ville.|Laissez un interprète donner sa lecture de votre création, un protégé porter seul un projet ou un amateur sauver une œuvre à laquelle vous l’avez attaché. Jouez cette appropriation et ses conséquences. Une seule relation peut porter cet héritage."
  ],
  [
    "Ventrue",
    "ventrue",
    "Le droit de réclamer|La parole fait loi|Une couronne éprouvée|Tenir la cour|Le trône après vous",
    "Obtenez la charge d’un accès, d’une réserve ou d’un accord contesté et résolvez le problème qui menaçait ses bénéficiaires. Votre autorité doit être reconnue et exercée. Une responsabilité dans une coterie suffit, sans titre officiel ni fortune.|Négociez les termes d’un accord, garantissez une livraison, un droit de passage ou une protection, puis surmontez une résistance à son exécution. Jouez votre propre part du risque. Un contrat signé mais jamais appliqué ne suffit pas.|Lors d’une perte de refuge, d’un conflit de chasse ou d’une rupture d’accord, obtenez une coopération contestée et remettez en service la ressource menacée. Vos restrictions de proies peuvent compliquer la décision sans imposer de jeûne artificiel. Donner des ordres ne suffit pas.|Établissez un partage de chasse, une défense ou une intendance commune entre quelques partenaires rivaux. Déjouez une contestation organisée et faites appliquer une décision difficile tout en remplissant vos engagements. Une coterie élargie peut constituer toute votre cour.|Confiez une charge précise à un successeur et obtenez que les partenaires concernés reconnaissent son mandat. Laissez-le résoudre un différend ou un imprévu sans décider à sa place, puis honorez les conséquences de cette délégation. Vous n’avez pas à quitter votre personnage."
  ],
  [
    "Tremere",
    "tremere",
    "Le premier sceau|Les secrets se rassemblent|Le sang tient parole|Un sceau de votre main|Le grimoire change de mains",
    "Négociez un enseignement ou l’accès à un texte, rassemblez les composants nécessaires et préparez un lieu discret. Menez l’apprentissage selon les règles en vigueur, puis racontez l’exécution du rituel et son résultat.|Recherchez deux nouveaux rituels auprès de praticiens ou dans des ouvrages accessibles en jeu. Négociez des leçons, échangez un savoir ou rendez les services convenus pour obtenir cet enseignement. Réunissez les composants nécessaires, menez chaque apprentissage et accomplissez chacun des deux rituels avec succès.|Employez un rituel maîtrisé pour résoudre le problème d’un commanditaire. Surmontez un obstacle établi dans l’accès aux composants, la préparation, la protection du lieu ou l’usage du résultat. Une exécution routinière et un simple échange de paiement ne suffisent pas.|Rassemblez les sources et les composants, éprouvez une hypothèse face à une difficulté occulte établie, puis consignez et reproduisez le résultat. Un rituel existant convient. Tout effet inédit reste soumis aux règles de création et à la validation du serveur.|Organisez vos notes, consignez les leçons de votre pratique et accompagnez un élève dans ses apprentissages. Achevez la transmission lorsqu’il sait préparer et accomplir les rituels enseignés sans votre assistance."
  ],
  [
    "Lasombra",
    "lasombra",
    "La main invisible|L’épreuve du vide|L’ombre derrière le siège|L’ombre tient le terrain|Celui qui peut vous défier",
    "Convainquez un intermédiaire réticent d’obtenir une entrevue, un document ou un passage pour vous. Donnez-lui une raison d’agir et jouez la réalisation de la mission. Votre avantage doit venir de ce relais, sans exiger une influence déjà installée.|Après la perte établie d’un soutien, d’une couverture ou d’un accès, remplacez ce moyen et menez le projet à terme. Mettez en jeu le coût humain ou politique de votre méthode. Ne créez pas une perte de façade pour aussitôt l’annuler.|Prenez une place décisive dans son ravitaillement, ses soutiens ou l’exécution de ses projets, puis arrachez une concession malgré sa résistance. Quelques relations suffisent. Le levier doit fonctionner en jeu, sans supposer l’obéissance d’un partenaire.|Face à une attaque organisée contre vos intermédiaires ou votre couverture, reconstruisez une voie d’action et faites aboutir l’objectif contesté. La victoire doit venir de vos choix et de votre emprise indirecte. Les ténèbres surnaturelles restent un moyen éventuel, selon votre fiche.|Confiez une initiative réelle à un protégé ou un associé, jouez son désaccord sur les moyens ou les bénéfices et concluez un partage d’influence effectivement utilisé. Il n’est pas nécessaire de créer un Infant, de briser un lien surnaturel ou d’organiser une trahison."
  ],
  [
    "Tzimisce",
    "tzimisce",
    "Le seuil du Dragon|Façonner ce qui est sien|Ce que le Dragon réclame|Le domaine consacré|La forme que vous avez choisie",
    "Accueillez dans une chambre, un atelier ou un refuge dont vous disposez, puis réglez une demande ou une intrusion contraire aux termes annoncés. Obtenez le respect concret d’une limite ou d’une protection. Un château et un domaine politique ne sont pas nécessaires.|Remaniez un lieu pour une contrainte d’accueil ou de protection, ou réalisez une transformation permise par vos pouvoirs et les accords de jeu. Surmontez un obstacle matériel ou occulte, puis mettez le résultat à l’épreuve. La Vicissitude n’est pas un prérequis.|Récupérez une possession liée à votre repos, un lieu occupé ou les moyens de poursuivre une transformation compromise. Résolvez aussi la prise qui rendait cette dépossession possible. Une personne protégée conserve ses propres choix et ne devient pas un bien par déclaration.|Réunissez les ressources, les aménagements et les accords nécessaires à un refuge singulier, ou menez une métamorphose complexe selon les règles du serveur. Surmontez une opposition établie et éprouvez l’ensemble en situation. Un seul lieu ou un seul corps peut porter l’œuvre.|Jouez les conséquences d’une métamorphose autorisée ou d’un domaine profondément remanié : un nouvel usage, une hospitalité différente, un attachement abandonné. Mettez ce choix à l’épreuve d’une relation ou d’une contrainte. Aucun pouvoir supplémentaire ni abandon forcé de vos possessions n’en découle."
  ],
  [
    "Giovanni / Hecata",
    "giovanni",
    "Ce que les morts réclament|La dette au-delà du souffle|Délier les ombres|L’accord des deux rives|Un héritage sans repos",
    "Obtenez un bien funéraire disputé, retrouvez un testament retenu ou vérifiez une obligation contestée, puis utilisez cette découverte pour obtenir un accès ou une restitution. Les archives et les proches suffisent, sans contact obligatoire avec un esprit.|Faites honorer une dernière volonté contre une information vérifiée, réglez un héritage en échange d’un accès ou obtenez le service d’un mort accessible selon vos pouvoirs. L’échange doit rencontrer une résistance et être accompli des deux côtés.|Retrouvez la preuve d’un héritage falsifié, soustrayez une attache à un maître chanteur ou traitez une contrainte nécromantique avec les moyens autorisés. Vérifiez la responsabilité et mettez fin au levier choisi. Résoudre un conflit d’héritiers constitue une voie sans pouvoir de nécromancie.|Dans une succession disputée, une obligation familiale ou une affaire de hantise, surmontez une opposition organisée et faites exécuter les concessions des parties. Un défunt, ses traces et quelques héritiers suffisent. Aucun esprit ne peut être invoqué sans les moyens de jeu nécessaires.|Restituez une attache, accomplissez une obligation ancienne ou transmettez une charge funéraire avec ses accès et ses conditions. Jouez son règlement ou sa prise en charge par un autre. La disparition d’un fantôme n’est pas obligatoire et ne s’obtient pas par simple déclaration."
  ],
  [
    "Séthites / Ministère",
    "setite",
    "La première entrave tombe|Le goût de la délivrance|Le dogme fissuré|Le sanctuaire des désirs|Le serpent se retourne",
    "Proposez une rencontre interdite, un savoir proscrit ou une faveur contraire à une loyauté établie. La personne doit choisir et accomplir une transgression qui change sa situation. Un interdit politique ou personnel suffit, sans vice imposé ni adhésion automatique.|Rendez possible une décision jusque-là empêchée par un protecteur, un dogme ou une dette, puis jouez ses conséquences et votre place dans cette émancipation. Obtenez un changement concret au-delà d’une confession. Un lien de sang conserve ses règles propres.|Établissez une contradiction réelle entre une règle et les actes de son gardien, puis amenez un fidèle à retirer un soutien ou à choisir une voie jusque-là interdite malgré les représailles. Les faits doivent être établis en jeu et la décision appartient au personnage concerné.|Une arrière-salle et quelques initiés suffisent. Organisez l’accueil et les ressources, puis résolvez une pression organisée qui menace leur accès ou leur autonomie. Le cercle doit effectivement permettre un choix auparavant empêché, sans exiger un temple ni une conversion de masse.|Jouez la contestation d’une dette, d’une règle ou d’une dépendance née de votre accompagnement. Accordez une autonomie effective ou négociez une nouvelle relation dont les conditions sont appliquées. Une conversation sans changement du lien ne clôt pas ce parcours."
  ],
  [
    "Banu Haqim",
    "banu_haqim",
    "La balance du sang|La sentence accomplie|Derrière les protections|Nul au-dessus du jugement|La balance vous attend",
    "Vérifiez une preuve disputée, cherchez ce qui peut contredire l’accusation et établissez une responsabilité ou une innocence jusque-là incertaine. Le code invoqué doit être explicite. Le titre de juge et une condamnation ne sont pas nécessaires.|Faites restituer un bien, respecter une protection ou exécuter une réparation malgré un refus réel. Une traque peut conduire à cette issue sans imposer la mort de la cible. La peine doit répondre à des faits établis, et non servir de prétexte à une chasse ordinaire.|Protégez un témoignage menacé, déjouez une preuve falsifiée ou retirez le levier qui interdit à une victime de réclamer son dû. Obtenez ensuite la réparation ou la levée d’une accusation injuste. Un responsable local protégé par un seul allié influent peut suffire.|Traitez un abus couvert par vos partenaires ou une accusation dirigée contre votre protégé. Surmontez leur opposition organisée et faites appliquer les obligations du jugement, y compris les vôtres. La difficulté vient du conflit de loyautés, sans exiger un ancien ou un dignitaire.|Faites examiner une de vos décisions contestées, établissez ce qu’elle a protégé et ce qu’elle a lésé, puis appliquez une réparation ou une obligation issue de cet examen. Transmettez ce précédent à un pair ou un élève qui pourra s’en servir, sans imposer une confession de faute inexistante."
  ],
  [
    "Ravnos",
    "ravnos",
    "Passer entre les regards|La fausse piste|Le décor se referme|Le piège retourné|Un nom laissé derrière",
    "Endossez une couverture crédible, détournez l’attention ou utilisez une illusion que vous possédez pour obtenir un passage, un objet ou une entrevue. Jouez la vigilance adverse et le résultat de la ruse. Un mensonge sans obstacle franchi ne suffit pas.|Composez des indices, une diversion ou une substitution face à une recherche réelle. Obtenez une sortie ou un repli utilisable et vérifiez que la poursuite immédiate est déjouée. Les illusions sont facultatives, et leur effet dépend des règles et des réactions jouées.|Associez une couverture, un indice et une intervention complice, ou des moyens équivalents, pour détourner une garde ou provoquer un échange disputé. Adaptez la mise en scène à une vérification adverse et atteignez l’objectif. Une seule illusion lancée sans difficulté ne suffit pas.|Découvrez comment l’adversaire vérifie vos histoires, préparez une ruse qui tient compte de ces contrôles, puis sauvez la cible ou obtenez l’accès qu’il défendait. Les réactions adverses doivent être jouées. Ni une armée de complices ni la fuite hors de la ville ne sont requises.|Abandonnez une couverture compromise, réglez ou transformez une obligation qu’elle portait et établissez une manière viable de poursuivre vos activités. Jouez les conséquences avec les personnes concernées. Changer de nom sur le papier ou quitter le serveur n’est pas l’objectif."
  ],
  [
    "Salubri",
    "salubri",
    "Un abri pour la douleur|Délivrer sans posséder|Le troisième œil veille|La miséricorde a un seuil|La main peut se retirer",
    "Obtenez un abri, des soins ou une assistance jusque-là refusés à une personne blessée ou traquée. Surmontez une méfiance ou un danger établi et jouez le secours reçu. L’aide matérielle convient sans don de guérison, et le bénéficiaire reste libre de ses choix.|Rétablissez une capacité par des soins autorisés ou rendez possible une démarche concrète empêchée par une détresse établie, avec une aide adaptée. Faites jouer l’usage retrouvé de cette autonomie. Une écoute seule et une guérison psychique déclarée à la place de l’autre ne suffisent pas.|Face à une recherche établie visant votre sang, vos dons ou leur bénéficiaire, obtenez les moyens de mener le soin ou l’extraction à terme et déjouez la piste immédiate. Le risque peut rester celui d’un seul adversaire, sans imposer une chasse générale contre les Salubri.|Déjouez un chantage organisé sur l’accès aux soins, soustrayez un bénéficiaire à ceux qui exploitent sa détresse ou protégez un lieu de secours. Obtenez une continuité d’aide et la fin du levier choisi. Un guérisseur, un bénéficiaire et leurs partenaires peuvent porter cette épreuve.|Préparez avec lui des appuis utilisables, puis jouez une difficulté qu’il traverse sans votre intervention décisive. Un relais peut poursuivre les soins nécessaires. Il ne s’agit ni d’imposer une guérison définitive ni d’atteindre automatiquement Golconde."
  ],
  [
    "Gargouilles",
    "gargoyles",
    "Le gardien choisit|La pierre ne cède pas|Briser la main du maître|Le serment tient encore|Des ailes sans chaînes",
    "Convenez d’une protection précise, puis empêchez une intrusion, une saisie ou une mise en danger réelle. Faites jouer les limites de votre engagement avec la personne protégée. Une garde sans incident et une simple proclamation de liberté ne suffisent pas.|Repérez une faille, aménagez un poste ou un passage et mettez cette préparation à l’épreuve d’une intrusion ou d’une extraction difficile. Un escalier, une cour ou un toit suffit. Le vol et la Visceratika ne sont employés que si votre fiche les permet.|Neutralisez un chantage sur votre refuge, contestez une obligation imposée ou obtenez la fin d’un ordre qui déborde votre engagement, puis exercez la liberté gagnée. Une autorité actuelle suffit, sans retrouver votre créateur. Toute contrainte surnaturelle suit ses propres règles.|Déjouez une diversion, un siège ou un ultimatum organisé contre votre protégé ou votre refuge. Coordonnez une défense ou une évacuation et menez-la à terme malgré une faille exploitée. La protection peut concerner une seule personne, sans forteresse ni bataille générale.|Transmettez les moyens d’une protection et convenez d’une relève volontaire, puis laissez ce gardien répondre à un incident sans vos ordres. Il peut appartenir à un autre clan. La liberté réside dans les termes effectivement respectés du serment, sans obligation de rompre toute loyauté."
  ],
  [
    "Samedi",
    "samedi",
    "Franchir le dégoût|Ce que l’on prend pour un mort|La peur a un prix|La part des revenants|Un nom au-delà du corps",
    "Gagnez un accès utilisable à une morgue, un refuge ou un lieu de rencontre malgré les contraintes de votre apparence cadavérique. Jouez la couverture et l’obstacle rencontré. Cacher simplement votre visage ou décrire le dégoût des autres ne suffit pas.|Exploitez une méprise sur votre état, un transport funéraire ou une mise en scène macabre pour franchir une garde, échapper à une recherche ou atteindre un objet protégé. Adaptez la ruse aux vérifications réellement jouées. Votre apparence n’accorde aucune immunité nouvelle.|Préparez une confrontation macabre avec une cible qui vous résiste et obtenez un retrait, un accès ou une restitution. L’effroi dépend de sa réaction ou des pouvoirs autorisés. Résolvez le risque d’exposition créé par la scène, sans imposer la terreur ni une contagion imaginaire.|Dans une affaire funéraire ou une opération où votre condition a compté, déjouez une manœuvre organisée pour vous sacrifier ou vous écarter. Obtenez votre part, une protection ou un accès durable, puis exercez ce droit malgré la résistance. Un groupe local suffit.|Partagez un savoir, un attachement ou une œuvre, puis faites traverser à ce lien une difficulté liée à votre condition. Jouez l’engagement réciproque qui en résulte au-delà d’une commande macabre. Votre apparence demeure, mais elle ne résume plus votre place auprès de cette personne."
  ],
  [
    "Filles de la Cacophonie",
    "daughters_cacophony",
    "Une voix franchit la porte|Le chant perce le silence|La juste dissonance|La voix qu’on voulait éteindre|D’autres voix après vous",
    "Préparez une adresse chantée, un air ou une intervention vocale pour obtenir une audience réellement refusée ou rétablir un échange interrompu. Jouez la réaction de l’interlocuteur et l’accès obtenu. Aucun enregistrement ni talent musical hors RP n’est demandé.|Cachez un message dans un refrain convenu, détournez l’attention par une prestation ou employez un pouvoir vocal maîtrisé. Contournez un obstacle à la transmission et jouez la compréhension du message. La voix ne traverse pas automatiquement les murs ni les distances.|Dans une confrontation tendue, obtenez par une intervention chantée une trêve appliquée, une diversion décisive ou la reprise d’une coopération rompue. Surmontez une perturbation réelle. L’émotion et les effets surnaturels suivent les réactions jouées et les pouvoirs possédés, sans emprise automatique.|Face à un sabotage ou une interdiction organisée, préparez et menez une intervention vocale qui rend possible une extraction, une rencontre décisive ou la fin d’un affrontement. Quelques auditeurs suffisent. La réussite tient à l’effet obtenu, sans concert public ni manipulation d’une foule.|Transmettez un répertoire, une technique ou une œuvre et accompagnez sa réinterprétation. Jouez une situation où cette personne l’emploie seule pour atteindre quelqu’un ou surmonter une difficulté. L’enseignement artistique ne transmet pas automatiquement Melpominée ni une autre Discipline."
  ],
  [
    "Baali",
    "baali",
    "Les cendres du secret|Le prix du pacte|L’offrande sous le voile|Ce qui réclame son dû|La dette ultime",
    "Récupérez un fragment disputé, déchiffrez un témoignage avec les moyens disponibles ou négociez l’accès à un objet déjà établi en jeu. Vérifiez ce qu’il apprend et traitez une trace compromettante. Découvrir un nom n’invoque rien et ne confère aucun pouvoir.|Pour un engagement établi en jeu, récupérez un objet, gardez un secret menacé ou rendez le service exigé malgré un obstacle. Un intermédiaire, une clause écrite ou un signe convenu peut porter l’intrigue. Ni invocation nouvelle ni sacrifice ne sont obligatoires.|Obtenez la garde d’un objet, l’ouverture d’un lieu ou le silence d’un intermédiaire en surmontant sa méfiance. Le service doit avoir une fonction infernale établie dans l’intrigue et être réellement rendu. La tromperie du personnage ne dispense pas des accords entre joueurs sur la scène.|Traitez un objet compromis, une clause devenue dangereuse ou un dépositaire qui retourne vos engagements contre vous. Surmontez une opposition organisée et obtenez une issue vérifiable avec les moyens autorisés. Une affaire locale suffit, sans démon incarné ni menace apocalyptique.|Résolvez les obligations d’un pacte établi et jouez au moins une conséquence durable de cette issue. Un objet ou un intermédiaire peut représenter le créancier. Aucun abandon de pacte ne supprime de lui-même une malédiction, une dette ou un pouvoir selon votre seule volonté."
  ]
];
const scales = {1:[3,2,1,1,0],2:[0,5,4,2,0],3:[0,0,8,6,0],4:[0,0,0,12,0],5:[0,0,0,0,0]};
const actions = [];
for (const [heading, clan, titleText, hintText] of entries) {
  const section = source.split(`### ${heading}\n`)[1].split('\n### ')[0];
  const rows = [...section.matchAll(/^\| ([1-5]) — \d+ pt[s]? \| (.+) \|$/gm)];
  if (rows.length !== 5) throw new Error(`Missing levels: ${clan}`);
  rows.forEach((row, index) => {
    const level = Number(row[1]);
    actions.push({id:`vitae_${clan}_${level}`, clan, category:'clan', name:titleText.split('|')[index],
      description:row[2],
      hints:[hintText.split('|')[index]],
      minBp:level,maxBp:5,points:scales[level][level-1],scaling:Object.fromEntries(scales[level].map((n,i)=>[i+1,n]))});
  });
}
const general = [
["first_frenzy","unique","La Bête à votre porte","Affrontez pour la première fois une crise où la Bête menace une vie, une couverture ou un engagement.",[3,2,1,1],"Une faim pressante ou une provocation peut mettre un allié en danger. Contenez la Bête ou affrontez ce que sa libération laisse derrière elle."],
["vitae_first_dependence","unique","Le sang fait des chaînes","Établissez votre première dépendance de sang et donnez-lui une place réelle dans la nuit.",[3,2,1,1],"Créez une goule ou nouez un lien de sang, puis répondez aux exigences de cette nouvelle dépendance."],
["vitae_mortal_break","unique","Ce nom n’est plus le vôtre","Abandonnez irréversiblement une part importante de votre vie mortelle pour préserver votre existence vampirique.",[4,3,2,1],"Renoncez à une identité devenue dangereuse, à un accès précieux ou à une relation impossible à préserver."],
["vitae_first_hunt","unique","La première traque","Menez à terme votre première chasse autonome malgré un obstacle qui aurait pu vous démasquer.",[2,1],"Obtenez le sang recherché puis traitez un témoin, une surveillance ou une intrusion territoriale."],
["vitae_hunting_source","general","Une veine dans la cité","Ouvrez ou rétablissez une source de chasse réellement exploitable là où une menace, vos proies ou les maîtres des lieux vous fermaient le passage.",[3,2,1,1],"Négociez un droit de chasse contesté, gagnez un accès surveillé ou établissez une couverture adaptée à vos proies. Si une source a été compromise, traitez la cause de sa perte et rétablissez un accès utilisable."],
["vitae_masquerade","general","Recoudre le voile","Étouffez une menace crédible avant qu’elle ne déchire la Mascarade.",[5,5,4,3],"Récupérez une preuve compromettante, déjouez une enquête ou neutralisez le risque posé par un témoin."],
["vitae_autonomy","general","Briser la laisse","Arrachez une autonomie réelle à une emprise qui organisait votre existence ou celle d’un autre.",[6,6,5,4],"Supprimez un levier de chantage ou démantelez un dispositif de contrôle."],
["vitae_extraction","general","Soustraire une vie à la nuit","Sauvez une personne dont la perte définitive était réellement possible et aurait durablement affecté votre existence.",[6,6,6,5],"Préparez une sortie, déjouez des poursuivants ou franchissez une défense pour empêcher une mort, une Mort ultime ou une disparition définitive. Le récit doit établir la menace et les conséquences durables qu’aurait entraînées cette perte."],
["vitae_crisis","general","Revenir du bord des cendres","Échappez à une situation qui aurait dû vous conduire à la torpeur ou à la Mort ultime, sans abandonner ce qui vous y avait conduit.",[5,5,4,3],"Échappez à une menace concrète de torpeur ou de Mort ultime tout en préservant l’objectif, la personne ou l’engagement qui vous avait poussé à l’affronter."],
["vitae_defense","general","Que le refuge demeure","Brisez une offensive organisée contre un refuge ou un réseau de chasse.",[8,8,8,6],"Identifiez les moyens de l’adversaire puis faites échouer son opération, par défense, négociation ou détournement."],
["vitae_resonance","resonance","Le goût d’une âme vive","Atteignez une source au sang chargé d’une émotion établie, au terme d’une chasse qui ne vous était pas acquise.",[2,1],"Identifiez rage, passion, mélancolie ou calme chez une proie et trouvez le moyen de l’approcher."],
["vitae_dyscrasia","resonance","L’empreinte dans le sang","Découvrez une dyscrasie et goûtez ce que cette empreinte singulière a laissé dans le sang.",[5,5,3,2],"Suivez la trace d’une émotion qui hante une proie, gagnez sa proximité et percez le secret de son sang."],
["vitae_embrace","irreversible","Donner la nuit","Accordez l’Étreinte à un mortel et faites naître un nouveau Damné dont le sang, les actes et les fautes seront désormais liés aux vôtres.",[8,8,8,6],"Choisissez celui ou celle que vous refusez de laisser mourir, obtenez — ou défiez — le droit de l’Étreindre, puis assumez les premières nuits de votre Infant."],
["vitae_diablerie","irreversible","Boire l’âme","Commencez là où la prédation devrait s’arrêter : buvez un autre vampire jusqu’à la Mort ultime et arrachez ce que son sang gardait encore de lui.",[8,8,8,6],"Terrassez un Caïnite, franchissez volontairement l’ultime interdit et survivez aux conséquences laissées dans votre sang, votre conscience et le regard des autres Damnés."],
["vitae_mortal_link","general","Une lumière reste allumée","Préservez un lien avec votre ancienne vie alors que votre nature vampirique rendait sa perte plus simple — ou plus sûre.",[4,4,3,2],"Protégez une Pierre de touche, préservez une relation mortelle ou respectez une Conviction alors que la faim, la Mascarade ou la politique de la nuit vous poussaient à l’abandonner."],
["vitae_mortal_influence","general","Des mains dans le jour","Étendez votre influence sur le monde des mortels sans révéler la main morte qui tire les fils.",[4,4,3,2],"Gagnez un contact, infiltrez une institution ou prenez le contrôle d’un accès dont votre existence nocturne pourra durablement profiter."],
["vitae_haven","general","Une tombe à soi","Faites d’un lieu plus qu’une cache : un refuge capable de protéger votre sommeil et vos secrets lorsque vient le jour.",[3,2,1,1],"Sécurisez les accès, établissez une couverture crédible ou obtenez les protections nécessaires pour pouvoir réellement y abandonner votre corps au sommeil diurne."],
["vitae_mortal_hunter","general","Les yeux du jour","Découvrez qu’un mortel vous chasse et brisez sa piste avant qu’elle ne remonte jusqu’à votre véritable nature.",[6,6,6,5],"Identifiez une surveillance, remontez jusqu’à ceux qui l’organisent et détournez leur attention sans provoquer la brèche qu’ils espéraient."],
["vitae_favor","social","Le poids d’une faveur","Contractez, honorez ou faites payer une dette vampirique dont l’issue modifie réellement une relation.",[4,4,3,2],"Engagez votre parole, acquittez une dette coûteuse ou réclamez une faveur dont le règlement transforme durablement votre relation avec un autre Damné."],
["vitae_secret","social","Un secret vaut du sang","Découvrez un secret dangereux et servez-vous-en pour obtenir quelque chose que la force n’aurait pas permis.",[4,4,3,2],"Vérifiez un secret compromettant, identifiez ceux qu’il menace et échangez votre silence ou sa révélation contre un accès, une protection ou une concession réelle."],
["vitae_negotiation","social","Sans montrer les crocs","Résolvez un conflit sérieux entre vampires par négociation, statut, dette ou manipulation sans recourir à la violence ouverte.",[5,5,4,3],"Dénouez une rivalité, négociez un accord ou mobilisez une dette pour résoudre un conflit dont l’issue engage réellement les vampires concernés."],
["vitae_recognition","social","Une place dans la nuit","Faites reconnaître un droit, un territoire ou une position par ceux qui auraient pu le contester.",[5,5,4,3],"Obtenez une reconnaissance explicite, surmontez une contestation ou réunissez les soutiens qui rendent votre droit, votre territoire ou votre position effectifs."],
["vitae_coterie","social","Le sang de la coterie","Acceptez une perte ou un danger réel pour préserver un membre de la coterie ou ce qu’elle possède collectivement.",[5,5,4,3],"Sacrifiez un avantage précieux, assumez une dette ou exposez-vous à une menace concrète pour sauver un compagnon ou protéger un refuge, un secret ou une ressource commune."],
];
for (const [id,category,name,description,values,hint] of general) actions.push({id,category,name,description,hints:[hint],points:values[0],minBp:1,maxBp:values.length,scaling:Object.fromEntries(values.map((n,i)=>[i+1,n])),legacyCompletedIds:id==='vitae_first_dependence'?['first_ghoul','first_blood_bond']:[]});
const firstBeast = actions.find(a => a.id === 'first_frenzy');
firstBeast.id = 'vitae_first_beast';
firstBeast.legacyCompletedIds = ['first_frenzy'];
const categories = {
  "unique": {
    "name": "Les premières cicatrices",
    "description": "Des expériences fondatrices, une fois dans votre existence.",
    "icon": "⭐"
  },
  "clan": {
    "name": "L’héritage de votre sang",
    "description": "Le Sang en vous connaît la voie, mais il ne livre pas tous ses secrets aux plus jeunes.",
    "icon": "🧛"
  },
  "general": {
    "name": "Les épreuves de la nuit",
    "description": "Conquérir, protéger, apprendre : des accomplissements qui laissent une trace.",
    "icon": "⚔️"
  },
  "social": {
    "name": "Les chaînes invisibles",
    "description": "Dettes, secrets et serments : dans la nuit, les crocs ne sont pas les seules armes.",
    "icon": "⛓️"
  },
  "resonance": {
    "name": "Les saveurs du sang",
    "description": "Atteindre une source singulière au-delà d’une chasse ordinaire.",
    "icon": "🩸"
  },
  "irreversible": {
    "name": "Les actes sans retour",
    "description": "Certains choix marquent le sang, la lignée et l’âme elle-même. Ils ne se réclament pas : ils doivent naître de l’histoire.",
    "icon": "💀",
    "warning": "⚠ Ces actes ne peuvent être soumis que lorsqu’ils émergent naturellement du récit et entraînent des conséquences durables. Sous validation stricte du MJ"
  }
};
const catalog = {categories,version:2,thresholds:{1:30,2:60,3:120,4:250},aliases:{hecata:'giovanni',ministry:'setite',setites:'setite',assamites:'banu_haqim',assamite:'banu_haqim',malkavien:'malkavian',gargouilles:'gargoyles'},actions};
fs.writeFileSync('data/blood_actions.json',JSON.stringify(catalog,null,2)+'\n');
console.log(`${actions.length} actions written`);
