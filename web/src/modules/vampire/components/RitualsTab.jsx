import React, { useState, useEffect } from 'react';
import { Book, Scroll, Filter } from 'lucide-react';
import { getRitualById, getAllRituals } from '../../../data/rituals';
import { getAvailableDisciplines } from '../../../data/disciplines';
import { useGrimoireStore } from '../features/rituals/stores/useGrimoireStore';
import RitualCatalog from '../features/rituals/components/RitualCatalog';
import RitualFilter from '../features/rituals/components/RitualFilter';
import RitualReader from '../features/rituals/components/RitualReader';
import AnimatedView from '../features/rituals/components/AnimatedView';
import MobileFilterDrawer from '../features/rituals/components/MobileFilterDrawer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function RitualsTab({ userId, guildId, clan, isCainMode, character }) {
    // We use the store for rituals state
    const updateCharacterRituals = useGrimoireStore(state => state.updateCharacterRituals);
    const selectedRitual = useGrimoireStore(state => state.selectedRitual);
    const setSelectedRitual = useGrimoireStore(state => state.setSelectedRitual);
    const setRituals = useGrimoireStore(state => state.setRituals); // Added missing selector

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchRituals = async () => {
            // Check if it's an NPC (UUID id)
            const isNpc = character && (typeof character.id === 'string' && character.id.length > 20);

            // ALWAYS load the full database first (Master List)
            // This ensures "GM Mode" always has access to everything
            const allRituals = getAllRituals();
            setRituals(allRituals);

            // 1. GM Mode (God Mode) - Excluding NPC view
            if (isCainMode && !isNpc) {
                // In God Mode, we effectively "know" everything, but technically
                // the viewMode 'GM' handles the display.
                // We could clear the active character rituals or set them to all,
                // but for now, we just ensure the DB is loaded.
                setLoading(false);
                return;
            }

            // 2. NPC Logic
            if (isNpc) {
                let userRitualIds = [];

                // a. Manual Rituals (stored as IDs)
                if (character.rituals && Array.isArray(character.rituals)) {
                    userRitualIds = [...character.rituals];
                }

                // b. Auto-unlock for Clans based on Blood Potency
                const clanName = (character.clan || '').toLowerCase();
                const bloodPotency = character.bloodPotency || 1;
                const availableDiscs = getAvailableDisciplines(clanName, bloodPotency);

                // Tremere -> Thaumaturgy
                const thaumInfo = availableDiscs.find(d => d.id === 'thaumaturgy');
                if (thaumInfo) {
                    const thaumLevel = thaumInfo.maxLevel;
                    const autoRituals = allRituals.filter(r => r.discipline === 'thaumaturgy' && r.level <= thaumLevel);
                    autoRituals.forEach(r => {
                        if (!userRitualIds.includes(r.id)) userRitualIds.push(r.id);
                    });
                }

                // Giovanni/Hecata -> Necromancy
                const necroInfo = availableDiscs.find(d => d.id === 'necromancy');
                if (necroInfo) {
                    const necroLevel = necroInfo.maxLevel;
                    const autoRituals = allRituals.filter(r => r.discipline === 'necromancy' && r.level <= necroLevel);
                    autoRituals.forEach(r => {
                        if (!userRitualIds.includes(r.id)) userRitualIds.push(r.id);
                    });
                }

                // Update the Store's "Active Character" knowledge
                updateCharacterRituals(userRitualIds);
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
                    // API returns list of IDs
                    const ritualIds = data.rituals || [];

                    updateCharacterRituals(ritualIds);
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
    }, [userId, guildId, isCainMode, character, setRituals, updateCharacterRituals]);

    if (loading) {
        return <div className="text-center py-10 text-stone-500 animate-pulse">Ouverture du Grimoire...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6 h-[80vh] flex flex-col">
            {/* Header with mobile filter button */}
            <div className="flex-shrink-0">
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-serif text-red-500 mb-2 flex items-center justify-center gap-3">
                        <Book className="text-red-700" />
                        Grimoire Occulte
                    </h2>
                    <p className="text-stone-500 text-sm italic max-w-md mx-auto">
                        "Le savoir qui ne se partage pas est un savoir mort."
                    </p>
                </div>

                {/* Mobile Filter Button - Only visible on mobile */}
                <div className="md:hidden flex justify-center mt-3">
                    <button
                        onClick={() => setIsFilterDrawerOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-stone-800 border border-stone-700 rounded-lg text-stone-300 hover:bg-stone-700 hover:text-stone-200 transition-colors font-serif text-sm uppercase tracking-wider"
                        aria-label="Ouvrir les filtres"
                    >
                        <Filter size={18} className="text-red-600" />
                        Filtres
                    </button>
                </div>
            </div>

            {/* Main Content Area with Sidebar and Catalog */}
            <div className="flex-grow min-h-0 border border-stone-800 rounded bg-stone-950/50 overflow-hidden relative">

                <div className="h-full flex transition-all duration-500">

                    {/* Left Pane: Filter + Catalog */}
                    <div className={`
                        flex flex-grow min-w-0 h-full transition-all duration-500
                        ${selectedRitual ? 'md:w-1/3 md:flex-none' : 'w-full'}
                    `}>
                        {/* Filter Sidebar (Desktop) - Collapses when ritual is selected */}
                        <div className={`hidden md:block h-full transition-all duration-300 ${selectedRitual ? 'w-0 opacity-0 overflow-hidden' : 'w-64'}`}>
                            <RitualFilter />
                        </div>

                        {/* Vertical Divider */}
                        <div className={`hidden md:block w-px bg-stone-800 transition-opacity ${selectedRitual ? 'opacity-0' : 'opacity-100'}`}></div>

                        {/* Virtualized Catalog Container */}
                        <div className="flex-1 min-w-0 h-full border-r border-stone-800">
                            <RitualCatalog />
                        </div>
                    </div>

                    {/* Right Pane: Reader (Desktop) */}
                    {selectedRitual && (
                        <AnimatedView
                            viewKey={`desktop-${selectedRitual.id}`}
                            variant="slideRight"
                            className="hidden md:block md:w-2/3 h-full border-l border-stone-800"
                        >
                            <RitualReader
                                ritual={selectedRitual}
                                onClose={() => setSelectedRitual(null)}
                            />
                        </AnimatedView>
                    )}
                </div>

                {/* Mobile Reader Overlay */}
                {selectedRitual && (
                    <AnimatedView
                        viewKey={`mobile-${selectedRitual.id}`}
                        variant="slideUp"
                        className="absolute inset-0 z-50 md:hidden"
                    >
                        <RitualReader
                            ritual={selectedRitual}
                            onClose={() => setSelectedRitual(null)}
                        />
                    </AnimatedView>
                )}
            </div>

            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
                isOpen={isFilterDrawerOpen}
                onClose={() => setIsFilterDrawerOpen(false)}
            />
        </div>
    );
}
