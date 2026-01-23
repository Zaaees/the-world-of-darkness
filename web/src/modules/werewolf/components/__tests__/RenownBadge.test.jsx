import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RenownBadge from '../RenownBadge';

describe('RenownBadge Component', () => {
    it('renders the correct rank name', () => {
        // GIVEN: Rank level 1
        render(<RenownBadge rank={1} />);

        // THEN: It should display "Cliath" (Werewolf Rank 1)
        expect(screen.getByText(/Cliath/i)).toBeInTheDocument();
    });

    it('renders the correct rank name for level 3', () => {
        render(<RenownBadge rank={3} />);
        expect(screen.getByText(/Adren/i)).toBeInTheDocument();
    });

    it('has the correct data-testid for ATDD', () => {
        render(<RenownBadge rank={1} />);
        expect(screen.getByTestId('renown-badge')).toBeInTheDocument();
    });
});
