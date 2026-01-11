
import { describe, it, expect } from 'vitest';
import { MAX_DISCIPLINE_LEVEL, getAvailableDisciplines } from './disciplines';

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
});
