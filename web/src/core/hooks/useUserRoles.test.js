import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserRoles, WEREWOLF_ROLE_ID } from './useUserRoles';

// Mock fetch globally
const originalFetch = global.fetch;

describe('useUserRoles', () => {
    let mockLocation;
    let mockHistory;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        vi.clearAllMocks();

        // Mock window.location and window.history
        mockLocation = {
            hash: '',
            pathname: '/app',
            search: '',
            assign: vi.fn(),
            replace: vi.fn(),
            reload: vi.fn(),
            href: 'http://localhost/app'
        };

        mockHistory = {
            replaceState: vi.fn(),
        };

        // Use Object.defineProperty to overwrite window.location since it is often read-only in JSDOM
        Object.defineProperty(window, 'location', {
            value: mockLocation,
            writable: true
        });

        Object.defineProperty(window, 'history', {
            value: mockHistory,
            writable: true
        });
    });

    afterEach(() => {
        // Restore original fetch
        global.fetch = originalFetch;
    });

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

    const mockSuccessFetch = () => {
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
                json: () => Promise.resolve({ success: true, has_vampire_role: true }), // Vampire Role
            })
            .mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ success: true, has_werewolf_role: false }),
            });
    };

    describe('Hash Token Extraction', () => {
        it('Case 1: Extracts valid token from hash, sets expiry, and cleans URL', async () => {
            // Setup valid hash
            const validToken = 'valid.token.part'; // Mock 3 parts for validation logic if strictly enforced
            // But our authUtils check is "split by dot length === 3". 
            // So "a.b.c" is valid.
            const jwtToken = 'header.payload.signature';
            mockLocation.hash = `#access_token=${jwtToken}&expires_in=3600&token_type=Bearer`;

            mockSuccessFetch();

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // check token is in storage
            expect(localStorage.getItem('discord_token')).toBe(jwtToken);

            // check expiry is set (approximate)
            const expiry = localStorage.getItem('discord_token_expires_at');
            expect(expiry).toBeTruthy();
            // Should be Date.now() + 3600000
            expect(parseInt(expiry)).toBeGreaterThan(Date.now());

            // Check URL cleanup
            expect(mockHistory.replaceState).toHaveBeenCalledWith(null, '', '/app');

            // Check Authenticated
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('Case 2: Ignores invalid token in hash and preserves existing session (F3 Fix)', async () => {
            // Setup invalid hash
            mockLocation.hash = '#access_token=invalidTokenString';

            // Pre-set a valid token in storage
            localStorage.setItem('discord_token', 'valid.stored.token');

            // Mock successful fetch for the stored token
            mockSuccessFetch();

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Storage should NOT be cleared
            expect(localStorage.getItem('discord_token')).toBe('valid.stored.token');

            // URL should be cleaned (hash removed)
            expect(mockHistory.replaceState).toHaveBeenCalledWith(null, '', '/app');

            // Should be authenticated (using stored token)
            expect(result.current.isAuthenticated).toBe(true);
        });

        it('Case 4: Preserves deep links when cleaning hash', async () => {
            const jwtToken = 'header.payload.signature';
            mockLocation.hash = `#access_token=${jwtToken}&expires_in=3600&foo=bar`;

            mockSuccessFetch();

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // URL should be cleaned but preserve foo=bar
            expect(mockHistory.replaceState).toHaveBeenCalledWith(null, '', '/app#foo=bar');
        });
    });

    describe('Expiration Logic', () => {
        it('Case 3: Checks expiry from storage before fetch', async () => {
            localStorage.setItem('discord_token', 'expired.token.jwt');
            // Set expiry to 1 second ago
            const pastTime = Date.now() - 1000;
            localStorage.setItem('discord_token_expires_at', pastTime.toString());

            // Mock fetch to fail if called (it shouldn't be)
            global.fetch = vi.fn().mockRejectedValue(new Error('Should not fetch'));

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isAuthenticated).toBe(false);
            expect(localStorage.getItem('discord_token')).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
        });
    });

    describe('Standard Auth Flow (Storage)', () => {
        it('authenticates with valid stored token', async () => {
            localStorage.setItem('discord_token', 'valid.stored.token');
            mockSuccessFetch();

            const { result } = renderHook(() => useUserRoles());

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.isAuthenticated).toBe(true);
            expect(result.current.discordUser).toEqual(mockDiscordUser);
        });
    });
});
