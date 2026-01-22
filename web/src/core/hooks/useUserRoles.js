import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../config';

// Constantes des rôles Discord
export const WEREWOLF_ROLE_ID = '1453870972376584192';

/**
 * Hook pour gérer l'état d'authentification et les rôles utilisateur Discord.
 * Permet de vérifier de manière centralisée les rôles pour le routing conditionnel.
 * 
 * @returns {Object} État d'authentification et fonctions utilitaires
 */
export function useUserRoles() {
    const [discordUser, setDiscordUser] = useState(null);
    const [guildId, setGuildId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Rôles vérifiés via API (boolean flags)
    const [hasWerewolfRole, setHasWerewolfRole] = useState(false);
    const [hasVampireRole, setHasVampireRole] = useState(false);

    /**
     * Vérifie si l'utilisateur possède un rôle spécifique
     * @param {string} roleId - ID du rôle Discord à vérifier
     * @returns {boolean}
     */
    const hasRole = useCallback((roleId) => {
        if (roleId === WEREWOLF_ROLE_ID) return hasWerewolfRole;
        // Ajouter d'autres rôles ici si nécessaire
        return false;
    }, [hasWerewolfRole]);

    // Charger l'utilisateur Discord et ses rôles
    useEffect(() => {
        const controller = new AbortController();

        const loadUserAndRoles = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // 1. Vérifier le token Discord
                const token = localStorage.getItem('discord_token');
                if (!token) {
                    setIsLoading(false);
                    setIsAuthenticated(false);
                    return;
                }

                // 2. Récupérer les infos utilisateur Discord
                const userResponse = await fetch('https://discord.com/api/users/@me', {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: controller.signal
                });

                if (!userResponse.ok) {
                    if (userResponse.status === 401) {
                        localStorage.removeItem('discord_token');
                    }
                    setError('Session Discord expirée');
                    setIsLoading(false);
                    setIsAuthenticated(false);
                    return;
                }

                const user = await userResponse.json();
                setDiscordUser(user);
                setIsAuthenticated(true);

                // 3. Détecter le serveur Discord
                const guildResponse = await fetch(`${API_URL}/api/guild`, {
                    headers: { 'X-Discord-User-ID': user.id },
                    signal: controller.signal
                });

                const guildData = await guildResponse.json();
                if (!guildData.success) {
                    // Utilisateur pas sur le serveur, pas de rôles
                    setIsLoading(false);
                    return;
                }

                const detectedGuildId = guildData.guild_id;
                setGuildId(detectedGuildId);

                // 4. Vérifier les profils pour les rôles (appels parallèles)
                const headers = {
                    'X-Discord-User-ID': user.id,
                    'X-Discord-Guild-ID': detectedGuildId.toString()
                };

                const [vampireResponse, werewolfResponse] = await Promise.allSettled([
                    fetch(`${API_URL}/api/vampire/profile`, { headers, signal: controller.signal }),
                    fetch(`${API_URL}/api/modules/werewolf/profile`, { headers, signal: controller.signal })
                ]);

                // Traiter la réponse vampire
                if (vampireResponse.status === 'fulfilled' && vampireResponse.value.ok) {
                    const vampireData = await vampireResponse.value.json();
                    if (vampireData.success && vampireData.has_vampire_role) {
                        setHasVampireRole(true);
                    }
                }

                // Traiter la réponse werewolf
                if (werewolfResponse.status === 'fulfilled' && werewolfResponse.value.ok) {
                    const werewolfData = await werewolfResponse.value.json();
                    if (werewolfData.success && werewolfData.has_werewolf_role) {
                        setHasWerewolfRole(true);
                    }
                }

            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error('Erreur chargement rôles:', err);
                setError('Erreur de connexion');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserAndRoles();

        return () => controller.abort();
    }, []);

    return {
        // État utilisateur
        discordUser,
        guildId,

        // État de chargement
        isLoading,
        isAuthenticated,
        error,

        // Fonctions utilitaires
        hasRole,

        // Raccourcis communs
        hasWerewolfRole,
        hasVampireRole,
    };
}

export default useUserRoles;
