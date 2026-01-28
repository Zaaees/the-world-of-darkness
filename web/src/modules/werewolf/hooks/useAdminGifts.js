import { useState, useCallback } from 'react';
import { useUserRoles } from '../../../core/hooks/useUserRoles';
import { API_URL } from '../../../config';

export function useAdminGifts() {
    const { discordUser, guildId } = useUserRoles();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHeaders = () => ({
        'Content-Type': 'application/json',
        'X-Discord-User-ID': discordUser?.id || '',
        'X-Discord-Guild-ID': guildId || ''
    });

    const fetchPlayers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/admin/players`, {
                headers: getHeaders()
            });
            if (!response.ok) throw new Error("Failed to fetch players");
            const data = await response.json();
            return data.players;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [discordUser, guildId]);

    const fetchPlayerGifts = useCallback(async (targetUserId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/admin/players/${targetUserId}/gifts`, {
                headers: getHeaders()
            });
            if (!response.ok) throw new Error("Failed to fetch player gifts");
            const data = await response.json();
            return data; // { gifts, character }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [discordUser, guildId]);

    const toggleGift = useCallback(async (playerId, giftId, unlock = true) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/modules/werewolf/gifts/unlock`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ playerId, giftId, unlock })
            });
            if (!response.ok) throw new Error("Failed to update gift");
            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [discordUser, guildId]);

    return {
        fetchPlayers,
        fetchPlayerGifts,
        toggleGift,
        loading,
        error
    };
}
