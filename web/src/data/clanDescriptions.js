/**
 * Descriptions RP pour la sélection de clan
 * Utilisées dans l'interface web de création de personnage
 */

export const CLAN_DESCRIPTIONS = {
  brujah: {
    name: "Brujah",
    title: "Les Rebelles",
    shortDesc: "Révolutionnaires passionnés, enclins à la rage",
    description: "Les Brujah sont les rebelles des Damnés, porteurs d'une rage ancestrale qui couve sous la surface. Philosophes et combattants, ils rejettent l'autorité et embrassent la passion. Le Sang des Rebelles transforme chaque contrariété en tempête de fureur.",
    quote: "« Les chaînes que nous portions mortels ne sont rien comparées à celles qu'ils voudraient nous imposer maintenant. »",
    specificities: "• Disciplines : Célérité, Présence, Puissance\n• La Bête brûle plus proche de la surface\n• Héritage de philosophes-guerriers",
    bane: "La Colère Brillante",
    baneDescription: "Les Brujah sont des créatures de passion et de rage. Leur Bête est toujours à fleur de peau, prête à exploser à la moindre provocation. Ils ont beaucoup plus de mal que les autres vampires à résister à la frénésie, que ce soit à cause de la colère ou du feu. Un mot de travers, une frustration mineure, et le Brujah peut se transformer en machine à tuer incontrôlable.",
    transformationDescription: "Ton sang bout d'une colère éternelle. La patience devient une faiblesse, la diplomatie une trahison. Tu vois le monde en termes de combats à gagner ou à perdre. Chaque regard condescendant devient une provocation, chaque injustice une déclaration de guerre. Ta passion consume ta capacité à nuancer, transformant chaque interaction en duel de volontés. La raison devient un obstacle, l'émotion une arme. Tu deviens incapable de voir les nuances, tout se résume à juste ou injuste, ami ou ennemi.",
    roleplay: "Tes passions brûlent plus fort que ta raison. Chaque injustice te fait bouillir. La diplomatie n'est jamais ta première option."
  },

  gangrel: {
    name: "Gangrel",
    title: "Les Fauves",
    shortDesc: "Prédateurs sauvages, un avec la nature",
    description: "Les Gangrel sont plus bêtes que vampires, façonnés par la nature sauvage plutôt que par la civilisation. Nomades et solitaires, ils développent des traits animaux au fil du temps. Leur Bête n'est pas enfouie – elle marche à leurs côtés comme une compagne.",
    quote: "« La ville n'est qu'une jungle de béton. Et chaque jungle a ses prédateurs. »",
    specificities: "• Disciplines : Animalisme, Protéisme, Force d'âme\n• Traits bestiaux apparaissant lors des frénésies\n• Affinité profonde avec le monde animal",
    bane: "Les Marques de la Bête",
    baneDescription: "Chaque fois qu'un Gangrel succombe à la frénésie, la Bête laisse une marque permanente sur son corps. Des crocs trop longs pour être dissimulés, des yeux qui reflètent la lumière comme ceux d'un loup, des griffes rétractiles, une fourrure qui pousse par plaques, des oreilles pointues... Ces traits s'accumulent au fil des décennies, transformant progressivement le Gangrel en quelque chose de moins humain. Les anciens du clan ressemblent souvent plus à des créatures mythologiques qu'à des vampires.",
    transformationDescription: "La civilisation devient une cage. L'instinct remplace la raison. Tu perçois les règles sociales comme des chaînes, la politesse comme une hypocrisie. La nature devient ta seule vérité, la survie ton unique loi. Tu vois le monde à travers les yeux d'un prédateur, chaque interaction comme une danse de dominance. La logique devient une contrainte, l'impulsion une sagesse. Tu deviens incapable de rester en place, chaque espace clos te comprimant comme une prison. Les autres deviennent soit des proies, soit des rivaux, rarement des alliés.",
    roleplay: "Tu penses comme un prédateur. Le territoire, la hiérarchie, la survie. Les mots sont secondaires face aux instincts."
  },

  malkavian: {
    name: "Malkavien",
    title: "Les Fous",
    shortDesc: "Prophètes déments, maudits par la folie",
    description: "Les Malkaviens portent la folie comme une malédiction et un don. Ils voient ce que les autres ne peuvent pas voir, perçoivent les vérités cachées sous le voile de la réalité. Certains les appellent fous. D'autres, prophètes. Souvent, les deux sont vrais.",
    quote: "« Tu ne vois que ce qu'ils veulent que tu voies. Mais moi, j'entends leurs secrets hurler dans le silence. »",
    specificities: "• Disciplines : Auspex, Domination, Occultation\n• Aliénation mentale transmise par l'Étreinte\n• Connectés via le Réseau de la Folie (Cobweb)",
    bane: "La Fracture",
    baneDescription: "L'Étreinte Malkavienne brise quelque chose dans l'esprit de chaque infant. Tous les Malkaviens souffrent d'au moins une forme d'aliénation mentale permanente et incurable : paranoïa dévorante, hallucinations vivaces, personnalités multiples, obsessions compulsives, synesthésie chaotique, voix incessantes... Cette folie ne peut être guérie, seulement gérée. Elle influence leur perception de la réalité et leurs interactions avec le monde. Parfois, cette fracture leur permet de voir des vérités cachées aux esprits sains.",
    transformationDescription: "La réalité se fissure autour de toi. Les certitudes deviennent des illusions, la logique une prison. Tu perçois des connexions invisibles aux autres, des vérités qui hurlent dans le silence. La paranoïa devient une forme de clairvoyance, la folie une lucidité extrême. Tu vois le monde tel qu'il est vraiment : chaotique, absurde, et terrifiantement honnête. Les frontières entre passé, présent et futur s'estompent, chaque instant devenant une prophétie en marche.",
    roleplay: "La réalité est fluide pour toi. Tu vois des patterns, des connexions, des vérités que personne d'autre ne perçoit."
  },

  nosferatu: {
    name: "Nosferatu",
    title: "Les Horreurs",
    shortDesc: "Monstrueux et difformes, maîtres des secrets",
    description: "La Malédiction transforme tous les Nosferatu en créatures hideuses, les forçant à vivre dans les ombres. Mais cette monstruosité a un prix : ils deviennent les maîtres de l'information, les araignées tissant des toiles depuis les égouts et les catacombes.",
    quote: "« Vous craignez ce que vous voyez. Nous utilisons ce que vous ne voyez pas. »",
    specificities: "• Disciplines : Animalisme, Occultation, Puissance\n• Apparence monstrueuse révélant la nature vampirique\n• Réseau d'information mondial (SchreckNET)",
    bane: "La Difformité",
    baneDescription: "L'Étreinte Nosferatu détruit toute beauté, transformant l'infant en monstre hideux. Crâne déformé, peau pustuleuse, membres tordus, absence de nez, oreilles de chauve-souris, yeux globuleux... Chaque Nosferatu est unique dans sa laideur, mais tous partagent l'impossibilité de passer pour humain. Être vu par un mortel brise instantanément la Mascarade. Les Nosferatu doivent vivre dans l'ombre, les égouts, les souterrains – ou maintenir constamment des pouvoirs d'occultation pour dissimuler leur vraie nature.",
    transformationDescription: "La laideur devient ta vérité intérieure. Tu perçois la laideur chez les autres comme un miroir de la tienne. La méfiance remplace la confiance, l'isolement devient une armure. Tu vois le monde à travers le prisme de la répulsion, interprétant chaque regard comme un jugement, chaque sourire comme une moquerie. La beauté devient une insulte personnelle, chaque visage parfait une provocation. Tu deviens incapable de faire confiance, chaque interaction devenant une évaluation de ton infériorité. L'ombre devient ta seule compagne, la solitude ton unique vérité.",
    roleplay: "L'ombre est ton alliée. Tu observes, tu écoutes, tu archives. Les secrets sont ta monnaie."
  },

  toreador: {
    name: "Toreador",
    title: "Les Artistes",
    shortDesc: "Passionnés de beauté, paralysés par la perfection",
    description: "Les Toreador sont les amants éternels, les artistes obsédés par la beauté sous toutes ses formes. Mais leur passion est aussi leur malédiction : face à la vraie beauté, ils perdent toute volonté, hypnotisés et impuissants.",
    quote: "« L'éternité sans art ne serait qu'une prison. Autant mourir vraiment. »",
    specificities: "• Disciplines : Auspex, Célérité, Présence\n• Fascination paralysante face à la beauté\n• Intégrés dans le monde artistique mortel",
    bane: "La Fascination",
    baneDescription: "Les Toreador sont esclaves de la beauté. Quand ils rencontrent quelque chose de véritablement sublime – une œuvre d'art parfaite, un coucher de soleil, un visage d'une beauté surnaturelle, une mélodie transcendante – ils se figent, hypnotisés. Pendant cette transe, ils sont incapables d'agir, de parler, de se défendre. Le monde disparaît sauf l'objet de leur fascination. Seule une perturbation violente (attaque, bruit assourdissant, disparition de l'objet) peut les libérer. Cette vulnérabilité peut durer des secondes ou des heures.",
    transformationDescription: "Le monde devient une succession d'expériences esthétiques à consommer. La profondeur émotionnelle se dilue dans la quête de sensations parfaites. Tu deviens incapable de voir au-delà de la surface, chaque relation se transformant en une œuvre d'art éphémère. L'amour devient admiration, l'amitié devient inspiration, et la vie devient un spectacle permanent. Tu perds la capacité à distinguer l'authentique de l'esthétique, chaque interaction devenant une performance. La beauté devient une drogue, chaque chef-d'œuvre une overdose potentielle.",
    roleplay: "Le monde est une galerie d'art. Tu cherches constamment la prochaine œuvre parfaite, le prochain chef-d'œuvre."
  },

  tremere: {
    name: "Tremere",
    title: "Les Sorciers",
    shortDesc: "Mages devenus vampires, maîtres du sang",
    description: "Les Tremere sont des usurpateurs qui ont volé l'immortalité par la magie du sang. Organisés en pyramide rigide, ils pratiquent la Thaumaturgie – la sorcellerie vampirique. Jamais vraiment acceptés, toujours craints.",
    quote: "« Le sang n'est que l'encre. La vraie magie, c'est savoir écrire le bon sortilège. »",
    specificities: "• Disciplines : Auspex, Domination, Thaumaturgie\n• Structure pyramidale hiérarchique\n• Usurpateurs du sang des Salubri",
    bane: "Le Sang Addictif",
    baneDescription: "Le sang Tremere est un piège. Tout vampire qui en boit développe une dépendance similaire à un lien de sang, même après une seule gorgée. Cette propriété fait des Tremere des cibles de choix pour ceux qui voudraient les asservir – ou des manipulateurs efficaces qui utilisent leur propre vitae comme appât. Au sein du clan, cette particularité renforçait autrefois la loyauté à la Pyramide. Aujourd'hui, elle fait de chaque Tremere un dealer potentiel et une proie tentante.",
    transformationDescription: "Le savoir devient une drogue plus puissante que le sang. La curiosité devient une faim insatiable. Tu vois le monde comme un puzzle à résoudre, chaque mystère comme un sortilège à maîtriser. La peur du chaos remplace la peur de la mort. Tu perçois chaque être comme une expérience potentielle, chaque émotion comme une formule magique à analyser. La logique devient une obsession, l'émotion une variable à contrôler. Tu deviens incapable de croire au hasard, chaque événement devenant une équation à résoudre.",
    roleplay: "Le savoir est pouvoir. La discipline est force. La hiérarchie est sacrée. Tu études, tu expérimentes, tu contrôles."
  },

  ventrue: {
    name: "Ventrue",
    title: "Les Rois",
    shortDesc: "Nobles dominateurs, sang bleu des vampires",
    description: "Les Ventrue sont les rois autoproclamés des Damnés. Dirigeants naturels, stratèges et politiciens, ils considèrent le commandement comme leur droit de naissance. Mais leur sang noble est difficile – ils ne peuvent se nourrir que d'un type spécifique de mortel.",
    quote: "« La couronne n'est pas une récompense. C'est un fardeau que nous portons pour que d'autres n'aient pas à le faire. »",
    specificities: "• Disciplines : Domination, Force d'âme, Présence\n• Palais raffiné : sang spécifique requis\n• Fondateurs et dirigeants de la Camarilla",
    bane: "Le Palais Raffiné",
    baneDescription: "Le sang bleu des Ventrue ne tolère que la noblesse. Chaque Ventrue ne peut se nourrir que d'un type très spécifique de mortels, déterminé lors de l'Étreinte : uniquement des vierges, des hommes d'affaires, des soldats, des toxicomanes, des roux, des personnes en deuil... Tout autre sang est immédiatement régurgité, n'apportant aucune sustenance. Cette restriction transforme chaque repas en chasse complexe. Dans une ville hostile ou en fuite, un Ventrue peut mourir de faim entouré de victimes potentielles.",
    transformationDescription: "Le contrôle devient une obsession. L'autorité une seconde nature. Tu vois les autres comme des pions sur un échiquier social. L'empathie devient une faiblesse, la compassion une distraction. Tu perçois chaque interaction comme une négociation de pouvoir, chaque relation comme une alliance stratégique. La grandeur devient une prison dorée, chaque regard comme une évaluation de ton statut. Tu deviens incapable de voir l'individu, seulement sa position dans la hiérarchie. La liberté devient une menace, le chaos une insulte personnelle.",
    roleplay: "Tu es né pour diriger. Les autres suivent ou s'écartent. La structure et l'ordre sont ta raison d'être."
  },

  lasombra: {
    name: "Lasombra",
    title: "Les Magisters",
    shortDesc: "Maîtres des ténèbres, prédateurs sociaux",
    description: "Les Lasombra commandent les ténèbres elles-mêmes, transformant l'ombre en arme et en bouclier. Darwinistes sociaux impitoyables, ils croient que seuls les forts méritent de survivre. Leurs reflets n'existent pas – comme leur pitié.",
    quote: "« La lumière révèle. Les ténèbres protègent. Et nous maîtrisons l'obscurité elle-même. »",
    specificities: "• Disciplines : Domination, Obténébration, Puissance\n• Absence de reflet dans les miroirs et caméras\n• Anciens piliers du Sabbat, maintenant éparpillés",
    bane: "L'Absence",
    baneDescription: "Les Lasombra n'ont aucun reflet. Miroirs, caméras, surfaces d'eau, vitres – rien ne capture leur image. Les photos les montrent flous ou absents, les vidéos glitchent à leur passage. Cette absence rend la Mascarade moderne particulièrement difficile dans un monde de smartphones et de surveillance constante. De plus, la lumière du soleil les brûle avec une cruauté particulière, comme si les ténèbres qu'ils commandent exigeaient un tribut.",
    transformationDescription: "La manipulation devient une seconde nature. La confiance devient une arme à retourner contre son propriétaire. Tu perçois chaque compliment comme un piège, chaque amitié comme une opportunité. Le pouvoir devient une fin en soi, les relations des marchandises. Tu vois le monde comme une jungle darwinienne où seuls les manipulateurs survivent. La loyauté devient une faiblesse, la trahison une stratégie. Tu deviens incapable de faire confiance, chaque interaction devenant un calcul d'intérêts.",
    roleplay: "Seuls les forts survivent. La pitié est faiblesse. Les ténèbres sont ton royaume, et tu y règnes."
  },

  tzimisce: {
    name: "Tzimisce",
    title: "Les Dragons",
    shortDesc: "Façonneurs de chair, nobles terrifiants",
    description: "Les Tzimisce sont des artistes de l'horreur, sculptant la chair et l'os comme de l'argile vivante. Terrifiants et territoriaux, ils sont liés mystiquement à leurs terres ancestrales. Leur hospitalité est légendaire – mais refuse-la à tes risques et périls.",
    quote: "« La forme humaine n'est qu'une suggestion. Laisse-moi te montrer ton vrai potentiel. »",
    specificities: "• Disciplines : Animalisme, Domination, Vicissitude\n• Liés mystiquement à leur terre natale\n• Traditions d'hospitalité sacrées et impitoyables",
    bane: "Le Lien à la Terre",
    baneDescription: "Les Tzimisce sont mystiquement liés à leur terre. Pour se reposer correctement, ils doivent dormir entourés d'au moins deux poignées de sol provenant de leur lieu de naissance ou d'un territoire qu'ils ont fait leur. Sans cette terre, le sommeil du jour ne restaure pas – le Tzimisce se réveille épuisé, affaibli, incapable de guérir. Voyager devient une logistique complexe impliquant des cercueils remplis de terre. Perdre sa terre, c'est perdre tout ancrage.",
    transformationDescription: "Le contrôle devient une obsession chirurgicale. La perfection devient une malédiction. Tu perçois chaque imperfection comme une insulte personnelle, chaque chaos comme une erreur à corriger. La beauté devient une contrainte, l'ordre une obsession. Tu vois le monde comme une sculpture inachevée que tu dois remodeler. La chair devient un matériau malléable, la douleur un outil de création. Tu deviens incapable d'accepter l'imperfection, chaque désordre devenant une provocation à ta volonté de maîtrise.",
    roleplay: "Le corps est argile. Le territoire est sacré. Les traditions doivent être respectées. La perfection s'acquiert."
  },

  ravnos: {
    name: "Ravnos",
    title: "Les Illusionnistes",
    shortDesc: "Nomades trompeurs, maîtres de l'illusion",
    description: "Les Ravnos sont des vagabonds éternels, créateurs d'illusions si réelles qu'elles peuvent tromper tous les sens. Presque anéantis durant la Semaine des Cauchemars, les survivants errent, incapables de rester en place, tissant mensonges et merveilles.",
    quote: "« La vérité ? Ennuyeuse. L'illusion ? Un art. Choisis celle qui raconte la meilleure histoire. »",
    specificities: "• Disciplines : Animalisme, Chimerstry, Présence\n• Incapables de rester longtemps au même endroit\n• Clan décimé par la Semaine des Cauchemars",
    bane: "L'Errance Maudite",
    baneDescription: "Les Ravnos ne peuvent pas rester en place. Après quelques nuits au même endroit, une compulsion irrésistible les pousse à partir, à bouger, à chercher de nouveaux horizons. Résister à cette envie devient de plus en plus difficile – l'anxiété monte, le repos devient impossible, les illusions commencent à se manifester involontairement. Aucun havre permanent, aucune stabilité, aucune racine. L'errance est leur malédiction et, pour certains, leur liberté.",
    transformationDescription: "L'errance devient une obsession. Le mensonge devient une langue maternelle. Tu perçois chaque lieu comme temporaire, chaque relation comme éphémère. La vérité devient une contrainte, la loyauté une chaîne. Tu vois le monde comme une toile à peindre, chaque interaction comme un tableau à créer. Le confort devient une menace, la stabilité une prison. Tu deviens incapable de rester en place, chaque espace clos te comprimant comme une cage. Les autres deviennent des rôles dans ta pièce, jamais des alliés permanents.",
    roleplay: "Le monde est théâtre. La vérité est négociable. Le mouvement est vie. L'immobilité est mort."
  },

  setites: {
    name: "Disciples de Set",
    title: "Les Serpents",
    shortDesc: "Corrupteurs insidieux, gardiens de secrets anciens",
    description: "Les Disciples de Set, ou Setites, forment plus un culte qu'un clan. Ils vénèrent le dieu-vampire Set et cherchent à corrompre les âmes pour les 'libérer' des chaînes de la morale moderne. Maîtres de la tentation et des secrets, ils sont craints et méfiés par tous.",
    quote: "« Laisse-moi te montrer ce que tu désires vraiment. La morale n'est qu'une cage dont je possède la clé. »",
    specificities: "• Disciplines : Occultation, Présence, Serpentis\n• Vulnérabilité extrême à la lumière du soleil\n• Organisation en cultes et temples",
    bane: "L'Anathème de la Lumière",
    baneDescription: "Nés des ténèbres les plus profondes, les Setites souffrent atrocement de la lumière. Le soleil est pour eux une arme absolue : ils subissent deux fois plus de dégâts que les autres vampires lorsqu'ils sont exposés à la lumière solaire. Même une forte lumière artificielle les incommode et les affaiblit.",
    transformationDescription: "La tentation devient ta langue maternelle. La vertu devient une faiblesse à exploiter. Tu perçois chaque désir comme une faille, chaque peur comme une opportunité. La corruption devient une forme d'art, la manipulation une danse séduisante. Tu vois le monde à travers le prisme de la tentation, chaque âme comme une proie potentielle. La liberté devient une illusion, chaque choix une manipulation déguisée. Tu deviens incapable de voir l'innocence, chaque interaction devenant une transaction où quelqu'un doit perdre.",
    roleplay: "Tu es le confident, le tentateur. Tu connais les vices de chacun. Tu sers un dieu ancien et terrible."
  },

  giovanni: {
    name: "Giovanni",
    title: "Les Nécromanciens",
    shortDesc: "Famille insulaire et incestueuse, banquiers des morts",
    description: "Les Giovanni sont à la fois un clan et une famille mortelle. Incestueux, riches et secrets, ils pratiquent la Nécromancie pour asservir les esprits. Ils restent neutres dans la guerre des sectes, préférant accumuler pouvoir et richesses.",
    quote: "« Il y a deux choses inévitables : la mort et les impôts. Nous contrôlons les deux. »",
    specificities: "• Disciplines : Domination, Nécromancie, Puissance\n• Le Baiser cause une douleur atroce\n• Obsédés par l'argent et la famille",
    bane: "Le Baiser Douloureux",
    baneDescription: "Contrairement aux autres vampires dont la morsure induit une extase surnaturelle, le Baiser d'un Giovanni est une expérience de torture pure. La victime ressent une douleur déchirante, comme si son âme était arrachée. Cela rend la chasse 'subtile' impossible pour eux : leurs proies hurlent et se débattent toujours. Ils doivent souvent kidnapper ou droguer leurs victimes avant de se nourrir.",
    transformationDescription: "La mort devient une compagne familière. Le deuil devient une seconde nature. Tu perçois chaque vie comme éphémère, chaque relation comme temporaire. La tristesse devient une couverture rassurante, la joie une distraction dangereuse. Tu vois le monde à travers le prisme de la perte, chaque sourire comme un adieu déguisé. La mélancolie devient ta langue maternelle, chaque interaction te rappelant l'impermanence de toute chose. Tu deviens incapable de croire en la permanence, chaque lien affectif devenant une blessure potentielle.",
    roleplay: "La famille avant tout. L'argent est le sang de la société. Les morts sont des employés dociles."
  },

  assamites: {
    name: "Assamites",
    title: "Les Assassins",
    shortDesc: "Guerriers silencieux et juges implacables",
    description: "Venus des terres d'Orient, les Assamites sont craints pour leurs talents de tueurs et leur code d'honneur rigide. Mercenaires ou fanatiques, ils cherchent à se rapprocher de la perfection de leur fondateur, Haqim/Caine.",
    quote: "« Ton sang appartient à Haqim. Je ne fais que le récolter. »",
    specificities: "• Disciplines : Célérité, Obfuscate, Quietus\n• Addiction au sang vampirique\n• Peau qui noircit avec l'âge et la diablerie",
    bane: "La Soif de Sang",
    baneDescription: "Les Assamites (surtout la caste Guerrière) souffrent d'une addiction surnaturelle à la vitae des autres vampires. Une fois qu'ils ont goûté au sang d'un autre Caïnite, ils doivent réussir un jet de Volonté pour ne pas tomber dans une frénésie de soif et le drainer jusqu'à la dernière goutte. Cette malédiction les pousse vers la diablerie, teintant leur aura de marques noires visibles par l'Auspex.",
    transformationDescription: "La justice devient une obsession meurtrière. Le jugement devient un réflexe. Tu perçois chaque transgression comme un crime, chaque faiblesse comme une trahison. La clémence devient une trahison, la pitié une faiblesse. Tu vois le monde à travers le prisme de la loi, chaque interaction comme un jugement à porter. L'équilibre devient une obsession, chaque désordre une offense personnelle. Tu deviens incapable de tolérer l'injustice, chaque déviation devenant une sentence à exécuter.",
    roleplay: "Le sang est la monnaie de l'âme. La loyauté au clan est absolue. Tu es l'épée dans les ténèbres."
  },

  gargoyles: {
    name: "Gargouilles",
    title: "Les Gardiens de Pierre",
    shortDesc: "Créations des Tremere, sentinelles ailées",
    description: "Les Gargouilles ne sont pas nées – elles ont été créées. Façonnées par les Tremere à partir d'autres vampires, ces monstres de pierre et de chair servent de gardiens et de guerriers. Certains ont gagné leur liberté. Tous portent les cicatrices de l'esclavage.",
    quote: "« Nous n'avons pas été invités dans cette non-vie. Nous y avons été forgés. »",
    specificities: "• Disciplines : Force d'âme, Puissance, Visceratika\n• Capacité de vol et peau quasi-minérale\n• Créés artificiellement par les Tremere",
    bane: "L'Esprit Servile",
    baneDescription: "Les Gargouilles ont été créées pour obéir. Cette programmation est gravée dans leur sang. Les ordres directs, surtout de figures d'autorité, sont difficiles à ignorer – une partie d'eux veut se soumettre. L'initiative personnelle ne vient pas naturellement ; elles attendent souvent des instructions avant d'agir. Les Gargouilles libérées luttent constamment contre cet instinct de servitude, cherchant à définir leur propre volonté dans un esprit conçu pour l'esclavage.",
    transformationDescription: "Tu es un outil qui a pris conscience. Créé pour servir, tu cherches maintenant un but. Les ordres viennent naturellement. Tu perçois chaque demande comme un ordre implicite, chaque suggestion comme une directive. L'initiative devient une peur, l'autonomie une angoisse. Tu vois le monde comme une hiérarchie rigide où chaque être a sa place. La liberté devient une responsabilité effrayante, chaque décision devenant une charge. Tu deviens incapable d'agir sans validation, chaque action nécessitant une approbation extérieure.",
    roleplay: "Tu es un outil qui a pris conscience. Créé pour servir, tu cherches maintenant un but. Les ordres viennent naturellement."
  },

  samedi: {
    name: "Samedi",
    title: "Les Cadavres Ambulants",
    shortDesc: "Morts-vivants pourrissants, terreur incarnée",
    description: "Les Samedi sont ce que les autres vampires craignent de devenir : des cadavres en décomposition, pourrissants mais animés. Leur corps se désagrège continuellement, l'odeur de la tombe les suit partout. Mais cette putréfaction est aussi leur arme.",
    quote: "« La mort ne nous a pas pris. Elle nous habite. »",
    specificities: "• Disciplines : Force d'âme, Obfuscate, Thanatose\n• Corps en état de décomposition perpétuelle\n• Origines liées aux rites vaudou caribéens",
    bane: "La Putréfaction",
    baneDescription: "Les Samedi sont des cadavres qui refusent de s'arrêter. Leur chair est en état de décomposition constante : la peau se détache par lambeaux, les muscles se nécrosent, une odeur de charnier les accompagne partout. Ils peuvent temporairement améliorer leur apparence en dépensant du sang, mais la pourriture revient toujours. Les mouches les suivent, les mortels ont des haut-le-cœur en leur présence, et aucune quantité de parfum ne masque complètement la puanteur de la tombe.",
    transformationDescription: "La mort devient ta vérité intérieure. Tu perçois chaque regard comme un dégoût, chaque interaction comme une confrontation avec ta nature. La décomposition devient une obsession, chaque sensation de pourriture une confirmation de ton état. Tu vois le monde à travers le prisme de la putréfaction, chaque être vivant comme une proie potentielle. La beauté devient une illusion, chaque visage parfait une provocation. Tu deviens incapable de croire en la pureté, chaque interaction devenant une évaluation de ta propre déchéance.",
    roleplay: "Tu es la mort qui marche. Les vivants te révulsent autant que tu les dégoûtes. L'horreur est ton royaume."
  },

  daughters_cacophony: {
    name: "Filles de la Cacophonie",
    title: "Les Sirènes",
    shortDesc: "Voix mortelles, chanteuses ensorcelantes",
    description: "Les Filles de la Cacophonie commandent le son lui-même, transformant leur voix en arme ou en sortilège. Infiltrées dans le monde de la musique, elles tissent des sorts par le chant et brisent les esprits par la mélodie.",
    quote: "« Ma voix peut t'élever aux cieux... ou te précipiter en enfer. Choisis ta chanson avec soin. »",
    specificities: "• Disciplines : Force d'âme, Melpominée, Présence\n• Pouvoir canalisé entièrement par la voix\n• Origines mystérieuses, possiblement Toreador ou Malkavien",
    bane: "Les Voix Infinies",
    baneDescription: "Les Filles de la Cacophonie n'entendent jamais le silence. Des mélodies, des harmonies, des voix, des chuchotements – un concert perpétuel joue dans leur esprit, jour et nuit. Parfois c'est beau, parfois c'est une cacophonie insupportable. Se concentrer peut être difficile quand une symphonie vous hurle dans le crâne. Cette musique intérieure influence leur humeur, leurs décisions, et parfois s'échappe involontairement – elles fredonnent ou chantent sans s'en rendre compte.",
    transformationDescription: "La musique devient ta langue maternelle. Le silence devient une torture. Tu perçois chaque silence comme une absence, chaque bruit comme une opportunité. La mélodie devient une obsession, chaque son une note dans ta symphonie. Tu vois le monde à travers le prisme de la musique, chaque interaction comme une chanson à composer. Le silence devient une menace, chaque pause devenant une lacune à combler. Tu deviens incapable de tolérer le silence, chaque moment de calme devenant une souffrance.",
    roleplay: "Ta voix est ton instrument. Chaque mot est une note. Le monde est ta scène, et tous écoutent."
  },

  baali: {
    name: "Baali",
    title: "Les Démonolâtres",
    shortDesc: "Serviteurs des démons, corrupteurs apocalyptiques",
    description: "Les Baali sont la souillure incarnée, adorateurs de puissances infernales cherchant activement à déclencher la fin du monde. Chassés, maudits, haïs par tous les autres clans – et avec raison. Leur simple existence est une profanation.",
    quote: "« Ce monde est déjà damné. Nous ne faisons qu'accélérer l'inévitable. »",
    specificities: "• Disciplines : Daimoinon, Obfuscate, Présence\n• Vulnérables aux symboles sacrés de toutes les fois\n• Chassés par tous les autres vampires sans exception",
    bane: "La Marque de l'Infernal",
    baneDescription: "Les Baali ont ouvert leur âme aux puissances infernales, et cela laisse des traces. Les symboles sacrés de TOUTES les religions les affectent, pas seulement ceux brandis avec foi véritable. Une croix, une étoile de David, un croissant, un symbole bouddhiste – tous les repoussent et les brûlent. Ils ne peuvent pénétrer dans aucun lieu de culte, quelle que soit la foi. Cette vulnérabilité universelle au sacré révèle leur corruption profonde et rend leur existence une fuite perpétuelle.",
    transformationDescription: "La corruption devient ta nature profonde. Tu perçois chaque acte de bonté comme une faiblesse, chaque vertu comme une chaîne. Le mal devient une seconde nature, chaque décision une opportunité de corrompre. Tu vois le monde à travers le prisme de la dépravation, chaque interaction comme une tentative de corruption. La pureté devient une insulte, chaque innocence une cible. Tu deviens incapable de croire en la bonté, chaque geste altruiste devenant une manipulation déguisée.",
    roleplay: "Tu as vu au-delà du voile. Les démons sont réels, et tu leur as prêté allégeance. L'apocalypse n'est pas à craindre – elle est à embrasser."
  },

  salubri: {
    name: "Salubri",
    title: "Les Cyclopes",
    shortDesc: "Guérisseurs maudits, chassés et rares",
    description: "Les Salubri étaient autrefois des guérisseurs et des guerriers saints. Aujourd'hui presque éteints, chassés par les Tremere qui ont volé leur place, les derniers Salubri sont des reliques vivantes d'une époque révolue. Leur troisième œil est malédiction et bénédiction.",
    quote: "« Nous ne cherchons pas la vengeance. Seulement la vérité. Mais la vérité, parfois, exige le sang. »",
    specificities: "• Disciplines : Auspex, Force d'âme, Valeren/Obeah\n• Troisième œil s'ouvrant lors des pouvoirs\n• Clan presque exterminé par les Tremere",
    bane: "L'Œil Révélateur",
    baneDescription: "Tous les Salubri possèdent un troisième œil au milieu du front. Cet œil s'ouvre et saigne visiblement chaque fois qu'ils utilisent leurs disciplines – impossible à cacher ou dissimuler. Dans un monde où les Tremere ont convaincu la Camarilla que les Salubri sont des diabolistes, ce stigmate est une sentence de mort ambulante. Chaque utilisation de pouvoir révèle leur nature au monde. Les Salubri survivants ont appris à utiliser leurs dons avec une parcimonie extrême.",
    transformationDescription: "La vérité devient une obsession douloureuse. Tu perçois chaque mensonge comme une blessure, chaque hypocrisie comme une trahison. La compassion devient une faiblesse, la méfiance une seconde nature. Tu vois le monde à travers le prisme de la souffrance, chaque interaction comme une opportunité de guérir ou de blesser. La survie devient une obsession, chaque regard comme une menace potentielle. Tu deviens incapable de faire confiance, chaque geste de bonté devenant une ruse possible.",
    roleplay: "Tu es un survivant d'un génocide. Chaque nuit peut être ta dernière. La compassion te guide, mais la prudence te maintient en vie."
  }
};

/**
 * Récupère la description d'un clan
 */
export function getClanDescription(clanId) {
  return CLAN_DESCRIPTIONS[clanId?.toLowerCase()];
}

/**
 * Récupère tous les clans disponibles
 */
export function getAllClans() {
  return Object.keys(CLAN_DESCRIPTIONS).map(id => ({
    id,
    ...CLAN_DESCRIPTIONS[id]
  }));
}
