import React, { useState, useEffect } from 'react';
import { Book, Scroll, Filter } from 'lucide-react';
import { getRitualById, getAllRituals } from '../../../data/rituals';
import { getAvailableDisciplines } from '../../../data/disciplines';
import { useGrimoireStore } from '../features/rituals/stores/useGrimoireStore';
import RitualCatalog from '../features/rituals/components/RitualCatalog';
// import RitualFilter from '../features/rituals/components/RitualFilter'; // Removed
import SearchInput from '../features/rituals/components/SearchInput'; // Direct usage
import RitualReader from '../features/rituals/components/RitualReader';
import AnimatedView from '../features/rituals/components/AnimatedView';
import MobileFilterDrawer from '../features/rituals/components/MobileFilterDrawer';
import FilterContent from '../features/rituals/components/FilterContent'; // Use directly for mobile or modal if needed

import { API_URL } from '../../../config';

export default function RitualsTab({ userId, guildId, clan, isCainMode, character }) {
    // We use the store for rituals state
    const updateCharacterRituals = useGrimoireStore(state => state.updateCharacterRituals);
    const selectedRitual = useGrimoireStore(state => state.selectedRitual);
    const setSelectedRitual = useGrimoireStore(state => state.setSelectedRitual);
    const setRituals = useGrimoireStore(state => state.setRituals);
    const setViewMode = useGrimoireStore(state => state.setViewMode);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchRituals = async () => {
            console.log('RitualsTab: fetchRituals started');
            try {
                // Check if it's an NPC (UUID id)
                const isNpc = character && (typeof character.id === 'string' && character.id.length > 20);

                // ALWAYS load the full database first (Master List)
                // This ensures "GM Mode" always has access to everything
                // Fix: Ensure we filter out any nulls that might have crept in
                const rawRituals = getAllRituals();
                console.log('RitualsTab: getAllRituals result type:', typeof rawRituals, Array.isArray(rawRituals));

                if (!rawRituals || !Array.isArray(rawRituals)) {
                    console.error('RitualsTab: getAllRituals returned null/undefined or invalid type!', rawRituals);
                    setRituals([]);
                    return;
                }

                const allRituals = rawRituals.filter(r => r && typeof r === 'object' && r.id);
                console.log(`RitualsTab: Valid rituals loaded: ${allRituals.length}/${rawRituals.length}`);

                // Enforce View Mode based on permission
                // This ensures the filtering logic in the store knows the context
                setViewMode(isCainMode ? 'GM' : 'PLAYER');

                setRituals(allRituals);

                // 1. GM Mode (God Mode) - Excluding NPC view
                if (isCainMode && !isNpc) {
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
                    const availableDiscs = getAvailableDisciplines(clanName, bloodPotency) || [];

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
                }
            } catch (fatalErr) {
                console.error('RitualsTab: Fatal error in fetchRituals', fatalErr);
                setError('Erreur critique du Grimoire.');
            } finally {
                setLoading(false);
            }
        };

        fetchRituals();
    }, [userId, guildId, isCainMode, character, setRituals, updateCharacterRituals, setViewMode]);

    if (loading) {
        return <div className="text-center py-10 text-stone-500 animate-pulse">Ouverture du Grimoire...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6 h-[80vh] flex flex-col bg-noise relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-stone-950/50 before:to-stone-950/80 before:pointer-events-none p-4 rounded-xl border border-stone-900 shadow-2xl">
            {/* Header with Search */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center gap-4">
                <div className="text-center">
                    <h2 className="text-2xl font-serif text-red-500 mb-2 flex items-center justify-center gap-3">
                        <Book className="text-red-700" />
                        Grimoire Occulte
                    </h2>
                    <p className="text-stone-500 text-sm italic max-w-md mx-auto">
                        "Le savoir qui ne se partage pas est un savoir mort."
                    </p>
                </div>

                {/* Search Bar - Centered and prominent */}
                <div className="w-full max-w-md z-10">
                    <SearchInput />
                </div>
            </div>

            {/* Main Content Area with Sidebar and Catalog */}
            <div className="flex-grow min-h-0 border border-stone-800 rounded bg-stone-950/50 overflow-hidden relative">

                <div className="h-full flex transition-all duration-500">

                    {/* Left Pane: Catalog Only (No Sidebar) */}
                    <div className={`
                        flex flex-grow min-w-0 h-full transition-all duration-500 flex-col
                        ${selectedRitual ? 'hidden md:flex md:w-1/4 md:border-r border-stone-800' : 'w-full'}
                    `}>
                        {/* GM Filters Bar (Optional, only if GM mode) */}
                        <div className="flex-shrink-0">
                            <FilterContent />
                        </div>

                        {/* Virtualized Catalog Container */}
                        <div className="flex-1 min-w-0 h-full">
                            <RitualCatalog />
                        </div>
                    </div>

                    {/* Right Pane: Reader (Desktop) */}
                    {selectedRitual && (
                        <AnimatedView
                            viewKey={`desktop-${selectedRitual.id}`}
                            variant="slideRight"
                            className="hidden md:block md:w-3/4 h-full border-l border-stone-800 min-w-0"
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
