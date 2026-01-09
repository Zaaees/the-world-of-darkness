import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * Animation variants for different transition types.
 * These follow the World of Darkness "Ink Bleed" aesthetic with subtle movement.
 */
const animationVariants = {
    fade: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    },
    slideRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    },
    slideUp: {
        initial: { opacity: 0, y: '100%' },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: '100%' },
    },
};

/**
 * Reduced motion variants - simple opacity changes only.
 * Respects prefers-reduced-motion for WCAG accessibility (AC: 5).
 */
const reducedMotionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

/**
 * AnimatedView - A wrapper component for view transitions.
 * 
 * Uses framer-motion's AnimatePresence for enter/exit animations.
 * Automatically respects prefers-reduced-motion setting.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.viewKey - Unique key for the view (triggers animation on change)
 * @param {'fade'|'slideRight'|'slideUp'} props.variant - Animation variant to use
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.reducedMotion - Force reduced motion mode (for testing)
 */
const AnimatedView = ({
    children,
    viewKey,
    variant = 'fade',
    className = '',
    reducedMotion: forceReducedMotion = false,
}) => {
    // Use framer-motion's built-in reduced motion hook
    const prefersReducedMotion = useReducedMotion();
    const shouldReduceMotion = forceReducedMotion || prefersReducedMotion;

    // Select appropriate variants based on motion preference
    const variantConfig = shouldReduceMotion
        ? reducedMotionVariants
        : (animationVariants[variant] || animationVariants.fade);

    // Duration: 0.2s for snappy feel, 0.1s for reduced motion
    const duration = shouldReduceMotion ? 0.1 : 0.2;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={viewKey}
                initial={variantConfig.initial}
                animate={variantConfig.animate}
                exit={variantConfig.exit}
                transition={{
                    duration,
                    ease: 'easeOut'
                }}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default AnimatedView;
