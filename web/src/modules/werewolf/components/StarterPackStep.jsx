import React, { useMemo } from 'react';
import starterPackData from '../../../assets/starter_pack_data.json';

export default function StarterPackStep({ formData, answers, onAnswerChange }) {
    // Determine the questions to ask based on formData
    const breedQuestions = starterPackData.werewolf.breeds[formData.breed] || [];
    const auspiceQuestions = starterPackData.werewolf.auspices[formData.auspice] || [];
    const tribeQuestions = starterPackData.werewolf.tribes[formData.tribu] || [];

    const selectedQuestions = useMemo(() => {
        return {
            breed: breedQuestions[0] || "Parlez-nous de votre métamorphose.",
            auspice: auspiceQuestions[0] || "Quelle est votre relation avec votre lune de naissance ?",
            tribu: tribeQuestions[0] || "Pourquoi avoir rejoint cette tribu ?"
        };
    }, [breedQuestions, auspiceQuestions, tribeQuestions]);

    return (
        <div className="flex flex-col gap-6 text-gray-200">
            <h3 className="text-xl font-bold font-bodoni text-red-500 mb-2">
                Le commencement de votre Légende
            </h3>
            <p className="text-gray-400 mb-4">
                Prenez quelques instants pour définir qui vous êtes vraiment. Vos réponses nous aideront à façonner votre histoire et seront inscrites sur votre fiche.
            </p>

            <div className="bg-gray-800/50 p-6 rounded border border-gray-700">
                <label className="block text-red-400 font-bold mb-2">Race</label>
                <p className="text-sm text-gray-400 mb-3 italic">{selectedQuestions.breed}</p>
                <textarea
                    value={answers.breed || ''}
                    onChange={(e) => onAnswerChange('breed', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>

            <div className="bg-gray-800/50 p-6 rounded border border-gray-700">
                <label className="block text-red-400 font-bold mb-2">Auspice</label>
                <p className="text-sm text-gray-400 mb-3 italic">{selectedQuestions.auspice}</p>
                <textarea
                    value={answers.auspice || ''}
                    onChange={(e) => onAnswerChange('auspice', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>

            <div className="bg-gray-800/50 p-6 rounded border border-gray-700">
                <label className="block text-red-400 font-bold mb-2">Tribu</label>
                <p className="text-sm text-gray-400 mb-3 italic">{selectedQuestions.tribu}</p>
                <textarea
                    value={answers.tribu || ''}
                    onChange={(e) => onAnswerChange('tribu', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px]"
                    placeholder="Votre réponse ici..."
                />
            </div>
        </div>
    );
}
