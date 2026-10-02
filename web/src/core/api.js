import { API_URL } from '../config';
import { safeStorage } from './auth/authUtils';

// Keep the deadline active while consuming the response body as well.
export function fetchWithTimeout(url, options = {}) {
  const timeout = AbortSignal.timeout(20_000);
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout;
  return fetch(url, { ...options, signal });
}

// Restrict bearer credentials to our API, including when a caller uses a full URL.
export function apiFetch(url, options = {}) {
  const target = new URL(url, window.location.href);
  const base = new URL(API_URL, window.location.href);
  if (target.origin !== base.origin || !target.pathname.startsWith('/api/')) {
    throw new Error('Destination API non autorisée');
  }
  const token = safeStorage.getItem('discord_token');
  const request = (options.method || 'GET').toUpperCase() === 'GET' ? fetchWithTimeout : fetch;
  return request(url, {
    ...options,
    headers: { ...options.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}
