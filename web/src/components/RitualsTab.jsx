import React, { useState, useEffect } from 'react';
import { Book, Scroll, Flame, Skull, AlertCircle } from 'lucide-react';
import { getRitualById } from '../data/rituals';

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

export default function RitualsTab({ userId, guildId, clan }) {
    const [rituals, setRituals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRituals = async () => {
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
    }, [userId, guildId]);

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
                <div className="space-y-4">
                    {rituals.map(ritual => (
                        <RitualCard key={ritual.id} ritual={ritual} />
                    ))}
                </div>
            )}
        </div>
    );
}
