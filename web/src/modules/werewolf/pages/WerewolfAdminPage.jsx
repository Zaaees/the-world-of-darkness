import React, { useState } from 'react';
import RenownRequestList from '../components/RenownRequestList';
import GiftAssignmentModal from '../components/GiftAssignmentModal';
import { useRenownAdmin } from '../hooks/useRenownAdmin';
import Toast from '../../../components/Toast';
import WerewolfLayout from '../components/WerewolfLayout';

export default function WerewolfAdminPage() {
    const [activeTab, setActiveTab] = useState('renown'); // 'renown' or 'gifts'
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

    // Renown State
    const [requests, setRequests] = useState([]);
    const [toast, setToast] = useState(null);
    const { fetchRequests, validateRequest, rejectRequest, loading: renownLoading, error: renownError } = useRenownAdmin();

    // Effect for Renown Tab
    React.useEffect(() => {
        if (activeTab === 'renown') {
            const load = async () => {
                try {
                    const data = await fetchRequests();
                    setRequests(data);
                } catch (e) {
                    // Error handled by hook
                }
            };
            load();
        }
    }, [activeTab, fetchRequests]);

    const handleValidate = async (id) => {
        try {
            const result = await validateRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            setToast({ type: 'success', message: 'Demande validée', subtext: `Nouveau rang : ${result.new_rank}` });
        } catch (e) {
            setToast({ type: 'error', message: 'Erreur', subtext: e.message });
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Voulez-vous vraiment rejeter cette demande ?")) return;
        try {
            await rejectRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (e) {
            setToast({ type: 'error', message: 'Erreur', subtext: e.message });
        }
    };

    if (renownError) {
        return (
            <WerewolfLayout>
                <div className="p-8 text-center text-red-500">Accès Refusé: {renownError}</div>
            </WerewolfLayout>
        );
    }

    return (
        <WerewolfLayout>
            <div className="min-h-screen bg-dots-pattern">
                <div className="p-6 max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                        <div>
                            <h1 className="text-4xl font-serif text-amber-500 tracking-tight">
                                Administration
                            </h1>
                            <p className="text-stone-400 mt-2">
                                Gestion de la Meute et des Esprits.
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                            <button
                                onClick={() => setActiveTab('renown')}
                                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'renown' ? 'bg-amber-900 text-amber-100 shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Renommée
                            </button>
                            <button
                                onClick={() => setActiveTab('gifts')}
                                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'gifts' ? 'bg-amber-900 text-amber-100 shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Attribution de Dons
                            </button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === 'renown' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-gray-300">Demandes en attente</h2>
                                {renownLoading ? (
                                    <div className="py-12 text-center text-amber-500 animate-pulse">Chargement des requêtes...</div>
                                ) : (
                                    <RenownRequestList
                                        requests={requests}
                                        onValidate={handleValidate}
                                        onReject={handleReject}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'gifts' && (
                            <div className="bg-stone-900/50 rounded-xl p-8 border border-stone-800 text-center space-y-6">
                                <div className="w-24 h-24 bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-900/40">
                                    <span className="text-5xl">🎁</span>
                                </div>
                                <h2 className="text-2xl font-serif text-amber-100">Gestion des Dons</h2>
                                <p className="text-stone-400 max-w-lg mx-auto">
                                    Ouvrez l'interface d'attribution pour voir les dons débloqués par tribu et assigner manuellement des pouvoirs aux joueurs.
                                </p>
                                <button
                                    onClick={() => setIsGiftModalOpen(true)}
                                    className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded shadow-lg hover:shadow-amber-900/40 transition-all transform hover:-translate-y-1"
                                >
                                    Ouvrir l'Interface d'Attribution
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <GiftAssignmentModal
                    isOpen={isGiftModalOpen}
                    onClose={() => setIsGiftModalOpen(false)}
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
        </WerewolfLayout>
    );
}
