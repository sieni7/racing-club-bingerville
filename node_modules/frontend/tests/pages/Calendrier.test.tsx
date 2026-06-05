import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../src/app/store';
import Calendrier from '../../src/pages/Calendrier';

// Mock match query
jest.mock('../../src/features/api/matchsApi', () => ({
  useGetMatchsQuery: () => ({
    data: [
      {
        _id: '1',
        adversaire: 'ASEC',
        lieu: 'DOMICILE',
        date: new Date().toISOString(),
        statut: 'PROGRAMME'
      }
    ],
    isLoading: false,
  }),
}));

describe('Calendrier Page', () => {
  it('renders calendar correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Calendrier />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Calendrier des Matchs')).toBeInTheDocument();
    expect(screen.getByText('Programmer un match')).toBeInTheDocument();
    
    // Check if the mock event is rendered (react-big-calendar renders the title)
    expect(screen.getByText(/vs ASEC/i)).toBeInTheDocument();
  });
});
