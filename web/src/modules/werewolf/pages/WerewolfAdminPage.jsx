// site-content: migrated
import { displayText, useSiteContent, openContentEditor, siteText } from '../../../core/content/store';
import SiteText from '../../../core/content/SiteText';
import React, { useState } from 'react';
import RenownRequestList from '../components/RenownRequestList';
import GiftAssignmentModal from '../components/GiftAssignmentModal';
import { useRenownAdmin } from '../hooks/useRenownAdmin';
import Toast from '../../../components/Toast';
import WerewolfLayout from '../components/WerewolfLayout';

export default function WerewolfAdminPage() {
    useSiteContent();
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
            setToast({ type: 'success', message: 'Demande validée', subtext: siteText("werewolf.text.02594", { v0: (result.new_rank) }) });
        } catch (e) {
            setToast({ type: 'error', message: 'Erreur', subtext: e.message });
        }
    };

    const handleReject = async (id) => {
        if (!confirm(siteText("werewolf.text.02595"))) return;
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
                <div className="p-8 text-center text-red-500"><SiteText contentKey="werewolf.text.01822" />{displayText("werewolf", renownError)}</div>
            </WerewolfLayout>
        );
    }

    return (
        <WerewolfLayout>
            <div className="min-h-screen bg-dots-pattern">
                <button type="button" onClick={() => openContentEditor()} className="m-6 rounded border border-amber-700 px-4 py-2 text-amber-300">Éditer les textes du site</button>
                <div className="p-6 max-w-7xl mx-auto space-y-8">
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                        <div>
                            <h1 className="text-4xl font-serif text-amber-500 tracking-tight"><SiteText contentKey="werewolf.text.01823" /></h1>
                            <p className="text-stone-400 mt-2"><SiteText contentKey="werewolf.text.01824" /></p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
                            <button
                                onClick={() => setActiveTab('renown')}
                                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'renown' ? 'bg-amber-900 text-amber-100 shadow' : 'text-gray-400 hover:text-white'}`}
                            ><SiteText contentKey="werewolf.text.01825" /></button>
                            <button
                                onClick={() => setActiveTab('gifts')}
                                className={`px-4 py-2 rounded-md transition-all ${activeTab === 'gifts' ? 'bg-amber-900 text-amber-100 shadow' : 'text-gray-400 hover:text-white'}`}
                            ><SiteText contentKey="werewolf.text.01826" /></button>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {activeTab === 'renown' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-serif text-gray-300"><SiteText contentKey="werewolf.text.01827" /></h2>
                                {renownLoading ? (
                                    <div className="py-12 text-center text-amber-500 animate-pulse"><SiteText contentKey="werewolf.text.01828" /></div>
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
                                <h2 className="text-2xl font-serif text-amber-100"><SiteText contentKey="werewolf.text.01829" /></h2>
                                <p className="text-stone-400 max-w-lg mx-auto"><SiteText contentKey="werewolf.text.01830" /></p>
                                <button
                                    onClick={() => setIsGiftModalOpen(true)}
                                    className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white font-bold rounded shadow-lg hover:shadow-amber-900/40 transition-all transform hover:-translate-y-1"
                                ><SiteText contentKey="werewolf.text.01831" /></button>
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
                        message={displayText("werewolf", toast.message)}
                        subtext={toast.subtext}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </WerewolfLayout>
    );
}
