// Centralized configuration for the application
// This ensures that the Production API URL is used correctly in build environments

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec';
export const DISCORD_CLIENT_ID = '1453866706546987064';
// Use the existing local Discord callback for both Vite loopback addresses.
// Otherwise a preview opened on 127.0.0.1 returns to the published site.
const isLocalPreview = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
export const REDIRECT_URI = isLocalPreview
    ? 'http://localhost:5173/'
    : 'https://zaaees.github.io/the-world-of-darkness/';
