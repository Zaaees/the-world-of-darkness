/**
 * Rituels de Magie du Sang (Thaumaturgie) et de Mort (Nécromancie) V20.
 * Descriptions purement immersives et RP.
 */

export const RITUALS = {
    // ==========================================
    // NIVEAU 1
    // ==========================================

    // --- THAUMATURGIE NIVEAU 1 ---

    blood_walk: {
        id: "blood_walk",
        name: "Appel du Sang",
        discipline: "thaumaturgy",
        level: 1,
        description: "En goûtant le sang d'un autre vampire, le thaumaturge peut remonter sa lignée. Il apprend le nom du Sire, du Grand-Sire, et remonte les générations aussi loin que sa puissance le permet.",
        ingredients: "Une goutte de sang de la cible.",
        steps: [
            "1. Laisser tomber la goutte de sang sur sa propre langue en état de transe.",
            "2. Méditer sur la saveur métallique en appelant les ancêtres.",
            "3. Les visages et noms de la lignée apparaissent en visions rapides."
        ],
        duration: "Instantanée."
    },

    comm_sire: {
        id: "comm_sire",
        name: "Communication avec le Sire",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet d'envoyer un message mental bref à son propre Sire, peu importe la distance, tant qu'il est sur le même plan d'existence.",
        ingredients: "Un objet appartenant personnellement au Sire.",
        steps: [
            "1. Tenir l'objet fermement dans la main gauche.",
            "2. Murmurer le message à l'eau courante ou au vent.",
            "3. Le Sire entendra la voix de son Infant comme un murmure à son oreille."
        ],
        duration: "Un message court."
    },

    def_havre: {
        id: "def_havre",
        name: "Défense du Havre Sacré",
        discipline: "thaumaturgy",
        level: 1,
        description: "Protège une pièce contre la lumière du soleil (même fenêtres ouvertes) et empêche les goules/esprits faibles d'entrer.",
        ingredients: "Sang du thaumaturge, poudre de craie.",
        steps: [
            "1. Tracer un cercle et des sigles sur toutes les ouvertures.",
            "2. Sceller le rituel avec une main ensanglantée au centre.",
            "3. La lumière du soleil devient inoffensive à l'intérieur."
        ],
        duration: "Tant que le thaumaturge est présent."
    },

    deflect_doom: {
        id: "deflect_doom",
        name: "Déflexion de la Malédiction du Bois",
        discipline: "thaumaturgy",
        level: 1,
        description: "Entoure le cœur du vampire d'une aura protectrice. Si un pieu en bois touche le cœur, il se brise ou dévie au dernier moment.",
        ingredients: "Une écharde de bois qu'on brûle, de la cendre.",
        steps: [
            "1. Brûler l'écharde en chantant l'hymne de résistance.",
            "2. Avaler les cendres froides mélangées à de l'eau.",
            "3. Le premier pieu qui devrait transpercer le cœur se brise net."
        ],
        duration: "Jusqu'au prochain lever du soleil ou premier impact."
    },

    detect_lineage: {
        id: "detect_lineage",
        name: "Détection du Sang de la Lignée",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet de savoir si un individu (mortel ou vampire) est lié par le sang à sa propre lignée.",
        ingredients: "Un cheveu ou ongle de la cible.",
        steps: [
            "1. Plonger l'échantillon dans l'eau.",
            "2. Ajouter une goutte de son propre sang.",
            "3. Si les liquides se mélangent parfaitement, il y a parenté."
        ],
        duration: "Instantanée."
    },

    wake_fresheness: {
        id: "wake_fresheness",
        name: "Éveil avec la Fraîcheur du Soir",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet au thaumaturge de se réveiller instantanément et sans somnolence au moindre signe de danger pendant la journée.",
        ingredients: "Plumes de coq brûlées.",
        steps: [
            "1. Brûler les plumes à l'aube avant de dormir.",
            "2. Respirer la fumée âcre.",
            "3. Le sommeil sera léger et vigilant."
        ],
        duration: "Une journée."
    },

    shepherd_chant: {
        id: "shepherd_chant",
        name: "Incantation du Berger",
        discipline: "thaumaturgy",
        level: 1,
        description: "Localise tous les membres de son propre troupeau (ceux qui ont donné leur sang volontairement) dans un rayon d'un kilomètre.",
        ingredients: "Un éclat de verre.",
        steps: [
            "1. Tenir le verre et regarder à travers en tournant sur soi-même.",
            "2. Les proies brillent d'une aura visible pour le thaumaturge."
        ],
        duration: "Une scène."
    },

    preserve_blood: {
        id: "preserve_blood",
        name: "Préservation du Sang",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet de conserver du sang dans un récipient sans qu'il ne coagule ou ne perde sa Potence pendant des semaines.",
        ingredients: "Récipient en terre cuite scellé à la cire.",
        steps: [
            "1. Verser le sang dans le récipient.",
            "2. Sceller avec la cire en murmurant les mots de stase.",
            "3. Enterrer le récipient trois nuits."
        ],
        duration: "Indéfinie (tant que scellé)."
    },

    purity_flesh: {
        id: "purity_flesh",
        name: "Pureté de la Chair",
        discipline: "thaumaturgy",
        level: 1,
        description: "Purifie le corps de toute substance étrangère: alcool, drogues, poison, balles. Tout est rejeté par la peau.",
        ingredients: "Sel et gingembre.",
        steps: [
            "1. Se frotter le corps avec le mélange.",
            "2. Se concentrer sur l'expulsion.",
            "3. Les impuretés suintent par les pores sous forme de liquide noir."
        ],
        duration: "Instantanée."
    },

    blood_insight: {
        id: "blood_insight",
        name: "Savoir du Sang",
        discipline: "thaumaturgy",
        level: 1,
        description: "Détermine la puissance relative d'un autre vampire (Génération approximative) grâce à un échantillon de sang.",
        ingredients: "Sang de la cible.",
        steps: [
            "1. Verser le sang sur une surface plane.",
            "2. Observer la viscosité et la couleur.",
            "3. Le sang 'parle' au thaumaturge, révélant sa puissance latente."
        ],
        duration: "Instantanée."
    },

    sense_garou: {
        id: "sense_garou",
        name: "Sentir le Passage du Garou",
        discipline: "thaumaturgy",
        level: 1,
        description: "Révèle la présence récente de Loups-Garous dans la zone.",
        ingredients: "Touffe de poils de chien.",
        steps: [
            "1. Brûler les poils et observer la fumée.",
            "2. Si elle tourbillonne et forme des têtes de loups, des Garous sont passés ici."
        ],
        duration: "Instantanée."
    },

    seal_interdict: {
        id: "seal_interdict",
        name: "Sceau de l'Interdit",
        discipline: "thaumaturgy",
        level: 1,
        description: "Enchante un objet pour qu'il soit impossible à toucher sans une volonté de fer ou une douleur intense.",
        ingredients: "Fil de fer barbelé miniature.",
        steps: [
            "1. Enrouler le fil autour de l'objet (symboliquement).",
            "2. Verser une goutte de sang chaud.",
            "3. L'objet repousse physiquement ceux qui tentent de le saisir."
        ],
        duration: "Une semaine."
    },

    touch_phenom: {
        id: "touch_phenom",
        name: "Toucher du Phénomène",
        discipline: "thaumaturgy",
        level: 1,
        description: "Analyse une zone ou un objet pour déterminer quel type de magie a été utilisé dessus récemment.",
        ingredients: "Un pendule en fer.",
        steps: [
            "1. Balancer le pendule au-dessus de l'objet.",
            "2. Les oscillations indiquent la nature de la magie (Thaumaturgie, Nécromancie, Magie mortelle...)."
        ],
        duration: "Instantanée."
    },

    // --- NÉCROMANCIE NIVEAU 1 ---

    call_beacon: {
        id: "call_beacon",
        name: "L'Appel de la Balise",
        discipline: "necromancy",
        level: 1,
        description: "Transforme un objet en 'phare' pour les fantômes.",
        ingredients: "Morceau de linceul volé.",
        steps: [
            "1. Enrouler l'objet dans le linceul.",
            "2. Verser une goutte de vitae.",
            "3. Murmurer 'Vene, spiritus'."
        ],
        duration: "Une nuit."
    },

    // ==========================================
    // NIVEAU 2
    // ==========================================

    // --- THAUMATURGIE NIVEAU 2 ---

    call_lustral: {
        id: "call_lustral",
        name: "Appel de l'Eau Lustrale",
        discipline: "thaumaturgy",
        level: 2,
        description: "Invoque une eau pure qui permet de nettoyer les souillures surnaturelles ou de tracer des cercles parfaits.",
        ingredients: "Eau de pluie recueillie dans un crâne.",
        steps: [
            "1. Verser l'eau sur le sol.",
            "2. Elle ne pénètre pas mais forme une flaque qui suit la volonté du mage.",
        ],
        duration: "Une scène."
    },

    blessing_trench: {
        id: "blessing_trench",
        name: "Bénédiction de la Tranchée",
        discipline: "thaumaturgy",
        level: 2,
        description: "Crée un abri sommaire dans la terre qui cache et protège de la lumière du soleil.",
        ingredients: "Terre fraîche.",
        steps: [
            "1. Creuser une petite dépression.",
            "2. S'y allonger et ordonner à la terre de recouvrir le corps.",
            "3. La terre durcit comme de la pierre au-dessus."
        ],
        duration: "Une journée."
    },

    bureaucratic_bull: {
        id: "bureaucratic_bull",
        name: "Lourdeur Administrative",
        discipline: "thaumaturgy",
        level: 2,
        description: "Maudit un dossier ou une affaire pour qu'elle se perde indéfiniment dans les rouages administratifs.",
        ingredients: "Encre mélangée à de la bile, formulaire officiel.",
        steps: [
            "1. Remplir le formulaire avec l'encre maudite.",
            "2. Le glisser dans la pile de documents de la cible (tribunal, banque...).",
            "3. Le dossier sera perdu, mal classé, renversé café, oublié."
        ],
        duration: "Indéfinie."
    },

    focus_blood: {
        id: "focus_blood",
        name: "Concentration de Vitae",
        discipline: "thaumaturgy",
        level: 2,
        description: "Densifie le sang dans une fiole pour le rendre plus nourrissant (1 point = 4 points).",
        ingredients: "Fiole, ruban rouge.",
        steps: [
            "1. Remplir la fiole, nouer le ruban.",
            "2. Enterrer la fiole une heure.",
        ],
        duration: "Permanent (tant que scellé)."
    },

    extinguish_flames: {
        id: "extinguish_flames",
        name: "Éteindre les Flammes",
        discipline: "thaumaturgy",
        level: 2,
        description: "Éteint instantanément tous les feux non-surnaturels dans une zone proche.",
        ingredients: "Sable de désert.",
        steps: [
            "1. Jeter le sable vers les flammes.",
            "2. Prononcer le mot de silence.",
            "3. Le feu meurt sans fumée."
        ],
        duration: "Instantanée."
    },

    burning_blade: {
        id: "burning_blade",
        name: "Lame Enflammée",
        discipline: "thaumaturgy",
        level: 2,
        description: "Enchante une arme blanche pour qu'elle s'enflamme et brûle les victimes (dégâts aggravés).",
        ingredients: "Soufre et graisse de porc.",
        steps: [
            "1. Enduire la lame du mélange.",
            "2. Passer la lame au-dessus d'une bougie verte.",
            "3. La lame s'allumera au prochain impact."
        ],
        duration: "Quelques coups."
    },

    blood_lineage: {
        id: "blood_lineage",
        name: "Lignage du Sang",
        discipline: "thaumaturgy",
        level: 2,
        description: "Renforce les liens de loyauté dans une lignée ou un groupe, rendant la trahison difficile.",
        ingredients: "Coupe commune.",
        steps: [
            "1. Tous les participants versent du sang dans la coupe.",
            "2. Le thaumaturge bénit le mélange.",
            "3. Tous boivent. Un sentiment de fraternité surnaturelle s'installe."
        ],
        duration: "Un mois."
    },

    curse_failure: {
        id: "curse_failure",
        name: "Malédiction de l'Échec",
        discipline: "thaumaturgy",
        level: 2,
        description: "La victime subit une malchance incroyable sur sa prochaine action importante.",
        ingredients: "Un dé pipé ou cassé.",
        steps: [
            "1. Jeter le dé en nommant la cible.",
            "2. Le dé indique un échec.",
            "3. L'univers conspirera pour faire échouer la cible."
        ],
        duration: "Jusqu'à la prochaine action critique."
    },

    shadow_walk: {
        id: "shadow_walk",
        name: "Marche de l'Ombre",
        discipline: "thaumaturgy",
        level: 2,
        description: "Permet de passer d'une ombre à une autre instantanément sur une courte distance.",
        ingredients: "Suie.",
        steps: [
            "1. Se noircir les yeux avec de la suie.",
            "2. Entrer dans une ombre profonde.",
            "3. Ressortir par une autre ombre à vue."
        ],
        duration: "Un saut."
    },

    ward_ghoul: {
        id: "ward_ghoul",
        name: "Protection contre les Goules",
        discipline: "thaumaturgy",
        level: 2,
        description: "Empêche les goules d'entrer dans une zone ou de toucher un objet.",
        ingredients: "Sang de goule, sel.",
        steps: [
            "1. Tracer le sigle d'interdiction avec le sang et le sel.",
            "2. Le sigle luit brièvement puis disparaît.",
        ],
        duration: "Permanent."
    },

    reciprocal_bite: {
        id: "reciprocal_bite",
        name: "Réciproquer la morsure",
        discipline: "thaumaturgy",
        level: 2,
        description: "Si le thaumaturge est mordu, sa peau brûle la bouche de l'agresseur comme du feu.",
        ingredients: "Piment rouge et éclats de verre en poudre.",
        steps: [
            "1. Manger le mélange (douloureux).",
            "2. La peau devient un piège pour quiconque y goûte."
        ],
        duration: "Une nuit."
    },

    blood_invis: {
        id: "blood_invis",
        name: "Sang d'Invisibilité",
        discipline: "thaumaturgy",
        level: 2,
        description: "Rend le sang du thaumaturge transparent et indétectable, même s'il saigne.",
        ingredients: "Eau distillée.",
        steps: [
            "1. S'injecter l'eau distillée enchantée.",
            "2. Le sang perd sa couleur et son odeur pour les autres.",
        ],
        duration: "Une nuit."
    },

    // --- NÉCROMANCIE NIVEAU 2 ---

    eyes_grave: {
        id: "eyes_grave",
        name: "Les Yeux de la Tombe",
        discipline: "necromancy",
        level: 2,
        description: "Voir par les yeux d'un cadavre préparé.",
        ingredients: "Poudre d'argent, cadavre.",
        steps: [
            "1. Saupoudrer les yeux du cadavre.",
            "2. Sceller avec vitae.",
            "3. Méditer."
        ],
        duration: "Concentration."
    },

    hand_glory: {
        id: "hand_glory",
        name: "Main de Gloire",
        discipline: "necromancy",
        level: 2,
        description: "Endort les mortels dans une maison.",
        ingredients: "Main de pendu, graisse humaine.",
        steps: [
            "1. Préparer la main et la bougie.",
            "2. Allumer la bougie dans la main."
        ],
        duration: "Tant que ça brûle."
    },

    // ==========================================
    // NIVEAU 3
    // ==========================================

    // --- THAUMATURGIE NIVEAU 3 ---

    friend_blood: {
        id: "friend_blood",
        name: "Appel du Sang de l'Ami",
        discipline: "thaumaturgy",
        level: 3,
        description: "Si le thaumaturge est capturé, ses alliés ressentent sa peur et sa position approximative.",
        ingredients: "Un bijou offert par un allié.",
        steps: [
            "1. Enchanter le bijou à l'avance.",
            "2. Briser le bijou en cas de danger.",
            "3. L'appel de détresse est envoyé."
        ],
        duration: "Instantanée."
    },

    shield_presence: {
        id: "shield_presence",
        name: "Bouclier de Présence Maléfique",
        discipline: "thaumaturgy",
        level: 3,
        description: "Protège contre les pouvoirs de la discipline Présence.",
        ingredients: "Soie noire nouée autour du cou.",
        steps: [
            "1. Nouer la soie en un nœud gordien.",
            "2. L'aura du thaumaturge devient imperméable aux émotions imposées."
        ],
        duration: "Une nuit."
    },

    incorporeal_passage: {
        id: "incorporeal_passage",
        name: "Incorporel Passage",
        discipline: "thaumaturgy",
        level: 3,
        description: "Permet de traverser la matière solide (murs, portes) en devenant intangible brièvement.",
        ingredients: "Un miroir qu'on traverse.",
        steps: [
            "1. Fixer son reflet jusqu'à ce qu'il disparaisse.",
            "2. Avancer : le corps traverse l'obstacle comme de la brume."
        ],
        duration: "Quelques secondes."
    },

    dry_hands: {
        id: "dry_hands",
        name: "Mains Sèches",
        discipline: "thaumaturgy",
        level: 3,
        description: "Assèche toute l'eau dans un petit volume. Peut tuer des plantes, évaporer une flaque, ou blesser un mortel.",
        ingredients: "Sel gemme.",
        steps: [
            "1. Écraser le sel entre ses paumes.",
            "2. Toucher la cible.",
            "3. L'humidité est aspirée instantanément."
        ],
        duration: "Permanent."
    },

    mirror_narcissus: {
        id: "mirror_narcissus",
        name: "Miroir de Narcisse",
        discipline: "thaumaturgy",
        level: 3,
        description: "Quiconque regarde dans le miroir enchanté voit son reflet monstrueux ou ses péchés, et reste fasciné/horrifié.",
        ingredients: "Un miroir, huile d'onction.",
        steps: [
            "1. Oindre le miroir en spirales.",
            "2. Le placer face à la victime.",
        ],
        duration: "Tant que la victime regarde."
    },

    pavan_chalice: {
        id: "pavan_chalice",
        name: "Pavane du Calice",
        discipline: "thaumaturgy",
        level: 3,
        description: "Permet de danser avec un calice rempli sans jamais renverser une goutte, même en combattant. (Rituel d'apparat Tremere).",
        ingredients: "Calice d'or.",
        steps: [
            "1. Entrer en transe rythmique.",
            "2. Le calice semble collé à la main, le liquide immobile malgré les mouvements."
        ],
        duration: "Une scène."
    },

    viper_skin: {
        id: "viper_skin",
        name: "Peau de la Vipère",
        discipline: "thaumaturgy",
        level: 3,
        description: "La peau du thaumaturge devient écailleuse et souple. Il peut se contorsionner pour passer par des trous minuscules.",
        ingredients: "Mue de serpent.",
        steps: [
            "1. Manger la mue de serpent.",
            "2. La peau gratte et se transforme.",
        ],
        duration: "Une nuit."
    },

    ward_lupines: {
        id: "ward_lupines",
        name: "Protection contre les Lupins",
        discipline: "thaumaturgy",
        level: 3,
        description: "Comme pour les goules, mais affecte les Loups-Garous, leur causant une douleur terrible au contact.",
        ingredients: "Aconit (Tue-loup) et poussière d'argent.",
        steps: [
            "1. Mélanger l'aconit et l'argent.",
            "2. Tracer les runes.",
        ],
        duration: "Permanent."
    },

    shaft_belated: {
        id: "shaft_belated",
        name: "Pieu de la Dissolution Retardée",
        discipline: "thaumaturgy",
        level: 3,
        description: "Pieu qui se fragmente dans le cœur, impossible à retirer simplement.",
        ingredients: "Pieu de chêne, épines de rose noire.",
        steps: [
            "1. Graver des runes sur le bois.",
            "2. Enduire de solution caustique.",
            "3. Laisser reposer 3 jours dans le noir."
        ],
        duration: "Permanent (sur l'objet)."
    },

    seal_ambrosia: {
        id: "seal_ambrosia",
        name: "Sceau d'Ambroisie",
        discipline: "thaumaturgy",
        level: 3,
        description: "Transforme de la vitae en une potion qui donne des pouvoirs temporaires sans lien de sang.",
        ingredients: "Hydromel et sang.",
        steps: [
            "1. Mélanger sang et hydromel.",
            "2. Chant de transmutation.",
        ],
        duration: "Jusqu'à consommation."
    },

    sign_dread: {
        id: "sign_dread",
        name: "Signe de l'Effroi",
        discipline: "thaumaturgy",
        level: 3,
        description: "Un sigle visible qui inspire la terreur à quiconque le regarde.",
        ingredients: "Cendre d'un pendu.",
        steps: [
            "1. Tracer le signe sur un mur ou le sol.",
            "2. Il pulse d'une aura de malaise.",
        ],
        duration: "Une semaine."
    },

    transmute_water: {
        id: "transmute_water",
        name: "Transmutation de l'Eau en Sang",
        discipline: "thaumaturgy",
        level: 3,
        description: "Change de l'eau inerte en sang (non nourrissant pour vampires, mais parfait pour rituels ou tromperie).",
        ingredients: "Une goutte de vrai sang.",
        steps: [
            "1. Verser la goutte dans l'eau.",
            "2. L'eau rougit et s'épaissit instantanément."
        ],
        duration: "Permanent."
    },

    // --- NÉCROMANCIE NIVEAU 3 ---

    ritual_pneuma: {
        id: "ritual_pneuma",
        name: "Rituel du Pneuma",
        discipline: "necromancy",
        level: 3,
        description: "Rend un fantôme tangible et solide.",
        ingredients: "Miroir brisé, sang.",
        steps: [
            "1. Faire regarder le fantôme dans le miroir.",
            "2. Verser le sang dessus.",
        ],
        duration: "Quelques minutes."
    },

    // ==========================================
    // NIVEAU 4
    // ==========================================

    // --- THAUMATURGIE NIVEAU 4 ---

    clash_atom: {
        id: "clash_atom",
        name: "Bruit de l'Atome",
        discipline: "thaumaturgy",
        level: 4,
        description: "Provoque une surcharge d'énergie cinétique dans un objet technologique, le faisant fondre ou exploser.",
        ingredients: "Une pile écrasée.",
        steps: [
            "1. Dessiner un cercle autour de l'objet.",
            "2. Écraser la pile sur l'objet.",
            "3. L'électronique grille instantanément."
        ],
        duration: "Instantanée."
    },

    heart_stone: {
        id: "heart_stone",
        name: "Cœur de Pierre",
        discipline: "thaumaturgy",
        level: 4,
        description: "Le cœur devient pierre. Immunité au pieu, quasi-absence d'émotions.",
        ingredients: "Anneau de granit, cire noire, terre de cimetière.",
        steps: [
            "1. Allongé sur la terre, poser l'anneau sur le cœur.",
            "2. Sceller à la cire.",
            "3. Méditer jusqu'à arrêt du ressenti."
        ],
        duration: "Une semaine."
    },

    infusion_water: {
        id: "infusion_water",
        name: "Infusion de l'Esprit de l'Eau",
        discipline: "thaumaturgy",
        level: 4,
        description: "Permet de voir et entendre tout ce qui se passe à la surface d'un plan d'eau calme.",
        ingredients: "Un bol d'eau pure.",
        steps: [
            "1. Toucher la surface de l'eau.",
            "2. L'image de l'endroit désiré apparaît dans le reflet."
        ],
        duration: "Concentration."
    },

    invis_bond: {
        id: "invis_bond",
        name: "Lien de Sang Invisible",
        discipline: "thaumaturgy",
        level: 4,
        description: "Dissimule l'existence d'un Lien de Sang aux détections magiques.",
        ingredients: "Sang du regnant et du thrall mélangés.",
        steps: [
            "1. Boire le mélange.",
            "2. Le lien existe toujours mais ne vibre plus magiquement."
        ],
        duration: "Un an."
    },

    cursed_bond: {
        id: "cursed_bond",
        name: "Maudit soit le Lien",
        discipline: "thaumaturgy",
        level: 4,
        description: "Brise temporairement les effets émotionnels d'un Lien de Sang (le thrall déteste son maître).",
        ingredients: "Vaisselle brisée.",
        steps: [
            "1. Le thrall doit briser un objet cher à son maître.",
            "2. La haine remplace l'amour artificiel."
        ],
        duration: "Une nuit."
    },

    bone_lies: {
        id: "bone_lies",
        name: "Os de Mensonge",
        discipline: "thaumaturgy",
        level: 4,
        description: "Oblige une victime à dire la vérité ou à subir une douleur atroce.",
        ingredients: "Un os humain enchanté.",
        steps: [
            "1. La victime tient l'os.",
            "2. Si elle ment, l'os devient noir et brûlant.",
        ],
        duration: "Une scène."
    },

    ward_kindred: {
        id: "ward_kindred",
        name: "Protection contre les Vampires",
        discipline: "thaumaturgy",
        level: 4,
        description: "Barrière infranchissable pour les vampires.",
        ingredients: "Poussière de vampire (cendres finales).",
        steps: [
            "1. Tracer les sceaux avec les cendres.",
            "2. Aucun descendant de Caïn ne peut franchir le seuil."
        ],
        duration: "Permanent."
    },

    recall_soul: {
        id: "recall_soul",
        name: "Rappel de l'Âme Enchaînée",
        discipline: "thaumaturgy",
        level: 4,
        description: "Force un esprit en projection astrale ou un fantôme à retourner dans son corps ou son ancre.",
        ingredients: "Nom véritable de la cible.",
        steps: [
            "1. Prononcer le nom à l'envers.",
            "2. L'esprit est violemment tiré vers son origine."
        ],
        duration: "Instantanée."
    },

    seal_passage: {
        id: "seal_passage",
        name: "Sceller le Passage",
        discipline: "thaumaturgy",
        level: 4,
        description: "Rend une porte ou un passage physiquement indestructible et impossible à ouvrir.",
        ingredients: "Plomb fondu.",
        steps: [
            "1. Couler le plomb dans la serrure ou les gonds.",
            "2. Le métal fusionne avec la structure au niveau moléculaire."
        ],
        duration: "Permanent."
    },

    leach_vitae: {
        id: "leach_vitae",
        name: "Siphon de Vitae",
        discipline: "thaumaturgy",
        level: 4,
        description: "Boire le sang de la victime à distance via un lien sympathique.",
        ingredients: "Poupée de cire, cheveux de la cible.",
        steps: [
            "1. Incorporer les cheveux dans la poupée.",
            "2. 'Boire' la poupée.",
        ],
        duration: "Une scène."
    },

    // --- NÉCROMANCIE NIVEAU 4 ---

    cadaver_touch: {
        id: "cadaver_touch",
        name: "Baiser du Cadavre",
        discipline: "necromancy",
        level: 4,
        description: "Insensibilité à la douleur, peau froide, malus dextérité.",
        ingredients: "Écharpe au formol.",
        steps: [
            "1. Enrouler l'écharpe autour du cou.",
            "2. Chant de préservation.",
        ],
        duration: "Une nuit."
    },

    // ==========================================
    // NIVEAU 5
    // ==========================================

    // --- THAUMATURGIE NIVEAU 5 ---

    abandon_fetters: {
        id: "abandon_fetters",
        name: "Abandon des Liens",
        discipline: "thaumaturgy",
        level: 5,
        description: "Brise définitivement un Lien de Sang existant. Extrêmement douloureux et nécessite la coopération du thrall.",
        ingredients: "Le sang du thrall vidé totalement, remplacé par du sang neutre.",
        steps: [
            "1. Exsanguiner la victime.",
            "2. Transfuser du sang nouveau pendant le rituel.",
            "3. Le lien est lavé avec l'ancienne vitae."
        ],
        duration: "Permanent."
    },

    change_blood: {
        id: "change_blood",
        name: "Changement de Sang",
        discipline: "thaumaturgy",
        level: 5,
        description: "Permet de changer temporairement l'appartenance de Clan du sang pour tromper les analyses.",
        ingredients: "Sang d'un membre du clan imité.",
        steps: [
            "1. Mélanger son sang avec celui de l'autre clan.",
            "2. Filtrer à travers de la terre.",
            "3. Se réinjecter le mélange."
        ],
        duration: "Une nuit."
    },

    blood_contract: {
        id: "blood_contract",
        name: "Contrat de Sang",
        discipline: "thaumaturgy",
        level: 5,
        description: "Pacte inviolable. La rupture entraîne la mort.",
        ingredients: "Parchemin peau humaine, plume, sang.",
        steps: [
            "1. Rédiger le contrat.",
            "2. Signer avec le sang.",
            "3. Sceller."
        ],
        duration: "Permanent."
    },

    crown_thorns: {
        id: "crown_thorns",
        name: "Couronne d'Épines",
        discipline: "thaumaturgy",
        level: 5,
        description: "Rend le thaumaturge impossible à surprendre ou à attaquer en traître aussi longtemps qu'il porte la couronne.",
        ingredients: "Couronne de ronces séchées trempées dans le sang.",
        steps: [
            "1. Tresser la couronne.",
            "2. La poser sur la tête (les épines blessent).",
            "3. La douleur maintient une hyper-vigilance surnaturelle."
        ],
        duration: "Tant que portée."
    },

    escape_friend: {
        id: "escape_friend",
        name: "Évasion vers un Ami Fidèle",
        discipline: "thaumaturgy",
        level: 5,
        description: "Téléportation d'urgence vers un cercle préparé à l'avance ou un allié proche.",
        ingredients: "Un cercle tracé à l'avance.",
        steps: [
            "1. Prononcer le mot de commande.",
            "2. Disparaître dans un éclair de fumée.",
            "3. Réapparaître dans le cercle de sécurité."
        ],
        duration: "Instantanée."
    },

    homunculus: {
        id: "homunculus",
        name: "Lien d'Âme (Homunculus)",
        discipline: "thaumaturgy",
        level: 5,
        description: "Crée une petite créature servile à partir de sa propre chair et sang. L'homoncule est une extension du sorcier.",
        ingredients: "Un litre de sang, chair du thaumaturge, mandragore.",
        steps: [
            "1. Modeler la créature.",
            "2. La nourrir de sang pendant un mois.",
            "3. Elle s'éveille, loyale jusqu'à la mort."
        ],
        duration: "Permanent."
    },

    curse_clay: {
        id: "curse_clay",
        name: "Malédiction de l'Argile",
        discipline: "thaumaturgy",
        level: 5,
        description: "Transforme la chair de la victime en matière inerte et fragile (pierre ou argile) progressivement.",
        ingredients: "Poussière de statue.",
        steps: [
            "1. Souffler la poussière sur la cible.",
            "2. La cible se sent lourde et durcit.",
            "3. Sa dextérité chute jusqu'à la paralysie."
        ],
        duration: "Permanent (nécessite contre-rituel)."
    },

    ward_spirits: {
        id: "ward_spirits",
        name: "Protection contre les Esprits",
        discipline: "thaumaturgy",
        level: 5,
        description: "Barrière infranchissable pour les esprits naturels et élémentaires.",
        ingredients: "Sel pur.",
        steps: [
            "1. Tracer le cercle de sel.",
            "2. Aucune entité immatérielle ne peut passer."
        ],
        duration: "Permanent."
    },

    ward_ghosts: {
        id: "ward_ghosts",
        name: "Protection contre les Fantômes",
        discipline: "thaumaturgy",
        level: 5,
        description: "Barrière spécifique contre les Wraiths et spectres.",
        ingredients: "Cendre de crémation.",
        steps: [
            "1. Répandre les cendres sur le seuil.",
            "2. Les morts doivent rester dehors."
        ],
        duration: "Permanent."
    },

    blood_potence: {
        id: "blood_potence",
        name: "Sang de Potence",
        discipline: "thaumaturgy",
        level: 5,
        description: "Augmente artificiellement la Génération du thaumaturge pour une nuit.",
        ingredients: "Le sang d'un vampire de génération plus base.",
        steps: [
            "1. Boire le sang puissant.",
            "2. Canaliser l'énergie au lieu de la digérer.",
            "3. Le sang bout, la puissance augmente."
        ],
        duration: "Une nuit."
    },

    stone_victory: {
        id: "stone_victory",
        name: "Victoire de la Pierre",
        discipline: "thaumaturgy",
        level: 5,
        description: "Le thaumaturge devient immunisé au feu et à la lumière du soleil, mais se transforme en statue immobile.",
        ingredients: "Aucun (volonté pure).",
        steps: [
            "1. Se concentrer sur la pérennité de la pierre.",
            "2. Le corps se pétrifie.",
            "3. Le feu ne brûle plus la pierre."
        ],
        duration: "Tant que maintenu."
    },

    // --- NÉCROMANCIE NIVEAU 5 ---

    lich_transcendence: {
        id: "lich_transcendence",
        name: "Transcendance de la Liche",
        discipline: "necromancy",
        level: 5,
        description: "Âme dans un phylactère. Immortalité virtuelle.",
        ingredients: "Objet précieux, sacrifice innocent.",
        steps: [
            "1. Tuer l'innocent sur l'objet.",
            "2. Transférer l'âme.",
        ],
        duration: "Permanent."
    },

    // ==========================================
    // RITUELS SUPÉRIEURS (LEV 6+)
    // ==========================================

    armor_efficacy: {
        id: "armor_efficacy",
        name: "Armure d'Efficacité Infernale",
        discipline: "thaumaturgy",
        level: 6,
        description: "Crée une barrière d'énergie sombre qui absorbe les dégâts.",
        ingredients: "Diamant noir.",
        steps: ["Invoquer la protection ultime."],
        duration: "Scène."
    },

    ward_demons: {
        id: "ward_demons",
        name: "Protection contre les Démons",
        discipline: "thaumaturgy",
        level: 6,
        description: "Interdit l'accès aux entités infernales.",
        ingredients: "Eau bénite corrompue.",
        steps: ["Tracer le sceau interdit."],
        duration: "Permanent."
    },

    divine_lineage: {
        id: "divine_lineage",
        name: "Divination de la lignée de Caine",
        discipline: "thaumaturgy",
        level: 7,
        description: "Révèle toute la généalogie d'un vampire jusqu'à Caine.",
        ingredients: "Sang d'un Mathusalem.",
        steps: ["Boire et voir le passée."],
        duration: "Instant."
    },

    chain_bloodline: {
        id: "chain_bloodline",
        name: "Chaîne de la Lignée Sanglante",
        discipline: "thaumaturgy",
        level: 8,
        description: "Affecte toute la lignée d'une victime avec un sort.",
        ingredients: "Sang du fondateur de la lignée.",
        steps: ["Maudire le sang originel."],
        duration: "Variable."
    },

    witch_transform: {
        id: "witch_transform",
        name: "Transformation de la Sorcière",
        discipline: "thaumaturgy",
        level: 9,
        description: "Permet de réécrire la réalité locale selon la volonté du mage.",
        ingredients: "Inconnu.",
        steps: ["Volonté pure."],
        duration: "Variable."
    }
};

export function getRitualById(id) {
    return RITUALS[id];
}
