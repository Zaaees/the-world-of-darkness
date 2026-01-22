import { lazy } from 'react';

// Lazy load des routes du module
const WerewolfRoutes = lazy(() => import('./routes'));

/**
 * Module Werewolf - Loup-Garou: L'Apocalypse
 * 
 * Exporte la configuration du module pour le routeur principal.
 * Pattern identique au VampireModule.
 */
export const WerewolfModule = {
    id: 'werewolf',
    name: 'Loup-Garou',
    path: '/werewolf',
    icon: '🐺',
    RootComponent: WerewolfRoutes,
};

// Export par défaut pour compatibilité
export default WerewolfModule;
