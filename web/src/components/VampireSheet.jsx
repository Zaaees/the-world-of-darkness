import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, Activity, User, Crown, Shield, Flame, HeartPulse, ChevronDown, ChevronUp, Save, RefreshCw, LogIn, LogOut } from 'lucide-react';

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

const ACTIONS_NARRATIVE = [
  {
    id: 'trauma_survival',
    minBP: 1,
    maxBP: 5,
    points: 4,
    label: "Reconstruction Corporelle",
    desc: "Survivre à des dégâts massifs (incapacité physique) qui forcent le sang à reconstruire les tissus."
  },
  {
    id: 'blood_surge_limit',
    minBP: 1,
    maxBP: 4,
    points: 2,
    label: "Surcharge de Vitae",
    desc: "Pousser son corps au-delà de ses limites surnaturelles (Exaltation) dans une situation critique."
  },
  {
    id: 'dyscrasia',
    minBP: 1,
    maxBP: 4,
    points: 3,
    label: "Absorption de Dyscrasie",
    desc: "Se nourrir d'une humeur intense (Colère pure, Mélancolie profonde) qui modifie chimiquement le sang."
  },
  {
    id: 'supernatural_feeding',
    minBP: 2,
    maxBP: 5,
    points: 6,
    label: "Sang Surnaturel",
    desc: "Boire le sang dangereux et puissant d'un Loup-Garou ou d'une Fée."
  },
  {
    id: 'torpor_wake',
    minBP: 3,
    maxBP: 5,
    points: 10,
    label: "Le Long Sommeil",
    desc: "Se réveiller d'une Torpeur significative (décennies), le sang ayant mûri pendant le repos."
  },
  {
    id: 'diablerie',
    minBP: 1,
    maxBP: 5,
    points: 25,
    label: "Diablerie",
    desc: "L'acte ultime : voler l'âme et la puissance d'un vampire plus âgé. Évolution immédiate et violente."
  }
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

// Données par défaut
const DEFAULT_CHARACTER = {
  name: "Nouveau Vampire",
  clan: "",
  bloodPotency: 1,
  saturationPoints: 0,
  history: [],
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
            <svg width="24" height="24" viewBox="0 0 71 55" fill="currentColor">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3## 44.2785 53.4خبیر 44.2898 53.5765 44.3433C53.9wo 44.6363 54.3035 44.9293 54.6785 45.2082C54.8072 45.304 54.7988 45.5041 54.6589 45.5858C52.8902 46.6197 51.0515 47.4931 49.1177 48.2228C48.9918 48.2707 48.9358 48.4172 48.9974 48.5383C50.0640 50.6034 51.2814 52.5699 52.6215 54.4350C52.6## 54.5765 54.7889 54.5765 54.7889 54.5477C60.5765 52.7249 66.4592 50.0174 72.5765 45.5576C72.6299 45.5182 72.6635 45.4590 72.6691 45.3942C74.1557 30.0791 70.1335 16.7757 60.2006 4.9823C60.1783 4.9429 60.1447 4.9147 60.1045 4.8978ZM24.0772 37.3429C20.5306 37.3429 17.5985 34.1255 17.5985 30.1683C17.5985 26.2110 20.4753 23.0099 24.0772 23.0099C27.7068 23.0099 30.6117 26.2391 30.5559 30.1683C30.5559 34.1255 27.6791 37.3429 24.0772 37.3429ZM47.9905 37.3429C44.4439 37.3429 41.5118 34.1255 41.5118 30.1683C41.5118 26.2110 44.3886 23.0099 47.9905 23.0099C51.6201 23.0099 54.5250 26.2391 54.4692 30.1683C54.4692 34.1255 51.6201 37.3429 47.9905 37.3429Z"/>
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
      // Check for callback token in URL hash
      const hash = window.location.hash;
      console.log('URL hash:', hash);

      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get('access_token');

        if (access_token) {
          console.log('Token found in URL, saving...');
          localStorage.setItem('discord_token', access_token);
          // Clear hash from URL
          window.history.replaceState(null, '', window.location.pathname);
          // Fetch user with new token
          await fetchDiscordUser(access_token);
          return;
        }
      }

      // Load saved token
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
        });
      } else {
        // Nouveau personnage avec nom Discord
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
  const saveCharacter = useCallback(async (charData) => {
    if (!discordUser) return;

    try {
      setSaving(true);

      const dataToSave = {
        ...charData,
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

  const handleLogin = () => {
    window.location.href = getDiscordAuthUrl();
  };

  const handleLogout = () => {
    localStorage.removeItem('discord_token');
    setDiscordUser(null);
    setCharacter(null);
  };

  const handleAction = async (action) => {
    if (!character || character.isMutating || character.bloodPotency >= 5) return;
    if (character.bloodPotency > action.maxBP) return;

    const max = SATURATION_THRESHOLDS[character.bloodPotency];
    let newPoints = character.saturationPoints + action.points;
    let willMutate = false;
    let mutationEnd = null;

    if (newPoints >= max) {
      newPoints = max;
      willMutate = true;
      mutationEnd = new Date(Date.now() + 5000);
    }

    const newHistory = {
      text: action.label,
      impact: action.points,
      date: new Date().toISOString(),
      type: 'action'
    };

    setCharacter(prev => ({
      ...prev,
      saturationPoints: newPoints,
      isMutating: willMutate,
      mutationEndsAt: willMutate ? mutationEnd.toISOString() : null,
      history: [...(prev.history || []), newHistory]
    }));
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

        {/* LISTE D'ACTIONS PHYSIOLOGIQUES */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-sm font-serif text-stone-500 uppercase tracking-widest">Facteurs d'Épaississement</h3>
            <div className="h-px bg-stone-900 flex-1"></div>
          </div>

          <div className="space-y-3">
            {ACTIONS_NARRATIVE.map((act) => {
              const isObsolete = character.bloodPotency > act.maxBP;
              const isLocked = character.bloodPotency < act.minBP;
              const isMaxed = character.bloodPotency >= 5;
              const isDisabled = character.isMutating || isObsolete || isLocked || isMaxed;

              if (isLocked) return null;

              return (
                <button
                  key={act.id}
                  onClick={() => handleAction(act)}
                  disabled={isDisabled}
                  className={`
                    w-full text-left p-4 rounded border transition-all relative overflow-hidden group
                    ${isObsolete
                      ? 'bg-transparent border-stone-900/30 opacity-30 cursor-not-allowed grayscale'
                      : 'bg-stone-900/60 border-stone-800 hover:border-red-900 hover:bg-stone-900'
                    }
                  `}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className={`font-serif text-base mb-1 ${isObsolete ? 'line-through text-stone-600' : 'text-stone-200'}`}>
                        {act.label}
                      </div>
                      <div className="text-xs text-stone-500 max-w-md">
                        {isObsolete ? "Ce stimulus ne suffit plus à provoquer une mutation du sang." : act.desc}
                      </div>
                    </div>
                    {!isObsolete && !isMaxed && (
                      <div className="flex flex-col items-center justify-center pl-4 border-l border-stone-800/50 ml-4">
                         <Flame size={14} className="text-red-700 mb-1" />
                         <span className="text-red-500 font-bold font-mono text-sm">+{act.points}</span>
                      </div>
                    )}
                  </div>
                </button>
              )
            })}

            {character.bloodPotency >= 5 && (
               <div className="text-center text-xs text-stone-600 italic py-4">
                 Votre sang a atteint la perfection statique. Il n'évolue plus.
               </div>
            )}
          </div>
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
                   <span className={h.type === 'levelup' ? 'text-red-400 font-bold' : 'text-stone-400'}>
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
