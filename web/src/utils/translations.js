export const DISCIPLINES_FR = {
    thaumaturgy: "Thaumaturgie",
    necromancy: "Nécromancie",
    auspex: "Auspex",
    dominate: "Domination",
    obfuscate: "Occultation",
    presence: "Présence",
    potence: "Puissance",
    fortitude: "Résilience",
    celerity: "Célérité",
    protean: "Protéisme",
    animalism: "Animalisme",
    "blood sorcery": "Sorcellerie du Sang",
    oblivion: "Néant"
};

export const getDisciplineName = (key) => {
    if (!key) return "Inconnu";
    const normalizedKey = key.toLowerCase();
    return DISCIPLINES_FR[normalizedKey] || key;
};
