
import { describe, it, expect } from 'vitest';
import { DISCIPLINES, MAX_DISCIPLINE_LEVEL, getAvailableDisciplines } from './disciplines';

describe('Disciplines Data Logic', () => {

    describe('MAX_DISCIPLINE_LEVEL', () => {
        it('should map BP 1-5 correctly to Levels 1-5', () => {
            expect(MAX_DISCIPLINE_LEVEL[1]).toBe(1);
            expect(MAX_DISCIPLINE_LEVEL[2]).toBe(2);
            expect(MAX_DISCIPLINE_LEVEL[3]).toBe(3);
            expect(MAX_DISCIPLINE_LEVEL[4]).toBe(4);
            expect(MAX_DISCIPLINE_LEVEL[5]).toBe(5);
        });

        it('should map BP 6-10 correctly to Levels 6-10', () => {
            expect(MAX_DISCIPLINE_LEVEL[6]).toBe(6);
            expect(MAX_DISCIPLINE_LEVEL[7]).toBe(7);
            expect(MAX_DISCIPLINE_LEVEL[8]).toBe(8);
            expect(MAX_DISCIPLINE_LEVEL[9]).toBe(9);
            expect(MAX_DISCIPLINE_LEVEL[10]).toBe(10);
        });
    });

    describe('getAvailableDisciplines', () => {
        it('should return empty array for invalid inputs', () => {
            expect(getAvailableDisciplines(null, 1)).toEqual([]);
            expect(getAvailableDisciplines('invalid_clan', 1)).toEqual([]);
        });

        it('should return clan disciplines with maxLevel cap for BP 1', () => {
            const disciplines = getAvailableDisciplines('brujah', 1);
            expect(disciplines).toHaveLength(3);
            disciplines.forEach(disc => {
                expect(disc.maxLevel).toBe(1);
                expect(disc.powers.length).toBeGreaterThan(0);
                expect(disc.powers.every(p => p.level <= 1)).toBe(true);
            });
        });

        it('should return clan disciplines with maxLevel cap for BP 5', () => {
            const disciplines = getAvailableDisciplines('brujah', 5);
            disciplines.forEach(disc => {
                expect(disc.maxLevel).toBe(5);
                expect(disc.powers.every(p => p.level <= 5)).toBe(true);
            });
        });

        it('should return clan disciplines with maxLevel cap for BP 10', () => {
            const disciplines = getAvailableDisciplines('brujah', 10);
            disciplines.forEach(disc => {
                expect(disc.maxLevel).toBe(10);
                expect(disc.powers.some(p => p.level > 5)).toBe(true);
            });
        });

        it('should cap maxLevel at 10 for BP > 10 (e.g. Caine)', () => {
            const disciplines = getAvailableDisciplines('cain', 15);
            disciplines.forEach(disc => {
                expect(disc.maxLevel).toBe(10);
                expect(disc.powers.length).toBeGreaterThan(0);
                // Should have access to level 10 powers if they exist
            });
        });

        it('should default to maxLevel 1 if BP is missing or invalid', () => {
            // Updated behavior: Falls back to Safe Mode (Level 1) instead of Level 2
            const disciplines = getAvailableDisciplines('brujah', undefined);
            disciplines.forEach(disc => {
                expect(disc.maxLevel).toBe(1);
                expect(disc.powers.every(p => p.level <= 1)).toBe(true);
            });
        });
    });

    describe('clan aliases', () => {
        it.each([
            ['setite', 'serpentis'],
            ['banu_haqim', 'quietus'],
            ['daughters_cacophony', 'melpominee'],
            ['hecata', 'necromancy'],
        ])('%s gets its clan disciplines', (clan, expected) => {
            const ids = getAvailableDisciplines(clan, 1).map(d => d.id);
            expect(ids).toContain(expected);
        });

        it('gives Giovanni the V20 disciplines', () => {
            const ids = getAvailableDisciplines('giovanni', 1).map(d => d.id);
            expect(ids).toEqual(['dominate', 'necromancy', 'potence']);
        });
    });
});

// Toutes les disciplines suivent V20, adaptées au jeu narratif, du niveau 1 au niveau 10.
const REWRITTEN = Object.keys(DISCIPLINES);
const DURATIONS = ['instant', 'scene', 'prolonged', 'permanent'];
const BLOOD_COSTS = [0, 1, 3, 9, 10];

describe.each(REWRITTEN)('discipline %s (V20, 1 à 10)', (id) => {
    const discipline = DISCIPLINES[id];
    const powers = discipline.powers;

    it('covers levels 1 to 10, one power at 1-5 and 10, at least one at 6-9', () => {
        for (let level = 1; level <= 10; level++) {
            const count = powers.filter(p => p.level === level).length;
            if (level <= 5 || level === 10) expect(count, `niveau ${level}`).toBe(1);
            else expect(count, `niveau ${level}`).toBeGreaterThanOrEqual(1);
        }
        expect(powers.every(p => p.level >= 1 && p.level <= 10)).toBe(true);
    });

    it('lists powers in level order', () => {
        const levels = powers.map(p => p.level);
        expect(levels).toEqual([...levels].sort((a, b) => a - b));
    });

    it('gives every power a unique id, a valid duration and a valid blood cost', () => {
        const ids = powers.map(p => p.id);
        expect(ids.every(Boolean)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
        powers.forEach(p => {
            expect(DURATIONS, p.id).toContain(p.duration);
            expect(BLOOD_COSTS, p.id).toContain(p.bloodCost);
        });
    });

    it('keeps descriptions narrative: no numbers, reasonable length', () => {
        powers.forEach(p => {
            expect(p.description, p.id).not.toMatch(/\d/);
            expect(p.description.length, p.id).toBeGreaterThanOrEqual(300);
            expect(p.description.length, p.id).toBeLessThanOrEqual(1000);
        });
    });
});
