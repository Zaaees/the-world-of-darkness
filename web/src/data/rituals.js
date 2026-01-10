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
        name: "L'Appel du Sang",
        discipline: "thaumaturgy",
        level: 1,
        description: "Ce rituel fondamental permet au Thaumaturge de remonter le cours de la Vitae d'un sujet pour en révéler l'ascendance. En goûtant le sang, le sorcier ne goûte pas seulement la vie, mais la mémoire généalogique maudite de Cain. Il perçoit les visages flous des Sires successifs, entend leurs noms murmurés par les échos du sang, et peut déterminer la Génération exacte ainsi que le Clan d'origine.",
        ingredients: "Une large goutte de sang de la cible, versée dans un calice d'argent.",
        steps: [
            "1. Le Thaumaturge entre en transe méditative, se concentrant sur la fluidité de sa propre vitae.",
            "2. Il dépose la goutte de sang étranger sur sa langue sans l'avaler immédiatement.",
            "3. En absorbant l'essence, les visions des ancêtres apparaissent en ordre croissant, du Sire jusqu'aux anciens, jusqu'à ce que la puissance du sang s'estompe."
        ],
        duration: "Instantanée (les visions durent quelques minutes)."
    },

    comm_sire: {
        id: "comm_sire",
        name: "Communication avec le Sire",
        discipline: "thaumaturgy",
        level: 1,
        description: "En utilisant le lien mystique de l'Étreinte, le Thaumaturge peut projeter sa voix à l'esprit de son propre Sire, où qu'il soit. C'est un appel à sens unique, souvent utilisé pour les rapports urgents ou les appels à l'aide désespérés. Le Sire entend la voix de son Infant comme si elle provenait de l'ombre la plus proche.",
        ingredients: "Un objet ayant une forte résonance sentimentale pour le Sire.",
        steps: [
            "1. Le Thaumaturge serre l'objet contre son cœur mort.",
            "2. Il entre dans une transe légère et visualise le visage de son créateur.",
            "3. Il murmure le message, qui voyage instantanément à travers l'éther spirituel."
        ],
        duration: "Le temps d'un bref message (1 minute)."
    },

    def_havre: {
        id: "def_havre",
        name: "Défense du Havre Sacré",
        discipline: "thaumaturgy",
        level: 1,
        description: "Ce rituel vital pour les Tremere voyageurs permet d'imprégner une pièce d'une obscurité protectrice. Tant que le rituel est actif, la lumière du soleil elle-même est repoussée, incapable de brûler la chair des Kinites à l'intérieur. De plus, une barrière subtile décourage les intrus mortels et les esprits mineurs.",
        ingredients: "Le sang du thaumaturge mélangé à de la poudre de charbon ou de craie noire.",
        steps: [
            "1. Tracer des sigles hermétiques sur chaque fenêtre, porte et interstice.",
            "2. Le Thaumaturge doit marquer le centre de la pièce de sa propre main ensanglantée.",
            "3. L'obscurité s'épaissit, rendant les vitres opaques aux rayons UV mortels."
        ],
        duration: "Tant que le Thaumaturge reste dans l'enceinte."
    },

    deflect_doom: {
        id: "deflect_doom",
        name: "Déflexion du Fléau de Bois",
        discipline: "thaumaturgy",
        level: 1,
        description: "Une protection paranoïaque mais efficace contre la plus grande peur des Anciens. Ce rituel entoure le cœur mort du vampire d'un champ de force mystique. Si un pieu de bois devait percer la chair pour atteindre le cœur, le bois se briserait net ou dévierait miraculeusement, sauvant le sorcier de la torpeur.",
        ingredients: "Une écharde de bois dur qu'on laisse se consumer entièrement dans la main (nécessite un test de courage).",
        steps: [
            "1. Le Thaumaturge tient l'écharde brûlante jusqu'à ce qu'elle soit cendre, se concentrant sur son invulnérabilité.",
            "2. Il mélange la cendre à de l'eau croupie et boit le breuvage.",
            "3. Le rituel reste latent jusqu'à l'instant fatal."
        ],
        duration: "Jusqu'au lever du soleil ou jusqu'au premier impact évité."
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
        name: "L'Éveil de la Vigie",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet de surmonter la malédiction de la somnolence diurne. Grâce à ce rituel, le Thaumaturge peut se réveiller instantanément au moindre signe de danger, avec l'esprit clair et vif, sans la lourdeur habituelle qui accable les Kinites pendant le jour.",
        ingredients: "Les plumes d'un coq égorgé à l'aube.",
        steps: [
            "1. Brûler les plumes dans un brasier rituel juste avant le lever du soleil.",
            "2. Inhaler la fumée âcre en chantant des hymnes de vigilance.",
            "3. Se coucher immédiatement. Le sommeil sera léger comme celui d'un chat."
        ],
        duration: "Une période diurne."
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
        description: "Ce rituel fondamental facilite la traversée du Voile pour un esprit spécifique que le Nécromant souhaite contacter. En créant un phare spirituel, le sorcier illumine un chemin à travers les Terres des Ombres, guidant l'âme ciblée vers le monde des vivants. L'esprit ressent l'appel comme une traction irrésistible, un fil d'Ariane tissé de sang et de volonté.",
        ingredients: "Un morceau de linceul volé dans un cimetière et un objet ayant appartenu au défunt.",
        steps: [
            "1. Envelopper l'objet personnel dans le linceul en murmurant le nom du mort.",
            "2. Verser quelques gouttes de vitae sur le tissu funéraire.",
            "3. Prononcer l'invocation 'Venite, spiritus vagantes' — l'objet commence à luire d'une lumière que seuls les morts peuvent percevoir."
        ],
        duration: "Une nuit entière."
    },

    epitaph: {
        id: "epitaph",
        name: "Épitaphe",
        discipline: "necromancy",
        level: 1,
        description: "En touchant un cadavre, le Nécromant peut lire les dernières impressions gravées dans la chair morte. Ce ne sont pas des souvenirs cohérents, mais des fragments sensoriels : la dernière chose vue, la dernière émotion ressentie, parfois le visage de l'assassin ou les mots finaux entendus. Plus le corps est frais, plus les impressions sont vives.",
        ingredients: "Une pièce de monnaie ancienne placée sur la langue du mort.",
        steps: [
            "1. Placer la pièce sur la langue du cadavre.",
            "2. Poser les deux mains sur les tempes du mort et fermer les yeux.",
            "3. Laisser les visions affluer — elles viennent par flashs violents et désordonnés."
        ],
        duration: "Instantanée (les visions durent quelques secondes)."
    },

    knowing_death: {
        id: "knowing_death",
        name: "Savoir du Mourant",
        discipline: "necromancy",
        level: 1,
        description: "Le Nécromant développe une sensibilité morbide à l'approche de la mort. En se concentrant sur une personne, il peut percevoir si celle-ci est proche de sa fin — que ce soit par maladie, blessure cachée, ou destin imminent. L'information vient sous forme d'une aura sombre autour du sujet, plus dense à mesure que la mort approche.",
        ingredients: "Un sablier miniature contenant de la cendre de crémation.",
        steps: [
            "1. Retourner le sablier en fixant la cible du regard.",
            "2. Observer l'aura de la personne — les mourants sont entourés d'ombres rampantes.",
            "3. Plus les ombres sont denses et agitées, plus la mort est proche."
        ],
        duration: "Une scène."
    },

    minion_death_sense: {
        id: "minion_death_sense",
        name: "Sentir le Glas",
        discipline: "necromancy",
        level: 1,
        description: "Ce rituel crée un lien mystique entre le Nécromant et ses serviteurs liés par le sang (goules, thralls). Si l'un d'entre eux meurt, le sorcier le ressent instantanément : une douleur sourde dans la poitrine, accompagnée d'une vision fugace du moment de la mort. Ce lien permet de savoir non seulement que le serviteur est mort, mais souvent comment et où.",
        ingredients: "Une mèche de cheveux du serviteur, nouée avec un fil noir.",
        steps: [
            "1. Brûler la mèche de cheveux en prononçant le nom du serviteur.",
            "2. Avaler les cendres mélangées à une goutte de son propre sang.",
            "3. Le lien est établi — toute mort du serviteur sera ressentie comme un écho douloureux."
        ],
        duration: "Permanent (tant que le lien de sang existe)."
    },

    corpse_smile: {
        id: "corpse_smile",
        name: "Sourire du Cadavre",
        discipline: "necromancy",
        level: 1,
        description: "Le Nécromant s'imprègne de l'aura de la mort, devenant plus intimidant pour les vivants et étrangement charismatique pour les morts. Les fantômes le perçoivent comme l'un des leurs, un passeur entre les mondes, et sont plus enclins à lui parler. Les mortels, eux, ressentent un malaise viscéral en sa présence, comme face à un cadavre ambulant.",
        ingredients: "De la terre de cimetière frottée sur les joues.",
        steps: [
            "1. Étaler la terre sur le visage en traçant deux lignes sous les yeux.",
            "2. Sourire largement en visualisant son propre cadavre.",
            "3. L'aura de mort s'installe — les esprits s'inclinent, les vivants frissonnent."
        ],
        duration: "Une nuit."
    },

    blood_tear: {
        id: "blood_tear",
        name: "Une Larme de Sang",
        discipline: "necromancy",
        level: 1,
        description: "En versant une larme de vitae, le Nécromant peut brièvement percevoir le monde à travers les yeux d'un fantôme présent. Il voit ce que l'esprit voit : le monde des vivants superposé aux Terres des Ombres, les chaînes émotionnelles qui lient les spectres à leurs ancres, et parfois des secrets que seuls les morts connaissent.",
        ingredients: "Une larme de sang (vitae) versée dans un bol d'eau stagnante.",
        steps: [
            "1. Pleurer une larme de sang dans l'eau — elle doit couler naturellement.",
            "2. Fixer la surface de l'eau en appelant le nom d'un esprit connu.",
            "3. La vision se trouble, puis se clarifie — le monde spectral apparaît à travers les yeux du mort."
        ],
        duration: "Quelques minutes de concentration."
    },

    // ==========================================
    // NIVEAU 2
    // ==========================================

    // --- THAUMATURGIE NIVEAU 2 ---

    call_lustral: {
        id: "call_lustral",
        name: "L'Appel de l'Eau Lustrale",
        discipline: "thaumaturgy",
        level: 2,
        description: "Ce rituel permet d'invoquer une petite quantité d'eau chimiquement pure et spirituellement neutre. Cette eau défie parfois la gravité pour former des cercles parfaits. Elle est essentielle pour nettoyer les outils rituels des souillures occultes ou pour tracer des barrières contre les créatures impures.",
        ingredients: "De l'eau de pluie collectée dans un crâne humain naturel.",
        steps: [
            "1. Le Thaumaturge verse l'eau sur le sol ou une surface.",
            "2. Au lieu de s'étaler, l'eau obéit à la volonté du mage, formant flaque, cercle ou lignes.",
            "3. Elle dissout instantanément les résidus magiques ou sanguins au contact."
        ],
        duration: "Une scène (ou jusqu'à utilisation)."
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
        name: "L'Enfer Administratif",
        discipline: "thaumaturgy",
        level: 2,
        description: "Une malédiction subtile mais dévastatrice pour la vie moderne. Elle frappe un dossier, une requête ou une procédure officielle. Le document visé est englouti par la bureaucratie : perdu, mal classé, renversé de café, supprimé par erreur informatique... Il devient impossible de le faire avancer sans des efforts titanesques.",
        ingredients: "Une plume trempée dans un mélange d'encre noire et de bile.",
        steps: [
            "1. Tracer un symbole de confusion (souvent une spirale carrée) sur le document ou son conteneur.",
            "2. Visualiser les rouages de l'administration se griper.",
            "3. Le document semble devenir 'invisible' aux yeux des clercs et fonctionnaires."
        ],
        duration: "Indéfinie (jusqu'à ce que le rituel soit brisé ou le dossier détruit)."
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
        name: "Le Lien de la Lignée",
        discipline: "thaumaturgy",
        level: 2,
        description: "Un rituel de cohésion de groupe, souvent utilisé par les coteries Tremere. Il crée un lien empathique et mystique entre les participants, rendant la trahison psychologiquement difficile et douloureuse. Chaque membre ressent le statut émotionnel général des autres.",
        ingredients: "Une coupe commune où chaque participant verse une goutte de sang.",
        steps: [
            "1. Mélanger le sang de tous les participants dans la coupe.",
            "2. Le Thaumaturge chante les Noms de l'Unité au-dessus du mélange.",
            "3. La coupe est passée de main en main, chacun buvant une gorgée qui a un goût de fer et de serment."
        ],
        duration: "Une lunaison."
    },

    curse_failure: {
        id: "curse_failure",
        name: "Malédiction de l'Échec",
        discipline: "thaumaturgy",
        level: 2,
        description: "Le Thaumaturge insuffle une malchance accablante dans l'aura d'une victime. L'univers semble conspirer contre elle pour sa prochaine entreprise importante : ses outils casseront, sa langue fourchera, ou elle trébuchera au pire moment possible.",
        ingredients: "Un dé à jouer cassé grossièrement en deux et le nom de la victime.",
        steps: [
            "1. Pulvériser le dé en une poussière fine en répétant le nom de la victime.",
            "2. Souffler la poussière dans la direction générale de la cible.",
            "3. La poussière disparaît, mais le poids du destin s'abat sur la victime."
        ],
        duration: "Jusqu'à la prochaine action critique (qui échouera)."
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
        name: "Sceau contre les Serviteurs",
        discipline: "thaumaturgy",
        level: 2,
        description: "Trace une barrière invisible mais douloureuse pour toute créature dépendante du sang (goules). Si une goule tente de franchir le seuil ou de toucher l'objet protégé, elle est frappée d'une douleur fulgurante, comme si son sang bouillait.",
        ingredients: "Une pâte faite de sang de goule séché et de sel gemme.",
        steps: [
            "1. Peindre le glyphe d'interdiction sur l'objet ou le seuil avec la pâte.",
            "2. Le glyphe luit d'un rouge maladif avant de disparaître à la vue des mortels.",
            "3. La barrière est active et repousse violemment toute goule."
        ],
        duration: "Permanent (tant que le glyphe n'est pas physiquement effacé)."
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

    shadow_armor: {
        id: "shadow_armor",
        name: "Armure de l'Ombre",
        discipline: "necromancy",
        level: 2,
        description: "Le Nécromant tisse autour de lui un manteau d'ombre spectrale qui le protège des attaques provenant de l'au-delà. Les griffes des fantômes, les hurlements des spectres et les tentatives de possession glissent sur cette barrière comme l'eau sur l'huile. C'est une protection essentielle pour ceux qui s'aventurent trop souvent dans les affaires des morts.",
        ingredients: "Un morceau de suaire funéraire porté autour des épaules.",
        steps: [
            "1. Draper le suaire sur ses épaules en murmurant les noms des morts apaisés.",
            "2. Visualiser les ombres s'épaississant autour de soi comme une seconde peau.",
            "3. Les attaques spirituelles sont absorbées par le manteau d'ombre."
        ],
        duration: "Une nuit."
    },

    puppet_flesh: {
        id: "puppet_flesh",
        name: "Chair de la Marionnette",
        discipline: "necromancy",
        level: 2,
        description: "Ce rituel permet au Nécromant de manipuler un cadavre comme une marionnette macabre. Le corps peut marcher, gesticuler et même accomplir des tâches simples, bien qu'il soit évident pour quiconque l'observe de près qu'il n'est pas vraiment vivant. Les mouvements sont saccadés, les yeux vides, et une odeur de mort émane du pantin.",
        ingredients: "Des fils de soie noire cousus dans les poignets et chevilles du cadavre.",
        steps: [
            "1. Coudre les fils aux articulations principales du corps.",
            "2. Verser une goutte de vitae sur le front du mort.",
            "3. Mimer les mouvements désirés — le cadavre les reproduit."
        ],
        duration: "Une scène (concentration requise)."
    },

    blood_din: {
        id: "blood_din",
        name: "Échange du Sang de la Mort",
        discipline: "necromancy",
        level: 2,
        description: "Les fantômes sont des êtres affamés, privés de la chaleur de la vie. Ce rituel permet de nourrir un esprit avec du sang, lui offrant un bref répit de son existence froide. En échange, le fantôme est généralement plus coopératif, reconnaissant, voire dévoué. C'est la monnaie d'échange favorite des Nécromants pour négocier avec les morts.",
        ingredients: "Un calice de pierre contenant du sang frais (mortel ou vitae).",
        steps: [
            "1. Verser le sang dans le calice en appelant l'esprit.",
            "2. Le fantôme absorbe l'essence du sang — le liquide s'évapore lentement.",
            "3. L'esprit, rassasié, devient temporairement plus docile et reconnaissant."
        ],
        duration: "L'effet sur l'esprit dure quelques heures."
    },

    eyes_grave: {
        id: "eyes_grave",
        name: "Les Yeux de la Tombe",
        discipline: "necromancy",
        level: 2,
        description: "Une malédiction terrifiante qui force la victime à voir des visions de sa propre mort. Partout où elle regarde, elle aperçoit des présages funestes : son reflet pourrissant dans les miroirs, des vers rampant sous sa peau dans les ombres, son propre cadavre dans les visages des passants. Cette terreur constante peut briser l'esprit des plus faibles.",
        ingredients: "Une photo de la victime et de la terre de sa future tombe.",
        steps: [
            "1. Enterrer la photo dans la terre pendant trois nuits.",
            "2. Déterrer la photo et la brûler en prononçant la malédiction.",
            "3. La victime commencera à voir sa mort partout — sommeil impossible, paranoïa croissante."
        ],
        duration: "Une lunaison (ou jusqu'à ce que le rituel soit brisé)."
    },

    hand_glory: {
        id: "hand_glory",
        name: "Main de Gloire",
        discipline: "necromancy",
        level: 2,
        description: "Un artefact classique du folklore occulte. La main séchée d'un pendu, imbibée de graisse humaine et allumée comme une bougie, paralyse tous les occupants mortels d'une demeure. Ils restent figés, conscients mais incapables de bouger ou de crier, tant que la Main brûle. Les vampires et créatures surnaturelles ne sont pas affectés.",
        ingredients: "La main gauche d'un condamné à mort exécuté par pendaison, et de la graisse humaine pour fabriquer une mèche.",
        steps: [
            "1. Sécher et embaumer la main pendant une lunaison.",
            "2. Enrouler une mèche trempée dans la graisse autour des doigts.",
            "3. Allumer la mèche dans la demeure — tous les mortels présents se figent instantanément."
        ],
        duration: "Tant que la flamme brûle (environ une heure)."
    },

    seal_tomb: {
        id: "seal_tomb",
        name: "Sceller le Tombeau",
        discipline: "necromancy",
        level: 2,
        description: "Ce rituel crée une barrière spirituelle autour d'un lieu, empêchant tout esprit d'y entrer ou d'en sortir. C'est une prison pour les morts, utilisée pour contenir les fantômes dangereux ou pour protéger un sanctuaire des intrusions spectrales. Les esprits piégés à l'intérieur ne peuvent communiquer avec l'extérieur.",
        ingredients: "Du sel noir mélangé à de la cendre de crémation.",
        steps: [
            "1. Tracer un cercle complet autour du lieu avec le mélange.",
            "2. Prononcer les Mots de Scellage à chaque point cardinal.",
            "3. Le lieu devient une prison pour les âmes — rien de spectral ne franchit la barrière."
        ],
        duration: "Permanent (jusqu'à ce que le cercle soit brisé)."
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
        name: "Bouclier de Volonté",
        discipline: "thaumaturgy",
        level: 3,
        description: "Ce rituel renforce l'esprit du Thaumaturge contre les manipulations émotionnelles de la Présence. Il érige une forteresse mentale froide et logique, rendant le sorcier insensible à la peur surnaturelle, à la séduction forcée ou à l'autorité artificielle des Ventrue et Toreador.",
        ingredients: "Un ruban de soie noire, noué autour du cou.",
        steps: [
            "1. Faire un nœud complexe (nœud gordien) dans la soie en récitant des mantras de stoïcisme.",
            "2. Serrer le nœud autour du cou (pour un vampire, cela ne gêne pas).",
            "3. Tant que le nœud tient, les émotions du sorcier sont sous scellé."
        ],
        duration: "Une nuit (ou jusqu'à ce que le ruban soit dénoué)."
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
        name: "Le Miroir des Péchés",
        discipline: "thaumaturgy",
        level: 3,
        description: "Enchante un miroir pour qu'il reflète non pas le corps physique, mais l'âme corrompue de celui qui s'y regarde. Le spectateur est confronté à ses crimes, ses vices et sa Bête sous une forme monstrueuse. Cette vision est si terrifiante qu'elle paralyse la victime, fascinée par sa propre horreur intérieure.",
        ingredients: "Un miroir poli avec de l'huile d'onction sacrée et de la poudre d'os.",
        steps: [
            "1. Enduire la surface du miroir en traçant une spirale centripète.",
            "2. Orienter le miroir vers la victime.",
            "3. Dès que le regard croise le reflet, la transe commence."
        ],
        duration: "Tant que la victime maintient le contact visuel."
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
        name: "Sceau contre les Bêtes de Lune",
        discipline: "thaumaturgy",
        level: 3,
        description: "Similaire aux autres protections, ce rituel est spécifiquement conçu pour repousser les Loups-Garous. L'odeur de l'aconit brûle leurs sens surdéveloppés et le contact avec la barrière leur inflige une douleur comparable à de l'argent liquide.",
        ingredients: "Un sachet de poussière d'argent mélangée à de l'aconit séché.",
        steps: [
            "1. Saupoudrer le mélange sur le périmètre à protéger.",
            "2. Chant de bannissement en ancien sumérien.",
            "3. L'air devient lourd et stérile pour les Garous."
        ],
        duration: "Permanent (jusqu'à rupture du cercle)."
    },

    shaft_belated: {
        id: "shaft_belated",
        name: "Le Pieu de la Fin Différée",
        discipline: "thaumaturgy",
        level: 3,
        description: "Une arme cruelle et sournoise. Le Thaumaturge enchante un pieu de bois ordinaire pour que sa pointe se sépare et reste fichée dans le cœur de la victime même si le pieu est retiré. La victime reste paralysée indéfiniment, et l'éclat de bois est presque impossible à extraire sans une chirurgie invasive.",
        ingredients: "Un pieu en chêne noirci au feu, des épines de rose noire.",
        steps: [
            "1. Graver des runes de fragilité sur la pointe du pieu.",
            "2. Enduire la pointe d'une solution caustique alchimique.",
            "3. Laisser reposer le pieu 3 jours dans une obscurité totale."
        ],
        duration: "Permanent (l'enchantement reste sur le pieu jusqu'à utilisation)."
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
        description: "Un miracle noir qui permet de changer de l'eau ordinaire en sang humain. Bien que ce sang ait l'apparence, l'odeur et le goût de la vitae, il est mort et ne nourrit pas les vampires (il ne donne aucun point de sang). Il est cependant parfait pour tromper les mortels, remplir des calices rituels ou simuler une scène de crime.",
        ingredients: "Une fiole d'eau et une goutte de sang du Thaumaturge.",
        steps: [
            "1. Verser la goutte de sang dans le récipient d'eau.",
            "2. Passer la main au-dessus sans toucher le liquide.",
            "3. L'eau se trouble, rougit et s'épaissit instantanément pour devenir du sang froid."
        ],
        duration: "Permanent (le liquide reste du sang)."
    },

    // --- NÉCROMANCIE NIVEAU 3 ---

    summon_spectres: {
        id: "summon_spectres",
        name: "Appel des Spectres",
        discipline: "necromancy",
        level: 3,
        description: "Le Nécromant ouvre brièvement une porte vers les Terres des Ombres et en laisse s'échapper des esprits mineurs — des fragments d'âmes brisées, des échos de morts oubliés. Ces spectres ne sont pas intelligents, mais ils sont vindicatifs et affamés. Ils harcèlent la cible désignée, la griffant, la terriffant et l'empêchant de dormir ou de se concentrer.",
        ingredients: "Un os brisé d'un mort anonyme et du sel noir.",
        steps: [
            "1. Briser l'os au-dessus d'un cercle de sel noir.",
            "2. Nommer la cible à voix haute trois fois.",
            "3. Les spectres émergent du cercle et se lancent à la poursuite de la victime."
        ],
        duration: "Une nuit (les spectres disparaissent à l'aube)."
    },

    skull_blessing: {
        id: "skull_blessing",
        name: "Bénédiction du Crâne",
        discipline: "necromancy",
        level: 3,
        description: "En préparant un crâne humain avec des rituels spécifiques, le Nécromant peut l'utiliser comme relais de communication. Tant qu'il tient le crâne, ses mots peuvent être entendus par quiconque se trouve près d'un autre crâne préparé de la même façon. C'est le téléphone des morts, utilisé par les Giovanni pour communiquer à travers les continents.",
        ingredients: "Un crâne humain nettoyé et poli, de la cire noire.",
        steps: [
            "1. Remplir les orbites et la cavité buccale de cire noire fondue.",
            "2. Graver le nom du destinataire sur le front du crâne.",
            "3. Parler dans la mâchoire du crâne — les mots seront entendus par le crâne jumeau."
        ],
        duration: "Permanent (les crânes restent liés)."
    },

    false_repentance: {
        id: "false_repentance",
        name: "Exhumation de la Fausse Repentance",
        discipline: "necromancy",
        level: 3,
        description: "Ce rituel force un esprit récalcitrant à confesser ses secrets les plus sombres. Le Nécromant torture l'âme de la façon la plus intime qui soit : en la confrontant à ses propres regrets et mensonges. Sous cette pression spirituelle, même les fantômes les plus têtus finissent par révéler ce qu'ils cachent.",
        ingredients: "Une plume de corbeau et de l'encre faite de larmes et de suie.",
        steps: [
            "1. Tendre la plume vers le fantôme en récitant ses crimes supposés.",
            "2. L'encre se matérialise et écrit les confessions de l'esprit sur une surface proche.",
            "3. L'esprit ne peut mentir tant que la plume est pointée vers lui."
        ],
        duration: "Une scène."
    },

    death_form: {
        id: "death_form",
        name: "La Forme de la Mort",
        discipline: "necromancy",
        level: 3,
        description: "Le vampire simule parfaitement la mort — pas simplement l'immobilité du sommeil diurne, mais une mort clinique complète. Son cœur cesse de battre (même pour un vampire, il y a un léger mouvement), sa température chute à celle de l'environnement, et il ne réagit à aucun stimulus. Même un examen médical complet le déclarera mort. C'est le camouflage ultime.",
        ingredients: "Une pièce d'obolus placée sous la langue.",
        steps: [
            "1. S'allonger confortablement et placer la pièce sous la langue.",
            "2. Visualiser son propre enterrement et accepter la mort temporaire.",
            "3. Le corps devient indiscernable d'un cadavre — seule la destruction le réveillerait."
        ],
        duration: "Jusqu'à une nuit entière (le vampire peut se réveiller à volonté)."
    },

    ritual_pneuma: {
        id: "ritual_pneuma",
        name: "Le Rituel du Pneuma",
        discipline: "necromancy",
        level: 3,
        description: "Ce rituel permet de donner temporairement une forme tangible à un fantôme. L'esprit devient visible, solide et capable d'interagir physiquement avec le monde des vivants. Il peut être touché, blessé, et même frapper. Ce pouvoir est souvent utilisé pour interroger les morts ou pour forcer un spectre à se battre.",
        ingredients: "Un miroir brisé en sept morceaux et du sang du Nécromant.",
        steps: [
            "1. Disperser les éclats de miroir autour du fantôme invisible.",
            "2. Verser le sang sur le plus grand éclat en appelant le nom du mort.",
            "3. Le fantôme se matérialise, reflété dans les tessons, puis gagne substance."
        ],
        duration: "Quelques minutes (jusqu'à une demi-heure avec concentration)."
    },

    chalice_drain: {
        id: "chalice_drain",
        name: "Vider le Calice de la Vie",
        discipline: "necromancy",
        level: 3,
        description: "Ce rituel permet de stocker du sang à l'intérieur d'un cadavre sans qu'il ne se gâte ou ne coagule. Le corps mort devient une réserve de vitae parfaitement conservée. Les Giovanni utilisent souvent cette technique pour créer des 'garde-manger' discrets dans leurs cryptes familiales.",
        ingredients: "Un cadavre frais et un entonnoir en os.",
        steps: [
            "1. Ouvrir une veine majeure du cadavre et y insérer l'entonnoir.",
            "2. Verser le sang à stocker tout en récitant les Paroles de Stase.",
            "3. Sceller la plaie — le sang restera frais indéfiniment à l'intérieur du mort."
        ],
        duration: "Permanent (tant que le cadavre n'est pas détruit)."
    },

    // ==========================================
    // NIVEAU 4
    // ==========================================

    // --- THAUMATURGIE NIVEAU 4 ---

    clash_atom: {
        id: "clash_atom",
        name: "Le Chant de l'Entropie",
        discipline: "thaumaturgy",
        level: 4,
        description: "Ce rituel moderne et violent perturbe les champs atomiques d'un objet technologique. Le Thaumaturge surcharge l'objet d'une énergie chaotique, provoquant la fonte des circuits, l'explosion des batteries ou la rupture mécanique instantanée. C'est une arme redoutable contre les équipements de sécurité moderne.",
        ingredients: "Une pile électrique écrasée ou un aimant puissant.",
        steps: [
            "1. Tracer un cercle autour de l'objet ou le pointer avec l'aimant.",
            "2. Libérer l'énergie contenue dans l'ingrédient.",
            "3. L'objet ciblé fume, étincelle et se détruit de l'intérieur."
        ],
        duration: "Instantanée (destruction permanente)."
    },

    heart_stone: {
        id: "heart_stone",
        name: "Le Cœur de Pierre",
        discipline: "thaumaturgy",
        level: 4,
        description: "Le Thaumaturge transforme son propre cœur mort en un bloc de granit impénétrable. Il devient totalement immunisé au pieu (le bois se brise contre le cœur de pierre) et gagne une résistance surnaturelle aux manipulations émotionnelles, mais perd presque toute capacité d'empathie ou de sentiments humains.",
        ingredients: "Un anneau de granit sculpté, de la cire noire, de la terre de cimetière.",
        steps: [
            "1. S'allonger nu sur la terre de cimetière.",
            "2. Poser l'anneau sur la poitrine au-dessus du cœur et le sceller avec la cire chaude.",
            "3. Méditer jusqu'à ce que les battements fantômes du cœur cessent totalement."
        ],
        duration: "Une semaine (ou jusqu'à annulation)."
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
        name: "Le Lien Fantôme",
        discipline: "thaumaturgy",
        level: 4,
        description: "Ce rituel permet de masquer l'existence d'un Lien de Sang aux yeux des autres mages. Le lien reste pleinement actif (la servitude émotionnelle est intacte), mais il ne vibre plus sur le plan astral. Les rituels de détection de lignée ou de lien rendront des résultats négatifs.",
        ingredients: "Quelques gouttes du sang du Regnant (maître) et du Thrall (esclave), mélangées.",
        steps: [
            "1. Mélanger les sangs dans une coupe d'obsidienne.",
            "2. Le Thrall doit boire la mixture volontairement.",
            "3. L'aura du Thrall se lisse, cachant les chaînes mystiques qui l'entravent."
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
        name: "L'Os de Vérité",
        discipline: "thaumaturgy",
        level: 4,
        description: "Enchante un os humain pour qu'il agisse comme un détecteur de mensonge infaillible et douloureux. Quiconque tient cet os et prononce un mensonge — même par omission ou demi-vérité — sent l'os devenir brûlant comme du métal en fusion et noircir ses mains.",
        ingredients: "Un fémur ou un crâne humain lavé à l'acide.",
        steps: [
            "1. Graver des runes de vérité sur l'os.",
            "2. Plonger l'os dans une solution acide pendant une nuit.",
            "3. Remettre l'os à la personne interrogée."
        ],
        duration: "L'enchantement dure une scène."
    },

    ward_kindred: {
        id: "ward_kindred",
        name: "Sceau contre la Lignée de Caïn",
        discipline: "thaumaturgy",
        level: 4,
        description: "La protection ultime pour un refuge. Ce sceau repousse tout vampire (autre que le Thaumaturge) qui tente de le franchir. Le sang de l'intrus se révolte contre lui, causant une agonie paralysante et des dégâts physiques massifs s'il force le passage.",
        ingredients: "Cendres d'un vampire détruit par le soleil ou le feu.",
        steps: [
            "1. Mélanger les cendres avec de l'eau bénite (blasphème rituel).",
            "2. Peindre des sigles complexes sur chaque ouverture du lieu.",
            "3. L'air à l'intérieur semble vibrer d'une puissance statique."
        ],
        duration: "Permanent (tant que les sigles sont intacts)."
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
        name: "Siphon de Vie à Distance",
        discipline: "thaumaturgy",
        level: 4,
        description: "Un rituel prédateur qui permet de se nourrir sans contact physique. Le Thaumaturge utilise un lien sympathique pour drainer la vitae d'une victime éloignée, transférant le sang mystiquement de ses veines vers un récipient (ou directement dans la bouche du sorcier).",
        ingredients: "Une poupée de cire contenant des cheveux ou du sang de la victime.",
        steps: [
            "1. Créer la poupée à l'effigie de la cible.",
            "2. Placer la poupée au-dessus d'un bol.",
            "3. Percer la poupée avec une aiguille d'argent. Le sang commence à couler de la poupée, remplissant le bol."
        ],
        duration: "La durée du rituel (jusqu'à ce que la victime soit vide ou le sorcier rassasié)."
    },

    // --- NÉCROMANCIE NIVEAU 4 ---

    soul_anchor: {
        id: "soul_anchor",
        name: "Balustrade de l'Âme",
        discipline: "necromancy",
        level: 4,
        description: "Ce rituel puissant permet d'ancrer un fantôme à un objet physique de façon permanente. L'esprit ne peut plus s'éloigner de l'objet au-delà d'une certaine distance et y est lié jusqu'à la destruction de l'ancre. Les Nécromants utilisent cette technique pour créer des gardiens spectraux ou pour emprisonner des esprits gênants.",
        ingredients: "Un objet ayant appartenu au défunt et du sang du Nécromant versé dessus.",
        steps: [
            "1. Placer l'objet au centre d'un cercle de cendres humaines.",
            "2. Invoquer le fantôme en son centre et verser le sang sur l'objet.",
            "3. Prononcer les Mots de Lien — l'esprit est aspiré dans l'objet comme dans une prison."
        ],
        duration: "Permanent (jusqu'à destruction de l'objet)."
    },

    cadaver_touch: {
        id: "cadaver_touch",
        name: "Le Baiser du Cadavre",
        discipline: "necromancy",
        level: 4,
        description: "Ce rituel peut être lancé sur autrui, transformant le corps d'une cible en une enveloppe froide et rigide comme celle d'un mort. La victime reste consciente mais paralysée, incapable de bouger ou de parler, sentant le froid de la tombe s'infiltrer dans ses os. C'est une forme de torture appréciée des Giovanni.",
        ingredients: "Un foulard trempé dans du formol, noué autour du cou de la victime.",
        steps: [
            "1. Nouer l'écharpe autour du cou de la cible tout en murmurant les incantations.",
            "2. Souffler un air glacial sur son visage.",
            "3. Le corps se raidit, la peau blanchit — la victime est prisonnière de sa propre chair."
        ],
        duration: "Une nuit (ou jusqu'à ce que l'écharpe soit retirée)."
    },

    death_dance: {
        id: "death_dance",
        name: "Danse de la Mort",
        discipline: "necromancy",
        level: 4,
        description: "Le Nécromant anime simultanément plusieurs cadavres pour leur faire accomplir une tâche simple : porter des objets, creuser, garder un périmètre. Les corps bougent avec une coordination sinistre, leurs mouvements synchronisés comme une danse macabre. Ils ne peuvent pas combattre efficacement, mais leur nombre peut être intimidant.",
        ingredients: "Un bâton de chef d'orchestre trempé dans du formol.",
        steps: [
            "1. Disposer les cadavres en cercle autour de soi.",
            "2. Lever le bâton et donner le premier 'temps' — les corps se lèvent.",
            "3. Diriger leurs mouvements avec le bâton comme un chef d'orchestre funèbre."
        ],
        duration: "Une scène (concentration requise)."
    },

    ghost_blood_bond: {
        id: "ghost_blood_bond",
        name: "Lien du Sang d'Outre-Tombe",
        discipline: "necromancy",
        level: 4,
        description: "Un rituel blasphématoire qui permet de créer un Lien de Sang avec un fantôme. L'esprit devient obsessionnellement dévoué au Nécromant, incapable de lui désobéir ou de lui nuire. C'est une servitude pire que la mort, car elle enchaîne l'âme elle-même à la volonté du vivant.",
        ingredients: "Du sang du Nécromant versé dans les Terres des Ombres (via un portail ou un médium).",
        steps: [
            "1. Ouvrir un passage vers les Terres des Ombres.",
            "2. Offrir trois gouttes de vitae au fantôme ciblé.",
            "3. L'esprit boit l'essence — le lien se forme, aussi solide que pour un mortel."
        ],
        duration: "Permanent (suit les règles normales du Lien de Sang)."
    },

    spectre_shroud: {
        id: "spectre_shroud",
        name: "Suaire du Spectre",
        discipline: "necromancy",
        level: 4,
        description: "Le Nécromant s'enveloppe dans un voile d'énergie spectrale qui le rend invisible aux yeux des vivants. Paradoxalement, il devient parfaitement visible pour les morts et les créatures de l'au-delà. C'est un camouflage parfait pour traverser une foule de mortels tout en communiquant avec les fantômes.",
        ingredients: "Un linceul funéraire porté comme une cape.",
        steps: [
            "1. Draper le linceul sur ses épaules en fermant les yeux.",
            "2. Visualiser sa propre mort et accepter de 'passer de l'autre côté'.",
            "3. Le corps devient translucide pour les vivants mais solide pour les morts."
        ],
        duration: "Une scène."
    },

    // ==========================================
    // NIVEAU 5
    // ==========================================

    // --- THAUMATURGIE NIVEAU 5 ---

    abandon_fetters: {
        id: "abandon_fetters",
        name: "L'Abandon des Chaînes",
        discipline: "thaumaturgy",
        level: 5,
        description: "L'un des rituels les plus précieux et douloureux de la Thaumaturgie. Il permet de briser un Lien de Sang actif en le lavant littéralement hors du corps de la victime. C'est un processus atroce, nécessitant que la victime soit drainée de tout son sang servile avant d'être ressuscitée avec du sang neutre, brisant ainsi l'emprise émotionnelle du Regnant.",
        ingredients: "Le corps du Thrall, vidé jusqu'à la dernière goutte, et une réserve de sang sain suffisante pour le ranimer.",
        steps: [
            "1. Le Thaumaturge ouvre les veines du sujet et recueille le sang maudit.",
            "2. Alors que le sujet entre en torpeur par manque de sang, le mage chante le Mantra de la Libération.",
            "3. Le sang neutre est perfusé (mystiquement ou médicalement) dans le corps vide, 'rebootant' le cœur mort."
        ],
        duration: "Permanent (le lien est détruit, mais un nouveau peut être formé plus tard)."
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
        name: "Le Pacte de Sang Inviolable",
        discipline: "thaumaturgy",
        level: 5,
        description: "Ce rituel crée un contrat contraignant qui punit la trahison par la mort finale. Les signataires s'engagent non seulement sur leur honneur, mais sur leur existence même. Si l'une des parties brise les termes écrits, son sang s'enflamme instantanément dans ses veines, la consumant de l'intérieur.",
        ingredients: "Un parchemin en peau humaine, de l'encre mêlée au sang de tous les signataires.",
        steps: [
            "1. Rédiger les termes exacts du contrat avec une précision juridique.",
            "2. Chaque participant appose sa signature sanglante.",
            "3. Le parchemin devient indestructible tant que le contrat court."
        ],
        duration: "Permanent (jusqu'à accomplissement ou mort)."
    },

    crown_thorns: {
        id: "crown_thorns",
        name: "La Couronne d'Épines",
        discipline: "thaumaturgy",
        level: 5,
        description: "En portant une couronne de ronces enchantée qui s'enfonce dans son crâne, le Thaumaturge gagne une perception divine du danger. Il devient impossible à surprendre, à attaquer dans le dos ou à tromper par des illusions simples. La douleur constante le maintient dans un état d'hyper-lucidité martiale.",
        ingredients: "Une couronne tressée de ronces séchées, trempée dans du sang de guetteur.",
        steps: [
            "1. Placer la couronne sur la tête en acceptant la douleur comme un don.",
            "2. Le sang coule sur le front, mais les yeux s'ouvrent à 360 degrés spirituellement.",
            "3. Le porteur sent toute intention hostile dirigée vers lui."
        ],
        duration: "Tant que le Thaumaturge porte la couronne et endure la douleur."
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
        name: "Création d'Homoncule",
        discipline: "thaumaturgy",
        level: 5,
        description: "Le summum de l'artisanat noir. Le sorcier crée une petite créature vivante à partir de sa propre chair et de son sang pour lui servir d'espion, de gardien ou de familier. L'homoncule est horriblement fidèle, partage une connexion télépathique avec son maître, et préférera fondre plutôt que de le trahir.",
        ingredients: "Un demi-litre de sang du sorcier, un morceau de sa chair (doigt ou lambeau), racine de mandragore.",
        steps: [
            "1. Modeler la forme de la créature (souvent une petite gargouille ou un diablotin) avec la chair et la terre.",
            "2. La nourrir quotidiennement de sang dans un incubateur alchimique pendant un mois.",
            "3. La créature s'éveille en hurlant le nom de son maître."
        ],
        duration: "Permanent (l'homoncule a sa propre durée de vie)."
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
        name: "Cercle de Bannissement des Esprits",
        discipline: "thaumaturgy",
        level: 5,
        description: "Cette protection hermétique interdit l'accès à toute entité spirituelle non incarnée (esprits de la nature, élémentaires, projections astrales). Si elle est tracée autour d'un esprit déjà présent, celui-ci se retrouve piégé à l'intérieur, incapable de traverser la barrière de volonté cristallisée.",
        ingredients: "Une poudre composée de sel gemme pur et de limaille de fer.",
        steps: [
            "1. Tracer le cercle en chantant les anciens pactes de Salomon.",
            "2. Sceller le périmètre avec une volonté inflexible.",
            "3. L'air à la frontière du cercle miroite comme une vague de chaleur."
        ],
        duration: "Permanent (tant que le tracé est intact)."
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
        name: "Le Triomphe de la Pierre",
        discipline: "thaumaturgy",
        level: 5,
        description: "Le Thaumaturge sacrifie temporairement sa mobilité pour une invulnérabilité totale. Il se transforme en une statue de pierre indestructible. Sous cette forme, il ne craint ni le feu, ni le soleil, ni les armes, mais il ne peut ni bouger ni parler. C'est le camouflage ultime ou le dernier recours pour survivre à l'aube en terrain découvert.",
        ingredients: "Aucun, seulement une concentration parfaite et une goutte de son sang sur le front.",
        steps: [
            "1. Se mettre en position (accroupi ou debout).",
            "2. Imaginer ses os devenir granit, sa peau marbre.",
            "3. La transformation est rapide ; la conscience reste éveillée mais lointaine, comme dans un rêve géologique."
        ],
        duration: "Tant que le Thaumaturge maintient sa volonté, ou jusqu'à une date fixée."
    },

    // --- NÉCROMANCIE NIVEAU 5 ---

    soul_contract: {
        id: "soul_contract",
        name: "Contrat de l'Âme",
        discipline: "necromancy",
        level: 5,
        description: "Le Nécromant peut négocier l'achat ou la vente d'une âme mortelle. Ce n'est pas une métaphore — l'âme elle-même est arrachée ou transférée, laissant le corps vivant mais vide de toute substance spirituelle. Les âmes ainsi acquises peuvent être utilisées comme monnaie d'échange avec les démons, stockées pour des rituels futurs, ou simplement collectionnées.",
        ingredients: "Un contrat rédigé en sang sur du parchemin en peau humaine.",
        steps: [
            "1. Rédiger les termes exacts de l'échange avec une précision juridique.",
            "2. Le mortel doit signer volontairement avec son propre sang.",
            "3. Au moment de sa mort, l'âme appartiendra au détenteur du contrat au lieu de passer dans l'au-delà."
        ],
        duration: "Permanent (jusqu'à la mort du signataire)."
    },

    rhadamanthus_judgment: {
        id: "rhadamanthus_judgment",
        name: "Jugement de Rhadamanthe",
        discipline: "necromancy",
        level: 5,
        description: "Le Nécromant invoque l'autorité des anciens juges des morts pour infliger un châtiment terrible à un esprit. L'âme ciblée est tourmentée par des visions de ses propres péchés, déchirée par des forces invisibles, et peut même être définitivement détruite si le Nécromant le souhaite. C'est l'arme ultime contre les fantômes récalcitrants.",
        ingredients: "Une balance en bronze et une plume de corbeau.",
        steps: [
            "1. Placer la plume sur un plateau de la balance, l'âme du fantôme étant symboliquement sur l'autre.",
            "2. Prononcer les crimes de l'esprit — la balance penche.",
            "3. Si elle touche le sol, le fantôme est condamné et subit les tourments proportionnels à ses fautes."
        ],
        duration: "Instantanée (les effets sur l'esprit sont permanents)."
    },

    erebus_gift: {
        id: "erebus_gift",
        name: "Le Don d'Érèbe",
        discipline: "necromancy",
        level: 5,
        description: "Le Nécromant projette son corps astral directement dans l'Outremonde, les Terres des Ombres. Son corps physique reste inerte et vulnérable, mais son esprit peut explorer le royaume des morts, communiquer avec des fantômes inaccessibles, et même visiter les Labyrinthes les plus profonds. C'est un voyage périlleux — certains ne reviennent jamais.",
        ingredients: "Un miroir d'obsidienne et de l'encens de myrrhe.",
        steps: [
            "1. S'allonger devant le miroir et fixer son reflet jusqu'à ce qu'il disparaisse.",
            "2. L'esprit se détache du corps et traverse le miroir comme une porte.",
            "3. Le Nécromant se retrouve dans les Terres des Ombres — le chemin du retour n'est pas garanti."
        ],
        duration: "Jusqu'à ce que le Nécromant choisisse de revenir (ou soit détruit)."
    },

    puppet_possession: {
        id: "puppet_possession",
        name: "Possession de la Marionnette",
        discipline: "necromancy",
        level: 5,
        description: "Le Nécromant abandonne temporairement son propre corps pour transférer son esprit dans un cadavre frais. Il peut alors agir à travers ce nouveau corps comme s'il était le sien, ressentant ce qu'il ressent, voyant ce qu'il voit. Son corps original reste en torpeur, vulnérable. C'est l'infiltration ultime.",
        ingredients: "Un cadavre mort depuis moins de 24 heures et un fil d'argent reliant les deux corps.",
        steps: [
            "1. Allonger son corps à côté du cadavre et les relier par le fil d'argent.",
            "2. Entrer en transe profonde et visualiser son esprit migrant.",
            "3. Ouvrir les yeux du cadavre — le Nécromant le contrôle désormais totalement."
        ],
        duration: "Jusqu'à une nuit (le fil doit rester intact)."
    },

    lich_transcendence: {
        id: "lich_transcendence",
        name: "Transcendance de la Liche",
        discipline: "necromancy",
        level: 5,
        description: "Le rituel ultime de la Nécromancie. Le Nécromant ne se contente plus de communiquer avec les morts — il devient l'un d'entre eux tout en restant parmi les vivants. Son existence se divise entre le monde matériel et les Terres des Ombres, lui permettant de percevoir les deux simultanément. C'est une transformation irréversible qui rapproche le vampire de la non-existence tout en lui offrant un pouvoir inégalé sur les morts.",
        ingredients: "Un phylactère préparé avec trois mois de rituels, le sacrifice d'un innocent, et un morceau de son propre cœur.",
        steps: [
            "1. Extraire un fragment de son propre cœur (processus atrocement douloureux).",
            "2. Le sceller dans le phylactère avec le sang de l'innocent.",
            "3. Mourir. Pour de vrai. Puis revenir — différent, divisé, transcendant."
        ],
        duration: "Permanent (transformation irréversible)."
    },

    // ==========================================
    // RITUELS SUPÉRIEURS (LEV 6+)
    // ==========================================

    armor_efficacy: {
        id: "armor_efficacy",
        name: "L'Armure de la Fureur de Caïn",
        discipline: "thaumaturgy",
        level: 6,
        description: "Le sang du Thaumaturge s'extériorise pour former une armure d'énergie cramoisie translucide. Cette barrière absorbe les impacts balistiques et mystiques avec une efficacité terrifiante. C'est une manifestation visible de la puissance du sang ancien, intimidant autant qu'elle protège.",
        ingredients: "Un diamant noir avalé par le vampire.",
        steps: [
            "1. Avaler le diamant.",
            "2. Crier le défi à la mort.",
            "3. L'aura rouge se solidifie autour du corps."
        ],
        duration: "Une scène de combat."
    },

    ward_demons: {
        id: "ward_demons",
        name: "Anathème contre l'Enfer",
        discipline: "thaumaturgy",
        level: 6,
        description: "Une barrière sacrée (ou profanatrice) qui interdit l'accès aux véritables démons et entités infernales. Contrairement aux protections mineures, celle-ci inflige des Blessures Aggravées directes à toute créature démoniaque qui tente de forcer le passage, brûlant son essence même.",
        ingredients: "Eau bénite corrompue par le sang d'un innocent.",
        steps: [
            "1. Asperger le seuil avec le mélange blasphématoire.",
            "2. Réciter les Noms Perdus de Dieu à l'envers.",
            "3. Une odeur d'ozone et de sainteté inversée imprègne les lieux."
        ],
        duration: "Permanent."
    },

    divine_lineage: {
        id: "divine_lineage",
        name: "La Toile de l'Araignée de Sang",
        discipline: "thaumaturgy",
        level: 7,
        description: "Ce pouvoir presque divin permet au Thaumaturge de remonter la lignée d'un vampire jusqu'au Premier, Caïn lui-même. Il révèle non seulement les noms, mais les péchés majeurs et les serments brisés de chaque ancêtre, donnant au sorcier un levier de chantage cosmique sur toute la lignée.",
        ingredients: "Une goutte de sang d'un Mathusalem (génération 4 ou 5) ou du vampire ciblé si sa génération est faible.",
        steps: [
            "1. Entrer en transe profonde (risque de ne pas en revenir).",
            "2. Naviguer le fleuve de sang à contre-courant.",
            "3. Les secrets de l'histoire vampirique se débloquent."
        ],
        duration: "Instantanée (mais le savoir reste)."
    },

    chain_bloodline: {
        id: "chain_bloodline",
        name: "La Grande Malédiction du Sang",
        discipline: "thaumaturgy",
        level: 8,
        description: "Une arme de destruction massive. En maudissant un vampire, le Thaumaturge transmet l'effet (maladie, combustion, torpeur) à toute sa lignée — ses infants, les infants de ses infants, et même son Sire. C'est ainsi que des lignées entières ont été exterminées en une nuit.",
        ingredients: "Le sang du fondateur de la lignée visée.",
        steps: [
            "1. Mêler le sang cible à du mercure et du poison.",
            "2. Prononcer l'arrêt de mort de la lignée.",
            "3. L'effet se propage instantanément par sympathie sanguine mondiale."
        ],
        duration: "Instantanée (propagation virale)."
    },

    witch_transform: {
        id: "witch_transform",
        name: "L'Apothéose de la Réalité",
        discipline: "thaumaturgy",
        level: 9,
        description: "À ce niveau, la Thaumaturgie cesse d'être de la magie de sang pour devenir de la réalité pure. Le Thaumaturge peut réécrire les lois de la physique et de la nature dans une zone : le soleil ne brûle plus, la gravité s'inverse, le temps s'arrête. Il devient un dieu en son domaine.",
        ingredients: "Le sacrifice de sa propre humanité finale, et une volonté capable de briser le monde.",
        steps: [
            "1. Refuser la réalité telle qu'elle est.",
            "2. Imposer sa propre vérité par la parole.",
            "3. Le monde obéit."
        ],
        duration: "Une scène (ou permanent avec un coût terrible)."
    }
};

export function getRitualById(id) {
    return RITUALS[id];
}

export const getAllRituals = () => {
    if (!RITUALS) {
        console.warn('RITUALS object is missing!');
        return [];
    }
    // Convert object to array AND inject the ID from the key
    return Object.keys(RITUALS).map(key => {
        const ritual = RITUALS[key];
        if (!ritual) return null;
        return {
            id: key,
            ...ritual
        };
    }).filter(r => r !== null && typeof r === 'object');
};
