import React, { useState } from 'react';
import { Check, AlertTriangle, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllClans } from '../../../data/clanDescriptions';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Composant de sélection de clan pour les nouveaux vampires
 * Affiché uniquement si l'utilisateur a le rôle Vampire mais pas encore de clan
 */
export default function ClanSelection({ userId, guildId, onClanSelected }) {
  const [selectedClan, setSelectedClan] = useState(null);
  const [expandedClan, setExpandedClan] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clans = getAllClans();

  const handleSelectClan = (clan) => {
    setSelectedClan(clan);
    setExpandedClan(clan.id);
    setIsConfirming(false);
  };

  const handleConfirm = async () => {
    if (!selectedClan) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/vampire/clan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Discord-User-ID': userId,
          'X-Discord-Guild-ID': guildId,
        },
        body: JSON.stringify({
          clan: selectedClan.id
        })
      });

      const data = await response.json();

      if (data.success) {
        // Succès! Appeler le callback
        if (onClanSelected) {
          onClanSelected(selectedClan.id);
        }
      } else {
        setError(data.error || 'Erreur lors de l\'enregistrement du clan');
      }
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du clan:', err);
      setError('Impossible de se connecter au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif text-red-600 mb-3">
            Choisis Ton Lignage
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto text-sm md:text-base">
            Tu viens de rejoindre les rangs des Damnés. Chaque clan porte un héritage millénaire,
            une malédiction unique, et des disciplines qui te définiront pour l'éternité.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-stone-900/50 border border-stone-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-700" />
            <span className="text-stone-500 text-xs">
              Une fois choisi, ton clan ne pourra plus être changé
            </span>
          </div>
        </div>

        {/* Grille des clans */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 ${selectedClan ? 'pb-48' : ''}`}>
          {clans.map((clan) => {
            const isSelected = selectedClan?.id === clan.id;
            const isExpanded = expandedClan === clan.id;

            return (
              <div
                key={clan.id}
                className={`
                  relative bg-stone-900/50 border rounded-lg p-5 cursor-pointer
                  transition-colors duration-200
                  ${isSelected
                    ? 'border-red-700 bg-stone-900/80'
                    : 'border-stone-800 hover:border-stone-700'
                  }
                `}
                onClick={() => handleSelectClan(clan)}
              >
                {/* Badge de sélection */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-red-700 rounded-full p-1.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Nom et titre */}
                <div className="mb-3">
                  <h3 className="text-lg font-serif text-stone-200 mb-0.5 flex items-center gap-2">
                    {clan.name}
                    {clan.id === 'salubri' && <Crown className="w-4 h-4 text-amber-600" />}
                    {clan.id === 'baali' && <span className="text-purple-600 text-sm">†</span>}
                  </h3>
                  <p className="text-red-700 text-xs italic">{clan.title}</p>
                </div>

                {/* Description courte */}
                <p className="text-stone-400 text-sm mb-3 leading-relaxed">
                  {clan.shortDesc}
                </p>

                {/* Citation */}
                <div className="border-l-2 border-stone-700 pl-3 mb-3">
                  <p className="text-stone-600 text-xs italic">
                    {clan.quote}
                  </p>
                </div>

                {/* Détails étendus */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-stone-800 space-y-3">
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {clan.description}
                    </p>

                    <div className="space-y-2">
                      <div className="bg-stone-800/30 p-3 rounded border border-stone-700">
                        <p className="text-stone-300 font-medium text-xs mb-1">Spécificités</p>
                        <p className="text-stone-400 text-xs whitespace-pre-line">{clan.specificities}</p>
                      </div>

                      <div className="bg-red-950/30 p-3 rounded border border-red-900/50">
                        <p className="text-red-500 font-medium text-xs mb-1">Malédiction : {clan.bane}</p>
                        <p className="text-stone-400 text-xs">{clan.baneDescription}</p>
                      </div>

                      <div className="bg-stone-800/50 p-3 rounded border border-stone-700">
                        <p className="text-amber-600 font-medium text-xs mb-0.5">Roleplay</p>
                        <p className="text-stone-500 text-xs italic">{clan.roleplay}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton d'expansion */}
                <button
                  className="mt-3 w-full py-2 text-xs text-stone-500 hover:text-stone-300 border border-stone-800 rounded hover:bg-stone-800/50 transition-colors flex items-center justify-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedClan(isExpanded ? null : clan.id);
                  }}
                >
                  {isExpanded ? (
                    <>Réduire <ChevronUp className="w-3 h-3" /></>
                  ) : (
                    <>Voir les détails <ChevronDown className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Zone de confirmation */}
        {selectedClan && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0c0a09] border-t border-stone-800 p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-stone-900/80 border border-stone-700 rounded-lg p-4 md:p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-red-900/50 border border-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-stone-200">
                      {selectedClan.name}
                    </h3>
                    <p className="text-stone-500 text-xs">
                      {selectedClan.title}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-900 rounded text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {!isConfirming ? (
                  <button
                    onClick={() => setIsConfirming(true)}
                    className="w-full py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-800 text-stone-200 font-medium rounded-lg transition-colors"
                  >
                    Rejoindre le clan {selectedClan.name}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-amber-950/30 border border-amber-900/50 rounded p-3">
                      <p className="text-amber-500 text-sm font-medium mb-1">
                        Dernière confirmation
                      </p>
                      <p className="text-stone-400 text-xs">
                        Es-tu certain de vouloir rejoindre le clan {selectedClan.name} ?
                        Ce choix est définitif.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsConfirming(false)}
                        className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 font-medium rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-3 bg-red-800 hover:bg-red-700 border border-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Enregistrement...' : 'Confirmer'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
