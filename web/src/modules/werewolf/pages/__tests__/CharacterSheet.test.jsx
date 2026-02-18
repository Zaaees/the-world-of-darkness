import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CharacterSheet from '../CharacterSheet';

const mockFetchMyRenown = vi.fn().mockResolvedValue([]);
const mockSubmitRenown = vi.fn();

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

// Mock useRenown hook
vi.mock('../../hooks/useRenown', () => ({
    useRenown: () => ({
        submitRenown: mockSubmitRenown,
        fetchMyRenown: mockFetchMyRenown,
        loading: false,
        error: null,
        authReady: true
    })
}));

const mockCharacter = {
    name: "Fenris",
    breed: "Homid",
    auspice: "Ahroun",
    tribe: "Get of Fenris",
    story: "Une longue histoire dans les bois...",
    rank: 1
};

/**
 * Configure global.fetch pour les appels du composant.
 * Le composant fait 2 fetch directs (character, gifts) + le polling.
 * fetchMyRenown est géré par son propre mock séparé.
 */
const setupFetchMocks = () => {
    global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('/werewolf/character')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ character: mockCharacter }),
            });
        }
        if (url.includes('/werewolf/gifts')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true, catalogue: [], unlocked_ids: [], tribe: null }),
            });
        }
        // Fallback
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        });
    });
};

/**
 * Helper pour rendre CharacterSheet avec le router.
 */
const renderSheet = (tab = 'sheet') => {
    return render(
        <MemoryRouter initialEntries={[`/werewolf/${tab}`]}>
            <CharacterSheet initialTab={tab} />
        </MemoryRouter>
    );
};

describe('CharacterSheet Page', () => {
    beforeEach(() => {
        setupFetchMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders character information from API', async () => {
        renderSheet();

        await waitFor(() => {
            expect(screen.getByText("Fenris")).toBeInTheDocument();
        });

        expect(screen.getByText(/Homid/i)).toBeInTheDocument();
        expect(screen.getByText(/Ahroun/i)).toBeInTheDocument();
        expect(screen.getByText(/Rejetons de Fenris/i)).toBeInTheDocument();
    });

    it('displays the Deep Woods theme elements', async () => {
        const { container } = renderSheet();

        await waitFor(() => {
            const mainContainer = container.querySelector('.theme-werewolf');
            expect(mainContainer).toBeTruthy();
        });
    });

    it('renders the RenownBadge with correct rank', async () => {
        renderSheet();

        await waitFor(() => {
            expect(screen.getByTestId('renown-badge')).toBeInTheDocument();
        });
    });

    it('shows tab navigation buttons', async () => {
        renderSheet();

        await waitFor(() => {
            expect(screen.getByText('Ma Fiche')).toBeInTheDocument();
            expect(screen.getByText('Mes Dons')).toBeInTheDocument();
            expect(screen.getByText('Hauts Faits')).toBeInTheDocument();
        });
    });
});
