import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import SheetPage from './SheetPage';

// Mock child components to avoid deep rendering issues
vi.mock('../components/DisciplinesTab', () => ({ default: () => <div data-testid="disciplines-tab">Disciplines</div> }));
vi.mock('../components/GhoulsTab', () => ({ default: () => <div data-testid="ghouls-tab">Ghouls</div> }));
vi.mock('../components/RitualsTab', () => ({ default: () => <div data-testid="rituals-tab">Rituals</div> }));
vi.mock('../components/RulesTab', () => ({ default: () => <div data-testid="rules-tab">Rules</div> }));
vi.mock('../components/CharacterSheet', () => ({ default: () => <div data-testid="character-sheet">Character Sheet</div> }));
vi.mock('./ClanSelectionPage', () => ({ default: () => <div data-testid="clan-selection">Clan Selection</div> }));
vi.mock('../../../core/components/GmDashboard', () => ({ default: () => <div data-testid="gm-dashboard">GM Dashboard</div> }));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('SheetPage', () => {
    it('opens the rules from the MJ dashboard and returns to it', async () => {
        Storage.prototype.getItem = vi.fn(key => key === 'discord_token' ? 'fake-token' : null);
        mockFetch.mockImplementation(async url => {
            let data = { success: true };
            if (url.includes('discord.com/')) data = { id: '123', username: 'MJ' };
            else if (url.endsWith('/api/guild')) data = { success: true, guild_id: '456' };
            else if (url.endsWith('/api/vampire/profile')) data = { success: true, has_vampire_role: true, is_gm: true, clan: 'brujah' };
            else if (url.endsWith('/api/vampire/character')) data = { success: true, character: { name: 'MJ', clan: 'brujah', race: 'vampire' } };
            return { ok: true, json: async () => data };
        });
        render(<SheetPage />);
        fireEvent.click(await screen.findByRole('button', { name: /^MJ$/ }));
        expect(screen.getByTestId('gm-dashboard')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Règlement/i }));
        expect(screen.getByTestId('rules-tab')).toBeInTheDocument();
        expect(screen.queryByTestId('gm-dashboard')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /Règlement/i }));
        expect(screen.getByTestId('gm-dashboard')).toBeInTheDocument();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Default fetch mocks
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        });

        // Mock local storage
        Storage.prototype.getItem = vi.fn(() => null);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders login screen initially when no user is connected', async () => {
        render(<SheetPage />);

        expect(screen.getByText(/Se connecter avec Discord/i)).toBeTruthy();
        expect(screen.queryByTestId('character-sheet')).toBeNull();
    });

    it('handles null discordUser in auto-refresh effect without crashing', async () => {
        // This test simulates the state where component is mounted but user is not yet loaded
        // The regression was that useEffect would try to read discordUser.id even if null

        render(<SheetPage />);

        // If it didn't crash, we're good.
        // The "World of Darkness" title is always present on login screen
        expect(screen.getByText('World of Darkness')).toBeTruthy();
    });

    it('attempts to load user if token exists in localStorage', async () => {
        Storage.prototype.getItem = vi.fn(() => 'fake-token');

        mockFetch.mockImplementation((url) => {
            if (url.includes('discord.com/api/users/@me')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ id: '123', username: 'TestUser', global_name: 'Test Global' })
                });
            }
            return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
        });

        render(<SheetPage />);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('discord.com/api/users/@me'),
                expect.objectContaining({ headers: { Authorization: 'Bearer fake-token' } })
            );
        });
    });
});
