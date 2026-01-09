/**
 * Checks if a character meets the requirements to learn a ritual.
 * 
 * @param {Object} character - The character trying to learn.
 * @param {string} character.clan - Character's clan.
 * @param {Object} character.disciplines - Map of discipline names to levels. e.g. { 'Thaumaturgy': 2 }
 * @param {Object} ritual - The ritual to learn.
 * @param {string} ritual.discipline - Discipline required.
 * @param {number} ritual.level - Level required.
 * @param {string|null} ritual.clan_requirement - Specific clan required (optional).
 * 
 * @returns {Object} Result object { allowed: boolean, reason?: string }
 */
export const canLearnRitual = (character, ritual) => {
    // 1. Check Clan Requirement
    if (ritual.clan_requirement) {
        if (character.clan !== ritual.clan_requirement) {
            return {
                allowed: false,
                reason: `Clan requis: ${ritual.clan_requirement}`
            };
        }
    }

    // 2. Check Discipline Level
    const requiredLevel = ritual.level;
    const requiredDiscipline = ritual.discipline;
    const charLevel = character.disciplines?.[requiredDiscipline] || 0;

    if (charLevel < requiredLevel) {
        return {
            allowed: false,
            reason: 'Niveau de discipline insuffisant'
        };
    }

    // Success
    return { allowed: true };
};
