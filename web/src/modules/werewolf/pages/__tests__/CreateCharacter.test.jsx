import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CreateCharacter from '../CreateCharacter';

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

// Mock window.scrollTo
window.scrollTo = vi.fn();

describe('Story 2.0: Create Character Wizard', () => {

    it('navigates through the wizard steps and submits', async () => {
        // Mock navigate
        const { useNavigate } = await import('react-router-dom');
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, redirect: '/werewolf/sheet', message: 'Bienvenue' }),
            })
        );

        render(
            <MemoryRouter>
                <CreateCharacter />
            </MemoryRouter>
        );

        // STEP 1: Race
        expect(screen.getByText(/Choisissez votre Race/i)).toBeInTheDocument();
        // Assuming "Homid" is in the data
        const homidOption = screen.getAllByText(/Homid/i)[0]; // getAll because it might be in title and desc
        fireEvent.click(homidOption);

        // Click Next
        const nextBtn1 = screen.getByText(/Suivant/i);
        fireEvent.click(nextBtn1);

        // STEP 2: Auspice
        await waitFor(() => {
            expect(screen.getByText(/Sous quelle lune/i)).toBeInTheDocument();
        });
        const ahrounOption = screen.getAllByText(/Ahroun/i)[0];
        fireEvent.click(ahrounOption);

        const nextBtn2 = screen.getByText(/Suivant/i);
        fireEvent.click(nextBtn2);

        // STEP 3: Tribe
        await waitFor(() => {
            expect(screen.getByText(/Quelle Tribu/i)).toBeInTheDocument();
        });
        // Assuming "Fianna" or similar exists
        const tribeOption = screen.getAllByText(/Fianna/i)[0] || screen.getAllByText(/Furies Noires/i)[0];
        if (!tribeOption) throw new Error("No tribe found to click");
        fireEvent.click(tribeOption);

        const nextBtn3 = screen.getByText(/Suivant/i);
        await waitFor(() => {
            expect(nextBtn3).not.toBeDisabled();
        });
        fireEvent.click(nextBtn3);

        // STEP 4: Summary & Name
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /L'Incarnation/i })).toBeInTheDocument();
        });

        // Enter Name
        const nameInput = screen.getByPlaceholderText(/Nom de votre Garou/i);
        fireEvent.change(nameInput, { target: { value: 'Fenris' } });

        // Submit
        const submitBtn = screen.getByText(/Confirmer l'Incarnation/i);
        expect(submitBtn).not.toBeDisabled();
        fireEvent.click(submitBtn);

        // Verify Call
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/modules/werewolf/character'),
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining('"breed":"homid"')
                })
            );
        });

        // Redirect
        await new Promise(r => setTimeout(r, 2100));
        expect(mockNavigate).toHaveBeenCalledWith('/werewolf/sheet');
    });
});

// Mock hooks
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});
