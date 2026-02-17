/**
 * Utility functions for handling OAuth token extraction and validation.
 * These are pure functions to ensure testability.
 */

/**
 * Extracts authentication data from the URL hash.
 * @param {string} hashString - The window.location.hash string
 * @returns {Object|null} - { token, expiresIn } or null if not found
 */
export const extractAuthData = (hashString) => {
  if (!hashString) return null;

  // Remove the leading '#' if present
  const hash = hashString.startsWith('#') ? hashString.slice(1) : hashString;
  const params = new URLSearchParams(hash);

  const token = params.get('access_token');
  const expiresIn = params.get('expires_in');

  if (!token) return null;

  return {
    token,
    expiresIn: expiresIn ? parseInt(expiresIn, 10) : null
  };
};

/**
 * Validates a JWT token format.
 * Checks if the token has 3 parts separated by dots.
 * This is a basic structural check, not a cryptographic verification.
 * @param {string} token - The JWT token to validate
 * @returns {boolean} - True if valid format, false otherwise
 */
export const validateToken = (token) => {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Clears authentication parameters from the URL without refreshing the page.
 * preserving other query parameters or hash parts if needed (though typically OAuth is the only hash).
 * @param {History} history - The window.history object
 * @param {Location} location - The window.location object
 */
export const clearAuthParams = (history, location) => {
  if (!history || !location) return;

  // specific cleanup for OAuth redirection to ensure clean URL
  // We want to remove the hash entirely if it contains access_token
  if (location.hash && location.hash.includes('access_token')) {
    const hashContent = location.hash.startsWith('#') ? location.hash.substring(1) : location.hash;
    const params = new URLSearchParams(hashContent);

    // Remove standard Discord OAuth2 parameters
    params.delete('access_token');
    params.delete('token_type');
    params.delete('expires_in');
    params.delete('scope');
    params.delete('state');

    const newHash = params.toString();
    const newUrl = location.pathname + location.search + (newHash ? '#' + newHash : '');

    history.replaceState(null, '', newUrl);
  }
};

/**
 * Safe wrapper for localStorage to prevent crashes in private mode or if disabled.
 */
export const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access failed:', e);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage remove failed:', e);
    }
  }
};
