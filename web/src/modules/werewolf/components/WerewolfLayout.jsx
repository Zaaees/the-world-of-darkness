import React from 'react';
import '../assets/werewolf-theme.css';

/**
 * WerewolfLayout
 * Enveloppe le contenu du module Werewolf pour appliquer le thème visuel spécifique.
 * Isole tous les styles en utilisant la classe .theme-werewolf.
 */
export default function WerewolfLayout({ children }) {
    return (
        <div className="theme-werewolf min-h-screen">
            {children}
        </div>
    );
}
