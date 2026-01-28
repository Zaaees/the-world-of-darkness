import { useState, useEffect, useCallback } from 'react';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';

/**
 * Hook pour vérifier si l'utilisateur a un profil Werewolf.
 * Expose une fonction refetch() pour forcer le rechargement des données.
 */
export function useWerewolfProfile() {
    const { discordUser, guildId } = useUserRoles();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasProfile, setHasProfile] = useState(false);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const fetchProfile = useCallback(async () => {
        if (!discordUser || !guildId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/modules/werewolf/profile`, {
                headers: {
                    'X-Discord-User-ID': discordUser?.id || 'unknown',
                    'X-Discord-Guild-ID': guildId || ''
                },
                // Désactiver le cache pour toujours avoir les données fraîches
                cache: 'no-store'
            });

            if (response.status === 404) {
                setHasProfile(false);
                setProfile(null);
            } else if (!response.ok) {
                throw new Error('Failed to fetch profile');
            } else {
                const data = await response.json();
                if (data.success && data.display_name) {
                    setProfile(data);
                    setHasProfile(true);
                } else {
                    // Profile endpoint returns success but might check for role only?
                    // Based on routes.py: returns tribe/display_name if character exists.
                    // If character is None, display_name is None.
                    if (data.display_name) {
                        setProfile(data);
                        setHasProfile(true);
                    } else {
                        setHasProfile(false);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching werewolf profile:", err);
            setError(err);
            setHasProfile(false);
        } finally {
            setLoading(false);
        }
    }, [discordUser?.id, guildId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile, refreshCounter]);

    /**
     * Force le rechargement des données du profil.
     * Appeler cette fonction après une action qui modifie le profil (création, suppression).
     */
    const refetch = useCallback(() => {
        setRefreshCounter(prev => prev + 1);
    }, []);

    return { profile, loading, error, hasProfile, refetch };
}

