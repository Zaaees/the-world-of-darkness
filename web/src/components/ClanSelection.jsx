import React, { useState } from 'react';
import { Check, Moon, AlertTriangle, Sparkles, Crown } from 'lucide-react';
import { getAllClans } from '../data/clanDescriptions';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Moon className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-red-100 mb-4">
            🧛 Choisis Ton Lignage
          </h1>
          <p className="text-xl text-red-300 max-w-2xl mx-auto">
            Tu viens de rejoindre les rangs des Damnés. Chaque clan porte un héritage millénaire,
            une malédiction unique, et des disciplines qui te définiront pour l'éternité.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-700 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-200 text-sm">
              Attention : Une fois choisi, ton clan ne pourra plus être changé
            </span>
          </div>
        </div>

        {/* Grille des clans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {clans.map((clan) => {
            const isSelected = selectedClan?.id === clan.id;
            const isExpanded = expandedClan === clan.id;

            return (
              <div
                key={clan.id}
                className={`
                  relative bg-gradient-to-br from-gray-800 to-gray-900
                  border-2 rounded-lg p-6 cursor-pointer
                  transition-all duration-300 transform hover:scale-105
                  ${isSelected
                    ? 'border-red-500 shadow-2xl shadow-red-500/50 ring-4 ring-red-500/30'
                    : 'border-gray-700 hover:border-red-700'
                  }
                `}
                onClick={() => handleSelectClan(clan)}
              >
                {/* Badge de sélection */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 bg-red-500 rounded-full p-2 shadow-lg animate-bounce">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Nom et titre */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-red-100 mb-1 flex items-center gap-2">
                    {clan.name}
                    {clan.id === 'salubri' && <Crown className="w-5 h-5 text-yellow-500" />}
                    {clan.id === 'baali' && <span className="text-purple-500">†</span>}
                  </h3>
                  <p className="text-red-400 italic text-sm">{clan.title}</p>
                </div>

                {/* Description courte */}
                <p className="text-gray-300 text-sm mb-4">
                  {clan.shortDesc}
                </p>

                {/* Citation */}
                <div className="border-l-4 border-red-700 pl-4 mb-4">
                  <p className="text-gray-400 text-xs italic">
                    {clan.quote}
                  </p>
                </div>

                {/* Détails étendus */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-3 animate-fadeIn">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {clan.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-green-300 font-semibold text-xs mb-1">Forces</p>
                          <p className="text-gray-400 text-xs whitespace-pre-line">{clan.strengths}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-red-300 font-semibold text-xs mb-1">Faiblesses</p>
                          <p className="text-gray-400 text-xs whitespace-pre-line">{clan.weaknesses}</p>
                        </div>
                      </div>

                      <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                        <p className="text-yellow-300 font-semibold text-xs mb-1">💀 Roleplay</p>
                        <p className="text-gray-400 text-xs italic">{clan.roleplay}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton d'expansion */}
                <button
                  className="mt-4 w-full py-2 text-xs text-red-300 hover:text-red-100 border border-red-800 rounded hover:bg-red-950 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedClan(isExpanded ? null : clan.id);
                  }}
                >
                  {isExpanded ? 'Réduire les détails' : 'Voir les détails'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Zone de confirmation */}
        {selectedClan && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-red-950 to-transparent p-8 border-t border-red-900">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-100">
                        {selectedClan.name} - {selectedClan.title}
                      </h3>
                      <p className="text-red-400 text-sm">
                        Tu t'apprêtes à rejoindre ce lignage pour l'éternité
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 bg-red-900 border border-red-500 rounded text-red-200 text-sm">
                    ❌ {error}
                  </div>
                )}

                {!isConfirming ? (
                  <button
                    onClick={() => setIsConfirming(true)}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-lg transition-colors shadow-lg"
                  >
                    Je choisis {selectedClan.name}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-900 border border-yellow-500 rounded p-4 mb-4">
                      <p className="text-yellow-100 text-sm font-bold mb-2">
                        ⚠️ Dernière confirmation
                      </p>
                      <p className="text-yellow-200 text-sm">
                        Es-tu certain de vouloir rejoindre le clan {selectedClan.name} ?
                        Ce choix est définitif et façonnera ton personnage pour toujours.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setIsConfirming(false)}
                        className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? '⏳ Enregistrement...' : `🩸 Confirmer ${selectedClan.name}`}
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
