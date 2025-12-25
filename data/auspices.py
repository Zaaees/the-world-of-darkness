"""
Augures des Loups-Garous (Auspices)
Basé sur Werewolf: The Apocalypse

Les Augures déterminent le rôle spirituel du Garou selon la phase de lune
sous laquelle il est né et a subi sa Première Transformation.
"""

AUSPICES = {
    "ragabash": {
        "nom": "Ragabash",
        "phase": "Nouvelle Lune",
        "role": "Le Farceur",
        "description": "Questionneur des traditions, espion, éclaireur et humoriste sacré.",
        "messages_rage": {
            "enrage": {
                "titre": "🌑 La Nouvelle Lune Noire se Lève",
                "message": """*Les ombres s'épaississent autour de toi.*

Le Ragabash que tu es sent la Rage monter, mais différemment des autres. Ce n'est pas une fureur aveugle — c'est une colère froide, calculatrice. Le Trickster en toi veut faire PAYER ceux qui t'ont offensé.

**Tu es maintenant Enragé.**

Ta Rage bouillonne sous la surface. Le monde devient un terrain de jeu dangereux où chaque faiblesse de tes ennemis te semble évidente. Tu veux les détruire, mais pas frontalement — tu veux les humilier, les piéger, les voir se détruire eux-mêmes.

*Directive : Tu dois exprimer ta colère par la ruse et la cruauté. Trouve les points faibles, exploite-les. Tu as 2 tours de parole pour te calmer ou nourrir ta Rage.*"""
            },
            "primal": {
                "titre": "🌑 L'OMBRE DU TRICKSTER 🌑",
                "message": """*Le néant de la Nouvelle Lune consume tout.*

**TU AS ATTEINT LA RAGE PRIMALE.**

Le Ragabash en toi s'est transformé en quelque chose de terrifiant. Tu n'es plus le farceur — tu es le Cauchemar, l'Ombre qui Dévore, le Piège Vivant.

Ta forme se tord, tes traits deviennent flous, indistincts. Tu n'es plus vraiment là. Tu es l'obscurité elle-même, et elle a FAIM.

Ceux qui t'ont offensé vont souffrir. Pas rapidement. Pas proprement. Ils vont connaître la terreur absolue de celui qui réalise qu'il ne peut pas voir son prédateur.

*Tu es en RAGE PRIMALE. Le Garou en toi a pris le dessus. Tu n'es plus humain.*"""
            }
        }
    },
    "theurge": {
        "nom": "Theurge",
        "phase": "Croissant de Lune",
        "role": "Le Voyant",
        "description": "Chaman, intermédiaire avec les esprits, guérisseur et mystique.",
        "messages_rage": {
            "enrage": {
                "titre": "🌒 Le Croissant de Lune S'embrase",
                "message": """*Le monde des esprits frémit autour de toi.*

La Rage d'un Theurge n'est pas une simple colère — c'est une tempête spirituelle. Les esprits autour de toi s'agitent, certains fuient, d'autres sont attirés par ta fureur grandissante. L'Umbra elle-même semble se rapprocher.

**Tu es maintenant Enragé.**

Tes yeux voient au-delà du Voile. Les esprits te murmurent des vérités terribles, des moyens de détruire tes ennemis. Tu sens les liens spirituels de chaque être autour de toi — et tu sais comment les BRISER.

*Directive : Exprime ta rage à travers ta connexion spirituelle. Menace de déchaîner les esprits, parle de ce que l'Umbra te révèle sur tes ennemis. Tu as 2 tours de parole pour te calmer ou nourrir ta Rage.*"""
            },
            "primal": {
                "titre": "🌒 LA TEMPÊTE SPIRITUELLE 🌒",
                "message": """*Le Voile se déchire autour de toi.*

**TU AS ATTEINT LA RAGE PRIMALE.**

Le Theurge que tu étais n'existe plus. Tu es devenu un Nexus de Rage, un point de convergence entre le monde physique et l'Umbra. Les esprits hurlent à travers toi.

Ta forme oscille entre chair et esprit. Des entités se pressent autour de toi, certaines terrifiées, d'autres assoiffées de destruction. Tu es leur Avatar, leur Véhicule de Vengeance.

Le monde spirituel et physique ne font plus qu'un autour de toi, et les deux BRÛLENT.

*Tu es en RAGE PRIMALE. Le Garou en toi a pris le dessus. Tu n'es plus humain.*"""
            }
        }
    },
    "philodox": {
        "nom": "Philodox",
        "phase": "Demi-Lune",
        "role": "Le Juge",
        "description": "Médiateur, gardien de la Litanie, juge et arbitre.",
        "messages_rage": {
            "enrage": {
                "titre": "🌓 La Demi-Lune Tranche",
                "message": """*La balance de la justice s'incline dangereusement.*

La Rage d'un Philodox est une chose terrible — c'est la Rage de la Justice Trahie. Quelqu'un a violé la Litanie, brisé l'honneur, commis l'impardonnable. Et tu es le Juge.

**Tu es maintenant Enragé.**

Chaque fibre de ton être crie CONDAMNATION. Tu vois les crimes de ceux qui t'entourent, leurs mensonges, leurs trahisons. La sentence doit être rendue. L'équilibre doit être restauré — par le sang s'il le faut.

*Directive : Juge et condamne. Rappelle leurs crimes à tes ennemis. La Justice des Garous n'est pas clémente. Tu as 2 tours de parole pour te calmer ou nourrir ta Rage.*"""
            },
            "primal": {
                "titre": "🌓 LA LOI DE SANG 🌓",
                "message": """*Le marteau du Jugement s'abat.*

**TU AS ATTEINT LA RAGE PRIMALE.**

Le Philodox que tu étais s'est transformé en Exécuteur Primal. Tu n'es plus le juge qui écoute les arguments — tu es la Sentence Incarnée.

Ta forme massive se dresse, impitoyable, inexorable. Il n'y a plus de clémence en toi. Plus de nuance. Il n'y a que la LOI — la loi ancienne des Garous, écrite dans le sang et les crocs.

Tous ceux qui t'ont offensé sont COUPABLES. Et la sentence est MORT.

*Tu es en RAGE PRIMALE. Le Garou en toi a pris le dessus. Tu n'es plus humain.*"""
            }
        }
    },
    "galliard": {
        "nom": "Galliard",
        "phase": "Lune Gibbeuse",
        "role": "Le Barde",
        "description": "Conteur, gardien de la mémoire, inspirateur et artiste.",
        "messages_rage": {
            "enrage": {
                "titre": "🌔 La Lune Gibbeuse Rugit",
                "message": """*Un chant de guerre s'élève de ta gorge.*

La Rage d'un Galliard est ÉPIQUE. Ce n'est pas une simple colère — c'est le crescendo d'une saga, le climax sanglant d'une histoire qui sera racontée pendant des générations. Et tu en es le héros furieux.

**Tu es maintenant Enragé.**

Les histoires anciennes coulent dans tes veines. Tu sens le poids des légendes, des héros tombés, des batailles glorieuses. Ta Rage veut créer une NOUVELLE légende — écrite dans le sang de tes ennemis.

*Directive : Déclame ta fureur ! Hurle tes défis, proclame tes exploits à venir. Que cette scène devienne une chanson de guerre ! Tu as 2 tours de parole pour te calmer ou nourrir ta Rage.*"""
            },
            "primal": {
                "titre": "🌔 LE CHANT DE GUERRE ULTIME 🌔",
                "message": """*Le hurlement qui sort de ta gorge n'est pas de ce monde.*

**TU AS ATTEINT LA RAGE PRIMALE.**

Le Galliard que tu étais est devenu LÉGENDE VIVANTE. Ton hurlement déchire le ciel, fait trembler la terre. Ce n'est plus une voix — c'est la voix de tous les Garous tombés, de toutes les batailles passées et futures.

Ta forme est terrible, magnifique, ÉPIQUE. Tu es le héros ultime de ta propre saga — et le dernier chapitre sera écrit en SANG.

Les conteurs parleront de ce moment pendant mille ans. Si quelqu'un survit pour le raconter.

*Tu es en RAGE PRIMALE. Le Garou en toi a pris le dessus. Tu n'es plus humain.*"""
            }
        }
    },
    "ahroun": {
        "nom": "Ahroun",
        "phase": "Pleine Lune",
        "role": "Le Guerrier",
        "description": "Champion, protecteur, guerrier né et meneur au combat.",
        "messages_rage": {
            "enrage": {
                "titre": "🌕 La Pleine Lune Brûle",
                "message": """*Le sang de guerrier dans tes veines prend FEU.*

La Rage d'un Ahroun est PURE. Pas de subtilité, pas de calcul — juste la fureur primale du guerrier ultime. Tu as été né sous la Pleine Lune, né pour le COMBAT, et le combat est là.

**Tu es maintenant Enragé.**

Chaque muscle de ton corps se tend pour la violence. Tes crocs s'allongent, tes griffes te démangent. Les ennemis devant toi ne sont plus des personnes — ce sont des CIBLES. Des obstacles à détruire.

*Directive : Menace, grogne, prépare-toi au combat. Tu es un guerrier au bord de l'explosion. Montre-leur ta puissance. Tu as 2 tours de parole pour te calmer ou nourrir ta Rage.*"""
            },
            "primal": {
                "titre": "🌕 LA LUNE DE SANG 🌕",
                "message": """*Le monde devient ROUGE.*

**TU AS ATTEINT LA RAGE PRIMALE.**

L'Ahroun que tu étais n'existe plus. Il n'y a plus qu'un MONSTRE de muscle, de crocs et de griffes. La forme Crinos parfaite, la machine de guerre ultime des Garous.

Tu ne penses plus. Tu ne ressens plus que la RAGE PURE. Chaque être vivant autour de toi est une menace ou une proie. Il n'y a pas de différence.

DÉTRUIRE. DÉCHIRER. DÉVORER.

*Tu es en RAGE PRIMALE. Le Garou en toi a pris le dessus. Tu n'es plus humain.*"""
            }
        }
    }
}


def get_auspice(auspice_name: str) -> dict | None:
    """Récupère les informations d'un augure par son nom (insensible à la casse)."""
    return AUSPICES.get(auspice_name.lower().replace(" ", "_").replace("-", "_"))


def get_rage_message(auspice_name: str, rage_state: str) -> dict | None:
    """
    Récupère le message de rage pour un augure et un état donné.

    Args:
        auspice_name: Nom de l'augure
        rage_state: 'enrage' ou 'primal'

    Returns:
        Dict avec 'titre' et 'message', ou None
    """
    auspice = get_auspice(auspice_name)
    if auspice and rage_state in ("enrage", "primal"):
        return auspice["messages_rage"].get(rage_state)
    return None


def list_auspices() -> list[str]:
    """Retourne la liste des noms d'augures disponibles."""
    return [auspice["nom"] for auspice in AUSPICES.values()]
