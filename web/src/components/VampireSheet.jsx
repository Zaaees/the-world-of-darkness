import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, Activity, User, Crown, Shield, Flame, HeartPulse, ChevronDown, ChevronUp, Save, RefreshCw, LogIn, LogOut, Clock, Check, Star, Heart, Zap, Moon } from 'lucide-react';

// --- CONFIGURATION ---
const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec';
const DISCORD_CLIENT_ID = '1453866706546987064';
const REDIRECT_URI = window.location.hostname === 'localhost'
  ? 'http://localhost:5173/'
  : 'https://zaaees.github.io/the-world-of-darkness/';

// --- DISCORD AUTH ---
const getDiscordAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'token',
    scope: 'identify',
  });
  return `https://discord.com/api/oauth2/authorize?${params}`;
};


// --- LOGIQUE V5 NARRATIVE ---

const SATURATION_THRESHOLDS = {
  1: 30,
  2: 60,
  3: 120,
  4: 250,
  5: null
};

const BLOOD_STAGES = {
  1: {
    title: "Sang Fluide (Niveau 1)",
    rank: "Néonate",
    icon: Droplet,
    description: "Votre sang est encore très proche de celui des mortels, fluide et rouge vif. Bien que vous soyez un cadavre ambulant, votre physiologie mime encore la vie. Vous pouvez vous nourrir de sang animal pour survivre, ce qui est une bénédiction rare. Vos pouvoirs sont limités, mais votre corps n'a pas encore les exigences monstrueuses des anciens.",
    color: "text-red-300"
  },
  2: {
    title: "Sang Vif (Niveau 2)",
    rank: "Ancilla Mineur",
    icon: User,
    description: "Le sang commence à s'épaissir. Votre corps rejette désormais le sang animal comme de l'eau insipide ; seul le sang humain peut soutenir votre nature. En contrepartie, vous cicatrisez bien plus vite que les nouveau-nés et pouvez canaliser la Vitae pour des exploits physiques brefs mais surhumains.",
    color: "text-red-400"
  },
  3: {
    title: "Sang Fort (Niveau 3)",
    rank: "Ancilla Majeur",
    icon: Activity,
    description: "Vous êtes un prédateur abouti. Votre sang est dense, chargé d'une énergie statique qui met mal à l'aise les mortels autour de vous. Vous résistez mieux aux pouvoirs mentaux des autres vampires. Votre organisme est une machine de survie efficace, capable de recoudre des plaies graves en quelques secondes, mais la Soif est plus présente, plus pressante.",
    color: "text-red-500"
  },
  4: {
    title: "Sang Puissant (Niveau 4)",
    rank: "Ancien",
    icon: Shield,
    description: "Votre sang est sombre, presque noir, et visqueux comme de l'huile moteur. Vous êtes une créature de légende. Le sang froid (poches médicales) ne vous nourrit plus du tout ; il vous faut la chaleur de la vie. Votre simple présence physique impose le respect ou la terreur. Vous êtes extrêmement difficile à détruire, votre chair se tricotant à une vitesse effrayante.",
    color: "text-red-600"
  },
  5: {
    title: "Zénith Sanguin (Niveau 5)",
    rank: "Sommité",
    icon: Crown,
    description: "L'apogée de votre potentiel biologique. Votre sang est si puissant qu'il brûle presque dans vos veines. Pour être rassasié, vous devez tuer vos victimes ou boire le sang d'autres vampires. Vous êtes un titan parmi les damnés, capable de prouesses quasi-divines, mais votre lien avec l'humanité est ténu. Vous êtes, par essence, un monstre.",
    color: "text-red-700"
  }
};

// --- DÉFINITION DES ACTIONS ---

// Fonction utilitaire pour calculer les points selon le BP
const getActionPoints = (action, bloodPotency) => {
  if (action.scaling) {
    return action.scaling[bloodPotency] ?? action.points;
  }
  return action.points;
};

// Fonction pour vérifier si une action est visible pour un BP donné
const isActionVisible = (action, bloodPotency) => {
  const minBp = action.minBp ?? 1;
  const maxBp = action.maxBp ?? 5;
  return bloodPotency >= minBp && bloodPotency <= maxBp;
};

