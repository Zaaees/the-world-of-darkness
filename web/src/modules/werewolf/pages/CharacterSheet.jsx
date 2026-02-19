import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
import RenownBadge from '../components/RenownBadge';
import WerewolfLoading from '../components/WerewolfLoading';
import StoryEditor from '../components/StoryEditor';
import GiftsTab from './GiftsPage/GiftsTab';
import RenownTab from './RenownTab';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { useRenown } from '../hooks/useRenown';
import { API_URL } from '../../../config';
import { translate } from '../utils/translations';
import werewolfLoreData from '../assets/werewolf_data.json';
// import { toast } from 'sonner';
const toast = {
    success: (msg) => console.log('Toast Success:', msg),
    error: (msg) => console.error('Toast Error:', msg)
};

/**
 * Détermine l'onglet initial à partir du chemin URL.
 * @param {string} pathname - Le chemin de l'URL courante.
 * @returns {'sheet' | 'gifts' | 'renown'} L'onglet correspondant.
 */
const getTabFromPath = (pathname) => {
    if (pathname.includes('/gifts')) return 'gifts';
    if (pathname.includes('/renown')) return 'renown';
    return 'sheet';
};

/** Mapping onglet → chemin URL */
const TAB_PATHS = {
    sheet: '/werewolf/sheet',
    gifts: '/werewolf/gifts',
    renown: '/werewolf/renown'
};

/**
 * Page CharacterSheet (Architecture SPA à onglets)
 * Container principal du module Werewolf qui gère les 3 onglets :
 * - Fiche (sheet) : informations du personnage
 * - Dons (gifts) : catalogue de dons
 * - Renommée (renown) : hauts faits et scores
 *
 * Les données des 3 sections sont chargées en parallèle au montage
 * pour garantir une navigation instantanée entre les onglets.
 */
/**
 * Retrouve les données de lore enrichies pour un personnage.
 * Compare par ID (snake_case) ET par nom traduit (français) pour la compatibilité.
 */
const findLoreData = (type, value) => {
    if (!value) return null;
    const collection = werewolfLoreData[type];
    if (!collection) return null;
    // Chercher par ID d'abord (snake_case)
    const byId = collection.find(item => item.id === value.toLowerCase().replace(/\s+/g, '_'));
    if (byId) return byId;
    // Chercher par nom français
    return collection.find(item => item.name_fr === value || item.name_fr === translate(type === 'breeds' ? 'breed' : type === 'auspices' ? 'auspice' : 'tribe', value));
};

