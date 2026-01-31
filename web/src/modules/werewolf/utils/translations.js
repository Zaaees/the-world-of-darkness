/**
 * Utilitaires de traduction pour le module Werewolf.
 * Mappe les valeurs techniques (anglais/enums) vers l'affichage français.
 */

export const TRIBE_TRANSLATIONS = {
    "Black Furies": "Furies Noires",
    "Bone Gnawers": "Rongeurs d'Os",
    "Children of Gaia": "Enfants de Gaïa",
    "Fianna": "Fianna",
    "Get of Fenris": "Rejetons de Fenris",
    "Glass Walkers": "Arpenteurs de Verre",
    "Red Talons": "Griffes Rouges",
    "Shadow Lords": "Seigneurs de l'Ombre",
    "Silent Striders": "Marcheurs Silencieux",
    "Silver Fangs": "Crocs d'Argent",
    "Stargazers": "Astrolâtres",
    "Uktena": "Uktena",
    "Wendigo": "Wendigo",
    "Ronin": "Ronin"
};

export const AUSPICE_TRANSLATIONS = {
    "Ragabash": "Ragabash",
    "Theurge": "Théurge",
    "Philodox": "Philodox",
    "Galliard": "Galliard",
    "Ahroun": "Ahroun"
};

export const BREED_TRANSLATIONS = {
    "Homid": "Homid",
    "Metis": "Métis",
    "Lupus": "Lupus"
};

export const RENOWN_TRANSLATIONS = {
    "glory": "Gloire",
    "Glory": "Gloire",
    "honor": "Honneur",
    "Honor": "Honneur",
    "wisdom": "Sagesse",
    "Wisdom": "Sagesse"
};

/**
 * Traduit une valeur technique vers son affichage français.
 * @param {string} type - Le type de donnée ('tribe', 'auspice', 'breed', 'renown')
 * @param {string} value - La valeur en anglais
 * @returns {string} La valeur traduite ou la valeur originale si non trouvée
 */
export function translate(type, value) {
    if (!value) return "";

    // Si la valeur est déjà en français (ou ne change pas), on la retourne
    // Mais on vérifie quand même dans la map pour normaliser

    let map;
    switch (type) {
        case 'tribe': map = TRIBE_TRANSLATIONS; break;
        case 'auspice': map = AUSPICE_TRANSLATIONS; break;
        case 'breed': map = BREED_TRANSLATIONS; break;
        case 'renown': map = RENOWN_TRANSLATIONS; break;
        default: return value;
    }

    return map[value] || value;
}
