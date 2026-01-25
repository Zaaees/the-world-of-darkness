import React, { useState, useEffect } from 'react';
import RenownRequestList from '../components/RenownRequestList';
import { useRenownAdmin } from '../hooks/useRenownAdmin';
import Toast from '../../../components/Toast';

export default function RenownAdminPage() {
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState(null); // { message, subtext, type }
    const { fetchRequests, validateRequest, rejectRequest, loading, error } = useRenownAdmin();
    // Local loading state for initial load vs api action loading might be separate, 
    // but the hook exposes a general loading. 
    // For this simple page, using the hook's loading is fine, 
    // but we might want to manually control initial load to avoid flashing if hook loading is for mutations too.
    // Let's rely on hook.

    // We need an effect to load data
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchRequests();
                setRequests(data);
            } catch (e) {
                // Error handled in hook state usually, or we can catch here.
                // The hook sets 'error' state, so the component re-renders with it.
            }
        };
        load();
    }, [fetchRequests]);

    const handleValidate = async (id) => {
        try {
            const result = await validateRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            setToast({
                type: 'success',
                message: 'Demande validée',
                subtext: `Nouveau rang : ${result.new_rank}`
            });
        } catch (e) {
            setToast({
                type: 'error',
                message: 'Erreur',
                subtext: e.message
            });
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Voulez-vous vraiment rejeter cette demande ?")) return;

        try {
            await rejectRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            alert(e.message);
        }
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-red-900/20 border border-red-900/50 rounded-lg m-4">
                <h2 className="text-2xl font-serif text-red-500 mb-2">Accès Refusé</h2>
                <p className="text-stone-400">{error}</p>
            </div>
        );
    }

    if (loading) {
        return <div className="p-8 text-center text-amber-500 animate-pulse">Consultation des esprits...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-serif text-amber-500 mb-2 border-b border-amber-900/50 pb-2">
                    Approbation des Hauts Faits
                </h1>
                <p className="text-stone-400">
                    Gérez les demandes de renommée soumises par les joueurs.
                </p>
            </header>

            <RenownRequestList
                requests={requests}
                onValidate={handleValidate}
                onReject={handleReject}
            />

            {toast && (
                <Toast
                    message={toast.message}
                    subtext={toast.subtext}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
