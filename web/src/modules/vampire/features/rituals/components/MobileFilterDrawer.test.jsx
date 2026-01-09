import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import MobileFilterDrawer from './MobileFilterDrawer';
import { useGrimoireStore } from '../stores/useGrimoireStore';

// Mock framer-motion to make tests synchronous
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, onKeyDown, tabIndex, role, ...props }) => (
            <div className={className} onClick={onClick} onKeyDown={onKeyDown} tabIndex={tabIndex} role={role} {...props}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
    useReducedMotion: () => false,
}));

describe('MobileFilterDrawer', () => {
    const mockOnClose = vi.fn();

    beforeEach(() => {
        // Reset store state
        act(() => {
            useGrimoireStore.setState({
                rituals: [
                    { id: '1', name: 'Test Ritual 1', discipline: 'Thaumaturgy', level: 1 },
                    { id: '2', name: 'Test Ritual 2', discipline: 'Necromancy', level: 3 },
                ],
                filters: { disciplines: [], levels: [] },
                searchQuery: '',
                viewMode: 'GM',
            });
        });
        mockOnClose.mockClear();
    });

    describe('Visibility', () => {
        test('does not render when isOpen is false', () => {
            render(<MobileFilterDrawer isOpen={false} onClose={mockOnClose} />);
            expect(screen.queryByRole('dialog')).toBeNull();
        });

        test('renders when isOpen is true', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            expect(screen.getByRole('dialog')).toBeDefined();
        });
    });

    describe('Content', () => {
        test('displays filter header title', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            // Get the h2 with id="filter-drawer-title"
            const title = document.getElementById('filter-drawer-title');
            expect(title).toBeDefined();
            expect(title.textContent).toContain('Filtres');
        });

        test('contains disciplines from store', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            expect(screen.getByText('Thaumaturgy')).toBeDefined();
            expect(screen.getByText('Necromancy')).toBeDefined();
        });

        test('contains level buttons', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            expect(screen.getByText('1')).toBeDefined();
            expect(screen.getByText('5')).toBeDefined();
        });
    });

    describe('Close Functionality', () => {
        test('has close button with accessible aria-label', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const closeButton = screen.getByLabelText('Fermer les filtres');
            expect(closeButton).toBeDefined();
        });

        test('calls onClose when close button is clicked', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const closeButton = screen.getByLabelText('Fermer les filtres');
            fireEvent.click(closeButton);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        test('close button has minimum 44x44px touch target', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const closeButton = screen.getByLabelText('Fermer les filtres');
            expect(closeButton.className).toContain('min-w-[44px]');
            expect(closeButton.className).toContain('min-h-[44px]');
        });

        test('calls onClose when Escape key is pressed', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const dialog = screen.getByRole('dialog');
            fireEvent.keyDown(dialog.parentElement, { key: 'Escape' });
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        test('calls onClose when backdrop is clicked', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            // Find backdrop by its class
            const backdrop = document.querySelector('.bg-black\\/60');
            fireEvent.click(backdrop);
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('Touch Targets', () => {
        test('level buttons have minimum 44x44px touch target', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const levelButton = screen.getByText('1').closest('button');
            expect(levelButton.className).toContain('w-11');
            expect(levelButton.className).toContain('h-11');
        });

        test('discipline labels have minimum 44px height', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const disciplineLabel = screen.getByText('Thaumaturgy').closest('label');
            expect(disciplineLabel.className).toContain('min-h-[44px]');
        });
    });

    describe('Accessibility', () => {
        test('has role="dialog" and aria-modal="true"', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const dialog = screen.getByRole('dialog');
            expect(dialog.getAttribute('aria-modal')).toBe('true');
        });

        test('has aria-labelledby pointing to title', () => {
            render(<MobileFilterDrawer isOpen={true} onClose={mockOnClose} />);
            const dialog = screen.getByRole('dialog');
            expect(dialog.getAttribute('aria-labelledby')).toBe('filter-drawer-title');
        });
    });
});
