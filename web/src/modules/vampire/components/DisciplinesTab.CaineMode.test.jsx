// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DisciplinesTab from './DisciplinesTab';

// Mock icons
vi.mock('lucide-react', () => ({
    ChevronDown: () => <span data-testid="chevron-down" />,
    ChevronUp: () => <span data-testid="chevron-up" />,
    Sparkles: () => <span data-testid="sparkles" />,
    Lock: () => <span data-testid="lock" />,
    Clock: () => <span data-testid="clock" />,
    Droplet: () => <span data-testid="droplet" />,
}));

describe('DisciplinesTab - Caine Mode', () => {
    const mockClan = 'Brave'; // Dummy clan
    const mockBloodPotency = 1;

    it('should display all disciplines when isCainMode is true', () => {
        render(<DisciplinesTab clan={mockClan} bloodPotency={mockBloodPotency} isCainMode={true} />);

        expect(screen.getByText('Animalisme')).toBeTruthy();
        expect(screen.getByText('Domination')).toBeTruthy();
        expect(screen.getByText('Thaumaturgie')).toBeTruthy();
    });

    it('should show up to level 10 powers when isCainMode is true', () => {
        render(<DisciplinesTab clan={mockClan} bloodPotency={mockBloodPotency} isCainMode={true} />);

        const level10Indicators = screen.getAllByText('10');
        expect(level10Indicators.length).toBeGreaterThan(0);
    });

    it('should allow clicking level 10 powers in Caine Mode', () => {
        render(<DisciplinesTab clan={mockClan} bloodPotency={mockBloodPotency} isCainMode={true} />);

        const level10Indicators = screen.getAllByText('10');
        const level10Card = level10Indicators[0].closest('.rounded.border');

        expect(level10Card.className).not.toContain('opacity-60');
        expect(level10Card.className).toContain('hover:shadow-lg');
    });
});
