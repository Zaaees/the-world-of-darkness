"""Blood Potency rank names and narrative descriptions, shared by the Discord panel,
the admin commands and the rules. The website keeps the same titles (SheetPage.jsx)."""

BLOOD_POTENCY_INFO = {
    1: {
        "titre": "Sang Fluide",
        "description": "Votre sang est encore proche de celui des mortels.",
    },
    2: {
        "titre": "Sang Vif",
        "description": "Le sang s'épaissit. Seul le sang humain peut vous soutenir.",
    },
    3: {
        "titre": "Sang Fort",
        "description": "Vous êtes un prédateur abouti. La Soif est plus pressante.",
    },
    4: {
        "titre": "Sang Puissant",
        "description": "Votre sang est sombre et visqueux. Il vous faut la chaleur de la vie.",
    },
    5: {
        "titre": "Zénith Sanguin",
        "description": "L'apogée. Pour être rassasié, vous devez tuer ou boire le sang de vampires.",
    },
}

# Dépenses hors disciplines (règlement, section IV) proposées dans le panneau.
STANDARD_VITAE_COSTS = {
    "std:feat": {"label": "Exploit physique surhumain", "cost": 3},
    "std:heal_minor": {"label": "Régénérer une blessure mineure", "cost": 1},
    "std:heal_serious": {"label": "Régénérer une blessure grave", "cost": 3},
    "std:heal_major": {"label": "Régénérer un démembrement", "cost": 9},
}


def get_blood_potency_info(blood_potency: int) -> dict:
    return BLOOD_POTENCY_INFO.get(blood_potency, BLOOD_POTENCY_INFO[1])
