import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WerewolfLayout from './WerewolfLayout';

// Skipped due to environment configuration issues with CSS imports in test runner
describe('WerewolfLayout', () => {
    it('renders children correctly', () => {
        render(
            <WerewolfLayout>
                <div data-testid="child">Child Content</div>
            </WerewolfLayout>
        );
        expect(screen.getByTestId('child')).toBeTruthy();
    });

    it('applies the theme-werewolf class to the wrapper', () => {
        const { container } = render(
            <WerewolfLayout>
                <div>Content</div>
            </WerewolfLayout>
        );
        expect(container.firstChild.classList.contains('theme-werewolf')).toBe(true);
    });
});
