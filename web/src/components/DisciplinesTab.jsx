import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Lock } from 'lucide-react';
import { getAvailableDisciplines, MAX_DISCIPLINE_LEVEL } from '../data/disciplines';

// Icônes par discipline
const DISCIPLINE_ICONS = {
  animalism: "🐺",
  auspex: "👁️",
  celerity: "⚡",
  dominate: "🧠",
  fortitude: "🛡️",
  obfuscate: "👤",
  potence: "💪",
  presence: "👑",
  protean: "🌙",
  obtenebration: "🌑",
  thaumaturgy: "🩸",
  vicissitude: "🎭",
  necromancy: "💀",
  quietus: "🤫",
  serpentis: "🐍",
  dementation: "🌀",
  chimerstry: "✨"
};

// Niveau de BP requis par niveau de pouvoir
const BP_REQUIRED = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4
};

// Composant pour un pouvoir individuel
const PowerCard = ({ power, isLocked }) => {
  const requiredBP = BP_REQUIRED[power.level] || 1;

  return (
    <div className={`
      p-3 rounded border transition-all
      ${isLocked
        ? 'bg-stone-950/30 border-stone-800/50 opacity-50'
        : 'bg-stone-900/40 border-stone-800 hover:border-red-900/50'
      }
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5
          ${isLocked
            ? 'bg-stone-800 text-stone-600'
            : 'bg-red-900/30 text-red-500 border border-red-900/50'
          }
        `}>
          {power.level}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-serif text-sm ${isLocked ? 'text-stone-600' : 'text-stone-200'}`}>
              {power.name}
            </h4>
            <span className={`text-xs ${isLocked ? 'text-stone-700' : 'text-stone-500'}`}>
              • Niveau {power.level} (BP {requiredBP}+)
            </span>
            {isLocked && <Lock size={12} className="text-stone-600" />}
          </div>
          <p className={`text-xs mt-1 leading-relaxed ${isLocked ? 'text-stone-700' : 'text-stone-400'}`}>
            {power.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant pour une discipline
const DisciplineCard = ({ discipline, maxAccessibleLevel }) => {
  const [isOpen, setIsOpen] = useState(true);
  const icon = DISCIPLINE_ICONS[discipline.id] || "✦";

  // Tous les 5 niveaux de pouvoirs
  const allPowers = discipline.powers;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-3 text-left group"
      >
        <div className="w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center text-xl group-hover:border-red-900/50 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-serif text-stone-200 group-hover:text-red-400 transition-colors">
            {discipline.name}
          </h3>
          <p className="text-xs text-stone-500">{discipline.description}</p>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-stone-600" /> : <ChevronDown size={16} className="text-stone-600" />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 pl-2 border-l-2 border-stone-800/50 ml-5">
          {allPowers.map(power => (
            <PowerCard
              key={power.level}
              power={power}
              isLocked={power.level > maxAccessibleLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant principal
export default function DisciplinesTab({ clan, bloodPotency }) {
  const maxLevel = MAX_DISCIPLINE_LEVEL[bloodPotency] || 2;
  const disciplines = getAvailableDisciplines(clan, bloodPotency);

  if (!clan || disciplines.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🧛</div>
        <h3 className="text-lg font-serif text-stone-400 mb-2">Aucune discipline</h3>
        <p className="text-sm text-stone-600 max-w-sm mx-auto">
          Votre clan n'a pas été configuré ou n'a pas de disciplines associées.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec info sur le niveau accessible */}
      <div className="bg-gradient-to-br from-stone-900/40 to-stone-950/40 rounded border border-stone-800 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-red-600" size={24} />
          <div>
            <h2 className="font-serif text-lg text-stone-200">Disciplines de Clan</h2>
            <p className="text-xs text-stone-500">
              Puissance du Sang {bloodPotency} → Accès aux niveaux 1 à {maxLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des disciplines */}
      <div>
        {disciplines.map(discipline => (
          <DisciplineCard
            key={discipline.id}
            discipline={discipline}
            maxAccessibleLevel={maxLevel}
          />
        ))}
      </div>

      {/* Note sur la progression */}
      {bloodPotency < 4 && (
        <div className="text-center text-xs text-stone-600 italic py-4 border-t border-stone-900">
          Augmentez votre Puissance du Sang pour débloquer des niveaux supérieurs
        </div>
      )}
    </div>
  );
}
