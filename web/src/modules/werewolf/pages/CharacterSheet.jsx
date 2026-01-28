import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WerewolfLayout from '../components/WerewolfLayout';
import RenownBadge from '../components/RenownBadge';
import WerewolfLoading from '../components/WerewolfLoading';
import StoryEditor from '../components/StoryEditor';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';
import RenownSubmissionModal from '../components/RenownSubmissionModal';
import { useRenown } from '../hooks/useRenown';
// import { toast } from 'sonner';
const toast = {
    success: (msg) => console.log('Toast Success:', msg),
    error: (msg) => console.error('Toast Error:', msg)
};

/**
 * Page CharacterSheet
 * Permet de consulter la fiche de personnage Loup-Garou.
 * Inclut le nom, race, auspice, tribu, rang et histoire.
 */
const CharacterSheet = () => {
    // Force rebuild timestamp: 2026-01-28 17:55
    const navigate = useNavigate();

    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingStory, setIsEditingStory] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [storyDraft, setStoryDraft] = useState('');
    const [isRenownModalOpen, setIsRenownModalOpen] = useState(false);
    const { discordUser, guildId, isLoading: isAuthLoading } = useUserRoles();
    const { submitRenown } = useRenown();

    useEffect(() => {
        if (isAuthLoading || !discordUser || !guildId) return;

        fetchCharacter();

        // Poll for updates (Review fix 4.4 - AC 7 Real-time approximation)
        const interval = setInterval(() => {
            // Background refresh - silent if error
            const userId = String(discordUser?.id);
            const gId = String(guildId);

            if (!userId || !gId) return;

            fetch(`${API_URL}/api/modules/werewolf/character`, {
                headers: {
                    'X-Discord-User-ID': userId,
                    'X-Discord-Guild-ID': gId
                }
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && data.character) {
                        // Only update if rank changed to avoid jitters
                        setCharacter(prev => {
                            if (prev && prev.rank !== data.character.rank) {
                                toast.success(`Votre rang a changé ! (Rang ${data.character.rank})`);
                                return { ...prev, ...data.character };
                            }
                            return prev; // No change
                        });
                    }
                })
                .catch(() => { }); // Ignore poll errors
        }, 10000); // 10s interval

        return () => clearInterval(interval);
    }, [discordUser?.id, guildId, isAuthLoading]);

    const fetchCharacter = async () => {
        setError(null);
        const userId = String(discordUser?.id);
        const gId = String(guildId);

        console.log('[CharacterSheet] Fetching character...', { userId, gId });

        if (!userId || !gId || userId === 'undefined' || gId === 'undefined') {
            console.error('[CharacterSheet] Missing auth info:', { userId, gId });
            setError('Auth information missing');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/character`, {
                headers: {
                    'X-Discord-User-ID': userId,
                    'X-Discord-Guild-ID': gId
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

    const handleRenownSubmit = async (data) => {
        try {
            await submitRenown(data);
            toast.success("Haut Fait envoyé aux Esprits (MJ)");
            setIsRenownModalOpen(false);
        } catch (err) {
            console.error("Renown submission error:", err);
            toast.error(err.message || "Erreur lors de la soumission");
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

    if (loading) return <WerewolfLoading />;


    useEffect(() => {
        if (error === 'NOT_FOUND') {
            navigate('/werewolf/create');
        }
    }, [error, navigate]);

    if (error === 'NOT_FOUND') return <WerewolfLoading />; // Show loading while redirecting

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

    // ... rest of component until footer ...

    // ... inside return ...
                </div >
    {/* Footer removed */ }
            </div >
        </WerewolfLayout >
    );
};

export default CharacterSheet;
