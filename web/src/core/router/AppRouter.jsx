import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';

// Modules
import { VampireModule } from '../../modules/vampire';
import { WerewolfModule } from '../../modules/werewolf';

// Hook pour les rôles
import { useUserRoles } from '../hooks/useUserRoles';

// Page sans rôle
import NoRolePage from '../components/NoRolePage';

// Loading Component
const Loading = () => <div className="p-10 text-center text-white">Chargement du module...</div>;

/**
 * Composant de redirection intelligente basée sur les rôles Discord.
 * Préserve le hash fragment pour l'authentification OAuth Discord.
 * 
 * Logique de redirection:
 * - Si rôle Werewolf → /werewolf/sheet
 * - Si rôle Vampire → /vampire
 * - Si aucun rôle (mais authentifié) → page immersive "accès refusé"
 * - Si non authentifié → /vampire (pour le flux login)
 */
const RootRedirect = () => {
    const { hash } = useLocation();
    const { isLoading, hasWerewolfRole, hasVampireRole, isAuthenticated, error } = useUserRoles();

    // Pendant le chargement, afficher un loader
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
                <div className="text-stone-500 animate-pulse">Détection de votre monde...</div>
            </div>
        );
    }

    if (error && isAuthenticated) {
        return <main className="min-h-screen bg-stone-950 text-stone-200 p-8 text-center"><h1>Vérification temporairement indisponible</h1><p>Votre session Discord est ouverte, mais les rôles n'ont pas pu être vérifiés.</p><button onClick={() => window.location.reload()} className="border rounded px-4 py-2 mt-4">Réessayer</button></main>;
    }

    // Non authentifié → page vampire pour le login Discord
    if (!isAuthenticated) {
        return <Navigate to={`/vampire${hash}`} replace />;
    }

    // Redirection basée sur les rôles
    if (hasWerewolfRole) {
        return <Navigate to={`/werewolf/sheet${hash}`} replace />;
    }

    if (hasVampireRole) {
        return <Navigate to={`/vampire${hash}`} replace />;
    }

    // Authentifié mais aucun rôle de jeu → page immersive
    return <NoRolePage />;
};

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<RootRedirect />} />

            {/* Module Vampire */}
            <Route
                path={`${VampireModule.path}/*`}
                element={
                    <Suspense fallback={<Loading />}>
                        <VampireModule.RootComponent />
                    </Suspense>
                }
            />

            {/* Module Werewolf */}
            <Route
                path={`${WerewolfModule.path}/*`}
                element={
                    <Suspense fallback={<Loading />}>
                        <WerewolfModule.RootComponent />
                    </Suspense>
                }
            />

            {/* Catch-all - redirige vers la page racine pour re-détection */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
