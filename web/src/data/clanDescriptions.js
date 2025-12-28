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
    roleplay: "Tes passions brûlent plus fort que ta raison. Chaque injustice te fait bouillir. La diplomatie n'est jamais ta première option."
  },

  gangrel: {
    name: "Gangrel",
    title: "Les Fauves",
    shortDesc: "Prédateurs sauvages, un avec la nature",
    description: "Les Gangrel sont plus bêtes que vampires, façonnés par la nature sauvage plutôt que par la civilisation. Nomades et solitaires, ils développent des traits animaux au fil du temps. Leur Bête n'est pas enfouie – elle marche à leurs côtés comme une compagne.",
    quote: "« La ville n'est qu'une jungle de béton. Et chaque jungle a ses prédateurs. »",
    specificities: "• Disciplines : Animalisme, Protéisme, Force d'âme\n• Traits bestiaux apparaissant lors des frénésies\n• Affinité profonde avec le monde animal",
    roleplay: "Tu penses comme un prédateur. Le territoire, la hiérarchie, la survie. Les mots sont secondaires face aux instincts."
  },

  malkavian: {
    name: "Malkavien",
    title: "Les Fous",
    shortDesc: "Prophètes déments, maudits par la folie",
    description: "Les Malkaviens portent la folie comme une malédiction et un don. Ils voient ce que les autres ne peuvent pas voir, perçoivent les vérités cachées sous le voile de la réalité. Certains les appellent fous. D'autres, prophètes. Souvent, les deux sont vrais.",
    quote: "« Tu ne vois que ce qu'ils veulent que tu voies. Mais moi, j'entends leurs secrets hurler dans le silence. »",
    specificities: "• Disciplines : Auspex, Domination, Occultation\n• Aliénation mentale transmise par l'Étreinte\n• Connectés via le Réseau de la Folie (Cobweb)",
    roleplay: "La réalité est fluide pour toi. Tu vois des patterns, des connexions, des vérités que personne d'autre ne perçoit."
  },

  nosferatu: {
    name: "Nosferatu",
    title: "Les Horreurs",
    shortDesc: "Monstrueux et difformes, maîtres des secrets",
    description: "La Malédiction transforme tous les Nosferatu en créatures hideuses, les forçant à vivre dans les ombres. Mais cette monstruosité a un prix : ils deviennent les maîtres de l'information, les araignées tissant des toiles depuis les égouts et les catacombes.",
    quote: "« Vous craignez ce que vous voyez. Nous utilisons ce que vous ne voyez pas. »",
    specificities: "• Disciplines : Animalisme, Occultation, Puissance\n• Apparence monstrueuse révélant la nature vampirique\n• Réseau d'information mondial (SchreckNET)",
    roleplay: "L'ombre est ton alliée. Tu observes, tu écoutes, tu archives. Les secrets sont ta monnaie."
  },

  toreador: {
    name: "Toreador",
    title: "Les Artistes",
    shortDesc: "Passionnés de beauté, paralysés par la perfection",
    description: "Les Toreador sont les amants éternels, les artistes obsédés par la beauté sous toutes ses formes. Mais leur passion est aussi leur malédiction : face à la vraie beauté, ils perdent toute volonté, hypnotisés et impuissants.",
    quote: "« L'éternité sans art ne serait qu'une prison. Autant mourir vraiment. »",
    specificities: "• Disciplines : Auspex, Célérité, Présence\n• Fascination paralysante face à la beauté\n• Intégrés dans le monde artistique mortel",
    roleplay: "Le monde est une galerie d'art. Tu cherches constamment la prochaine œuvre parfaite, le prochain chef-d'œuvre."
  },

  tremere: {
    name: "Tremere",
    title: "Les Sorciers",
    shortDesc: "Mages devenus vampires, maîtres du sang",
    description: "Les Tremere sont des usurpateurs qui ont volé l'immortalité par la magie du sang. Organisés en pyramide rigide, ils pratiquent la Thaumaturgie – la sorcellerie vampirique. Jamais vraiment acceptés, toujours craints.",
    quote: "« Le sang n'est que l'encre. La vraie magie, c'est savoir écrire le bon sortilège. »",
    specificities: "• Disciplines : Auspex, Domination, Sorcellerie du Sang\n• Structure pyramidale hiérarchique\n• Usurpateurs du sang des Salubri",
    roleplay: "Le savoir est pouvoir. La discipline est force. La hiérarchie est sacrée. Tu études, tu expérimentes, tu contrôles."
  },

  ventrue: {
    name: "Ventrue",
    title: "Les Rois",
    shortDesc: "Nobles dominateurs, sang bleu des vampires",
    description: "Les Ventrue sont les rois autoproclamés des Damnés. Dirigeants naturels, stratèges et politiciens, ils considèrent le commandement comme leur droit de naissance. Mais leur sang noble est difficile – ils ne peuvent se nourrir que d'un type spécifique de mortel.",
    quote: "« La couronne n'est pas une récompense. C'est un fardeau que nous portons pour que d'autres n'aient pas à le faire. »",
    specificities: "• Disciplines : Domination, Force d'âme, Présence\n• Palais raffiné : sang spécifique requis\n• Fondateurs et dirigeants de la Camarilla",
    roleplay: "Tu es né pour diriger. Les autres suivent ou s'écartent. La structure et l'ordre sont ta raison d'être."
  },

  lasombra: {
    name: "Lasombra",
    title: "Les Magisters",
    shortDesc: "Maîtres des ténèbres, prédateurs sociaux",
    description: "Les Lasombra commandent les ténèbres elles-mêmes, transformant l'ombre en arme et en bouclier. Darwinistes sociaux impitoyables, ils croient que seuls les forts méritent de survivre. Leurs reflets n'existent pas – comme leur pitié.",
    quote: "« La lumière révèle. Les ténèbres protègent. Et nous maîtrisons l'obscurité elle-même. »",
    specificities: "• Disciplines : Domination, Obténébration, Puissance\n• Absence de reflet dans les miroirs et caméras\n• Anciens piliers du Sabbat, maintenant éparpillés",
    roleplay: "Seuls les forts survivent. La pitié est faiblesse. Les ténèbres sont ton royaume, et tu y règnes."
  },

  tzimisce: {
    name: "Tzimisce",
    title: "Les Dragons",
    shortDesc: "Façonneurs de chair, nobles terrifiants",
    description: "Les Tzimisce sont des artistes de l'horreur, sculptant la chair et l'os comme de l'argile vivante. Terrifiants et territoriaux, ils sont liés mystiquement à leurs terres ancestrales. Leur hospitalité est légendaire – mais refuse-la à tes risques et périls.",
    quote: "« La forme humaine n'est qu'une suggestion. Laisse-moi te montrer ton vrai potentiel. »",
    specificities: "• Disciplines : Animalisme, Domination, Vicissitude\n• Liés mystiquement à leur terre natale\n• Traditions d'hospitalité sacrées et impitoyables",
    roleplay: "Le corps est argile. Le territoire est sacré. Les traditions doivent être respectées. La perfection s'acquiert."
  },

  ravnos: {
    name: "Ravnos",
    title: "Les Illusionnistes",
    shortDesc: "Nomades trompeurs, maîtres de l'illusion",
    description: "Les Ravnos sont des vagabonds éternels, créateurs d'illusions si réelles qu'elles peuvent tromper tous les sens. Presque anéantis durant la Semaine des Cauchemars, les survivants errent, incapables de rester en place, tissant mensonges et merveilles.",
    quote: "« La vérité ? Ennuyeuse. L'illusion ? Un art. Choisis celle qui raconte la meilleure histoire. »",
    specificities: "• Disciplines : Animalisme, Chimerstry, Présence\n• Incapables de rester longtemps au même endroit\n• Clan décimé par la Semaine des Cauchemars",
    roleplay: "Le monde est théâtre. La vérité est négociable. Le mouvement est vie. L'immobilité est mort."
  },

  setite: {
    name: "Setite (Ministère)",
    title: "Les Tentateurs",
    shortDesc: "Serviteurs de Set, corrupteurs d'âmes",
    description: "Les Setites, aujourd'hui appelés le Ministère, se considèrent comme des libérateurs. Ils identifient tes chaînes – morale, foi, loyauté – et t'offrent la clé. Mais cette liberté a un prix, et Set réclame toujours son dû.",
    quote: "« Nous n'imposons rien. Nous révélons simplement ce que tu désirais déjà. »",
    specificities: "• Disciplines : Obfuscate, Présence, Serpentis\n• Vulnérabilité accrue à la lumière\n• Descendants du dieu Set selon leur mythologie",
    roleplay: "Tu es le libérateur, pas le corrupteur. Chacun a des chaînes. Tu offres seulement la clé."
  },

  giovanni: {
    name: "Giovanni (Hecata)",
    title: "Les Nécromanciens",
    shortDesc: "Famille mafieuse, maîtres de la mort",
    description: "Les Giovanni sont une famille vampirique incestueuse obsédée par la mort et les affaires. Ils commandent les morts et les fantômes comme outils, tissant un empire criminel qui s'étend des deux côtés du Linceul.",
    quote: "« Les affaires sont les affaires. Que ce soit avec les vivants ou les morts. »",
    specificities: "• Disciplines : Domination, Nécromancie, Puissance\n• Morsure extrêmement douloureuse\n• Structure clanique basée sur la famille mortelle",
    roleplay: "La famille avant tout. Les affaires sont sacrées. Les morts sont des outils, pas des personnes."
  },

  banu_haqim: {
    name: "Banu Haqim (Assamites)",
    title: "Les Juges",
    shortDesc: "Assassins saints, juges du sang",
    description: "Les Banu Haqim sont des guerriers-juges se considérant comme les exécuteurs de la loi divine. Autrefois assassins assoiffés de sang vampirique, beaucoup ont rejoint la Camarilla, apportant leur code de justice et leurs lames dans la nuit.",
    quote: "« Nous ne sommes pas des meurtriers. Nous sommes le bras de la justice. »",
    specificities: "• Disciplines : Célérité, Obfuscate, Sorcellerie du Sang\n• Soif particulière pour le sang vampirique\n• Code d'honneur strict (la Loi de Haqim)",
    roleplay: "Justice, honneur, discipline. Tu juges chaque action selon la Loi. Les coupables doivent être punis."
  },

  gargoyles: {
    name: "Gargouilles",
    title: "Les Gardiens de Pierre",
    shortDesc: "Créations des Tremere, sentinelles ailées",
    description: "Les Gargouilles ne sont pas nées – elles ont été créées. Façonnées par les Tremere à partir d'autres vampires, ces monstres de pierre et de chair servent de gardiens et de guerriers. Certains ont gagné leur liberté. Tous portent les cicatrices de l'esclavage.",
    quote: "« Nous n'avons pas été invités dans cette non-vie. Nous y avons été forgés. »",
    specificities: "• Disciplines : Force d'âme, Puissance, Visceratika\n• Capacité de vol et peau quasi-minérale\n• Créés artificiellement par les Tremere",
    roleplay: "Tu es un outil qui a pris conscience. Créé pour servir, tu cherches maintenant un but. Les ordres viennent naturellement."
  },

  samedi: {
    name: "Samedi",
    title: "Les Cadavres Ambulants",
    shortDesc: "Morts-vivants pourrissants, terreur incarnée",
    description: "Les Samedi sont ce que les autres vampires craignent de devenir : des cadavres en décomposition, pourrissants mais animés. Leur corps se désagrège continuellement, l'odeur de la tombe les suit partout. Mais cette putréfaction est aussi leur arme.",
    quote: "« La mort ne nous a pas pris. Elle nous habite. »",
    specificities: "• Disciplines : Force d'âme, Obfuscate, Thanatose\n• Corps en état de décomposition perpétuelle\n• Origines liées aux rites vaudou caribéens",
    roleplay: "Tu es la mort qui marche. Les vivants te révulsent autant que tu les dégoûtes. L'horreur est ton royaume."
  },

  daughters_cacophony: {
    name: "Filles de la Cacophonie",
    title: "Les Sirènes",
    shortDesc: "Voix mortelles, chanteuses ensorcelantes",
    description: "Les Filles de la Cacophonie commandent le son lui-même, transformant leur voix en arme ou en sortilège. Infiltrées dans le monde de la musique, elles tissent des sorts par le chant et brisent les esprits par la mélodie.",
    quote: "« Ma voix peut t'élever aux cieux... ou te précipiter en enfer. Choisis ta chanson avec soin. »",
    specificities: "• Disciplines : Force d'âme, Melpominée, Présence\n• Pouvoir canalisé entièrement par la voix\n• Origines mystérieuses, possiblement Toreador ou Malkavien",
    roleplay: "Ta voix est ton instrument. Chaque mot est une note. Le monde est ta scène, et tous écoutent."
  },

  baali: {
    name: "Baali",
    title: "Les Démonolâtres",
    shortDesc: "Serviteurs des démons, corrupteurs apocalyptiques",
    description: "Les Baali sont la souillure incarnée, adorateurs de puissances infernales cherchant activement à déclencher la fin du monde. Chassés, maudits, haïs par tous les autres clans – et avec raison. Leur simple existence est une profanation.",
    quote: "« Ce monde est déjà damné. Nous ne faisons qu'accélérer l'inévitable. »",
    specificities: "• Disciplines : Daimoinon, Obfuscate, Présence\n• Vulnérables aux symboles sacrés de toutes les fois\n• Chassés par tous les autres vampires sans exception",
    roleplay: "Tu as vu au-delà du voile. Les démons sont réels, et tu leur as prêté allégeance. L'apocalypse n'est pas à craindre – elle est à embrasser."
  },

  salubri: {
    name: "Salubri",
    title: "Les Cyclopes",
    shortDesc: "Guérisseurs maudits, chassés et rares",
    description: "Les Salubri étaient autrefois des guérisseurs et des guerriers saints. Aujourd'hui presque éteints, chassés par les Tremere qui ont volé leur place, les derniers Salubri sont des reliques vivantes d'une époque révolue. Leur troisième œil est malédiction et bénédiction.",
    quote: "« Nous ne cherchons pas la vengeance. Seulement la vérité. Mais la vérité, parfois, exige le sang. »",
    specificities: "• Disciplines : Auspex, Force d'âme, Valeren/Obeah\n• Troisième œil s'ouvrant lors des pouvoirs\n• Clan presque exterminé par les Tremere",
    roleplay: "Tu es un survivant d'un génocide. Chaque nuit peut être ta dernière. La compassion te guide, mais la prudence te maintient en vie."
  }
};

/**
 * Récupère la description d'un clan
 */
export function getClanDescription(clanId) {
  return CLAN_DESCRIPTIONS[clanId.toLowerCase()];
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
