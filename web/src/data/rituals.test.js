import { describe, it, expect } from 'vitest';
import { RITUALS, getAllRituals } from './rituals';

describe('Rituals Master Data', () => {
    it('RITUALS should be an object', () => {
        expect(typeof RITUALS).toBe('object');
        expect(RITUALS).not.toBeNull();
    });

    it('getAllRituals should return an array of ritual objects', () => {
        const allRituals = getAllRituals();
        expect(Array.isArray(allRituals)).toBe(true);
        expect(allRituals.length).toBeGreaterThan(0);

        allRituals.forEach(ritual => {
            expect(ritual).toHaveProperty('id');
            expect(ritual).toHaveProperty('name');
            expect(ritual).toHaveProperty('level');
            expect(ritual).toHaveProperty('discipline');
        });
    });

    it('should contain consolidated rituals', () => {
        // Critical rituals migrated from v20 or ensured present
        expect(RITUALS).toHaveProperty('wake_morning_freshness');
        expect(RITUALS).toHaveProperty('blood_mead');
        expect(RITUALS).toHaveProperty('stone_victory');
    });

    it('stone_victory should have blood_requirement: Visceratika', () => {
        expect(RITUALS.stone_victory.blood_requirement).toBe('Visceratika');
    });

    it('wake_morning_freshness should be Tremere exclusive', () => {
        expect(RITUALS.wake_morning_freshness.clan_requirement).toBe('Tremere');
    });

    it('ids should match keys', () => {
        Object.entries(RITUALS).forEach(([key, value]) => {
            expect(value.id).toBe(key);
        });
    });
});
