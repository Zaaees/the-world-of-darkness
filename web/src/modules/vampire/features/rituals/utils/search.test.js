import { describe, it, expect, beforeEach } from 'vitest';
import { searchRituals } from './search';

// Mock data
const mockRituals = [
    { id: '1', name: 'Thaumaturgy Ritual', discipline: 'Thaumaturgy', description_md: 'A powerful blood magic ritual.' },
    { id: '2', name: 'Necromancy Ritual', discipline: 'Necromancy', description_md: 'Speaking with the dead.' },
    { id: '3', name: 'Ward against Ghouls', discipline: 'Thaumaturgy', description_md: 'Protects a haven from ghouls.' },
    { id: '4', name: 'Defense of the Sacred Haven', discipline: 'Thaumaturgy', description_md: 'Sunlight cannot enter.' }
];

describe('searchRituals', () => {
    beforeEach(() => {
        // No setup needed
    });

    it('should return all items if query is empty', () => {
        const results = searchRituals(mockRituals, '');
        expect(results).toHaveLength(4);
    });

    it('should find exact matches', () => {
        const results = searchRituals(mockRituals, 'Necromancy');
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Necromancy Ritual');
    });

    it('should find partial matches', () => {
        const results = searchRituals(mockRituals, 'Haven');
        expect(results.length).toBeGreaterThanOrEqual(2);
        // Expect "Defense of the Sacred Haven" and maybe "Ward against Ghouls" if description works or "Haven" is in both
    });

    it('should handle typos (fuzzy search)', () => {
        const results = searchRituals(mockRituals, 'Tomaturgy'); // Misspelled Thaumaturgy
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].discipline).toBe('Thaumaturgy');
    });

    it('should search in description_md', () => {
        const results = searchRituals(mockRituals, 'Sunlight');
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('Defense of the Sacred Haven');
    });

    it('should return empty array if no matches found', () => {
        const results = searchRituals(mockRituals, 'Xylophone');
        expect(results).toHaveLength(0);
    });
});
