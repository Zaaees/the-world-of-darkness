import React from 'react';
import { Book, Skull, Scroll, Diamond } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useGrimoireStore } from '../stores/useGrimoireStore';
import { getDisciplineName } from '../../../../../utils/translations';

const RitualCard = ({ ritual }) => {

    // Simplified card for Grimoire viewing
    // Data-only, no actions

    return (
        <div className="h-full w-full">
            <div
                onClick={() => useGrimoireStore.getState().setSelectedRitual(ritual)}
                className="h-full border border-stone-800 bg-[#1c1917] hover:bg-[#201d1b] rounded-sm p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden
                    transition-all duration-200 ease-out
                    hover:scale-[1.02] active:scale-[0.98]
                    hover:border-red-700/50 hover:shadow-lg
                    motion-reduce:hover:scale-100 motion-reduce:active:scale-100
                    before:absolute before:inset-0 before:bg-noise before:opacity-30 before:pointer-events-none"
            >
                {/* Decorative corners */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-stone-800 group-hover:border-red-900/50 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-stone-800 group-hover:border-red-900/50 transition-colors"></div>

                <div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <h3 className="font-serif text-lg text-stone-200 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight" title={ritual.name}>
                            {ritual.name}
                        </h3>
                        {['Necromancy', 'Nécromancie', 'necromancy'].includes(ritual.discipline)
                            ? <Skull size={16} className="text-stone-600 group-hover:text-stone-400 flex-shrink-0 mt-1" />
                            : <Book size={16} className="text-stone-600 group-hover:text-stone-400 flex-shrink-0 mt-1" />
                        }
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-stone-500 border border-stone-800/50 px-1.5 py-0.5 rounded bg-stone-950/30">
                            Niveau {ritual.level}
                        </span>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center gap-2 border-t border-stone-800/50 pt-3 relative z-10">
                        <div className={`w-1.5 h-1.5 rotate-45 ${['Necromancy', 'Nécromancie', 'necromancy'].includes(ritual.discipline) ? 'bg-emerald-900' : 'bg-red-900'}`}></div>
                        <span className="font-serif italic tracking-wide">{getDisciplineName(ritual.discipline)}</span>
                    </div>
                </div>

                {/* Subtle bottom glow on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900/0 to-transparent group-hover:via-red-900/30 transition-all duration-500"></div>
            </div>
        </div>
    );
};

export default RitualCard;
