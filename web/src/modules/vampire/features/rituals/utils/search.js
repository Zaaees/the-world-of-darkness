import Fuse from 'fuse.js';

// fuseInstance and configureFuse removed as they were unused/dead code

export const searchRituals = (list, query) => {
    if (!query || query.trim() === '') {
        return list;
    }

    // Configure (or update) fuse if the list changes or instance is missing
    // For static data, we might want to do this once, but since list passed in might be filtered,
    // we need to decide strategy.
    // Story Task 2 Note: "Strategy: Apply filters first (Discipline/Level) then Search the results?"
    // If we search the subsets, we need new index every time.
    // OPTIMIZATION: Create ONE index on the full list (static), search it to get IDs, then intersect with filters.
    // BUT for simplicity and <500 items, re-creating index on the fly is cheap enough roughly.
    // Let's support both: passing a list uses that list.

    // Check if we can reuse the instance?
    // If list is different than what Fuse has, we must re-create.
    // Simple approach: Always new Fuse(list) for now ensuring correctness over premature optimization.
    // 500 items is trivial for modern JS.

    // Optimization: If list is the SAME reference as before, reuse?
    // Let's keep it simple first.

    // Use the configure function if not already set or just create new here?
    // The previous architecture decision was "Runtime indexing on mount is fine".

    const options = {
        keys: ['name', 'discipline', 'description_md'],
        threshold: 0.4, // Slightly stricter to avoid garbage matches
        ignoreLocation: true
    };

    const fuse = new Fuse(list, options);
    const results = fuse.search(query);

    // Fuse returns { item, score } objects, we need just the items
    return results.map(result => result.item);
};
