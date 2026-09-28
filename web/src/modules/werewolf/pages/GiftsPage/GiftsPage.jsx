// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../../core/content/store';
import SiteText from '../../../../core/content/SiteText';
import { apiFetch } from '../../../../core/api';
import React, { useState, useEffect, useMemo } from 'react';
import useUserRoles from '../../../../core/hooks/useUserRoles';
import { API_URL } from '../../../../config';
import WerewolfLayout from '../../components/WerewolfLayout';
import { GiftCard } from '../../components/GiftCard/GiftCard';
import { translate } from '../../utils/translations';
import './GiftsPage.css';

/**
 * Page de consultation des Dons (Gifts) pour le module Werewolf.
 * Permet de visualiser le catalogue complet filtré par tribu,
 * et de voir les dons débloqués par le joueur.
 */
export const GiftsPage = ({ gifts: propGifts, unlockedIds: propUnlockedIds }) => {
    useSiteContent();
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
                const response = await apiFetch(`${API_URL}/api/modules/werewolf/gifts`, {
                    headers: {
                        'X-Discord-User-ID': discordUser.id,
                        'X-Discord-Guild-ID': guildId
                    }
                });

                if (!response.ok) {
                    throw new Error(siteText("werewolf.text.02592", { v0: (response.status) }));
                }

                const data = await response.json();
                if (data.success) {
                    setGifts(data.catalogue);
                    setUnlockedIds(data.unlocked_ids);
                    // Support legacy or new API structure
                    setPlayerTribe(data.profile?.tribe || data.tribe);
                } else {
                    throw new Error(data.error || siteText("werewolf.text.02593"));
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
                    <h1 className="gifts-page__title"><SiteText contentKey="werewolf.text.01775" /></h1>
                    <p className="gifts-page__subtitle">
                        {playerTribe ? `Catalogue: ${translate('tribe', playerTribe)}` : siteText("werewolf.text.01776")}
                    </p>
                </header>

                <div className="gifts-page__filters">
                    <div className="gifts-page__filter-group">
                        <label htmlFor="level-select"><SiteText contentKey="werewolf.text.01777" /></label>
                        <select
                            id="level-select"
                            className="gifts-page__select"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            data-testid="level-filter"
                        >
                            <option value="all">{siteText("werewolf.text.01778")}</option>
                            <option value="1">{siteText("werewolf.text.01779")}</option>
                            <option value="2">{siteText("werewolf.text.01780")}</option>
                            <option value="3">{siteText("werewolf.text.01781")}</option>
                            <option value="4">{siteText("werewolf.text.01782")}</option>
                            <option value="5">{siteText("werewolf.text.01783")}</option>
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
                        <label htmlFor="unlocked-only" className="cursor-pointer"><SiteText contentKey="werewolf.text.01784" /></label>
                    </div>
                </div>

                {isLoading ? (
                    <div className="gifts-page__loading" data-testid="loading-spinner"><SiteText contentKey="werewolf.text.01785" /></div>
                ) : error ? (
                    <div className="gifts-page__error">{displayText("werewolf", error)}</div>
                ) : processedGifts.length === 0 ? (
                    <div className="gifts-page__empty"><SiteText contentKey="werewolf.text.01786" /></div>
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
                            <button className="gift-modal-close" onClick={() => setSelectedGift(null)}><SiteText contentKey="werewolf.text.01787" /></button>
                            <h2 className="gift-modal-title">{displayText("werewolf", selectedGift.name_fr)}</h2>
                            <div className="gift-modal-meta">
                                <span className="gift-tag level"><SiteText contentKey="werewolf.text.01788" />{selectedGift.level}</span>
                                {selectedGift.tribe && <span className="gift-tag tribe">{displayText("werewolf", selectedGift.tribe)}</span>}
                                {selectedGift.breed && <span className="gift-tag breed">{displayText("werewolf", selectedGift.breed)}</span>}
                                {selectedGift.auspice && <span className="gift-tag auspice">{displayText("werewolf", selectedGift.auspice)}</span>}
                                {selectedGift.gnosis_cost > 0 && <span className="gift-tag cost">{selectedGift.gnosis_cost}<SiteText contentKey="werewolf.text.01789" /></span>}
                            </div>

                            <div className="gift-modal-description">
                                <h3><SiteText contentKey="werewolf.text.01790" /></h3>
                                <p>{displayText('werewolf', selectedGift.description) || siteText("werewolf.text.01791")}</p>
                            </div>

                            {selectedGift.system && (
                                <div className="gift-modal-system">
                                    <h3><SiteText contentKey="werewolf.text.01792" /></h3>
                                    <p>{displayText("werewolf", selectedGift.system)}</p>
                                </div>
                            )}

                            {!unlockedIds.includes(selectedGift.id) && (
                                <div className="gift-modal-locked-notice">
                                    <span role="img" aria-label={siteText("werewolf.text.01793")}>🔒</span><SiteText contentKey="werewolf.text.01794" /></div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </WerewolfLayout>
    );
};

export default GiftsPage;
