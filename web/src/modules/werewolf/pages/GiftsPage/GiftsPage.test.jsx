/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GiftsPage } from './GiftsPage';


import { createGift } from '../../../../test/factories/gift-factory';

// Mocks
vi.mock('../../../../core/hooks/useUserRoles', () => ({
    default: () => ({
        discordUser: { id: '123' },
        hasWerewolfRole: true
    })
}));

vi.mock('../../../../config', () => ({
    API_URL: 'http://localhost:3000'
}));

vi.mock('../../components/WerewolfLayout', () => ({
    default: ({ children }) => <div data-testid="layout">{children}</div>
}));

describe('GiftsPage', () => {
    it('renders the page title', () => {
        render(<GiftsPage />);
        expect(screen.getByText(/Mes Dons/i)).toBeInTheDocument();
    });

    it('displays gifts grouped by locked/unlocked status', () => {
        const unlockedGift = createGift({ name_fr: 'Don Débloqué', id: 'g1' });
        const lockedGift = createGift({ name_fr: 'Don Verrouillé', id: 'g2' });

        // Mock data usually passed via props or hook
        render(<GiftsPage gifts={[unlockedGift, lockedGift]} unlockedIds={['g1']} />);

        expect(screen.getByText('Don Débloqué')).toBeInTheDocument();
        expect(screen.getByText(/Don Mystère/i)).toBeInTheDocument();
    });

    it('filters gifts by level', async () => {
        const level1Gift = createGift({ level: 1, name_fr: 'Level 1 Gift', id: 'l1' });
        const level2Gift = createGift({ level: 2, name_fr: 'Level 2 Gift', id: 'l2' });

        render(<GiftsPage gifts={[level1Gift, level2Gift]} unlockedIds={['l1', 'l2']} />);

        // Interaction simulates filtering (implementation specific)
        const filterSelect = screen.getByLabelText(/Niveau/i);
        fireEvent.change(filterSelect, { target: { value: '1' } });

        expect(screen.getByText('Level 1 Gift')).toBeInTheDocument();
        expect(screen.queryByText('Level 2 Gift')).not.toBeInTheDocument();
    });

    it('filters unlocked gifts only', () => {
        const unlockedGift = createGift({ id: 'u1', name_fr: 'Unlocked One' });
        const lockedGift = createGift({ id: 'l1', name_fr: 'Locked One' });

        render(<GiftsPage gifts={[unlockedGift, lockedGift]} unlockedIds={['u1']} />);

        // Toggle "Débloqués uniquement"
        const checkbox = screen.getByLabelText(/Débloqués uniquement/i);
        fireEvent.click(checkbox);

        expect(screen.getByText('Unlocked One')).toBeInTheDocument();
        // Le locked gift affiche "Don Mystère" par défaut si locked, mais le composant GiftCard parent ne devrait même pas être rendu
        // On check si le texte "Don Mystère" (ou le titre si visible) est présent
        expect(screen.queryByText(/Don Mystère/i)).not.toBeInTheDocument();
    });

    it('opens gift details modal on click', () => {
        const gift = createGift({
            id: 'g1',
            name_fr: 'Super Don',
            description: 'A powerful effect.',
            system: 'Roll Gnosis + Rage'
        });

        render(<GiftsPage gifts={[gift]} unlockedIds={['g1']} />);

        // Click the card
        const card = screen.getByText('Super Don');
        fireEvent.click(card);

        // Check modal content
        expect(screen.getByText('A powerful effect.')).toBeInTheDocument();
        expect(screen.getByText('Roll Gnosis + Rage')).toBeInTheDocument();

        // Close modal
        const closeBtn = screen.getByText('×');
        fireEvent.click(closeBtn);

        expect(screen.queryByText('A powerful effect.')).not.toBeInTheDocument();
    });
});