const UNIQUE_ACTIONS = [
  { id: "first_frenzy", name: "Première danse avec la Bête", description: "Jouer sa première frénésie", points: 5, minBp: 1, maxBp: 5 },
  { id: "first_kill", name: "Le goût des cendres", description: "Tuer un mortel pour la première fois", points: 8, minBp: 1, maxBp: 5 },
  { id: "first_sun", name: "Baiser du soleil", description: "Survivre à une exposition au soleil", points: 6, minBp: 1, maxBp: 5 },
  { id: "first_blood_bond", name: "Le Sang qui lie", description: "Créer son premier Lien de Sang sur quelqu'un", points: 4, minBp: 1, maxBp: 5 },
  { id: "last_mortal", name: "Dernier souffle mortel", description: "Revoir un proche de sa vie humaine", points: 5, minBp: 1, maxBp: 3 },
  { id: "first_ghoul", name: "La première servitude", description: "Créer sa première goule", points: 4, minBp: 1, maxBp: 5 },
  { id: "ghoul_pack", name: "Maître de la meute", description: "Avoir 3 goules ou plus en même temps", points: 5, minBp: 1, maxBp: 5 },
  { id: "acceptance", name: "L'Acceptation", description: "Accepter pleinement sa nature de monstre (scène RP significative)", points: 6, minBp: 3, maxBp: 5 },
];

const CLAN_ACTIONS = {
  nosferatu: { id: "clan_nosferatu", name: "Le secret qui tue", description: "Révéler une information qui change la donne", points: 4, minBp: 1, maxBp: 5 },
  brujah: { id: "clan_brujah", name: "Le poing levé", description: "Défendre une cause ou mener une révolte", points: 4, minBp: 1, maxBp: 5 },
  toreador: { id: "clan_toreador", name: "L'œuvre immortelle", description: "Créer ou inspirer une œuvre marquante", points: 4, minBp: 1, maxBp: 5 },
  ventrue: { id: "clan_ventrue", name: "La couronne de fer", description: "Asseoir son autorité ou écraser un rival", points: 4, minBp: 1, maxBp: 5 },
  tremere: { id: "clan_tremere", name: "Le sang qui commande", description: "Accomplir un rituel de sang significatif", points: 4, minBp: 1, maxBp: 5 },
  malkavian: { id: "clan_malkavian", name: "La vérité dans la folie", description: "Avoir une vision qui s'avère vraie", points: 4, minBp: 1, maxBp: 5 },
  gangrel: { id: "clan_gangrel", name: "L'appel sauvage", description: "Survivre seul en milieu hostile", points: 4, minBp: 1, maxBp: 5 },
  lasombra: { id: "clan_lasombra", name: "L'ombre qui dévore", description: "Éliminer un obstacle par ambition", points: 4, minBp: 1, maxBp: 5 },
  tzimisce: { id: "clan_tzimisce", name: "Chair de ma chair", description: "Modifier sa chair ou défendre son domaine", points: 4, minBp: 1, maxBp: 5 },
  hecata: { id: "clan_hecata", name: "Murmures d'outre-tombe", description: "Communiquer avec les morts ou accomplir un rite funéraire", points: 4, minBp: 1, maxBp: 5 },
  ministry: { id: "clan_ministry", name: "La tentation du serpent", description: "Corrompre quelqu'un ou répandre le vice", points: 4, minBp: 1, maxBp: 5 },
  banu_haqim: { id: "clan_banu_haqim", name: "Le jugement du sang", description: "Exécuter un contrat ou punir un coupable", points: 4, minBp: 1, maxBp: 5 },
};

