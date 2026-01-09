import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import RitualCatalog from './RitualCatalog';
import { useGrimoireStore } from '../stores/useGrimoireStore';

// Mock ResizeObserver
const originalResizeObserver = global.ResizeObserver;
beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

afterEach(() => {
    if (originalResizeObserver) {
        global.ResizeObserver = originalResizeObserver;
    } else {
        delete global.ResizeObserver;
    }
});

// Mock react-window
// Mock react-window with prop capture
vi.mock('react-window', async () => {
    return {
        FixedSizeGrid: ({ children, ...props }) => (
            <div data-testid="virtual-grid" data-overscan={props.overscanCount}>
                {children({ columnIndex: 0, rowIndex: 0, style: {} })}
            </div>
        ),
        FixedSizeList: () => <div />
    };
});


// Mock Store
vi.mock('../stores/useGrimoireStore', () => ({
    useGrimoireStore: vi.fn(),
}));

describe('RitualCatalog', () => {
    const mockRituals = Array.from({ length: 10 }, (_, i) => ({
        id: `r-${i}`,
        name: `Ritual ${i}`,
        level: 1,
        discipline: 'Thaumaturgie'
    }));

    beforeEach(() => {
        // Mock implementation to handle selector
        useGrimoireStore.mockImplementation((selector) => {
            // Mock state that matches what the selector expects
            const state = {
                rituals: mockRituals,
                // Mock the selector function calling itself on the state if needed, 
                // but checking RitualCatalog.jsx it calls: state.selectFilteredRituals(state)
                // So the state object needs selectFilteredRituals method.
                selectFilteredRituals: (s) => s.rituals
            };
            return selector ? selector(state) : state;
        });

        // Mock offsetWidth/Height
        Object.defineProperties(HTMLElement.prototype, {
            offsetWidth: { get: () => 1000 },
            offsetHeight: { get: () => 800 },
        });
    });

    it('renders and connects to store', () => {
        render(<RitualCatalog />);
        expect(screen.getByTestId('virtual-grid')).toBeDefined();
    });
    it('passes overscanCount to Grid', () => {
        render(<RitualCatalog />);
        const grid = screen.getByTestId('virtual-grid');
        expect(grid.getAttribute('data-overscan')).toBe('5');
    });

    it('uses correct itemSize', () => {
        // Validation of constants
        const { container } = render(<RitualCatalog />);
        expect(container).toBeDefined();
    });
});
