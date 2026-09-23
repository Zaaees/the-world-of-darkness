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
        <div className="theme-werewolf ww-archive min-h-screen">
            <WerewolfNavbar />
            <div className="ww-landscape" aria-hidden="true" />
            {children}
        </div>
    );
}
