import { BLOOD_ACTIONS, SATURATION_THRESHOLDS, getClanActions } from '../../../data/bloodActions';
import { ActionCategory } from '../components/BloodActions';
import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, Activity, User, Crown, Shield, Flame, HeartPulse, ChevronDown, ChevronUp, Save, RefreshCw, LogIn, LogOut, Clock, Check, Star, Heart, Zap, Moon, Sparkles, ScrollText, Users, Skull, FileText, Book, ArrowLeft, Share2, Eye } from 'lucide-react';
import DisciplinesTab from '../components/DisciplinesTab';

import GhoulsTab from '../components/GhoulsTab';
import RitualsTab from '../components/RitualsTab';
import RulesTab from '../components/RulesTab';
import CharacterSheet from '../components/CharacterSheet';
import ClanSelection from './ClanSelectionPage';
import GmDashboard from '../../../core/components/GmDashboard';
import { getClanDescription } from '../../../data/clanDescriptions';

import { API_URL, GOOGLE_SHEETS_API, DISCORD_CLIENT_ID, REDIRECT_URI } from '../../../config';
import { useUserRoles } from '../../../core/hooks/useUserRoles';

// --- CONFIGURATION ---
// Imported from config.js to ensure consistency across the application

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

const ACTION_CATEGORIES = [
  { id: 'unique', name: 'Les premières cicatrices', icon: Star, description: 'Des expériences fondatrices, une fois dans votre existence.' },
  { id: 'general', name: 'Les épreuves de la nuit', icon: Flame, description: 'Conquérir, protéger, apprendre : des accomplissements qui laissent une trace.' },
  { id: 'resonance', name: 'Les saveurs du sang', icon: Heart, description: 'Atteindre une source singulière au-delà d’une chasse ordinaire.' },
].map(category => ({ ...category, actions: BLOOD_ACTIONS.filter(action => action.category === category.id) }));

// --- COMPOSANTS UI ---

