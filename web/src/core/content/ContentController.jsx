import { lazy, Suspense, useEffect } from 'react';
import { API_URL } from '../../config';
import { apiFetch } from '../api';
import { safeStorage } from '../auth/authUtils';
import { getContentState, updateContentState, useSiteContent, setContentIdentity } from './store';

const ContentEditor = lazy(() => import('./ContentEditor'));

export default function ContentController() {
  const { identity, editing, editableScopes } = useSiteContent();
  useEffect(() => {
    let disposed = false;
    let busy = false;
    let lastRevision = null;
    const controller = new AbortController();
    async function refresh() {
      if (disposed || busy || document.visibilityState === 'hidden') return;
      if (identity && !safeStorage.getItem('discord_token')) {
        setContentIdentity(null);
        return;
      }
      busy = true;
      try {
        const query = lastRevision === null ? '' : `?revision=${lastRevision}`;
        const response = identity
          ? await apiFetch(`${API_URL}/api/content${query}`, { signal: controller.signal, headers: {
            'X-Discord-User-ID': identity.userId, 'X-Discord-Guild-ID': identity.guildId,
          } })
          : await fetch(`${API_URL}/content/public${query}`, { signal: controller.signal });
        if (!response.ok) {
          if ([401, 403].includes(response.status) && !disposed) updateContentState({ editableScopes: [], editing: false });
          throw new Error('Actualisation des textes indisponible.');
        }
        const data = await response.json();
        if (disposed) return;
        lastRevision = data.revision;
        // A poll started before a save must never replace a newer field revision.
        const values = { ...(data.unchanged ? getContentState().values : data.values) };
        for (const [key, entry] of Object.entries(getContentState().values)) {
          if (entry.revision > (values[key]?.revision || 0)) values[key] = entry;
        }
        const previous = getContentState();
        const scopes = data.editableScopes || [];
        if (JSON.stringify(values) !== JSON.stringify(previous.values) || JSON.stringify(scopes) !== JSON.stringify(previous.editableScopes) || previous.error) {
          updateContentState({ values, editableScopes: scopes, error: null, ...(scopes.length ? {} : { editing: false }) });
        }
      } catch (error) {
        if (!disposed && error.name !== 'AbortError') updateContentState({ error: 'Textes temporairement non actualisés.' });
      } finally { busy = false; }
    }
    refresh();
    const interval = setInterval(refresh, 5000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { disposed = true; controller.abort(); clearInterval(interval); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [identity]);

  useEffect(() => {
    if (!editing) return;
    const select = event => {
      const target = event.target.closest?.('[data-site-content-key]');
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      updateContentState({ selectedKey: target.dataset.siteContentKey });
    };
    document.addEventListener('click', select, true);
    return () => document.removeEventListener('click', select, true);
  }, [editing]);

  return editing && editableScopes.length > 0
    ? <Suspense fallback={<div role="status" className="fixed bottom-4 right-4 z-[100] bg-stone-950 p-4 text-white">Ouverture de l’éditeur…</div>}><ContentEditor /></Suspense>
    : null;
}
