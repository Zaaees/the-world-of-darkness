import { create } from 'zustand';
import { searchRituals } from '../utils/search';
import { canLearnRitual } from '../utils/rules';

// Mock Character for Story 3.1
const MOCK_CHARACTER = {
    id: 'char_1',
    name: 'Theo bell',
    clan: 'Brujah',
    bloodPotency: 1,
    disciplines: {
        'Celerity': 2,
        'Potence': 2,
        'Thaumaturgy': 0 // Intentionally low for testing
    },
    rituals: [] // List of learned ritual IDs
};

/**
 * Global Grimoire Store
 * Manages the state for the Rituals feature including list, active filters, and search.
 *
 * @typedef {Object} GrimoireState
 * @property {Array} rituals - The complete static list of rituals
 * @property {Object} filters - Active filters (e.g. { discipline: 'Thaumaturgy' })
 * @property {string} searchQuery - Current search input
 * @property {function(Object): void} setFilters - Updates the active filters
 * @property {function(string): void} setSearchQuery - Updates the search query
 */
export const useGrimoireStore = create((set, get) => ({
    rituals: [],
    searchQuery: '',
    selectedRitual: null, // Story 3.3: Selected ritual for Reader
    viewMode: 'PLAYER', // 'GM' or 'PLAYER' - Default to PLAYER for security
    filters: {
        disciplines: [],
        levels: []
    },

    // Story 3.1: Character Context
    activeCharacter: MOCK_CHARACTER,

    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedRitual: (ritual) => set({ selectedRitual: ritual }),
    setRituals: (rituals) => set({ rituals: rituals }),
    toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'GM' ? 'PLAYER' : 'GM' })),
    setViewMode: (mode) => set({ viewMode: mode }),

    addFilter: (type, value) => set((state) => {
        const currentFilters = state.filters[type] || [];
        if (currentFilters.includes(value)) return {}; // No change if already exists
        return {
            filters: {
                ...state.filters,
                [type]: [...currentFilters, value]
            }
        };
    }),

    removeFilter: (type, value) => set((state) => {
        const currentFilters = state.filters[type] || [];
        return {
            filters: {
                ...state.filters,
                [type]: currentFilters.filter(item => item !== value)
            }
        };
    }),

    clearFilters: () => set({
        filters: { disciplines: [], levels: [] },
        searchQuery: ''
    }),

    // Story 3.1: Attribution Logic
    checkLearnability: (ritualId) => {
        const state = get();
        const ritual = state.rituals.find(r => r.id === ritualId);
        if (!ritual) return { allowed: false, reason: 'Rituel introuvable' };

        return canLearnRitual(state.activeCharacter, ritual);
    },

    learnRitual: (ritualId, force = false) => {
        const state = get();
        // Validation (if not forced)
        if (!force) {
            const check = state.checkLearnability(ritualId);
            if (!check.allowed) return false; // Should be handled by UI, but safety check
        }

        // Add to list if not already present
        const currentRituals = state.activeCharacter.rituals;
        if (!currentRituals.includes(ritualId)) {
            set(state => ({
                activeCharacter: {
                    ...state.activeCharacter,
                    rituals: [...state.activeCharacter.rituals, ritualId]
                }
            }));
        }
        return true;
    },

    updateCharacterRituals: (ritualIds) => set(state => ({
        activeCharacter: {
            ...state.activeCharacter,
            rituals: ritualIds
        }
    })),

    selectFilteredRituals: (state) => {
        const { rituals, filters, searchQuery, viewMode, activeCharacter } = state;
        const { disciplines, levels } = filters;

        // 0. Pre-filter by View Mode (Security/Role Filter)
        let baseRituals = rituals;

        if (!baseRituals || !Array.isArray(baseRituals)) {
            console.warn('useGrimoireStore: rituals state is missing or invalid', baseRituals);
            return [];
        }

        if (viewMode === 'PLAYER') {
            const ownedRituals = activeCharacter.rituals || [];
            baseRituals = rituals.filter(r => ownedRituals.includes(r.id));
        }

        // 1. First apply strict filters (reduce dataset)
        const filteredByCriteria = baseRituals.filter(ritual => {
            const matchDiscipline = disciplines.length === 0 || disciplines.includes(ritual.discipline);
            const matchLevel = levels.length === 0 || levels.includes(ritual.level);
            return matchDiscipline && matchLevel;
        });

        // 2. Then apply Fuzzy Search on the filtered subset
        return searchRituals(filteredByCriteria, searchQuery);
    }
}));

export default useGrimoireStore;
