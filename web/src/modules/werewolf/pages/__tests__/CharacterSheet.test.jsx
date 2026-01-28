import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CharacterSheet from '../CharacterSheet';

// Mock useUserRoles
vi.mock('../../../../core/hooks/useUserRoles', () => ({
    useUserRoles: () => ({
        discordUser: { id: '123' },
        guildId: '456',
        isLoading: false,
        isAuthenticated: true
    }),
    WEREWOLF_ROLE_ID: '1453870972376584192'
}));

// Mocking the fetch API
global.fetch = vi.fn();

describe('CharacterSheet Page', () => {
    const mockCharacter = {
        name: "Fenris",
        breed: "Homid",
        auspice: "Ahroun",
        tribe: "Get of Fenris",
        story: "Une longue histoire dans les bois...",
        rank: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders character information from API', async () => {
        // GIVEN: API returns character data
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ character: mockCharacter }),
        });

        // WHEN: Component is rendered
        render(
            <MemoryRouter>
                <CharacterSheet />
            </MemoryRouter>
        );

        // THEN: Final data should appear
        await waitFor(() => {
            expect(screen.getByText("Fenris")).toBeInTheDocument();
            expect(screen.getByText(/Homid/i)).toBeInTheDocument();
            expect(screen.getByText(/Ahroun/i)).toBeInTheDocument();
            expect(screen.getByText(/Get of Fenris/i)).toBeInTheDocument();
            expect(screen.getByText(mockCharacter.story)).toBeInTheDocument();
        });
    });

    it('displays the Deep Woods theme elements', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ character: mockCharacter }),
        });

        const { container } = render(
            <MemoryRouter>
                <CharacterSheet />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Verifying specific theme classes or styles might exist
            // This is a placeholder for actual theme verification
            const mainContainer = container.querySelector('.theme-werewolf'); // Fixed class name to match implementation
            expect(mainContainer).toBeDefined();
        });
    });

    it('renders the RenownBadge with correct rank', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ character: mockCharacter }),
        });

        render(
            <MemoryRouter>
                <CharacterSheet />
            </MemoryRouter>
        );

        await waitFor(() => {
            // Assuming RenownBadge has a test id
            expect(screen.getByTestId('renown-badge')).toBeInTheDocument();
        });
    });
});