const BloodGauge = ({ current, max, isMutating, level }) => {
  if (level >= 5) {
    return (
      <div className="mb-6 p-6 bg-red-950/20 border border-red-900 rounded-lg flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(120,0,0,0.1)]">
        <Crown className="text-red-600 mb-3 animate-pulse" size={32} />
        <h3 className="text-red-500 font-serif text-lg tracking-widest uppercase">Zénith Atteint</h3>
        <p className="text-stone-500 text-xs mt-2 max-w-xs">
          Votre sang a atteint le dernier niveau de cette progression. Votre héritage reste à écrire.
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
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #330000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>

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
  mutationEndsAt: null,
  ghouls: []
};

// --- PAGE DE LOGIN ---
const LoginPage = ({ onLogin, error }) => {
  return (
    <div className="vp-login min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center p-6">
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
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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
  const { discordUser, isAuthenticated, isLoading: authLoading, error: authErrorMsg } = useUserRoles();
  const [memberInfo, setMemberInfo] = useState(null);
  const [guildId, setGuildId] = useState(null); // Stocké séparément pour éviter crash si memberInfo null
  const [character, setCharacter] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  // const [authError, setAuthError] = useState(null); // Replaced by authErrorMsg
  const [submittingAction, setSubmittingAction] = useState(null);
  const [notVampire, setNotVampire] = useState(false);
  const [needsClanSelection, setNeedsClanSelection] = useState(false);
  const [vampireProfile, setVampireProfile] = useState(null);

  const [activeTab, setActiveTab] = useState('character'); // 'sheet', 'disciplines', 'ghouls', 'rituals'
  const [hasRituals, setHasRituals] = useState(false);
  const [isCainMode, setIsCainMode] = useState(false);

  const [npcCharacter, setNpcCharacter] = useState(null); // PNJ sélectionné en mode GM

  const [debugLogs, setDebugLogs] = useState([]);
  const addDebug = (msg) => setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  // Sync loading state with auth
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  // Anciennes fonctions fetchDiscordUser et useEffect d'initialisation supprimées (Legacy)
  // Remplacées par useUserRoles

  // GESTION PERSISTANCE PNJ (URL)
  useEffect(() => {
    // Si on a un npc_id dans l'url, on charge le PNJ correspondant
    const checkUrlForNpc = async () => {
      // Attendre que l'utilisateur soit connecté (discordUser) ou au moins que le loading initial soit fini
      // Mais on a besoin du token pour l'API...
      // Si on n'est pas encore connecté, le useEffect d'auth va courir.

      if (!discordUser || loading) return;

      const urlParams = new URLSearchParams(window.location.search);
      const npcId = urlParams.get('npc_id');

      if (npcId && !npcCharacter) {
        console.log("URL NPC ID detected:", npcId);
        // On doit charger ce PNJ
        try {
          const response = await fetch(`${API_URL}/api/gm/npcs/${npcId}`, {
            headers: {
              'X-Discord-User-ID': discordUser.id,
              'X-Discord-Guild-ID': guildId?.toString() // On espère que guildId est chargé via loadMemberInfo
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.npc) {
              console.log("NPC loaded from URL:", data.npc.name);
              // Activer le mode GM et charger le PNJ
              setIsCainMode(true);
              setNpcCharacter(data.npc);
              setCharacter({
                ...DEFAULT_CHARACTER,
                ...data.npc,
                bloodPotency: data.npc.blood_potency || data.npc.bloodPotency || 1,
                disciplines: data.npc.disciplines || {},
                rituals: data.npc.rituals || [],
                ghouls: [],
              });
              setActiveTab('character');
            }
          }
        } catch (e) {
          console.error("Error loading NPC from URL:", e);
        }
      }
    };

    checkUrlForNpc();
  }, [discordUser, loading, guildId]);

  // Charger les données depuis Google Sheets
  const loadCharacter = useCallback(async () => {
    if (!discordUser) return;

    try {
      setError(null);
      // Note: ne PAS reset notVampire/needsClanSelection ici, loadMemberInfo les gère

      const url = `${GOOGLE_SHEETS_API}?action=get&userId=${encodeURIComponent(discordUser.id)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.character) {
        // Vérifier si l'utilisateur a un personnage vampire complet
        // Note: On ne bloque PAS l'accès ici, le rôle Discord sera vérifié via vampireProfile
        const hasCharacterData = data.character.race === 'vampire' || data.character.clan;

        if (hasCharacterData) {
          // Utiliser le global_name Discord (avec accents) comme fallback au lieu du username brut
          // global_name est disponible directement via OAuth2, pas besoin de l'API server
          const displayName = discordUser.global_name || memberInfo?.display_name || discordUser.username;

          // Si le nom sauvegardé est le username brut (sans accents), le remplacer par le display name
          let characterName = data.character.name || displayName;
          if (characterName === discordUser.username && discordUser.global_name) {
            characterName = discordUser.global_name;
          }

          setCharacter({
            ...DEFAULT_CHARACTER,
            ...data.character,
            name: characterName,
            bloodPotency: Number(data.character.bloodPotency) || 1,
            saturationPoints: Number(data.character.saturationPoints) || 0,
            completedActions: data.character.completedActions || [],
            pendingActions: data.character.pendingActions || [],
            cooldowns: data.character.cooldowns || {},
            ghouls: data.character.ghouls || [],
          });
        }
        // Si pas de données de personnage, on laisse vampireProfile gérer (clan selection ou accès refusé)
      }
      // Si pas de character du tout, on laisse aussi vampireProfile gérer
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  }, [discordUser, memberInfo]);

  // Charger les infos du membre sur le serveur et vérifier le profil vampire
  // Retourne true si l'utilisateur a accès et qu'on doit charger le personnage
  const loadMemberInfo = useCallback(async () => {
    if (!discordUser) return false;

    try {
      // D'abord, détecter le serveur de l'utilisateur
      const guildResponse = await fetch(`${API_URL}/api/guild`, {
        headers: {
          'X-Discord-User-ID': discordUser.id,
        },
      });

      const guildData = await guildResponse.json();

      if (!guildData.success) {
        console.error('Erreur détection serveur:', guildData.error);
        setNotVampire(true);
        setLoading(false);
        return false;
      }

      const detectedGuildId = guildData.guild_id;
      setGuildId(detectedGuildId); // Sauvegarder dans le state pour ClanSelection

      // Ensuite, charger les infos du membre sur ce serveur
      const memberResponse = await fetch(`${API_URL}/api/member`, {
        headers: {
          'X-Discord-User-ID': discordUser.id,
          'X-Discord-Guild-ID': detectedGuildId.toString(),
        },
      });

      const memberData = await memberResponse.json();

      if (memberData.success) {
        setMemberInfo(memberData);
      } else {
        console.error('Erreur chargement member info:', memberData.error);
      }

      // Charger le profil vampire pour vérifier si l'utilisateur a le rôle mais pas de clan
      try {
        const vampireProfileResponse = await fetch(`${API_URL}/api/vampire/profile`, {
          headers: {
            'X-Discord-User-ID': discordUser.id,
            'X-Discord-Guild-ID': detectedGuildId.toString(),
          },
        });

        const vampireProfileData = await vampireProfileResponse.json();

        // Debug: afficher les infos de vérification du rôle
        console.log('=== DEBUG VAMPIRE PROFILE ===');
        console.log('Réponse API:', vampireProfileData);
        console.log('has_vampire_role:', vampireProfileData.has_vampire_role);
        console.log('clan:', vampireProfileData.clan);
        if (vampireProfileData._debug_expected_role) {
          console.log('Rôle attendu:', vampireProfileData._debug_expected_role);
          console.log('Rôles du membre:', vampireProfileData._debug_member_roles);
        }
        console.log('=============================');

        if (vampireProfileData.success) {
          setVampireProfile(vampireProfileData);

          // Check for rituals to unlock Grimoire tab
          try {
            const ritualsRes = await fetch(`${API_URL}/api/rituals`, {
              headers: {
                'X-Discord-User-ID': discordUser.id,
                'X-Discord-Guild-ID': detectedGuildId.toString()
              }
            });
            if (ritualsRes.ok) {
              const rData = await ritualsRes.json();
              if (rData.success && rData.rituals && rData.rituals.length > 0) {
                setHasRituals(true);
              }
            }
          } catch (e) {
            console.error("Error checking rituals:", e);
          }

          // Si l'utilisateur a le rôle Vampire mais pas de clan, afficher la sélection de clan
          if (vampireProfileData.has_vampire_role && !vampireProfileData.clan) {
            setNeedsClanSelection(true);
            setLoading(false);
            return false; // Ne pas charger le character si on doit sélectionner un clan
          }

          // Si l'utilisateur n'a PAS le rôle Vampire, refuser l'accès
          if (!vampireProfileData.has_vampire_role) {
            setNotVampire(true);
            setLoading(false);
            return false;
          }

          // Utilisateur a le rôle vampire ET un clan → continuer
          return true;
        } else {
          // Si l'API vampire profile échoue, refuser l'accès par sécurité
          console.error('Échec API vampire profile:', vampireProfileData);
          setNotVampire(true);
          setLoading(false);
          return false;
        }
      } catch (err) {
        console.error('Erreur chargement profil vampire:', err);
        setNotVampire(true);
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Erreur chargement member info:', err);
      setNotVampire(true);
      setLoading(false);
      return false;
    }
  }, [discordUser]);

  // Charger les infos du membre d'abord, puis le personnage
  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      if (!discordUser) return;

      try {
        setLoading(true);
        setError(null);
        setNotVampire(false);
        setNeedsClanSelection(false);

        // Charger les infos du membre et vérifier l'accès
        const shouldLoadCharacter = await loadMemberInfo();

        // Si le composant est démonté, arrêter
        if (!isActive) return;

        // Si loadMemberInfo a retourné false, l'accès est refusé ou sélection de clan requise
        // Dans ce cas, ne PAS appeler loadCharacter
        if (shouldLoadCharacter) {
          await loadCharacter();
        }

      } catch (err) {
        console.error('Erreur chargement données:', err);
        if (isActive) {
          setError('Erreur de chargement des données');
          setNotVampire(true);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discordUser]);

  // Sauvegarder (Google Sheets pour joueurs, API pour PNJ)
  // Note: On exclut les champs gérés par le bot Discord (completedActions, cooldowns, bloodPotency, saturationPoints)
  // pour éviter d'écraser les données lors de la sauvegarde automatique
  const saveCharacter = useCallback(async (charData) => {
    if (!discordUser) return;

    try {
      setSaving(true);
      setError(null);

      // CAS PNJ (NPC)
      if (npcCharacter) {
        // Pour les PNJ, on sauvegarde tout via l'API
        // On fusionne charData avec les infos de base du NPC (id, etc)
        const updateData = {
          ...charData,
          // Mapper les champs spécifiques si nécessaire
          disciplines: charData.disciplines || {},
          rituals: charData.rituals || [],
          blood_potency: charData.bloodPotency || charData.blood_potency || 1,
          image_url: charData.imageUrl || charData.image_url,
        };

        const response = await fetch(`${API_URL}/api/gm/npcs/${npcCharacter.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Discord-User-ID': discordUser.id,
            'X-Discord-Guild-ID': guildId.toString()
          },
          body: JSON.stringify(updateData)
        });

        const result = await response.json();
        if (result.success) {
          setLastSaved(new Date());
          // IMPORTANT: Mettre à jour l'ID du post forum s'il a changé (pour éviter les doublons et les boucles infinies)
          if (result.forum_post_id && result.forum_post_id !== npcCharacter?.forum_post_id) {
            setNpcCharacter(prev => ({ ...prev, forum_post_id: result.forum_post_id }));
            setCharacter(prev => ({ ...prev, forum_post_id: result.forum_post_id }));
          }
        } else {
          setError(result.error || "Erreur sauvegarde PNJ");
        }
        return;
      }

      // CAS JOUEUR (Google Sheets)
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
  }, [discordUser, npcCharacter, guildId]); // Ajouter npcCharacter et guildId aux dépendances

  // Sauvegarde automatique
  useEffect(() => {
    // Désactiver la sauvegarde auto pour les PNJ pour éviter trop d'appels API ou le faire moins souvent
    // Ici on laisse actif
    if ((character || npcCharacter) && discordUser && !loading) {
      const charToSave = npcCharacter ? character : character; // character contient les données modifiées dans les deux cas (voir handleUpdate below)

      const timer = setTimeout(() => {
        saveCharacter(charToSave);
      }, 2000); // 2 secondes pour les PNJ pour être plus soft
      return () => clearTimeout(timer);
    }
  }, [character, npcCharacter, discordUser, loading, saveCharacter]);

  // Rafraîchissement automatique toutes les 30 secondes pour détecter les validations MJ
  useEffect(() => {
    // Ne pas démarrer le rafraîchissement si l'utilisateur n'est pas connecté
    if (!discordUser) return;

    const refreshInterval = setInterval(async () => {
      // Ne pas rafraîchir en mode PNJ (pas de Google Sheets)
      if (npcCharacter) return;

      try {
        const url = `${GOOGLE_SHEETS_API}?action=get&userId=${encodeURIComponent(discordUser.id)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success && data.character) {
          // Mettre à jour seulement si les données importantes ont changé
          setCharacter(prev => {
            if (!prev) return prev; // Ne pas mettre à jour si character est null
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
  }, [discordUser, loading, character, needsClanSelection]);

  const handleLogin = () => {
    window.location.href = getDiscordAuthUrl();
  };

  const handleLogout = () => {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('discord_token_expires_at');
    // setDiscordUser(null); // Géré par reload
    // setCharacter(null);
    window.location.reload();
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
    return <LoginPage onLogin={handleLogin} error={authErrorMsg} />;
  }

  // Afficher une erreur si le chargement a échoué
  if (error && !loading && !character && !isCainMode) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-red-600 mb-4">
          <Activity size={48} className="mx-auto mb-2" />
          <h2 className="text-xl font-serif">Erreur de chargement</h2>
        </div>
        <p className="text-stone-400 mb-6">{error}</p>
        <button
          onClick={() => { setLoading(true); loadCharacter(); }}
          className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-6 py-2 rounded transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Page si l'utilisateur n'est pas un vampire (et pas besoin de sélection de clan)
  if (notVampire && !loading && !needsClanSelection) {
    return (
      <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-2xl font-serif text-red-600 mb-4">Accès Refusé</h1>
          <p className="text-stone-400 mb-8">
            Tu n'es pas un vampire. Cette fiche est réservée aux Enfants de la Nuit.
          </p>
          <button
            onClick={handleLogout}
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 px-6 py-2 rounded transition-colors"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (loading || (!character && !needsClanSelection && !isCainMode)) {
    return (
      <div className="bg-[#0c0a09] min-h-screen flex items-center justify-center text-red-900 font-serif animate-pulse">
        Chargement de la Vitae...
      </div>
    );
  }

  // FALLBACK CHARACTER pour le mode Caïn ou l'affichage de l'en-tête pendant la sélection
  // Si un PNJ est sélectionné, on utilise ses données
  const displayCharacter = npcCharacter ? {
    ...DEFAULT_CHARACTER,
    ...npcCharacter,
    // Adapter les champs PNJ aux champs attendus par l'UI
    completedActions: [], // Pas d'actions pour les PNJ pour l'instant
    pendingActions: [],
    cooldowns: {},
    isMutating: false
  } : (character || {
    ...DEFAULT_CHARACTER,
    name: discordUser?.global_name || discordUser?.username || "Nouveau Vampire"
  });

  // Utiliser une variable différente pour éviter de modifier la ref safeCharacter partout si on veut isoler
  const safeCharacter = character || displayCharacter;

  // En mode PNJ, character EST le PNJ (mis à jour par les inputs), mais displayCharacter est l'init
  // On va dire que safeCharacter est ce qu'on affiche

  // Correction: Pour que l'édition marche, il faut que 'character' state soit synchronisé avec le PNJ sélectionné
  // On le fait dans le onClick du dashboard. 
  // Ici safeCharacter doit pointer vers le state 'character' qui contient les données du PNJ

  const activeChar = character || displayCharacter; // Priorité au state local (modifié)


  // Protection contre les crashs si BP > 5 (ex: Caïn)
  const effectiveBP = Math.min(activeChar.bloodPotency || 1, 5);
  const currentStage = BLOOD_STAGES[effectiveBP] || BLOOD_STAGES[1];
  const maxPoints = SATURATION_THRESHOLDS[effectiveBP] || 100;
  const CurrentIcon = currentStage.icon;

  // Utiliser le nom Discord avec accents (global_name) au lieu du username brut
  const displayName = discordUser.global_name || memberInfo?.display_name || discordUser.username;
  const avatarUrl = memberInfo?.avatar_url || (discordUser.avatar
    ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator || '0') % 5}.png`);

  const clanActions = getClanActions(activeChar.clan);

  // Handler pour la publication Discord
  const handlePublishNpc = async () => {
    if (!npcCharacter || !discordUser) return;
    if (!confirm("Publier la fiche de ce PNJ sur Discord ?")) return;

    try {
      // On sauvegarde d'abord pour être sûr
      await saveCharacter(character);

      const response = await fetch(`${API_URL}/api/gm/npcs/${npcCharacter.id}/publish`, {
        method: 'POST',
        headers: {
          'X-Discord-User-ID': discordUser.id,
          'X-Discord-Guild-ID': guildId.toString()
        }
      });

      const result = await response.json();
      if (result.success) {
        alert("Fiche publiée avec succès !");
        // Mettre à jour le state local pour refléter le statut public
        setNpcCharacter(prev => ({ ...prev, status: 'public', forum_post_id: result.forum_post_id }));
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la publication");
    }
  };

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

      {/* HEADER FIXE - Toujours visible pour permettre l'accès au bouton Caïn */}
      <header className="vp-mast bg-stone-950/80 backdrop-blur border-b border-red-900/10 sticky top-0 z-20 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-full border-2 border-red-900/50"
            />
            <div>
              <div className="text-xl font-serif text-stone-200 truncate w-48" title={activeChar.name}>
                {activeChar.name || "Nom du Vampire"}
              </div>
              <div className="text-xs text-red-700 uppercase tracking-widest font-bold mt-1">
                {activeChar.clan ? `${activeChar.clan} • ` : 'Sans Clan • '}Puissance {activeChar.bloodPotency} • {currentStage.rank}
              </div>
              {memberInfo && (
                <div className="text-xs text-stone-400 mt-0.5">
                  Joué par <span className="font-medium text-stone-300">{memberInfo.display_name}</span>
                </div>
              )}
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

            {/* BOUTON RÈGLEMENT */}
            <button
              onClick={() => setActiveTab(activeTab === 'rules' ? 'character' : 'rules')}
              className={`ml-2 px-3 py-1 rounded text-xs font-serif uppercase tracking-wider border transition-all flex items-center gap-2 ${activeTab === 'rules'
                ? 'bg-stone-800 border-stone-600 text-stone-200'
                : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-300'
                }`}
              title="Règlement"
            >
              <ScrollText size={12} />
              Règlement
            </button>

            {vampireProfile?.is_gm && (
              <>

                <button
                  onClick={() => {
                    // Nettoyer l'URL dans tous les cas pour éviter de réouvrir le PNJ au reload
                    const url = new URL(window.location);
                    if (url.searchParams.has('npc_id')) {
                      url.searchParams.delete('npc_id');
                      window.history.pushState({}, '', url);
                    }

                    const newMode = !isCainMode;
                    setIsCainMode(newMode);
                    if (!newMode) {
                      setNpcCharacter(null);
                      loadCharacter(); // Recharger le perso joueur
                    } else {
                      // On passe en mode Caïn, on vide le character pour afficher le dashboard
                      setCharacter(null);
                      setNpcCharacter(null);
                    }
                  }}
                  className={`ml-2 px-3 py-1 rounded text-xs font-serif uppercase tracking-wider border transition-all flex items-center gap-2 ${isCainMode
                    ? 'bg-red-900/20 border-red-800 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                    : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-red-900/50 hover:text-red-400'
                    }`}
                  title="Mode Caïn (MJ)"
                >
                  {isCainMode ? <Flame size={12} className="animate-pulse" /> : <Shield size={12} />}
                  {npcCharacter ? "Quitter PNJ" : "MJ"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}

      {/* 1. DASHBOARD MJ */}
      {isCainMode && !npcCharacter ? (
        <GmDashboard
          discordUser={discordUser}
          guildId={guildId}
          onSelectNpc={(npc) => {
            setNpcCharacter(npc);
            // Mettre à jour l'URL pour la persistance
            const url = new URL(window.location);
            url.searchParams.set('npc_id', npc.id);
            window.history.pushState({}, '', url);

            // Préparer le character state avec les données du PNJ pour l'édition
            setCharacter({
              ...DEFAULT_CHARACTER,
              ...npc,
              // S'assurer que les objets complexes sont initialisés
              // Fix crucial: mapper les champs snake_case (DB) vers camelCase (Frontend)
              bloodPotency: npc.blood_potency || npc.bloodPotency || 1,
              disciplines: npc.disciplines || {},
              rituals: npc.rituals || [],
              ghouls: [], // Pas de goules pour les PNJ pour l'instant
            });
            setActiveTab('character');
          }}
        />
      ) : needsClanSelection && !isCainMode && activeTab !== 'rules' ? (
        <div className="w-full">
          <ClanSelection
            userId={discordUser.id}
            guildId={guildId}
            onClanSelected={async (clanId) => {
              setNeedsClanSelection(false);
              setLoading(true);
              await loadCharacter();
              setActiveTab('character');
            }}
          />
        </div>
      ) : (
        <>
          {/* BARRE D'OUTILS PNJ */}
          {npcCharacter && (
            <div className="bg-stone-900 border-b border-stone-800 p-2 flex justify-between items-center px-6">
              <button
                onClick={() => {
                  setNpcCharacter(null);
                  setCharacter(null);
                  setIsCainMode(true); // Assurer le retour au dashboard

                  // Nettoyer l'URL
                  const url = new URL(window.location);
                  url.searchParams.delete('npc_id');
                  window.history.pushState({}, '', url);
                }}
                className="flex items-center gap-2 text-stone-400 hover:text-stone-200 text-sm"
              >
                <ArrowLeft size={16} /> Retour à la liste
              </button>

              <div className="flex items-center gap-4">
                <span className="text-stone-500 text-sm uppercase tracking-wider font-bold">MODE ÉDITION PNJ</span>

              </div>
            </div>
          )}

          {/* NAVIGATION PAR ONGLETS - Masquer si on est en sélection de clan */}
          {!needsClanSelection && (
            <div className="vp-tabs bg-stone-950/50 border-b border-stone-800">
              <div className="max-w-2xl mx-auto flex">
                <button
                  onClick={() => setActiveTab('character')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-serif uppercase tracking-wider transition-all border-b-2 ${activeTab === 'character'
                    ? 'text-red-500 border-red-600 bg-stone-900/30'
                    : 'text-stone-500 border-transparent hover:text-stone-300 hover:text-stone-300 hover:bg-stone-900/20'
                    }`}
                >
                  <FileText size={16} />
                  Fiche
                </button>
                <button
                  onClick={() => setActiveTab('sheet')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-serif uppercase tracking-wider transition-all border-b-2 ${activeTab === 'sheet'
                    ? 'text-red-500 border-red-600 bg-stone-900/30'
                    : 'text-stone-500 border-transparent hover:text-stone-300 hover:text-stone-300 hover:bg-stone-900/20'
                    }`}
                >
                  <Droplet size={16} />
                  Vitae
                </button>
                <button
                  onClick={() => setActiveTab('disciplines')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-serif uppercase tracking-wider transition-all border-b-2 ${activeTab === 'disciplines'
                    ? 'text-red-500 border-red-600 bg-stone-900/30'
                    : 'text-stone-500 border-transparent hover:text-stone-300 hover:text-stone-300 hover:bg-stone-900/20'
                    }`}
                >
                  <Sparkles size={16} />
                  Disciplines
                </button>

                {(['tremere', 'hecata', 'giovanni', 'banu_haqim', 'assamite'].includes(activeChar.clan?.toLowerCase()) || activeChar.disciplines?.thaumaturgy || activeChar.disciplines?.necromancy || hasRituals || isCainMode) && (
                  <button
                    onClick={() => setActiveTab('rituals')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-serif uppercase tracking-wider transition-all border-b-2 ${activeTab === 'rituals'
                      ? 'text-red-500 border-red-600 bg-stone-900/30'
                      : 'text-stone-500 border-transparent hover:text-stone-300 hover:text-stone-300 hover:bg-stone-900/20'
                      }`}
                  >
                    <Book size={16} />
                    Grimoire
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('ghouls')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-serif uppercase tracking-wider transition-all border-b-2 ${activeTab === 'ghouls'
                    ? 'text-red-500 border-red-600 bg-stone-900/30'
                    : 'text-stone-500 border-transparent hover:text-stone-300 hover:bg-stone-900/20'
                    }`}
                >
                  <Users size={16} />
                  Goules
                </button>
              </div>
            </div>
          )}

          <main data-active-tab={activeTab} className={`vp-content mx-auto p-6 space-y-10 ${activeTab === 'rules' || activeTab === 'rituals' ? 'max-w-[1600px]' : 'max-w-2xl'}`}>

            {/* ONGLET RÈGLEMENT */}
            {activeTab === 'rules' && (
              <RulesTab setActiveTab={setActiveTab} />
            )}

            {/* ONGLET VITALITÉ (Bio) */}
            {activeTab === 'character' && (
              <CharacterSheet
                userId={discordUser.id}
                guildId={guildId}
                // Passer les données du PNJ si on est en mode édition PNJ
                // On fusionne activeChar avec le contenu de sheet_data pour que CharacterSheet ait accès à history (texte), age, etc.
                initialData={npcCharacter ? {
                  ...activeChar,
                  ...(activeChar.sheet_data || {})
                } : null}

                // Gérer la sauvegarde différemment pour les PNJ
                onSave={npcCharacter ? async (formData) => {
                  // Séparer les champs top-level (name, image) des champs de fiche (texte)
                  const { name, image_url, ...sheetFields } = formData;

                  const updatedChar = {
                    ...activeChar,
                    name,
                    image_url,
                    sheet_data: sheetFields
                  };

                  // Mettre à jour l'état local
                  setCharacter(updatedChar);
                  setNpcCharacter(prev => ({ ...prev, name, image_url, sheet_data: sheetFields }));

                  // Sauvegarder en BDD (ce qui déclenchera la publication Discord)
                  await saveCharacter(updatedChar);
                } : null}

                onUpdate={(updates) => {
                  setCharacter(prev => ({ ...prev, ...updates }));
                }}
              />
            )}

            {/* ONGLET VITAE */}
            {activeTab === 'sheet' && (
              <>
                {/* JAUGE & NARRATION */}
                <section>
                  <BloodGauge current={activeChar.saturationPoints} max={maxPoints} isMutating={false} level={activeChar.bloodPotency} />

                  <div className="vp-blood-story bg-gradient-to-br from-stone-900/40 to-stone-950/40 rounded border border-stone-800 p-6 mt-4 relative overflow-hidden">
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

                {/* MALÉDICTION DU CLAN */}
                {activeChar.clan && getClanDescription(activeChar.clan) && (
                  <section>
                    <div className="flex items-center gap-3 mb-4">
                      <Skull size={16} className="text-red-700" />
                      <h3 className="text-sm font-serif text-red-700 uppercase tracking-widest">Malédiction du Clan</h3>
                      <div className="h-px bg-red-900/30 flex-1"></div>
                    </div>

                    <div className="bg-red-950/20 border border-red-900/30 rounded-lg p-5">
                      <h4 className="text-red-500 font-serif text-lg mb-3">
                        {getClanDescription(activeChar.clan).bane}
                      </h4>
                      <p className="text-stone-400 text-sm leading-relaxed">
                        {getClanDescription(activeChar.clan).baneDescription}
                      </p>
                    </div>
                  </section>
                )}

                <div className="text-sm text-stone-400 leading-relaxed border border-stone-800 rounded p-4">
                  Chaque accomplissement possède sa récompense. Plusieurs réalisations distinctes peuvent compter dans une même scène, sans plafond ni délai de récupération. Un même résultat ne se réclame qu’une fois.
                  <p className="mt-2 text-xs">Le MJ vérifie l’obstacle rencontré et le résultat obtenu. Une action répétée demande une nouvelle difficulté réelle. Les pistes proposées vous laissent choisir votre voie.</p>
                </div>
                <ActionCategory category={{ id: 'clan', name: 'L’héritage de votre sang', icon: Droplet,
                  description: activeChar.bloodPotency >= 5 ? 'Votre puissance ne croît plus ; votre histoire continue.' : 'Des voies propres à votre lignée, enrichies à chaque niveau.', actions: activeChar.bloodPotency >= 5 ? clanActions.filter(action => action.minBp === 5) : clanActions }}
                  character={activeChar} completedActions={activeChar.completedActions || []} pendingActions={activeChar.pendingActions || []}
                  submittingAction={submittingAction} onSubmitAction={handleSubmitAction} />

                {/* ACTIONS PAR CATÉGORIE */}
                <section className="vp-vitae-actions">
                  <div className="vp-vitae-photograph" aria-hidden="true" />
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-sm font-serif text-stone-500 uppercase tracking-widest">Actions</h3>
                    <div className="h-px bg-stone-900 flex-1"></div>
                  </div>

                  {activeChar.bloodPotency >= 5 ? (
                    <div className="text-center text-xs text-stone-600 italic py-4">
                      Votre parcours de puissance est accompli. Les voies d’héritage de votre clan restent ouvertes au récit.
                    </div>
                  ) : (
                    ACTION_CATEGORIES.map(category => (
                      <ActionCategory
                        key={category.id}
                        category={category}
                        character={activeChar}
                        completedActions={activeChar.completedActions || []}
                        pendingActions={activeChar.pendingActions || []}
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
                    {historyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    Mémoire du Sang
                  </button>

                  {historyOpen && (
                    <div className="mt-4 space-y-3 bg-stone-950/50 p-4 rounded border border-stone-900 max-h-60 overflow-y-auto">
                      {[...(activeChar.history || [])].reverse().map((h, i) => (
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
                      {(!activeChar.history || activeChar.history.length === 0) && (
                        <div className="text-center text-stone-600 text-xs italic">Aucun événement enregistré</div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* ONGLET DISCIPLINES */}
            {activeTab === 'disciplines' && (
              <DisciplinesTab
                clan={activeChar.clan}
                bloodPotency={isCainMode && !npcCharacter ? 5 : activeChar.bloodPotency}
                isCainMode={npcCharacter?.id === 'cain_legendary'}
              />
            )}

            {/* ONGLET RITUELS */}
            {activeTab === 'rituals' && (
              <RitualsTab
                userId={discordUser.id}
                guildId={guildId}
                clan={activeChar.clan}
                isCainMode={npcCharacter?.id === 'cain_legendary'}
                character={activeChar} // Passer le character pour que le composant puisse vérifier les rituels
              />
            )}

            {/* ONGLET GOULES */}
            {activeTab === 'ghouls' && (
              <GhoulsTab
                ghouls={activeChar.ghouls || []}
                clan={activeChar.clan}
                bloodPotency={activeChar.bloodPotency}
                onUpdateGhouls={(updatedGhouls) => {
                  const updated = { ...activeChar, ghouls: updatedGhouls };
                  setCharacter(updated);
                  saveCharacter(updated);
                }}
              />
            )}

          </main>
        </>
      )
      }
    </div >
  );
}
