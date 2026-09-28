import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import ClanSelection from '../pages/ClanSelectionPage';
import CharacterSheet from './CharacterSheet';
import SceneSubmission from './SceneSubmission';
import GhoulsTab from './GhoulsTab';

beforeEach(() => localStorage.clear());

describe('Préparation du RP', () => {
  it('conserve les origines après Retour et remontage, avec sélection clavier', () => {
    const props = {userId:'1', guildId:'2'};
    const {unmount} = render(<ClanSelection {...props}/>);
    fireEvent.keyDown(screen.getByRole('radio', {name:/Brujah/i}), {key:'Enter'});
    fireEvent.click(screen.getByRole('button', {name:/continuer/i}));
    const fields = screen.getAllByRole('textbox');
    fireEvent.change(fields[0], {target:{value:'Je cherche encore ma place.'}});
    fireEvent.click(screen.getByRole('button', {name:/retour/i}));
    fireEvent.click(screen.getByRole('button', {name:/continuer/i}));
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Je cherche encore ma place.');
    unmount();
    render(<ClanSelection {...props}/>);
    fireEvent.keyDown(screen.getByRole('radio', {name:/Brujah/i}), {key:'Enter'});
    fireEvent.click(screen.getByRole('button', {name:/continuer/i}));
    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Je cherche encore ma place.');
  });

  it('restaure un brouillon de fiche uniquement pour son personnage', () => {
    const {unmount} = render(<CharacterSheet userId="1" guildId="2" initialData={{name:'Alice', clan:'brujah'}}/>);
    fireEvent.click(screen.getByRole('button', {name:/modifier/i}));
    fireEvent.change(screen.getByLabelText('Nom et Prénom'), {target:{value:'Alice de la Nuit'}});
    unmount();
    const other = render(<CharacterSheet userId="3" guildId="2" initialData={{name:'Bob'}}/>);
    expect(screen.queryByDisplayValue('Alice de la Nuit')).not.toBeInTheDocument();
    other.unmount();
    render(<CharacterSheet userId="1" guildId="2" initialData={{name:'Alice'}}/>);
    expect(screen.getByLabelText('Nom et Prénom')).toHaveValue('Alice de la Nuit');
  });

  it('garde le formulaire de goule ouvert après un échec serveur', async () => {
    render(<GhoulsTab clan="salubri" bloodPotency={1} onUpdateGhouls={vi.fn().mockRejectedValue(new Error('Indisponible'))}/>);
    fireEvent.click(screen.getByRole('button', {name:/Nouvelle Goule/i}));
    fireEvent.change(screen.getByPlaceholderText('Marcus'), {target:{value:'Guide'}});
    fireEvent.click(screen.getByRole('button', {name:/^Créer Goule$/i}));
    await waitFor(() => expect(screen.getByText('Indisponible')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Guide')).toBeInTheDocument();
  });

  it('ouvre une demande accessible et permet de la fermer au clavier', () => {
    const close = vi.fn();
    render(<SceneSubmission action={{name:'Une épreuve'}} onClose={close} onSubmit={vi.fn()}/>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('dialog'), {key:'Escape'});
    expect(close).toHaveBeenCalledOnce();
  });
});