const RESONANCE_ACTIONS = [
  { id: "resonance_choleric", name: "Sang colérique", description: "Se nourrir sur quelqu'un en pleine rage ou violence", points: 2, minBp: 1, maxBp: 3, scaling: {1: 2, 2: 2, 3: 1} },
  { id: "resonance_melancholic", name: "Sang mélancolique", description: "Se nourrir sur quelqu'un en profond désespoir", points: 2, minBp: 1, maxBp: 3, scaling: {1: 2, 2: 2, 3: 1} },
  { id: "resonance_sanguine", name: "Sang sanguin", description: "Se nourrir sur quelqu'un en pleine euphorie ou passion", points: 2, minBp: 1, maxBp: 3, scaling: {1: 2, 2: 2, 3: 1} },
  { id: "resonance_phlegmatic", name: "Sang flegmatique", description: "Se nourrir sur quelqu'un en paix absolue ou apathie", points: 2, minBp: 1, maxBp: 3, scaling: {1: 2, 2: 2, 3: 1} },
  { id: "resonance_dyscrasia", name: "Dyscrasie", description: "Se nourrir sur une émotion extrême, à son paroxysme", points: 5, minBp: 1, maxBp: 4, scaling: {1: 5, 2: 5, 3: 5, 4: 3} },
];

const VAMPIRE_BLOOD_ACTIONS = [
  { id: "vampire_kiss", name: "Le baiser du prédateur", description: "Boire le sang d'un autre vampire (sans le tuer)", points: 4, cooldownDays: 30, minBp: 1, maxBp: 3 },
  { id: "elder_blood", name: "Sang d'Ancien", description: "Vider complètement un vampire de Puissance supérieure (le tuer)", points: 8, cooldownDays: 30, minBp: 1, maxBp: 4 },
  { id: "vaulderie", name: "La Vaulderie", description: "Participer à un rituel de partage de sang collectif", points: 5, cooldownDays: 30, minBp: 1, maxBp: 5 },
  { id: "diablerie", name: "L'Étreinte inversée", description: "Commettre une diablerie sur un vampire de rang supérieur (absorber son âme)", points: 25, cooldownDays: 30, minBp: 1, maxBp: 4 },
  { id: "methuselah_blood", name: "Sang de Mathusalem", description: "Boire le sang d'un Mathusalem (vampire millénaire, impossible à tuer)", points: 15, cooldownDays: 30, minBp: 3, maxBp: 5 },
  { id: "wassail_blood", name: "Vitae Corrompue", description: "Vider complètement un vampire en Wassail (perdu à la Bête)", points: 10, cooldownDays: 30, minBp: 3, maxBp: 5 },
];

const CRISIS_ACTIONS = [
  { id: "crisis_near_death", name: "Frôler la Mort Finale", description: "Survivre de justesse à un danger mortel", points: 5, minBp: 1, maxBp: 5, scaling: {1: 5, 2: 5, 3: 5, 4: 3, 5: 2} },
  { id: "crisis_resist_frenzy", name: "Dompter la Bête", description: "Résister à une frénésie en situation critique", points: 3, minBp: 1, maxBp: 4, scaling: {1: 3, 2: 3, 3: 3, 4: 2} },
  { id: "crisis_unleash_beast", name: "La Bête déchaînée", description: "Céder à la frénésie avec conséquences assumées", points: 4, minBp: 1, maxBp: 4, scaling: {1: 4, 2: 4, 3: 4, 4: 2} },
  { id: "crisis_final_death", name: "Mort Finale évitée", description: "Survivre à un staking ou une exposition solaire prolongée", points: 12, minBp: 3, maxBp: 5 },
];

const TORPOR_ACTIONS = [
  { id: "torpor_enter", name: "Le poids des siècles", description: "Entrer en torpeur volontaire (ellipse temporelle)", points: 10, minBp: 1, maxBp: 5 },
  { id: "torpor_wake", name: "Éveillé", description: "Se réveiller de torpeur", points: 3, minBp: 1, maxBp: 5 },
];

const ACTION_CATEGORIES = [
  { id: "unique", name: "Premières fois", icon: Star, description: "Actions uniques qui disparaissent après accomplissement", actions: UNIQUE_ACTIONS },
  { id: "resonance", name: "Résonance du Sang", icon: Heart, description: "Se nourrir de sang émotionnel", actions: RESONANCE_ACTIONS },
  { id: "vampire_blood", name: "Sang Vampirique", icon: Droplet, description: "Boire le sang d'autres vampires (cooldown: 1 mois)", actions: VAMPIRE_BLOOD_ACTIONS },
  { id: "crisis", name: "Crises", icon: Zap, description: "Moments de confrontation avec la Bête", actions: CRISIS_ACTIONS },
  { id: "torpor", name: "Torpeur", icon: Moon, description: "Le long sommeil des anciens", actions: TORPOR_ACTIONS },
];

