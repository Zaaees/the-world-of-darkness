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
            const response = await fetch(`${API_URL}/api/modules/werewolf/renown/submit`, {
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
                throw new Error(errorData.error || 'Erreur lors de la soumission du haut fait');
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
        loading,
        error
    };
};
