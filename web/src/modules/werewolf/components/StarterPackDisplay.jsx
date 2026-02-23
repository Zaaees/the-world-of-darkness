import React, { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import starterPackData from '../../../assets/starter_pack_data.json';

export default function StarterPackDisplay({ character }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!character || !character.starter_pack_answers) {
        return null;
    }

    const answers = character.starter_pack_answers;
    // Vérifier s'il y a des réponses non vides
    if (!answers.breed && !answers.auspice && !answers.tribu) {
        return null;
    }

    // Récupérer les questions pour la race, l'auspice et la tribu du personnage
    const breedQuestions = starterPackData.werewolf.breeds[character.breed] || [];
    const auspiceQuestions = starterPackData.werewolf.auspices[character.auspice] || [];
    const tribeQuestions = starterPackData.werewolf.tribes[character.tribe] || [];

    const qs = {
        breed: breedQuestions[0] || "Parlez-nous de votre métamorphose.",
        auspice: auspiceQuestions[0] || "Quelle est votre relation avec votre lune de naissance ?",
        tribu: tribeQuestions[0] || "Pourquoi avoir rejoint cette tribu ?"
    };

    return (
        <div className="bg-stone-900/40 border border-stone-800 rounded-lg overflow-hidden mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-stone-900/80 hover:bg-stone-800/80 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-red-700" />
                    <h3 className="text-lg font-serif text-stone-200">Aux Origines de la Légende</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="p-5 border-t border-stone-800/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
                    {/* Race */}
                    {answers.breed && (
                        <div className="pl-4 border-l-2 border-emerald-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{qs.breed}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.breed}
                            </p>
                        </div>
                    )}

                    {/* Auspice */}
                    {answers.auspice && (
                        <div className="pl-4 border-l-2 border-amber-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{qs.auspice}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.auspice}
                            </p>
                        </div>
                    )}

                    {/* Tribu */}
                    {answers.tribu && (
                        <div className="pl-4 border-l-2 border-red-900/50">
                            <p className="text-sm italic text-stone-500 mb-2">{qs.tribu}</p>
                            <p className="text-stone-300 whitespace-pre-line text-sm leading-relaxed">
                                {answers.tribu}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
