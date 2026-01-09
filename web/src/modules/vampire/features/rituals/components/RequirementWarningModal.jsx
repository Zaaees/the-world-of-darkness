import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Check, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * RequirementWarningModal
 * 
 * Displays a warning when a ritual cannot be learned due to requirements.
 * Allows overriding the warning (GM power).
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Is modal visible
 * @param {function} props.onClose - Cancel action
 * @param {function} props.onConfirm - Force learn action
 * @param {string} props.reason - Reason for failure (from rules)
 * @param {string} props.ritualName - Name of the ritual
 */
const RequirementWarningModal = ({ isOpen, onClose, onConfirm, reason, ritualName }) => {
    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-stone-900 border border-red-900/50 rounded-lg shadow-2xl relative overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-red-900/30 flex items-center justify-between bg-red-950/20">
                        <div className="flex items-center space-x-2 text-red-500">
                            <ShieldAlert className="w-5 h-5" />
                            <h3 className="font-serif font-bold text-lg">Pré-requis non remplis</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-stone-500 hover:text-stone-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        <p className="text-stone-300">
                            Le personnage ne remplit pas les conditions pour apprendre <span className="font-bold text-stone-100">{ritualName}</span>.
                        </p>

                        <div className="p-3 bg-red-950/30 border border-red-900/30 rounded flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <span className="text-red-200 text-sm font-medium">
                                {reason}
                            </span>
                        </div>

                        <p className="text-sm text-stone-500 italic">
                            En tant que Conteur, vous pouvez forcer l'apprentissage si nécessaire pour l'histoire.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-stone-950/50 border-t border-stone-800 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-stone-400 hover:text-white transition-colors text-sm font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-100 rounded text-sm font-bold shadow-lg transition-colors flex items-center space-x-2"
                        >
                            <span>Forcer l'apprentissage</span>
                            <Check className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default RequirementWarningModal;
