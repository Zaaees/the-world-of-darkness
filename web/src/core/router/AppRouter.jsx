import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';

// Modules
import { VampireModule } from '../../modules/vampire';

// Loading Component
const Loading = () => <div className="p-10 text-center text-white">Chargement du module...</div>;

// Redirection intelligente qui préserve le hash (pour l'auth Discord)
const RootRedirect = () => {
    const { hash } = useLocation();
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

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/vampire" replace />} />
        </Routes>
    );
}
