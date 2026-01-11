import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGrimoireStore } from '../stores/useGrimoireStore';
// import SearchInput from './SearchInput'; // Moved to parent
import { Diamond, Check } from 'lucide-react';

// Levels remain static for now (1-5 is standard V20/V5 rule)
const LEVELS = [1, 2, 3, 4, 5];

/**
 * FilterContent - Extracted filter UI for reuse in both desktop sidebar and mobile drawer.
 * @param {Object} props
 * @param {() => void} [props.onFilterChange] - Optional callback invoked when any filter changes (for auto-close on mobile)
 */
export default function FilterContent({ onFilterChange }) {
    // Consolidated store access with useShallow to prevent unnecessary re-renders
    const { rituals, filters, addFilter, removeFilter, clearFilters, viewMode, toggleViewMode } = useGrimoireStore(
        useShallow(state => ({
            rituals: state.rituals,
            filters: state.filters,
            addFilter: state.addFilter,
            removeFilter: state.removeFilter,
            clearFilters: state.clearFilters,
            viewMode: state.viewMode,
            toggleViewMode: state.toggleViewMode
        }))
    );



    const toggleLevel = (lvl) => {
        if (filters.levels.includes(lvl)) {
            removeFilter('levels', lvl);
        } else {
            addFilter('levels', lvl);
        }
        onFilterChange?.();
    };

    const handleClearFilters = () => {
        clearFilters();
        onFilterChange?.();
    };

    const hasActiveFilters = filters.disciplines.length > 0 || filters.levels.length > 0;

    return (
        <div className="space-y-6 font-serif">

            {/* View Mode Toggle - Removed per user request */}
            {/* 
            <div className="pb-2 border-b border-stone-800">
                ... 
            </div>
            */}

            {/* Search Section - Moved to Header */}

            {/* Header / Clear - Adjusted to be minimal */}
            {hasActiveFilters && (
                <div className="flex items-center justify-end pt-2 pb-4">
                    <button
                        onClick={handleClearFilters}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-2 border border-red-900/30 px-3 py-1 rounded bg-red-950/20"
                    >
                        <span>Effacer les filtres</span>
                        <span className="text-[10px] opacity-70">✕</span>
                    </button>
                </div>
            )}

            {/* Disciplines Section - Removed per user request */}

            {/* Levels Section - Only visible for GMs */}
            {viewMode === 'GM' && (
                <div className="space-y-3">
                    <h4 className="text-stone-500 text-sm font-semibold border-b border-stone-800 pb-1">Niveau</h4>
                    <div className="flex flex-wrap gap-2">
                        {LEVELS.map(lvl => {
                            const isActive = filters.levels.includes(lvl);
                            return (
                                <button
                                    key={lvl}
                                    onClick={() => toggleLevel(lvl)}
                                    className={`
                                        w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border transition-all duration-200
                                        ${isActive
                                            ? 'bg-red-900/40 border-red-700 text-red-100 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                                            : 'bg-stone-900 border-stone-800 text-stone-600 hover:border-stone-600 hover:text-stone-400'
                                        }
                                    `}
                                >
                                    {lvl}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
