import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RenownRequestList from '../RenownRequestList';

describe('RenownRequestList', () => {
    const mockRequests = [
        {
            id: 1,
            user_name: 'Player One',
            title: 'Beat the Wyrm',
            renown_type: 'glory',
            status: 'pending',
            submitted_at: '2026-01-25T10:00:00Z'
        },
        {
            id: 2,
            user_name: 'Player Two',
            title: 'Saved the Pup',
            renown_type: 'wisdom',
            status: 'pending',
            submitted_at: '2026-01-25T11:00:00Z'
        }
    ];

    it('renders list of pending requests', () => {
        render(<RenownRequestList requests={mockRequests} />);

        expect(screen.getByText('Player One')).toBeInTheDocument();
        expect(screen.getByText('Beat the Wyrm')).toBeInTheDocument();
        expect(screen.getByText('Gloire')).toBeInTheDocument();

        expect(screen.getByText('Player Two')).toBeInTheDocument();
        expect(screen.getByText('Saved the Pup')).toBeInTheDocument();
    });

    it('shows Validate and Reject buttons for each item', () => {
        render(<RenownRequestList requests={mockRequests} />);

        const validateButtons = screen.getAllByRole('button', { name: /valider/i });
        const rejectButtons = screen.getAllByRole('button', { name: /rejeter/i });

        expect(validateButtons).toHaveLength(2);
        expect(rejectButtons).toHaveLength(2);
    });

    it('calls onValidate when Validate button is clicked', () => {
        const handleValidate = vi.fn();
        render(<RenownRequestList requests={mockRequests} onValidate={handleValidate} />);

        const validateButtons = screen.getAllByRole('button', { name: /valider/i });
        fireEvent.click(validateButtons[0]);

        expect(handleValidate).toHaveBeenCalledWith(1);
    });

    it('calls onReject when Reject button is clicked', () => {
        const handleReject = vi.fn();
        render(<RenownRequestList requests={mockRequests} onReject={handleReject} />);

        const rejectButtons = screen.getAllByRole('button', { name: /rejeter/i });
        fireEvent.click(rejectButtons[0]);

        expect(handleReject).toHaveBeenCalledWith(1);
    });

    it('renders empty state message when no requests', () => {
        render(<RenownRequestList requests={[]} />);
        expect(screen.getByText(/aucune demande en attente/i)).toBeInTheDocument();
    });
});
