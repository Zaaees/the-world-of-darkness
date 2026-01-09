import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RitualFilter from './RitualFilter';
import { useGrimoireStore } from '../stores/useGrimoireStore';

describe('RitualFilter', () => {
    beforeEach(() => {
        act(() => {
            useGrimoireStore.setState({
                filters: { disciplines: [], levels: [] },
                rituals: [
                    { id: 1, name: 'R1', discipline: 'Thaumaturgy', level: 1 },
                    { id: 2, name: 'R2', discipline: 'Necromancy', level: 2 },
                    { id: 3, name: 'R3', discipline: 'Thaumaturgy', level: 3 }
                ]
            });
        });
    });

    it('should render disciplines and levels', () => {
        render(<RitualFilter />);
        expect(screen.getByText('Thaumaturgy')).toBeDefined();
        expect(screen.getByText('Necromancy')).toBeDefined();
        expect(screen.getByText('1')).toBeDefined();
        expect(screen.getByText('5')).toBeDefined();
        // Search Input check
        expect(screen.getByPlaceholderText('Rechercher un rituel...')).toBeDefined();
    });

    it('should add discipline filter on click', () => {
        render(<RitualFilter />);
        const discipline = screen.getByText('Thaumaturgy');

        fireEvent.click(discipline); // Click label

        const filters = useGrimoireStore.getState().filters;
        expect(filters.disciplines).toContain('Thaumaturgy');
    });

    it('should remove discipline filter on second click', () => {
        render(<RitualFilter />);
        const discipline = screen.getByText('Thaumaturgy');

        fireEvent.click(discipline);
        fireEvent.click(discipline);

        const filters = useGrimoireStore.getState().filters;
        expect(filters.disciplines).not.toContain('Thaumaturgy');
    });

    it('should add level filter on click', () => {
        render(<RitualFilter />);
        const levelBtn = screen.getByText('3');

        fireEvent.click(levelBtn);

        const filters = useGrimoireStore.getState().filters;
        expect(filters.levels).toContain(3);
    });

    it('should clear filters when clear button clicked', () => {
        // Setup initial state
        act(() => {
            useGrimoireStore.getState().addFilter('disciplines', 'Thaumaturgy');
        });

        render(<RitualFilter />);
        const clearBtn = screen.getByText('Effacer');

        fireEvent.click(clearBtn);

        const filters = useGrimoireStore.getState().filters;
        expect(filters.disciplines).toHaveLength(0);
        expect(filters.levels).toHaveLength(0);
    });

    it('should toggle view mode when button clicked', () => {
        render(<RitualFilter />);

        // Initial State (GM)
        const toggleBtn = screen.getByRole('button', { name: /Bibliothèque \(MJ\)/i });
        expect(toggleBtn).toBeDefined();

        // Click to Toggle
        fireEvent.click(toggleBtn);

        // Check Store Update
        expect(useGrimoireStore.getState().viewMode).toBe('PLAYER');

        // Check UI Update (re-render)
        expect(screen.getByText('Grimoire (Joueur)')).toBeDefined();
    });
});
