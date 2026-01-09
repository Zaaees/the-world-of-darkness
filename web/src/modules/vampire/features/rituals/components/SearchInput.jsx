import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useGrimoireStore } from '../stores/useGrimoireStore';

export default function SearchInput() {
    const setSearchQuery = useGrimoireStore(state => state.setSearchQuery);
    const initialQuery = useGrimoireStore(state => state.searchQuery);

    // Local state for immediate UI feedback
    const [localQuery, setLocalQuery] = useState(initialQuery);

    // Sync local state if store changes externally (e.g. reset filters)
    useEffect(() => {
        setLocalQuery(initialQuery);
    }, [initialQuery]);

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localQuery);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [localQuery, setSearchQuery]);

    const handleClear = () => {
        setLocalQuery('');
        setSearchQuery('');
    };

    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-stone-500 group-focus-within:text-red-500 transition-colors" />
            </div>

            <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Rechercher un rituel..."
                className="
                    w-full pl-9 pr-8 py-2 
                    bg-stone-950 border border-stone-800 
                    text-stone-300 placeholder-stone-600 text-sm 
                    rounded focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900/50 
                    transition-all font-serif tracking-wide
                "
            />

            {localQuery && (
                <button
                    onClick={handleClear}
                    aria-label="Effacer la recherche"
                    className="absolute inset-y-0 right-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-stone-300 transition-all duration-200"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
