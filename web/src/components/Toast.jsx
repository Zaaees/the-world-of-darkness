
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Simple Toast Notification Component
 * @param {string} message - Main message
 * @param {string} subtext - Optional detail text
 * @param {string} type - 'success' | 'error' | 'info'
 * @param {function} onClose - function to call when closing
 */
export default function Toast({ message, subtext, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-emerald-900/90 border-emerald-500/50 text-emerald-100',
        error: 'bg-red-900/90 border-red-500/50 text-red-100',
        info: 'bg-blue-900/90 border-blue-500/50 text-blue-100',
    };

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className={`p-4 rounded-lg border shadow-xl backdrop-blur-md flex flex-col gap-1 min-w-[300px] ${bgColors[type] || bgColors.info}`}
                >
                    <div className="font-bold flex items-center justify-between">
                        <span>{message}</span>
                        <button onClick={onClose} className="opacity-50 hover:opacity-100 ml-4">✕</button>
                    </div>
                    {subtext && (
                        <div className="text-sm opacity-80 font-light">
                            {subtext}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
