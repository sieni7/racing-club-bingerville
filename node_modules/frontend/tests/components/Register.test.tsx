import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Register from '../../src/pages/Register';

describe('Register Component', () => {
  it('renders register form', () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole('heading', { name: /Créer un compte/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Nom$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Prénom/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Adresse email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /S'inscrire/i })).toBeInTheDocument();
  });
});
