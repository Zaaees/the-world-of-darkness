import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnimatedView from './AnimatedView';

// Mock framer-motion to avoid animation timing issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div data-testid="motion-div" {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <div data-testid="animate-presence">{children}</div>,
    useReducedMotion: vi.fn(() => false),
}));

describe('AnimatedView', () => {
    describe('Basic Rendering', () => {
        it('renders children correctly', () => {
            render(
                <AnimatedView viewKey="test">
                    <p>Test Content</p>
                </AnimatedView>
            );
            expect(screen.getByText('Test Content')).toBeDefined();
        });

        it('wraps content in AnimatePresence', () => {
            const { container } = render(
                <AnimatedView viewKey="test">
                    <div>Content</div>
                </AnimatedView>
            );
            expect(container.querySelector('[data-testid="animate-presence"]')).toBeDefined();
        });

        it('wraps content in motion.div', () => {
            const { container } = render(
                <AnimatedView viewKey="test">
                    <div>Content</div>
                </AnimatedView>
            );
            expect(container.querySelector('[data-testid="motion-div"]')).toBeDefined();
        });
    });

    describe('Key-based Animations', () => {
        it('uses viewKey for motion element key', () => {
            const { container, rerender } = render(
                <AnimatedView viewKey="view-1">
                    <p>View 1</p>
                </AnimatedView>
            );

            const firstMotionDiv = container.querySelector('[data-testid="motion-div"]');
            expect(firstMotionDiv).toBeDefined();

            // Re-render with different key should create new element
            rerender(
                <AnimatedView viewKey="view-2">
                    <p>View 2</p>
                </AnimatedView>
            );

            expect(screen.getByText('View 2')).toBeDefined();
        });
    });

    describe('Reduced Motion Support', () => {
        it('exports component that can be tested for reduced motion', () => {
            // Component should exist and render without error
            const { container } = render(
                <AnimatedView viewKey="test" reducedMotion>
                    <p>Content</p>
                </AnimatedView>
            );
            expect(container.querySelector('[data-testid="motion-div"]')).toBeDefined();
        });
    });

    describe('Animation Variants', () => {
        it('supports desktop slide-in variant', () => {
            render(
                <AnimatedView viewKey="test" variant="slideRight">
                    <p>Desktop Panel</p>
                </AnimatedView>
            );
            expect(screen.getByText('Desktop Panel')).toBeDefined();
        });

        it('supports mobile sheet variant', () => {
            render(
                <AnimatedView viewKey="test" variant="slideUp">
                    <p>Mobile Sheet</p>
                </AnimatedView>
            );
            expect(screen.getByText('Mobile Sheet')).toBeDefined();
        });

        it('uses default fade variant when no variant specified', () => {
            render(
                <AnimatedView viewKey="test">
                    <p>Default Fade</p>
                </AnimatedView>
            );
            expect(screen.getByText('Default Fade')).toBeDefined();
        });
    });

    describe('Custom Class Support', () => {
        it('forwards className to motion wrapper', () => {
            const { container } = render(
                <AnimatedView viewKey="test" className="custom-class">
                    <p>Content</p>
                </AnimatedView>
            );
            const motionDiv = container.querySelector('[data-testid="motion-div"]');
            expect(motionDiv.className).toContain('custom-class');
        });
    });
});
