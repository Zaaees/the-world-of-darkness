import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
import RenownBadge from '../components/RenownBadge';
import WerewolfLoading from '../components/WerewolfLoading';
import StarterPackDisplay from '../components/StarterPackDisplay';

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
        name: '', age: '', sex: '', physical_desc: '', mental_desc_pre: '', first_change: '', story: '', image_url: ''
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
                    const c = charData.character;
                    setSheetData({
                        name: c.name !== "Jeune Garou inconnu" ? c.name : '',
                        age: c.age || '',
                        sex: c.sex || '',
                        physical_desc: c.physical_desc || '',
                        mental_desc_pre: c.mental_desc_pre || '',
                        first_change: c.first_change || '',
                        story: c.story || '',
                        image_url: c.image_url || ''
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
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: { 'X-Discord-User-ID': String(discordUser.id), 'X-Discord-Guild-ID': String(guildId) },
                body: formData
            });
            const data = await response.json();
            if (data.success && data.url) setSheetData(prev => ({ ...prev, image_url: data.url }));
            else setFormError(data.error || "Erreur upload image");
        } catch (err) {
            setFormError("Impossible d'uploader l'image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        if (!discordUser) return;
        setIsSaving(true);
        setFormError(null);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
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
            if (!response.ok) throw new Error(data.error || 'Erreur sauvegarde');

            setCharacter(prev => ({ ...prev, ...data.character }));

            const req = ['name', 'age', 'sex', 'physical_desc', 'mental_desc_pre', 'first_change', 'story'];
            let complete = true;
            for (const f of req) {
                if (!data.character[f] || data.character[f] === "Jeune Garou inconnu") { complete = false; break; }
            }
            if (complete) setIsEditing(false);
            else setFormError("Veuillez remplir tous les champs obligatoires (Image optionnelle).");

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
                                    {character.name || "Jeune Garou inconnu"}
                                </h1>
                                <p className="text-emerald-400 font-serif italic text-lg mt-1">
                                    {translate('tribe', character.tribe)}
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
                                    <img src={character.image_url} alt="Personnage" className="max-h-[500px] w-auto rounded border border-stone-800 shadow-lg object-contain bg-black/20" />
                                </div>
                            )}

                            <div className="bg-stone-900/50 p-4 rounded border border-stone-800 flex flex-wrap gap-8 items-center justify-center mb-10 shadow-lg">
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1">Nom</span>
                                    <span className="text-xl font-serif text-stone-200">{character.name !== "Jeune Garou inconnu" ? character.name : "-"}</span>
                                </div>
                                <div className="h-10 w-px bg-stone-700 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1">Âge</span>
                                    <span className="text-lg text-stone-300">{character.age || "-"}</span>
                                </div>
                                <div className="h-10 w-px bg-stone-700 hidden sm:block"></div>
                                <div className="text-center">
                                    <span className="text-stone-500 text-xs uppercase tracking-wider block mb-1">Sexe</span>
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
                                            <span className="block text-xs uppercase tracking-widest text-emerald-600 mb-2">Race</span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {breedData?.name_fr || translate('breed', character.breed)}
                                            </h3>
                                            {breedData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-emerald-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{breedData.quote}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {breedData?.long_description || breedData?.description || ''}
                                            </p>
                                            {breedData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-emerald-900/20">
                                                    <p className="text-emerald-600/80 font-medium text-xs mb-1 uppercase tracking-wider">Roleplay</p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{breedData.roleplay}</p>
                                                </div>
                                            )}
                                            {breedData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider">Spécificités</p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{breedData.specificities}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Carte Auspice */}
                                        <div className="bg-stone-900/60 p-5 rounded-lg border border-amber-900/30 hover:border-amber-700/50 transition-colors">
                                            <span className="block text-xs uppercase tracking-widest text-amber-600 mb-2">Auspice</span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {auspiceData?.name_fr || translate('auspice', character.auspice)}
                                            </h3>
                                            {auspiceData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-amber-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{auspiceData.quote}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {auspiceData?.long_description || auspiceData?.description || ''}
                                            </p>
                                            {auspiceData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-amber-900/20">
                                                    <p className="text-amber-600/80 font-medium text-xs mb-1 uppercase tracking-wider">Roleplay</p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{auspiceData.roleplay}</p>
                                                </div>
                                            )}
                                            {auspiceData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider">Spécificités</p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{auspiceData.specificities}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Carte Tribu */}
                                        <div className="bg-stone-900/60 p-5 rounded-lg border border-red-900/30 hover:border-red-700/50 transition-colors">
                                            <span className="block text-xs uppercase tracking-widest text-red-600 mb-2">Tribu</span>
                                            <h3 className="text-amber-100 font-serif text-lg font-medium mb-2">
                                                {tribeData?.name_fr || translate('tribe', character.tribe)}
                                            </h3>
                                            {tribeData?.quote && (
                                                <blockquote className="italic text-xs text-stone-500 border-l-2 border-red-900/50 pl-2 mb-3 leading-relaxed">
                                                    "{tribeData.quote}"
                                                </blockquote>
                                            )}
                                            <p className="text-stone-400 text-xs leading-relaxed mb-3">
                                                {tribeData?.long_description || tribeData?.description || ''}
                                            </p>
                                            {tribeData?.roleplay && (
                                                <div className="mt-3 pt-3 border-t border-red-900/20">
                                                    <p className="text-red-600/80 font-medium text-xs mb-1 uppercase tracking-wider">Roleplay</p>
                                                    <p className="text-stone-500 text-xs leading-relaxed italic">{tribeData.roleplay}</p>
                                                </div>
                                            )}
                                            {tribeData?.specificities && (
                                                <div className="mt-3 bg-stone-950/50 p-2.5 rounded border border-stone-800">
                                                    <p className="text-stone-500 font-medium text-xs mb-1 uppercase tracking-wider">Spécificités</p>
                                                    <p className="text-stone-400 text-xs leading-relaxed">{tribeData.specificities}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            <SectionView title="Apparence Physique" content={character.physical_desc} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SectionView title="Mentalité avant le changement" content={character.mental_desc_pre} />
                                <SectionView title="Le Premier Changement" content={character.first_change} highlight />
                            </div>

                            <StarterPackDisplay character={character} />

                            <SectionView title="Histoire" content={character.story} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formError && (
                                <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center gap-3 text-red-200 animate-in fade-in">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {formError}
                                </div>
                            )}

                            {/* Image Upload */}
                            <div className="bg-stone-900/50 border border-stone-800 rounded p-6 text-center">
                                {sheetData.image_url ? (
                                    <div className="space-y-4">
                                        <img src={sheetData.image_url} alt="Aperçu" className="mx-auto max-h-64 rounded shadow border border-stone-700" />
                                        <div className="flex justify-center gap-2">
                                            <label className="cursor-pointer px-4 py-2 bg-stone-800 hover:bg-stone-700 rounded border border-stone-700 text-stone-300 text-sm flex items-center gap-2 transition-colors">
                                                <Upload size={14} /> Changer l'image
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                            </label>
                                            <button onClick={() => setSheetData(prev => ({ ...prev, image_url: '' }))} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded border border-red-900/50 text-red-300 text-sm">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className={`cursor-pointer block border-2 border-dashed border-stone-700 rounded-lg p-8 hover:border-stone-500 hover:bg-stone-900/30 transition-all ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <ImageIcon className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                                        <p className="text-stone-400 font-medium mb-1">
                                            {uploadingImage ? 'Téléchargement...' : 'Ajouter une image (Optionnel)'}
                                        </p>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-stone-400">Nom complet</label>
                                    <input type="text" name="name" value={sheetData.name} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="Nom du Garou" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400">Âge</label>
                                        <input type="number" min="0" name="age" value={sheetData.age} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="Ex: 25" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-400">Sexe</label>
                                        <input type="text" name="sex" value={sheetData.sex} onChange={handleChange} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-stone-200 focus:border-red-700 outline-none" placeholder="H/F/Autre" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Apparence Physique (Homidée, Lupus ou Crinos...)</label>
                                <textarea name="physical_desc" value={sheetData.physical_desc} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Mentalité (Avant le Premier Changement)</label>
                                <textarea name="mental_desc_pre" value={sheetData.mental_desc_pre} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-red-500">Le Premier Changement</label>
                                <textarea name="first_change" value={sheetData.first_change} onChange={handleChange} rows={6} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none placeholder-stone-600" placeholder="Comment avez-vous vécu votre première transformation ? La Rage primordiale s'est-elle emparée de vous ?" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-400">Histoire complète (Supporte le Markdown)</label>
                                <textarea name="story" value={sheetData.story} onChange={handleChange} rows={12} className="w-full bg-stone-900 border border-stone-700 rounded p-3 text-sm text-stone-200 focus:border-red-700 outline-none" />
                            </div>

                            <div className="flex justify-end pt-4 border-t border-stone-800">
                                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-colors disabled:opacity-50">
                                    <Save className="w-4 h-4" /> {isSaving ? 'Sauvegarde...' : 'Sauvegarder et Publier la Fiche'}
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
    return (
        <div className={`p-4 rounded border ${highlight ? 'bg-red-950/10 border-red-900/30' : 'bg-stone-900/30 border-stone-800/50'} h-full`}>
            <h3 className={`font-serif text-sm uppercase tracking-widest mb-3 border-b pb-2 ${highlight ? 'text-red-400 border-red-900/40' : 'text-stone-500 border-stone-800'}`}>
                {title}
            </h3>
            <div className="text-sm text-stone-300 whitespace-pre-line leading-relaxed text-justify">
                {content ? (
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
                ) : (
                    <span className="text-stone-600 italic">Non renseigné</span>
                )}
            </div>
        </div>
    );
}
