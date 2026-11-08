import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import BloodBondsSection from './BloodBondsSection';
import {apiFetch} from '../../../core/api';

vi.mock('../../../core/api');

const reply = body => apiFetch.mockResolvedValue({json: async () => body});

const bond = over => ({
  id: 1, thrall_id: '10', thrall_name: 'Alice', regnant_kind: 'player', regnant_ref: '20',
  regnant_name: 'Victor', regnant_potency: 3, stage: 3, defy_cost: 2, ...over,
});

beforeEach(() => apiFetch.mockReset());

describe('Liens de sang', () => {
  it('affiche les deux sens du lien et le prix du défi au stade 3', async () => {
    reply({success: true, bound_to: [bond()], drank_from_me: [bond({id: 2, thrall_name: 'Bob', regnant_name: 'Alice', stage: 1})]});
    render(<BloodBondsSection discordUserId="10" guildId="99"/>);
    expect(await screen.findByText('Vous êtes lié à')).toBeInTheDocument();
    expect(screen.getByText('Victor')).toBeInTheDocument();
    expect(screen.getByText('Victor passe avant tout, même avant vous.')).toBeInTheDocument();
    expect(screen.getByText(/Chaque action contre Victor vous coûte 2 Vitae/)).toBeInTheDocument();
    expect(screen.getByText('Ont bu votre sang')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Stade 1')).toBeInTheDocument();
    const [, options] = apiFetch.mock.calls[0];
    expect(apiFetch.mock.calls[0][0]).toMatch(/\/api\/vampire\/bonds$/);
    expect(options.headers).toEqual({'X-Discord-User-ID': '10', 'X-Discord-Guild-ID': '99'});
  });

  it('affiche une phrase sobre sans aucun lien', async () => {
    reply({success: true, bound_to: [], drank_from_me: []});
    render(<BloodBondsSection discordUserId="10" guildId="99"/>);
    expect(await screen.findByText("Aucun lien de sang ne vous enchaîne, et nul n'a bu votre sang.")).toBeInTheDocument();
    expect(screen.queryByText('Vous êtes lié à')).not.toBeInTheDocument();
  });

  it("affiche l'erreur du serveur", async () => {
    reply({success: false, error: 'Lecture impossible'});
    render(<BloodBondsSection discordUserId="10" guildId="99"/>);
    await waitFor(() => expect(screen.getByText('Lecture impossible')).toBeInTheDocument());
  });
});
