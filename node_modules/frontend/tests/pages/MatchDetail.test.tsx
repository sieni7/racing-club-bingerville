import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/app/store';
import MatchDetail from '../../src/pages/MatchDetail';

jest.mock('../../src/features/api/matchsApi', () => ({
  useGetMatchByIdQuery: () => ({
    data: {
      _id: '1',
      adversaire: 'Stella Club',
      lieu: 'EXTERIEUR',
      date: new Date().toISOString(),
      statut: 'TERMINE',
      scoreRacing: 2,
      scoreAdversaire: 1,
      composition: [],
      evenements: [],
      saison: '2025-2026'
    },
    isLoading: false,
    isError: false
  }),
  useUpdateCompositionMutation: () => [jest.fn(), { isLoading: false }],
  useAddMatchEventMutation: () => [jest.fn(), { isLoading: false }],
}));

jest.mock('../../src/features/api/joueursApi', () => ({
  useGetJoueursQuery: () => ({ data: [], isLoading: false })
}));

jest.mock('../../src/hooks/useAuth', () => ({
  useAuth: () => ({ user: { role: 'STAFF' } })
}));

describe('MatchDetail Page', () => {
  it('renders match info correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MatchDetail />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Racing Club vs Stella Club')).toBeInTheDocument();
    expect(screen.getByText('2 - 1')).toBeInTheDocument();
    expect(screen.getByText('TERMINE')).toBeInTheDocument();
    expect(screen.getByText('Informations')).toBeInTheDocument();
    expect(screen.getByText('Composition')).toBeInTheDocument();
    expect(screen.getByText('Événements')).toBeInTheDocument();
  });
});
