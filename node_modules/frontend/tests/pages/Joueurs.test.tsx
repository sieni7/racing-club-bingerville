import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Joueurs from '../../src/pages/Joueurs';
import { vi } from 'vitest';

vi.mock('../../src/features/api/joueursApi', () => ({
  useGetJoueursQuery: () => ({ data: [], isLoading: false }),
  useCreateJoueurMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateJoueurMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteJoueurMutation: () => [vi.fn()]
}));

vi.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { role: 'ADMIN' }, isAuthenticated: true })
}));

describe('Joueurs Page', () => {
  it('renders players list', () => {
    renderWithProviders(<Joueurs />);
    expect(screen.getByText('Effectif')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ajouter un joueur/i })).toBeInTheDocument();
    expect(screen.getByText('Aucun joueur trouvé.')).toBeInTheDocument();
  });
});
