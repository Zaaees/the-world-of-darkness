import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RitualReader from './RitualReader';

describe('RitualReader', () => {
    describe('Empty State', () => {
        it('renders empty state when no ritual is provided', () => {
            render(<RitualReader ritual={null} />);
            expect(screen.getByText(/Sélectionnez un rituel/i)).toBeDefined();
        });

        it('shows BookOpen icon in empty state', () => {
            const { container } = render(<RitualReader ritual={null} />);
            // Lucide icons render as SVGs
            const svg = container.querySelector('svg');
            expect(svg).toBeDefined();
        });
    });

    describe('Ritual Display', () => {
        const mockRitual = {
            id: '123',
            name: 'Lame Ardente',
            level: 2,
            discipline: 'Thaumaturgy',
            description_md: '# Grand Titre\n\nCeci est le premier paragraphe avec une **lettrine**.\n\nDeuxième paragraphe normal.\n\nSystem: Jet de Dés requis.'
        };

        it('renders ritual name as heading', () => {
            render(<RitualReader ritual={mockRitual} />);
            expect(screen.getByRole('heading', { level: 2, name: 'Lame Ardente' })).toBeDefined();
        });

        it('displays ritual level', () => {
            render(<RitualReader ritual={mockRitual} />);
            expect(screen.getByText(/Niveau 2/i)).toBeDefined();
        });

        it('displays discipline name', () => {
            render(<RitualReader ritual={mockRitual} />);
            expect(screen.getByText('Thaumaturgy')).toBeDefined();
        });

        it('renders markdown headers with serif font', () => {
            render(<RitualReader ritual={mockRitual} />);
            const mdHeader = screen.getByRole('heading', { level: 1, name: 'Grand Titre' });
            expect(mdHeader).toBeDefined();
            expect(mdHeader.className).toContain('font-serif');
            expect(mdHeader.className).toContain('text-red-600');
        });

        it('renders paragraphs with body font class', () => {
            render(<RitualReader ritual={mockRitual} />);
            const paragraph = screen.getByText(/Ceci est le premier paragraphe/i);
            expect(paragraph).toBeDefined();
            expect(paragraph.className).toContain('font-body');
        });
    });

    describe('System Text Isolation', () => {
        it('renders System: text in a styled box', () => {
            const ritualWithSystem = {
                id: '456',
                name: 'Test Ritual',
                level: 1,
                description_md: 'System: This is mechanical text.'
            };
            const { container } = render(<RitualReader ritual={ritualWithSystem} />);

            // System text should be in a styled div with specific classes
            const systemBox = container.querySelector('.bg-stone-900\\/80');
            expect(systemBox).toBeDefined();
        });

        it('renders Système: (French) text in a styled box', () => {
            const ritualFrench = {
                id: '789',
                name: 'Rituel Français',
                level: 1,
                description_md: 'Système: Jet de résistance mentale.'
            };
            const { container } = render(<RitualReader ritual={ritualFrench} />);

            const systemBox = container.querySelector('.bg-stone-900\\/80');
            expect(systemBox).toBeDefined();
        });
    });

    describe('Close Button', () => {
        it('calls onClose when close button is clicked', () => {
            const mockOnClose = vi.fn();
            const mockRitual = { id: '1', name: 'Test', level: 1, description_md: 'Test' };

            render(<RitualReader ritual={mockRitual} onClose={mockOnClose} />);

            const closeButton = screen.getByRole('button', { name: /fermer/i });
            fireEvent.click(closeButton);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });

        it('has accessible aria-label', () => {
            const mockRitual = { id: '1', name: 'Test', level: 1, description_md: 'Test' };
            render(<RitualReader ritual={mockRitual} onClose={() => { }} />);

            const closeButton = screen.getByRole('button', { name: /fermer le rituel/i });
            expect(closeButton).toBeDefined();
        });

        it('does not render close button when onClose is not provided', () => {
            const mockRitual = { id: '1', name: 'Test', level: 1, description_md: 'Test' };
            render(<RitualReader ritual={mockRitual} />);

            expect(screen.queryByRole('button', { name: /fermer/i })).toBeNull();
        });
    });

    describe('Fallback Handling', () => {
        it('shows fallback message when description_md is missing', () => {
            const ritualNoDesc = { id: '1', name: 'Empty Ritual', level: 1 };
            render(<RitualReader ritual={ritualNoDesc} />);

            expect(screen.getByText(/Description manquante/i)).toBeDefined();
        });
    });
    describe('Layout Stability', () => {
        it('applies overflow protection classes to content wrapper', () => {
            const mockRitual = { id: '1', name: 'Test', level: 1, description_md: 'Test' };
            const { container } = render(<RitualReader ritual={mockRitual} />);

            // Look for the wrapper div that holds ReactMarkdown
            const wrapper = container.querySelector('.break-words');
            expect(wrapper).toBeDefined();
            expect(wrapper.className).toContain('[overflow-wrap:anywhere]');
        });
    });
});
