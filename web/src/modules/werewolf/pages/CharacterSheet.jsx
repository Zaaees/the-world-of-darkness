// site-content: migrated
import { siteText, displayText, useSiteContent } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import { apiFetch } from '../../../core/api';
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
import RenownBadge from '../components/RenownBadge';
import WerewolfLoading from '../components/WerewolfLoading';
import StarterPackDisplay from '../components/StarterPackDisplay';
import starterPackData from '../../../assets/starter_pack_data.json';

import GiftsTab from './GiftsPage/GiftsTab';
import RenownTab from './RenownTab';
import ReactMarkdown from 'react-markdown';
import { Save, Edit2, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
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
    useSiteContent();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(
        initialTab || getTabFromPath(location.pathname)
    );

    // ── État du personnage (onglet Sheet) ──
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState(null);
    const [sheetData, setSheetData] = useState({
        name: '', age: '', sex: '', physical_desc: '', mental_desc_pre: '', first_change: '', story: '', image_url: '', starter_pack_answers: null
    });
    const [uploadingImage, setUploadingImage] = useState(false);

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
            setError(siteText("werewolf.text.01726"));
            setLoading(false);
            return;
        }

        const headers = {
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': gId
        };

        const fetchCharacter = apiFetch(`${API_URL}/api/modules/werewolf/character`, { headers })
            .then(res => {
                if (!res.ok) return res.json().then(d => { throw { ...d, httpStatus: res.status }; });
                return res.json();
            });

        const fetchGifts = apiFetch(`${API_URL}/api/modules/werewolf/gifts`, { headers })
            .then(res => {
                if (!res.ok) throw new Error(siteText("werewolf.text.02586", { v0: (res.status) }));
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
                    const c = charData.character;
                    setSheetData({
                        name: c.name !== "Jeune Garou inconnu" ? c.name : '',
                        age: c.age || '',
                        sex: c.sex || '',
                        physical_desc: c.physical_desc || '',
                        mental_desc_pre: c.mental_desc_pre || '',
                        first_change: c.first_change || '',
                        story: c.story || '',
                        image_url: c.image_url || '',
                        starter_pack_answers: c.starter_pack_answers || null
                    });
                    const req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story'];
                    let complete = true;
                    for (const f of req) {
                        if (!c[f] || c[f] === "Jeune Garou inconnu") { complete = false; break; }
                    }
                    setIsEditing(!complete);
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
                    setError(err.message || siteText("werewolf.text.02587"));
                }
            })
            .finally(() => {
                setLoading(false);
            });

        // Poll pour les mises à jour du personnage (rang)
        const interval = setInterval(() => {
            apiFetch(`${API_URL}/api/modules/werewolf/character`, { headers })
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSheetData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingImage(true);
        setFormError(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await apiFetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'X-Discord-User-ID': String(discordUser.id), 'X-Discord-Guild-ID': String(guildId) },
                body: formData
            });
            const data = await response.json();
            if (data.success && data.url) setSheetData(prev => ({ ...prev, image_url: data.url }));
            else setFormError(data.error || siteText("werewolf.text.02588"));
        } catch (err) {
            setFormError(siteText("werewolf.text.01728"));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        if (!discordUser) return;
        setIsSaving(true);
        setFormError(null);
        try {
            const response = await apiFetch(`${API_URL}/api/modules/werewolf/character`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'X-Discord-User-ID': String(discordUser.id), 'X-Discord-Guild-ID': String(guildId) },
                body: JSON.stringify({
                    name: sheetData.name || "Jeune Garou inconnu",
                    age: sheetData.age, sex: sheetData.sex, physical_desc: sheetData.physical_desc,
                    mental_desc_pre: sheetData.mental_desc_pre, first_change: sheetData.first_change,
                    story: sheetData.story, image_url: sheetData.image_url
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || siteText("werewolf.text.02589"));

            setCharacter(prev => ({ ...prev, ...data.character }));

            const req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story'];
            let complete = true;
            for (const f of req) {
                if (!data.character[f] || data.character[f] === "Jeune Garou inconnu") { complete = false; break; }
            }
            if (complete) setIsEditing(false);
            else setFormError(siteText("werewolf.text.01729"));

        } catch (err) {
            setFormError(err.message);
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
                    <h2 className="text-2xl text-amber-200 mb-4"><SiteText contentKey="werewolf.text.01733" /></h2>
                    <p className="text-stone-400 mb-8"><SiteText contentKey="werewolf.text.01734" /></p>
                    <Link to="/werewolf/create" className="px-6 py-2 bg-emerald-900 border border-emerald-600 text-emerald-100 rounded hover:bg-emerald-800 transition-colors"><SiteText contentKey="werewolf.text.01735" /></Link>
                </div>
            </WerewolfLayout>
        );
    }

    if (error) {
        return (
            <WerewolfLayout>
                <div className="p-6 text-center">
                    <h2 className="text-2xl text-red-400 mb-4"><SiteText contentKey="werewolf.text.01736" /></h2>
                    <p className="text-red-300">{displayText("werewolf", error)}</p>
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
                            {displayText("werewolf", tab.label)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenu de l'onglet actif */}
            {activeTab === 'sheet' && character && (
                <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-700">
                    {/* Header de la fiche */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-amber-900/30 pb-6">
                        <div className="flex items-center gap-4">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 transition-colors text-xs text-stone-300"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            )}
                            <div>
                                <h1 className="text-4xl md:text-5xl font-header text-amber-200 tracking-tight">
                                    {character.name || siteText("werewolf.text.01737")}
                                </h1>
                                <p className="text-emerald-400 font-serif italic text-lg mt-1">
                                    {displayText("werewolf", translate('tribe', character.tribe))}
                                </p>
                            </div>
                        </div>
                        <RenownBadge rank={character.rank} />
                    </div>

                    {/* Mode Edition ou Lecture */}
                    {!isEditing ? (
                        <div className="space-y-6">
                            {/* Identity Header */}
                            {character.image_url && (
                                <div className="mb-6 flex justify-center animate-in fade-in zoom-in-95 duration-500">
                                    <img src={character.image_url} alt={siteText("werewolf.text.01738")} className="max-h-[500px] w-auto rounded border border-stone-800 shadow-lg object-contain bg-black/20" />
                                </div>
                            )}

                            <div className="bg-stone-900/50 p-4 rounded border border-stone-800 flex flex-wrap gap-8 items-center justify-center mb-10 shadow-lg">
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1"><SiteText contentKey="werewolf.text.01739" /></span>
                                    <span className="text-xl font-serif text-stone-200">{character.name !== "Jeune Garou inconnu" ? character.name : "-"}</span>
                                </div>
                                <div className="h-10 w-px bg-stone-700 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1"><SiteText contentKey="werewolf.text.01740" /></span>
                                    <span className="text-lg text-stone-300">{character.age || "-"}</span>
                                </div>
                                <div className="h-10 w-px bg-stone-700 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1"><SiteText contentKey="werewolf.text.01741" /></span>
                                    <span className="text-lg text-stone-300">{character.sex || "-"}</span>
                                </div>
                            </div>

                            {/* Info Grids */}
                            {(() => {
                                const breedData = findLoreData('breeds', character.breed);
                                const auspiceData = findLoreData('auspices', character.auspice);
                                const tribeData = findLoreData('tribes', character.tribe);
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                        {/* Carte Race */}
                                        <div className="bg-stone-900/60 p-5 rounded-lg border border-emerald-900/30 hover:border-emerald-700/50 transition-colors">
                                            <span className="block text-xs uppercase tracking-widest text-emerald-600 mb-2"><SiteText contentKey="werewolf.text.01742" /></span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {displayText("werewolf", breedData?.name_fr || translate('breed', character.breed))}
                                            </h3>
                                            {breedData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-emerald-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{displayText("werewolf", breedData.quote)}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {displayText("werewolf", breedData?.long_description || breedData?.description || '')}
                                            </p>
                                            {breedData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-emerald-900/20">
                                                    <p className="text-emerald-600/80 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01743" /></p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{displayText("werewolf", breedData.roleplay)}</p>
                                                </div>
                                            )}
                                            {breedData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01744" /></p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{displayText("werewolf", breedData.specificities)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Carte Auspice */}
                                        <div className="bg-stone-900/60 p-5 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition-colors">
                                            <span className="block text-xs uppercase tracking-widest text-amber-600 mb-2"><SiteText contentKey="werewolf.text.01745" /></span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {displayText("werewolf", auspiceData?.name_fr || translate('auspice', character.auspice))}
                                            </h3>
                                            {auspiceData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-amber-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{displayText("werewolf", auspiceData.quote)}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {displayText("werewolf", auspiceData?.long_description || auspiceData?.description || '')}
                                            </p>
                                            {auspiceData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-amber-900/20">
                                                    <p className="text-amber-600/80 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01743" /></p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{displayText("werewolf", auspiceData.roleplay)}</p>
                                                </div>
                                            )}
                                            {auspiceData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01744" /></p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{displayText("werewolf", auspiceData.specificities)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Carte Tribu */}
                                        <div className="bg-stone-900/60 p-5 rounded-lg border border-red-900/30 hover:border-red-700/50 transition-colors">
                                            <span className="block text-xs uppercase tracking-widest text-red-600 mb-2"><SiteText contentKey="werewolf.text.01746" /></span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {displayText("werewolf", tribeData?.name_fr || translate('tribe', character.tribe))}
                                            </h3>
                                            {tribeData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-red-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{displayText("werewolf", tribeData.quote)}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {displayText("werewolf", tribeData?.long_description || tribeData?.description || '')}
                                            </p>
                                            {tribeData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-red-900/20">
                                                    <p className="text-red-600/80 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01743" /></p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{displayText("werewolf", tribeData.roleplay)}</p>
                                                </div>
                                            )}
                                            {tribeData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider"><SiteText contentKey="werewolf.text.01744" /></p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{displayText("werewolf", tribeData.specificities)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            <SectionView title={siteText("werewolf.text.01747")} content={character.physical_desc} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SectionView title={siteText("werewolf.text.01748")} content={character.mental_desc_pre} />
                                <SectionView title={siteText("werewolf.text.01749")} content={character.first_change} highlight />
                            </div>

                            <SectionView title={siteText("werewolf.text.01750")} content={character.story} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formError && (
                                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center gap-3 text-red-200 animate-in fade-in">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {displayText("werewolf", formError)}
                                </div>
                            )}

                            {/* Image Upload */}
                            <div className="bg-stone-900/50 border border-stone-800 rounded p-6 text-center">
                                {sheetData.image_url ? (
                                    <div className="space-y-4">
                                        <img src={sheetData.image_url} alt={siteText("werewolf.text.01751")} className="mx-auto max-h-64 rounded shadow border border-stone-700" />
                                        <div className="flex justify-center gap-2">
                                            <label className="cursor-pointer px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-300 text-sm flex items-center gap-2 transition-colors">
                                                <Upload size={14} /><SiteText contentKey="werewolf.text.01752" /><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                            </label>
                                            <button onClick={() => setSheetData(prev => ({ ...prev, image_url: '' }))} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded border border-red-900/50 text-red-300 text-sm"><SiteText contentKey="werewolf.text.01753" /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer block border-2 border-dashed border-stone-700 rounded-lg p-8 hover:border-stone-500 hover:bg-stone-900/30 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                                        <p className="text-stone-400 font-medium mb-1">
                                            {uploadingImage ? siteText("werewolf.text.01754") : siteText("werewolf.text.01755")}
                                        </p>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01756" /></label>
                                    <input type="text" name="name" value={sheetData.name} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder={siteText("werewolf.text.01757")} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01740" /></label>
                                        <input type="number" min="0" name="age" value={sheetData.age} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder={siteText("werewolf.text.01758")} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01741" /></label>
                                        <input type="text" name="sex" value={sheetData.sex} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder={siteText("werewolf.text.01759")} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01760" /></label>
                                <textarea name="physical_desc" value={sheetData.physical_desc} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01761" /></label>
                                <textarea name="mental_desc_pre" value={sheetData.mental_desc_pre} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-red-500"><SiteText contentKey="werewolf.text.01749" /></label>
                                <textarea name="first_change" value={sheetData.first_change} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none placeholder-stone-600" placeholder={siteText("werewolf.text.01762")} />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-stone-400"><SiteText contentKey="werewolf.text.01763" /></label>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2">
                                        <textarea name="story" value={sheetData.story} onChange={handleChange} rows={15} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none h-full" placeholder={siteText("werewolf.text.01764")} />
                                    </div>

                                    <div className="bg-stone-900/40 border border-stone-800 rounded p-4 h-full overflow-y-auto max-h-[400px]">
                                        <h4 className="text-sm font-serif text-red-500 mb-3 border-b border-stone-800 pb-2"><SiteText contentKey="werewolf.text.01765" /></h4>

                                        {(() => {
                                            let ans = sheetData.starter_pack_answers || character?.starter_pack_answers;
                                            if (typeof ans === 'string') {
                                                try { ans = JSON.parse(ans); } catch (e) { ans = null; }
                                            }

                                            if (!ans || (!ans.breed && !ans.auspice && !ans.tribu)) {
                                                return <p className="text-xs text-stone-500 italic"><SiteText contentKey="werewolf.text.01766" /></p>;
                                            }

                                            const normalizeKey = (key) => (key ? key.toLowerCase().replace(/\s+/g, '_') : '');
                                            const breedKey = normalizeKey(character?.breed);
                                            const auspiceKey = normalizeKey(character?.auspice);
                                            const tribeKey = normalizeKey(character?.tribe);

                                            const breedQ = (starterPackData.werewolf.breeds[breedKey] || [])[0] || "Race";
                                            const auspiceQ = (starterPackData.werewolf.auspices[auspiceKey] || [])[0] || "Auspice";
                                            const tribeQ = (starterPackData.werewolf.tribes[tribeKey] || [])[0] || "Tribu";

                                            return (
                                                <div className="space-y-4">
                                                    {ans.breed && (
                                                        <div className="border-l-2 border-emerald-900/50 pl-3">
                                                            <p className="text-[11px] italic text-emerald-600/80 mb-1 leading-snug">{displayText("werewolf", breedQ)}</p>
                                                            <p className="text-[13px] text-stone-300 leading-relaxed whitespace-pre-wrap">{displayText("werewolf", ans.breed)}</p>
                                                        </div>
                                                    )}
                                                    {ans.auspice && (
                                                        <div className="border-l-2 border-amber-900/50 pl-3">
                                                            <p className="text-[11px] italic text-amber-600/80 mb-1 leading-snug">{displayText("werewolf", auspiceQ)}</p>
                                                            <p className="text-[13px] text-stone-300 leading-relaxed whitespace-pre-wrap">{displayText("werewolf", ans.auspice)}</p>
                                                        </div>
                                                    )}
                                                    {ans.tribu && (
                                                        <div className="border-l-2 border-red-900/50 pl-3">
                                                            <p className="text-[11px] italic text-red-600/80 mb-1 leading-snug">{displayText("werewolf", tribeQ)}</p>
                                                            <p className="text-[13px] text-stone-300 leading-relaxed whitespace-pre-wrap">{ans.tribu}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-stone-800">
                                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors disabled:opacity-50">
                                    <Save className="w-4 h-4" /> {isSaving ? siteText("werewolf.text.01767") : siteText("werewolf.text.01768")}
                                </button>
                            </div>
                        </div>
                    )}
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

function SectionView({ title, content, highlight = false }) {
    useSiteContent();
    return (
        <div className={`p-4 rounded border ${highlight ? 'bg-red-950/10 border-red-900/30' : 'bg-stone-900/30 border-stone-800/50'} h-full`}>
            <h3 className={`font-serif text-sm uppercase tracking-widest mb-3 border-b pb-2 ${highlight ? 'text-red-400 border-red-900/40' : 'text-stone-500 border-stone-800'}`}>
                {displayText("werewolf", title)}
            </h3>
            <div className="text-sm text-stone-300 whitespace-pre-line leading-relaxed text-justify">
                {content ? (
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
                ) : (
                    <span className="text-stone-600 italic"><SiteText contentKey="werewolf.text.01769" /></span>
                )}
            </div>
        </div>
    );
}
