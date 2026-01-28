import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGrimoireStore } from '../stores/useGrimoireStore';
import SearchInput from './SearchInput';
import { Diamond, Check, Book, Users } from 'lucide-react';

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
    );    // Extract unique disciplines from available rituals
    const uniqueDisciplines = useMemo(() => {
        const set = new Set(rituals.map(r => r.discipline));
        return Array.from(set).sort();
    }, [rituals]);

    const toggleDiscipline = (disc) => {
        if (filters.disciplines.includes(disc)) {
            removeFilter('disciplines', disc);
        } else {
            addFilter('disciplines', disc);
        }
        onFilterChange?.();
    };


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

            {/* View Mode Toggle */}
            <div className="pb-4 border-b border-stone-800">
                <div className="flex bg-stone-950 p-1 rounded-lg border border-stone-800/50">
                    <button
                        onClick={toggleViewMode}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-serif transition-all duration-300 ${viewMode === 'PLAYER'
                            ? 'bg-red-900/40 text-red-100 shadow-inner border border-red-800/50'
                            : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        <Users size={14} />
                        <span>Grimoire (Joueur)</span>
                    </button>
                    <button
                        onClick={toggleViewMode}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-serif transition-all duration-300 ${viewMode === 'GM'
                            ? 'bg-red-900/40 text-red-100 shadow-inner border border-red-800/50'
                            : 'text-stone-500 hover:text-stone-300'
                            }`}
                    >
                        <Book size={14} />
                        <span>Bibliothèque (MJ)</span>
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="space-y-3">
                <h4 className="text-stone-500 text-xs uppercase tracking-widest font-semibold">Recherche</h4>
                <SearchInput />
            </div>

            {/* Header / Clear - Adjusted to be minimal */}
            {hasActiveFilters && (
                <div className="flex items-center justify-end pt-2 pb-4">
                    <button
                        onClick={handleClearFilters}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-2 border border-red-900/30 px-3 py-1 rounded bg-red-950/20"
                    >
                        <span>Effacer</span>
                        <span className="text-[10px] opacity-70">✕</span>
                    </button>
                </div>
            )}

            {/* Disciplines Section */}
            <div className="space-y-3">
                <h4 className="text-stone-500 text-sm font-semibold border-b border-stone-800 pb-1 flex justify-between items-center">
                    <span>Discipline</span>
                    {filters.disciplines.length > 0 && (
                        <span className="text-[10px] bg-red-900/30 text-red-500 px-1.5 py-0.5 rounded-full">
                            {filters.disciplines.length}
                        </span>
                    )}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {uniqueDisciplines.map(disc => {
                        const isActive = filters.disciplines.includes(disc);
                        return (
                            <label
                                key={disc}
                                className={`
                                    flex-1 min-w-[120px] min-h-[44px] px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200 flex items-center gap-2 cursor-pointer
                                    ${isActive
                                        ? 'bg-red-900/40 border-red-700 text-red-100 shadow-[0_0_10px_rgba(220,38,38,0.2)]'
                                        : 'bg-stone-900 border-stone-800 text-stone-500 hover:border-stone-600 hover:text-stone-400'
                                    }
                                `}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isActive}
                                    onChange={() => toggleDiscipline(disc)}
                                />
                                {isActive && <Check size={12} className="text-red-500" />}
                                <span>{disc}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

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
