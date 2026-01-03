import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Lock, Clock, Droplet } from 'lucide-react';
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
  chimerstry: "✨",
  flight: "🦇",
  visceratika: "🗿",
  thanatosis: "⚰️",
  melpominee: "🎵",
  daimoinon: "😈"
};

const DURATION_LABELS = {
  passive: "Passive",
  instant: "Instantanée",
  concentration: "Concentration",
  scene: "Scène",
  prolonged: "Prolongée",
  permanent: "Permanente"
};

// Composant pour afficher la durée
const DurationBadge = ({ duration, isLocked }) => {
  if (!duration) return null;

  const label = DURATION_LABELS[duration] || duration;

  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ml-2 ${isLocked
      ? 'bg-stone-900/50 text-stone-600 border-stone-800'
      : 'bg-stone-800/50 text-stone-400 border-stone-700'
      }`} title="Durée">
      <Clock size={10} className={isLocked ? 'text-stone-600' : 'text-stone-500'} />
      <span className="text-[10px]">{label}</span>
    </div>
  );
};

// Composant pour afficher le coût en sang
const BloodCost = ({ cost, isLocked }) => {
  if (cost === 0) {
    return (
      <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${isLocked
        ? 'bg-stone-900/50 text-stone-600 border-stone-800'
        : 'bg-stone-800/50 text-stone-400 border-stone-700'
        }`}>
        Passif
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${isLocked
      ? 'bg-stone-900/50 text-stone-600 border-stone-800'
      : 'bg-red-950/30 text-red-400 border-red-900/30'
      }`} title={`Coût: ${cost} point(s) de sang`}>
      <Droplet size={10} className={isLocked ? 'text-stone-600' : 'text-red-500'} fill={isLocked ? "none" : "currentColor"} />
      <span className="text-[10px]">{cost}</span>
    </div>
  );
};

// Composant pour un pouvoir individuel
const PowerCard = ({ power, isLocked }) => {
  return (
    <div className={`
      p-3 rounded border transition-all
      ${isLocked
        ? 'bg-stone-950/30 border-stone-800/50 opacity-50'
        : 'bg-stone-900/40 border-stone-800 hover:border-red-900/50'
      }
    `}>
      <div className="flex items-start gap-3">
        {/* Niveau (Cercle) */}
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
          {/* Header: Nom + Metadata (Coût/Durée) */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <h4 className={`font-serif text-sm font-medium ${isLocked ? 'text-stone-600' : 'text-stone-200'}`}>
              {power.name}
            </h4>

            <div className="flex items-center gap-2 shrink-0">
              {/* Metadata badges container */}
              <BloodCost cost={power.bloodCost || 0} isLocked={isLocked} />
              <DurationBadge duration={power.duration} isLocked={isLocked} />
              {isLocked && <Lock size={12} className="text-stone-600 ml-1" />}
            </div>
          </div>

          {/* Caler la description */}
          <p className={`text-xs leading-relaxed ${isLocked ? 'text-stone-700' : 'text-stone-400'}`}>
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
      <div className="bg-gradient-to-br from-stone-900/40 to-stone-950/40 rounded border border-stone-800 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="text-red-600" size={24} />
          <div>
            <h2 className="font-serif text-lg text-stone-200">Disciplines de Clan</h2>
            <p className="text-xs text-stone-500">
              Puissance du Sang {bloodPotency} → Accès aux niveaux 1 à {maxLevel}
            </p>
          </div>
        </div>

        {/* Légende - Carte de Référence (Alignement Strict) */}
        <div className="mt-4 bg-stone-950/40 rounded-lg border border-stone-800/50 grid grid-cols-1 md:grid-cols-2 overflow-hidden">

          {/* Colonne Coûts */}
          <div className="p-5 md:border-r border-stone-800/50">
            <h4 className="border-b border-stone-800 pb-2 mb-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center justify-end md:justify-start gap-2">
              Coût en Sang <Droplet size={12} />
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-4 group">
                <div className="w-20 shrink-0 flex justify-end">
                  <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-[10px] bg-stone-800/50 text-stone-400 border-stone-700 font-medium w-full">
                    Passif
                  </span>
                </div>
                <span className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors pt-0.5">Aucun coût, toujours actif ou permanent.</span>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-20 shrink-0 flex justify-end">
                  <div className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border bg-red-950/20 text-red-400 border-red-900/30 font-medium w-full">
                    <Droplet size={10} className="text-red-500" fill="currentColor" />
                    <span className="text-[10px]">1</span>
                  </div>
                </div>
                <span className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors pt-0.5">Dépense mineure.</span>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-20 shrink-0 flex justify-end">
                  <div className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border bg-red-950/20 text-red-400 border-red-900/30 font-medium w-full">
                    <Droplet size={10} className="text-red-500" fill="currentColor" />
                    <span className="text-[10px]">3</span>
                  </div>
                </div>
                <span className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors pt-0.5">Dépense moyenne.</span>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-20 shrink-0 flex justify-end">
                  <div className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border bg-red-950/20 text-red-400 border-red-900/30 font-medium w-full">
                    <Droplet size={10} className="text-red-500" fill="currentColor" />
                    <span className="text-[10px]">9</span>
                  </div>
                </div>
                <span className="text-xs text-stone-500 group-hover:text-stone-300 transition-colors pt-0.5">Dépense majeure.</span>
              </div>
            </div>
          </div>

          {/* Colonne Durées */}
          <div className="p-5">
            <h4 className="border-b border-stone-800 pb-2 mb-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Durée des effets
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-4 group">
                <div className="w-24 shrink-0 flex justify-end">
                  <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-[10px] bg-stone-900/50 text-stone-400 border-stone-800 font-medium w-full">
                    Instantanée
                  </span>
                </div>
                <span className="text-xs text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed pt-0.5">L'effet est immédiat et ne persiste pas.</span>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-24 shrink-0 flex justify-end">
                  <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-[10px] bg-stone-900/50 text-stone-400 border-stone-800 font-medium w-full">
                    Scène
                  </span>
                </div>
                <span className="text-xs text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed pt-0.5">Dure toute la scène ou le combat en cours.</span>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-24 shrink-0 flex justify-end">
                  <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-[10px] bg-stone-900/50 text-stone-400 border-stone-800 font-medium w-full">
                    Prolongée
                  </span>
                </div>
                <span className="text-xs text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed pt-0.5">Dure des heures, une nuit, ou plusieurs jours.</span>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-24 shrink-0 flex justify-end">
                  <span className="flex items-center justify-center gap-1 px-2 py-0.5 rounded border text-[10px] bg-stone-900/50 text-stone-400 border-stone-800 font-medium w-full">
                    Permanente
                  </span>
                </div>
                <span className="text-xs text-stone-600 group-hover:text-stone-400 transition-colors leading-relaxed pt-0.5">Dure indéfiniment ou jusqu'à annulation.</span>
              </div>
            </div>
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
          Augmentez votre Puissance du Sang pour débloquer de nouvelles disciplines
        </div>
      )}
    </div>
  );
}
