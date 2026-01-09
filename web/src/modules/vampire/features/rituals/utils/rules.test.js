import { describe, it, expect } from 'vitest';
import { canLearnRitual } from './rules';

describe('canLearnRitual', () => {
    // Mock Rituals
    const ritualLevel1 = { id: 1, level: 1, discipline: 'Thaumaturgy', clan_requirement: null };
    const ritualLevel3 = { id: 2, level: 3, discipline: 'Necromancy', clan_requirement: null };
    const ritualTremere = { id: 3, level: 1, discipline: 'Thaumaturgy', clan_requirement: 'Tremere' };

    // Mock Characters
    const charNewbie = {
        name: 'Neonate',
        clan: 'Brujah',
        disciplines: { 'Thaumaturgy': 0 }
    };

    const charTremere = {
        name: 'Acolyte',
        clan: 'Tremere',
        disciplines: { 'Thaumaturgy': 2 }
    };

    const charNecromancer = {
        name: 'Gio',
        clan: 'Giovanni',
        disciplines: { 'Necromancy': 3 }
    };

    it('should allow learning if requirements are met', () => {
        // Char has Thaumaturgy 2, Ritual is Level 1 -> OK
        expect(canLearnRitual(charTremere, ritualLevel1).allowed).toBe(true);

        // Giovanni has Necromancy 3, Ritual is Level 3 -> OK
        expect(canLearnRitual(charNecromancer, ritualLevel3).allowed).toBe(true);
    });

    it('should fail if discipline level is too low', () => {
        // Newbie has Thaumaturgy 0, Ritual is Level 1 -> Fail
        expect(canLearnRitual(charNewbie, ritualLevel1).allowed).toBe(false);
    });

    it('should fail if clan requirement is not met', () => {
        // Ritual requires Tremere, Char is Brujah -> Fail
        expect(canLearnRitual(charNewbie, ritualTremere).allowed).toBe(false);
    });

    it('should allow if clan requirement is met', () => {
        // Ritual requires Tremere, Char is Tremere -> OK
        expect(canLearnRitual(charTremere, ritualTremere).allowed).toBe(true);
    });

    it('should handle optional clan requirement (null)', () => {
        expect(canLearnRitual(charTremere, ritualLevel1).allowed).toBe(true);
    });

    it('should return false validation object if we want detailed failure reasons? (Refactor idea later, keeping simple boolean for now based on AC)', () => {
        // Current requirement is just check, but modal needs details. 
        // For now, let's assume the function returns a result object or we have a separate function.
        // The story implies "checks requirements".
        // Let's stick to boolean for the basic `canLearn` check, or maybe return { allowed: boolean, reason: string }.
        // Re-reading AC: "Confirmation Modal appears stating 'Pré-requis non remplis' and detailing the mismatch."
        // So we DO need the reason.
    });

    it('should return detailed failure reason', () => {
        const resultLowLevel = canLearnRitual(charNewbie, ritualLevel1);
        expect(resultLowLevel).toEqual({ allowed: false, reason: 'Niveau de discipline insuffisant' });

        const resultWrongClan = canLearnRitual(charNewbie, ritualTremere);
        expect(resultWrongClan).toEqual({ allowed: false, reason: 'Clan requis: Tremere' });

        const resultSuccess = canLearnRitual(charTremere, ritualLevel1);
        expect(resultSuccess).toEqual({ allowed: true });
    });
});
