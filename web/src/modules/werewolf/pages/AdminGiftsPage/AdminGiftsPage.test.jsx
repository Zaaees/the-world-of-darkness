import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminGiftsPage from './AdminGiftsPage';
import { useUserRoles } from '../../../../core/hooks/useUserRoles';

// Mock hook
vi.mock('../../../../core/hooks/useUserRoles', () => ({
    useUserRoles: vi.fn()
}));

describe('AdminGiftsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock: Authenticated user
        useUserRoles.mockReturnValue({
            isAuthenticated: true,
            discordUser: { id: '123' },
            isLoading: false
        });
    });

    it('renders loading state initially', () => {
        // Need to mock fetch before render
        global.fetch = vi.fn(() => new Promise(() => { })); // Never resolve to keep loading

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );
        expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
    });

    it('renders correctly for authenticated user (MJ)', async () => {
        // Mock success response for players
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({
                        success: true,
                        players: [{ id: '1', name: 'Joueur 1', tribe: 'Fianna' }]
                    })
                });
            }
            return Promise.reject(new Error("Unknown URL"));
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Administration des Dons/i)).toBeInTheDocument();
        });

        expect(screen.getByText('Joueur 1 (Fianna)')).toBeInTheDocument();
    });

    it('handles Access Denied (403)', async () => {
        // Mock 403 response
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: false,
                    status: 403,
                    json: () => Promise.resolve({ error: "Access Denied" })
                });
            }
            return Promise.reject(new Error("Unknown URL"));
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Accès Refusé/i)).toBeInTheDocument();
        });
    });

    it('displays gifts and handles unlock action', async () => {
        // Mock fetch for Players, Gifts list and Unlock action
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players/1/gifts')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        gifts: [
                            { id: 'g1', name: 'Vision Nocturne', unlocked: false, tribe: 'Fianna' },
                            { id: 'g2', name: 'Griffes acérées', unlocked: true, tribe: 'Fianna' }
                        ]
                    })
                });
            }
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        players: [{ id: '1', name: 'Joueur 1', tribe: 'Fianna' }]
                    })
                });
            }
            if (url.includes('/gifts/unlock')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true, new_state: 'unlocked' })
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        // Select player
        const select = await waitFor(() => screen.getByRole('combobox', { name: /Sélectionner un joueur/i }), { timeout: 2000 });

        await act(async () => {
            // Simulate user selecting "Joueur 1"
            // Note: fireEvent.change might be better in some libs, but setting value works
            select.value = '1';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        // Wait for gifts to appear
        await waitFor(() => {
            expect(screen.getByText('Vision Nocturne')).toBeInTheDocument();
            expect(screen.getByText('Griffes acérées')).toBeInTheDocument();
        });

        // Click to unlock "Vision Nocturne"
        const checkbox = screen.getByRole('checkbox', { name: /Vision Nocturne/i });
        expect(checkbox).not.toBeChecked();

        await act(async () => {
            checkbox.click();
        });

        // Verify API was called
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/gifts/unlock'), expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('g1')
        }));
    });

    it('handles empty player list', async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true, players: [] })
                });
            }
            return Promise.reject(new Error("Unknown URL"));
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Aucun joueur trouvé/i)).toBeInTheDocument();
        });
    });

    it('handles API error when loading players', async () => {
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.resolve({ error: "Internal Server Error" })
                });
            }
            return Promise.reject(new Error("Unknown URL"));
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Erreur lors du chargement des joueurs/i)).toBeInTheDocument();
        });
    });

    it('handles API error when toggling gift', async () => {
        // Mock success for players and gifts, but failure for unlock
        global.fetch = vi.fn((url) => {
            if (url.includes('/admin/players/1/gifts')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        gifts: [{ id: 'g1', name: 'Vision Nocturne', unlocked: false, tribe: 'Fianna' }]
                    })
                });
            }
            if (url.includes('/admin/players')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        players: [{ id: '1', name: 'Joueur 1', tribe: 'Fianna' }]
                    })
                });
            }
            if (url.includes('/gifts/unlock')) {
                return Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.resolve({ error: "Failed to update" })
                });
            }
            return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        });

        render(
            <MemoryRouter>
                <AdminGiftsPage />
            </MemoryRouter>
        );

        const select = await waitFor(() => screen.getByRole('combobox', { name: /Sélectionner un joueur/i }));
        await act(async () => {
            select.value = '1';
            select.dispatchEvent(new Event('change', { bubbles: true }));
        });

        const checkbox = await screen.findByRole('checkbox', { name: /Vision Nocturne/i });

        await act(async () => {
            checkbox.click();
        });

        await waitFor(() => {
            expect(screen.getByText(/Erreur lors de la mise à jour/i)).toBeInTheDocument();
        });

        // Checkbox should revert state on error if using optimistic UI
        expect(checkbox).not.toBeChecked();
    });
});


