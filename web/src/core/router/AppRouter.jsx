import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';

// Modules
import { VampireModule } from '../../modules/vampire';

// Loading Component
const Loading = () => <div className="p-10 text-center text-white">Chargement du module...</div>;

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/vampire" replace />} />

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
