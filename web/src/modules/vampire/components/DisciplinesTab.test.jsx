import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import DisciplinesTab from './DisciplinesTab';
import { getAvailableDisciplines } from '../../../data/disciplines';

// Mock the data module
vi.mock('../../../data/disciplines', () => ({
    getAvailableDisciplines: vi.fn(),
    MAX_DISCIPLINE_LEVEL: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 10: 10 },
    DISCIPLINES: {
        test_discipline: {
            id: "test_discipline",
            name: "Test Discipline",
            description: "A test discipline",
            powers: Array.from({ length: 10 }, (_, i) => ({
                level: i + 1,
                name: `Power Level ${i + 1}`,
                description: `Description for level ${i + 1}`,
                bloodCost: 1,
                duration: "instant"
            }))
        }
    }
}));

describe('DisciplinesTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    test('renders 5 powers for Neonate (BP 1) even if only level 1 is unlocked', () => {
        // Mock getAvailableDisciplines to return powers up to level 5 (standard view)
        getAvailableDisciplines.mockReturnValue([{
            id: "test_discipline",
            name: "Test Discipline",
            description: "A test discipline",
            powers: Array.from({ length: 5 }, (_, i) => ({
                level: i + 1,
                name: `Power Level ${i + 1}`,
                description: `Description for level ${i + 1}`,
                bloodCost: 1,
                duration: "instant"
            })),
            maxLevel: 1 // Only level 1 accessible
        }]);

        render(<DisciplinesTab clan="test_clan" bloodPotency={1} />);

        // Should see the discipline header
        expect(screen.getByText("Test Discipline")).toBeTruthy();

        // Should see 5 powers listed (locked or unlocked)
        expect(screen.getByText("Power Level 1")).toBeTruthy();
        expect(screen.getByText("Power Level 5")).toBeTruthy();
        expect(screen.queryByText("Power Level 6")).toBeNull();
    });

    test('renders 10 powers for Elder (BP 6+)', () => {
        // Mock getAvailableDisciplines to return powers up to level 10
        getAvailableDisciplines.mockReturnValue([{
            id: "test_discipline",
            name: "Test Discipline",
            description: "A test discipline",
            powers: Array.from({ length: 10 }, (_, i) => ({
                level: i + 1,
                name: `Power Level ${i + 1}`,
                description: `Description for level ${i + 1}`,
                bloodCost: 1,
                duration: "instant"
            })),
            maxLevel: 6 // Access up to level 6
        }]);

        render(<DisciplinesTab clan="test_clan" bloodPotency={6} />);

        expect(screen.getByText("Power Level 1")).toBeTruthy();
        expect(screen.getByText("Power Level 6")).toBeTruthy();
        expect(screen.getByText("Power Level 10")).toBeTruthy();
    });

    test('renders 10 powers for Caine Mode', () => {
        // For Caine mode, we assume the component might use DISCIPLINES directly or getAvailableDisciplines setup
        // The component logic for Caine mode uses Object.values(DISCIPLINES)

        render(<DisciplinesTab isCainMode={true} bloodPotency={10} />);

        expect(screen.getByText("Test Discipline")).toBeTruthy();
        expect(screen.getByText("Power Level 1")).toBeTruthy();
        expect(screen.getByText("Power Level 10")).toBeTruthy();
    });

    test('opens modal when clicking a power card', async () => {
        getAvailableDisciplines.mockReturnValue([{
            id: "test_discipline",
            name: "Test Discipline",
            description: "A test discipline",
            powers: [{
                level: 1,
                name: "Clickable Power",
                description: "Short desc",
                bloodCost: 1,
                duration: "instant"
            }],
            maxLevel: 1
        }]);

        render(<DisciplinesTab clan="test_clan" bloodPotency={1} />);

        // Find the power card by text and click it. 
        // Since there are no modals yet, getByText should return only one or we pick the first if it matches header??
        // actually "Clickable Power" is unique at this point.
        const powerCardName = screen.getByText("Clickable Power");
        fireEvent.click(powerCardName);

        // Expect the modal to appear with specific testid
        const modal = screen.getByTestId("discipline-detail-modal");
        expect(modal).toBeTruthy();

        // Verify Content WITHIN the modal
        expect(within(modal).getByText("Clickable Power")).toBeTruthy();
        expect(within(modal).getByText("Short desc")).toBeTruthy();

        // Test closing logic (e.g. click close button)
        // The close button has aria-label="Fermer"
        const closeButton = within(modal).getByLabelText("Fermer");
        fireEvent.click(closeButton);

        // Wait for modal to disappear
    });

    test('renders full power details in modal', () => {
        getAvailableDisciplines.mockReturnValue([{
            id: "test_discipline",
            name: "Test Discipline",
            description: "A test discipline",
            powers: [{
                level: 3,
                name: "Detailed Power",
                description: "This is a very long description that should appear in the modal.",
                bloodCost: 2,
                duration: "scene"
            }],
            maxLevel: 5
        }]);

        render(<DisciplinesTab clan="test_clan" bloodPotency={5} />);

        const powerCard = screen.getByText("Detailed Power");
        fireEvent.click(powerCard);

        const modal = screen.getByTestId("discipline-detail-modal");

        // Check for specific details
        expect(within(modal).getByText("Detailed Power")).toBeTruthy();
        expect(within(modal).getByText(/This is a very long description/)).toBeTruthy();
        expect(within(modal).getByText("Niveau 3")).toBeTruthy();

        // Check for Icon (Test Discipline doesn't have a mapped icon in the component, defaults to ✦)
        // In our mock, the id is 'test_discipline' which is not in DISCIPLINE_ICONS, so it might pass null or default depending on logic
        // The modal defaults to ✦ if icon is falsy
        expect(within(modal).getAllByText("✦").length).toBeGreaterThan(0);
    });

    test('modal traps focus on mount', async () => {
        // Setup delayed to allow effect to run
        vi.useFakeTimers();

        getAvailableDisciplines.mockReturnValue([{
            id: "animalism", // Using a known ID for icon test as well
            name: "Animalisme",
            powers: [{
                level: 1,
                name: "Focus Power",
                description: "Desc",
                bloodCost: 0,
                duration: "instant"
            }],
            maxLevel: 5
        }]);

        render(<DisciplinesTab clan="gangrel" bloodPotency={1} />);

        fireEvent.click(screen.getByText("Focus Power"));

        // Fast forward timers for the auto-focus effect
        vi.runAllTimers();

        const modal = screen.getByTestId("discipline-detail-modal");
        expect(modal).toBe(document.activeElement);

        // Check icon rendering (Animalism = 🐺)
        expect(within(modal).getAllByText("🐺").length).toBeGreaterThan(0);

        vi.useRealTimers();
    });
});
