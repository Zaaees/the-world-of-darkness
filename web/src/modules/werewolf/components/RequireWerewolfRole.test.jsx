import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RequireWerewolfRole from './RequireWerewolfRole';
import useUserRoles, { WEREWOLF_ROLE_ID } from '../../../core/hooks/useUserRoles';

const { mockUseUserRoles } = vi.hoisted(() => {
    return { mockUseUserRoles: vi.fn() };
});

// Mock du hook useUserRoles avec factory explicite
vi.mock('../../../core/hooks/useUserRoles', () => ({
    default: mockUseUserRoles,
    useUserRoles: mockUseUserRoles,
    WEREWOLF_ROLE_ID: '1453870972376584192'
}));

// Mock du composant Loading pour isolation
vi.mock('./WerewolfLoading', () => ({
    default: () => <div data-testid="mock-loading">Loading Mock</div>
}));



describe('RequireWerewolfRole', () => {
    it('shows loading spinner when loading', () => {
        mockUseUserRoles.mockReturnValue({
            isLoading: true,
            hasRole: () => false,
            hasVampireRole: false
        });

        render(
            <MemoryRouter>
                <RequireWerewolfRole>
                    <div>Protected Content</div>
                </RequireWerewolfRole>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading Mock')).toBeInTheDocument();
    });

    it('renders children when user has werewolf role', () => {
        mockUseUserRoles.mockReturnValue({
            isLoading: false,
            hasRole: (roleId) => roleId === WEREWOLF_ROLE_ID,
            hasVampireRole: false
        });

        render(
            <MemoryRouter>
                <RequireWerewolfRole>
                    <div>Protected Content</div>
                </RequireWerewolfRole>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to /vampire when user has vampire role but no werewolf role', () => {
        mockUseUserRoles.mockReturnValue({
            isLoading: false,
            hasRole: (roleId) => false,
            hasVampireRole: true
        });

        render(
            <MemoryRouter initialEntries={['/werewolf']}>
                <Routes>
                    <Route path="/werewolf" element={
                        <RequireWerewolfRole>
                            <div>Protected Content</div>
                        </RequireWerewolfRole>
                    } />
                    <Route path="/vampire" element={<div>Vampire Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Vampire Page')).toBeInTheDocument();
    });

    it('shows access denied (403) when user has neither role', () => {
        mockUseUserRoles.mockReturnValue({
            isLoading: false,
            hasRole: () => false,
            hasVampireRole: false
        });

        render(
            <MemoryRouter initialEntries={['/werewolf']}>
                <Routes>
                    <Route path="/werewolf" element={
                        <RequireWerewolfRole>
                            <div>Protected Content</div>
                        </RequireWerewolfRole>
                    } />
                    <Route path="/403" element={<div>Access Denied</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
});
