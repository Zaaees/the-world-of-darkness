
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import StoryEditor from '../StoryEditor';

describe('StoryEditor Sync Feedback', () => {
    const defaultProps = {
        initialValue: 'Test content',
        onSave: vi.fn(),
        onCancel: vi.fn(),
        autoSaveDelay: 1000,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays "Synchronisé avec Discord" toast when save returns sync confirmation', async () => {
        // Mock onSave to return success with sync flag
        // Assuming the component expects a return value from onSave to trigger feedback
        // OR the onSave prop interacts with a context that triggers the toast.
        // Based on Story 3.3: "Verifier que la synchro est déclenchée lors du handleAutoSave"
        // and "Ajouter le feedback Toast spécifique".

        const onSaveMock = vi.fn().mockResolvedValue({
            success: true,
            synced_to_discord: true
        });

        render(<StoryEditor {...defaultProps} onSave={onSaveMock} />);

        const textarea = screen.getByDisplayValue('Test content');

        // Trigger manual save (Ctrl+S or waiting)
        // Let's rely on autoSync or just simulate save call logic if exposed?
        // StoryEditor usually handles its own save loop.

        fireEvent.change(textarea, { target: { value: 'New content for sync' } });

        // Advance timers or wait if real timers used
        // The previous test used real timers with 100ms. I'll use waitFor.

        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalled();
        }, { timeout: 2000 });

        // Check for specific Toast
        await waitFor(() => {
            expect(screen.getByText(/Synchronisé avec Discord/i)).toBeInTheDocument();
        });
    });

    it('displays "Sauvegarde locale uniquement" when sync fails', async () => {
        // Mock onSave to return success BUT sync failure
        const onSaveMock = vi.fn().mockResolvedValue({
            success: true,
            synced_to_discord: false
        });

        render(<StoryEditor {...defaultProps} onSave={onSaveMock} />);

        const textarea = screen.getByDisplayValue('Test content');
        fireEvent.change(textarea, { target: { value: 'Content with sync fail' } });

        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalled();
        });

        // Check for fallback Toast
        await waitFor(() => {
            expect(screen.getByText(/Sauvegarde locale uniquement/i)).toBeInTheDocument();
        });
    });
});
