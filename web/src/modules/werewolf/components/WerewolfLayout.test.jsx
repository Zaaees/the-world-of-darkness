import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WerewolfLayout from './WerewolfLayout';
import { useWerewolfProfile } from '../hooks/useWerewolfProfile';

// Mock hooks
vi.mock('../hooks/useWerewolfProfile', () => ({
    useWerewolfProfile: vi.fn(() => ({ profile: { rank: 3 }, hasProfile: true }))
}));

vi.mock('../../../core/hooks/useUserRoles', () => ({
    useUserRoles: () => ({ isMJ: true, discordUser: { id: '123' }, guildId: '456' })
}));

describe('WerewolfLayout', () => {
    it('renders children correctly', () => {
        render(
            <MemoryRouter>
                <WerewolfLayout>
                    <div data-testid="child">Child Content</div>
                </WerewolfLayout>
            </MemoryRouter>
        );
        expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('renders navbar even when profile is missing', () => {
        // Redefine mock for this test
        vi.mocked(useWerewolfProfile).mockReturnValue({ profile: null, hasProfile: false });

        render(
            <MemoryRouter>
                <WerewolfLayout>
                    <div>Content</div>
                </WerewolfLayout>
            </MemoryRouter>
        );
        // "Créer un Personnage" link should be present
        expect(screen.getByText('Créer un Personnage')).toBeTruthy();
    });

    it('renders navbar with sheet link when profile exists', () => {
        // Redefine mock for this test
        vi.mocked(useWerewolfProfile).mockReturnValue({ profile: { rank: 3 }, hasProfile: true });

        render(
            <MemoryRouter>
                <WerewolfLayout>
                    <div>Content</div>
                </WerewolfLayout>
            </MemoryRouter>
        );
        // "Ma Fiche" link should be present
        expect(screen.getByText('Ma Fiche')).toBeTruthy();
    });
});
