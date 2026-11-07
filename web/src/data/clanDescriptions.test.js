import { describe, it, expect } from 'vitest';
import { CLAN_DESCRIPTIONS, getClanDescription, resolveClanId } from './clanDescriptions';
import { DISCIPLINES, CLAN_DISCIPLINES, CLAN_ALIASES } from './disciplines';
import registry from '../../../data/site_content.json';

const fold = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

// Discipline labels as written on the clan cards → discipline ids. Built from the
// discipline data, plus the older spellings still used on some cards.
const LABEL_TO_ID = Object.fromEntries([
    ...Object.entries(DISCIPLINES).map(([id, d]) => [fold(d.name), id]),
    ['obfuscate', 'obfuscate'], ['chimerstry', 'chimerstry'], ['thanatose', 'thanatosis'],
    ['necromancie', 'necromancy'],
]);

const cardDisciplines = clan => {
    const line = clan.specificities.split('\n').find(l => l.includes('Disciplines'));
    return line.split(':')[1].split(',').map(label => LABEL_TO_ID[fold(label)] ?? `?${label.trim()}`);
};

describe('clan cards', () => {
    it.each(Object.keys(CLAN_DESCRIPTIONS))('%s lists the disciplines the clan actually has', id => {
        const expected = CLAN_DISCIPLINES[CLAN_ALIASES[id] || id];
        expect(expected, id).toBeDefined();
        expect([...cardDisciplines(CLAN_DESCRIPTIONS[id])].sort()).toEqual([...expected].sort());
    });

    it('keeps the editable registry default in sync with each card text', () => {
        const defaults = new Set(Object.values(registry).map(entry => entry.default));
        for (const clan of Object.values(CLAN_DESCRIPTIONS)) {
            expect(defaults.has(clan.specificities), clan.name).toBe(true);
        }
    });
});

describe('getClanDescription', () => {
    it.each([
        ['setite', 'setites'], ['banu_haqim', 'assamites'], ['assamite', 'assamites'],
        ['hecata', 'giovanni'], ['Setites', 'setites'], ['daughters_cacophony', 'daughters_cacophony'],
    ])('finds the card for the stored clan %s', (stored, cardId) => {
        expect(resolveClanId(stored)).toBe(cardId);
        const clan = getClanDescription(stored);
        expect(clan).toBe(CLAN_DESCRIPTIONS[cardId]);
        // Curse shown on the sheet and the transformation placeholder of the character sheet
        expect(clan.bane).toBeTruthy();
        expect(clan.baneDescription).toBeTruthy();
        expect(clan.transformationDescription).toBeTruthy();
    });

    it('returns nothing for an unknown clan', () => {
        expect(getClanDescription('lamia')).toBeUndefined();
        expect(getClanDescription(null)).toBeUndefined();
    });
});
