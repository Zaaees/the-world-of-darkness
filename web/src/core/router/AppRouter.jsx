import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';

// Modules
import { VampireModule } from '../../modules/vampire';

// Layouts or Core Pages (Placeholders for now)
const Home = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">World of Darkness</h1>
        <div className="flex gap-4">
            <Link to="/vampire" className="px-6 py-3 bg-red-900 rounded hover:bg-red-800 transition">
                Vampire: La Mascarade
            </Link>
            {/* Future modules here */}
        </div>
    </div>
);

// Loading Component
const Loading = () => <div className="p-10 text-center text-white">Chargement du module...</div>;

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />

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
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
