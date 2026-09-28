// site-content: migrated
import { displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * WizardStep
 * Affiche une étape de sélection avec options sous forme de cartes extensibles.
 * Inspiré du pattern ClanSelectionPage côté Vampire.
 *
 * @param {Array} options - Liste d'objets { id, title, description, image, quote, long_description, roleplay, specificities }
 * @param {Function} onSelect - Callback avec l'ID sélectionné
 * @param {string} selectedId - ID de l'option actuellement sélectionnée
 */
export default function WizardStep({ options, onSelect, selectedId }) {
    useSiteContent();
    const [expandedId, setExpandedId] = useState(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.map((option) => {
                const isSelected = selectedId === option.id;
                const isExpanded = expandedId === option.id;

                return (
                    <div
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`
                            cursor-pointer group relative overflow-hidden rounded-xl border-2 transition-all duration-300 transform
                            ${isSelected
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
                                    alt={displayText("werewolf", option.title)}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-6xl select-none">
                                    {displayText("werewolf", option.icon || '🐺')}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>

                            {/* Title Overlay on Image */}
                            <div className="absolute bottom-3 left-4 right-4">
                                <h3 className={`text-2xl font-bold font-serif tracking-wider ${isSelected ? 'text-red-500' : 'text-gray-100 group-hover:text-red-400'
                                    } transition-colors`}>
                                    {displayText("werewolf", option.title)}
                                </h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Citation courte (toujours visible) */}
                            {option.quote && (
                                <blockquote className="italic text-sm text-gray-400 mb-4 border-l-2 border-red-900/50 pl-3 leading-relaxed">
                                    "{displayText("werewolf", option.quote)}"
                                </blockquote>
                            )}

                            {/* Description courte (toujours visible) */}
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {displayText("werewolf", option.description)}
                            </p>

                            {/* Zone étendue (conditionnelle) */}
                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3 animate-in fade-in duration-300">
                                    {/* Description longue */}
                                    {option.long_description && (
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {displayText("werewolf", option.long_description)}
                                        </p>
                                    )}

                                    {/* Spécificités */}
                                    {option.specificities && (
                                        <div className="bg-gray-900/60 p-3 rounded border border-gray-700">
                                            <p className="text-gray-300 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01705" /></p>
                                            <p className="text-gray-400 text-xs whitespace-pre-line">{displayText("werewolf", option.specificities)}</p>
                                        </div>
                                    )}

                                    {/* Roleplay */}
                                    {option.roleplay && (
                                        <div className="bg-red-950/20 p-3 rounded border border-red-900/30">
                                            <p className="text-amber-600 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01706" /></p>
                                            <p className="text-gray-500 text-xs italic leading-relaxed">{displayText("werewolf", option.roleplay)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bouton d'expansion (si contenu étendu disponible) */}
                        {(option.long_description || option.specificities || option.roleplay) && (
                            <button
                                className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-300 border-t border-gray-700 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedId(isExpanded ? null : option.id);
                                }}
                            >
                                {isExpanded ? (
                                    <><SiteText contentKey="werewolf.text.01707" /><ChevronUp className="w-3 h-3" /></>
                                ) : (
                                    <><SiteText contentKey="werewolf.text.01708" /><ChevronDown className="w-3 h-3" /></>
                                )}
                            </button>
                        )}

                        {/* Selection Checkmark */}
                        {isSelected && (
                            <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 shadow-lg z-10 animate-fade-in-up">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
