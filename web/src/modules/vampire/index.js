import { lazy } from 'react';

// Lazy load the routes component
const VampireRoutes = lazy(() => import('./routes'));

export const VampireModule = {
    id: 'vampire',
    name: 'Vampire: La Mascarade',
    path: '/vampire',
    icon: '🩸',
    RootComponent: VampireRoutes,
};
