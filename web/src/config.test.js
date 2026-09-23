import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('Discord callback destination', () => {
  it.each(['localhost', '127.0.0.1', '[::1]'])('keeps %s previews on the local callback', async (hostname) => {
    vi.stubGlobal('window', { location: { hostname } });
    const { REDIRECT_URI } = await import('./config');
    expect(REDIRECT_URI).toBe('http://localhost:5173/');
  });

  it('preserves the published callback on GitHub Pages', async () => {
    vi.stubGlobal('window', { location: { hostname: 'zaaees.github.io' } });
    const { REDIRECT_URI } = await import('./config');
    expect(REDIRECT_URI).toBe('https://zaaees.github.io/the-world-of-darkness/');
  });
});
