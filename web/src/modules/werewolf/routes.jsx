import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireWerewolfRole from './components/RequireWerewolfRole';
import WerewolfLoading from './components/WerewolfLoading';

// Lazy load des pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CreateCharacter = lazy(() => import('./pages/CreateCharacter'));
const CharacterSheet = lazy(() => import('./pages/CharacterSheet'));

/**
 * Routes internes du module Werewolf.
 * Gère le routing au sein du module avec le layout Deep Woods.
 * TOUTES les routes sont protégées par RequireWerewolfRole.
 */
export default function WerewolfRoutes() {
    return (
        <RequireWerewolfRole>
            <Routes>
                {/* Création de personnage - Story 2.3 */}
                <Route
                    path="create"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <CreateCharacter />
                        </Suspense>
                    }
                />

                {/* Fiche personnage - Story 3.1 */}
                <Route
                    path="sheet"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <CharacterSheet />
                        </Suspense>
                    }
                />

                {/* Dashboard - page d'accueil du module */}
                <Route
                    path="dashboard"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <DashboardPage />
                        </Suspense>
                    }
                />

                {/* Redirect racine vers dashboard */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />

                {/* Catch-all - redirige vers dashboard */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </RequireWerewolfRole>
    );
}
