import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import FilterContent from './FilterContent';

/**
 * MobileFilterDrawer - Slide-up drawer for mobile filter access.
 * Uses the World of Darkness aesthetic with smooth animations.
 * Respects prefers-reduced-motion for accessibility.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is visible
 * @param {Function} props.onClose - Callback to close the drawer
 */
export default function MobileFilterDrawer({ isOpen, onClose }) {
    const prefersReducedMotion = useReducedMotion();

    // Animation configuration
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const drawerVariants = prefersReducedMotion
        ? {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        }
        : {
            hidden: { y: '100%', opacity: 0.8 },
            visible: { y: 0, opacity: 1 },
        };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 md:hidden"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                        onClick={handleBackdropClick}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-stone-900 border-t border-stone-700 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
                        variants={drawerVariants}
                        transition={{
                            duration: prefersReducedMotion ? 0.1 : 0.2,
                            ease: 'easeOut',
                        }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filter-drawer-title"
                    >
                        {/* Handle bar for visual affordance */}
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-12 h-1 bg-stone-600 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-stone-800">
                            <h2
                                id="filter-drawer-title"
                                className="text-lg font-serif font-bold text-stone-300 flex items-center gap-2"
                            >
                                <Filter size={20} className="text-red-600" />
                                Filtres
                            </h2>
                            <button
                                onClick={onClose}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
                                aria-label="Fermer les filtres"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
                            <FilterContent onFilterChange={onClose} />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
