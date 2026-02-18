import { Routes, Route, Navigate } from 'react-router-dom';
import RequireWerewolfRole from './components/RequireWerewolfRole';

import CreateCharacter from './pages/CreateCharacter';
import CharacterSheet from './pages/CharacterSheet';
import WerewolfAdminPage from './pages/WerewolfAdminPage';

/**
 * Routes internes du module Werewolf.
 * Gère le routing au sein du module avec le layout Deep Woods.
 * TOUTES les routes sont protégées par RequireWerewolfRole.
 *
 * Les routes /sheet, /gifts et /renown pointent toutes vers CharacterSheet
 * qui gère les onglets en interne (architecture SPA) pour une navigation instantanée.
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

                {/* Fiche personnage (onglet par défaut) */}
                <Route
                    path="sheet"
                    element={<CharacterSheet initialTab="sheet" />}
                />

                {/* Dons — SPA Tab dans CharacterSheet */}
                <Route
                    path="gifts"
                    element={<CharacterSheet initialTab="gifts" />}
                />

                {/* Hauts Faits — SPA Tab dans CharacterSheet */}
                <Route
                    path="renown"
                    element={<CharacterSheet initialTab="renown" />}
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