// --- COMPOSANTS UI ---

const BloodGauge = ({ current, max, isMutating, level }) => {
  if (level >= 5) {
    return (
      <div className="mb-6 p-6 bg-red-950/20 border border-red-900 rounded-lg flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(120,0,0,0.1)]">
        <Crown className="text-red-600 mb-3 animate-pulse" size={32} />
        <h3 className="text-red-500 font-serif text-lg tracking-widest uppercase">Zénith Atteint</h3>
        <p className="text-stone-500 text-xs mt-2 max-w-xs">
          Votre sang a atteint sa saturation biologique maximale. Seule la Diablerie ou les siècles peuvent désormais l'altérer.
        </p>
      </div>
    );
  }

  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="mb-8 select-none">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-serif text-stone-500 uppercase tracking-widest">Épaississement du Sang</span>
        <span className="text-lg font-serif text-red-500 font-bold">{current} <span className="text-stone-600 text-sm">/ {max}</span></span>
      </div>

      <div className="h-4 bg-stone-900 rounded-full overflow-hidden border border-stone-800 relative shadow-inner">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle, #330000 1px, transparent 1px)', backgroundSize: '4px 4px'}}></div>

        <div
          className={`h-full transition-all duration-700 ease-out relative ${isMutating ? 'bg-red-600' : 'bg-red-900'}`}
          style={{ width: `${percentage}%` }}
        >
          {isMutating && (
            <div className="absolute inset-0 animate-pulse bg-white/10"></div>
          )}
        </div>
      </div>

      {isMutating ? (
        <div className="mt-3 flex items-center justify-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
          <HeartPulse size={14} /> Mutation Physiologique en cours...
        </div>
      ) : (
        <div className="mt-2 text-right">
          <span className="text-[10px] text-stone-600 uppercase">Prochain Stade : {BLOOD_STAGES[level + 1]?.title || "Max"}</span>
        </div>
      )}
    </div>
  );
};

