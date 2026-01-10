import React, { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useGrimoireStore } from '../stores/useGrimoireStore';
import SearchInput from './SearchInput';

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

    // derive unique disciplines dynamically from available rituals
    const disciplines = useMemo(() => {
        const unique = new Set(rituals.map(r => r.discipline).filter(Boolean));
        return Array.from(unique).sort();
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
            <div className="pb-2 border-b border-stone-800">
                <button
                    onClick={toggleViewMode}
                    className={`
                        w-full py-2 px-3 rounded-md text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between min-h-[44px]
                        ${viewMode === 'PLAYER'
                            ? 'bg-amber-900/30 text-amber-500 border border-amber-800/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                            : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-700 hover:text-stone-300'
                        }
                    `}
                >
                    <span>{viewMode === 'PLAYER' ? 'Grimoire (Joueur)' : 'Bibliothèque (MJ)'}</span>
                    <span className="text-xs opacity-70">{viewMode === 'PLAYER' ? '👤' : '👁️'}</span>
                </button>
            </div>

            {/* Search Section */}
            <div>
                <SearchInput />
            </div>

            {/* Header / Clear */}
            <div className="flex items-center justify-between pt-2">
                <h3 className="text-stone-400 font-bold uppercase tracking-widest text-xs">Filtres</h3>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="text-xs text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        Effacer
                    </button>
                )}
            </div>

            {/* Disciplines Section */}
            <div className="space-y-3">
                <h4 className="text-stone-500 text-sm font-semibold border-b border-stone-800 pb-1">Disciplines</h4>
                <div className="flex flex-col space-y-1">
                    {disciplines.map(disc => {
                        const isActive = filters.disciplines.includes(disc);
                        return (
                            <label
                                key={disc}
                                className="flex items-center space-x-3 cursor-pointer group min-h-[44px] py-1"
                            >
                                <div className={`w-5 h-5 border border-stone-700 rounded-sm flex items-center justify-center transition-colors ${isActive ? 'bg-red-900 border-red-700' : 'group-hover:border-stone-500'}`}>
                                    {isActive && <div className="w-2.5 h-2.5 bg-red-500 rounded-sm" />}
                                </div>
                                <span className={`text-sm transition-colors ${isActive ? 'text-stone-200' : 'text-stone-500 group-hover:text-stone-400'}`}>
                                    {disc}
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isActive}
                                    onChange={() => toggleDiscipline(disc)}
                                />
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Levels Section */}
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
        </div>
    );
}
