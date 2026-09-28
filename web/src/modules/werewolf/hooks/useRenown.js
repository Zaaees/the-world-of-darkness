import { siteText } from '../../../core/content/store';
import { apiFetch } from '../../../core/api';
import { useState } from 'react';
import { API_URL } from '../../../config';
import { useUserRoles } from '../../../core/hooks/useUserRoles';

export const useRenown = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { discordUser, guildId } = useUserRoles();

    const submitRenown = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch(`${API_URL}/api/modules/werewolf/renown/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser?.id,
                    'X-Discord-Guild-ID': guildId
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || siteText("werewolf.text.02576"));
            }

            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRenown = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch(`${API_URL}/api/modules/werewolf/renown`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser?.id,
                    'X-Discord-Guild-ID': guildId
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || siteText("werewolf.text.02577"));
            }

            const data = await response.json();
            return data.results;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchRenownRules = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFetch(`${API_URL}/api/modules/werewolf/renown/rules`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser?.id,
                    'X-Discord-Guild-ID': guildId
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || siteText("werewolf.text.02578"));
            }

            return await response.json();
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        submitRenown,
        fetchMyRenown,
        fetchRenownRules,
        loading,
        error,
        authReady: !!discordUser && !!guildId
    };
};
