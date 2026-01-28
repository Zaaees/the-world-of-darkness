import React from 'react';
import '../assets/werewolf-theme.css';

/**
 * WizardLayout
 * Layout simplifié pour le processus de création de personnage.
 * Focus sur le contenu central sans distractions.
 * 
 * @param {React.ReactNode} children - Le contenu de l'étape
 * @param {string} title - Titre principal de la page
 * @param {string} subtitle - Sous-titre ou instruction
 */
export default function WizardLayout({ children, title, subtitle }) {
    return (
        <div className="theme-werewolf min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-7xl">
                <div className="mb-8 text-center">
                    {title && <h1 className="text-4xl md:text-5xl font-serif text-red-600 mb-3 tracking-wide drop-shadow-lg">{title}</h1>}
                    {subtitle && <p className="text-xl text-gray-400 font-sans max-w-2xl mx-auto">{subtitle}</p>}
                </div>
                <div className="bg-gray-800 bg-opacity-80 border border-gray-700 rounded-xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
                    {children}
                </div>
            </div>
        </div>
    );
}
