import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RenownSubmissionModal from '../RenownSubmissionModal';

describe('RenownSubmissionModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
    };

    it('renders correctly when open', () => {
        render(<RenownSubmissionModal {...defaultProps} />);

        expect(screen.getByTestId('renown-modal')).toBeInTheDocument();
        expect(screen.getByTestId('renown-title-input')).toBeInTheDocument();
        expect(screen.getByTestId('renown-description-input')).toBeInTheDocument();
        expect(screen.getByTestId('renown-type-select')).toBeInTheDocument();
        expect(screen.getByTestId('renown-submit-confirm')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<RenownSubmissionModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByTestId('renown-modal')).not.toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(<RenownSubmissionModal {...defaultProps} />);

        const submitButton = screen.getByTestId('renown-submit-confirm');
        fireEvent.click(submitButton);

        // Validation logic might differ, but assuming HTML validation or error message
        // For now just checking mock is NOT called if empty
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('calls onSubmit with form data when valid', async () => {
        render(<RenownSubmissionModal {...defaultProps} />);

        const titleInput = screen.getByTestId('renown-title-input');
        const descInput = screen.getByTestId('renown-description-input');
        const typeSelect = screen.getByTestId('renown-type-select');
        const submitButton = screen.getByTestId('renown-submit-confirm');

        fireEvent.change(titleInput, { target: { value: 'Test Deed' } });
        fireEvent.change(descInput, { target: { value: 'I saved the sept.' } });
        fireEvent.change(typeSelect, { target: { value: 'glory' } });

        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: 'Test Deed',
            description: 'I saved the sept.',
            type: 'glory'
        });
    });

    it('calls onClose when closed', () => {
        render(<RenownSubmissionModal {...defaultProps} />);

        // Assuming there is a close button or clicking background
        // finding close button by accessible name or testid if available
        // For now, let's assume a close button exists with "Fermer" text as seen in other modal
        const closeButton = screen.getByText(/annuler/i);
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
