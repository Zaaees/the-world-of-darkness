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
    bane: "La Rage Ardente",
    baneDescription: "La Bête des Brujah brûle plus près de la surface que chez tout autre clan. Les provocations mineures – un regard condescendant, une insulte voilée, une injustice aperçue – peuvent déclencher une rage incontrôlable. Là où un autre vampire garderait son calme, le Brujah sent le feu monter, les poings se serrer, la vision se teinter de rouge. Résister à cette colère demande un effort constant. Céder signifie la frénésie, et les Brujah y cèdent plus souvent que quiconque.",
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
    roleplay: "Le monde est une galerie d'art. Tu cherches constamment la prochaine œuvre parfaite, le prochain chef-d'œuvre."
  },

  tremere: {
    name: "Tremere",
    title: "Les Sorciers",
    shortDesc: "Mages devenus vampires, maîtres du sang",
    description: "Les Tremere sont des usurpateurs qui ont volé l'immortalité par la magie du sang. Organisés en pyramide rigide, ils pratiquent la Thaumaturgie – la sorcellerie vampirique. Jamais vraiment acceptés, toujours craints.",
    quote: "« Le sang n'est que l'encre. La vraie magie, c'est savoir écrire le bon sortilège. »",
    specificities: "• Disciplines : Auspex, Domination, Sorcellerie du Sang\n• Structure pyramidale hiérarchique\n• Usurpateurs du sang des Salubri",
    bane: "Le Sang Addictif",
    baneDescription: "Le sang Tremere est un piège. Tout vampire qui en boit développe une dépendance similaire à un lien de sang, même après une seule gorgée. Cette propriété fait des Tremere des cibles de choix pour ceux qui voudraient les asservir – ou des manipulateurs efficaces qui utilisent leur propre vitae comme appât. Au sein du clan, cette particularité renforçait autrefois la loyauté à la Pyramide. Aujourd'hui, elle fait de chaque Tremere un dealer potentiel et une proie tentante.",
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
    roleplay: "Le monde est théâtre. La vérité est négociable. Le mouvement est vie. L'immobilité est mort."
  },

  setite: {
    name: "Setite (Ministère)",
    title: "Les Tentateurs",
    shortDesc: "Serviteurs de Set, corrupteurs d'âmes",
    description: "Les Setites, aujourd'hui appelés le Ministère, se considèrent comme des libérateurs. Ils identifient tes chaînes – morale, foi, loyauté – et t'offrent la clé. Mais cette liberté a un prix, et Set réclame toujours son dû.",
    quote: "« Nous n'imposons rien. Nous révélons simplement ce que tu désirais déjà. »",
    specificities: "• Disciplines : Obfuscate, Présence, Serpentis\n• Vulnérabilité accrue à la lumière\n• Descendants du dieu Set selon leur mythologie",
    bane: "L'Ennemi de la Lumière",
    baneDescription: "Les Setites portent les ténèbres de leur dieu dans leur sang. Toute lumière vive les incommode : les néons leur donnent des migraines, les flashs les aveuglent plus longtemps, les phares de voiture sont douloureux. Mais c'est le soleil qui révèle leur vraie malédiction – ses rayons les brûlent avec une férocité terrifiante, bien plus rapidement que les autres vampires. Quelques secondes d'exposition peuvent être fatales là où d'autres auraient des minutes.",
    roleplay: "Tu es le libérateur, pas le corrupteur. Chacun a des chaînes. Tu offres seulement la clé."
  },

  giovanni: {
    name: "Giovanni (Hecata)",
    title: "Les Nécromanciens",
    shortDesc: "Famille mafieuse, maîtres de la mort",
    description: "Les Giovanni sont une famille vampirique incestueuse obsédée par la mort et les affaires. Ils commandent les morts et les fantômes comme outils, tissant un empire criminel qui s'étend des deux côtés du Linceul.",
    quote: "« Les affaires sont les affaires. Que ce soit avec les vivants ou les morts. »",
    specificities: "• Disciplines : Domination, Nécromancie, Puissance\n• Morsure extrêmement douloureuse\n• Structure clanique basée sur la famille mortelle",
    bane: "Le Baiser de Douleur",
    baneDescription: "La morsure des Giovanni n'apporte aucun plaisir – seulement une agonie atroce. Là où le Baiser des autres vampires est extatique, celui des Hecata est une torture. Les victimes hurlent, se débattent, griffent. Elles ne tombent pas dans l'euphorie béate mais dans la terreur pure. Cette particularité rend l'alimentation discrète presque impossible et laisse les victimes traumatisées, avec des souvenirs vivaces de l'attaque. La Mascarade exige des Giovanni une créativité morbide pour se nourrir.",
    roleplay: "La famille avant tout. Les affaires sont sacrées. Les morts sont des outils, pas des personnes."
  },

  banu_haqim: {
    name: "Banu Haqim (Assamites)",
    title: "Les Juges",
    shortDesc: "Assassins saints, juges du sang",
    description: "Les Banu Haqim sont des guerriers-juges se considérant comme les exécuteurs de la loi divine. Autrefois assassins assoiffés de sang vampirique, beaucoup ont rejoint la Camarilla, apportant leur code de justice et leurs lames dans la nuit.",
    quote: "« Nous ne sommes pas des meurtriers. Nous sommes le bras de la justice. »",
    specificities: "• Disciplines : Célérité, Obfuscate, Sorcellerie du Sang\n• Soif particulière pour le sang vampirique\n• Code d'honneur strict (la Loi de Haqim)",
    bane: "La Soif du Juge",
    baneDescription: "Le sang vampirique appelle les Banu Haqim comme une drogue. Quand ils y goûtent – même une goutte – une faim terrible s'éveille, une compulsion à en boire davantage. Résister demande une volonté de fer. Céder mène à la diablerie, ce crime ultime qui consiste à vider complètement un vampire et dévorer son âme. Cette soif a valu aux Assamites leur réputation de chasseurs de vampires et reste un combat constant, même pour les plus pieux d'entre eux.",
    roleplay: "Justice, honneur, discipline. Tu juges chaque action selon la Loi. Les coupables doivent être punis."
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
