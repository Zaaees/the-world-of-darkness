import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';

// Modules
import { VampireModule } from '../../modules/vampire';
import { WerewolfModule } from '../../modules/werewolf';

// Hook pour les rôles
import { useUserRoles } from '../hooks/useUserRoles';

// Loading Component
const Loading = () => <div className="p-10 text-center text-white">Chargement du module...</div>;

/**
 * Composant de redirection intelligente basée sur les rôles Discord.
 * Préserve le hash fragment pour l'authentification OAuth Discord.
 * 
 * Logique de redirection:
 * - Si rôle Werewolf → /werewolf/dashboard
 * - Sinon → /vampire (comportement par défaut)
 * - Si les deux rôles → Werewolf prioritaire (à affiner plus tard avec sélecteur)
 */
const RootRedirect = () => {
    const { hash } = useLocation();
    const { isLoading, hasWerewolfRole } = useUserRoles();

    // Pendant le chargement, afficher un loader
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0c0a09] flex items-center justify-center">
                <div className="text-stone-500 animate-pulse">Détection de votre monde...</div>
            </div>
        );
    }

    // Redirection basée sur les rôles
    if (hasWerewolfRole) {
        return <Navigate to={`/werewolf/sheet${hash}`} replace />;
    }

    // Par défaut, redirection vers Vampire (comportement existant préservé)
    return <Navigate to={`/vampire${hash}`} replace />;
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
