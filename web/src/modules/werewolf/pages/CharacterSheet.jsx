import React, { useState, useEffect } from 'react';
import WerewolfLayout from '../components/WerewolfLayout';
import RenownBadge from '../components/RenownBadge';
import WerewolfLoading from '../components/WerewolfLoading';
import StoryEditor from '../components/StoryEditor';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';

/**
 * Page CharacterSheet
 * Permet de consulter la fiche de personnage Loup-Garou.
 * Inclut le nom, race, auspice, tribu, rang et histoire.
 */
const CharacterSheet = () => {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingStory, setIsEditingStory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [storyDraft, setStoryDraft] = useState('');
    const { discordUser } = useUserRoles();

    useEffect(() => {
        fetchCharacter();
    }, []);

    const fetchCharacter = async () => {
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                headers: {
                    'X-Discord-User-ID': discordUser?.id || 'unknown'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.code === 'NO_CHARACTER') {
                    setError('NOT_FOUND');
                } else {
                    throw new Error(data.error || 'Erreur lors de la récupération du personnage');
                }
            } else {
                const data = await response.json();
                setCharacter(data.character);
                setStoryDraft(data.character.story || '');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStory = async (newStory) => {
        if (!discordUser) return;

        setIsSaving(true);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser.id
                },
                body: JSON.stringify({ story: newStory })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde de l\'histoire');
            }

            const data = await response.json();
            setCharacter(prev => ({ ...prev, story: data.character.story }));
            setStoryDraft(data.character.story);
            return data.character.story;
        } catch (err) {
            console.error('Update story error:', err);
            if (!isEditingStory) console.error("Save error:", err.message);
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <WerewolfLoading />;

    if (error === 'NOT_FOUND') {
        return (
            <WerewolfLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                    <h2 className="text-2xl text-amber-200 mb-4">Aucune fiche trouvée</h2>
                    <p className="text-stone-400 mb-8">Vous n'avez pas encore créé de personnage Loup-Garou.</p>
                    <a href="/werewolf/create" className="px-6 py-2 bg-emerald-900 border border-emerald-600 text-emerald-100 rounded hover:bg-emerald-800 transition-colors">
                        Créer un personnage
                    </a>
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

    return (
        <WerewolfLayout>
            <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-700">
                {/* Header de la fiche */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-amber-900/30 pb-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-header text-amber-200 tracking-tight">
                            {character.name}
                        </h1>
                        <p className="text-emerald-400 font-serif italic text-lg mt-1">
                            {character.tribe}
                        </p>
                    </div>
                    <RenownBadge rank={character.rank} />
                </div>

                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-stone-900/60 p-4 rounded border border-emerald-900/20">
                        <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Race</span>
                        <span className="text-amber-100 font-medium">{character.breed}</span>
                    </div>
                    <div className="bg-stone-900/60 p-4 rounded border border-emerald-900/20">
                        <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Auspice</span>
                        <span className="text-amber-100 font-medium">{character.auspice}</span>
                    </div>
                    <div className="bg-stone-900/60 p-4 rounded border border-emerald-900/20">
                        <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Forum</span>
                        <span className="text-xs text-stone-400 truncate block">ID: {character.discord_thread_id || 'Non généré'}</span>
                    </div>
                </div>

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
                                await handleUpdateStory(newStory);
                            }}
                            onCancel={() => {
                                setIsEditingStory(false);
                            }}
                        />
                    )}
                </div>

                {/* Footer Section */}
                <div className="mt-12 pt-8 border-t border-amber-900/10 text-center">
                    <a href="/werewolf/dashboard" className="text-stone-500 hover:text-amber-200 transition-colors tracking-widest uppercase text-xs">
                        ← Retour au Dashboard
                    </a>
                </div>
            </div>
        </WerewolfLayout>
    );
};

export default CharacterSheet;
