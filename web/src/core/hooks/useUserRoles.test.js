import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserRoles, WEREWOLF_ROLE_ID } from './useUserRoles';

// Mock fetch globally
const originalFetch = global.fetch;

describe('useUserRoles', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Restore original fetch
        global.fetch = originalFetch;
    });

    describe('when not authenticated', () => {
        it('returns isAuthenticated = false when no token exists', async () => {
            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.discordUser).toBe(null);
            expect(result.current.hasWerewolfRole).toBe(false);
        });
    });

    describe('when authenticated', () => {
        const mockDiscordUser = {
            id: '123456789',
            username: 'testuser',
            global_name: 'Test User',
        };

        const mockGuildData = {
            success: true,
            guild_id: '987654321',
            guild_name: 'Test Guild',
        };

        it('returns isAuthenticated = true when token is valid', async () => {
            localStorage.setItem('discord_token', 'test-token');

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDiscordUser),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockGuildData),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_vampire_role: false }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_werewolf_role: false }),
                });

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.discordUser).toEqual(mockDiscordUser);
            expect(result.current.guildId).toBe('987654321');
        });

        it('returns hasWerewolfRole = true when user has werewolf role', async () => {
            localStorage.setItem('discord_token', 'test-token');

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDiscordUser),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockGuildData),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_vampire_role: false }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_werewolf_role: true }),
                });

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.hasWerewolfRole).toBe(true);
        });

        it('returns hasVampireRole = true when user has vampire role', async () => {
            localStorage.setItem('discord_token', 'test-token');

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockDiscordUser),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve(mockGuildData),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_vampire_role: true }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_werewolf_role: false }),
                });

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.hasVampireRole).toBe(true);
        });
    });

    describe('hasRole function', () => {
        it('returns true for WEREWOLF_ROLE_ID when user has werewolf role', async () => {
            localStorage.setItem('discord_token', 'test-token');

            global.fetch = vi.fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ id: '123', username: 'test' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, guild_id: '456' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_vampire_role: false }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: () => Promise.resolve({ success: true, has_werewolf_role: true }),
                });

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.hasRole(WEREWOLF_ROLE_ID)).toBe(true);
        });
    });

    describe('error handling', () => {
        it('handles invalid token gracefully', async () => {
            localStorage.setItem('discord_token', 'invalid-token');

            global.fetch = vi.fn().mockResolvedValueOnce({
                ok: false,
                status: 401,
            });

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(result.current.error).toBe('Session Discord expirée');
            // Token should be removed from localStorage
            expect(localStorage.getItem('discord_token')).toBe(null);
        });
    });
});
