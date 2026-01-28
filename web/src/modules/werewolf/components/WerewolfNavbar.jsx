import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useWerewolfProfile } from '../hooks/useWerewolfProfile';
import { useUserRoles } from '../../../core/hooks/useUserRoles';

export default function WerewolfNavbar() {
    const { profile, hasProfile } = useWerewolfProfile();
    const { isMJ } = useUserRoles();

    return (
        <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg bg-opacity-95 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to={hasProfile ? "/werewolf/sheet" : "/werewolf/create"} className="font-serif text-2xl text-red-600 font-bold tracking-wider hover:text-red-500 transition">
                            WOD
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {!hasProfile ? (
                                <NavLink
                                    to="/werewolf/create"
                                    className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-red-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                >
                                    Créer un Personnage
                                </NavLink>
                            ) : (
                                <>
                                    <NavLink
                                        to="/werewolf/sheet"
                                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-red-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    >
                                        Ma Fiche
                                    </NavLink>
                                    <NavLink
                                        to="/werewolf/gifts"
                                        className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-red-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                                    >
                                        Mes Dons
                                    </NavLink>
                                </>
                            )}
                            {isMJ && (
                                <NavLink
                                    to="/werewolf/admin"
                                    className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-amber-900 text-amber-100' : 'text-amber-500 hover:bg-amber-900/50 hover:text-amber-200'}`}
                                >
                                    Admin (MJ)
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* Status Info (Rank) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400 text-xs uppercase tracking-widest">Rang</span>
                            <span className="text-amber-500 font-serif font-bold text-lg leading-none">
                                {profile?.rank || 1}
                            </span>
                        </div>
                        {/* Rage Indicator (Placeholder for now as backend doesn't send it yet) */}
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500 text-[10px] uppercase">Rage</span>
                            <div className="flex space-x-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${i < 0 ? 'bg-red-600' : 'bg-gray-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (simplified) */}
            <div className="md:hidden border-t border-gray-800 bg-gray-900">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around">
                    {!hasProfile ? (
                        <NavLink to="/werewolf/create" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>Créer</NavLink>
                    ) : (
                        <>
                            <NavLink to="/werewolf/sheet" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>Fiche</NavLink>
                            <NavLink to="/werewolf/gifts" className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>Dons</NavLink>
                        </>
                    )}
                    {isMJ && <NavLink to="/werewolf/admin" className="block px-3 py-2 rounded-md text-base font-medium text-amber-500">Admin</NavLink>}
                </div>
            </div>
        </nav>
    );
}
