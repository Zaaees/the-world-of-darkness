/**
 * Vampire V20 Rituals Data
 * Source of Truth for the Grimoire Feature
 *
 * @typedef {Object} Ritual
 * @property {string} id - Unique identifier (kebab-case)
 * @property {string} name - Display Name
 * @property {number} level - Level (1-5)
 * @property {string} discipline - e.g., 'Thaumaturgy', 'Necromancy'
 * @property {string|null} clan_requirement - Specific clan requirement or null
 * @property {string|null} blood_requirement - Specific bloodline requirement or null
 * @property {string} description_md - Markdown content
 */

/**
 * @type {ReadonlyArray<Ritual>}
 */
export const rituals = Object.freeze([
    {
        id: 'defense-of-the-sacred-haven',
        name: 'Defense of the Sacred Haven',
        level: 1,
        discipline: 'Thaumaturgy',
        clan_requirement: null,
        blood_requirement: null,
        description_md: `This ritual prevents sunlight from entering an area within 20 feet (6 meters) of this ritual's casting. A mystical darkness blankets the area, keeping the baneful light of the sun at bay. Sunlight reflects off windows or simply fails to pass through doors or other portals. The caster draws sigils on all the windows and doors, which takes one hour to complete. This ritual lasts as long as the caster stays within the area of effect.`
    },
    {
        id: 'wake-with-morning-freshness',
        name: 'Wake with Morning\'s Freshness',
        level: 1,
        discipline: 'Thaumaturgy',
        clan_requirement: 'Tremere',
        blood_requirement: null,
        description_md: `This ritual allows a vampire to stay awake during the day without penalties. The caster must prepare a concoction of blood and feathers and consume it just before sunrise.`
    },
    {
        id: 'blood-mead',
        name: 'Blood Mead',
        level: 2,
        discipline: 'Necromancy',
        clan_requirement: 'Giovanni',
        blood_requirement: null,
        description_md: `The necromancer can brew a potent draft that allows them to heal aggravated damage more quickly.`
    },
    {
        id: 'incorporeal-passage',
        name: 'Incorporeal Passage',
        level: 3,
        discipline: 'Thaumaturgy',
        clan_requirement: null,
        blood_requirement: null,
        description_md: `The caster becomes immaterial and can pass through solid objects. **System:** The vampire becomes effective _ghost-like_. They are immune to physical attacks but can be harmed by fire, sunlight, and mental attacks.`
    },
    {
        id: 'escape-to-a-true-friend',
        name: 'Escape to a True Friend',
        level: 4,
        discipline: 'Thaumaturgy',
        clan_requirement: null,
        blood_requirement: null,
        description_md: `This ritual allows the caster to teleport to the location of a person who genuinely cares for them. The caster must step into a circle drawn in dirt or chalk and recite the name of the 'true friend' while concentrating on them.`
    },
    {
        id: 'stone-slumber',
        name: 'Stone Slumber',
        level: 5,
        discipline: 'Thaumaturgy',
        clan_requirement: null,
        blood_requirement: 'Visceratika',
        description_md: `The caster can transform their body into solid stone, becoming nearly invulnerable while sleeping during the day. Must know Visceratika to learn this ritual.`
    }
].map(Object.freeze));
