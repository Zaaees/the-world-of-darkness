import { useEffect, useMemo, useRef, useState } from 'react';
import { API_URL } from '../../config';
import { apiFetch } from '../api';
import { definitions, getContentState, updateContentState, useSiteContent } from './store';

function sectionLabel(definition) {
  const file = definition.source.split('/').pop().replace(/\.(jsx?|json|py)$/, '');
  const labels = {
    RulesTab: 'Règlement', SheetPage: 'Accueil et fiche', CharacterSheet: 'Fiche de personnage',
    GmDashboard: 'Tableau de bord MJ', disciplines: 'Disciplines et pouvoirs', rituals: 'Rituels',
    clanDescriptions: 'Clans', blood_actions: 'Actions de Vitae', ghoul_disciplines: 'Pouvoirs des goules',
    starter_pack_data: 'Questions de création', werewolf_data: 'Origines et tribus', gifts_data: 'Dons',
    originQuestions: 'Questions de création', translations: 'Libellés', api_auth: 'Connexion',
    api_server: 'Messages du serveur', NoRolePage: 'Accès au site',
  };
  const module = { vampire: 'Vampire', werewolf: 'Loup-Garou', common: 'Site' }[definition.scope];
  return `${module} · ${labels[file] || file.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Tab|Page|Component/g, '').trim()}`;
}

