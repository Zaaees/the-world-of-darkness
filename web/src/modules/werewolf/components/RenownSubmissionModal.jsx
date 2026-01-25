import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const RENOWN_TYPES = [
    { value: 'glory', label: 'Gloire' },
    { value: 'honor', label: 'Honneur' },
    { value: 'wisdom', label: 'Sagesse' },
];

const RenownSubmissionModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('glory');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !description) return; // Simple validation

        onSubmit({
            title,
            description,
            type,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setType('glory');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    data-testid="renown-modal"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl max-w-lg w-full p-6 relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-serif font-bold text-white mb-6">Proposer un Haut Fait</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-stone-400 text-sm font-medium mb-1">Titre</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    // Using standard HTML input for now as no shared component found
                                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-red-900 transition-colors"
                                    placeholder="Ex: Purifier le Caern"
                                    data-testid="renown-title-input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-stone-400 text-sm font-medium mb-1">Type de Renommée</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-red-900 transition-colors appearance-none"
                                    data-testid="renown-type-select"
                                >
                                    {RENOWN_TYPES.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-stone-400 text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-stone-200 focus:outline-none focus:border-red-900 transition-colors min-h-[100px]"
                                    placeholder="Détails de l'accomplissement..."
                                    data-testid="renown-description-input"
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-stone-400 hover:text-white mr-2"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded font-medium transition-colors shadow-lg shadow-amber-900/20"
                                    data-testid="renown-submit-confirm"
                                >
                                    Envoyer aux Esprits
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RenownSubmissionModal;
