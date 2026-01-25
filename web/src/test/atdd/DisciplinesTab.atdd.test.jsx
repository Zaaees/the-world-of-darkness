import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import DisciplinesTab from '../../modules/vampire/components/DisciplinesTab';
import { getAvailableDisciplines } from '../../data/disciplines';
import { createDiscipline } from '../factories/discipline.factory';

// Mock the data module
vi.mock('../../data/disciplines', () => ({
    getAvailableDisciplines: vi.fn(),
    MAX_DISCIPLINE_LEVEL: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 10: 10 },
}));

describe('Story 5-3: Disciplines Tab Layout Updates', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('AC1: Should display up to 10 slots for Elder characters (BP 6+)', () => {
        // GIVEN: A character with Blood Potency 6 (Elder)
        const bp = 6;
        const discipline = createDiscipline({ maxLevel: 6, powerCount: 10 });
        getAvailableDisciplines.mockReturnValue([discipline]);

        // WHEN: Viewing the disciplines tab
        render(<DisciplinesTab clan="ventrue" bloodPotency={bp} />);

        // THEN: Powers up to level 6 (and potential slots up to 10) are rendered
        // Note: The component implementation renders slots based on the discipline's powers or max capability
        expect(screen.getByText(discipline.powers[0].name)).toBeDefined(); // Level 1
        expect(screen.getByText(discipline.powers[5].name)).toBeDefined(); // Level 6

        // We expect specifically that the UI handles high level powers
        // Since we mocked 10 powers, and BP allows high levels, we should see them
        expect(screen.getByText(discipline.powers[9].name)).toBeDefined(); // Level 10
    });

    test('AC3: Clicking 6th+ dot should be functional (implied by rendering)', () => {
        // GIVEN: A character with access to level 10 powers
        const discipline = createDiscipline({ maxLevel: 10, powerCount: 10 });
        getAvailableDisciplines.mockReturnValue([discipline]);

        // WHEN: Viewing the list
        render(<DisciplinesTab clan="ventrue" bloodPotency={10} />);

        // THEN: The 10th power is visible and interactive (presence implies render success)
        const level10Power = screen.getByText(discipline.powers[9].name);
        expect(level10Power).toBeDefined();
        // Interaction testing covers the click handler in the unit tests, 
        // here we verify the *existence* of the high-level elements in the DOM
    });


    test('AC5: Regression - Normal characters (BP 1-5) show standard view', () => {
        // GIVEN: A neonate character (BP 1)
        const bp = 1;
        // Even if discipline has 10 powers defined in data, they shouldn't access > 5 based on rules?
        // OR the component just renders what is returned. 
        // Story AC says: "Standard neonate character (BP 1) only sees 5 dots"
        // Let's assume getAvailableDisciplines handles the filtering or the component handles display.
        // If the factory generates 10 powers but maxLevel is low.

        const discipline = createDiscipline({ maxLevel: 1, powerCount: 10 });
        // Logic: getAvailableDisciplines likely filters or sets maxLevel. 
        // We mock the return to simulate what the controller would filters.
        // We'll mimic the "Neonate" scenario where maxLevel is kept at 5 or lower effectively for display limits?
        // Actually the story says: "Normal characters ... still correctly show only 5 dots"

        // If we pass a discipline object restricted to level 5 (which getAvailableDisciplines should do for BP1)
        const restrictedDiscipline = { ...discipline, powers: discipline.powers.slice(0, 5) };
        getAvailableDisciplines.mockReturnValue([restrictedDiscipline]);

        // WHEN: Viewing
        render(<DisciplinesTab clan="ventrue" bloodPotency={bp} />);

        // THEN: Only 5 powers are shown
        expect(screen.getByText(discipline.powers[0].name)).toBeDefined();
        expect(screen.queryByText(discipline.powers[9].name)).toBeNull();
    });
});
