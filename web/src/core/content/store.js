import { useSyncExternalStore } from 'react';
import definitions from '../../../../data/site_content.json';

let state = { values: {}, identity: null, editableScopes: [], editing: false, selectedKey: null, error: null };
const listeners = new Set();
const subscribe = listener => { listeners.add(listener); return () => listeners.delete(listener); };
export const getContentState = () => state;
export function updateContentState(update) {
  state = { ...state, ...update };
  listeners.forEach(listener => listener());
}
export const useSiteContent = () => useSyncExternalStore(subscribe, getContentState, getContentState);
export function setContentIdentity(identity) {
  if (state.identity?.userId === identity?.userId && state.identity?.guildId === identity?.guildId) return;
  updateContentState({ identity, values: {}, editableScopes: [], editing: false, selectedKey: null, error: null });
}
export function siteText(key, variables = {}) {
  const definition = definitions[key];
  const value = state.values[key]?.value ?? definition?.default ?? key;
  return value.replace(/\{(v\d+)\}/g, (match, name) => Object.hasOwn(variables, name) ? String(variables[name]) : match);
}

// Only used at explicit catalog display sites. Original game objects never change.
const catalogKeys = new Map();
for (const [key, definition] of Object.entries(definitions)) {
  if (definition.catalog) catalogKeys.set(`${definition.scope}\0${definition.default}`, key);
}
export function catalogKey(scope, value) {
  if (typeof value !== 'string') return undefined;
  return catalogKeys.get(`${scope}\0${value}`) || catalogKeys.get(`common\0${value}`);
}
export function displayText(scope, value) {
  const key = catalogKey(scope, value);
  return key ? siteText(key) : value;
}
export function openContentEditor(key = null) {
  updateContentState({ editing: true, selectedKey: key });
}
export { definitions };