const CharacterSheet = ({ initialTab }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(
        initialTab || getTabFromPath(location.pathname)
    );

    // ── État du personnage (onglet Sheet) ──
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingStory, setIsEditingStory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [storyDraft, setStoryDraft] = useState('');

    // ── État des Dons (onglet Gifts) ──
    const [giftsData, setGiftsData] = useState({
        catalogue: [],
        unlockedIds: [],
        playerTribe: null,
        loaded: false
    });

    // ── État de la Renommée (onglet Renown) ──
    const [renownState, setRenownState] = useState({
        data: { glory: [], honor: [], wisdom: [] },
        scores: { glory: 0, honor: 0, wisdom: 0 },
        loaded: false
    });

    // ── Auth ──
    const { discordUser, guildId, isLoading: isAuthLoading } = useUserRoles();
    const { submitRenown, fetchMyRenown } = useRenown();

    // ── Sync onglet avec URL quand la location change (navigation externe/navbar) ──
    useEffect(() => {
        const newTab = initialTab || getTabFromPath(location.pathname);
        setActiveTab(newTab);
    }, [location.pathname, initialTab]);

    /**
     * Change d'onglet et synchronise l'URL.
     */
    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
        navigate(TAB_PATHS[tab], { replace: true });
    }, [navigate]);

    // ── Chargement parallèle de toutes les données ──
    useEffect(() => {
        if (isAuthLoading || !discordUser || !guildId) return;

        const userId = String(discordUser?.id);
        const gId = String(guildId);

        if (!userId || !gId || userId === 'undefined' || gId === 'undefined') {
            setError('Informations d\'authentification manquantes');
            setLoading(false);
            return;
        }

        const headers = {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': gId
        };

        const fetchCharacter = fetch(`${API_URL}/api/modules/werewolf/character`, { headers })
            .then(res => {
                if (!res.ok) return res.json().then(d => { throw { ...d, httpStatus: res.status }; });
                return res.json();
            });

        const fetchGifts = fetch(`${API_URL}/api/modules/werewolf/gifts`, { headers })
            .then(res => {
                if (!res.ok) throw new Error(`Erreur HTTP Gifts: ${res.status}`);
                return res.json();
            })
            .catch(err => {
                console.warn('[CharacterSheet] Gifts fetch failed (non-blocking):', err);
                return null;
            });

        const fetchRenown = fetchMyRenown().catch(err => {
            console.warn('[CharacterSheet] Renown fetch failed (non-blocking):', err);
            return null;
        });

        // Lancer les 3 fetches en parallèle
        Promise.all([fetchCharacter, fetchGifts, fetchRenown])
            .then(([charData, giftsResult, renownResults]) => {
                // Personnage
                if (charData?.character) {
                    setCharacter(charData.character);
                    setStoryDraft(charData.character.story || '');
                } else if (charData?.code === 'NO_CHARACTER') {
                    setError('NOT_FOUND');
                }

                // Dons
                if (giftsResult?.success) {
                    setGiftsData({
                        catalogue: giftsResult.catalogue || [],
                        unlockedIds: giftsResult.unlocked_ids || [],
                        playerTribe: giftsResult.profile?.tribe || giftsResult.tribe || null,
                        loaded: true
                    });
                }

                // Renommée
                if (renownResults) {
                    processRenownData(renownResults);
                }
            })
            .catch(err => {
                console.error('[CharacterSheet] Fetch error:', err);
                if (err?.code === 'NO_CHARACTER') {
                    setError('NOT_FOUND');
                } else {
                    setError(err.message || 'Erreur lors du chargement');
                }
            })
            .finally(() => {
                setLoading(false);
            });

        // Poll pour les mises à jour du personnage (rang)
        const interval = setInterval(() => {
            fetch(`${API_URL}/api/modules/werewolf/character`, { headers })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data?.character) {
                        setCharacter(prev => {
                            if (prev && prev.rank !== data.character.rank) {
                                toast.success(`Votre rang a changé ! (Rang ${data.character.rank})`);
                                return { ...prev, ...data.character };
                            }
                            return prev;
                        });
                    }
                })
                .catch(() => { });
        }, 10000);

        return () => clearInterval(interval);
    }, [discordUser?.id, guildId, isAuthLoading]);

    /**
     * Traite les données brutes de renommée en structure triée.
     */
    const processRenownData = (results) => {
        const newRenown = { glory: [], honor: [], wisdom: [] };
        const newScores = { glory: 0, honor: 0, wisdom: 0 };

        results.forEach(item => {
            const type = item.renown_type ? item.renown_type.toLowerCase() : 'glory';
            if (newRenown[type]) {
                newRenown[type].push(item);
                newScores[type] += 1;
            }
        });

        setRenownState({
            data: newRenown,
            scores: newScores,
            loaded: true
        });
    };

    /**
     * Rafraîchit les données de renommée (après soumission d'un haut fait).
     */
    const handleRenownRefresh = async () => {
        try {
            const results = await fetchMyRenown();
            if (results) processRenownData(results);
        } catch (err) {
            console.error('[CharacterSheet] Renown refresh error:', err);
        }
    };

    /**
     * Met à jour l'histoire du personnage.
     */
    const handleUpdateStory = async (newStory) => {
        if (!discordUser) return;

        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': String(discordUser.id),
                    'X-Discord-Guild-ID': String(guildId)
                },
                body: JSON.stringify({ story: newStory })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde de l\'histoire');
            }

            const data = await response.json();
            setCharacter(prev => ({ ...prev, story: data.character.story }));
            setStoryDraft(data.character.story);
            return { story: data.character.story, synced: data.synced };
        } catch (err) {
            console.error('Update story error:', err);
            if (!isEditingStory) console.error("Save error:", err.message);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    // ── Rendu : états de chargement et d'erreur ──
    if (loading) return <WerewolfLoading />;

    if (error === 'NOT_FOUND') {
        return (
            <WerewolfLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                    <h2 className="text-2xl text-amber-200 mb-4">Aucune fiche trouvée</h2>
                    <p className="text-stone-400 mb-8">Vous n'avez pas encore créé de personnage Loup-Garou.</p>
                    <Link to="/werewolf/create" className="px-6 py-2 bg-emerald-900 border border-emerald-600 text-emerald-100 rounded hover:bg-emerald-800 transition-colors">
                        Créer un personnage
                    </Link>
                </div>
            </WerewolfLayout>
        );
    }

    if (error) {
        return (
            <WerewolfLayout>
                <div className="p-6 text-center">
                    <h2 className="text-2xl text-red-400 mb-4">Erreur</h2>
                    <p className="text-red-300">{error}</p>
                </div>
            </WerewolfLayout>
        );
    }

    // ── Rendu principal avec onglets ──
    return (
        <WerewolfLayout>
            {/* Sélecteur d'onglets */}
            <div className="max-w-7xl mx-auto px-6 pt-4">
                <div className="flex border-b border-stone-700/50 gap-1">
                    {[
                        { id: 'sheet', label: 'Ma Fiche' },
                        { id: 'gifts', label: 'Mes Dons' },
                        { id: 'renown', label: 'Hauts Faits' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.id
                                ? 'border-amber-500 text-amber-200'
                                : 'border-transparent text-stone-500 hover:text-stone-300 hover:border-stone-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenu de l'onglet actif */}
            {activeTab === 'sheet' && character && (
                <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-700">
                    {/* Header de la fiche */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-amber-900/30 pb-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-header text-amber-200 tracking-tight">
                                {character.name}
                            </h1>
                            <p className="text-emerald-400 font-serif italic text-lg mt-1">
                                {translate('tribe', character.tribe)}
                            </p>
                        </div>
                        <RenownBadge rank={character.rank} />
                    </div>

                    {/* Grille d'informations — design immersif avec lore */}
                    {(() => {
                        const breedData = findLoreData('breeds', character.breed);
                        const auspiceData = findLoreData('auspices', character.auspice);
                        const tribeData = findLoreData('tribes', character.tribe);
                        return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {/* Carte Race */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-emerald-900/30 hover:border-emerald-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-emerald-600 mb-2">Race</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {breedData?.name_fr || translate('breed', character.breed)}
                                    </h3>
                                    {breedData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-emerald-900/50 pl-2 mb-2 leading-relaxed">
                                            "{breedData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {breedData?.description || ''}
                                    </p>
                                </div>

                                {/* Carte Auspice */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-amber-600 mb-2">Auspice</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {auspiceData?.name_fr || translate('auspice', character.auspice)}
                                    </h3>
                                    {auspiceData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-amber-900/50 pl-2 mb-2 leading-relaxed">
                                            "{auspiceData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {auspiceData?.description || ''}
                                    </p>
                                </div>

                                {/* Carte Tribu */}
                                <div className="bg-stone-900/60 p-5 rounded-lg border border-red-900/30 hover:border-red-700/50 transition-colors">
                                    <span className="block text-xs uppercase tracking-widest text-red-600 mb-2">Tribu</span>
                                    <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                        {tribeData?.name_fr || translate('tribe', character.tribe)}
                                    </h3>
                                    {tribeData?.quote && (
                                        <blockquote className="italic text-xs text-stone-500 border-l-2 border-red-900/50 pl-2 mb-2 leading-relaxed">
                                            "{tribeData.quote}"
                                        </blockquote>
                                    )}
                                    <p className="text-stone-400 text-xs leading-relaxed">
                                        {tribeData?.description || ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Section Histoire / Story */}
                    <div className="bg-stone-900/40 p-6 md:p-8 rounded-lg border border-amber-900/10 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-header text-amber-500/80 uppercase tracking-widest">Histoire</h3>
                            {!isEditingStory ? (
                                <button
                                    onClick={() => setIsEditingStory(true)}
                                    className="text-stone-500 hover:text-amber-400 text-sm transition-colors"
                                >
                                    [ Éditer ]
                                </button>
                            ) : (
                                <div className="space-x-4">
                                    <button
                                        onClick={() => handleUpdateStory(storyDraft).then(() => setIsEditingStory(false))}
                                        disabled={isSaving}
                                        className={`${isSaving ? 'text-stone-500' : 'text-emerald-500 hover:text-emerald-400'} text-sm font-bold`}
                                    >
                                        {isSaving ? 'ENREGISTREMENT...' : 'TERMINER'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingStory(false);
                                            setStoryDraft(character.story || '');
                                        }}
                                        className="text-stone-500 hover:text-red-400 text-sm"
                                    >
                                        Fermer
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEditingStory ? (
                            <div className="prose prose-invert max-w-none">
                                <div className="text-stone-300 leading-relaxed font-serif whitespace-pre-wrap">
                                    {character.story ? (
                                        <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{character.story}</ReactMarkdown>
                                    ) : (
                                        "Les ombres n'ont pas encore raconté ton histoire..."
                                    )}
                                </div>
                            </div>
                        ) : (
                            <StoryEditor
                                initialValue={storyDraft}
                                onSave={async (newStory) => {
                                    setStoryDraft(newStory);
                                    return await handleUpdateStory(newStory);
                                }}
                                onCancel={() => {
                                    setIsEditingStory(false);
                                }}
                            />
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'gifts' && (
                <GiftsTab
                    gifts={giftsData.catalogue}
                    unlockedIds={giftsData.unlockedIds}
                    playerTribe={giftsData.playerTribe}
                    isLoading={!giftsData.loaded}
                />
            )}

            {activeTab === 'renown' && (
                <RenownTab
                    renownData={renownState.data}
                    scores={renownState.scores}
                    onRefresh={handleRenownRefresh}
                    submitRenown={submitRenown}
                    loading={!renownState.loaded}
                />
            )}
        </WerewolfLayout>
    );
};

export default CharacterSheet;