// Composant pour une action
const ActionButton = ({ action, isDisabled, isPending, isCompleted, isCooldown, cooldownDate, isSubmitting, onSubmit }) => {
  const getStatusIcon = () => {
    if (isSubmitting) return <RefreshCw size={14} className="text-yellow-500 animate-spin" />;
    if (isCompleted) return <Check size={14} className="text-green-500" />;
    if (isPending) return <Clock size={14} className="text-yellow-500 animate-pulse" />;
    if (isCooldown) return <Clock size={14} className="text-orange-500" />;
    return null;
  };

  const getStatusText = () => {
    if (isSubmitting) return "Envoi en cours...";
    if (isCompleted) return "Accompli";
    if (isPending) return "En attente de validation";
    if (isCooldown) return `Disponible le ${new Date(cooldownDate).toLocaleDateString()}`;
    return null;
  };

  return (
    <button
      onClick={() => onSubmit(action)}
      disabled={isDisabled || isPending || isCompleted || isCooldown || isSubmitting}
      className={`
        w-full text-left p-4 rounded border transition-all relative overflow-hidden group
        ${isSubmitting
          ? 'action-submitting bg-yellow-950/30 border-yellow-700/50 cursor-wait'
          : isCompleted
          ? 'bg-green-950/20 border-green-900/30 opacity-50 cursor-not-allowed'
          : isPending
          ? 'bg-yellow-950/20 border-yellow-900/30 cursor-wait'
          : isCooldown
          ? 'bg-orange-950/20 border-orange-900/30 cursor-not-allowed opacity-60'
          : isDisabled
          ? 'bg-transparent border-stone-900/30 opacity-30 cursor-not-allowed'
          : 'bg-stone-900/60 border-stone-800 hover:border-red-900 hover:bg-stone-900 cursor-pointer active:scale-[0.98]'
        }
      `}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-serif text-base ${isCompleted ? 'line-through text-stone-600' : 'text-stone-200'}`}>
              {action.name}
            </span>
            {getStatusIcon()}
          </div>
          <div className="text-xs text-stone-500 max-w-md mt-1">
            {getStatusText() || action.description}
          </div>
        </div>
        {!isCompleted && !isCooldown && (
          <div className="flex flex-col items-center justify-center pl-4 border-l border-stone-800/50 ml-4">
            <Flame size={14} className="text-red-700 mb-1" />
            <span className="text-red-500 font-bold font-mono text-sm">+{action.points}</span>
          </div>
        )}
      </div>
    </button>
  );
};

// Composant pour une catégorie d'actions
const ActionCategory = ({ category, character, completedActions, pendingActions, cooldowns, submittingAction, onSubmitAction }) => {
  const [isOpen, setIsOpen] = useState(category.id === "unique" || category.id === "crisis");
  const CategoryIcon = category.icon;
  const bloodPotency = character.bloodPotency || 1;

  // Filtrer les actions visibles selon le BP et le statut
  const visibleActions = category.actions.filter(action => {
    // Vérifier la visibilité selon le BP
    if (!isActionVisible(action, bloodPotency)) {
      return false;
    }
    // Masquer les actions uniques déjà complétées
    if (category.id === "unique" && completedActions.includes(action.id)) {
      return false;
    }
    return true;
  });

  if (visibleActions.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 py-2 text-left group"
      >
        <div className="w-8 h-8 rounded bg-stone-900 border border-stone-800 flex items-center justify-center text-red-600 group-hover:border-red-900 transition-colors">
          <CategoryIcon size={16} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-serif text-stone-300 uppercase tracking-wider">{category.name}</h4>
          <p className="text-xs text-stone-600">{category.description}</p>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-stone-600" /> : <ChevronDown size={16} className="text-stone-600" />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 pl-11">
          {visibleActions.map(action => {
            const isCompleted = completedActions.includes(action.id);
            const isPending = pendingActions.includes(action.id);
            const cooldownDate = cooldowns[action.id];
            const isCooldown = cooldownDate && new Date(cooldownDate) > new Date();
            const scaledPoints = getActionPoints(action, bloodPotency);

            return (
              <ActionButton
                key={action.id}
                action={{...action, points: scaledPoints}}
                isDisabled={character.bloodPotency >= 5}
                isPending={isPending}
                isCompleted={isCompleted}
                isCooldown={isCooldown}
                cooldownDate={cooldownDate}
                isSubmitting={submittingAction === action.id}
                onSubmit={onSubmitAction}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Données par défaut
const DEFAULT_CHARACTER = {
  name: "Nouveau Vampire",
  clan: "",
  bloodPotency: 1,
  saturationPoints: 0,
  history: [],
  completedActions: [],
  pendingActions: [],
  cooldowns: {},
  isMutating: false,
  mutationEndsAt: null
};

// --- PAGE DE LOGIN ---
const LoginPage = ({ onLogin, error }) => {
  return (
    <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-serif text-red-600 mb-2">World of Darkness</h1>
        <p className="text-stone-500 mb-8">Fiche de Personnage Vampire</p>

        <div className="bg-stone-900/50 border border-stone-800 rounded-lg p-8 mb-6">
          <Droplet className="text-red-700 mx-auto mb-4" size={48} />
          <p className="text-stone-400 text-sm mb-6">
            Connecte-toi avec Discord pour accéder à ta fiche de personnage et synchroniser tes données avec le bot.
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <button
            onClick={onLogin}
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Se connecter avec Discord
          </button>
        </div>

        <p className="text-stone-600 text-xs">
          Tes données sont synchronisées avec le serveur Discord
        </p>
      </div>
    </div>
  );
};

export default function VampireSheet() {
  const [discordUser, setDiscordUser] = useState(null);
  const [character, setCharacter] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [submittingAction, setSubmittingAction] = useState(null);

  // Récupérer les infos Discord
  const fetchDiscordUser = useCallback(async (token) => {
    try {
      console.log('Fetching Discord user with token...');
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const user = await response.json();
        console.log('Discord user:', user.username);
        setDiscordUser(user);
        setLoading(false);
      } else {
        console.error('Discord API error:', response.status);
        localStorage.removeItem('discord_token');
        setAuthError('Token Discord invalide');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur Discord:', err);
      localStorage.removeItem('discord_token');
      setAuthError('Erreur de connexion à Discord');
      setLoading(false);
    }
  }, []);

  // Vérifier le token Discord au chargement
  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash;
      console.log('URL hash:', hash);

      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');

        if (access_token) {
          console.log('Token found in URL, saving...');
          localStorage.setItem('discord_token', access_token);
          window.history.replaceState(null, '', window.location.pathname);
          await fetchDiscordUser(access_token);
          return;
        }
      }

      const savedToken = localStorage.getItem('discord_token');
      console.log('Saved token exists:', !!savedToken);

      if (savedToken) {
        await fetchDiscordUser(savedToken);
      } else {
        setLoading(false);
      }
    };

    init();
  }, [fetchDiscordUser]);

  // Charger les données depuis Google Sheets
  const loadCharacter = useCallback(async () => {
    if (!discordUser) return;

    try {
      setLoading(true);
      setError(null);

      const url = `${GOOGLE_SHEETS_API}?action=get&userId=${encodeURIComponent(discordUser.id)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.character) {
        setCharacter({
          ...DEFAULT_CHARACTER,
          ...data.character,
          name: data.character.name || discordUser.username,
          bloodPotency: Number(data.character.bloodPotency) || 1,
          saturationPoints: Number(data.character.saturationPoints) || 0,
          completedActions: data.character.completedActions || [],
          pendingActions: data.character.pendingActions || [],
          cooldowns: data.character.cooldowns || {},
        });
      } else {
        setCharacter({
          ...DEFAULT_CHARACTER,
          name: discordUser.username,
        });
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur de connexion.');
      setCharacter({
        ...DEFAULT_CHARACTER,
        name: discordUser.username,
      });
    } finally {
      setLoading(false);
    }
  }, [discordUser]);

  // Charger le personnage quand l'utilisateur Discord est connecté
  useEffect(() => {
    if (discordUser) {
      loadCharacter();
    }
  }, [discordUser, loadCharacter]);

  // Sauvegarder vers Google Sheets
  // Note: On exclut les champs gérés par le bot Discord (completedActions, cooldowns, bloodPotency, saturationPoints)
  // pour éviter d'écraser les données lors de la sauvegarde automatique
  const saveCharacter = useCallback(async (charData) => {
    if (!discordUser) return;

    try {
      setSaving(true);

      // Exclure les champs gérés par le bot pour ne pas les écraser
      const { completedActions, cooldowns, bloodPotency, saturationPoints, pendingActions, ...safeData } = charData;

      const dataToSave = {
        ...safeData,
        visibleName: discordUser.username,
        visibleAvatar: discordUser.avatar,
      };

      const url = `${GOOGLE_SHEETS_API}?action=save&userId=${encodeURIComponent(discordUser.id)}&data=${encodeURIComponent(JSON.stringify(dataToSave))}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setLastSaved(new Date());
        setError(null);
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      setError('Erreur de sauvegarde');
    } finally {
      setSaving(false);
    }
  }, [discordUser]);

  // Sauvegarde automatique
  useEffect(() => {
    if (character && discordUser && !loading) {
      const timer = setTimeout(() => {
        saveCharacter(character);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [character, discordUser, loading, saveCharacter]);

  // Vérification mutation
  useEffect(() => {
    if (!character?.isMutating) return;

    const timer = setTimeout(() => {
      if (character.mutationEndsAt && new Date() > new Date(character.mutationEndsAt)) {
        const newLevel = Math.min(character.bloodPotency + 1, 5);
        setCharacter(prev => ({
          ...prev,
          bloodPotency: newLevel,
          saturationPoints: 0,
          isMutating: false,
          mutationEndsAt: null,
          history: [...(prev.history || []), {
            text: `MÉTAMORPHOSE : ${BLOOD_STAGES[newLevel].title}`,
            impact: 0,
            date: new Date().toISOString(),
            type: 'levelup'
          }]
        }));
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [character?.isMutating, character?.mutationEndsAt]);

  // Rafraîchissement automatique toutes les 30 secondes pour détecter les validations MJ
  useEffect(() => {
    if (!discordUser || loading) return;

    const refreshInterval = setInterval(async () => {
      try {
        const url = `${GOOGLE_SHEETS_API}?action=get&userId=${encodeURIComponent(discordUser.id)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.character) {
          // Mettre à jour seulement si les données importantes ont changé
          setCharacter(prev => {
            const newBP = Number(data.character.bloodPotency) || 1;
            const newSat = Number(data.character.saturationPoints) || 0;
            const newCompleted = data.character.completedActions || [];
            const newPending = data.character.pendingActions || [];

            // Vérifier si quelque chose a changé
            if (prev.bloodPotency !== newBP ||
                prev.saturationPoints !== newSat ||
                JSON.stringify(prev.completedActions) !== JSON.stringify(newCompleted) ||
                JSON.stringify(prev.pendingActions) !== JSON.stringify(newPending)) {
              return {
                ...prev,
                bloodPotency: newBP,
                saturationPoints: newSat,
                completedActions: newCompleted,
                pendingActions: newPending,
                cooldowns: data.character.cooldowns || prev.cooldowns,
                clan: data.character.clan || prev.clan,
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.error('Erreur rafraîchissement auto:', err);
      }
    }, 10000); // 10 secondes - rafraîchissement rapide pour détecter les validations

    return () => clearInterval(refreshInterval);
  }, [discordUser, loading]);

  const handleLogin = () => {
    window.location.href = getDiscordAuthUrl();
  };

  const handleLogout = () => {
    localStorage.removeItem('discord_token');
    setDiscordUser(null);
    setCharacter(null);
  };

  // Soumettre une action pour validation
  const handleSubmitAction = async (action) => {
    if (!character || !discordUser || submittingAction) return;
    if (character.bloodPotency >= 5) return;

    setSubmittingAction(action.id);

    try {
      const url = `${GOOGLE_SHEETS_API}?action=submit_action&userId=${encodeURIComponent(discordUser.id)}&actionId=${encodeURIComponent(action.id)}&actionName=${encodeURIComponent(action.name)}&points=${action.points}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        // Ajouter à la liste des actions en attente
        setCharacter(prev => ({
          ...prev,
          pendingActions: [...(prev.pendingActions || []), action.id],
          history: [...(prev.history || []), {
            text: `Action soumise: ${action.name}`,
            impact: action.points,
            date: new Date().toISOString(),
            type: 'pending'
          }]
        }));
      } else {
        setError(result.error || 'Erreur lors de la soumission');
      }
    } catch (err) {
      console.error('Erreur soumission action:', err);
      setError('Erreur de connexion');
    } finally {
      setSubmittingAction(null);
    }
  };

  const updateCharacterField = (field, value) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  // Page de login si pas connecté
  if (!discordUser && !loading) {
    return <LoginPage onLogin={handleLogin} error={authError} />;
  }

  if (loading || !character) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center text-red-900 font-serif animate-pulse">
        Chargement de la Vitae...
      </div>
    );
  }

  const currentStage = BLOOD_STAGES[character.bloodPotency] || BLOOD_STAGES[1];
  const maxPoints = SATURATION_THRESHOLDS[character.bloodPotency] || 100;
  const CurrentIcon = currentStage.icon;
  const avatarUrl = discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`;

  // Récupérer l'action de clan
  const clanAction = character.clan ? CLAN_ACTIONS[character.clan.toLowerCase()] : null;

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans selection:bg-red-900/50 pb-12">

      {/* STATUS BAR */}
      <div className={`border-b text-xs text-center py-2 flex items-center justify-center gap-2 ${error ? 'bg-red-900/30 border-red-700/50 text-red-200' : 'bg-stone-900/50 border-stone-800 text-stone-500'}`}>
        {saving ? (
          <>
            <RefreshCw size={12} className="animate-spin" />
            Sauvegarde en cours...
          </>
        ) : error ? (
          <>
            {error}
            <button onClick={loadCharacter} className="underline ml-2">Réessayer</button>
          </>
        ) : lastSaved ? (
          <>
            <Save size={12} />
            Sauvegardé à {lastSaved.toLocaleTimeString()}
          </>
        ) : (
          'Connecté à Google Sheets'
        )}
      </div>

      {/* HEADER FIXE */}
      <header className="bg-stone-950/80 backdrop-blur border-b border-red-900/10 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={discordUser.username}
              className="w-12 h-12 rounded-full border-2 border-red-900/50"
            />
            <div>
              <input
                className="bg-transparent border-none p-0 text-xl font-serif text-stone-200 placeholder-stone-700 focus:ring-0 w-48"
                placeholder="Nom du Vampire"
                value={character.name}
                onChange={(e) => updateCharacterField('name', e.target.value)}
              />
              <div className="text-xs text-red-700 uppercase tracking-widest font-bold mt-1">
                {character.clan && `${character.clan} • `}Puissance {character.bloodPotency} • {currentStage.rank}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-red-600 shadow-[0_0_15px_rgba(185,28,28,0.2)]">
              <CurrentIcon size={20} />
            </div>
            <button
              onClick={handleLogout}
              className="text-stone-600 hover:text-stone-400 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-10">

        {/* JAUGE & NARRATION */}
        <section>
          <BloodGauge current={character.saturationPoints} max={maxPoints} isMutating={character.isMutating} level={character.bloodPotency} />

          <div className="bg-gradient-to-br from-stone-900/40 to-stone-950/40 rounded border border-stone-800 p-6 mt-4 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <CurrentIcon size={100} />
             </div>

             <h2 className={`font-serif text-xl mb-4 ${currentStage.color} flex items-center gap-2`}>
                {currentStage.title}
             </h2>

             <p className="text-sm text-stone-300 leading-relaxed font-serif italic border-l-2 border-red-900/30 pl-4">
               "{currentStage.description}"
             </p>
          </div>
        </section>

        {/* ACTION DE CLAN */}
        {clanAction && character.bloodPotency < 5 && isActionVisible(clanAction, character.bloodPotency) && (
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-serif text-stone-500 uppercase tracking-widest">Action de Clan</h3>
              <div className="h-px bg-stone-900 flex-1"></div>
            </div>

            <ActionButton
              action={{...clanAction, points: getActionPoints(clanAction, character.bloodPotency)}}
              isDisabled={character.bloodPotency >= 5}
              isPending={(character.pendingActions || []).includes(clanAction.id)}
              isCompleted={false}
              isCooldown={false}
              isSubmitting={submittingAction === clanAction.id}
              onSubmit={handleSubmitAction}
            />
          </section>
        )}

        {/* ACTIONS PAR CATÉGORIE */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-sm font-serif text-stone-500 uppercase tracking-widest">Actions</h3>
            <div className="h-px bg-stone-900 flex-1"></div>
          </div>

          {character.bloodPotency >= 5 ? (
            <div className="text-center text-xs text-stone-600 italic py-4">
              Votre sang a atteint la perfection statique. Il n'évolue plus.
            </div>
          ) : (
            ACTION_CATEGORIES.map(category => (
              <ActionCategory
                key={category.id}
                category={category}
                character={character}
                completedActions={character.completedActions || []}
                pendingActions={character.pendingActions || []}
                cooldowns={character.cooldowns || {}}
                submittingAction={submittingAction}
                onSubmitAction={handleSubmitAction}
              />
            ))
          )}
        </section>

        {/* LOG */}
        <section className="border-t border-stone-900 pt-2">
           <button
             onClick={() => setHistoryOpen(!historyOpen)}
             className="w-full text-center py-2 text-xs uppercase tracking-widest text-stone-600 hover:text-stone-400 transition-colors flex items-center justify-center gap-2"
           >
             {historyOpen ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
             Mémoire du Sang
           </button>

           {historyOpen && (
             <div className="mt-4 space-y-3 bg-stone-950/50 p-4 rounded border border-stone-900 max-h-60 overflow-y-auto">
               {[...(character.history || [])].reverse().map((h, i) => (
                 <div key={i} className="flex justify-between items-center text-xs border-b border-stone-900 pb-2 last:border-0">
                   <span className={
                     h.type === 'levelup' ? 'text-red-400 font-bold' :
                     h.type === 'pending' ? 'text-yellow-500' :
                     'text-stone-400'
                   }>
                     {h.text}
                   </span>
                   <span className="text-stone-700 font-mono">{new Date(h.date).toLocaleDateString()}</span>
                 </div>
               ))}
               {(!character.history || character.history.length === 0) && (
                 <div className="text-center text-stone-600 text-xs italic">Aucun événement enregistré</div>
               )}
             </div>
           )}
        </section>

      </main>
    </div>
  );
}
