import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Droplet } from 'lucide-react';

const DURATION_LABELS = {
    instant: "Instantanée",
    scene: "Scène",
    prolonged: "Prolongée",
    permanent: "Permanente"
};

const DisciplineDetailModal = ({ power, icon, onClose }) => {
    const modalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();

            // Focus Trap (Basic)
            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                const modal = modalRef.current;
                const focusableContent = modal.querySelectorAll(focusableElements);

                if (focusableContent.length === 0) return;

                const firstElement = focusableContent[0];
                const lastElement = focusableContent[focusableContent.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Initial focus
    useEffect(() => {
        if (power && modalRef.current) {
            // Wait for animation frame or small timeout to ensure render
            setTimeout(() => {
                if (modalRef.current) modalRef.current.focus();
            }, 50);
        }
    }, [power]);

    return (
        <AnimatePresence>
            {power && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    data-testid="discipline-detail-backdrop"
                >
                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        ref={modalRef}
                        className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] overflow-hidden relative focus:outline-none"
                        data-testid="discipline-detail-modal"
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header Image / Pattern Background */}
                        <div className="h-40 bg-gradient-to-br from-red-950/90 via-stone-900 to-stone-950 border-b border-stone-800 relative shrink-0 overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 mix-blend-overlay"></div>

                            <div className="absolute -right-10 -top-10 flex items-center justify-center opacity-10 pointer-events-none">
                                <span className="text-[12rem] filter blur-sm">{icon || "✦"}</span>
                            </div>

                            <button
                                onClick={onClose}
                                aria-label="Fermer"
                                className="absolute top-4 right-4 p-2 bg-stone-950/50 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-colors z-10 border border-stone-800/50 backdrop-blur-sm"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-6 left-8 z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-5xl drop-shadow-lg">{icon}</span>
                                </div>
                                <h2 className="text-3xl font-serif text-white font-bold tracking-wide drop-shadow-md">
                                    {power.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-stone-900/60 border border-stone-700/50 text-stone-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                                        Niveau {power.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Bar */}
                        <div className="bg-stone-950/50 border-b border-stone-800 px-8 py-4 flex items-center gap-4 shrink-0 overflow-x-auto">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/20 border border-red-900/20 text-red-200 text-xs font-medium tracking-wide whitespace-nowrap">
                                <Droplet size={12} className="text-red-500 fill-red-500/20" />
                                <span>Coût: {power.bloodCost > 0 ? `${power.bloodCost} PS` : 'Gratuit'}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300 text-xs font-medium tracking-wide whitespace-nowrap">
                                <Clock size={12} className="text-stone-500" />
                                <span>Durée: {DURATION_LABELS[power.duration] || power.duration}</span>
                            </div>
                        </div>

                        {/* Body / Description */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <div className="prose prose-invert prose-stone max-w-none">
                                <p className="font-serif text-lg leading-relaxed text-stone-300 whitespace-pre-wrap">
                                    {power.description}
                                </p>
                            </div>
                        </div>

                        {/* Footer (Optional) */}
                        <div className="p-4 border-t border-stone-800 bg-stone-950/30 shrink-0 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-colors text-sm"
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DisciplineDetailModal;
