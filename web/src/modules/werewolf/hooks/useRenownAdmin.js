import { useState, useCallback } from 'react';
import { API_URL } from '../../../config';

/**
 * Hook to manage Renown Admin API interactions.
 * Handles authentication headers and API calls.
 */
export function useRenownAdmin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHeaders = useCallback(() => {
        const token = localStorage.getItem('discord_token');
        const userId = localStorage.getItem('discord_user_id');
        const guildId = localStorage.getItem('discord_guild_id');

        return {
            'Authorization': `Bearer ${token}`,
            'X-Discord-User-ID': userId,
            'X-Discord-Guild-ID': guildId,
            'Content-Type': 'application/json'
        };
    }, []);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/admin/renown`, {
                headers: getHeaders()
            });

            if (response.status === 403) {
                throw new Error("Accès réservé aux Conteurs (MJ).");
            }

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des demandes.");
            }

            const data = await response.json();
            return data.requests || [];
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getHeaders]);

    const validateRequest = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/modules/werewolf/admin/renown/${id}/validate`, {
            method: 'POST',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error("Erreur validation");
        }
        const data = await response.json();
        return data; // { success, status, new_rank }
    }, [getHeaders]);

    const rejectRequest = useCallback(async (id) => {
        const response = await fetch(`${API_URL}/api/modules/werewolf/admin/renown/${id}/reject`, {
            method: 'POST',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error("Erreur rejet");
        }
        return true;
    }, [getHeaders]);

    return {
        fetchRequests,
        validateRequest,
        rejectRequest,
        loading,
        error
    };
}
