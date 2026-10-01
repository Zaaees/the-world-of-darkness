import { act, fireEvent, render, screen, cleanup } from '@testing-library/react';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import ContentEditor from './ContentEditor';
import ContentController from './ContentController';
import SiteText from './SiteText';
import ClanSelection from '../../modules/vampire/pages/ClanSelectionPage';
import StarterPackStep from '../../modules/vampire/components/StarterPackStep';
import { getOriginQuestions } from '../../data/originQuestions';
import { CLAN_DESCRIPTIONS } from '../../data/clanDescriptions';
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
  it('edits the composed origin question and refreshes it despite a saved draft snapshot', () => {
    const answers = { q1: '', q2: 'Ma réponse conservée', q3: '', questions: getOriginQuestions('brujah') };
    render(<StarterPackStep selectedClan={{ id: 'brujah' }} answers={answers} onAnswerChange={vi.fn()} />);
    const questionKey = 'vampire.text.02556';
    const element = document.querySelector(`[data-site-content-key="${questionKey}"]`);
    expect(element).not.toBeNull();
    fireEvent.click(element);
    expect(getContentState().selectedKey).toBe(questionKey);
    act(() => updateContentState({ values: {
      [questionKey]: { value: 'Comment affrontez-vous {v0} ?', revision: 1 },
      'vampire.text.00568': { value: 'la colère et ses conséquences', revision: 1 },
      'vampire.text.00586': { value: 'Racontez votre vie mortelle.', revision: 1 },
    } }));
    expect(screen.getByLabelText('Comment affrontez-vous la colère et ses conséquences ?')).toHaveValue('Ma réponse conservée');
    expect(screen.getByLabelText('Racontez votre vie mortelle.')).toBeInTheDocument();
    expect(getOriginQuestions('brujah')[1]).toBe('Comment affrontez-vous la colère et ses conséquences ?');
    expect(answers.questions[1]).toContain('une injustice et votre colère');
    act(() => updateContentState({ editing: false }));
    expect(document.querySelector('[data-site-content-key]')).toBeNull();
  });

  it('registers every clan text, including the short descriptions', () => {
    for (const clan of Object.values(CLAN_DESCRIPTIONS)) {
      for (const value of Object.values(clan)) expect(catalogKey('vampire', value)).toBeTruthy();
    }
  });

  it('selects each visible Gangrel text for editing without triggering clan selection', () => {
    const clan = CLAN_DESCRIPTIONS.gangrel;
    render(<ClanSelection userId="1" guildId="2" />);
    fireEvent.click(screen.getByRole('radio', { name: /Gangrel/i }));
    for (const field of ['name', 'title', 'shortDesc', 'quote', 'description', 'specificities', 'bane', 'baneDescription', 'roleplay']) {
      const element = document.querySelector(`[data-site-content-key="${catalogKey('vampire', clan[field])}"]`);
      expect(element, field).not.toBeNull();
      fireEvent.click(element);
      expect(getContentState().selectedKey).toBe(catalogKey('vampire', clan[field]));
    }
    expect(screen.getByRole('radio', { name: /Gangrel/i })).toHaveAttribute('aria-checked', 'true');
    const brujahTitle = document.querySelector(`[data-site-content-key="${catalogKey('vampire', CLAN_DESCRIPTIONS.brujah.name)}"]`);
    fireEvent.click(brujahTitle);
    expect(screen.getByRole('radio', { name: /Gangrel/i })).toHaveAttribute('aria-checked', 'true');
  });

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
  it('opens the editor outside the MJ dashboard and restores the launcher after closing', async () => {
    localStorage.setItem('discord_token', 'local-test-token');
    updateContentState({ editing: false, selectedKey: null });
    apiFetch.mockResolvedValue({ ok: true, json: async () => ({ values: {}, revision: 0, editableScopes: ['vampire'] }) });
    render(<ContentController />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Éditer les textes' })); });
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(screen.getByRole('button', { name: 'Éditer les textes' })).toBeInTheDocument();
  });

  it('does not offer editing to a player without editable scopes', async () => {
    localStorage.setItem('discord_token', 'local-test-token');
    updateContentState({ editing: false, editableScopes: [] });
    apiFetch.mockResolvedValue({ ok: true, json: async () => ({ values: {}, revision: 0, editableScopes: [] }) });
    render(<ContentController />);
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.queryByRole('button', { name: 'Éditer les textes' })).not.toBeInTheDocument();
  });

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
