import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Lock, Clock, Droplet } from 'lucide-react';
import { getAvailableDisciplines, MAX_DISCIPLINE_LEVEL, DISCIPLINES } from '../../../data/disciplines';
import DisciplineDetailModal from './DisciplineDetailModal';

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
  instant: "Instantanée",
  scene: "Scène",
  prolonged: "Prolongée",
  permanent: "Permanente"
};

const DurationBadge = ({ duration, isLocked }) => {
  if (!duration) return null;
  const label = DURATION_LABELS[duration] || duration;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${isLocked
      ? 'bg-stone-900 text-stone-600 border border-stone-800'
      : 'bg-stone-900 text-stone-400 border border-stone-800'
      }`} title="Durée">
      <Clock size={9} className={isLocked ? 'text-stone-600' : 'text-stone-500'} />
      <span>{label}</span>
    </div>
  );
};

const BloodCost = ({ cost, isLocked }) => {
  if (cost === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide ${isLocked
      ? 'bg-stone-900 text-stone-600 border border-stone-800'
      : 'bg-red-950/20 text-red-300 border border-red-900/20'
      }`} title={`Coût: ${cost} point(s) de sang`}>
      <Droplet size={9} className={isLocked ? 'text-stone-600' : 'text-red-500 fill-red-500/20'} />
      <span>{cost}</span>
    </div>
  );
};

