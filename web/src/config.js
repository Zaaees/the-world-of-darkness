// Centralized configuration for the application
// This ensures that the Production API URL is used correctly in build environments

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const GOOGLE_SHEETS_API = 'https://script.google.com/macros/s/AKfycbzx4Us0c5xdO6PnX6TNgDFBCx6Kf48EmuDjjh4e_ZIPB3D0F1SSdig4ZFHX8tekzML-/exec';
export const DISCORD_CLIENT_ID = '1453866706546987064';
export const REDIRECT_URI = window.location.hostname === 'localhost'
    ? 'http://localhost:5173/'
    : 'https://zaaees.github.io/the-world-of-darkness/';
