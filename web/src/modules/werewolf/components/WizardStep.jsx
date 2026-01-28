import React from 'react';

/**
 * WizardStep
 * Affiche une étape de sélection avec options sous forme de cartes.
 *
 * @param {Array} options - Liste d'objets { id, title, description, image, quote }
 * @param {Function} onSelect - Callback avec l'ID sélectionné
 * @param {string} selectedId - ID de l'option actuellement sélectionnée
 */
export default function WizardStep({ options, onSelect, selectedId }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((option) => (
                <div
                    key={option.id}
                    onClick={() => onSelect(option.id)}
                    className={`
                        cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform
                        ${selectedId === option.id
                            ? 'border-red-600 bg-gray-800 scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800 hover:-translate-y-1'
                        }
                    `}
                >
                    {/* Image Header with Gradient Overlay */}
                    <div className="h-48 w-full relative bg-gray-900 overflow-hidden border-b border-gray-700">
                        {option.image ? (
                            <img
                                src={option.image}
                                alt={option.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-6xl select-none">
                                {option.icon || '🐺'}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

                        {/* Title Overlay on Image */}
                        <div className="absolute bottom-3 left-4 right-4">
                            <h3 className={`text-2xl font-bold font-serif tracking-wider ${selectedId === option.id ? 'text-red-500' : 'text-gray-100 group-hover:text-red-400'
                                } transition-colors`}>
                                {option.title}
                            </h3>
                        </div>
                    </div>

                    <div className="p-6">
                        {option.quote && (
                            <blockquote className="italic text-sm text-gray-400 mb-4 border-l-2 border-red-900/50 pl-3 leading-relaxed">
                                "{option.quote}"
                            </blockquote>
                        )}
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                            {option.description}
                        </p>
                    </div>

                    {/* Selection Checkmark */}
                    {selectedId === option.id && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow-lg z-10 animate-fade-in-up">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
