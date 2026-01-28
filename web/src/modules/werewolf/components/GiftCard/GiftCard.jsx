/**
 * @file GiftCard.jsx
 * @description Composant d'affichage d'un Don (Gift) avec états débloqué/bloqué.
 * @author Zaès (via Antigravity)
 */

import React from 'react';
import { Lock } from 'lucide-react';
import './GiftCard.css';

/**
 * Composant carte de Don.
 * @param {Object} props - Propriétés du composant.
 * @param {Object} props.gift - Objet Don à afficher.
 * @param {boolean} props.isUnlocked - État de déblocage.
 * @param {Function} [props.onClick] - Gestionnaire de clic (actif seulement si débloqué).
 * @returns {JSX.Element} Le composant rendu.
 */
export const GiftCard = ({ gift, isUnlocked, onClick }) => {
    const handleKeyDown = (e) => {
        if (isUnlocked && onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };

    const handleClick = () => {
        if (isUnlocked && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`gift-card ${isUnlocked ? 'gift-card--unlocked' : 'gift-card--locked'}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={isUnlocked ? "button" : undefined}
            tabIndex={isUnlocked ? 0 : -1}
            data-testid={`gift-card-${gift.id}`}
        >
            {!isUnlocked ? (
                <div className="gift-card__locked-content">
                    <Lock size={24} data-testid="gift-card-locked-icon" />
                    <span className="gift-card__title">Don Mystère</span>
                </div>
            ) : (
                <div className="gift-card__content">
                    <h3 className="gift-card__title">{gift.name_fr}</h3>
                    <div className="gift-card__details">
                        <span>Niveau {gift.level}</span>
                        {gift.tribe && <span>{gift.tribe}</span>}
                        {gift.gnosis_cost > 0 && <span>Coût: {gift.gnosis_cost} Gnose</span>}
                    </div>
                </div>
            )}
        </div>
    );
};
