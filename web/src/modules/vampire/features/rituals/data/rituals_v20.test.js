import { describe, it, expect } from 'vitest';
import { rituals } from './rituals_v20';

describe('Rituals Data Integrity', () => {
    it('should be an array of objects', () => {
        expect(Array.isArray(rituals)).toBe(true);
        expect(rituals.length).toBeGreaterThan(0);
    });

    it('should have unique IDs', () => {
        const ids = rituals.map(r => r.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('should not contain empty or malformed keys', () => {
        rituals.forEach(ritual => {
            // Required fields
            expect(ritual.id).toBeDefined();
            expect(typeof ritual.id).toBe('string');
            expect(ritual.name).toBeDefined();
            expect(typeof ritual.name).toBe('string');
            expect(ritual.level).toBeDefined();
            expect(typeof ritual.level).toBe('number');
            expect(ritual.discipline).toBeDefined();
            expect(typeof ritual.discipline).toBe('string');
            expect(ritual.description_md).toBeDefined();
            expect(typeof ritual.description_md).toBe('string');

            // Optional fields structure
            if (ritual.clan_requirement !== null) {
                expect(typeof ritual.clan_requirement).toBe('string');
            }
            if (ritual.blood_requirement !== null) {
                expect(typeof ritual.blood_requirement).toBe('string');
            }
        });

        // Check specifically for kebab-case IDs (basic check)
        rituals.forEach(ritual => {
            expect(ritual.id).toMatch(/^[a-z0-9-]+$/);
        });
    });

    it('should have valid Level range (1-5) and be an integer', () => {
        rituals.forEach(ritual => {
            expect(ritual.level).toBeGreaterThanOrEqual(1);
            expect(ritual.level).toBeLessThanOrEqual(5);
            expect(Number.isInteger(ritual.level)).toBe(true);
        });
    });

    it('should be immutable', () => {
        const ritual = rituals[0];
        try {
            ritual.level = 99;
        } catch (e) {
            // Expected error in strict mode
        }
        expect(ritual.level).toBe(1);
        expect(Object.isFrozen(ritual)).toBe(true);
        expect(Object.isFrozen(rituals)).toBe(true);
    });
});
