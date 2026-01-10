import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Search, RefreshCw, Trash2, Edit, Save, Share2, ArrowLeft } from 'lucide-react';
import { getClanDescription, CLAN_DESCRIPTIONS as CLANS } from '../../data/clanDescriptions';

// API CONSTANTS
import { API_URL } from '../../config';

export default function GmDashboard({ discordUser, guildId, onSelectNpc }) {
    const [activeTab, setActiveTab] = useState('list'); // 'list', 'create'
    const [npcs, setNpcs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form states for creation
    const [newName, setNewName] = useState('');
    const [newClan, setNewClan] = useState('');
    const [newUn, setNewBp] = useState(1);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchNpcs();
    }, [discordUser, guildId]);

    const fetchNpcs = async () => {
        if (!discordUser || !guildId) return;

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/gm/npcs`, {
                headers: {
                    'X-Discord-User-ID': discordUser.id,
                    'X-Discord-Guild-ID': guildId.toString()
                }
            });
            const data = await response.json();
            if (data.success) {
                setNpcs(data.npcs);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Erreur chargement PNJ');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNpc = async (e) => {
        e.preventDefault();
        if (!newName || !newClan) return;

        setCreating(true);
        try {
            const response = await fetch(`${API_URL}/api/gm/npcs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Discord-User-ID': discordUser.id,
                    'X-Discord-Guild-ID': guildId.toString()
                },
                body: JSON.stringify({
                    name: newName,
                    clan: newClan,
                    blood_potency: newUn,
                    status: 'private'
                })
            });

            const data = await response.json();
            if (data.success) {
                await fetchNpcs();
                setNewName('');
                setNewClan('');
                setActiveTab('list');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Erreur création PNJ');
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteNpc = async (e, npcId, npcName) => {
        e.stopPropagation();
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${npcName} ? Cette action est irréversible (registres, site, discord).`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/gm/npcs/${npcId}`, {
                method: 'DELETE',
                headers: {
                    'X-Discord-User-ID': discordUser.id,
                    'X-Discord-Guild-ID': guildId.toString()
                }
            });

            const data = await response.json();
            if (data.success) {
                await fetchNpcs();
            } else {
                alert("Erreur lors de la suppression : " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    // Filter NPCs
    const filteredNpcs = npcs.filter(npc =>
        npc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (npc.clan && npc.clan.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#0c0a09] text-stone-300 font-sans p-6 pb-20">
            <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-red-600 mb-2 flex items-center gap-3">
                        <Shield size={32} />
                        Tableau de Bord MJ
                    </h1>
                    <p className="text-stone-500">Gérez les PNJ et le monde des ténèbres.</p>
                </div>
            </header>

            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <div className="flex gap-4 border-b border-stone-800 mb-6">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`pb-3 px-4 text-sm font-serif uppercase tracking-widest transition-colors ${activeTab === 'list'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={16} />
                            Liste PNJ
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`pb-3 px-4 text-sm font-serif uppercase tracking-widest transition-colors ${activeTab === 'create'
                            ? 'text-red-500 border-b-2 border-red-500'
                            : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <UserPlus size={16} />
                            Créer PNJ
                        </div>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 text-red-300 p-4 rounded mb-6 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200">×</button>
                    </div>
                )}

                {/* CONTENU LISTE */}
                {activeTab === 'list' && (
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-600" size={16} />
                                <input
                                    type="text"
                                    placeholder="Rechercher un PNJ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-stone-900/50 border border-stone-800 rounded pl-10 pr-4 py-2 text-stone-300 focus:border-red-900 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={fetchNpcs}
                                className="p-2 bg-stone-900 border border-stone-800 rounded hover:border-stone-600 transition-colors"
                                title="Actualiser"
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>

                        {loading && npcs.length === 0 ? (
                            <div className="text-center py-12 text-stone-600 italic">Chargement des dossiers...</div>
                        ) : filteredNpcs.length === 0 ? (
                            <div className="text-center py-12 border border-stone-800 border-dashed rounded bg-stone-900/20">
                                <p className="text-stone-500 mb-2">Aucun PNJ trouvé.</p>
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Créer votre premier PNJ
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Carte Caïn (Permanente) */}
                                <div
                                    onClick={() => onSelectNpc({
                                        id: 'cain_legendary',
                                        name: "Caïn",
                                        clan: "La Créature",
                                        blood_potency: 10,
                                        description: "Le Premier Vampire. Le Père Noir.",
                                        disciplines: {},
                                        rituals: []
                                    })}
                                    className="bg-red-950/10 border border-red-900/30 rounded p-4 cursor-pointer hover:bg-red-950/20 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20">
                                        <Shield size={64} />
                                    </div>
                                    <h3 className="text-xl font-serif text-red-500 mb-1">Caïn</h3>
                                    <h3 className="text-xl font-serif text-red-500 mb-1">Caïn</h3>
                                    <p className="text-xs text-stone-500 uppercase tracking-widest">Le Premier Vampire</p>
                                </div>

                                {filteredNpcs.map(npc => (
                                    <div
                                        key={npc.id}
                                        onClick={() => onSelectNpc(npc)}
                                        className="bg-stone-900/40 border border-stone-800 rounded p-4 cursor-pointer hover:border-red-900/50 hover:bg-stone-900/60 transition-all group flex gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-stone-800 flex-shrink-0 overflow-hidden border border-stone-700">
                                            {npc.image_url ? (
                                                <img src={npc.image_url} alt={npc.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-600">
                                                    <Users size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-serif text-stone-200 truncate group-hover:text-red-400 transition-colors">
                                                    {npc.name}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    {npc.status === 'public' && (
                                                        <Share2 size={14} className="text-green-600" title="Publié" />
                                                    )}
                                                    <button
                                                        onClick={(e) => handleDeleteNpc(e, npc.id, npc.name)}
                                                        className="text-stone-600 hover:text-red-500 p-1 hover:bg-red-950/30 rounded transition-colors"
                                                        title="Supprimer définitivement"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-2">
                                                {npc.clan || 'Sans Clan'} • BP {npc.blood_potency}
                                            </div>
                                            <p className="text-stone-400 text-sm line-clamp-2">
                                                {npc.description || "Aucune description."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* CONTENU CRÉATION */}
                {activeTab === 'create' && (
                    <form onSubmit={handleCreateNpc} className="bg-stone-900/30 border border-stone-800 rounded p-6 max-w-lg mx-auto">
                        <h3 className="text-xl font-serif text-stone-200 mb-6 border-b border-stone-800 pb-2">Nouveau PNJ</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-serif uppercase tracking-widest text-stone-500 mb-1">
                                    Nom du PNJ
                                </label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 focus:border-red-800 focus:outline-none"
                                    placeholder="Ex: Marcus Vitel"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-serif uppercase tracking-widest text-stone-500 mb-1">
                                    Clan
                                </label>
                                <select
                                    value={newClan}
                                    onChange={(e) => setNewClan(e.target.value)}
                                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 focus:border-red-800 focus:outline-none"
                                    required
                                >
                                    <option value="">Sélectionner un clan...</option>
                                    {Object.entries(CLANS || {}).map(([key, clan]) => (
                                        <option key={key} value={key}>{clan.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-serif uppercase tracking-widest text-stone-500 mb-1">
                                    Puissance du Sang (Maximum 5)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={newUn}
                                    onChange={(e) => setNewBp(parseInt(e.target.value))}
                                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 focus:border-red-800 focus:outline-none"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('list')}
                                    className="px-4 py-2 rounded border border-stone-700 text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="px-6 py-2 rounded bg-red-900 hover:bg-red-800 text-white font-serif tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {creating && <RefreshCw size={14} className="animate-spin" />}
                                    Créer
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div >
    );
}
