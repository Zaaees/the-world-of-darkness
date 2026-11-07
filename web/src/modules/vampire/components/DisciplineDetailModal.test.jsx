import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import DisciplineDetailModal from './DisciplineDetailModal';

afterEach(cleanup);

const majesty = { id: 'presence-5-majesty', level: 5, name: 'Majesté', bloodCost: 9, duration: 'scene', description: 'Nul n’ose agir contre toi.' };
const passive = { id: 'fortitude-1-resilience', level: 1, name: 'Résilience', bloodCost: 0, duration: 'permanent', description: 'Ton corps encaisse.' };

describe('DisciplineDetailModal activation', () => {
  it('charges the power through the server and reports the spent Vitae', async () => {
    const onUse = vi.fn().mockResolvedValue({ cost: 9, vitae: 16 });
    render(<DisciplineDetailModal power={majesty} icon="👑" onClose={() => {}} vitae={25} maxVitae={25} onUse={onUse} />);
    expect(screen.getByText('Réserve : 25 / 25')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Utiliser (9 Vitae)' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('9 Vitae versés'));
    expect(onUse).toHaveBeenCalledWith(majesty);
  });

  it('refuses to activate when the reserve cannot pay', () => {
    const onUse = vi.fn();
    render(<DisciplineDetailModal power={majesty} icon="👑" onClose={() => {}} vitae={8} maxVitae={25} onUse={onUse} />);
    const button = screen.getByRole('button', { name: 'Utiliser (9 Vitae)' });
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(onUse).not.toHaveBeenCalled();
  });

  it('shows no activation for passive powers or when no reserve is known', () => {
    const { unmount } = render(<DisciplineDetailModal power={passive} icon="🛡️" onClose={() => {}} vitae={5} maxVitae={5} onUse={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Utiliser/ })).toBeNull();
    unmount();
    render(<DisciplineDetailModal power={majesty} icon="👑" onClose={() => {}} />);
    expect(screen.queryByRole('button', { name: /Utiliser/ })).toBeNull();
    expect(screen.queryByText(/Réserve :/)).toBeNull();
  });
});
