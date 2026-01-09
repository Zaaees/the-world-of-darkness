import React, { useState } from 'react';
import { Book, Skull } from 'lucide-react'; // Example icons
import { useGrimoireStore } from '../stores/useGrimoireStore';
import RequirementWarningModal from './RequirementWarningModal';

const RitualCard = ({ ritual }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [warningReason, setWarningReason] = useState('');

    const learnRitual = useGrimoireStore(state => state.learnRitual);
    const checkLearnability = useGrimoireStore(state => state.checkLearnability);

    // Check if already learned to disable/hide button (Optional per story, but good UX)
    const activeCharacter = useGrimoireStore(state => state.activeCharacter);
    const isLearned = activeCharacter?.rituals?.includes(ritual.id.toString()) ?? false;
    const setSelectedRitual = useGrimoireStore(state => state.setSelectedRitual);

    const handleLearnClick = (e) => {
        e.stopPropagation(); // Prevent card click

        const check = checkLearnability(ritual.id);
        if (check.allowed) {
            learnRitual(ritual.id);
        } else {
            setWarningReason(check.reason);
            setIsModalOpen(true);
        }
    };

    const handleConfirmForce = () => {
        learnRitual(ritual.id, true);
        setIsModalOpen(false);
    };

    // Style handling moved to parent container for Grid compat
    return (
        <div className="h-full w-full">
            <div
                onClick={() => setSelectedRitual(ritual)}
                className="h-full border border-stone-800 bg-stone-900/80 rounded p-4 cursor-pointer flex flex-col justify-between group relative
                    transition-all duration-200 ease-out
                    hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/20
                    hover:border-red-700/50 hover:bg-stone-800
                    active:scale-[0.98]
                    motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
            >
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-serif text-lg text-amber-50 group-hover:text-amber-500 transition-colors truncate pr-2" title={ritual.name}>
                            {ritual.name}
                        </h3>
                        <span className="text-xs uppercase tracking-wider text-stone-500 border border-stone-700 px-1.5 py-0.5 rounded">
                            Niveau {ritual.level}
                        </span>
                    </div>

                    <div className="text-sm text-stone-400 flex items-center gap-2">
                        {['Necromancy', 'Necromancie'].includes(ritual.discipline) ? <Skull size={14} /> : <Book size={14} />}
                        <span>{ritual.discipline}</span>
                    </div>
                </div>

                {/* Attribution Action (GM View / Story 3.1) */}
                <div className="mt-4 pt-4 border-t border-stone-800/50 flex justify-end">
                    {isLearned ? (
                        <span className="text-xs text-green-500 font-medium px-2 py-1 bg-green-950/20 rounded border border-green-900/30">
                            Appris
                        </span>
                    ) : (
                        <button
                            onClick={handleLearnClick}
                            className="text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-amber-500 border border-stone-700 hover:border-amber-700 px-3 py-1 min-h-[44px] min-w-[44px] rounded transition-all bg-stone-950/50 hover:bg-stone-900"
                        >
                            Apprendre
                        </button>
                    )}
                </div>
            </div>

            <RequirementWarningModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmForce}
                reason={warningReason}
                ritualName={ritual.name}
            />
        </div>
    );
};

export default RitualCard;
