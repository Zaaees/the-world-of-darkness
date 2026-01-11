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
                        <div className="h-32 bg-gradient-to-br from-red-950/40 via-stone-900 to-stone-900 border-b border-stone-800 relative shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                <span className="text-[8rem]">{icon || "✦"}</span>
                            </div>

                            <button
                                onClick={onClose}
                                aria-label="Fermer"
                                className="absolute top-4 right-4 p-2 bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-white rounded-full transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="absolute bottom-4 left-6">
                                <h2 className="text-2xl font-serif text-white font-bold tracking-wide drop-shadow-md">
                                    {power.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-0.5 rounded bg-red-900/20 border border-red-900/30 text-red-400 text-xs font-medium">
                                        Niveau {power.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Bar */}
                        <div className="bg-stone-950/50 border-b border-stone-800 px-6 py-3 flex items-center gap-6 shrink-0">
                            <div className="flex items-center gap-2 text-stone-400 text-sm">
                                <Droplet size={14} className="text-red-500" />
                                <span>Coût: <span className="text-stone-200">{power.bloodCost > 0 ? `${power.bloodCost} PS` : 'Gratuit'}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-stone-400 text-sm">
                                <Clock size={14} className="text-stone-500" />
                                <span>Durée: <span className="text-stone-200">{DURATION_LABELS[power.duration] || power.duration}</span></span>
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
