
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import RenownAdminPage from './RenownAdminPage';
import { useRenownAdmin } from '../hooks/useRenownAdmin';

// Mock hook
vi.mock('../hooks/useRenownAdmin', () => ({
    useRenownAdmin: vi.fn()
}));

// Mock simple toast if we implement it as context, 
// but if it's local state, we just look for text.
// For now assuming we just render it in the page.

describe('RenownAdminPage', () => {
    const mockValidate = vi.fn();
    const mockReject = vi.fn();
    const mockFetch = vi.fn();

    const mockRequests = [
        {
            id: 1,
            user_id: '123',
            title: 'Haut Fait Epic',
            description: 'J\'ai tué un Nexus Crawler',
            renown_type: 'Glory',
            status: 'pending',
            submitted_at: '2026-01-25T12:00:00'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        useRenownAdmin.mockReturnValue({
            fetchRequests: mockFetch.mockResolvedValue(mockRequests),
            validateRequest: mockValidate,
            rejectRequest: mockReject,
            loading: false,
            error: null
        });
    });

    it('renders list of requests', async () => {
        render(<RenownAdminPage />);

        await waitFor(() => {
            expect(screen.getByText('Haut Fait Epic')).toBeInTheDocument();
        });
    });

    it('calls validate and shows success toast on click', async () => {
        // Mock validate success returns data
        mockValidate.mockResolvedValue({
            success: true,
            status: "approved",
            new_rank: 3
        });

        render(<RenownAdminPage />);

        await waitFor(() => screen.getByText('Haut Fait Epic'));

        const validateBtn = screen.getByText(/Valider/i); // Assuming button text or accessible name
        fireEvent.click(validateBtn);

        expect(mockValidate).toHaveBeenCalledWith(1);

        // Success Toast expectation
        await waitFor(() => {
            // Looking for toast text
            expect(screen.getByText(/Demande validée/i)).toBeInTheDocument();
            expect(screen.getByText(/Nouveau rang : 3/i)).toBeInTheDocument();
        });
    });
});
