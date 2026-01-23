import React from 'react';

/**
 * Composant RenownBadge
 * Affiche le rang de renommée d'un Loup-Garou.
 * 
 * @param {Object} props
 * @param {number} props.rank - Niveau du rang (1-5)
 */
const RenownBadge = ({ rank = 1 }) => {
    // Noms des rangs Garou
    const rankNames = {
        1: 'Cliath',
        2: 'Fostern',
        3: 'Adren',
        4: 'Athro',
        5: 'Ancien',
    };

    const rankName = rankNames[rank] || 'Cliath';

    return (
        <div
            className="inline-flex items-center px-3 py-1 rounded-full bg-amber-900/40 border border-amber-600/50 text-amber-200 text-sm font-semibold tracking-wider uppercase shadow-lg shadow-black/20"
            data-testid="renown-badge"
        >
            <span className="mr-2">🐾</span>
            {rankName}
        </div>
    );
};

export default RenownBadge;
