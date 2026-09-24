import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { Droplet } from 'lucide-react';
import { ActionButton, ActionCategory } from './BloodActions';
import { getClanActions, getActionPoints, isActionCompleted } from '../../../data/bloodActions';

afterEach(cleanup);
describe('Vitae actions', () => {
  it('keeps guidance independent from submitting and sends the displayed value', () => {
    const action = getClanActions('nosferatu')[1];
    const onSubmit = vi.fn();
    render(<ActionButton action={{ ...action, points: getActionPoints(action, 3) }} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('Pistes pour votre récit'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('+4')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Soumettre au MJ' }));
    expect(onSubmit.mock.calls[0][0].points).toBe(4);
  });
  it('shows inherited lower level actions without cooldowns and hides locked levels', () => {
    const actions = getClanActions('Hecata');
    render(<ActionCategory category={{ name: 'Clan', actions, icon: Droplet }} character={{ bloodPotency: 2 }}
      cooldowns={{ [actions[0].id]: '2099-01-01' }} onSubmitAction={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Clan' }));
    expect(screen.getAllByRole('button', { name: 'Soumettre au MJ' })).toHaveLength(2);
    expect(screen.queryByText(actions[2].name)).toBeNull();
  });
  it('keeps level five guidance readable without a submission button', () => {
    render(<ActionButton action={getClanActions('salubri')[4]} onSubmit={vi.fn()} />);
    expect(screen.getByText('Héritage')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
  it('preserves legacy one-time completion', () => {
    expect(isActionCompleted({ id: 'new', category: 'unique', legacyCompletedIds: ['old'] }, ['old'])).toBe(true);
    expect(isActionCompleted({ id: 'repeat', category: 'clan' }, ['repeat'])).toBe(false);
  });
});
