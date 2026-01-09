import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchInput from './SearchInput';
import { useGrimoireStore } from '../stores/useGrimoireStore';

describe('SearchInput', () => {
    beforeEach(() => {
        act(() => {
            useGrimoireStore.setState({ searchQuery: '' });
        });
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should rely on local state initially', () => {
        render(<SearchInput />);
        const input = screen.getByPlaceholderText('Rechercher un rituel...');
        expect(input).toBeDefined();
        expect(input.value).toBe('');
    });

    it('should debounce search updates', async () => {
        render(<SearchInput />);
        const input = screen.getByPlaceholderText('Rechercher un rituel...');

        // Type 'Fire'
        fireEvent.change(input, { target: { value: 'Fire' } });

        // Immediate check: Store should NOT be updated yet
        expect(useGrimoireStore.getState().searchQuery).toBe('');

        // Fast forward 200ms (debounce is 300ms)
        act(() => {
            vi.advanceTimersByTime(200);
        });
        expect(useGrimoireStore.getState().searchQuery).toBe('');

        // Fast forward another 150ms (total 350ms)
        act(() => {
            vi.advanceTimersByTime(150);
        });

        // Now store should be updated
        expect(useGrimoireStore.getState().searchQuery).toBe('Fire');
    });

    it('should clear input and store when clear button clicked', () => {
        // Setup initial state with value
        act(() => {
            useGrimoireStore.setState({ searchQuery: 'Water' });
        });

        render(<SearchInput />);
        const input = screen.getByPlaceholderText('Rechercher un rituel...');
        // Should sync from store initially
        expect(input.value).toBe('Water');

        const clearBtn = screen.getByRole('button'); // X icon button
        fireEvent.click(clearBtn);

        expect(input.value).toBe('');
        expect(useGrimoireStore.getState().searchQuery).toBe('');
    });
});
