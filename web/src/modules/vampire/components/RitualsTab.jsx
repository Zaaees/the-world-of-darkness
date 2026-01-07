import React, { useState, useEffect } from 'react';
import { Book, Scroll, Flame, Skull, AlertCircle } from 'lucide-react';
import { getRitualById, getAllRituals } from '../../../data/rituals';
import { getAvailableDisciplines } from '../../../data/disciplines';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const RitualCard = ({ ritual }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-stone-900/40 border border-stone-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-red-900/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-950 border border-stone-800 flex items-center justify-center text-red-700">
                        {ritual.discipline === 'necromancy' ? <Skull size={20} /> : <Flame size={20} />}
                    </div>
                    <div>
                        <h3 className="font-serif text-lg text-stone-200">{ritual.name}</h3>
                        <p className="text-xs text-stone-500 uppercase tracking-wider">
                            {ritual.discipline === 'necromancy' ? 'Nécromancie' : 'Thaumaturgie'} &bull; Niveau {ritual.level}
                        </p>
                    </div>
                </div>
            </button>

            {isOpen && (
                <div className="p-4 pt-0 border-t border-stone-800/50 bg-black/20">
                    <div className="mt-4 space-y-4 text-sm text-stone-400 font-serif leading-relaxed">
                        <p className="italic border-l-2 border-red-900/30 pl-4 py-1">
                            {ritual.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-stone-950/50 p-3 rounded border border-stone-800/50">
                                <span className="block text-xs uppercase tracking-widest text-stone-600 mb-1">Ingrédients</span>
                                <span className="text-stone-300">{ritual.ingredients}</span>
                            </div>
                            <div className="bg-stone-950/50 p-3 rounded border border-stone-800/50">
                                <span className="block text-xs uppercase tracking-widest text-stone-600 mb-1">Durée</span>
                                <span className="text-stone-300">{ritual.duration}</span>
                            </div>
                        </div>

                        {ritual.steps && (
                            <div className="mt-4">
                                <h4 className="text-xs uppercase tracking-widest text-stone-600 mb-2">Rituel</h4>
                                <div className="space-y-2">
                                    {ritual.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <span className="text-red-900 font-bold font-serif">{idx + 1}.</span>
                                            <span className="text-stone-300">{step.replace(/^\d+\.\s*/, '')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function RitualsTab({ userId, guildId, clan, isCainMode, character }) {
    const [rituals, setRituals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRituals = async () => {
            // Check if it's an NPC (UUID id)
            // Note: character can be null during initial load, but VampireSheet always passes something if rendered
            const isNpc = character && (typeof character.id === 'string' && character.id.length > 20);

            // 1. GM Mode (God Mode) - Excluding NPC view
            if (isCainMode && !isNpc) {
                setRituals(getAllRituals());
                setLoading(false);
                return;
            }

            // 2. NPC Logic
            if (isNpc) {
                let userRituals = [];
                const allRituals = getAllRituals();

                // a. Manual Rituals (stored as IDs)
                if (character.rituals && Array.isArray(character.rituals)) {
                    userRituals = character.rituals
                        .map(id => getRitualById(id))
                        .filter(r => r !== undefined);
                }

                // b. Auto-unlock for Clans based on Blood Potency
                const clan = (character.clan || '').toLowerCase();
                const bloodPotency = character.bloodPotency || 1;

                // Get available disciplines and their max levels based on BP
                const availableDiscs = getAvailableDisciplines(clan, bloodPotency);

                // Tremere -> Thaumaturgy
                const thaumInfo = availableDiscs.find(d => d.id === 'thaumaturgy');
                if (thaumInfo) {
                    const thaumLevel = thaumInfo.maxLevel;
                    const autoRituals = allRituals.filter(r => r.discipline === 'thaumaturgy' && r.level <= thaumLevel);

                    const currentIds = new Set(userRituals.map(r => r.id));
                    autoRituals.forEach(r => {
                        if (!currentIds.has(r.id)) userRituals.push(r);
                    });
                }

                // Giovanni/Hecata -> Necromancy
                const necroInfo = availableDiscs.find(d => d.id === 'necromancy');
                if (necroInfo) {
                    const necroLevel = necroInfo.maxLevel;
                    const autoRituals = allRituals.filter(r => r.discipline === 'necromancy' && r.level <= necroLevel);

                    const currentIds = new Set(userRituals.map(r => r.id));
                    autoRituals.forEach(r => {
                        if (!currentIds.has(r.id)) userRituals.push(r);
                    });
                }
                setRituals(userRituals);
                setLoading(false);
                return;
            }

            // 3. Player Logic (Fetch from API)
            try {
                const response = await fetch(`${API_URL}/api/rituals`, {
                    headers: {
                        'X-Discord-User-ID': userId,
                        'X-Discord-Guild-ID': guildId,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // Convert IDs to full ritual objects
                    const fullRituals = (data.rituals || [])
                        .map(id => getRitualById(id))
                        .filter(r => r !== undefined);

                    setRituals(fullRituals);
                } else {
                    console.error('Failed to fetch rituals');
                    setError('Impossible de récupérer le grimoire.');
                }
            } catch (err) {
                console.error('Error fetching rituals:', err);
                setError('Erreur de connexion.');
            } finally {
                setLoading(false);
            }
        };

        fetchRituals();
    }, [userId, guildId, isCainMode, character]);

    if (loading) {
        return <div className="text-center py-10 text-stone-500 animate-pulse">Ouverture du Grimoire...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-red-500 mb-2 flex items-center justify-center gap-3">
                    <Book className="text-red-700" />
                    Grimoire Occulte
                </h2>
                <p className="text-stone-500 text-sm italic max-w-md mx-auto">
                    "Le savoir ne s'offre pas, il s'arrache. Ce qui est écrit ici a été payé par le sang."
                </p>
            </div>

            {rituals.length === 0 ? (
                <div className="text-center py-12 border border-stone-800 border-dashed rounded-lg bg-stone-950/30">
                    <Scroll className="mx-auto text-stone-700 mb-4" size={48} />
                    <p className="text-stone-500 font-serif text-lg">Votre grimoire est vide.</p>
                    <p className="text-stone-600 text-sm mt-2 max-w-xs mx-auto">
                        Les rituels doivent être appris auprès d'un mentor ou découverts dans des textes anciens.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Thaumaturgie */}
                    {(() => {
                        const thaumRituals = rituals.filter(r => r.discipline === 'thaumaturgy');
                        if (thaumRituals.length === 0) return null;

                        // Group by level
                        const byLevel = {};
                        thaumRituals.forEach(r => {
                            if (!byLevel[r.level]) byLevel[r.level] = [];
                            byLevel[r.level].push(r);
                        });

                        const levelNames = {
                            1: 'Apprenti',
                            2: 'Initié',
                            3: 'Disciple',
                            4: 'Adepte',
                            5: 'Maître',
                            6: 'Archimage',
                            7: 'Magus',
                            8: 'Oracle',
                            9: 'Transcendant'
                        };

                        return (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-red-900/30 pb-2">
                                    <Flame className="text-red-600" size={24} />
                                    <h3 className="text-xl font-serif text-red-500 uppercase tracking-wider">Thaumaturgie</h3>
                                    <span className="text-stone-600 text-sm">({thaumRituals.length} rituels)</span>
                                </div>

                                {Object.keys(byLevel).sort((a, b) => a - b).map(level => (
                                    <div key={`thaum-${level}`} className="ml-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-8 h-8 rounded-full bg-red-950/50 border border-red-900/30 flex items-center justify-center text-red-500 font-bold text-sm">
                                                {level}
                                            </span>
                                            <h4 className="text-stone-400 font-serif">
                                                Niveau {level} — <span className="text-red-700 italic">{levelNames[level] || 'Inconnu'}</span>
                                            </h4>
                                            <span className="text-stone-600 text-xs">({byLevel[level].length})</span>
                                        </div>
                                        <div className="space-y-3 ml-10">
                                            {byLevel[level].map(ritual => (
                                                <RitualCard key={ritual.id} ritual={ritual} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {/* Nécromancie */}
                    {(() => {
                        const necroRituals = rituals.filter(r => r.discipline === 'necromancy');
                        if (necroRituals.length === 0) return null;

                        // Group by level
                        const byLevel = {};
                        necroRituals.forEach(r => {
                            if (!byLevel[r.level]) byLevel[r.level] = [];
                            byLevel[r.level].push(r);
                        });

                        const levelNames = {
                            1: 'Fossoyeur',
                            2: 'Nécrophile',
                            3: 'Spirite',
                            4: 'Thanatologue',
                            5: 'Liche'
                        };

                        return (
                            <div className="space-y-4 mt-8">
                                <div className="flex items-center gap-3 border-b border-stone-700/50 pb-2">
                                    <Skull className="text-stone-400" size={24} />
                                    <h3 className="text-xl font-serif text-stone-300 uppercase tracking-wider">Nécromancie</h3>
                                    <span className="text-stone-600 text-sm">({necroRituals.length} rituels)</span>
                                </div>

                                {Object.keys(byLevel).sort((a, b) => a - b).map(level => (
                                    <div key={`necro-${level}`} className="ml-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="w-8 h-8 rounded-full bg-stone-900/50 border border-stone-700/30 flex items-center justify-center text-stone-400 font-bold text-sm">
                                                {level}
                                            </span>
                                            <h4 className="text-stone-400 font-serif">
                                                Niveau {level} — <span className="text-stone-500 italic">{levelNames[level] || 'Inconnu'}</span>
                                            </h4>
                                            <span className="text-stone-600 text-xs">({byLevel[level].length})</span>
                                        </div>
                                        <div className="space-y-3 ml-10">
                                            {byLevel[level].map(ritual => (
                                                <RitualCard key={ritual.id} ritual={ritual} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
