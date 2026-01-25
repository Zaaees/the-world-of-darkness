
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import StoryEditor from '../StoryEditor';

describe('StoryEditor Sync Feedback', () => {
    it('displays sync confirmation when onSave returns synced: true', async () => {
        // Mock onSave returning { synced: true }
        const onSaveMock = vi.fn().mockResolvedValue({ synced: true });

        render(
            <StoryEditor
                initialValue="Initial"
                onSave={onSaveMock}
                autoSaveDelay={50} // Fast delay
            />
        );

        const textarea = screen.getByDisplayValue('Initial');
        fireEvent.change(textarea, { target: { value: 'New content' } });

        // Wait for save
        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalled();
        });

        // Expect sync message
        // This will FAIL initially as StoryEditor doesn't handle return value yet
        await waitFor(() => {
            expect(screen.getByText(/Synchronisé avec Discord/i)).toBeInTheDocument();
        });
    });

    it('displays standard saved message when onSave returns synced: false', async () => {
        const onSaveMock = vi.fn().mockResolvedValue({ synced: false });

        render(
            <StoryEditor
                initialValue="Initial"
                onSave={onSaveMock}
                autoSaveDelay={50}
            />
        );

        const textarea = screen.getByDisplayValue('Initial');
        fireEvent.change(textarea, { target: { value: 'New content 2' } });

        await waitFor(() => {
            expect(onSaveMock).toHaveBeenCalled();
        });

        // Should still show "Sauvegardé" (default behavior)
        expect(screen.getByText(/Sauvegardé/i)).toBeInTheDocument();
        expect(screen.queryByText(/Synchronisé avec Discord/i)).not.toBeInTheDocument();
    });
});
