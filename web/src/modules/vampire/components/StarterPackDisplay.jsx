import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import starterPackData from '../../../assets/starter_pack_data.json';

export default function StarterPackDisplay({ answers, clanId }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!answers || (!answers.q1 && !answers.q2 && !answers.q3)) {
        return null;
    }

    const clanQuestions = starterPackData.vampire.clans[clanId] || [];
    const q1 = clanQuestions[0] || "Décrivez votre première nuit en tant que Damné.";
    const q2 = clanQuestions[1] || "Comment percevez-vous la Bête qui sommeille en vous ?";
    const q3 = clanQuestions[2] || "Quel lien vous unit encore à l'humanité, si tant est qu'il en reste un ?";

    return (
        <div className="bg-stone-900/40 border border-stone-800 rounded-lg overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-stone-900/80 hover:bg-stone-800/80 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-red-700" />
                    <h3 className="text-lg font-serif text-stone-200">L'Éveil de votre Sang</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-5 border-t border-stone-800/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
                    {answers.q1 && (
                        <div className="pl-4 border-l-2 border-red-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{q1}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.q1}
                            </p>
                        </div>
                    )}

                    {answers.q2 && (
                        <div className="pl-4 border-l-2 border-red-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{q2}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.q2}
                            </p>
                        </div>
                    )}

                    {answers.q3 && (
                        <div className="pl-4 border-l-2 border-red-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{q3}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.q3}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