function TextField({ contentKey, onPendingChange }) {
  const { identity, values } = useSiteContent();
  const definition = definitions[contentKey];
  const initial = values[contentKey] || { value: definition.default, revision: 0 };
  const [value, setValue] = useState(initial.value);
  const [status, setStatus] = useState('Enregistré');
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);
  const current = useRef({ value: initial.value, saved: initial.value, revision: initial.revision, busy: false, mounted: true, blocked: false });

  useEffect(() => { const state = current.current; state.mounted = true; return () => { state.mounted = false; }; }, []);
  useEffect(() => {
    const entry = values[contentKey];
    const state = current.current;
    if (entry && entry.revision > state.revision && state.value === state.saved && !state.busy) {
      Object.assign(state, { value: entry.value, saved: entry.value, revision: entry.revision });
      setValue(entry.value);
    }
  }, [values, contentKey]);
  useEffect(() => {
    const state = current.current;
    state.value = value;
    const pending = value !== state.saved;
    onPendingChange(pending || state.busy);
    if (!pending || state.blocked) return;
    const timer = setTimeout(async () => {
      if (state.busy) return;
      state.busy = true;
      setStatus('Enregistrement…');
      const submitted = state.value;
      try {
        const response = await apiFetch(`${API_URL}/api/gm/content/entries/${encodeURIComponent(contentKey)}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Discord-User-ID': identity.userId, 'X-Discord-Guild-ID': identity.guildId },
          body: JSON.stringify({ value: submitted, revision: state.revision }),
        });
        const result = await response.json();
        if (!response.ok) {
          const failure = new Error(result.error || 'Enregistrement impossible.');
          failure.conflict = response.status === 409;
          failure.current = result;
          throw failure;
        }
        state.saved = result.value;
        state.revision = result.revision;
        if (getContentState().identity === identity) {
          updateContentState({ values: { ...getContentState().values, [contentKey]: result } });
        }
        if (state.mounted) { setError(null); setStatus(state.value === state.saved ? 'Enregistré' : 'Enregistrement en attente…'); }
      } catch (failure) {
        state.blocked = true;
        if (state.mounted) { setError(failure); setStatus('Non enregistré'); }
      } finally {
        state.busy = false;
        if (state.mounted) { onPendingChange(state.value !== state.saved); setRetry(number => number + 1); }
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [value, retry, contentKey, identity, onPendingChange]);

  function reloadConflict() {
    const entry = error.current;
    Object.assign(current.current, { value: entry.value, saved: entry.value, revision: entry.revision, blocked: false });
    updateContentState({ values: { ...getContentState().values, [contentKey]: { value: entry.value, revision: entry.revision } } });
    setValue(entry.value); setError(null); setStatus('Enregistré'); onPendingChange(false);
  }
  function discardUnsaved() {
    const entry = getContentState().values[contentKey] || { value: definition.default, revision: 0 };
    Object.assign(current.current, { value: entry.value, saved: entry.value, revision: entry.revision, blocked: false });
    setValue(entry.value); setError(null); setStatus('Enregistré'); onPendingChange(false);
  }
  return <div className="space-y-3">
    <p className="text-xs text-stone-400">{sectionLabel(definition)}</p>
    <label htmlFor="cain-content-value" className="block font-semibold">Texte affiché sur le site</label>
    <textarea id="cain-content-value" rows={6} maxLength={definition.maxLength} value={value}
      onChange={event => { current.current.blocked = Boolean(error?.conflict); setValue(event.target.value); setStatus('Enregistrement en attente…'); }}
      className="w-full rounded border border-stone-600 bg-stone-900 p-3 text-stone-100" />
    {definition.variables?.length > 0 && <p className="text-xs text-amber-300">Variables à conserver : {definition.variables.map(name => `{${name}}`).join(', ')}</p>}
    <p role="status" className="text-sm text-amber-200">{status}</p>
    {error && <div role="alert" className="text-sm text-red-300"><p>{error.message}</p>
      {error.conflict ? <button type="button" onClick={reloadConflict} className="underline mt-2">Recharger le texte actuel (remplace ma saisie)</button>
        : <button type="button" onClick={() => { current.current.blocked = false; setRetry(number => number + 1); }} className="underline mt-2">Réessayer</button>}
      <button type="button" onClick={discardUnsaved} className="block underline mt-2">Abandonner la saisie non enregistrée</button>
    </div>}
  </div>;
}

export default function ContentEditor() {
  const { selectedKey, editableScopes, values, error } = useSiteContent();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');
  const [pending, setPending] = useState(false);
  const [activeKey, setActiveKey] = useState(selectedKey);
  const [limit, setLimit] = useState(60);
  const [collapsed, setCollapsed] = useState(false);
  const entries = useMemo(() => Object.entries(definitions).filter(([key, definition]) =>
    editableScopes.includes(definition.scope) && (scope === 'all' || scope === definition.scope) &&
    `${sectionLabel(definition)} ${definition.default} ${values[key]?.value || ''}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'))
  ), [editableScopes, query, scope, values]);

  useEffect(() => {
    // Sync an explicit page-selection event; never replace a field while its save is pending.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!pending && selectedKey && editableScopes.includes(definitions[selectedKey]?.scope)) setActiveKey(selectedKey);
  }, [selectedKey, pending, editableScopes]);
  useEffect(() => {
    if (!pending) return;
    const prevent = event => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', prevent);
    return () => window.removeEventListener('beforeunload', prevent);
  }, [pending]);
  return <aside aria-label="Éditeur CAIN" className="fixed z-[100] bottom-3 right-3 w-[min(30rem,calc(100vw-1.5rem))] max-h-[90vh] overflow-y-auto rounded-lg border border-amber-700 bg-stone-950 text-stone-100 shadow-2xl p-4 space-y-4">
    <header className="flex items-center justify-between gap-2"><h2 className="font-serif text-lg text-amber-300">CAIN · Édition des textes</h2>
      <button type="button" onClick={() => setCollapsed(!collapsed)} className="underline text-sm">{collapsed ? 'Déplier' : 'Réduire'}</button>
      <button type="button" disabled={pending} onClick={() => updateContentState({ editing: false, selectedKey: null })} className="underline text-sm disabled:opacity-40">Fermer</button>
    </header>
    {error && <p role="status" className="text-amber-200 text-sm">{error}</p>}
    {!collapsed && <>
      <p className="text-sm text-stone-400">Les changements s’enregistrent automatiquement et s’appliquent au site. Cliquez sur un texte surligné ou recherchez-le ci-dessous.</p>
      <input aria-label="Rechercher un texte" placeholder="Page, titre ou contenu…" value={query} onChange={event => { setQuery(event.target.value); setLimit(60); }} className="w-full rounded bg-stone-900 border border-stone-600 p-2" />
      <select aria-label="Module" value={scope} onChange={event => { setScope(event.target.value); setLimit(60); }} className="w-full rounded bg-stone-900 p-2">
        <option value="all">Tous les modules autorisés</option>{editableScopes.map(item => <option key={item} value={item}>{{ common: 'Site', vampire: 'Vampire', werewolf: 'Loup-Garou' }[item]}</option>)}
      </select>
      <p className="text-xs text-stone-400">{entries.length} textes · {pending ? 'Enregistrement à terminer avant de changer de texte.' : 'Enregistrement automatique activé.'}</p>
      <ul className="max-h-40 overflow-y-auto space-y-1">{entries.slice(0, limit).map(([key, definition]) => <li key={key}>
        <button type="button" disabled={pending} onClick={() => { setActiveKey(key); updateContentState({ selectedKey: key }); }}
          className={`w-full text-left text-sm p-2 rounded disabled:opacity-50 ${activeKey === key ? 'bg-amber-950' : 'bg-stone-900 hover:bg-stone-800'}`}>
          <span className="block truncate">{values[key]?.value ?? definition.default}</span><span className="block text-xs text-stone-500 truncate">{sectionLabel(definition)}</span>
        </button>
      </li>)}</ul>
      {entries.length > limit && <button type="button" onClick={() => setLimit(number => number + 60)} className="underline text-sm">Afficher davantage</button>}
      {activeKey && definitions[activeKey] && <TextField key={activeKey} contentKey={activeKey} onPendingChange={setPending} />}
    </>}
  </aside>;
}
