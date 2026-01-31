import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RequireWerewolfRole from './components/RequireWerewolfRole';
import WerewolfLoading from './components/WerewolfLoading';

import CreateCharacter from './pages/CreateCharacter';
import CharacterSheet from './pages/CharacterSheet';
import WerewolfAdminPage from './pages/WerewolfAdminPage';
import GiftsPage from './pages/GiftsPage/GiftsPage';
import WerewolfRenownPage from './pages/WerewolfRenownPage';

import WerewolfNavbar from './components/WerewolfNavbar';

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
                    element={<CreateCharacter />}
                />

                {/* Fiche personnage - Story 3.1 & Default Home */}
                <Route
                    path="sheet"
                    element={<CharacterSheet />}
                />

                {/* Dons - Story 5.3 */}
                <Route
                    path="gifts"
                    element={<GiftsPage />}
                />

                {/* Hauts Faits - Renommée */}
                <Route
                    path="renown"
                    element={<WerewolfRenownPage />}
                />

                {/* Admin - Story 4.3 & New Gift Management */}
                <Route
                    path="admin"
                    element={<WerewolfAdminPage />}
                />

                {/* Redirect racine vers sheet (qui redirigera vers create si besoin) */}
                <Route path="/" element={<Navigate to="/werewolf/sheet" replace />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/werewolf/sheet" replace />} />
            </Routes>
        </RequireWerewolfRole>
    );
}
