import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WerewolfLayout from './WerewolfLayout';

// Mock hooks
vi.mock('../hooks/useWerewolfProfile', () => ({
    useWerewolfProfile: () => ({ profile: { rank: 3 }, hasProfile: true })
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

    it('renders navbar when profile exists', () => {
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
