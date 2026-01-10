import React, { useRef, useState, useEffect } from 'react';
import { Grid } from 'react-window';
import { useShallow } from 'zustand/react/shallow';
import { useGrimoireStore } from '../stores/useGrimoireStore';
import RitualCard from './RitualCard';

/**
 * Grid layout constants for the ritual catalog
 * @constant {number} CARD_HEIGHT - Height of each ritual card in pixels
 * @constant {number} MIN_CARD_WIDTH - Minimum width for responsive column calculation
 * @constant {number} OVERSCAN_COUNT - Number of extra rows to render for smooth scrolling
 */
const CARD_HEIGHT = 140;
const MIN_CARD_WIDTH = 300;
const OVERSCAN_COUNT = 5;

/**
 * Cell component for react-window v2 Grid.
 * Receives grid positioning props (columnIndex, rowIndex, style) from react-window
 * and data props (rituals, columnCount) via cellProps.
 * 
 * @param {Object} props - Component props
 * @param {number} props.columnIndex - Column position in the grid
 * @param {number} props.rowIndex - Row position in the grid  
 * @param {Object} props.style - Positioning styles from react-window
 * @param {Array} props.rituals - Array of ritual objects to display
 * @param {number} props.columnCount - Number of columns in the grid
 * @returns {JSX.Element|null} RitualCard wrapped in styled div, or null if out of bounds
 */
const RitualCell = ({ columnIndex, rowIndex, style, rituals, columnCount }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= rituals.length) return null;

    return (
        <div style={style} className="p-2">
            <RitualCard ritual={rituals[index]} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

/**
 * RitualCatalog - Virtualized grid display of ritual cards.
 * Uses react-window Grid with cellComponent API (v2) for performant rendering.
 * The grid adapts responsively: single column on mobile, multi-column on desktop.
 * 
 * @returns {JSX.Element} The ritual catalog grid or empty state message
 */
const RitualCatalog = () => {
    // Select filtered rituals using useShallow to avoid infinite re-renders
    // (selectFilteredRituals returns a new array reference each call)
    const rituals = useGrimoireStore(useShallow(state => state.selectFilteredRituals(state)));
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

    // Grid Logic
    const columnCount = dimensions.width < 768
        ? 1
        : Math.floor(dimensions.width / MIN_CARD_WIDTH) || 1;

    const rowCount = Math.ceil(rituals.length / columnCount);
    const columnWidth = dimensions.width / columnCount;

    // Empty State Check
    if (rituals.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center text-stone-500 font-serif" data-testid="empty-state">
                <p className="text-xl italic mb-2">"Le vide..."</p>
                <p className="text-sm">Aucun rituel ne correspond à votre recherche.</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="h-full w-full bg-stone-950 p-4">
            {dimensions.width > 0 && dimensions.height > 0 && (
                <Grid
                    columnCount={columnCount}
                    columnWidth={columnWidth}
                    height={dimensions.height}
                    rowCount={rowCount}
                    rowHeight={CARD_HEIGHT}
                    width={dimensions.width}
                    overscanCount={OVERSCAN_COUNT}
                    cellComponent={RitualCell}
                    cellProps={{ rituals, columnCount }}
                />
            )}
        </div>
    );
};

export default RitualCatalog;