// Composant pour un pouvoir individuel
const PowerCard = ({ power, isLocked, onClick }) => {
  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      className={`
      p-4 rounded border transition-all duration-300 relative group overflow-hidden
      ${isLocked
          ? 'bg-stone-950/40 border-stone-800/60 opacity-60 cursor-not-allowed grayscale-[0.5]'
          : 'bg-gradient-to-br from-stone-900/80 to-stone-950/80 border-stone-800 hover:border-red-900/40 cursor-pointer hover:shadow-lg hover:shadow-red-900/5 hover:-translate-y-0.5'
        }
    `}>
      {/* Background Hover Effect */}
      {!isLocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/0 via-red-900/5 to-red-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      <div className="flex items-start gap-4 relative z-10">
        {/* Niveau (Cercle avec style premium) */}
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5 shadow-sm
          ${isLocked
            ? 'bg-stone-900 text-stone-600 border border-stone-800'
            : 'bg-stone-900 text-red-500 border border-red-900/30 group-hover:border-red-500/50 group-hover:text-red-400 group-hover:shadow-[0_0_10px_rgba(220,38,38,0.2)] transition-all'
          }
        `}>
          {power.level}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header: Nom + Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-2">
            <h4 className={`font-serif text-base tracking-wide ${isLocked ? 'text-stone-600' : 'text-stone-200 group-hover:text-red-100 transition-colors'}`}>
              {power.name}
            </h4>

            <div className="flex items-center gap-2 shrink-0 opacity-90">
              <BloodCost cost={power.bloodCost || 0} isLocked={isLocked} />
              <DurationBadge duration={power.duration} isLocked={isLocked} />
              {isLocked && <Lock size={12} className="text-stone-600 ml-1" />}
            </div>
          </div>

          {/* Description Tronquée avec fondu */}
          <p className={`text-xs leading-relaxed line-clamp-2 ${isLocked ? 'text-stone-700' : 'text-stone-500 group-hover:text-stone-400 transition-colors'}`}>
            {power.description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant pour une discipline
const DisciplineCard = ({ discipline, maxAccessibleLevel, onPowerClick }) => {
  const [isOpen, setIsOpen] = useState(true);
  const icon = DISCIPLINE_ICONS[discipline.id] || "✦";
  const allPowers = discipline.powers;

  return (
    <div className="mb-6 bg-stone-950/20 rounded-xl overflow-hidden border border-transparent hover:border-stone-800/50 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 text-left group bg-stone-900/20 hover:bg-stone-900/40 transition-all rounded-xl"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700/50 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-red-900/20 group-hover:border-red-900/30 transition-all">
          <span className="group-hover:scale-110 transition-transform duration-300 filter drop-shadow">{icon}</span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-serif tracking-wide text-stone-200 group-hover:text-red-400 transition-colors flex items-center gap-3">
            {discipline.name}
            <div className="h-px bg-stone-800 flex-1 ml-4 group-hover:bg-red-900/30 transition-colors" />
          </h3>
          <p className="text-xs text-stone-500 mt-1 font-sans">{discipline.description}</p>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-stone-600 group-hover:text-stone-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-2 pt-4 pl-4 md:pl-8 grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
              {allPowers.map(power => (
                <PowerCard
                  key={power.level}
                  power={power}
                  isLocked={power.level > maxAccessibleLevel}
                  onClick={() => onPowerClick(power)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant principal
export default function DisciplinesTab({ clan, bloodPotency, isCainMode }) {
  // Allow up to 10 for Cain Mode, otherwise respect blood potency
  const maxLevel = isCainMode ? 10 : (MAX_DISCIPLINE_LEVEL[bloodPotency] || 2);
  const [selectedPower, setSelectedPower] = useState(null);

  const disciplines = useMemo(() => {
    if (isCainMode) {
      return DISCIPLINES ? Object.values(DISCIPLINES) : [];
    } else {
      return getAvailableDisciplines(clan, bloodPotency);
    }
  }, [clan, bloodPotency, isCainMode]);

  // Ensure we display at least 5 slots to keep the UI consistent for low levels,
  // but allow it to grow if we have access to higher levels.
  // The filtering is already done in getAvailableDisciplines, so here we trust the props / logic.

  if ((!clan && !isCainMode) || disciplines.length === 0) {
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
      {/* Header avec info sur le niveau accessible */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-950 rounded-xl border border-stone-800 p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-red-900/5 blur-3xl rounded-full pointer-events-none group-hover:bg-red-900/10 transition-colors duration-1000" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-stone-950 rounded-lg border border-stone-800 shadow-inner">
            <Sparkles className="text-red-500" size={24} />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-stone-100 tracking-wide">Disciplines de Clan</h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
              <span className="px-2 py-0.5 rounded bg-stone-800/50 border border-stone-700/50 text-stone-400">
                Puissance {bloodPotency}
              </span>
              <span>→</span>
              <span className="text-stone-400">Accès niveau {maxLevel}</span>
            </div>
          </div>
        </div>

        {/* Légende - Carte de Référence */}
        <div className="bg-stone-950/30 rounded-xl border border-stone-800/50 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-800/50 text-xs mt-4">
          {/* Colonne Coûts */}
          <div className="flex-1 p-4">
            <h4 className="font-serif text-stone-500 mb-3 flex items-center gap-2">
              <Droplet size={12} className="text-red-900" fill="currentColor" /> Coût en Sang
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-stone-600"><span className="w-1.5 h-1.5 rounded-full bg-stone-700"></span> 0 : Passif</div>
              <div className="flex items-center gap-2 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-red-900/40"></span> 1 : Mineur</div>
              <div className="flex items-center gap-2 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-red-800/60"></span> 3 : Moyen</div>
              <div className="flex items-center gap-2 text-stone-500"><span className="w-1.5 h-1.5 rounded-full bg-red-600/80"></span> 9+ : Majeur</div>
            </div>
          </div>

          {/* Colonne Durées */}
          <div className="flex-[1.5] p-4">
            <h4 className="font-serif text-stone-500 mb-3 flex items-center gap-2">
              <Clock size={12} className="text-stone-700" /> Durées
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-500">
              <div><strong className="text-stone-400 font-medium">Instantanée:</strong> Effet immédiat.</div>
              <div><strong className="text-stone-400 font-medium">Scène:</strong> Dure le temps du combat.</div>
              <div><strong className="text-stone-400 font-medium">Prolongée:</strong> Une nuit ou plus.</div>
              <div><strong className="text-stone-400 font-medium">Permanente:</strong> Indéfini.</div>
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
            onPowerClick={setSelectedPower}
          />
        ))}
      </div>

      {/* Note sur la progression */}
      {bloodPotency < 4 && (
        <div className="text-center text-xs text-stone-600 italic py-4 border-t border-stone-900">
          Augmentez votre Puissance du Sang pour débloquer de nouvelles disciplines
        </div>
      )}
      <DisciplineDetailModal
        power={selectedPower}
        icon={selectedPower ? DISCIPLINE_ICONS[disciplines.find(d => d.powers.includes(selectedPower))?.id] : null}
        onClose={() => setSelectedPower(null)}
      />
    </div>
  );
}
