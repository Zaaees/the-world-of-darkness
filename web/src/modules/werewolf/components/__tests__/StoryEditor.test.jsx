import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import StoryEditor from '../StoryEditor';

describe('StoryEditor Component', () => {
    const defaultProps = {
        initialValue: 'Test story content',
        onSave: vi.fn(),
        onCancel: vi.fn(),
        autoSaveDelay: 100, // Short delay for testing with REAL timers
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with initial content', () => {
        render(<StoryEditor {...defaultProps} />);
        expect(screen.getByDisplayValue('Test story content')).toBeInTheDocument();
    });

    it('updates text when typing', () => {
        render(<StoryEditor {...defaultProps} />);
        const textarea = screen.getByDisplayValue('Test story content');
        fireEvent.change(textarea, { target: { value: 'Updated content' } });
        expect(textarea.value).toBe('Updated content');
    });

    it('triggers onSave periodically even when typing continues', async () => {
        const onSaveMock = vi.fn().mockResolvedValue();
        render(<StoryEditor {...defaultProps} onSave={onSaveMock} autoSaveDelay={100} />);

        const textarea = screen.getByDisplayValue('Test story content');

        // Type something
        fireEvent.change(textarea, { target: { value: 'Content 1' } });

        // Wait for interval tick
        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalledWith('Content 1');
        }, { timeout: 1000 });

        // Verify status
        expect(screen.getByText(/Sauvegardé/i)).toBeInTheDocument();

        // Type again immediately
        fireEvent.change(textarea, { target: { value: 'Content 2' } });

        // Wait for next interval tick
        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalledWith('Content 2');
        }, { timeout: 1000 });
    });

    it('displays error status when onSave fails', async () => {
        const onSaveMock = vi.fn().mockRejectedValue(new Error('API Error'));
        render(<StoryEditor {...defaultProps} onSave={onSaveMock} />);

        const textarea = screen.getByDisplayValue('Test story content');
        fireEvent.change(textarea, { target: { value: 'Error content' } });

        await waitFor(() => {
            expect(screen.getByText(/Échec de sauvegarde/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it('inserts bold tags when clicking the Bold button', () => {
        render(<StoryEditor {...defaultProps} />);
        const boldButton = screen.getByTitle('Gras');
        const textarea = screen.getByDisplayValue('Test story content');

        fireEvent.click(boldButton);
        expect(textarea.value).toContain('****');
    });

    it('toggles Focus Mode', () => {
        const { container } = render(<StoryEditor {...defaultProps} />);
        const focusButton = screen.getByTitle('Mode Focus');

        fireEvent.click(focusButton);
        expect(container.firstChild).toHaveClass('fixed');

        fireEvent.click(focusButton);
        expect(container.firstChild).not.toHaveClass('fixed');
    });

    it('calls onCancel when clicking cancel', () => {
        render(<StoryEditor {...defaultProps} />);
        const cancelButton = screen.getByText(/Annuler/i);

        fireEvent.click(cancelButton);
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });
});
