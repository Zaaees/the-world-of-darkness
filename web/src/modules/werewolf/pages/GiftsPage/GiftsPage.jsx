import React, { useState, useEffect, useMemo } from 'react';
import useUserRoles from '../../../../core/hooks/useUserRoles';
import { API_URL } from '../../../../config';
import WerewolfLayout from '../../components/WerewolfLayout';
import { GiftCard } from '../../components/GiftCard/GiftCard';
import './GiftsPage.css';

/**
 * Page de consultation des Dons (Gifts) pour le module Werewolf.
 * Permet de visualiser le catalogue complet filtré par tribu,
 * et de voir les dons débloqués par le joueur.
 */
export const GiftsPage = ({ gifts: propGifts, unlockedIds: propUnlockedIds }) => {
    const { discordUser, guildId } = useUserRoles();
    const [gifts, setGifts] = useState(propGifts || []);
    const [unlockedIds, setUnlockedIds] = useState(propUnlockedIds || []);
    const [playerTribe, setPlayerTribe] = useState(null);
    const [isLoading, setIsLoading] = useState(!propGifts);
    const [error, setError] = useState(null);

    // Filtres
    const [levelFilter, setLevelFilter] = useState('all');
    const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

    // Chargement des données
    useEffect(() => {
        // Si les données sont passées en props (pour les tests), ne pas fetcher
        if (propGifts) return;

        const fetchGifts = async () => {
            if (!discordUser?.id || !guildId) return;

            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/api/modules/werewolf/gifts`, {
                    headers: {
                        'X-Discord-User-ID': discordUser.id,
                        'X-Discord-Guild-ID': guildId
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    setGifts(data.catalogue);
                    setUnlockedIds(data.unlocked_ids);
                    // Support legacy or new API structure
                    setPlayerTribe(data.profile?.tribe || data.tribe);
                } else {
                    throw new Error(data.error || "Erreur lors du chargement des dons");
                }
            } catch (err) {
                console.error("Erreur fetch gifts:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGifts();
    }, [discordUser, guildId, propGifts]);

    // Filtrage et Tri
    const processedGifts = useMemo(() => {
        return gifts
            .filter(gift => {
                // Filtre par niveau
                if (levelFilter !== 'all' && gift.level !== parseInt(levelFilter)) {
                    return false;
                }
                // Filtre "Afficher tout / Débloqués uniquement"
                if (showUnlockedOnly && !unlockedIds.includes(gift.id)) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => {
                const aUnlocked = unlockedIds.includes(a.id);
                const bUnlocked = unlockedIds.includes(b.id);

                // 1. Débloqués en premier
                if (aUnlocked && !bUnlocked) return -1;
                if (!aUnlocked && bUnlocked) return 1;

                // 2. Tri par niveau croissant
                if (a.level !== b.level) return a.level - b.level;

                // 3. Alphabétique (Safe)
                const nameA = a.name_fr || "";
                const nameB = b.name_fr || "";
                return nameA.localeCompare(nameB);
            });
    }, [gifts, unlockedIds, levelFilter, showUnlockedOnly]);

    // Modal logic
    const [selectedGift, setSelectedGift] = useState(null);

    return (
        <WerewolfLayout>
            <div className="gifts-page__container">
                <header className="gifts-page__header">
                    <h1 className="gifts-page__title">Mes Dons</h1>
                    <p className="gifts-page__subtitle">
                        {playerTribe ? `Catalogue: ${playerTribe}` : "Consultation des esprits..."}
                    </p>
                </header>

                <div className="gifts-page__filters">
                    <div className="gifts-page__filter-group">
                        <label htmlFor="level-select">Niveau:</label>
                        <select
                            id="level-select"
                            className="gifts-page__select"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            data-testid="level-filter"
                        >
                            <option value="all">Tous</option>
                            <option value="1">Niveau 1</option>
                            <option value="2">Niveau 2</option>
                            <option value="3">Niveau 3</option>
                            <option value="4">Niveau 4</option>
                            <option value="5">Niveau 5</option>
                        </select>
                    </div>

                    <div className="gifts-page__filter-group">
                        <input
                            type="checkbox"
                            id="unlocked-only"
                            className="gifts-page__checkbox"
                            checked={showUnlockedOnly}
                            onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                        />
                        <label htmlFor="unlocked-only" className="cursor-pointer">
                            Débloqués uniquement
                        </label>
                    </div>
                </div>

                {isLoading ? (
                    <div className="gifts-page__loading" data-testid="loading-spinner">Invocation des connaissances ancestrales...</div>
                ) : error ? (
                    <div className="gifts-page__error">{error}</div>
                ) : processedGifts.length === 0 ? (
                    <div className="gifts-page__empty">Aucun Don ne correspond à votre recherche.</div>
                ) : (
                    <div className="gifts-page__grid">
                        {processedGifts.map(gift => (
                            <GiftCard
                                key={gift.id}
                                gift={gift}
                                isUnlocked={unlockedIds.includes(gift.id)}
                                onClick={() => setSelectedGift(gift)}
                            />
                        ))}
                    </div>
                )}

                {/* Gift Details Modal */}
                {selectedGift && (
                    <div className="gift-modal-overlay" onClick={() => setSelectedGift(null)}>
                        <div className="gift-modal" onClick={e => e.stopPropagation()}>
                            <button className="gift-modal-close" onClick={() => setSelectedGift(null)}>×</button>
                            <h2 className="gift-modal-title">{selectedGift.name_fr}</h2>
                            <div className="gift-modal-meta">
                                <span className="gift-tag level">Niveau {selectedGift.level}</span>
                                {selectedGift.tribe && <span className="gift-tag tribe">{selectedGift.tribe}</span>}
                                {selectedGift.breed && <span className="gift-tag breed">{selectedGift.breed}</span>}
                                {selectedGift.auspice && <span className="gift-tag auspice">{selectedGift.auspice}</span>}
                                {selectedGift.gnosis_cost > 0 && <span className="gift-tag cost">{selectedGift.gnosis_cost} Gnose</span>}
                            </div>

                            <div className="gift-modal-description">
                                <h3>Description</h3>
                                <p>{selectedGift.description || "Aucune description disponible."}</p>
                            </div>

                            {selectedGift.system && (
                                <div className="gift-modal-system">
                                    <h3>Système</h3>
                                    <p>{selectedGift.system}</p>
                                </div>
                            )}

                            {!unlockedIds.includes(selectedGift.id) && (
                                <div className="gift-modal-locked-notice">
                                    <span role="img" aria-label="locked">🔒</span> Ce Don n'est pas encore débloqué.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </WerewolfLayout>
    );
};

export default GiftsPage;
