import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GiftCard } from './GiftCard';
import { createGift } from '../../../../test/factories/gift-factory';

describe('GiftCard Component', () => {
    it('renders locked state correctly', () => {
        const gift = createGift();
        render(<GiftCard gift={gift} isUnlocked={false} />);

        // R-503: Details hidden
        expect(screen.queryByText(gift.name_fr)).not.toBeInTheDocument();
        expect(screen.getByText(/Don Mystère/i)).toBeInTheDocument();

        // Look for lock icon or indicator
        expect(screen.getByTestId('gift-card-locked-icon')).toBeInTheDocument();

        // Check styling class (implementation detail but critical for UX)
        const card = screen.getByTestId(`gift-card-${gift.id}`);
        expect(card).toHaveClass('gift-card--locked');
    });

    it('renders unlocked state correctly with full details', () => {
        const gift = createGift({ tribe: 'Furies Noires' });
        render(<GiftCard gift={gift} isUnlocked={true} />);

        // Details visible
        expect(screen.getByText(gift.name_fr)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(`${gift.level}`, 'i'))).toBeInTheDocument();
        expect(screen.getByText('Furies Noires')).toBeInTheDocument();
        // Assuming Gnosis cost is displayed
        expect(screen.getByText(new RegExp(`${gift.gnosis_cost}`, 'i'))).toBeInTheDocument();

        // Check styling
        const card = screen.getByTestId(`gift-card-${gift.id}`);
        expect(card).toHaveClass('gift-card--unlocked');

        // A11y check
        expect(card).toHaveAttribute('role', 'button');
        expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('calls onClick handler when unlocked', () => {
        const gift = createGift();
        const handleClick = vi.fn();

        render(<GiftCard gift={gift} isUnlocked={true} onClick={handleClick} />);

        const card = screen.getByTestId(`gift-card-${gift.id}`);
        fireEvent.click(card);
        expect(handleClick).toHaveBeenCalledTimes(1);

        // Test keyboard accessibility
        fireEvent.keyDown(card, { key: 'Enter' });
        expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('does NOT call onClick handler when locked', () => {
        const gift = createGift();
        const handleClick = vi.fn();

        render(<GiftCard gift={gift} isUnlocked={false} onClick={handleClick} />);

        fireEvent.click(screen.getByTestId(`gift-card-${gift.id}`));
        expect(handleClick).not.toHaveBeenCalled();
    });
});
