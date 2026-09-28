// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../../core/content/store';
import SiteText from '../../../../core/content/SiteText';
import React, { useState, useMemo } from 'react';
import { GiftCard } from '../../components/GiftCard/GiftCard';
import { translate } from '../../utils/translations';
import './GiftsPage.css';

/**
 * Onglet Dons (Gifts) pour l'architecture SPA.
 * Réutilise la logique de filtrage/tri/modal de GiftsPage,
 * sans le WerewolfLayout (géré par le parent CharacterSheet).
 * Accepte les données en props au lieu de les fetcher.
 */
const GiftsTab = ({ gifts = [], unlockedIds = [], playerTribe = null, isLoading = false }) => {
    useSiteContent();
    // Filtres
    const [levelFilter, setLevelFilter] = useState('all');
    const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

    // Filtrage et Tri
    const processedGifts = useMemo(() => {
        return gifts
            .filter(gift => {
                if (levelFilter !== 'all' && gift.level !== parseInt(levelFilter)) {
                    return false;
                }
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

                // 3. Alphabétique
                const nameA = a.name_fr || "";
                const nameB = b.name_fr || "";
                return nameA.localeCompare(nameB);
            });
    }, [gifts, unlockedIds, levelFilter, showUnlockedOnly]);

    // Modal
    const [selectedGift, setSelectedGift] = useState(null);

    if (isLoading) {
        return (
            <div className="gifts-page__loading" data-testid="loading-spinner"><SiteText contentKey="werewolf.text.01795" /></div>
        );
    }

    return (
        <div className="gifts-page__container">
            <header className="gifts-page__header">
                <h1 className="gifts-page__title"><SiteText contentKey="werewolf.text.01796" /></h1>
                <p className="gifts-page__subtitle">
                    {playerTribe ? `Catalogue: ${translate('tribe', playerTribe)}` : siteText("werewolf.text.01797")}
                </p>
            </header>

            <div className="gifts-page__filters">
                <div className="gifts-page__filter-group">
                    <label htmlFor="level-select"><SiteText contentKey="werewolf.text.01798" /></label>
                    <select
                        id="level-select"
                        className="gifts-page__select"
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value)}
                        data-testid="level-filter"
                    >
                        <option value="all">{siteText("werewolf.text.01799")}</option>
                        <option value="1">{siteText("werewolf.text.01800")}</option>
                        <option value="2">{siteText("werewolf.text.01801")}</option>
                        <option value="3">{siteText("werewolf.text.01802")}</option>
                        <option value="4">{siteText("werewolf.text.01803")}</option>
                        <option value="5">{siteText("werewolf.text.01804")}</option>
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
                    <label htmlFor="unlocked-only" className="cursor-pointer"><SiteText contentKey="werewolf.text.01805" /></label>
                </div>
            </div>

            {processedGifts.length === 0 ? (
                <div className="gifts-page__empty"><SiteText contentKey="werewolf.text.01806" /></div>
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

            {/* Modal détails du Don */}
            {selectedGift && (
                <div className="gift-modal-overlay" onClick={() => setSelectedGift(null)}>
                    <div className="gift-modal" onClick={e => e.stopPropagation()}>
                        <button className="gift-modal-close" onClick={() => setSelectedGift(null)}><SiteText contentKey="werewolf.text.01807" /></button>
                        <h2 className="gift-modal-title">{displayText("werewolf", selectedGift.name_fr)}</h2>
                        <div className="gift-modal-meta">
                            <span className="gift-tag level"><SiteText contentKey="werewolf.text.01808" />{selectedGift.level}</span>
                            {selectedGift.tribe && <span className="gift-tag tribe">{displayText("werewolf", selectedGift.tribe)}</span>}
                            {selectedGift.breed && <span className="gift-tag breed">{displayText("werewolf", selectedGift.breed)}</span>}
                            {selectedGift.auspice && <span className="gift-tag auspice">{displayText("werewolf", selectedGift.auspice)}</span>}
                            {selectedGift.gnosis_cost > 0 && <span className="gift-tag cost">{selectedGift.gnosis_cost}<SiteText contentKey="werewolf.text.01809" /></span>}
                        </div>

                        <div className="gift-modal-description">
                            <h3><SiteText contentKey="werewolf.text.01810" /></h3>
                            <p>{displayText('werewolf', selectedGift.description) || siteText("werewolf.text.01811")}</p>
                        </div>

                        {selectedGift.system && (
                            <div className="gift-modal-system">
                                <h3><SiteText contentKey="werewolf.text.01812" /></h3>
                                <p>{displayText("werewolf", selectedGift.system)}</p>
                            </div>
                        )}

                        {!unlockedIds.includes(selectedGift.id) && (
                            <div className="gift-modal-locked-notice">
                                <span role="img" aria-label={siteText("werewolf.text.01813")}>🔒</span><SiteText contentKey="werewolf.text.01814" /></div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftsTab;
