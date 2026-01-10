import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
    throw new Error('Test Error');
};

describe('ErrorBoundary', () => {
    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Safe Content</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Safe Content')).toBeTruthy();
    });

    it('renders error message when an error occurs', () => {
        const consoleSpy = vi.spyOn(console, 'error');
        consoleSpy.mockImplementation(() => { });

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/Something went wrong/i)).toBeTruthy();
        expect(screen.getByText(/Test Error/i)).toBeTruthy();

        consoleSpy.mockRestore();
    });
});
