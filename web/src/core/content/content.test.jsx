import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import ContentEditor from './ContentEditor';
import ContentController from './ContentController';
import SiteText from './SiteText';
import { definitions, siteText, updateContentState, getContentState, catalogKey, displayText, setContentIdentity } from './store';
import { apiFetch } from '../api';
import { RITUALS } from '../../data/rituals';
import { searchRituals } from '../../modules/vampire/features/rituals/utils/search';

vi.mock('../api', () => ({ apiFetch: vi.fn() }));
const key = Object.keys(definitions).find(key => definitions[key].scope === 'vampire' && !definitions[key].variables.length);
const identity = { userId: '1', guildId: '2' };

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  updateContentState({ values: {}, identity, editableScopes: ['vampire'], editing: true, selectedKey: key, error: null });
});
afterEach(() => { cleanup(); localStorage.removeItem('discord_token'); vi.useRealTimers(); });
const tick = async () => act(async () => { await vi.advanceTimersByTimeAsync(650); });

describe('direct CAIN editor', () => {
  it('automatically saves to the API and updates a mounted reader without a publication step', async () => {
    apiFetch.mockResolvedValue({ ok: true, json: async () => ({ value: 'Le nouveau texte', revision: 1 }) });
    render(<><ContentEditor /><SiteText contentKey={key} /></>);
    fireEvent.change(screen.getByLabelText('Texte affiché sur le site'), { target: { value: 'Le nouveau texte' } });
    expect(apiFetch).not.toHaveBeenCalled();
    await tick();
    expect(JSON.parse(apiFetch.mock.calls[0][1].body)).toEqual({ value: 'Le nouveau texte', revision: 0 });
    expect(siteText(key)).toBe('Le nouveau texte');
    expect(screen.getAllByText('Le nouveau texte').length).toBeGreaterThan(0);
    expect(screen.getByRole('status')).toHaveTextContent('Enregistré');
    expect(screen.queryByRole('button', { name: /publier/i })).not.toBeInTheDocument();
  });

  it('serializes edits during a slow request and saves the latest value with the new revision', async () => {
    let finish;
    apiFetch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    apiFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ value: 'Deuxième saisie', revision: 2 }) });
    render(<ContentEditor />);
    fireEvent.change(screen.getByLabelText('Texte affiché sur le site'), { target: { value: 'Première saisie' } });
    await tick();
    fireEvent.change(screen.getByLabelText('Texte affiché sur le site'), { target: { value: 'Deuxième saisie' } });
    await tick();
    expect(apiFetch).toHaveBeenCalledTimes(1);
    await act(async () => finish({ ok: true, json: async () => ({ value: 'Première saisie', revision: 1 }) }));
    await tick();
    expect(JSON.parse(apiFetch.mock.calls[1][1].body)).toEqual({ value: 'Deuxième saisie', revision: 1 });
    expect(siteText(key)).toBe('Deuxième saisie');
  });

  it('keeps unsaved input on failure and never displays it as saved', async () => {
    apiFetch.mockRejectedValue(new Error('Réseau indisponible'));
    render(<ContentEditor />);
    fireEvent.change(screen.getByLabelText('Texte affiché sur le site'), { target: { value: 'À conserver' } });
    await tick();
    expect(screen.getByRole('status')).toHaveTextContent('Non enregistré');
    expect(screen.getByLabelText('Texte affiché sur le site')).toHaveValue('À conserver');
    expect(siteText(key)).toBe(definitions[key].default);
    fireEvent.click(screen.getByText('Abandonner la saisie non enregistrée'));
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeEnabled();
  });

  it('does not retry conflicting edits until the MJ reloads the current value', async () => {
    apiFetch.mockResolvedValue({ ok: false, status: 409, json: async () => ({ error: 'Conflit', value: 'Autre MJ', revision: 3 }) });
    render(<ContentEditor />);
    fireEvent.change(screen.getByLabelText('Texte affiché sur le site'), { target: { value: 'Ma saisie' } });
    await tick(); await tick();
    expect(apiFetch).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Recharger le texte actuel (remplace ma saisie)'));
    expect(screen.getByLabelText('Texte affiché sur le site')).toHaveValue('Autre MJ');
  });
});

describe('content is display-only', () => {
  it('renames a ritual in search and display while preserving the original game object', () => {
    const ritual = RITUALS.blood_walk;
    const original = JSON.stringify(ritual);
    const nameKey = catalogKey('vampire', ritual.name);
    updateContentState({ values: { [nameKey]: { value: 'Oracle Écarlate Unique', revision: 1 } } });
    expect(displayText('vampire', ritual.name)).toBe('Oracle Écarlate Unique');
    expect(searchRituals([ritual], 'Oracle Écarlate Unique')).toEqual([ritual]);
    expect(JSON.stringify(ritual)).toBe(original);
  });

  it('preserves variables and resets texts when changing guild', () => {
    const templateKey = Object.keys(definitions).find(key => definitions[key].variables.includes('v0'));
    updateContentState({ values: { [templateKey]: { value: 'Valeur : {v0}', revision: 1 } } });
    expect(siteText(templateKey, { v0: 42 })).toBe('Valeur : 42');
    setContentIdentity({ userId: '1', guildId: '3' });
    expect(getContentState().values).toEqual({});
    expect(getContentState().editing).toBe(false);
  });

  it('renders malicious text as text, never executable HTML', () => {
    updateContentState({ editing: false, values: { [key]: { value: '<img src=x onerror=alert(1)>', revision: 1 } } });
    const { container } = render(<SiteText contentKey={key} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container).toHaveTextContent('<img src=x onerror=alert(1)>');
  });
});

describe('shared reader synchronization', () => {
  it('polls by revision and keeps a saved edit when an older response arrives', async () => {
    localStorage.setItem('discord_token', 'local-test-token');
    updateContentState({ editing: false });
    apiFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ values: { [key]: { value: 'Ancien', revision: 1 } }, revision: 1, editableScopes: ['vampire'] }) });
    apiFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ unchanged: true, revision: 1, editableScopes: ['vampire'] }) });
    render(<ContentController />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    act(() => updateContentState({ values: { [key]: { value: 'Nouvelle saisie', revision: 2 } } }));
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(apiFetch.mock.calls[1][0]).toContain('?revision=1');
    expect(siteText(key)).toBe('Nouvelle saisie');
  });

  it('discards the response of a previous Discord server after switching', async () => {
    localStorage.setItem('discord_token', 'local-test-token');
    updateContentState({ editing: false });
    let finish;
    apiFetch.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    apiFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ values: {}, revision: 0, editableScopes: [] }) });
    render(<ContentController />);
    act(() => setContentIdentity({ userId: '1', guildId: '3' }));
    await act(async () => { finish({ ok: true, json: async () => ({ values: { [key]: { value: 'Ancien serveur', revision: 9 } }, revision: 9, editableScopes: ['vampire'] }) }); });
    expect(getContentState().identity.guildId).toBe('3');
    expect(getContentState().values).toEqual({});
    expect(getContentState().editableScopes).toEqual([]);
  });
});
