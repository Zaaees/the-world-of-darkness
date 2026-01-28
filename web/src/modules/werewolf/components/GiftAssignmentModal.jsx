import React, { useState, useEffect } from 'react';
import { useAdminGifts } from '../hooks/useAdminGifts';

export default function GiftAssignmentModal({ isOpen, onClose }) {
    const { fetchPlayers, fetchPlayerGifts, toggleGift, loading } = useAdminGifts();
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [gifts, setGifts] = useState([]);
    const [characterInfo, setCharacterInfo] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadPlayers();
        } else {
            // Reset state on close
            setSelectedPlayer('');
            setGifts([]);
            setFilter('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedPlayer) {
            loadGifts(selectedPlayer);
        } else {
            setGifts([]);
        }
    }, [selectedPlayer]);

    const loadPlayers = async () => {
        try {
            const list = await fetchPlayers();
            setPlayers(list);
        } catch (e) {
            console.error(e);
        }
    };

    const loadGifts = async (userId) => {
        try {
            const data = await fetchPlayerGifts(userId);
            setGifts(data.gifts);
            setCharacterInfo(data.character);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggle = async (giftId, currentStatus) => {
        // Optimistic update
        const newStatus = !currentStatus;
        setGifts(prev => prev.map(g => g.id === giftId ? { ...g, unlocked: newStatus } : g));

        try {
            await toggleGift(selectedPlayer, giftId, newStatus);
        } catch (e) {
            // Revert
            console.error(e);
            setGifts(prev => prev.map(g => g.id === giftId ? { ...g, unlocked: currentStatus } : g));
        }
    };

    if (!isOpen) return null;

    const filteredGifts = gifts.filter(g =>
        g.name.toLowerCase().includes(filter.toLowerCase()) ||
        g.description.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-amber-500">Attribution de Dons</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Player Selection */}
                    <div>
                        <label className="block text-gray-400 mb-2">Sélectionner un Joueur</label>
                        <select
                            value={selectedPlayer}
                            onChange={(e) => setSelectedPlayer(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded p-3 text-white focus:border-amber-500 outline-none"
                        >
                            <option value="">-- Choisir un Garou --</option>
                            {players.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name} (Rang {p.rank} - {p.tribe})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedPlayer && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl text-gray-200 font-serif">
                                    Dons de {characterInfo?.name || 'Joueur'}
                                </h3>
                                <input
                                    type="text"
                                    placeholder="Rechercher un don..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredGifts.map(gift => (
                                    <div
                                        key={gift.id}
                                        onClick={() => handleToggle(gift.id, gift.unlocked)}
                                        className={`
                                            p-4 rounded-lg border-2 cursor-pointer transition-all relative overflow-hidden group
                                            ${gift.unlocked
                                                ? 'bg-amber-900/20 border-amber-600/50 hover:bg-amber-900/30'
                                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                                            }
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`font-bold ${gift.unlocked ? 'text-amber-400' : 'text-gray-300'}`}>
                                                {gift.name}
                                            </h4>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gift.unlocked ? 'bg-amber-500 border-amber-500' : 'border-gray-500'}`}>
                                                {gift.unlocked && <span className="text-black text-xs">✓</span>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-stone-500 mb-2 flex gap-2">
                                            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800">Rang {gift.rank}</span>
                                            {gift.type && <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 uppercase">{gift.type}</span>}
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                            {gift.description}
                                        </p>
                                    </div>
                                ))}
                                {filteredGifts.length === 0 && (
                                    <p className="text-gray-500 col-span-2 text-center py-4">Aucun don trouvé.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
