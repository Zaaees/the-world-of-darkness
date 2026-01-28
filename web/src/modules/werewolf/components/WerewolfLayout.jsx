import React from 'react';
import '../assets/werewolf-theme.css';
import WerewolfNavbar from './WerewolfNavbar';

/**
 * WerewolfLayout
 * Enveloppe le contenu du module Werewolf pour appliquer le thème visuel spécifique.
 * Isole tous les styles en utilisant la classe .theme-werewolf.
 * Inclut la barre de navigation si l'utilisateur est connecté.
 */
export default function WerewolfLayout({ children }) {
    return (
        <div className="theme-werewolf min-h-screen">
            <WerewolfNavbar />
            {children}
        </div>
    );
}
