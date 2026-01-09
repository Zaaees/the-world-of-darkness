import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RitualCard from './RitualCard';

describe('RitualCard', () => {
    const mockRitual = {
        id: 'ritual-001',
        name: 'Promenade du Sang',
        level: 3,
        discipline: 'Thaumaturgie',
        type: 'Rituel',
        description_md: 'test desc'
    };

    const mockStyle = { height: 50, width: '100%' };

    it('renders ritual information correctly', () => {
        render(<RitualCard ritual={mockRitual} style={mockStyle} />);

        expect(screen.getByText('Promenade du Sang')).toBeDefined();
        expect(screen.getByText('Niveau 3')).toBeDefined();
        expect(screen.getByText('Thaumaturgie')).toBeDefined();
    });

    it('renders correctly', () => {
        render(<RitualCard ritual={mockRitual} />);
        expect(screen.getByText('Promenade du Sang')).toBeDefined();
    });

    describe('Animation Styles', () => {
        it('has hover scale and shadow transition classes', () => {
            const { container } = render(<RitualCard ritual={mockRitual} />);
            const cardInner = container.querySelector('.group');

            expect(cardInner.className).toContain('hover:scale-[1.02]');
            expect(cardInner.className).toContain('hover:shadow-lg');
            expect(cardInner.className).toContain('hover:border-red-700/50');
        });

        it('has active/pressed scale feedback class', () => {
            const { container } = render(<RitualCard ritual={mockRitual} />);
            const cardInner = container.querySelector('.group');

            expect(cardInner.className).toContain('active:scale-[0.98]');
        });

        it('has CSS transition for smooth animations', () => {
            const { container } = render(<RitualCard ritual={mockRitual} />);
            const cardInner = container.querySelector('.group');

            expect(cardInner.className).toContain('transition-all');
            expect(cardInner.className).toContain('duration-200');
        });

        it('respects reduced motion preference with motion-reduce classes', () => {
            const { container } = render(<RitualCard ritual={mockRitual} />);
            const cardInner = container.querySelector('.group');

            expect(cardInner.className).toContain('motion-reduce:hover:scale-100');
            expect(cardInner.className).toContain('motion-reduce:active:scale-100');
        });
    });
});
