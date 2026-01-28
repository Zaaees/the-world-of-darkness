import React, { useState, useEffect } from 'react';
import { useUserRoles } from '../../../../core/hooks/useUserRoles';
import { Shield, ChevronDown, User, Monitor, Gift, Loader, Save } from 'lucide-react';
import { API_URL } from '../../../../config'; // Correct path to web/src/config.js

// Composant Page
export default function AdminGiftsPage() {
    const { isAuthenticated, discordUser, guildId } = useUserRoles();
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gifts, setGifts] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [loadingGifts, setLoadingGifts] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Initial Load: Players
    useEffect(() => {
        const fetchPlayers = async () => {
            if (!isAuthenticated || !discordUser?.id || !guildId) return;
            try {
                const response = await fetch(`${API_URL}/api/modules/werewolf/admin/players`, {
                    headers: {
                        'X-Discord-User-ID': discordUser.id,
                        'X-Discord-Guild-ID': guildId
                    }
                });

                if (response.status === 403) {
                    setAccessDenied(true);
                    setLoadingPlayers(false);
                    return;
                }

                if (!response.ok) throw new Error("Erreur API");

                const data = await response.json();
                setPlayers(data.players || []);
                setLoadingPlayers(false);
            } catch (err) {
                console.error(err);
                setError("Erreur chargement joueurs");
                setLoadingPlayers(false);
            }
        };
        fetchPlayers();
    }, [isAuthenticated, discordUser, guildId]);

    // Fetch Gifts when Player selected
    useEffect(() => {
        if (!selectedPlayer || !discordUser?.id || !guildId) {
            setGifts([]);
            return;
        }

        const fetchGifts = async () => {
            setLoadingGifts(true);
            try {
                const response = await fetch(`${API_URL}/api/modules/werewolf/admin/players/${selectedPlayer}/gifts`, {
                    headers: {
                        'X-Discord-User-ID': discordUser.id,
                        'X-Discord-Guild-ID': guildId
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setGifts(data.gifts || []);
                }
            } catch (err) {
                console.error("Error fetching gifts:", err);
            } finally {
                setLoadingGifts(false);
            }
        };

        fetchGifts();
    }, [selectedPlayer, discordUser, guildId]);

    const handleToggleGift = async (giftId, currentState) => {
        // Optimistic update
        setGifts(prev => prev.map(g =>
            g.id === giftId ? { ...g, unlocked: !currentState } : g
        ));

        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/gifts/unlock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser.id,
                    'X-Discord-Guild-ID': guildId
                },
                body: JSON.stringify({
                    playerId: selectedPlayer,
                    giftId,
                    unlock: !currentState
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update");
            }

            // Show toast/success
            setSuccessMsg("Mise à jour effectuée");
            setTimeout(() => setSuccessMsg(null), 3000);

        } catch (err) {
            console.error("Update failed:", err);
            // Revert on error
            setGifts(prev => prev.map(g =>
                g.id === giftId ? { ...g, unlocked: currentState } : g
            ));
            setError("Erreur lors de la mise à jour");
            setTimeout(() => setError(null), 3000);
        }
    };

    if (loadingPlayers) {
        return <div className="p-10 text-center text-gray-500"><Loader className="w-8 h-8 animate-spin mx-auto" /> Chargement...</div>;
    }

    if (accessDenied) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
                <Shield className="w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold">Accès Refusé</h1>
                <p>Accès réservé aux Conteurs (MJ).</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                <Monitor className="w-8 h-8 text-purple-400" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Administration des Dons</h1>
                    <p className="text-gray-400">Gérer les dons et pouvoirs des joueurs</p>
                </div>
            </header>

            {successMsg && (
                <div className="bg-green-800 text-green-100 p-3 rounded-md flex items-center animate-pulse">
                    <Save className="w-4 h-4 mr-2" /> {successMsg}
                </div>
            )}

            {error && error !== "Erreur chargement joueurs" && (
                <div className="bg-red-800 text-red-100 p-3 rounded-md flex items-center">
                    <Shield className="w-4 h-4 mr-2" /> {error}
                </div>
            )}

            {/* Sélection du Joueur */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sélectionner un joueur
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        className="w-full bg-gray-900 border border-gray-700 rounded-md py-3 pl-10 pr-4 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                        value={selectedPlayer || ''}
                        onChange={(e) => setSelectedPlayer(e.target.value)}
                        aria-label="Sélectionner un joueur"
                    >
                        <option value="">-- Choisir un joueur --</option>
                        {players.map(player => (
                            <option key={player.id} value={player.id}>
                                {player.name} ({player.tribe})
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                {error === "Erreur chargement joueurs" && (
                    <p className="mt-2 text-sm text-red-500 text-center">Erreur lors du chargement des joueurs</p>
                )}
                {players.length === 0 && !loadingPlayers && (
                    <p className="mt-2 text-sm text-gray-500 text-center">Aucun joueur trouvé</p>
                )}
            </div>

            {/* Zone de gestion des dons */}
            {selectedPlayer && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-purple-400" />
                            Dons Disponibles
                        </h2>
                        {loadingGifts && <Loader className="w-4 h-4 animate-spin text-gray-400" />}
                    </div>

                    <div className="divide-y divide-gray-700">
                        {gifts.length === 0 && !loadingGifts ? (
                            <div className="p-8 text-center text-gray-500">Aucun don trouvé pour ce joueur.</div>
                        ) : (
                            gifts.map(gift => (
                                <div key={gift.id} className="p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
                                    <div>
                                        <div className="font-medium text-gray-200">{gift.name}</div>
                                        {gift.tribe && <span className="text-xs text-gray-500 mr-2">{gift.tribe}</span>}
                                        {gift.level && <span className="text-xs text-purple-400">Rang {gift.level}</span>}
                                    </div>
                                    <label className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={!!gift.unlocked}
                                                onChange={() => handleToggleGift(gift.id, gift.unlocked)}
                                                aria-label={gift.name}
                                            />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${gift.unlocked ? 'bg-purple-600' : 'bg-gray-600'}`}></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${gift.unlocked ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                        <span className="ml-3 text-sm font-medium text-gray-400">
                                            {gift.unlocked ? 'Débloqué' : 'Verrouillé'}
                                        </span>
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
