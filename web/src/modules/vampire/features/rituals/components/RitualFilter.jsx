import React from 'react';
import FilterContent from './FilterContent';

/**
 * RitualFilter - Desktop sidebar filter component.
 * Uses the shared FilterContent component for consistency.
 */
export default function RitualFilter() {
    return (
        <div className="bg-stone-900 border-r border-stone-800 w-full md:w-64 flex-shrink-0 flex flex-col h-full overflow-y-auto p-4">
            <FilterContent />
        </div>
    );
}
