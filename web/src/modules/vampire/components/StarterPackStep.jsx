import React, { useMemo } from 'react';
import starterPackData from '../../../assets/starter_pack_data.json';

export default function StarterPackStep({ selectedClan, answers, onAnswerChange }) {
    const clanQuestions = starterPackData.vampire.clans[selectedClan.id] || [];

    // Select the first 3 questions (or fallback)
    const questions = useMemo(() => {
        return [
            clanQuestions[0] || "Décrivez votre première nuit en tant que Damné.",
            clanQuestions[1] || "Comment percevez-vous la Bête qui sommeille en vous ?",
            clanQuestions[2] || "Quel lien vous unit encore à l'humanité, si tant est qu'il en reste un ?"
        ];
    }, [selectedClan.id, clanQuestions]);

    return (
        <div className="flex flex-col gap-6 text-stone-200 mt-6 bg-stone-900/50 p-6 rounded-lg border border-stone-800">
            <h3 className="text-xl font-serif text-red-600 mb-2">
                L'Éveil de votre Sang
            </h3>
            <p className="text-stone-400 mb-4 text-sm">
                Avant de sceller définitivement votre destin au sein de ce clan, prenez le temps de définir votre histoire. Ces réponses forgeront votre identité et seront conservées sur votre fiche de personnage. (Minimum 10 caractères par réponse).
            </p>

            <div className="bg-stone-950/80 p-5 rounded border border-stone-800">
                <p className="text-sm text-stone-300 mb-3 italic">{questions[0]}</p>
                <textarea
                    value={answers.q1 || ''}
                    onChange={(e) => onAnswerChange('q1', e.target.value)}
                    className="w-full bg-[#0c0a09] border border-stone-700 rounded p-3 text-stone-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>

            <div className="bg-stone-950/80 p-5 rounded border border-stone-800">
                <p className="text-sm text-stone-300 mb-3 italic">{questions[1]}</p>
                <textarea
                    value={answers.q2 || ''}
                    onChange={(e) => onAnswerChange('q2', e.target.value)}
                    className="w-full bg-[#0c0a09] border border-stone-700 rounded p-3 text-stone-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>

            <div className="bg-stone-950/80 p-5 rounded border border-stone-800">
                <p className="text-sm text-stone-300 mb-3 italic">{questions[2]}</p>
                <textarea
                    value={answers.q3 || ''}
                    onChange={(e) => onAnswerChange('q3', e.target.value)}
                    className="w-full bg-[#0c0a09] border border-stone-700 rounded p-3 text-stone-200 focus:border-red-800 focus:ring-1 focus:ring-red-800 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>
        </div>
    );
}
