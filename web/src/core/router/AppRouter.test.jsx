import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import AppRouter from './AppRouter';

// Mock the useUserRoles hook
vi.mock('../hooks/useUserRoles', () => ({
    useUserRoles: vi.fn(),
}));

// Mock the module components
vi.mock('../../modules/vampire', () => ({
    VampireModule: {
        id: 'vampire',
        name: 'Vampire',
        path: '/vampire',
        RootComponent: () => <div data-testid="vampire-module">Vampire Module</div>,
    },
}));

vi.mock('../../modules/werewolf', () => ({
    WerewolfModule: {
        id: 'werewolf',
        name: 'Werewolf',
        path: '/werewolf',
        RootComponent: () => <div data-testid="werewolf-module">Werewolf Module {useLocation().hash}</div>,
    },
}));

import { useUserRoles } from '../hooks/useUserRoles';

describe('AppRouter', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('RootRedirect', () => {
        it('shows loading state while checking roles', () => {
            useUserRoles.mockReturnValue({
                isLoading: true,
                hasWerewolfRole: false,
                hasVampireRole: false,
            });

            render(
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByText(/Détection de votre monde/i)).toBeTruthy();
        });

        it('redirects to werewolf when user has werewolf role', async () => {
            useUserRoles.mockReturnValue({
                isLoading: false,
                isAuthenticated: true,
                hasWerewolfRole: true,
                hasVampireRole: false,
            });

            render(
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            );

            // Should navigate to werewolf module
            expect(screen.getByTestId('werewolf-module')).toBeTruthy();
        });

        it('redirects to vampire when user does not have werewolf role', async () => {
            useUserRoles.mockReturnValue({
                isLoading: false,
                isAuthenticated: true,
                hasWerewolfRole: false,
                hasVampireRole: true,
            });

            render(
                <MemoryRouter initialEntries={['/']}>
                    <AppRouter />
                </MemoryRouter>
            );

            // Should navigate to vampire module
            expect(screen.getByTestId('vampire-module')).toBeTruthy();
        });

        it('preserves hash fragment during redirect', () => {
            useUserRoles.mockReturnValue({
                isLoading: false,
                isAuthenticated: true,
                hasWerewolfRole: true,
                hasVampireRole: false,
            });

            // With hash in URL
            render(
                <MemoryRouter initialEntries={['/#access_token=test123']}>
                    <AppRouter />
                </MemoryRouter>
            );

            // Check both the destination and the preserved OAuth fragment
            expect(screen.getByTestId('werewolf-module')).toHaveTextContent('#access_token=test123');
        });
    });

    describe('Direct module access', () => {
        it('renders vampire module at /vampire path', () => {
            useUserRoles.mockReturnValue({
                isLoading: false,
                isAuthenticated: true,
                hasWerewolfRole: false,
                hasVampireRole: true,
            });

            render(
                <MemoryRouter initialEntries={['/vampire']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('vampire-module')).toBeTruthy();
        });

        it('renders werewolf module at /werewolf path', () => {
            useUserRoles.mockReturnValue({
                isLoading: false,
                isAuthenticated: true,
                hasWerewolfRole: true,
                hasVampireRole: false,
            });

            render(
                <MemoryRouter initialEntries={['/werewolf']}>
                    <AppRouter />
                </MemoryRouter>
            );

            expect(screen.getByTestId('werewolf-module')).toBeTruthy();
        });
    });
});
