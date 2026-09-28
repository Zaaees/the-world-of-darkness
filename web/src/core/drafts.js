import { safeStorage } from './auth/authUtils';

export function readDraft(key) {
  try { return JSON.parse(safeStorage.getItem(key) || 'null'); }
  catch { return null; }
}
export function writeDraft(key, data) { safeStorage.setItem(key, JSON.stringify(data)); }
export function clearDraft(key) { safeStorage.removeItem(key); }
