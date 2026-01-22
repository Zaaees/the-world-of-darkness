import React from 'react';
import '../assets/werewolf-theme.css';

/**
 * WerewolfLayout
 * Wraps the Werewolf module content to apply the specific visual theme.
 * Scopes all styles using the .theme-werewolf class.
 */
export default function WerewolfLayout({ children }) {
    return (
        <div className="theme-werewolf min-h-screen">
            {children}
        </div>
    );
}
