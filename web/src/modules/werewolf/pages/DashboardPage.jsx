import React from 'react';
import { Link } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
import { useWerewolfProfile } from '../hooks/useWerewolfProfile';

/**
 * Page Dashboard Werewolf
 * Point d'entrée pour les utilisateurs avec le rôle Loup-Garou.
 * Affiche le thème Deep Woods et un message de bienvenue.
 */
export default function DashboardPage() {
    const { hasProfile, loading } = useWerewolfProfile();

    return (
        <WerewolfLayout>
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full text-center">
                    {/* Icône thématique */}
                    <div className="text-8xl mb-8 animate-pulse">🐺</div>

                    {/* Titre */}
                    <h1 className="text-4xl md:text-5xl font-header text-amber-200 mb-4 tracking-wide">
                        L'Appel de Gaïa
                    </h1>

                    {/* Sous-titre */}
                    <p className="text-emerald-400 font-serif text-xl mb-8">
                        Bienvenue, Enfant de la Lune
                    </p>

                    {/* Description */}
                    <div className="bg-stone-900/50 border border-emerald-900/30 rounded-lg p-6 backdrop-blur-sm">
                        <p className="text-stone-300 leading-relaxed">
                            Tu as répondu à l'appel ancestral. Les esprits de la forêt
                            murmurent ton nom dans le vent nocturne. La rage de Gaïa
                            coule dans tes veines, prête à défendre Mère Nature contre
                            les forces du Wyrm.
                        </p>
                    </div>

                    {/* Actions de navigation */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        {loading ? (
                            <div className="px-8 py-3 text-amber-100/50 font-header animate-pulse">
                                ... Communication avec les Esprits ...
                            </div>
                        ) : hasProfile ? (
                            <Link
                                to="/werewolf/sheet"
                                className="px-8 py-3 bg-amber-900/30 border border-amber-600/50 text-amber-100 rounded-lg hover:bg-amber-800/40 transition-all font-header tracking-widest uppercase text-sm shadow-lg shadow-black/20"
                            >
                                Voir ma Fiche
                            </Link>
                        ) : (
                            <Link
                                to="/werewolf/create"
                                className="px-8 py-3 bg-emerald-900/30 border border-emerald-600/50 text-emerald-100 rounded-lg hover:bg-emerald-800/40 transition-all font-header tracking-widest uppercase text-sm shadow-lg shadow-black/20 animate-pulse"
                            >
                                Créer mon Personnage
                            </Link>
                        )}
                    </div>

                    {/* Message d'état */}
                    <div className="mt-8 text-stone-500 text-sm">
                        <p>Module Werewolf en cours de développement</p>
                        <p className="mt-2 text-xs text-stone-600">
                            Les fonctionnalités de gestion de la fiche arriveront prochainement.
                        </p>
                    </div>
                </div>
            </div>
        </WerewolfLayout>
    );
}
