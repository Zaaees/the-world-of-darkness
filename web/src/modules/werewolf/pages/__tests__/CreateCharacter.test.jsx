import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

// Story 2.3: Formulaire de Création de Personnage
// AS A nouveau joueur Loup-Garou
// I WANT un formulaire pour définir mon personnage
// SO THAT mon identité narrative soit établie

// Attempt to import the component - this should FAIL if not implemented yet
// or fail assertions if implemented but empty
// Note: We use dynamic import or expect it to be at this path
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

describe('Story 2.3: Create Character Form', () => {

    it('renders the creation form with all mandatory fields', () => {
        // GIVEN un joueur Werewolf sans fiche
        render(
            <MemoryRouter>
                <CreateCharacter />
            </MemoryRouter>
        );

        // THEN il voit un formulaire avec Sélecteur Race, Auspice, Tribu, Nom
        expect(screen.getByLabelText(/race/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/auspice/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/tribu/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();

        // AND tous les champs sont obligatoires (HTML5 validation or aria-required)
        expect(screen.getByLabelText(/race/i)).toBeRequired();
        expect(screen.getByLabelText(/auspice/i)).toBeRequired();
        expect(screen.getByLabelText(/tribu/i)).toBeRequired();
        expect(screen.getByLabelText(/nom/i)).toBeRequired();
    });

    it('shows warning about definitive choices', () => {
        render(
            <MemoryRouter>
                <CreateCharacter />
            </MemoryRouter>
        );

        // AND un avertissement indique que ces choix sont définitifs
        expect(screen.getByText(/définitif/i)).toBeInTheDocument();
    });

    it('uses the Deep Woods theme class', () => {
        const { container } = render(
            <MemoryRouter>
                <CreateCharacter />
            </MemoryRouter>
        );

        // AND le formulaire utilise le thème "Deep Woods"
        // Checking for a specific class or style token
        // This is a loose check, might refine later
        const themeWrapper = container.querySelector('.theme-deep-woods') || container.querySelector('[data-theme="deep-woods"]');
        expect(themeWrapper).toBeInTheDocument();
    });

    it('submits the form and redirects on success', async () => {
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

        // WHEN je remplis le formulaire
        fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Fenris' } });
        fireEvent.change(screen.getByLabelText(/race/i), { target: { value: 'homid' } });
        fireEvent.change(screen.getByLabelText(/auspice/i), { target: { value: 'ahroun' } });
        fireEvent.change(screen.getByLabelText(/tribu/i), { target: { value: 'get_of_fenris' } });

        // AND je soumets
        const submitBtn = screen.getByRole('button', { name: /créer/i });
        fireEvent.click(submitBtn);

        // THEN l'API est appelée
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/modules/werewolf/character'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        name: 'Fenris',
                        race: 'homid',
                        auspice: 'ahroun',
                        tribu: 'get_of_fenris'
                    })
                })
            );
        });

        // AND une redirection est déclenchée (après délai)
        // Wait for timeout
        await new Promise((r) => setTimeout(r, 2100));

        expect(mockNavigate).toHaveBeenCalledWith('/werewolf/sheet');
    });
});

// Mock hooks if needed at top level
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

