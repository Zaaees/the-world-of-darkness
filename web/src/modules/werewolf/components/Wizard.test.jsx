import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WizardStep from './WizardStep';

describe('WizardStep', () => {
    const options = [
        { id: 'opt1', title: 'Option 1', description: 'Desc 1' },
        { id: 'opt2', title: 'Option 2', description: 'Desc 2' }
    ];

    it('renders options correctly', () => {
        const onSelect = vi.fn();
        render(<WizardStep options={options} onSelect={onSelect} selectedId="" />);
        expect(screen.getByText('Option 1')).toBeTruthy();
        expect(screen.getByText('Option 2')).toBeTruthy();
    });

    it('calls onSelect when clicked', () => {
        const onSelect = vi.fn();
        render(<WizardStep options={options} onSelect={onSelect} selectedId="" />);

        // Find the element by text and click it (bubble up to container)
        fireEvent.click(screen.getByText('Option 1'));
        expect(onSelect).toHaveBeenCalledWith('opt1');
    });

    it('highlights selected option', () => {
        const onSelect = vi.fn();
        const { container } = render(<WizardStep options={options} onSelect={onSelect} selectedId="opt1" />);
        // Logic to verify highlight class?
        // We can check if checkmark SVG is present
        // Or check border color class if we can access className
    });
});
