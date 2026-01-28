import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireWerewolfRole from './components/RequireWerewolfRole';
import WerewolfLoading from './components/WerewolfLoading';

// Lazy load des pages
const CreateCharacter = lazy(() => import('./pages/CreateCharacter'));
const CharacterSheet = lazy(() => import('./pages/CharacterSheet'));
const WerewolfAdminPage = lazy(() => import('./pages/WerewolfAdminPage'));
const GiftsPage = lazy(() => import('./pages/GiftsPage/GiftsPage'));

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

                {/* Fiche personnage - Story 3.1 & Default Home */}
                <Route
                    path="sheet"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <CharacterSheet />
                        </Suspense>
                    }
                />

                {/* Dons - Story 5.3 */}
                <Route
                    path="gifts"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <GiftsPage />
                        </Suspense>
                    }
                />

                {/* Admin - Story 4.3 & New Gift Management */}
                <Route
                    path="admin"
                    element={
                        <Suspense fallback={<WerewolfLoading />}>
                            <WerewolfAdminPage />
                        </Suspense>
                    }
                />

                {/* Redirect racine vers sheet (qui redirigera vers create si besoin) */}
                <Route path="/" element={<Navigate to="sheet" replace />} />
                <Route path="dashboard" element={<Navigate to="sheet" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="sheet" replace />} />
            </Routes>
        </RequireWerewolfRole>
    );
}
