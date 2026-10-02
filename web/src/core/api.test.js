import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithTimeout } from './api';

afterEach(() => vi.restoreAllMocks());

describe('read request deadlines', () => {
  it('aborts a stalled request after the deadline', async () => {
    const deadline = new AbortController();
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(deadline.signal);
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    }));
    const request = fetchWithTimeout('https://discord.com/api/users/@me');
    const rejected = expect(request).rejects.toMatchObject({ name: 'TimeoutError' });
    deadline.abort(new DOMException('Deadline exceeded', 'TimeoutError'));
    await rejected;
    expect(timeout).toHaveBeenCalledWith(20_000);
  });

  it('preserves caller cancellation and keeps the deadline active for the body', async () => {
    const caller = new AbortController();
    const deadline = new AbortController();
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(deadline.signal);
    let requestSignal;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, { signal }) => {
      requestSignal = signal;
      return { json: () => new Promise((_resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason), { once: true });
      }) };
    });
    const response = await fetchWithTimeout('/api/guild', { signal: caller.signal });
    const body = response.json();
    const rejected = expect(body).rejects.toMatchObject({ name: 'AbortError' });
    caller.abort();
    await rejected;
    expect(requestSignal.aborted).toBe(true);
    expect(deadline.signal.aborted).toBe(false);
  });
});
