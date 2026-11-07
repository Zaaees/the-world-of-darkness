import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import BloodBondsAdmin from './BloodBondsAdmin';
import {apiFetch} from '../api';

vi.mock('../api');

const bond = over => ({
  id: 1, thrall_id: '10', thrall_name: 'Alice', regnant_kind: 'npc', regnant_ref: '7',
  regnant_name: 'Prince Marcus', regnant_potency: 4, stage: 2, defy_cost: 4, ...over,
});
const listing = (bonds = [bond()]) => ({
  success: true, bonds,
  vampires: [{id: '10', name: 'Alice'}, {id: '11', name: 'Bob'}],
  npcs: [{id: '7', name: 'Prince Marcus', blood_potency: 4}],
});
const user = {id: '1'};

// Réponses successives par méthode ; GET renvoie toujours la liste courante.
function serve({get = listing(), other = {success: true}} = {}) {
  apiFetch.mockImplementation(async (url, options = {}) => ({
    json: async () => ((options.method || 'GET') === 'GET' ? get : other),
  }));
}
const callsOf = method => apiFetch.mock.calls.filter(([, o]) => (o?.method || 'GET') === method);

beforeEach(() => apiFetch.mockReset());
afterEach(() => vi.restoreAllMocks());

describe('Liens de sang (CAIN)', () => {
  it('liste les liens du serveur', async () => {
    serve({get: listing([bond(), bond({id: 2, regnant_kind: 'player', regnant_name: 'Victor', stage: 3})])});
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    expect(await screen.findByText('Prince Marcus')).toBeInTheDocument();
    expect(screen.getByText('Victor')).toBeInTheDocument();
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getByText('PNJ')).toBeInTheDocument();
    expect(screen.getByText('Joueur')).toBeInTheDocument();
    expect(screen.getAllByText('Rang 4').length).toBeGreaterThan(0);
    const [url, options] = apiFetch.mock.calls[0];
    expect(url).toMatch(/\/api\/gm\/bonds$/);
    expect(options.headers).toEqual({'X-Discord-User-ID': '1', 'X-Discord-Guild-ID': '99'});
  });

  it('change un stade et efface après confirmation', async () => {
    serve();
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    await screen.findByText('Prince Marcus');
    fireEvent.change(screen.getByLabelText('Stade', {selector: '#bond-stage-1'}), {target: {value: '3'}});
    await waitFor(() => expect(callsOf('PUT')).toHaveLength(1));
    const [putUrl, putOptions] = callsOf('PUT')[0];
    expect(putUrl).toMatch(/\/api\/gm\/bonds\/1$/);
    expect(JSON.parse(putOptions.body)).toEqual({stage: 3});
    await waitFor(() => expect(callsOf('GET')).toHaveLength(2));

    fireEvent.click(screen.getByRole('button', {name: 'Effacer'}));
    expect(confirm).toHaveBeenCalledWith("Effacer ce lien ? Le récit l'a-t-il vraiment défait ?");
    await waitFor(() => expect(callsOf('DELETE')).toHaveLength(1));
    expect(callsOf('DELETE')[0][0]).toMatch(/\/api\/gm\/bonds\/1$/);
    await waitFor(() => expect(callsOf('GET')).toHaveLength(3));
  });

  it("n'efface rien si la confirmation est refusée", async () => {
    serve();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    await screen.findByText('Prince Marcus');
    fireEvent.click(screen.getByRole('button', {name: 'Effacer'}));
    expect(callsOf('DELETE')).toHaveLength(0);
  });

  it('crée un lien envers un PNJ du registre avec son rang', async () => {
    serve({get: listing([])});
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    const form = (await screen.findByText('Lier un joueur à un PNJ')).closest('form');
    fireEvent.change(within(form).getByLabelText('Vampire lié'), {target: {value: '11'}});
    fireEvent.change(within(form).getByLabelText('PNJ du registre', {selector: 'select'}), {target: {value: '7'}});
    fireEvent.change(within(form).getByLabelText('Stade'), {target: {value: '3'}});
    fireEvent.click(within(form).getByRole('button', {name: 'Créer le lien'}));
    await waitFor(() => expect(callsOf('POST')).toHaveLength(1));
    const [url, options] = callsOf('POST')[0];
    expect(url).toMatch(/\/api\/gm\/bonds$/);
    expect(JSON.parse(options.body)).toEqual({thrallId: '11', npcId: '7', stage: 3});
    await waitFor(() => expect(callsOf('GET')).toHaveLength(2));
  });

  it('crée un lien envers un nom libre avec son rang', async () => {
    serve({get: listing([])});
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    const form = (await screen.findByText('Lier un joueur à un PNJ')).closest('form');
    fireEvent.change(within(form).getByLabelText('Vampire lié'), {target: {value: '10'}});
    fireEvent.click(within(form).getByLabelText('Nom libre'));
    fireEvent.change(within(form).getByLabelText('Nom du PNJ'), {target: {value: 'Le Sombre'}});
    fireEvent.change(within(form).getByLabelText('Rang du PNJ'), {target: {value: '5'}});
    fireEvent.click(within(form).getByRole('button', {name: 'Créer le lien'}));
    await waitFor(() => expect(callsOf('POST')).toHaveLength(1));
    expect(JSON.parse(callsOf('POST')[0][1].body)).toEqual({thrallId: '10', npcName: 'Le Sombre', potency: 5, stage: 1});
  });

  it("affiche le refus d'exclusivité", async () => {
    serve({get: listing([]), other: {success: false, error: "Efface d'abord l'autre lien au stade 3."}});
    render(<BloodBondsAdmin discordUser={user} guildId="99"/>);
    const form = (await screen.findByText('Lier un joueur à un PNJ')).closest('form');
    fireEvent.change(within(form).getByLabelText('Vampire lié'), {target: {value: '10'}});
    fireEvent.change(within(form).getByLabelText('PNJ du registre', {selector: 'select'}), {target: {value: '7'}});
    fireEvent.click(within(form).getByRole('button', {name: 'Créer le lien'}));
    expect(await screen.findByText("Efface d'abord l'autre lien au stade 3.")).toBeInTheDocument();
  });
});
