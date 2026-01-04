/**
 * Rituels de Magie du Sang (Thaumaturgie) et de Mort (Nécromancie) V20.
 * Descriptions purement immersives et RP.
 */

export const RITUALS = {
    // --- NIVEAU 1 ---

    // Thaumaturgie Niv 1
    def_havre: {
        id: "def_havre",
        name: "Défense du Havre Sacré",
        discipline: "thaumaturgy",
        level: 1,
        description: "Ce rituel de base protège une pièce ou un refuge contre l'intrusion de la lumière du soleil, même si les fenêtres sont ouvertes. Il empêche également les goules et les esprits faibles d'entrer sans invitation.",
        ingredients: "Un mélange de sang du thaumaturge et de poudre de craie blanche.",
        steps: [
            "1. Trace un cercle ininterrompu avec le sang et la craie sur tous les seuils (portes et fenêtres) de la pièce.",
            "2. Chante l'incantation de protection pendant toute la durée du tracé (environ 30 minutes).",
            "3. Scelle le rituel en apposant ta main ensanglantée au centre de la pièce."
        ],
        duration: "Tant que le thaumaturge reste dans la zone délimitée."
    },

    wake_dead: {
        id: "wake_dead",
        name: "L'Éveil de l'Esprit",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet de détecter si une personne est sous l'emprise d'une puissance surnaturelle (Domination, Présence, Lien de Sang).",
        ingredients: "L'os d'un doigt d'humain mort depuis moins d'un an.",
        steps: [
            "1. Brûle l'os jusqu'à ce qu'il devienne noir.",
            "2. Trace une croix de cendres sur le front de la cible (ou sur un objet lui appartenant).",
            "3. Si la marque s'efface instantanément, la cible est libre. Si elle rougeoie, une magie l'influence."
        ],
        duration: "Instantanée."
    },

    blood_rush: {
        id: "blood_rush",
        name: "Kommunikation",
        discipline: "thaumaturgy",
        level: 1,
        description: "Permet de communiquer à distance avec une personne dont on possède un objet personnel ou une mèche de cheveux.",
        ingredients: "Un objet personnel de la cible, un miroir, de l'eau salée.",
        steps: [
            "1. Plonge l'objet dans un bol d'eau salée devant le miroir.",
            "2. Concentre-toi sur le visage de la cible dans le miroir.",
            "3. Murmure le message. La cible l'entendra comme un chuchotement à son oreille, où qu'elle soit."
        ],
        duration: "Un court message."
    },

    // Nécromancie Niv 1
    call_beacon: {
        id: "call_beacon",
        name: "L'Appel de la Balise",
        discipline: "necromancy",
        level: 1,
        description: "Transforme un objet en 'phare' pour les fantômes, les attirant irrésistiblement vers lui.",
        ingredients: "Un morceau de linceul volé dans un cimetière.",
        steps: [
            "1. Enroule l'objet cible dans le morceau de linceul.",
            "2. Verse une goutte de ta vitae dessus.",
            "3. Murmure 'Vene, spiritus' trois fois.",
            "4. L'objet brille désormais dans le Monde des Morts comme une étoile noire."
        ],
        duration: "Une nuit."
    },

    // --- NIVEAU 2 ---

    // Thaumaturgie Niv 2
    ward_ghoul: {
        id: "ward_ghoul",
        name: "Sceau Contre les Goules",
        discipline: "thaumaturgy",
        level: 2,
        description: "Crée une barrière mystique infranchissable pour les goules et serviteurs de sang. Tout serviteur touchant l'objet ou le seuil marqué ressent une douleur brûlante.",
        ingredients: "Du sang de goule (n'importe laquelle), du sel gris.",
        steps: [
            "1. Mélange le sang de goule avec le sel.",
            "2. Marque l'objet ou le seuil avec le mélange en traçant le sigle de l'interdiction.",
            "3. Le sceau devient invisible après quelques secondes mais reste actif."
        ],
        duration: "Permanent jusqu'à dissipation."
    },

    focus_blood: {
        id: "focus_blood",
        name: "Concentration de Vitae",
        discipline: "thaumaturgy",
        level: 2,
        description: "Rend une petite quantité de sang incroyablement puissante et nourrissante.",
        ingredients: "Une fiole en verre, un ruban rouge.",
        steps: [
            "1. Remplis la fiole de ton propre sang.",
            "2. Noue le ruban autour du goulot en chantant le mantra de concentration.",
            "3. Enterre la fiole pendant une heure.",
            "4. Le sang à l'intérieur compte double pour quiconque le boit."
        ],
        duration: "Permanent (tant que scellé)."
    },

    // Nécromancie Niv 2
    eyes_grave: {
        id: "eyes_grave",
        name: "Les Yeux de la Tombe",
        discipline: "necromancy",
        level: 2,
        description: "Permet de voir en temps réel ce qui se passe autour d'un cadavre que tu as préparé, peu importe la distance.",
        ingredients: "Un cadavre frais, de l'argent en poudre.",
        steps: [
            "1. Saupoudre les yeux du cadavre avec la poudre d'argent.",
            "2. Ferme ses paupières et scelle-les avec ta propre vitae.",
            "3. Médite en te concentrant sur le mort. Tu verras par ses yeux fermés ce qui se passe autour de son corps."
        ],
        duration: "Tant que la concentration est maintenue."
    },

    hand_glory: {
        id: "hand_glory",
        name: "Main de Gloire",
        discipline: "necromancy",
        level: 2,
        description: "Crée un artefact macabre : une main momifiée qui, une fois allumée, endort tous les mortels dans une maison.",
        ingredients: "La main gauche d'un assassin pendu, de la graisse de pendu, des cheveux du mort.",
        steps: [
            "1. Coupe la main gauche du pendu lors d'une nuit sans lune.",
            "2. Fais-la sécher dans du sel et des herbes funéraires pendant deux semaines.",
            "3. Fabrique une bougie avec la graisse et les cheveux.",
            "4. Place la bougie dans la main. Une fois allumée, tous les mortels sous le même toit tombent dans un sommeil comateux."
        ],
        duration: "Tant que la bougie brûle."
    },

    // --- NIVEAU 3 ---

    // Thaumaturgie Niv 3
    shaft_belated: {
        id: "shaft_belated",
        name: "Dissolution Solaire",
        discipline: "thaumaturgy",
        level: 3,
        description: "Transforme un pieu en bois ordinaire en une arme terrifiante qui se fragmente dans le cœur de la victime, rendant son retrait chirurgical nécessaire.",
        ingredients: "Un pieu en bois de chêne, des épines de rose noire.",
        steps: [
            "1. Grave des runes de destruction sur le pieu avec une épine.",
            "2. Enduis le pieu d'une solution caustique alchimique.",
            "3. Laisse le pieu reposer dans l'obscurité totale pendant trois jours.",
            "4. Au moment de l'impact, le bois se comportera comme du verre brisé, envoyant des échardes dans tout le cœur."
        ],
        duration: "Permanent (l'enchantement reste sur l'arme)."
    },

    leach_vitae: {
        id: "leach_vitae",
        name: "Siphon de Vie",
        discipline: "thaumaturgy",
        level: 3,
        description: "Permet de boire du sang à distance sans contact physique, simplement en touchant un objet lié à la victime.",
        ingredients: "Une poupée ou statuette de cire, un lien sympathique (cheveux, sang) de la victime.",
        steps: [
            "1. Incorpore le lien sympathique dans la cire de la poupée.",
            "2. Plonge la poupée dans un bain de sang animal.",
            "3. Concentre ta volonté. Le sang de la vraie victime disparaît de ses veines pour nourrir la poupée, que tu peux ensuite 'boire'."
        ],
        duration: "Une scène (le transfert est lent)."
    },

    // Nécromancie Niv 3
    ritual_pneuma: {
        id: "ritual_pneuma",
        name: "Rituel du Pneuma",
        discipline: "necromancy",
        level: 3,
        description: "Permet de rendre un fantôme solide et tangible dans le monde physique pour quelques minutes.",
        ingredients: "Un miroir brisé, le sang du nécromancien.",
        steps: [
            "1. Invoque le fantôme (via Convocation).",
            "2. Oblige-le à regarder le miroir brisé.",
            "3. Verse ton sang sur les éclats en ordonnant à l'esprit de se 'vêtir de rouge'.",
            "4. Le fantôme gagne une consistance physique sanglante et peut toucher, frapper ou tenir des objets."
        ],
        duration: "Quelques minutes (très coûteux en énergie pour l'esprit)."
    },

    // --- NIVEAU 4 ---

    // Thaumaturgie Niv 4
    heart_stone: {
        id: "heart_stone",
        name: "Cœur de Pierre",
        discipline: "thaumaturgy",
        level: 4,
        description: "Transforme le cœur du sorcier en pierre solide. Il devient immunisé au pieu (qui se brise sur le cœur) et perd presque toute capacité à ressentir des émotions.",
        ingredients: "Un anneau de granit, de la cire de bougie noire, de la terre de cimetière.",
        steps: [
            "1. Allonge-toi nu sur la terre de cimetière.",
            "2. Pose l'anneau de granit sur ton cœur.",
            "3. Fais couler la cire fondue sur l'anneau pour le sceller à ta peau.",
            "4. Médite sur l'absence d'émotion jusqu'à ce que tu ne sentes plus ton cœur (morts) battre du tout.",
            "5. Ton cœur est maintenant dur comme le roc."
        ],
        duration: "Une semaine (ou jusqu'à annulation volontaire)."
    },

    // Nécromancie Niv 4
    cadaver_touch: {
        id: "cadaver_touch",
        name: "Baiser du Cadavre",
        discipline: "necromancy",
        level: 4,
        description: "Rend le nécromancien totalement insensible à la douleur et aux blessures, comme un zombie, mais réduit sa dextérité.",
        ingredients: "Une écharpe de soie froide, trempée dans du formol.",
        steps: [
            "1. Trempe l'écharpe dans le formol.",
            "2. Enroule-la autour de ta propre gorge en serrant fort.",
            "3. Chante les litanies de la préservation.",
            "4. Ta peau devient froide et grise. Tu ne sens plus la douleur, les balles ne te font pas tressaillir, mais tes mouvements deviennent raides."
        ],
        duration: "Une nuit."
    },

    // --- NIVEAU 5 ---

    // Thaumaturgie Niv 5
    blood_contract: {
        id: "blood_contract",
        name: "Contrat de Sang",
        discipline: "thaumaturgy",
        level: 5,
        description: "Crée un pacte inviolable. Si l'un des signataires brise sa parole, il prend feu instantanément ou meurt d'une agonie terrible.",
        ingredients: "Un parchemin en peau humaine, une plume d'oie, le sang des deux parties.",
        steps: [
            "1. Rédige le contrat sur la peau humaine avec la plume.",
            "2. Chaque partie doit signer avec son propre sang.",
            "3. Le thaumaturge scelle le parchemin avec un sceau de cire noire.",
            "4. Le parchemin devient indestructible. Le contrat est enregistré par l'univers lui-même."
        ],
        duration: "Permanent (jusqu'à accomplissement)."
    },

    escape_final: {
        id: "escape_final",
        name: "Évasion vers la Véritable Mort",
        discipline: "thaumaturgy",
        level: 5,
        description: "Permet de simuler sa propre mort finale de manière si convaincante que même la lignée sanguine est coupée.",
        ingredients: "Un pieu en frêne, deux litres de sang de porc, de la poudre d'os.",
        steps: [
            "1. Prépare une pièce secrète où tu te cacheras.",
            "2. Au moment critique, brise le pieu contre ta poitrine et disperse la poudre et le sang de porc.",
            "3. Ton corps tombe en poussière instantanément (en réalité tu deviens invisible et intangible, te téléportant vers ton refuge).",
            "4. Tout le monde, y compris tes sires et progéniture, sent le lien se rompre comme si tu étais mort."
        ],
        duration: "Permanent (tant que tu ne te révèles pas)."
    },

    // Nécromancie Niv 5
    lich_transcendence: {
        id: "lich_transcendence",
        name: "Transcendance de la Liche",
        discipline: "necromancy",
        level: 5,
        description: "Le nécromancien place son âme dans un objet (phylactère). Si son corps est détruit, il peut posséder n'importe quel cadavre récent à proximité pour renaître.",
        ingredients: "Un objet de grande valeur sentimentale, le sacrifice d'un mortel innocent.",
        steps: [
            "1. Tue l'innocent rituellement au-dessus de l'objet.",
            "2. Baigne l'objet dans le sang mélangé (le tien et celui de la victime).",
            "3. Prononce le serment de non-fin.",
            "4. Ton âme réside maintenant dans l'objet. Ton corps est une coquille vide que tu pilotes.",
            "5. Si ton corps meurt, ton esprit file vers l'objet et attend un nouveau corps."
        ],
        duration: "Permanent (tant que l'objet est intact)."
    }
};

export function getRitualById(id) {
    return RITUALS[id];
}
