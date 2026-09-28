import { API_URL } from '../config';
import { safeStorage } from './auth/authUtils';

// Restrict bearer credentials to our API, including when a caller uses a full URL.
export function apiFetch(url, options = {}) {
  const target = new URL(url, window.location.href);
  const base = new URL(API_URL, window.location.href);
  if (target.origin !== base.origin || !target.pathname.startsWith('/api/')) {
    throw new Error('Destination API non autorisée');
  }
  const token = safeStorage.getItem('discord_token');
  return fetch(url, {
    ...options,
    headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}
