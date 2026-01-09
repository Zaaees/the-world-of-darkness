import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List, FixedSizeGrid as Grid } from 'react-window';
import { useGrimoireStore } from '../stores/useGrimoireStore';
import RitualCard from './RitualCard';

const RitualCatalog = () => {
    // Select filtered rituals using the store selector
    const rituals = useGrimoireStore(state => state.selectFilteredRituals(state));
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        // Initial set
        setDimensions({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Layout configuration
    const CARD_HEIGHT = 140; // Increased for better spacing
    const MIN_CARD_WIDTH = 300;

    // Grid Logic
    const columnCount = dimensions.width < 768
        ? 1
        : Math.floor(dimensions.width / MIN_CARD_WIDTH) || 1;

    const rowCount = Math.ceil(rituals.length / columnCount);
    const columnWidth = dimensions.width / columnCount;

    // Empty State Check
    if (rituals.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center text-stone-500 font-serif">
                <p className="text-xl italic mb-2">"Le vide..."</p>
                <p className="text-sm">Aucun rituel ne correspond à votre recherche.</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-full w-full bg-stone-950 p-4">
            {dimensions.width > 0 && dimensions.height > 0 && (
                <Grid
                    columnWidth={columnWidth}
                    height={dimensions.height}
                    rowCount={rowCount}
                    rowHeight={CARD_HEIGHT}
                    width={dimensions.width}
                    overscanCount={5}
                >
                    {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * columnCount + columnIndex;
                        if (index >= rituals.length) return null;

                        return (
                            <div style={style} className="p-2">
                                <RitualCard ritual={rituals[index]} style={{ height: '100%', width: '100%' }} />
                            </div>
                        );
                    }}
                </Grid>
            )}
        </div>
    );
};

export default RitualCatalog;
