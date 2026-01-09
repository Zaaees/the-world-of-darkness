import { searchRituals } from './src/modules/vampire/features/rituals/utils/search.js';

const mockList = [
    { id: 1, name: 'Thaumaturgy Ritual', discipline: 'Thaumaturgy' },
    { id: 2, name: 'Fireball', discipline: 'Pyromancy' }
];

try {
    const results = searchRituals(mockList, 'Tomaturgie');
    console.log('Results for Tomaturgie:', results.length);
    if (results.length > 0) console.log('Match:', results[0].name);

    const exact = searchRituals(mockList, 'Fire');
    console.log('Results for Fire:', exact.length);
} catch (e) {
    console.error('Error:', e);
}
