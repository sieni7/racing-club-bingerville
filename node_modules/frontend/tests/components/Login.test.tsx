import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../src/pages/Login';
import { renderWithProviders } from '../test-utils';

describe('Login Component', () => {
  it('renders login form', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('heading', { name: /Connectez-vous/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Adresse email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
  });

  it('allows user to type', async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText(/Adresse email/i);
    const passwordInput = screen.getByPlaceholderText(/Mot de passe/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
