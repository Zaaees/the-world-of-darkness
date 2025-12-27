"""
Définition des actions pour augmenter la Puissance du Sang.

Catégories d'actions:
- unique: Actions ne pouvant être faites qu'une seule fois
- clan: Actions spécifiques au clan (répétables)
- resonance: Actions liées à la résonance du sang (répétables)
- vampire_blood: Actions liées au sang vampirique (répétables, cooldown)
- crisis: Actions de crise (répétables)
- torpor: Actions liées à la torpeur

Système de scaling par Puissance du Sang:
- min_bp: Puissance minimum requise (défaut: 1)
- max_bp: Puissance maximum où l'action est visible (défaut: 5)
- scaling: Dict de points par niveau de BP (optionnel)
"""

# Actions uniques (disparaissent après validation)
UNIQUE_ACTIONS = {
    "first_frenzy": {
        "name": "Première danse avec la Bête",
        "description": "Jouer sa première frénésie",
        "points": 5,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "first_kill": {
        "name": "Le goût des cendres",
        "description": "Tuer un mortel pour la première fois",
        "points": 8,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "first_sun": {
        "name": "Baiser du soleil",
        "description": "Survivre à une exposition au soleil",
        "points": 6,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "first_blood_bond": {
        "name": "Le Sang qui lie",
        "description": "Créer son premier Lien de Sang sur quelqu'un",
        "points": 4,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "last_mortal": {
        "name": "Dernier souffle mortel",
        "description": "Revoir un proche de sa vie humaine",
        "points": 5,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 3,  # Après BP 3, trop détaché de l'humanité
    },
    "first_ghoul": {
        "name": "La première servitude",
        "description": "Créer sa première goule",
        "points": 4,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "ghoul_pack": {
        "name": "Maître de la meute",
        "description": "Avoir 3 goules ou plus en même temps",
        "points": 5,
        "category": "unique",
        "min_bp": 1,
        "max_bp": 5,
    },
    "acceptance": {
        "name": "L'Acceptation",
        "description": "Accepter pleinement sa nature de monstre (scène RP significative)",
        "points": 6,
        "category": "unique",
        "min_bp": 3,
        "max_bp": 5,
    },
}

# Actions de clan (répétables, spécifiques au clan)
CLAN_ACTIONS = {
    "nosferatu": {
        "id": "clan_nosferatu",
        "name": "Le secret qui tue",
        "description": "Révéler une information qui change la donne",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "brujah": {
        "id": "clan_brujah",
        "name": "Le poing levé",
        "description": "Défendre une cause ou mener une révolte",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "toreador": {
        "id": "clan_toreador",
        "name": "L'œuvre immortelle",
        "description": "Créer ou inspirer une œuvre marquante",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "ventrue": {
        "id": "clan_ventrue",
        "name": "La couronne de fer",
        "description": "Asseoir son autorité ou écraser un rival",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "tremere": {
        "id": "clan_tremere",
        "name": "Le sang qui commande",
        "description": "Accomplir un rituel de sang significatif",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "malkavian": {
        "id": "clan_malkavian",
        "name": "La vérité dans la folie",
        "description": "Avoir une vision qui s'avère vraie",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "gangrel": {
        "id": "clan_gangrel",
        "name": "L'appel sauvage",
        "description": "Survivre seul en milieu hostile",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "lasombra": {
        "id": "clan_lasombra",
        "name": "L'ombre qui dévore",
        "description": "Éliminer un obstacle par ambition",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "tzimisce": {
        "id": "clan_tzimisce",
        "name": "Chair de ma chair",
        "description": "Modifier sa chair ou défendre son domaine",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "hecata": {
        "id": "clan_hecata",
        "name": "Murmures d'outre-tombe",
        "description": "Communiquer avec les morts ou accomplir un rite funéraire",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "ministry": {
        "id": "clan_ministry",
        "name": "La tentation du serpent",
        "description": "Corrompre quelqu'un ou répandre le vice",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
    "banu_haqim": {
        "id": "clan_banu_haqim",
        "name": "Le jugement du sang",
        "description": "Exécuter un contrat ou punir un coupable",
        "points": 4,
        "min_bp": 1,
        "max_bp": 5,
    },
}

# Actions de résonance (répétables, scaling par BP)
RESONANCE_ACTIONS = {
    "choleric": {
        "id": "resonance_choleric",
        "name": "Sang colérique",
        "description": "Se nourrir sur quelqu'un en pleine rage ou violence",
        "points": 2,
        "category": "resonance",
        "min_bp": 1,
        "max_bp": 3,  # Invisible à partir de BP 4
        "scaling": {1: 2, 2: 2, 3: 1},
    },
    "melancholic": {
        "id": "resonance_melancholic",
        "name": "Sang mélancolique",
        "description": "Se nourrir sur quelqu'un en profond désespoir",
        "points": 2,
        "category": "resonance",
        "min_bp": 1,
        "max_bp": 3,
        "scaling": {1: 2, 2: 2, 3: 1},
    },
    "sanguine": {
        "id": "resonance_sanguine",
        "name": "Sang sanguin",
        "description": "Se nourrir sur quelqu'un en pleine euphorie ou passion",
        "points": 2,
        "category": "resonance",
        "min_bp": 1,
        "max_bp": 3,
        "scaling": {1: 2, 2: 2, 3: 1},
    },
    "phlegmatic": {
        "id": "resonance_phlegmatic",
        "name": "Sang flegmatique",
        "description": "Se nourrir sur quelqu'un en paix absolue ou apathie",
        "points": 2,
        "category": "resonance",
        "min_bp": 1,
        "max_bp": 3,
        "scaling": {1: 2, 2: 2, 3: 1},
    },
    "dyscrasia": {
        "id": "resonance_dyscrasia",
        "name": "Dyscrasie",
        "description": "Se nourrir sur une émotion extrême, à son paroxysme",
        "points": 5,
        "category": "resonance",
        "min_bp": 1,
        "max_bp": 4,  # Même les dyscrasies ne suffisent plus à BP 5
        "scaling": {1: 5, 2: 5, 3: 5, 4: 3},
    },
}

# Actions de sang vampirique (répétables, cooldown mensuel)
VAMPIRE_BLOOD_ACTIONS = {
    "vampire_kiss": {
        "id": "vampire_kiss",
        "name": "Le baiser du prédateur",
        "description": "Boire le sang d'un autre vampire (sans le tuer)",
        "points": 4,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 1,
        "max_bp": 3,  # Trop faible pour un sang ancien
    },
    "elder_blood": {
        "id": "elder_blood",
        "name": "Sang d'Ancien",
        "description": "Vider complètement un vampire de Puissance supérieure (le tuer)",
        "points": 8,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 1,
        "max_bp": 4,
    },
    "vaulderie": {
        "id": "vaulderie",
        "name": "La Vaulderie",
        "description": "Participer à un rituel de partage de sang collectif",
        "points": 5,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 1,
        "max_bp": 5,
    },
    "diablerie": {
        "id": "diablerie",
        "name": "L'Étreinte inversée",
        "description": "Commettre une diablerie sur un vampire de rang supérieur (absorber son âme)",
        "points": 25,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 1,
        "max_bp": 4,
    },
    "methuselah_blood": {
        "id": "methuselah_blood",
        "name": "Sang de Mathusalem",
        "description": "Boire le sang d'un Mathusalem (vampire millénaire, impossible à tuer)",
        "points": 15,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 3,
        "max_bp": 5,
    },
    "wassail_blood": {
        "id": "wassail_blood",
        "name": "Vitae Corrompue",
        "description": "Vider complètement un vampire en Wassail (perdu à la Bête)",
        "points": 10,
        "cooldown_days": 30,
        "category": "vampire_blood",
        "min_bp": 3,
        "max_bp": 5,
    },
}

# Actions de crise (répétables, scaling)
CRISIS_ACTIONS = {
    "near_death": {
        "id": "crisis_near_death",
        "name": "Frôler la Mort Finale",
        "description": "Survivre de justesse à un danger mortel",
        "points": 5,
        "category": "crisis",
        "min_bp": 1,
        "max_bp": 5,
        "scaling": {1: 5, 2: 5, 3: 5, 4: 3, 5: 2},
    },
    "resist_frenzy": {
        "id": "crisis_resist_frenzy",
        "name": "Dompter la Bête",
        "description": "Résister à une frénésie en situation critique",
        "points": 3,
        "category": "crisis",
        "min_bp": 1,
        "max_bp": 4,  # À BP 5, la Bête est domptée
        "scaling": {1: 3, 2: 3, 3: 3, 4: 2},
    },
    "unleash_beast": {
        "id": "crisis_unleash_beast",
        "name": "La Bête déchaînée",
        "description": "Céder à la frénésie avec conséquences assumées",
        "points": 4,
        "category": "crisis",
        "min_bp": 1,
        "max_bp": 4,
        "scaling": {1: 4, 2: 4, 3: 4, 4: 2},
    },
    "final_death_escaped": {
        "id": "crisis_final_death",
        "name": "Mort Finale évitée",
        "description": "Survivre à un staking ou une exposition solaire prolongée",
        "points": 12,
        "category": "crisis",
        "min_bp": 3,
        "max_bp": 5,
    },
}

# Actions de torpeur (uniques par torpeur)
TORPOR_ACTIONS = {
    "enter_torpor": {
        "id": "torpor_enter",
        "name": "Le poids des siècles",
        "description": "Entrer en torpeur volontaire (ellipse temporelle)",
        "points": 10,
        "category": "torpor",
        "min_bp": 1,
        "max_bp": 5,
    },
    "wake_torpor": {
        "id": "torpor_wake",
        "name": "Éveillé",
        "description": "Se réveiller de torpeur",
        "points": 3,
        "category": "torpor",
        "min_bp": 1,
        "max_bp": 5,
    },
}


def get_action_points(action: dict, blood_potency: int) -> int:
    """Calcule les points d'une action selon la Puissance du Sang."""
    if "scaling" in action:
        return action["scaling"].get(blood_potency, action.get("points", 0))
    return action.get("points", 0)


def is_action_available(action: dict, blood_potency: int) -> bool:
    """Vérifie si une action est disponible pour un niveau de BP donné."""
    min_bp = action.get("min_bp", 1)
    max_bp = action.get("max_bp", 5)
    return min_bp <= blood_potency <= max_bp


def get_all_actions():
    """Retourne toutes les actions organisées par catégorie."""
    return {
        "unique": UNIQUE_ACTIONS,
        "clan": CLAN_ACTIONS,
        "resonance": RESONANCE_ACTIONS,
        "vampire_blood": VAMPIRE_BLOOD_ACTIONS,
        "crisis": CRISIS_ACTIONS,
        "torpor": TORPOR_ACTIONS,
    }


def get_action_by_id(action_id: str) -> dict | None:
    """Récupère une action par son ID."""
    # Chercher dans les actions uniques
    if action_id in UNIQUE_ACTIONS:
        return {**UNIQUE_ACTIONS[action_id], "id": action_id, "category": "unique"}

    # Chercher dans les actions de clan
    for clan, action in CLAN_ACTIONS.items():
        if action["id"] == action_id:
            return {**action, "category": "clan", "clan": clan}

    # Chercher dans les actions de résonance
    for key, action in RESONANCE_ACTIONS.items():
        if action["id"] == action_id:
            return action

    # Chercher dans les actions de sang vampirique
    for key, action in VAMPIRE_BLOOD_ACTIONS.items():
        if action["id"] == action_id:
            return action

    # Chercher dans les actions de crise
    for key, action in CRISIS_ACTIONS.items():
        if action["id"] == action_id:
            return action

    # Chercher dans les actions de torpeur
    for key, action in TORPOR_ACTIONS.items():
        if action["id"] == action_id:
            return action

    return None


def get_clan_action(clan: str) -> dict | None:
    """Récupère l'action spécifique à un clan."""
    clan_lower = clan.lower()
    return CLAN_ACTIONS.get(clan_lower)


# Catégories pour l'affichage
CATEGORIES = {
    "unique": {
        "name": "Premières fois",
        "description": "Actions uniques qui disparaissent après accomplissement",
        "icon": "⭐",
    },
    "clan": {
        "name": "Action de Clan",
        "description": "Action thématique liée à votre lignée",
        "icon": "🧛",
    },
    "resonance": {
        "name": "Résonance du Sang",
        "description": "Se nourrir de sang émotionnel",
        "icon": "💉",
    },
    "vampire_blood": {
        "name": "Sang Vampirique",
        "description": "Boire le sang d'autres vampires (cooldown: 1 mois)",
        "icon": "🩸",
    },
    "crisis": {
        "name": "Crises",
        "description": "Moments de confrontation avec la Bête",
        "icon": "⚔️",
    },
    "torpor": {
        "name": "Torpeur",
        "description": "Le long sommeil des anciens",
        "icon": "💀",
    },
}
