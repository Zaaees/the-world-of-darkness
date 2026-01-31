import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown } from 'lucide-react';

const GUIDE_ITEMS = [
    {
        key: 'glory',
        title: 'Gloire',
        color: 'text-amber-500',
        description: "La Gloire mesure votre bravoure au combat et vos exploits physiques. Elle s'acquiert en vainquant des ennemis du Wyrm, en survivant à des situations désespérées, ou en accomplissant des prouesses légendaires."
    },
    {
        key: 'honor',
        title: 'Honneur',
        color: 'text-stone-300',
        description: "L'Honneur reflète votre intégrité, votre respect des traditions et votre parole. Il se gagne en tenant ses promesses, en protégeant les lieux sacrés, et en faisant preuve de justice et de loyauté envers la meute et la Sept."
    },
    {
        key: 'wisdom',
        title: 'Sagesse',
        color: 'text-emerald-400',
        description: "La Sagesse représente votre compréhension spirituelle, votre calme et votre jugement. Elle s'obtient par la médiation, la purification, l'apprentissage des rituels et la résolution pacifique de conflits."
    }
];

export default function RenownGuide() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-stone-900/40 rounded-xl border border-stone-800 overflow-hidden mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-stone-900/60 hover:bg-stone-800/60 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <Info size={20} className="text-amber-600" />
                    <span className="font-serif text-stone-300 text-lg">Comprendre la Renommée</span>
                </div>
                <ChevronDown
                    size={20}
                    className={`text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-stone-800/50">
                            {GUIDE_ITEMS.map((item) => (
                                <div key={item.key} className="space-y-2">
                                    <h4 className={`font-serif font-bold ${item.color} flex items-center gap-2`}>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-stone-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
