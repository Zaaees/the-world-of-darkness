import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GiftsPage } from './GiftsPage';
import { createGift } from '../../../../test/factories/gift-factory';

// Mock the GiftCard component to avoid testing child logic again
vi.mock('../../components/GiftCard/GiftCard', () => ({
    GiftCard: ({ gift, isUnlocked }: any) => (
        <div data-testid={`gift-card-${gift.id}`}>
            {gift.name_fr} - {isUnlocked ? 'Unlocked' : 'Locked'}
        </div>
    ),
}));

// Mock useUserRoles
vi.mock('../../../../core/hooks/useUserRoles', () => ({
    useUserRoles: () => ({
        discordUser: { id: '123' },
        guildId: '456',
        isAuthenticated: true
    }),
    default: () => ({
        discordUser: { id: '123' },
        guildId: '456',
        isAuthenticated: true
    })
}));

describe('GiftsPage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders grid of gifts sorted by status (Unlocked first)', async () => {
        // GIVEN: A mix of unlocked and locked gifts
        const unlockedGift = createGift({ id: 'g1', name_fr: 'Unlocked Gift', level: 1 });
        const lockedGift = createGift({ id: 'g2', name_fr: 'Locked Gift', level: 1 });

        // WHEN: Page renders
        render(<GiftsPage gifts={[lockedGift, unlockedGift]} unlockedIds={['g1']} />);

        // THEN: Unlocked gift appears before Locked gift (R-505)
        const cards = screen.getAllByTestId(/^gift-card-/);
        expect(cards[0]).toHaveTextContent('Unlocked Gift');
        expect(cards[1]).toHaveTextContent('Locked Gift');
    });

    it('filters gifts by level', async () => {
        // GIVEN: Gifts of different levels
        const level1Gift = createGift({ id: 'g1', level: 1 });
        const level5Gift = createGift({ id: 'g2', level: 5 });

        render(<GiftsPage gifts={[level1Gift, level5Gift]} unlockedIds={[]} />);

        // WHEN: User filters by Level 5
        // Assuming a Select or Button filter
        const filterInput = screen.getByTestId('level-filter');
        fireEvent.change(filterInput, { target: { value: '5' } });

        // THEN: Only Level 5 gift is visible
        expect(screen.queryByTestId(`gift-card-${level1Gift.id}`)).not.toBeInTheDocument();
        expect(screen.getByTestId(`gift-card-${level5Gift.id}`)).toBeInTheDocument();
    });

    it('displays loading state', () => {
        render(<GiftsPage gifts={null} />);
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
});
