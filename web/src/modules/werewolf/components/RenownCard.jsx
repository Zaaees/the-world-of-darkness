import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy, Medal, BookOpen, Clock } from 'lucide-react';

const TYPE_CONFIG = {
    glory: {
        label: "Gloire",
        gradient: "from-amber-950/40 to-stone-950",
        border: "group-hover:border-amber-900/40",
        text: "text-amber-500",
        bgIcon: "bg-amber-900/20",
        icon: Trophy
    },
    honor: {
        label: "Honneur",
        gradient: "from-stone-900 to-stone-950",
        border: "group-hover:border-stone-700/60",
        text: "text-stone-300",
        bgIcon: "bg-stone-800/30",
        icon: Medal
    },
    wisdom: {
        label: "Sagesse",
        gradient: "from-emerald-950/30 to-stone-950",
        border: "group-hover:border-emerald-900/40",
        text: "text-emerald-400",
        bgIcon: "bg-emerald-900/20",
        icon: BookOpen
    }
};

export default function RenownCard({ type, score, items }) {
    const [isOpen, setIsOpen] = useState(false);
    // Ensure we have a valid config, fallback to glory if type not found
    const normalizedType = type ? type.toLowerCase() : 'glory';
    const config = TYPE_CONFIG[normalizedType] || TYPE_CONFIG.glory;
    const Icon = config.icon;

    return (
        <div className="h-full flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full text-left relative overflow-hidden rounded-xl border border-stone-800/60 
          bg-gradient-to-br ${config.gradient}
          transition-all duration-300 cursor-pointer group
          hover:shadow-lg ${config.border}
          flex flex-col
        `}
            >
                {/* Header Section */}
                <div className="p-5 flex items-start justify-between relative z-10 w-full">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${config.bgIcon} border border-stone-700/30 flex items-center justify-center shrink-0`}>
                            <Icon size={24} className={config.text} />
                        </div>
                        <div>
                            <h3 className={`font-serif text-xl tracking-wide text-stone-200 group-hover:text-white transition-colors`}>
                                {config.label}
                            </h3>
                            <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-medium">
                                Total Renommée
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className={`text-3xl font-serif font-bold ${config.text}`}>
                            {score}
                        </span>
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            className="mt-2 text-stone-600"
                        >
                            <ChevronDown size={18} />
                        </motion.div>
                    </div>
                </div>

                {/* Content Section (List of Deeds) */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-stone-800/50 bg-stone-950/20 w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar cursor-default">
                                {items.length === 0 ? (
                                    <p className="text-sm text-stone-600 italic text-center py-2">
                                        Aucun haut fait validé pour le moment.
                                    </p>
                                ) : (
                                    items.map((item) => (
                                        <div key={item.id || item.title} className="bg-stone-900/40 rounded border border-stone-800/40 p-3 hover:border-stone-700/50 transition-colors">
                                            <div className="flex justify-between items-start gap-3 mb-1">
                                                <h4 className="text-stone-300 font-serif text-sm font-medium leading-tight">
                                                    {item.title}
                                                </h4>
                                                {item.validated_at && (
                                                    <span className="text-[10px] text-stone-600 flex items-center gap-1 shrink-0 bg-stone-950 px-1.5 py-0.5 rounded">
                                                        <Clock size={10} />
                                                        {new Date(item.validated_at).toLocaleDateString('fr-FR')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-stone-500 leading-relaxed">
                                                {item.description}
                                            </p>
                                            {item.xp_awarded > 0 && (
                                                <div className="mt-2 flex justify-end">
                                                    <span className="text-[10px] text-amber-500/80 font-medium px-2 py-0.5 bg-amber-950/20 rounded border border-amber-900/20">
                                                        +{item.xp_awarded} XP
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Background Decorative */}
                <div className={`absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700`}>
                    <Icon size={160} />
                </div>
            </button>
        </div>
    );
}
