import catalog from '../../../data/blood_actions.json';

export const SATURATION_THRESHOLDS = { ...catalog.thresholds, 5: null };
export const BLOOD_ACTIONS = catalog.actions;
export const normalizeClan = (clan = '') => {
  const key = clan.toLowerCase().trim().replace(/[ -]/g, '_');
  return catalog.aliases[key] || key;
};
export const getClanActions = clan => BLOOD_ACTIONS.filter(action => action.clan === normalizeClan(clan));
export const getActionPoints = (action, level) => level >= 5 ? 0 : (action.scaling?.[level] ?? action.points);
export const isActionVisible = (action, level) => level >= action.minBp && level <= action.maxBp;
export const isActionCompleted = (action, completed = []) => action.category === 'unique' &&
  [action.id, ...(action.legacyCompletedIds || [])].some(id => completed.includes(id));
