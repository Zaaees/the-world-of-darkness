/**
 * Database of V20 Rituals (Thaumaturgy & Necromancy).
 * Content is strictly narrative (Grimoire style).
 * 
 * Schema:
 * {
 *   id: string (unique),
 *   title_fr: string,
 *   title_en: string,
 *   level: number,
 *   discipline: 'thaumaturgy' | 'necromancy',
 *   blood_cost: number (implied in text, used for filter),
 *   description_md: string (Markdown),
 *   system_tags: array
 * }
 */

export const rituals_v20 = [
    {
        "id": "thaum_lvl1_defense_sacred_haven",
        "title_fr": "Défense du Havre Sacré",
        "title_en": "Defense of the Sacred Haven",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Pour préserver le sommeil des justes — ou des maudits — ce rituel est la première leçon de survie du Tremere prudent.*\n\nCe rituel permet d'imprégner un sanctuaire d'une protection solaire, empêchant la lumière du jour de franchir ses seuils, même si les fenêtres venaient à être brisées.\n\n**Le Rite :**\nL'opérateur doit consacrer une heure entière à tracer les sigiles de protection sur chaque ouverture de la pièce, en utilisant le sang d'une créature n'ayant jamais vu le soleil — souvent un animal chtonien ou sa propre vitae, si le besoin s'en fait sentir. Le chant doit être maintenu sans interruption.\n\n**L'Effet :**\nTant que l'opérateur demeure dans l'enceinte, les rayons du soleil s'arrêtent aux frontières du havre, incapables de brûler la chair de ceux qui s'y abritent. La protection persiste aussi longtemps que la concentration du thaumaturge n'est pas rompue, ou jusqu'à ce que les ombres du crépuscule libèrent enfin le monde de la tyrannie du jour. Attention toutefois : si vous quittez les lieux, le voile se déchire instantanément.",
        "system_tags": ["protection", "sunlight", "haven"]
    },
    {
        "id": "thaum_lvl1_bind_accusing_tongue",
        "title_fr": "Lier la Langue de l'Accusateur",
        "title_en": "Bind the Accusing Tongue",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Les rumeurs sont plus tranchantes que les lames. Ce rituel est le fourreau qui les réduit au silence.*\n\nUne ancienne malédiction conçue pour étouffer les calomnies avant qu'elles ne soient prononcées, forçant vos ennemis à ravaler leurs mensonges — ou leurs vérités.\n\n**Le Rite :**\nLe sorcier doit façonner une effigie de sa victime, faite de cire noire et de poussière de tombe. Il lui faut enrouler une cordelette autour du cou de la poupée, tout en chantant le nom de celui qu'il souhaite faire taire. Aucune offrande de sang n'est requise, seule la volonté de domination suffit.\n\n**L'Effet :**\nSi le rituel est accompli avec succès, la victime se trouve physiquement incapable de dire du mal de l'opérateur. Dès que l'intention de nuire verbalement se forme dans son esprit, sa langue s'engourdit, sa gorge se noue, et seuls des sons inarticulés franchissent ses lèvres. Le silence forcé perdure tant que l'effigie reste intacte et que la victime ne brise pas le sort par une volonté de fer.",
        "system_tags": ["curse", "Social", "silence"]
    },
    {
        "id": "thaum_lvl1_blood_into_water",
        "title_fr": "Sang en Eau",
        "title_en": "Blood Into Water",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *La lignée de Caïn tire sa force du sang. Transformez cette force en la plus banale des eaux, et vous verrez les princes ramper.*\n\nCe rituel cruel transmute l'essence vitale d'une victime en eau inerte, la privant de sa force sans laisser la moindre marque extérieure.\n\n**Le Rite :**\nLe thaumaturge doit toucher sa victime — ou posséder un échantillon de son sang — et verser une coupe d'eau pure sur le sol en prononçant les paroles de dilution. L'acte symbolique de la pureté chassant la souillure du sang active le sortilège.\n\n**L'Effet :**\nLa victime ne ressent aucune douleur immédiate, mais une soudaine et terrible faiblesse. Une portion significative de sa réserve de sang se change en eau, inutile et fade. Pour un mortel, c'est une anémie foudroyante ; pour un vampire, c'est la faim qui surgit sans avertissement, le rapprochant dangereusement de la Bête. La transmutation est irréversible : le sang perdu ne reviendra pas.",
        "system_tags": ["attack", "blood-loss", "transmutation"]
    },
    {
        "id": "thaum_lvl1_blood_rush",
        "title_fr": "Afflux Sanguin",
        "title_en": "Blood Rush",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Nous ne sommes pas des bêtes, mais nous pouvons emprunter leur fureur quand la nécessité l'exige.*\n\nCe rituel permet au sorcier de stimuler artificiellement sa propre Vitae, simulant la puissance physique d'un ancien sans en payer le prix habituel en sang, bien que le risque émotionnel demeure.\n\n**Le Rite :**\nLe Vampire doit se placer devant un miroir et se concentrer sur son propre reflet. Il doit entailler sa lèvre inférieure et laisser perler une goutte de son propre sang (offrande minimale) tout en commandant à son image de devenir plus forte, plus rapide, plus terrifiante.\n\n**L'Effet :**\nUne vague de puissance envahit les membres du sorcier. Il se sent capable de briser la pierre et de courir plus vite que le vent. Cependant, cette force empruntée éveille la Bête : le sorcier devient irritable, prompt à la colère, et doit lutter pour ne pas céder à la frénésie à la moindre provocation. L'effet s'estompe après une courte période, laissant le thaumaturge aussi calme — et faible — qu'auparavant.",
        "system_tags": ["buff", "physical", "frenzy-risk"]
    },
    {
        "id": "thaum_lvl1_communication_kindred_sire",
        "title_fr": "Communication avec le Sire",
        "title_en": "Communication with Kindred Sire",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Le lien entre un Infant et son Créateur ne s'efface jamais vraiment. Ce rituel ne fait que tirer sur la chaîne.*\n\nUne méthode de communication télépathique à longue distance, permettant de s'adresser à son Sire où qu'il soit, pour demander conseil... ou implorer pitié.\n\n**Le Rite :**\nL'Initié doit méditer sur un objet ayant appartenu à son Sire, ou mieux, sur une relique imprégnée de son sang. Le rituel dure une demi-heure de concentration intense où l'esprit du lanceur cherche la signature psychique de son créateur.\n\n**L'Effet :**\nUn canal mental s'ouvre. Le Sire entend la voix de son Infant dans sa tête comme si ce dernier chuchotait à son oreille, et peut répondre par la pensée. La conversation peut durer quelques minutes. Attention : ce rituel n'oblige pas le Sire à répondre, ni même à écouter, mais il saura toujours qui l'appelle.",
        "system_tags": ["communication", "telepathy", "sire"]
    },
    {
        "id": "thaum_lvl1_deflection_wooden_doom",
        "title_fr": "Déflexion du Fléau de Bois",
        "title_en": "Deflection of Wooden Doom",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Le bois est la matière du cercueil, pas celle de la mort. Assurez-vous qu'il en reste ainsi.*\n\nUne protection vitale contre la plus grande peur des Immortels : la paralysie par le pieu.\n\n**Le Rite :**\nLe thaumaturge doit s'entourer d'un cercle de bois brisé (branches, planches) et passer une heure en méditation, visualisant son cœur comme une forteresse imprenable. À la fin du rite, il doit placer une minuscule écharde de bois sous sa langue et la garder ainsi jusqu'au coucher du soleil.\n\n**L'Effet :**\nLe rituel reste dormant jusqu'à ce que le destin frappe. Si un pieu en bois devait pénétrer le cœur du sorcier, le sortilège s'active violemment. Le bois de l'arme se désintègre en sciure inoffensive ou se brise net contre la peau, sauvant le vampire de la torpeur. Ce miracle ne fonctionne qu'une seule fois ; une fois le pieu détruit, le rituel doit être réappris.",
        "system_tags": ["protection", "wood", "stake"]
    },
    {
        "id": "thaum_lvl1_devils_touch",
        "title_fr": "Toucher du Diable",
        "title_en": "Devil's Touch",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *La solitude est une malédiction bien plus lourde que le sang. Infligez-la à vos ennemis, et regardez-les se faire déchirer par leurs propres alliés.*\n\nCe rituel de sabotage social transforme la victime en paria, inspirant une revulsion irrationnelle à tous ceux qui croisent son chemin.\n\n**Le Rite :**\nLe sorcier doit enchanter une petite pièce de monnaie (souvent un sou terni) en la maudissant avec des noms de démons oubliés. Il doit ensuite réussir à glisser cette pièce sur la personne de la cible — dans une poche, une chaussure, ou les plis d'un vêtement — sans se faire repérer.\n\n**L'Effet :**\nDès que le contact est établi, l'aura de la victime se teinte d'une nuance écœurante. Tous les êtres vivants ou non-morts ressentent un dégoût instinctif en sa présence. Les alliés deviennent froids, les neutres deviennent hostiles, et les ennemis deviennent violents. La victime se retrouve isolée, traitée comme un lépreux moral, jusqu'à ce qu'elle se débarrasse de la pièce maudite ou que le soleil se lève.",
        "system_tags": ["curse", "social", "repulsion"]
    },
    {
        "id": "thaum_lvl1_domino_life",
        "title_fr": "Domino de Vie",
        "title_en": "Domino of Life",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Parfois, le masque le plus efficace est celui de la vie elle-même.*\n\nCe rituel permet à un vampire de simuler les fonctions biologiques humaines avec une perfection trompeuse.\n\n**Le Rite :**\nLe vampire doit ingérer (ou simuler l'ingestion) d'aliments humains qu'il aura préalablement 'bénis' d'une goutte de son propre sang. Il doit se concentrer sur le souvenir de sa propre respiration, des battements de son cœur mortel.\n\n**L'Effet :**\nPour la durée d'une nuit, le corps du vampire se réchauffe. Sa peau prend une teinte rosée, son cœur bat (lentement mais auditivement), et il peut consommer nourriture et boisson sans les rejeter immédiatement (bien qu'il doive les purger plus tard). Il peut même saigner rouge s'il est coupé. C'est le camouflage ultime pour se mouvoir parmi les mortels sans éveiller le moindre soupçon.",
        "system_tags": ["masquerade", "disguise", "life-mimicry"]
    },
    // --- Niveau 1 (Suite - Fin) ---
    {
        "id": "thaum_lvl1_encrypt_missive",
        "title_fr": "Chiffrage de Missive",
        "title_en": "Encrypt Missive",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Les secrets sont la monnaie de notre espèce. Assurez-vous que personne ne vole votre bourse.*\n\nCe rituel encode un message de sorte que seul le destinataire prévu puisse le déchiffrer.\n\n**Le Rite :**\nLe scribe doit rédiger sa lettre avec une encre mêlée d'une goutte de son sang, tout en murmurant le Nom Véritable (ou le nom d'usage courant) du destinataire à chaque ligne. Aucun cryptage mathématique n'est nécessaire ; la magie brouille la perception même du texte.\n\n**L'Effet :**\nPour quiconque n'est pas le destinataire nommé, le parchemin semble couvert d'une liste de courses banale, de charabia incohérent, ou d'une lettre d'amour maladroite. Seul les yeux de la cible verront les mots véritables se réarranger pour révéler le message caché.",
        "system_tags": ["utility", "communication", "secrecy"]
    },
    {
        "id": "thaum_lvl1_expedient_paperwork",
        "title_fr": "Paperasse Expéditive",
        "title_en": "Expedient Paperwork",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *La bureaucratie est le véritable enfer des mortels. Un Sorcier n'y fait pas la queue.*\n\nUn sortilège pragmatique pour accélérer les procédures administratives.\n\n**Le Rite :**\nLe vampire signe le document concerné avec une encre infusée de sa volonté (et d'une trace infime de vitae), visualisant le papier traversant les couloirs administratifs comme une flèche.\n\n**L'Effet :**\nLe dossier devient 'invisible' aux délais. Les fonctionnaires le tamponnent sans le lire, il ne se perd jamais, et il arrive au sommet de chaque pile. Ce qui prendrait des mois est résolu en une journée.",
        "system_tags": ["utility", "social", "bureaucracy"]
    },
    {
        "id": "thaum_lvl1_imps_affliction",
        "title_fr": "Affliction du Diablotin",
        "title_en": "Imp's Affliction",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Il n'est pas toujours nécessaire de tuer pour punir. Parfois, un nez qui coule suffit à ruiner une réputation.*\n\nUne malédiction mineure mais humiliante, conçue pour affaiblir un rival ou punir un serviteur insolent.\n\n**Le Rite :**\nLe sorcier écrit le nom de sa victime sur un morceau de papier, le froisse, le déchire et le jette dans un tas d'immondices ou de compost.\n\n**L'Effet :**\nLa victime est frappée d'une maladie soudaine et grotesque : nausées violentes, otites, crampes d'estomac et faiblesse générale. Elle n'en mourra pas, mais elle sera incapable d'actions physiques intenses ou de socialisation élégante pour la nuit.",
        "system_tags": ["curse", "disease", "debuff"]
    },
    {
        "id": "thaum_lvl1_incantation_shepherd",
        "title_fr": "Incantation du Berger",
        "title_en": "Incantation of the Shepherd",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Un bon berger ne perd jamais ses brebis, surtout quand il a soif.*\n\nCe rituel permet de localiser tout mortel dont le vampire a goûté le sang au moins trois fois (son Troupeau).\n\n**Le Rite :**\nLe vampire tient deux morceaux de verre devant ses yeux et tourne lentement sur lui-même en chantant le nom de ses 'brebis'.\n\n**L'Effet :**\nDes fils rouges invisibles apparaissent dans sa vision, reliant son propre cœur à ceux de son Troupeau. Il connaît intuitivement la direction et la distance de chacun d'eux.",
        "system_tags": ["utility", "herd", "tracking"]
    },
    {
        "id": "thaum_lvl1_purity_flesh",
        "title_fr": "Pureté de la Chair",
        "title_en": "Purity of Flesh",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Votre corps est un temple éternel. Ne laissez pas les ordures s'y accumuler.*\n\nUn rituel de purge corporelle, expulsant tout agent étranger de l'organisme du Vampire.\n\n**Le Rite :**\nLe thaumaturge s'assoit au centre d'un cercle de pierres tranchantes et médite sur la pureté de son essence de non-mort. Il doit focaliser sa vitae pour rejeter l'intrusion.\n\n**L'Effet :**\nLe corps rejette violemment tout ce qui ne lui appartient pas : les balles sont poussées hors des plaies, les échardes tombent, l'alcool et les drogues sont purgés (souvent par vomissement de sang noir), et même l'encre des tatouages récents suinte hors de la peau. Le vampire est 'réinitialisé'.",
        "system_tags": ["healing", "cleansing", "utility"]
    },
    {
        "id": "thaum_lvl1_rebirth_mortal_vanity",
        "title_fr": "Renaissance de la Vanité Mortelle",
        "title_en": "Rebirth of Mortal Vanity",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *L'éternité ne devrait pas signifier une mauvaise coupe de cheveux pour toujours.*\n\nCe rituel permet de contourner la Malédiction qui remet le corps du vampire dans son état de l'Étreinte chaque soir, spécifiquement pour les cheveux.\n\n**Le Rite :**\nFace à un miroir, le vampire mime le geste de peigner ou couper ses cheveux tout en tenant des mèches de cheveux prélevées sur un enfant mortel.\n\n**L'Effet :**\nLes cheveux du vampire poussent instantanément et peuvent être coiffés ou coupés. Contrairement à d'habitude, cette nouvelle coiffure persistera les nuits suivantes jusqu'à ce que le vampire décide de l'annuler ou subisse des dégâts massifs.",
        "system_tags": ["utility", "social", "appearance"]
    },
    {
        "id": "thaum_lvl1_rite_introduction",
        "title_fr": "Rite d'Introduction",
        "title_en": "Rite of Introduction",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *N'entrez jamais dans la maison d'un Sorcier sans frapper. Ce rituel est le coup à la porte.*\n\nLe protocole formel pour s'annoncer à la Chantry (Fondation) locale en arrivant dans une nouvelle ville.\n\n**Le Rite :**\nLe voyageur fait bouillir une petite quantité de son sang dans un chaudron de fer, en récitant son lignage complet, son Sire, et son rang dans la Pyramide. La vapeur porte le message.\n\n**L'Effet :**\nLe Régent du domaine ressent une pression psychique et entend la présentation mentale du nouvel arrivant. C'est la seule manière polie — et sûre — d'entrer dans un territoire Tremere sans être considéré comme une menace.",
        "system_tags": ["social", "etiquette", "tremere"]
    },
    {
        "id": "thaum_lvl1_scent_lupine",
        "title_fr": "Parfum du Passage du Lupin",
        "title_en": "Scent of the Lupine's Passing",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Les chiens mouillés on une odeur distincte. Les monstres aussi.*\n\nPermet au vampire de détecter la présence de Loups-Garous par l'odorat.\n\n**Le Rite :**\nLe vampire inhale la fumée d'un mélange d'herbes brûlées (aconit et asclépiade), préparé avec des précautions extrêmes (l'aconit est mortel pour les mortels, mais inoffensif ici).\n\n**L'Effet :**\nL'odorat du vampire s'aiguise spécifiquement pour la bête. Les Garous sentent le chien mouillé, le musc sauvage et la rage. Le vampire peut pister un Lupin ou savoir s'il y en a un caché dans la pièce.",
        "system_tags": ["detection", "lupines", "survival"]
    },
    {
        "id": "thaum_lvl1_wake_evening_freshness",
        "title_fr": "Réveil à la Fraîcheur du Soir",
        "title_en": "Wake with Evening's Freshness",
        "level": 1,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Le jour est notre ennemi, mais nous ne devons pas être sans défense.*\n\nUn rituel de survie essentiel permettant de se réveiller en cas de danger pendant la journée.\n\n**Le Rite :**\nJuste avant de s'endormir à l'aube, le vampire brûle les plumes d'un coq et inhale la fumée acre, jurant de rester vigilant.\n\n**L'Effet :**\nSi un danger approche du refuge pendant le jour (incendie, intrus), le vampire se réveille instantanément, sans la lourdeur surnaturelle habituelle. Il peut agir sans pénalité pour se défendre ou fuir.",
        "system_tags": ["survival", "daytime", "protection"]
    },

    // --- NIVEAU 2 : Rituels d'Initié ---
    {
        "id": "thaum_lvl2_blood_walk",
        "title_fr": "Promenade du Sang",
        "title_en": "Blood Walk",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Le sang ne ment jamais. Il chante l'histoire de ses pères.*\n\nL'outil d'enquête ultime des Tremere. Ce rituel révèle le lignage d'un autre vampire à partir d'un simple échantillon de sa vitae.\n\n**Le Rite :**\nLe thaumaturge goûte une goutte du sang du sujet (frais ou séché, tant qu'il n'est pas inerte) et entre dans une transe méditative, remontant le courant rouge vers la source.\n\n**L'Effet :**\nDes visions assaillent le sorcier. Il voit le visage du Sire de la cible, puis du Sire de son Sire, remontant parfois plusieurs générations. Il apprend instantanément la Génération véritable de la cible, son Clan, et l'identité de ses créateurs. C'est un outil redoutable pour démasquer les imposteurs ou les Caitiffs.",
        "system_tags": ["investigation", "lineage", "blood"]
    },
    {
        "id": "thaum_lvl2_burning_blade",
        "title_fr": "Lame Ardente",
        "title_en": "Burning Blade",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Le feu purifie. L'acier tranche. Ensemble, ils sont la fin de toute chose.*\n\nCe rituel enchante une arme de mêlée pour qu'elle inflige des blessures impossibles à guérir pour les créatures surnaturelles.\n\n**Le Rite :**\nLe sorcier passe la paume de sa main (qu'il doit entailler pour faire couler le sang) le long de la lame d'une arme blanche. Il invoque les esprits du feu.\n\n**L'Effet :**\nL'arme s'illumine d'une aura verte émeraude malsaine (il n'y a pas de chaleur, mais une lumière intense). Chaque coup porté inflige des dégâts Aggravés aux vampires et autres créatures, la magie brûlant la chair maudite aussi sûrement que le feu réel. L'enchantement dure quelques coups avant de se dissiper.",
        "system_tags": ["combat", "buff", "aggravated-damage"]
    },
    {
        "id": "thaum_lvl2_mask_shadows",
        "title_fr": "Revêtir le Masque des Ombres",
        "title_en": "Donning the Mask of Shadows",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *On ne peut frapper ce qu'on ne peut voir.*\n\nUne forme mineure d'invisibilité, moins parfaite que l'Occultation mais accessible par l'étude.\n\n**Le Rite :**\nLe vampire s'assoit dans l'obscurité totale et 'tisse' les ombres autour de lui avec ses mains pendant 20 minutes, s'enveloppant dans leur essence.\n\n**L'Effet :**\nLe vampire devient translucide, ses contours flous et grisâtres. Il n'est pas totalement invisible, mais l'œil a naturellement tendance à glisser sur lui, le confondant avec l'arrière-plan. Tant qu'il se déplace lentement et reste silencieux, il est pratiquement indétectable.",
        "system_tags": ["stealth", "invisibility", "shadows"]
    },
    {
        "id": "thaum_lvl2_extinguish",
        "title_fr": "Extinction",
        "title_en": "Extinguish",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Le feu est notre plus vieux cauchemar. Apprenez à le réveiller de son rêve.*\n\nUn rituel défensif simple mais vital permettant d'éteindre des flammes à distance.\n\n**Le Rite :**\nLe sorcier fixe une flamme (bougie, torche, feu de camp) et fait un geste sec de 'coupure' avec ses doigts, comme s'il pinçait la mèche à distance.\n\n**L'Effet :**\nLe feu ciblé meurt instantanément, privé d'oxygène par la magie. Cela fonctionne sur des sources de la taille d'une cheminée ou d'une personne en feu. C'est souvent utilisé pour créer l'obscurité ou sauver un allié (ou soi-même) de la Rötschreck.",
        "system_tags": ["defense", "fire", "anti-fire"]
    },
    {
        "id": "thaum_lvl2_eyes_nighthawk",
        "title_fr": "Yeux du Rapace Nocturne",
        "title_en": "Eyes of the Night Hawk",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Pourquoi risquer votre propre peau quand celle d'un corbeau a si peu de valeur ?*\n\nPermet de posséder un oiseau pour l'utiliser comme espion volant.\n\n**Le Rite :**\nLe sorcier doit capturer un oiseau de proie (faucon, hibou, corbeau) et lui faire boire un peu de son sang. Alors qu'il regarde dans les yeux de l'animal, il transfère sa conscience.\n\n**L'Effet :**\nLe corps du vampire tombe en transe (vulnérable). Son esprit habite l'oiseau. Il voit par ses yeux, vole avec ses ailes, et peut espionner des lieux inaccessibles. Si l'oiseau meurt, le vampire est violemment rejeté dans son corps et souffre d un choc psychique.",
        "system_tags": ["spying", "possession", "animal"]
    },
    {
        "id": "thaum_lvl2_illusion_peaceful_death",
        "title_fr": "Illusion d'une Mort Paisible",
        "title_en": "Illusion of Peaceful Death",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Il n'y a pas besoin d'alerter le bétail. Laissez-les croire que leur frère dort.*\n\nUn rituel de 'nettoyage' forensique qui masque les signes de meurtre sur un cadavre.\n\n**Le Rite :**\nLe vampire brosse le cadavre avec une plume blanche immaculée, trempée dans de l'eau claire et du sang d'innocent. Il lisse les traits du visage du mort.\n\n**L'Effet :**\nLes ecchymoses disparaissent, les os brisés se remettent en place (esthétiquement), les plaies par balle se referment, et la peau reprend une teinte pâle mais sereine. Le cadavre semble être mort de cause naturelle ou d'arrêt cardiaque dans son sommeil. Même une autopsie de routine pourrait être trompée.",
        "system_tags": ["masquerade", "cleanup", "illusion"]
    },
    {
        "id": "thaum_lvl2_machine_blitz",
        "title_fr": "Sabotage Machine",
        "title_en": "Machine Blitz",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *La technologie est fragile. La magie est éternelle.*\n\nPermet de provoquer une panne instantanée sur n'importe quel appareil mécanique ou électronique.\n\n**Le Rite :**\nLe sorcier se concentre sur une machine et écrase un petit composant technologique (une puce, un rouage) dans sa main en libérant une impulsion d'énergie chaotique.\n\n**L'Effet :**\nLa machine ciblée (voiture, ordinateur, caméra de surveillance, arme à feu moderne) s'arrête net. Les circuits grillent, les moteurs calent, les mécanismes s'enrayent. Ce n'est pas une destruction physique visible, mais l'appareil est inutilisable jusqu'à réparation complète.",
        "system_tags": ["sabotage", "technology", "modern"]
    },
    {
        "id": "thaum_lvl2_principal_focus",
        "title_fr": "Focalisateur Principal d'Infusion de Vitae",
        "title_en": "Principal Focus of Vitae Infusion",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Une réserve de sang qui ne se gâte jamais et tient dans la poche. Pratique, n'est-ce pas ?*\n\nPermet de stocker un Point de Sang (Vitae) dans un petit objet solide pour une utilisation ultérieure.\n\n**Le Rite :**\nLe vampire passe une nuit entière à baigner un petit objet (bague, bille, pièce) dans son sang, le saturant mystiquement jusqu'à ce que le liquide soit absorbé par la matière solide.\n\n**L'Effet :**\nL'objet devient rouge sombre et lourd. À tout moment, le vampire peut briser l'objet ou le dissoudre sur sa langue (action simple). Il récupère instantanément le Point de Sang investi. C'est une 'potion de soin' ou de mana portative.",
        "system_tags": ["utility", "blood-storage", "preparation"]
    },
    {
        "id": "thaum_lvl2_recure_homeland",
        "title_fr": "Guérison de la Terre Natale",
        "title_en": "Recure of the Homeland",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Nous sommes liés à la terre qui nous a vus naître. Elle seule peut nous recoudre quand le feu nous a mordus.*\n\nLe seul moyen efficace pour un vampire de guérir des blessures aggravées sans attendre des semaines.\n\n**Le Rite :**\nLe vampire doit posséder une poignée de terre provenant de la ville ou du lieu de sa naissance (mortelle). Il mélange cette terre avec son sang pour former une pâte boueuse, qu'il applique sur ses plaies.\n\n**L'Effet :**\nLa pâte sèche et tombe en poussière au matin. Les blessures Aggravés (feu, griffes) traitées ainsi guérissent comme si elles étaient de simples blessures Létales (avec du sang), ou guérissent naturellement en une nuit au lieu d'une semaine. C'est un secret jalousement gardé.",
        "system_tags": ["healing", "aggravated-damage", "earth"]
    },
    {
        "id": "thaum_lvl2_ward_ghouls",
        "title_fr": "Protection contre les Goules",
        "title_en": "Ward Versus Ghouls",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Les serviteurs sont utiles, mais ils n'ont pas leur place dans le sanctuaire du Maître.*\n\nCrée une barrière mystique infranchissable pour les Goules (humains buveurs de sang de vampire).\n\n**Le Rite :**\nLe sorcier trace un sigil avec un mélange de sang mortel et de cendre sur un objet ou le seuil d'une porte.\n\n**L'Effet :**\nSi une Goule touche l'objet ou tente de franchir le seuil, elle subit une décharge d'énergie psychique atrocement douloureuse (dégâts létaux) et est repoussée physiquement. Les humains normaux et les vampires ne sentent rien.",
        "system_tags": ["protection", "ward", "ghouls"]
    },
    {
        "id": "thaum_lvl2_whispers_ghost",
        "title_fr": "Murmures du Fantôme",
        "title_en": "Whispers of the Ghost",
        "level": 2,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Parlez sans être là. Écoutez sans être vu.*\n\nPermet à un vampire en Projection Astrale de communiquer avec le monde physique, ce qui est normalement impossible.\n\n**Le Rite :**\nLe vampire doit méditer sur l'oreille coupée d'une créature vivante avant de quitter son corps.\n\n**L'Effet :**\nSous sa forme fantomatique (Astrale), le vampire peut se manifester comme une voix désincarnée, un chuchotement dans la pièce où il se trouve. Il ne peut pas toucher les objets, mais il peut délivrer des messages ou espionner et rapporter en temps réel à ses alliés.",
        "system_tags": ["utility", "astral", "communication"]
    },

    // --- NIVEAU 3 : Rituels d'Adepte ---
    {
        "id": "thaum_lvl3_shaft_belated_quiescence",
        "title_fr": "Trait de Torpeur Retardée",
        "title_en": "Shaft of Belated Quiescence",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *La vengeance est un plat qui se mange froid. Ou dans ce cas, un éclat de bois qui attend son heure.*\n\nCrée un pieu particulièrement vicieux dont la pointe se détache dans la plaie.\n\n**Le Rite :**\nLe sorcier sculpte un pieu dans du frêne ou du sorbier et le fait tremper dans un mélange d encres noires et de belladone pendant une semaine, en chantant des malédictions de sommeil.\n\n**L'Effet :**\nSi ce pieu touche un vampire (même s'il ne le paralyse pas du premier coup), la pointe se brise et reste dans la chair. Elle commence alors à voyager lentement, millimètre par millimètre, vers le cœur. Des heures ou des jours plus tard, sans avertissement, la pointe atteint sa cible et le vampire tombe en Torpeur instantanée. Seule une chirurgie invasive peut retirer l'éclat avant terme.",
        "system_tags": ["combat", "stake", "delayed-effect"]
    },
    {
        "id": "thaum_lvl3_flesh_fiery_touch",
        "title_fr": "Chair de Toucher Ardent",
        "title_en": "Flesh of Fiery Touch",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Touchez-moi si vous l'osez.*\n\nTransforme la peau du vampire en un fourneau brûlant pour ses ennemis.\n\n**Le Rite :**\nLe vampire avale une petite pilule alchimique enchantée (ou une braise ardente, pour les plus traditionnels) qui irradie une chaleur magique de l'intérieur.\n\n**L'Effet :**\nLe vampire ne brûle pas, mais sa peau devient insupportablement chaude pour les autres. Quiconque le touche à mains nues (ou est touché par lui) subit des dégâts de feu (Létaux pour humains, Aggravés potentiels pour vampires friables). C'est une défense terrifiante contre la lutte ou le corps-à-corps.",
        "system_tags": ["combat", "defense", "fire-skin"]
    },
    {
        "id": "thaum_lvl3_incorporeal_passage",
        "title_fr": "Passage Incorporel",
        "title_en": "Incorporeal Passage",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Les murs ne sont que des suggestions pour l'esprit éclairé.*\n\nPermet au vampire de devenir intangible et de traverser la matière solide.\n\n**Le Rite :**\nLe vampire tient un éclat de miroir brisé et se concentre sur son reflet jusqu'à ce que celui-ci disparaisse. Il marche ensuite 'à travers' le miroir symboliquement.\n\n**L'Effet :**\nLe vampire devient une silhouette fantomatique. Il peut traverser les murs, les portes et les obstacles physiques comme s'ils n'étaient que brume. Il est immunisé aux attaques physiques (épées, balles) mais reste vulnérable au feu, au soleil et à la magie. Il ne peut pas interagir avec le monde physique (ouvrir une porte, ramasser un objet) sous cette forme.",
        "system_tags": ["utility", "movement", "intangibility"]
    },
    {
        "id": "thaum_lvl3_sanguine_assistant",
        "title_fr": "Assistant Sanguin",
        "title_en": "Sanguine Assistant",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 3, // Coût estimé plus élevé pour création de vie
        "description_md": "> *Pourquoi faire confiance à un serviteur qui peut vous trahir, quand vous pouvez en fabriquer un avec votre propre sang ?*\n\nCrée un petit serviteur temporaire à partir de la vitae du sorcier.\n\n**Le Rite :**\nLe sorcier ouvre ses veines dans un bol en terre cuite et modèle le sang accumulé avec sa volonté, lui donnant une forme grossière (chat, rat, petite gargouille).\n\n**L'Effet :**\nLe sang se solidifie et s'anime. La créature ('homoncule') est totalement loyale et liée mentalement au sorcier. Elle peut espionner, porter des objets légers ou attaquer (faiblement). Elle se dissout en flaque de sang à la fin de la nuit ou si elle est détruite.",
        "system_tags": ["summoning", "minion", "blood-construct"]
    },
    {
        "id": "thaum_lvl3_touch_nightshade",
        "title_fr": "Toucher de la Belladonne",
        "title_en": "A Touch of Nightshade",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Une poignée de main peut être fatale si l'on sait comment l'assaisonner.*\n\nTransforme le toucher du vampire en poison violent.\n\n**Le Rite :**\nLe thaumaturge enduit ses mains d'un extrait de belladone mélangé à son sang putréfié.\n\n**L'Effet :**\nLe prochain contact peau-à-peau avec une victime transmet une toxine magique. Les mortels meurent souvent empoisonnés. Les vampires subissent des hallucinations, des vertiges et une perte de coordination motrice (malus aux dés), comme s'ils étaient ivres ou drogués. L'effet persiste pour la scène.",
        "system_tags": ["combat", "poison", "debuff"]
    },
    {
        "id": "thaum_lvl3_ward_lupines",
        "title_fr": "Protection contre les Lupins",
        "title_en": "Ward Versus Lupines",
        "level": 3,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Gardez les chiens dehors.*\n\nCrée une barrière mystique contre les Loups-Garous.\n\n**Le Rite :**\nLe sorcier trace des sigils avec de la poudre d'argent (coûteux) mélangée à de l'aconit.\n\n**L'Effet :**\nComme la *Protection contre les Goules*, mais affecte les Loups-Garous. Tout Garou touchant l'objet ou le seuil protégé subit des dégâts Létaux (ou Aggravés selon la puissance du rite) et une douleur intense, le repoussant. Essentiel pour les Chantries situées près des zones sauvages.",
        "system_tags": ["protection", "ward", "lupines"]
    },
    // --- NIVEAU 4 : Rituels de Maître ---
    {
        "id": "thaum_lvl4_binding_beast",
        "title_fr": "Lier la Bête",
        "title_en": "Binding the Beast",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *La rage est un outil, pas un maître. Apprenez à la mettre en cage.*\n\nCe rituel permet de calmer de force un vampire en proie à la Frénésie, ou de l'empêcher d'y entrer.\n\n**Le Rite :**\nLe lanceur doit faire avaler (ou injecter) à la cible un mélange sirupeux de sang et d'herbes sédatives (valériane), en chantant des berceuses oubliées.\n\n**L'Effet :**\nLa Bête de la cible est enchaînée. Le vampire sort immédiatement de la Frénésie, tombant souvent dans un état léthargique ou somnolent. Il ne peut plus entrer en Frénésie pour le reste de la scène, même s'il est provoqué.",
        "system_tags": ["control", "frenzy", "defense"]
    },
    {
        "id": "thaum_lvl4_blood_certamen",
        "title_fr": "Certamen de Sang",
        "title_en": "Blood Certamen",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Les barbares se battent avec des épées. Les érudits se battent avec leur volonté.*\n\nLe rite de duel formel des Tremere.\n\n**Le Rite :**\nLes deux participants s'entaillent le bras et mélangent leur sang dans un cercle rituel. Le duel est purement mental et magique.\n\n**L'Effet :**\nLes combattants entrent en transe. Ils se battent sur le plan astral. Les dommages mentaux se traduisent par une perte de sang physique. Le perdant s'évanouit ou se soumet. C'est le moyen traditionnel de régler les disputes de rang sans destruction finale.",
        "system_tags": ["combat", "duel", "tremere"]
    },
    {
        "id": "thaum_lvl4_bone_lies",
        "title_fr": "Os du Mensonge",
        "title_en": "Bone of Lies",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 0, // Imprégner l'os coûte du sang lors de la création, pas l'usage
        "description_md": "> *La vérité a une odeur, une couleur, et un poids. Le mensonge aussi.*\n\nForce une cible à dire la vérité ou à être démasquée.\n\n**Le Rite :**\nLe rituel nécessite l'os d'un mortel mort à cause d'une trahison, enchanté rituellement. Le lanceur tient l'os en main et pose une question directe à la cible.\n\n**L'Effet :**\nLa cible est contrainte de répondre. Si elle dit la vérité, l'os reste blanc. Si elle ment (sciemment), l'os noircit instantanément et suinte une huile noire nauséabonde. C'est un outil d'interrogatoire infaillible.",
        "system_tags": ["investigation", "truth", "social"]
    },
    {
        "id": "thaum_lvl4_heart_stone",
        "title_fr": "Cœur de Pierre",
        "title_en": "Heart of Stone",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 0,
        "description_md": "> *Pour faire ce qui doit être fait, il faut parfois cesser de ressentir.*\n\nTransforme le cœur du vampire en pierre métaphorique, tuant toute émotion.\n\n**Le Rite :**\nLe lanceur sculpte un petit cœur en granit, le pose sur sa poitrine nue, et s'allonge dans un cercle de terre froide pendant 7 heures.\n\n**L'Effet :**\nLe lanceur perd toute capacité à ressentir des émotions (amour, peur, pitié, remords), mais aussi sa conscience morale (la Bête est silencieuse mais froide). Il devient immunisé à la Présence, à l'intimidation, et aux manipulations émotionnelles. Il agit avec une logique parfaite et impitoyable. L'effet dure tant qu'il ne décide pas de le lever.",
        "system_tags": ["mental", "buff", "emotionless"]
    },
    {
        "id": "thaum_lvl4_mark_amaranth",
        "title_fr": "Marque de l'Amarante",
        "title_en": "Mark of Amaranth",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Le crime ultime mérite la preuve ultime.*\n\nImite les effets de la Diablerie sur l'aura d'une victime.\n\n**Le Rite :**\nLe lanceur touche la victime et chante une accusation silencieuse.\n\n**L'Effet :**\nL'aura de la cible se strie de veines noires, signe universel du Diaboliste (celui qui a dévoré l'âme d'un autre vampire). Toute auspex ou rituel révélera ce crime. C'est une méthode d'assassinat politique redoutable pour faire exécuter un rival par le Prince lors d'une Chasse au Sang.",
        "system_tags": ["curse", "politics", "fakery"]
    },
    {
        "id": "thaum_lvl4_scry",
        "title_fr": "Scrutation",
        "title_en": "Scry",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *La distance n'est qu'une illusion pour l'esprit qui voyage.*\n\nPermet d'espionner un lieu ou une personne à distance via un bassin d'eau ou un miroir.\n\n**Le Rite :**\nLe sorcier fixe une surface réfléchissante (eau calme, miroir d'obsidienne) et se concentre sur sa cible (nécessite un lien sympathique : objet, sang, ou nom véritable).\n\n**L'Effet :**\nLa surface se trouble et montre l'image et le son de la cible en temps réel. Le sorcier peut observer comme s'il y était, mais ne peut pas interagir. La cible peut parfois se sentir observée (test de Percept+Occultisme).",
        "system_tags": ["investigation", "surveillance", "scrying"]
    },
    {
        "id": "thaum_lvl4_splinter_servant",
        "title_fr": "Serviteur d'Écharde",
        "title_en": "Splinter Servant",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Un assassin qui n'a pas peur de mourir, car il n'a jamais vécu.*\n\nCrée une créature de bois animée dont le seul but est de pieux le cœur d'un ennemi.\n\n**Le Rite :**\nLe vampire lie ensemble des branches de frêne, de l'osier et de la ficelle funéraire pour former une petite effigie humaine, et la trempe dans un mélange huileux inflammable pendant deux nuits.\n\n**L'Effet :**\nUne fois l'effigie brisée ou jetée au sol, elle grandit et s'anime. Elle se rue sur la cible désignée avec une vitesse surnaturelle pour s'empaler elle-même dans le cœur de la victime, agissant comme un pieu vivant indomptable. Après l'attaque (réussie ou non), elle redevient du bois inerte.",
        "system_tags": ["combat", "summoning", "stake"]
    },
    {
        "id": "thaum_lvl4_ward_kindred",
        "title_fr": "Protection contre les Vampires",
        "title_en": "Ward Versus Kindred",
        "level": 4,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Ici, le Sang n'est pas le bienvenu.*\n\nCrée une barrière qui repousse les autres Vampires.\n\n**Le Rite :**\nLe sorcier trace des runes avec de la Vitae (la sienne ou celle d'un autre) sur l'objet ou le seuil.\n\n**L'Effet :**\nComme les autres Protections, mais affecte les Vampires (Cainites). Tout vampire (autre que le lanceur) touchant la protection subit des dégâts Létaux massifs et une douleur psychique. C'est la défense standard des refuges Tremere.",
        "system_tags": ["protection", "ward", "vampire"]
    },

    // --- NIVEAU 5 : Grands Rituels ---
    {
        "id": "thaum_lvl5_abandon_fetters",
        "title_fr": "Abandon des Entraves",
        "title_en": "Abandon the Fetters",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 3,
        "description_md": "> *Le sang lie, mais le sang libère. Le prix de la liberté est toujours élevé.*\n\nUn rituel suprême capable de briser un Lien de Sang (Blood Bond), l'esclavage émotionnel le plus puissant de la société vampirique.\n\n**Le Rite :**\nNécessite le sang du Maître (Regnant), de l'Esclave (Thrall) et du Lanceur, mélangés dans une cornue chauffée à blanc. L'esclave doit être excisé — physiquement et spirituellement — du lien. C'est une procédure atroce.\n\n**L'Effet :**\nLe Lien de Sang est rompu instantanément. L'esclave est libre. Cependant, le traumatisme est tel que l'esclave perd souvent une partie permanente de son être (perte d'attributs ou de Volonté permanente). On ne sort pas indemne de l'esclavage.",
        "system_tags": ["utility", "freedom", "blood-bond"]
    },
    {
        "id": "thaum_lvl5_blood_contract",
        "title_fr": "Contrat de Sang",
        "title_en": "Blood Contract",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Ta parole est ton lien. Maintenant, elle est aussi ta chaîne.*\n\nCrée un accord écrit surnaturellement contraignant.\n\n**Le Rite :**\nLe lanceur rédige le contrat sur du vélin avec le sang des deux parties (signataires) pendant trois nuits consécutives. Les termes doivent être lus à haute voix devant témoins.\n\n**L'Effet :**\nLe contrat est absolu. Si l'un des signataires brise une clause, il subit immédiatement la pénalité stipulée dans le texte (souvent la Torpeur, la combustion spontanée, ou la perte de tous ses biens). Aucune magie connue ne peut annuler ce contrat une fois signé, sauf la destruction physique du document par un tiers.",
        "system_tags": ["social", "law", "contract"]
    },
    {
        "id": "thaum_lvl5_court_hallowed_truth",
        "title_fr": "Cour de la Vérité Sacrée",
        "title_en": "Court of Hallowed Truth",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 3,
        "description_md": "> *Dans ces murs, le mensonge meurt dans la gorge.*\n\nSanctifie une pièce entière pour empêcher toute tromperie.\n\n**Le Rite :**\nLe lanceur place des crânes et des os croisés aux quatre coins de la salle et chante l'Invocation de Maât (Vérité) pendant une heure.\n\n**L'Effet :**\nTant que le rituel est actif, il est physiquement impossible de prononcer un mensonge délibéré à l'intérieur de la zone. Ceux qui essaient s'étouffent ou restent muets. Les demi-vérités et omissions sont possibles, mais le mensonge direct est banni. Souvent utilisé pour les procès Tremere.",
        "system_tags": ["social", "truth", "zone"]
    },
    {
        "id": "thaum_lvl5_escape_true_friend",
        "title_fr": "Fuite vers un Véritable Ami",
        "title_en": "Escape to a True Friend",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Quand tout est perdu, il reste la loyauté.*\n\nUne téléportation d'urgence vers un allié de confiance.\n\n**Le Rite :**\nLe vampire trace un cercle au sol et prononce le nom d'une personne en qui il a une confiance absolue (nécessite un lien émotionnel réel, ce qui est rare chez les vampires).\n\n**L'Effet :**\nLe vampire disparaît du cercle et réapparaît instantanément aux côtés de l'ami nommé, où qu'il soit sur Terre. Le rituel échoue si le lien de confiance n'est pas réciproque ou sincère.",
        "system_tags": ["movement", "teleportation", "escape"]
    },
    {
        "id": "thaum_lvl5_lion_heart",
        "title_fr": "Cœur de Lion",
        "title_en": "Lion Heart",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Soyez le roi de la jungle de béton.*\n\nTransforme le vampire en une machine de guerre parfaite et sans peur.\n\n**Le Rite :**\nLe lanceur peint un grand sigil représentant un lion sur son torse avec un mélange de sang et d'ocre, invoquant la force pure.\n\n**L'Effet :**\nLa Force et la Dextérité du lanceur augmentent surnaturellement (souvent au-delà des limites générationnelles). De plus, il réussit automatiquement tous les tests de Courage. Il ne peut pas fuir, ne peut pas avoir peur, et combat avec une vaillance divine. L'épuisement qui suit est cependant terrible.",
        "system_tags": ["combat", "buff", "courage"]
    },
    {
        "id": "thaum_lvl5_paper_flesh",
        "title_fr": "Chair de Papier",
        "title_en": "Paper Flesh",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Le plus puissant des guerriers n'est rien si son armure est faite de soie.*\n\nRend la victime incroyablement fragile physiquement.\n\n**Le Rite :**\nLe sorcier inscrit le Nom Véritable de sa victime sur une feuille de papier de riz et la brûle lentement, chantant pour que la peau de la cible imite la fragilité de la cendre.\n\n**L'Effet :**\nLa Résistance (Stamina) et la Fortitude de la cible sont réduites à néant (souvent à 1). Sa peau se déchire au moindre contact, ses os cassent comme du verre. Un simple coup de poing peut être fatal. C'est une malédiction dévastatrice avant un duel.",
        "system_tags": ["curse", "debuff", "fragility"]
    },
    {
        "id": "thaum_lvl5_stone_true_form",
        "title_fr": "Pierre de la Forme Véritable",
        "title_en": "Stone of the True Form",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Arrêtez de prétendre être ce que vous n'êtes pas.*\n\nForce un métamorphe à reprendre sa forme naturelle.\n\n**Le Rite :**\nLe lanceur enchante une petite pierre parfaitement ronde. Cette pierre doit toucher la cible (lancée ou contact).\n\n**L'Effet :**\nSi la pierre touche une créature métamorphosée (Vampire en brume/loup, Loup-Garou, Fée), elle est violemment forcée de reprendre sa forme de naissance (pour un vampire : son cadavre humain conservé). Elle est 'verrouillée' dans cette forme pour un tour, incapable de se changer. L'effet est traumatisant et douloureux.",
        "system_tags": ["combat", "anti-shapeshift", "control"]
    },
    {
        "id": "thaum_lvl5_ward_spirits",
        "title_fr": "Protection contre les Espits/Démons",
        "title_en": "Ward Versus Spirits/Demons",
        "level": 5,
        "discipline": "thaumaturgy",
        "blood_cost": 1,
        "description_md": "> *Ce qui vient de l'Enfer doit y retourner.*\n\nLa forme ultime de protection, repoussant les entités immatérielles.\n\n**Le Rite :**\nLe lanceur trace des signes avec de l'eau bénite (volée dans une église) mélangée à de la poussière de marbre.\n\n**L'Effet :**\nRepousse les Fantômes, Esprits, et Démons. La barrière est impénétrable pour eux et leur inflige des dégâts Aggravés massifs au contact. C'est souvent la seule défense efficace contre les ennemis invisibles.",
        "system_tags": ["protection", "ward", "spirits"]
    },
    // --- NÉCROMANCIE NIVEAU 1 : Bases du Sépulcre ---
    {
        "id": "necro_lvl1_call_hungry_dead",
        "title_fr": "Appel des Morts Affamés",
        "title_en": "Call of the Hungry Dead",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *N'écoutez pas ceux qui disent que les morts reposent en paix. Ils ont faim. Toujours.*\n\nCe rituel permet de tendre l'oreille au-delà du Voile pour entendre les murmures des esprits errants. Plus dangereux encore, il permet de leur offrir un passage temporaire pour qu'ils tourmentent vos ennemis.\n\n**Le Rite :**\nIl faut briser un os humain — de préférence une côte ou une phalange — en prononçant le nom de la cible. Le rituel ne demande que peu de temps, dix minutes suffisent, mais il exige que l'on verse une offrande de sang sur le sol pour attirer les spectres affamés.\n\n**L'Effet :**\nSi l'appel est entendu, des mains spectrales jailliront du sol autour de votre adversaire, cherchant à le griffer et le retenir. Ce n'est pas une attaque physique, mais une attaque contre l'âme. La victime entendra les hurlements des damnés et sentira le froid de la tombe l'envahir. Seuls les esprits les plus forts pourront résister à cette étreinte glaciale.",
        "system_tags": ["combat", "spirits", "distraction"]
    },
    {
        "id": "necro_lvl1_casting_bones",
        "title_fr": "Jet d'Os",
        "title_en": "Casting of Bones",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *La mort ne joue pas aux dés, mais elle triche parfois avec.*\n\nUne méthode de divination utilisant les restes des défunts pour entrevoir la fortune.\n\n**Le Rite :**\nLe Nécromancien utilise des dés sculptés dans des os humains (souvent de criminels exécutés). Il les jette sur une surface couverte de cendre funéraire en posant une question sur son avenir immédiat.\n\n**L'Effet :**\nLes esprits influencent la chute des dés. Si les présages sont bons, le Nécromancien sera guidé dans sa prochaine entreprise (bonus mécanique). Si les os tombent mal, les esprits brouillent son destin, garantissant presque l'échec. Un résultat favorable est un signe d'approbation des ancêtres.",
        "system_tags": ["divination", "luck", "buff"]
    },
    {
        "id": "necro_lvl1_eldritch_beacon",
        "title_fr": "Balise Surnaturelle",
        "title_en": "Eldritch Beacon",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Devenez le phare dans la nuit éternelle. Attirez-les tous.*\n\nTransforme une cible (ou un lieu) en aimant à fantômes.\n\n**Le Rite :**\nLe lanceur allume une bougie verte faite de la graisse fondue d un pendu. Il doit avoir un lien physique avec sa cible (un cheveu, un objet) ou être présent sur le lieu.\n\n**L'Effet :**\nLa cible se met à briller dans l'Outremonde comme un soleil noir. Tous les spectres, fantômes et esprits à des kilomètres à la ronde sont irrésistiblement attirés vers elle. Ils ne sont pas sous contrôle, juste curieux et affamés. Pour la cible, c'est le début d'une nuit de hantise terrifiante.",
        "system_tags": ["curse", "spirits", "haunting"]
    },
    {
        "id": "necro_lvl1_insight",
        "title_fr": "Perspicacité",
        "title_en": "Insight",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Les yeux sont les fenêtres de l'âme, même quand les rideaux sont tirés pour toujours.*\n\nPermet de voir la dernière chose qu'un mort a vue avant de trépasser.\n\n**Le Rite :**\nLe Nécromancien doit regarder fixement dans les yeux ouverts d'un cadavre et chuchoter une question sur sa mort. Il doit toucher les paupières froides.\n\n**L'Effet :**\nUne image statique, comme une photographie brûlée, apparaît dans l'esprit du lanceur. C'est la toute dernière image imprimée sur la rétine de la victime. Utile pour identifier un meurtrier, à condition qu'il ait regardé sa victime en face.",
        "system_tags": ["investigation", "vision", "death"]
    },
    {
        "id": "necro_lvl1_know_ruling_passion",
        "title_fr": "Connaître la Passion Dominante",
        "title_en": "Know the Ruling Passion",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Chaque fantôme est une obsession qui refuse de mourir. Connaissez l'obsession, contrôlez le fantôme.*\n\nDévoile ce qui retenait (ou retient) une personne à la vie/non-vie.\n\n**Le Rite :**\nLe lanceur goûte une pincée de cendre ou de poussière provenant du corps du défunt.\n\n**L'Effet :**\nLe Nécromancien comprend instantanément la personnalité du défunt (Nature et Attitude) et surtout, son plus grand regret ou sa plus grande passion inachevée. C'est la clé pour négocier avec un spectre ou le manipuler.",
        "system_tags": ["investigation", "social", "ghost-psychology"]
    },
    {
        "id": "necro_lvl1_minos_blood",
        "title_fr": "Sang de Minos",
        "title_en": "Minos' Blood",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *La frontière est mince. Parfois, il suffit d'un peu de liquide pour la dissoudre.*\n\nAffaiblit temporairement la barrière entre le monde des vivants et celui des morts (le Linceul).\n\n**Le Rite :**\nLe Nécromancien verse son sang en spirale sur le sol, dans un lieu où la mort a déjà frappé.\n\n**L'Effet :**\nLe Linceul s'amincit localement. Les fantômes peuvent se manifester plus facilement, les rituels de Nécromancie sont plus faciles à lancer (-1 difficulté), et l'air devient glacial. C'est une préparation essentielle avant un grand rite.",
        "system_tags": ["buff", "shroud", "ritual-prep"]
    },
    {
        "id": "necro_lvl1_smoking_mirror",
        "title_fr": "Rite du Miroir Fumant",
        "title_en": "Ritual of the Smoking Mirror",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *L'obsidienne ne reflète pas ce qui est, mais ce qui a été.*\n\nPermet de voir l'Outremonde (Terres d'Ombre) à travers un miroir préparé.\n\n**Le Rite :**\nLe lanceur enduit un miroir de suie grasse et de sang, le rendant noir. Il doit regarder dedans non pas directement, mais 'en coin' (vision périphérique).\n\n**L'Effet :**\nAu lieu de refléter la pièce physique, le miroir montre le reflet spirituel du lieu dans les Terres d'Ombre. On y voit les bâtiments en ruine spectrale, les émotions résiduelles, et les fantômes qui hantent les lieux sans être vus à l'œil nu.",
        "system_tags": ["investigation", "shroud-sight", "mirror"]
    },
    {
        "id": "necro_lvl1_shroudsight",
        "title_fr": "Vue du Linceul",
        "title_en": "Shroudsight",
        "level": 1,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Ouvrez votre troisième œil, celui qui est mort.*\n\nAccorde la capacité de voir les fantômes et les paysages de l'au-delà superposés au monde réel.\n\n**Le Rite :**\nLe Nécromancien se lave les paupières avec un mélange d'eau stagnante et de terre de tombe fraîchement remuée.\n\n**L'Effet :**\nPour le reste de la scène, le vampire voit le monde des morts. Les couleurs sont ternes, les bâtiments semblent délabrés, et les esprits deviennent visibles. Attention : si vous les voyez, ils savent souvent que vous les voyez.",
        "system_tags": ["investigation", "vision", "ghosts"]
    },

    // --- NÉCROMANCIE NIVEAU 2 : Manipulation ---
    {
        "id": "necro_lvl2_blood_maenad",
        "title_fr": "Ménade de Sang",
        "title_en": "Blood Maenad",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 2,
        "description_md": "> *Le sang a faim. Donnez-lui une forme, et il mangera pour vous.*\n\nCrée une entité mineure faite de sang animé pour attaquer ou drainer une cible.\n\n**Le Rite :**\nLe vampire verse une quantité significative de sang sur le sol et invoque les esprits de la faim et de la soif.\n\n**L'Effet :**\nUne forme rouge et gélatineuse s'élève. Elle se jette sur la cible désignée pour la drainer. Ce n'est pas un combattant brillant, mais une sangsue animée vorace. Si elle réussit à boire, elle peut revenir vers le lanceur pour lui 'rendre' une partie de la vitae volée.",
        "system_tags": ["summoning", "combat", "blood-construct"]
    },
    {
        "id": "necro_lvl2_eyes_grave",
        "title_fr": "Yeux de la Tombe",
        "title_en": "Eyes of the Grave",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Chaque homme porte sa mort en lui dès la naissance. Ce rite permet de la lire.*\n\nRévèle le destin mortel d'une personne, sa santé, ou comment elle va mourir.\n\n**Le Rite :**\nLe lanceur mélange du sang séché avec des champignons vénéneux et de la moisissure de cercueil, fait brûler le tout, et inhale la fumée acre.\n\n**L'Effet :**\nEn regardant une cible, le Nécromancien voit des 'marques de mort'. Il sait si la personne est malade, combien de temps il lui reste à vivre naturellement, et voit parfois une vision symbolique de sa mort future (ex: une aura d'eau pour la noyade). Sur un vampire, cela peut révéler s'il a récemment commis une Diablerie ou s'il est proche de la Torpeur.",
        "system_tags": ["investigation", "prophecy", "death-marks"]
    },
    {
        "id": "necro_lvl2_hand_glory",
        "title_fr": "Main de Gloire",
        "title_en": "Hand of Glory",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Le sommeil des justes pour les injustes.*\n\nUn outil légendaire des voleurs, permettant d'endormir les habitants d'une maison.\n\n**Le Rite :**\nNécessite la main coupée et séchée d'un meurtrier pendu. Les doigts sont trempés dans une cire faite de la propre graisse du criminel pour former des mèches.\n\n**L'Effet :**\nUne fois les doigts allumés, quiconque dans la maison (sauf le lanceur et ses alliés protégés) tombe dans un sommeil comateux profond. Ils ne peuvent être réveillés tant que la main brûle. Pour éteindre la main, il faut utiliser du lait ou du sang ; l'eau ou le souffle sont inefficaces.",
        "system_tags": ["stealth", "sleep", "artifact"]
    },
    {
        "id": "necro_lvl2_puppet",
        "title_fr": "Marionnette",
        "title_en": "Puppet",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *La chair n'est qu'un vêtement de viande. Parfois, on a besoin de vêtements de rechange.*\n\nAnime un cadavre frais pour en faire un serviteur temporaire.\n\n**Le Rite :**\nLe Nécromancien enduit les articulations et le front d'un cadavre avec une pâte de sel, de cendre et de mercure.\n\n**L'Effet :**\nLe cadavre se lève. Il n'a ni intelligence, ni âme, ni compétence. C'est un robot biologique. Il obéit aux ordres verbaux simples ('Tue', 'Porte', 'Marche'). Il ne ressent pas la douleur. C'est le zombie classique de la fiction, utile comme chair à canon ou porteur.",
        "system_tags": ["summoning", "zombie", "minion"]
    },
    {
        "id": "necro_lvl2_ritual_pomegranate",
        "title_fr": "Rite de la Grenade",
        "title_en": "Ritual of the Pomegranate",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Mangez, buvez, et paraissez vivants. C'est ce que Perséphone a fait.*\n\nPermet à un vampire de consommer de la nourriture mortelle.\n\n**Le Rite :**\nLe vampire doit manger six graines d'une grenade fraîche (fruit des morts) tout en étant assis sur une tombe ou dans un cimetière, avant le lever du soleil.\n\n**L'Effet :**\nPour la nuit suivante, le vampire peut manger et boire normalement. Il peut goûter les saveurs (au lieu du goût de cendre habituel) et ne vomira pas la nourriture immédiatement. Cela aide immensément à maintenir la Mascarade lors de dîners mondains.",
        "system_tags": ["masquerade", "social", "food"]
    },
    {
        "id": "necro_lvl2_two_centimes",
        "title_fr": "Deux Centimes",
        "title_en": "Two Centimes",
        "level": 2,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Tout a un prix, même une conversation.*\n\nForce l'esprit d'un cadavre récent à répondre à une question.\n\n**Le Rite :**\nLe lanceur place deux pièces de monnaie (traditionnellement des oboles, mais des centimes fonctionnent s'ils sont vieux) sur les yeux fermés du cadavre.\n\n**L'Effet :**\nLe fantôme est brièvement rappelé dans son corps (ou à proximité). Il doit répondre honnêtement à une seule question posée par le Nécromancien, comme paiement pour les pièces (le 'passage'). Après la réponse, les pièces noircissent et le contact est rompu.",
        "system_tags": ["investigation", "interrogation", "ghost"]
    },

    // --- NÉCROMANCIE NIVEAU 3 : Contrôle ---
    {
        "id": "necro_lvl3_din_damned",
        "title_fr": "Vacarme des Damnés",
        "title_en": "Din of the Damned",
        "level": 3,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Le silence est d'or. Le bruit est une arme.*\n\nCrée une zone de silence sélectif remplie de hurlements fantomatiques.\n\n**Le Rite :**\nLe lanceur trace un cercle au sol avec de la craie funéraire et brise un os humain en son centre.\n\n**L'Effet :**\nDe l'extérieur, la zone semble parfaitement silencieuse (effet de Silence). À l'intérieur, cependant, les victimes sont assaillies par une cacophonie assourdissante de cris, de gémissements et de bruits de chaînes provenant de l'Outremonde. Il est impossible de communiquer, de se concentrer ou de lancer des sorts audibles à l'intérieur.",
        "system_tags": ["control", "debuff", "silence"]
    },
    {
        "id": "necro_lvl3_divine_sign",
        "title_fr": "Signe Divin",
        "title_en": "Divine Sign",
        "level": 3,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Les dieux ne parlent plus, mais les morts bavardent tout le temps.*\n\nUn rituel polyvalent pour marquer une cible spirituelle ou deviner le destin.\n\n**Le Rite :**\nLe lanceur manipule des objets symboliques (le Livre des Destins, des cartes de tarot faites de peau) en se concentrant sur la naissance de la cible.\n\n**L'Effet :**\nUtilisé sur un vivant, cela donne des indices cryptiques sur son futur. Utilisé sur un mort (spectre), cela crée un lien indélébile ('Marquage'). Le Nécromancien pourra retrouver ou invoquer ce spectre spécifique n importe où, n importe quand, ignorant les pénalités de distance.",
        "system_tags": ["divination", "tagging", "destiny"]
    },
    {
        "id": "necro_lvl3_eyes_dead",
        "title_fr": "Yeux des Morts",
        "title_en": "Eyes of the Dead",
        "level": 3,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Utilisez les morts comme vos sentinelles. Ils ne dorment jamais.*\n\nPermet de voir à travers les yeux d'un fantôme proche.\n\n**Le Rite :**\nLe Nécromancien touche un crâne ou un cadavre et ferme ses propres yeux, projetant son esprit vers l'hôte spirituel le plus proche.\n\n**L'Effet :**\nLe lanceur 'détourne' la vue d'un spectre présent dans la zone. Il voit ce que le fantôme voit, souvent avec la superposition de la *Vue du Linceul*. C'est une caméra de surveillance parfaite et invisible, tant qu'il y a des morts dans les parages (ce qui est toujours le cas dans un cimetière ou une vieille maison).",
        "system_tags": ["investigation", "surveillance", "remote-viewing"]
    },
    {
        "id": "necro_lvl3_ritual_unearthed_fetter",
        "title_fr": "Rituel de l'Entrave Déterrée",
        "title_en": "Ritual of the Unearthed Fetter",
        "level": 3,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Celui qui tient l'objet qui vous est cher tient votre âme.*\n\nIdentifie si un objet est une Entrave (Fetter) — un objet qui lie un fantôme à ce monde — et à qui il appartient.\n\n**Le Rite :**\nLe Nécromancien enterre l'objet suspect dans la terre de cimetière et le déterre une heure plus tard en chantant des invocations de liaison.\n\n**L'Effet :**\nSi l'objet est une Entrave, il saignera ou vibrera au toucher. Le Nécromancien reçoit une vision clair du visage du fantôme lié. Posséder une Entrave donne un pouvoir immense sur le fantôme (bonus pour le commander, l'invoquer ou le torturer).",
        "system_tags": ["investigation", "fetters", "control"]
    },
    {
        "id": "necro_lvl3_tempest_shield",
        "title_fr": "Bouclier de la Tempête",
        "title_en": "Tempest Shield",
        "level": 3,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Quand les vents de l'Enfer soufflent, mieux vaut avoir un parapluie.*\n\nProtège un lieu contre les tempêtes spirituelles de l'Outremonde.\n\n**Le Rite :**\nLe lanceur trace un cercle de sel et de poussière de tombe, chantant pour solidifier le Linceul localement contre les turbulences.\n\n**L'Effet :**\nLes effets néfastes de la 'Tempête' (le climat hostile de l'Outremonde) ne peuvent pénétrer le cercle. Les spectres à l'intérieur sont calmes. C'est essentiel pour mener des interrogatoires prolongés ou se réfugier dans les Terres d'Ombre sans se faire déchiqueter par les vents spectraux.",
        "system_tags": ["protection", "environment", "shadowlands"]
    },
    // --- NÉCROMANCIE NIVEAU 4 : Subjugation ---
    {
        "id": "necro_lvl4_bastion_ash",
        "title_fr": "Bastion de la Cendre",
        "title_en": "Bastion of the Ash",
        "level": 4,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Les morts sont de mauvais invités. Fermez la porte à clé.*\n\nUne protection puissante qui empêche spécifiquement les fantômes d'entrer.\n\n**Le Rite :**\nLe lanceur mélange son propre sang avec de la cendre humaine provenant d'un crématorium (il doit y en avoir une quantité significative). Il peint un cercle continu autour de la zone à protéger.\n\n**L'Effet :**\nAucun fantôme, spectre ou esprit désincarné ne peut franchir la ligne de cendre. S'ils essaient, ils sont repoussés par une force invisible. C'est la seule façon sûre de dormir dans une maison hantée.",
        "system_tags": ["protection", "ward", "anti-ghost"]
    },
    {
        "id": "necro_lvl4_cadavers_touch",
        "title_fr": "Toucher du Cadavre",
        "title_en": "Cadaver's Touch",
        "level": 4,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Le froid de la tombe n'est pas une métaphore.*\n\nPermet au Nécromancien de canaliser l'entropie pure de la mort à travers ses mains.\n\n**Le Rite :**\nLe lanceur chante des hymnes funéraires pendant une heure, jusqu'à ce que ses mains deviennent bleues et glacées, comme celles d'un noyé.\n\n**L'Effet :**\nLes mains du Nécromancien infligent des brûlures par le froid au toucher (dégâts létaux ou aggravés). Plus terrifiant encore, il peut toucher les fantômes comme s'ils étaient solides, leur infligeant des dégâts directs. C'est l'une des rares méthodes pour combattre un spectre physiquement.",
        "system_tags": ["combat", "buff", "ghost-fighting"]
    },
    {
        "id": "necro_lvl4_call_dead",
        "title_fr": "Appel des Morts",
        "title_en": "Call of the Dead",
        "level": 4,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Venez tous. La porte est ouverte.*\n\nBrise le Linceul sur une large zone pour permettre une communication de masse.\n\n**Le Rite :**\nLe Nécromancien se tient au centre d'un cimetière ou d'un charnier et hurle une invocation à l'Outremonde, agissant comme un paratonnerre spirituel.\n\n**L'Effet :**\nLe Linceul se déchire. Tous les fantômes de la zone deviennent visibles et audibles pour tout le monde (même les mortels sans pouvoirs). Ce n'est pas un contrôle, mais une invitation. La zone devient un véritable pandémonium d'esprits pour la durée de la scène.",
        "system_tags": ["utility", "shroud-breach", "mass-summoning"]
    },
    {
        "id": "necro_lvl4_drink_lethe",
        "title_fr": "Breuvage du Léthé",
        "title_en": "Drink of Lethe",
        "level": 4,
        "discipline": "necromancy",
        "blood_cost": 0, // Coût de préparation implicite
        "description_md": "> *L'oubli est la seule miséricorde que nous pouvons offrir.*\n\nEfface temporairement la mémoire ou l'identité d'un spectre (ou d'un cadavre animé).\n\n**Le Rite :**\nUne potion complexe faite d'eau de source souterraine sombre et de pavot noir.\n\n**L'Effet :**\nSi un fantôme boit (ou absorbe spirituellement) ce breuvage, il oublie qui il est, pourquoi il est là, et ses passions dominantes pour une nuit. Il devient une ardoise vierge, facile à manipuler ou simplement neutralisé sans violence.",
        "system_tags": ["control", "memory", "pacification"]
    },
    {
        "id": "necro_lvl4_peek_past_shroud",
        "title_fr": "Coup d'Œil au-delà du Linceul",
        "title_en": "Peek Past the Shroud",
        "level": 4,
        "discipline": "necromancy",
        "blood_cost": 0,
        "description_md": "> *Voulez-vous voir ce que je vois ? Prenez ceci.*\n\nCrée une substance alchimique qui donne la Vue du Linceul à autrui.\n\n**Le Rite :**\nLe Nécromancien enchante de l'ergot de seigle (un champignon hallucinogène) avec de l'énergie de mort.\n\n**L'Effet :**\nQuiconque mange le champignon gagne le pouvoir de voir les morts (*Shroudsight*) pour plusieurs heures. Cela fonctionne sur les vampires et les mortels. Utile pour montrer à sa coterie la menace invisible qui les entoure.",
        "system_tags": ["utility", "buff", "group-sight"]
    },

    // --- NÉCROMANCIE NIVEAU 5 : Maîtrise de la Mort ---
    {
        "id": "necro_lvl5_chill_winds",
        "title_fr": "Frisson des Vents",
        "title_en": "Chill of the Winds",
        "level": 5,
        "discipline": "necromancy",
        "blood_cost": 2,
        "description_md": "> *Le vent de la mort ne connaît pas de mur.*\n\nInvoque une tempête surnaturelle glaciale.\n\n**Le Rite :**\nLe lanceur brise une fiole contenant de l'air gelé (d'un sommet montagneux ou magiquement préservé) en hurlant le nom des Vents du Nord.\n\n**L'Effet :**\nLa température chute de 20 ou 30 degrés instantanément. Un blizzard hurle, réduisant la visibilité à néant. Le sol gèle. Les vivants meurent d'hypothermie, les vampires sont ralentis et engourdis. C'est une arme de contrôle de zone massive.",
        "system_tags": ["combat", "aoe", "weather"]
    },
    {
        "id": "necro_lvl5_esprit_corps",
        "title_fr": "Esprit de Corps",
        "title_en": "Esprit de Corps",
        "level": 5,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Nous vivons ensemble. Nous mourons ensemble. Nous ne craignons rien ensemble.*\n\nLie les esprits d'un groupe pour partager une bravoure surnaturelle.\n\n**Le Rite :**\nLe lanceur lie ensemble des objets personnels de chaque membre du groupe avec des bandelettes de linceul durant une cérémonie solennelle.\n\n**L'Effet :**\nLe groupe devient une seule entité psychique face à la peur. Si *un seul* membre réussit un test de Courage, *tous* réussissent. Ils sont immunisés à la panique individuelle. C'est le rituel de guerre ultime des escouades Giovanni.",
        "system_tags": ["buff", "courage", "group"]
    },
    {
        "id": "necro_lvl5_grasp_ghostly",
        "title_fr": "Saisir le Spectal",
        "title_en": "Grasp the Ghostly",
        "level": 5,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *Ce qui est à vous est à moi, même si vous êtes mort.*\n\nPermet de voler un objet physique qui a traversé le Linceul (une Relique) et de le ramener dans le monde réel.\n\n**Le Rite :**\nUn chant ininterrompu de six heures, épuisant, durant lequel le lanceur tend la main vers l'objet désiré dans l'Outremonde.\n\n**L'Effet :**\nL'objet fantomatique se solidifie dans la main du lanceur. Cependant, l'univers exige un équilibre : le lanceur doit sacrifier un objet de valeur/masse égale qui disparaît dans l'Outremonde, sinon le vol échoue violemment.",
        "system_tags": ["utility", "theft", "relics"]
    },
    {
        "id": "necro_lvl5_mass_grave",
        "title_fr": "Fosse Commune",
        "title_en": "Mass Grave",
        "level": 5,
        "discipline": "necromancy",
        "blood_cost": 3,
        "description_md": "> *Pourquoi lever un seul soldat quand on peut lever une armée ?*\n\nLe rituel de levée de morts le plus puissant. Il anime tous les cadavres d'une zone.\n\n**Le Rite :**\nLe Nécromancien marque les points cardinaux d'un cimetière (ou champ de bataille) avec des sigils de sang et frappe le sol.\n\n**L'Effet :**\nLa terre tremble. Tous les cadavres relativement frais (ou squelettes, selon l'état) dans la zone sortent de terre. Ce sont des zombies sans esprit (*Puppets*) sous le contrôle du lanceur. Une horde instantanée pour submerger l'ennemi.",
        "system_tags": ["combat", "army", "mass-summoning"]
    },
    {
        "id": "necro_lvl5_quelling_beast",
        "title_fr": "Apaisement de la Bête",
        "title_en": "Quelling the Beast",
        "level": 5,
        "discipline": "necromancy",
        "blood_cost": 1,
        "description_md": "> *La mort est calme. La mort est silence. Soyez comme la mort.*\n\nUn rituel rare qui utilise l'énergie de mort pour étouffer le feu de la Bête vampirique.\n\n**Le Rite :**\nLe vampire verse une huile rare sur un morceau de viande crue (un cœur ou un steak) et le mange (ou le fait manger).\n\n**L'Effet :**\nLa Bête est droguée, étouffée par l'apathie de la mort. Le vampire devient d'un calme surnaturel. Il ne peut presque plus entrer en Frénésie (difficulté max), mais il ne peut pas non plus utiliser sa Volonté pour des efforts passionnés. C'est une cure temporaire pour les vampires instables.",
        "system_tags": ["control", "frenzy", "calm"]
    }

];
